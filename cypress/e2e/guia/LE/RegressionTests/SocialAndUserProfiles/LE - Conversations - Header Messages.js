import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEConversationsModal from '../../../../../../helpers/LE/pageObjects/Modals/LEConversations.modal'
import LEMessagesMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEMessagesMenu'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { conversations, socialUsers } from '../../../../../../helpers/TestData/users/social'

let numUsers = 2;

describe('LE - Conversations - Header Messages', function(){

    before(function() {
        cy.createUser(void 0, socialUsers.username, ["Learner"], void 0)
        cy.apiLoginWithSession(socialUsers.username, userDetails.validPassword) 
            cy.get(LEDashboardPage.getNavProfile()).click()  
            cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
            cy.url().then((currentURL) => {
                userDetails.userID = currentURL.slice(-36);
            })
    })

    after(function() {
         //Cleanup - Delete Learner 1 and All other Users
         cy.deleteMultipleUsers(socialUsers.username, numUsers+1)
    })

    it('Verify Header Message Icon When Message Received', () => { 
        //Create 2 Learners and Send Message to Original Learner
        for (let i = 0; i < numUsers; i++) {
            cy.createUser(void 0, `${socialUsers.username}${i}`, ["Learner"], void 0)
            LEConversationsModal.sendMessageViaAPI(`${socialUsers.username}${i}`, userDetails.validPassword, conversations.messageFromLearner, userDetails.userID)

            //Verify New Message Notification is Displayed
            cy.get(LEDashboardPage.getNavNewMessagesIcon()).should('be.visible')
        }

        //Verify Conversation Section is Expanded By Default When Messages Icon is Clicked
        cy.get(LEDashboardPage.getNavMessages()).click()
        cy.get(LEMessagesMenu.getConversationsExpandedSection()).should('be.visible')

        //Verify Pill Displays Number of New Messages in Header
        cy.get(LEDashboardPage.getNavMessagesCount()).should('contain', '2')

        //Dismiss 1 Message and Verify Pill Displays Correct Number of New Messages in Header
        cy.get(LEMessagesMenu.getConversationsExpandedSection()).find(LEMessagesMenu.getDismissMessageBtn()).eq(1).click()
        cy.get(LEDashboardPage.getNavMessagesCount()).should('contain', '1')
    })
})