import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEConversationsModal from '../../../../../../helpers/LE/pageObjects/Modals/LEConversations.modal'
import LEMessagesPage from '../../../../../../helpers/LE/pageObjects/User/LEMessagesPage'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { conversations, socialUsers } from '../../../../../../helpers/TestData/users/social'

let numUsers = 25;

describe('LE - Conversations - Paginate Conversations', function(){

    before(function() {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword) 
            cy.get(LEDashboardPage.getNavProfile()).click()  
            cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
            cy.url().then((currentURL) => {
                userDetails.userID = currentURL.slice(48);
                //Create 25 Learners and Send Message to Learner 1 from each
                for (let i = 0; i < numUsers; i++) {
                    cy.createUser(void 0, `${socialUsers.username}${i}`, ["Learner"], void 0)
                    LEConversationsModal.sendMessageViaAPI(`${socialUsers.username}${i}`, userDetails.validPassword, conversations.messageFromLearner, userDetails.userID)
                }
            })
    })

    after(function() {
        //Cleanup - Delete Learner 1 and All other Users
        cy.deleteMultipleUsers(socialUsers.username, numUsers)
        cy.deleteUser(userDetails.userID)
    })

    it('Verify Conversations are Paginated', () => { 
        //Go to Inbox
        cy.get(LEDashboardPage.getNavProfile()).click()
        LEProfilePage.getProfileTabByName('Messages')

        //Verify Only 20 Conversations are Displayed
        cy.get(LEMessagesPage.getInboxContainer()).find(LEMessagesPage.getConversationContainer()).its('length').should('eq', 20)

        //Verify Load More Button is Visible, and Loads Next Conversations when Clicked
        cy.get(LEMessagesPage.getLoadMoreBtn()).contains('Load more').click()
        LEDashboardPage.getShortWait()
        cy.get(LEMessagesPage.getInboxContainer()).find(LEMessagesPage.getConversationContainer()).its('length').should('eq', numUsers)
    })
})