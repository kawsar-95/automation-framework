import DefaultTestData from '../../../../../fixtures/defaultTestData.json'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LELoginPage from '../../../../../../helpers/LE/pageObjects/Auth/LELoginPage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import LEMembersCollaborationModal from '../../../../../../helpers/LE/pageObjects/Modals/LEMembersCollaboration.modal'
import LESocialProfilePage from '../../../../../../helpers/LE/pageObjects/User/LESocialProfilePage'
import LEConversationsModal from '../../../../../../helpers/LE/pageObjects/Modals/LEConversations.modal'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { conversations } from '../../../../../../helpers/TestData/users/social'
import { collaborationNames } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'

let userNames = [userDetails.username, userDetails.username2];
let links = ['courses', 'catalog', 'profile'];

describe('LE - Conversations - Deeplink', function(){

    before(function() {
        cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible

        //Create 2 new users, Change Learner's First names, send message to learner 1
        for (let i = 0; i < userNames.length; i++) {
            cy.createUser(void 0, userNames[i], ["Learner"], void 0)
            cy.apiLoginWithSession(userNames[i], DefaultTestData.USER_PASSWORD) 
            cy.get(LEDashboardPage.getNavProfile(),{timeout:10000}).click()  
            cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
            cy.url().then((currentURL) => {
                userDetails.userIDs.push(currentURL.slice(-36)); //Save userID
                cy.editUser(currentURL.slice(-36), userNames[i], userNames[i], DefaultTestData.USER_LEARNER_LNAME);
            })
            //Send message from learner 2 to learner 1
            if(userNames[i] != userDetails.username) {
                //Initiate message from collaboration
                cy.visit('/#/dashboard')
                LEDashboardPage.getTileByNameThenClick('Collaborations')
                cy.get(LECollaborationsActivityPage.getCollaborationsList(),{timeout:10000}).contains(collaborationNames.A_COLLABORATION_NAME).click()
                cy.get(LECollaborationsActivityPage.getElementByAriaLabelAttribute(LECollaborationPage.getViewAllMembersBtn())).click()
                cy.get(LECollaborationPage.getElementByDataNameAttribute(LEMembersCollaborationModal.getMemberSearch()))
                    .type(userNames[0] + ' ' + DefaultTestData.USER_LEARNER_LNAME)
                cy.get(LEMembersCollaborationModal.getMemberName(), {timeout:10000}).should('contain', userNames[0])
                cy.get(LEMembersCollaborationModal.getViewProfileBtn()).click()
                cy.get(LESocialProfilePage.getSocialProfileSendMessageBtn()).click()
                cy.get(LEConversationsModal.getMessageTxtF()).click({multiple:true}).type(conversations.messageFromLearner2)
                cy.get(LEConversationsModal.getMessageSendBtn()).click()
                cy.get(LEConversationsModal.getModalCloseBtn(),{timeout:10000}).click()
                cy.logoutLearner()
            }
        }
    })

    after(function() {
        //Cleanup - Delete All users
        for (let i = 0; i < userDetails.userIDs.length; i++) {
            cy.deleteUser(userDetails.userIDs[i])
        }
    })

    it('Verify Deeplink Requires Login and Opens Conversation Modal', () => {
        //Navigate to LMS from deeplink and login
        cy.visit(`/#/conversation?userid=${userDetails.userIDs[1]}`)
        cy.get(LELoginPage.getUsernameTxtF()).type(userDetails.username)
        cy.get(LELoginPage.getPasswordTxtF()).type(DefaultTestData.USER_PASSWORD)
        cy.get(LELoginPage.getLoginBtn()).click()

        //Verify Conversation modal is displayed
        cy.get(LEConversationsModal.getModalHeader(), {timeout:10000}).should('contain', `Conversation with ${userDetails.username2} ${DefaultTestData.USER_LEARNER_LNAME}`)
        //Verify Message Received displays the other Learners Avatar, Name, Date
        cy.get(LEConversationsModal.getMessageContent()).contains(conversations.messageFromLearner2).parents(LEConversationsModal.getMessageContainer())
            .within(() => {
                cy.get(LEConversationsModal.getMessageAvatar()).should('exist')
                cy.get(LEConversationsModal.getMessageAuthor()).should('contain', `${userDetails.username2} ${DefaultTestData.USER_LEARNER_LNAME}`)
                cy.get(LEConversationsModal.getMessageDate()).should('exist')
            })
        
        //Verify Conversation Modal is Closed if Page is reloaded.
        cy.reload()
        cy.get(LEConversationsModal.getModalHeader(),{timeout:10000}).should('not.exist')
    })

    it('Verify Deeplink Opens Conversation Modal from Various Pages', () => {
        //Login through dashboard
        cy.apiLoginWithSession(userDetails.username, DefaultTestData.USER_PASSWORD)

        //Visit various pages and verify conversation modal can be opened from those pages via deeplink
        for (let i = 0; i <= links.length; i++) {
            cy.visit(`/#/${links[i]}`)
            cy.get(LEDashboardPage.getNavMenu(),{timeout:15000}).should('be.visible')
            cy.visit(`/#/conversation?userid=${userDetails.userIDs[1]}`)
            cy.get(LEDashboardPage.getNavMenu(),{timeout:15000}).should('be.visible')
            //Verify Conversation modal is displayed
            cy.get(LEConversationsModal.getModalHeader()).should('contain', `Conversation with ${userDetails.username2} ${DefaultTestData.USER_LEARNER_LNAME}`)
            cy.get(LEConversationsModal.getModalCloseBtn()).click()
        }
    })

    it('Verify Errors if Deeplink is Changed', () => {
        //Login through dashboard
        cy.apiLoginWithSession(userDetails.username, DefaultTestData.USER_PASSWORD)
        cy.get(LEDashboardPage.getNavMenu(),{timeout:15000}).should('be.visible')
        //Verify Modal Error if UserID is changed
        cy.visit(`/#/conversation?userid=${userDetails.userIDs[1]}a`)
        cy.get(LEDashboardPage.getNavMenu(),{timeout:15000}).should('be.visible')
        cy.get(LEConversationsModal.getModalHeader()).should('contain', `Conversation with Learner Unavailable`)
        cy.get(LEConversationsModal.getModalCloseBtn()).click()

        //Verify Page not Found Error if URL is changed
        cy.visit(`/#/conversatio?userid=${userDetails.userIDs[1]}`)
        LEDashboardPage.getPageNotFoundMsg()
    })
})