import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import LEMembersCollaborationModal from '../../../../../../helpers/LE/pageObjects/Modals/LEMembersCollaboration.modal'
import LESocialProfilePage from '../../../../../../helpers/LE/pageObjects/User/LESocialProfilePage'
import LEConversationsModal from '../../../../../../helpers/LE/pageObjects/Modals/LEConversations.modal'
import LEMessagesPage from '../../../../../../helpers/LE/pageObjects/User/LEMessagesPage'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { conversations } from '../../../../../../helpers/TestData/users/social'
import { collaborationNames } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'

let userNames = [userDetails.username, userDetails.username2, userDetails.username3];
let messages = [conversations.messageFromLearner2, conversations.messageFromLearner3];

describe('LE - Conversations - Inbox and Mark as Read', function(){

    before(function() {
        cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible

        //Create 3 new users, Change All Learner's First names, send message to learner 1
        for (let i = 0; i < userNames.length; i++) {
            cy.createUser(void 0, userNames[i], ["Learner"], void 0)
            cy.apiLoginWithSession(userNames[i], userDetails.validPassword) 
            cy.get(LEDashboardPage.getNavProfile()).click()  
            cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
            cy.url().then((currentURL) => {
                userDetails.userID = currentURL.slice(-36);
                userDetails.userIDs.push(userDetails.userID); //Save userID
                cy.editUser(userDetails.userID, userNames[i], userNames[i], userDetails.lastName);
            })
            //Send message from learner 2 and 3 to learner 1
            if(userNames[i] != userDetails.username) {
                //Initiate message from collaboration
                cy.visit('/#/dashboard')
                LEDashboardPage.getTileByNameThenClick('Collaborations')
                LEDashboardPage.getShortWait()
                cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.A_COLLABORATION_NAME).click()
                cy.get(LECollaborationsActivityPage.getElementByAriaLabelAttribute(LECollaborationPage.getViewAllMembersBtn())).click()
                cy.get(LECollaborationPage.getElementByDataNameAttribute(LEMembersCollaborationModal.getMemberSearch()))
                    .type(userNames[0] + ' ' + userDetails.lastName)
                LEDashboardPage.getShortWait()
                cy.get(LEMembersCollaborationModal.getMemberName()).should('contain', userNames[0])
                cy.get(LEMembersCollaborationModal.getViewProfileBtn()).click()
                cy.get(LESocialProfilePage.getSocialProfileSendMessageBtn()).click()
                cy.get(LEConversationsModal.getMessageTxtF()).click({multiple:true}).type(messages[i-1])
                cy.get(LEConversationsModal.getMessageSendBtn()).click()
                LEDashboardPage.getVShortWait()
                cy.get(LEConversationsModal.getMessageContent()).should('contain', messages[i-1]) //Verify msg has been sent
                cy.get(LEConversationsModal.getModalCloseBtn()).click()
            }
        }
    })

    beforeEach(() => {
        //Sign in as learner 1, navigate to Profile page conversations tab
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavProfile()).click()
        LEProfilePage.getProfileTabByName('Messages')
    })

    after(function() {
        //Cleanup - Delete All users
        for (let i = 0; i < userDetails.userIDs.length; i++) {
            cy.deleteUser(userDetails.userIDs[i])
        }
    })

    it('Verify Learner can Mark Conversations as Read', () => {
        //Verify Conversations are Unread initally
        cy.get(LEMessagesPage.getReadConversationContainer()).should('not.exist')

        //Open Conversation to Mark as Read
        LEMessagesPage.getConversationByLearnerName(userDetails.username2, userDetails.lastName)
        cy.get(LEConversationsModal.getModalCloseBtn()).click()
        //Verify Conversation is now marked as read
        cy.get(LEMessagesPage.getReadConversationContainer()).its('length').should('eq', 1)
        
        //Mark second conversation as read with Mark all as Read button
        cy.get(LEMessagesPage.getMarkAllReadBtn()).click()
        LEDashboardPage.getShortWait()
        cy.get(LEMessagesPage.getReadConversationContainer()).its('length').should('eq', 2)

        //Verify Message Preview is Displayed in the Conversation Container
        cy.get(LEMessagesPage.getReadConversationContainer()).contains(conversations.messageFromLearner2).should('be.visible')
        cy.get(LEMessagesPage.getReadConversationContainer()).contains(conversations.messageFromLearner3).should('be.visible')

    })

    it('Verify Learner can Reply to Conversation', () => {  
        //Open Conversation
        LEMessagesPage.getConversationByLearnerName(userDetails.username2, userDetails.lastName)

        //Verify a Message with >2000 Chars Cannot be Sent
        cy.get(LEConversationsModal.getMessageTxtF()).click({multiple:true}).invoke('text', LEDashboardPage.getLongString(2000)).type('a')
        cy.get(LEConversationsModal.getErrorMsg()).should('contain', 'Must contain 2000 or fewer characters')
        cy.get(LEConversationsModal.getMessageSendBtn()).should('have.attr', 'aria-disabled', 'true')

        //Verify a Valid Reply Can be Sent
        cy.get(LEConversationsModal.getMessageTxtF()).click({multiple:true}).clear().type(conversations.messageFromLearner)
        cy.get(LEConversationsModal.getMessageSendBtn()).click()
        LEDashboardPage.getShortWait()

        //Verify Message Received displays the other Learners Avatar, Name, Date
        cy.get(LEConversationsModal.getMessageContent()).contains(conversations.messageFromLearner2).parents(LEConversationsModal.getMessageContainer())
            .within(() => {
                cy.get(LEConversationsModal.getMessageAvatar()).should('exist')
                cy.get(LEConversationsModal.getMessageAuthor()).should('contain', `${userDetails.username2} ${userDetails.lastName}`)
                cy.get(LEConversationsModal.getMessageDate()).should('exist')
            })

        //Verify Message Sent displays your Learners Avatar, Name, Date
        cy.get(LEConversationsModal.getMessageContent()).contains(conversations.messageFromLearner).parents(LEConversationsModal.getMessageContainer())
            .within(() => {
                cy.get(LEConversationsModal.getMessageAvatar()).should('exist')
                cy.get(LEConversationsModal.getMessageAuthor()).should('contain', `${userDetails.username} ${userDetails.lastName}`)
                cy.get(LEConversationsModal.getMessageDate()).should('exist')
            })

        //Verify Latest Message is Displayed at the bottom of the Modal
        cy.get(LEConversationsModal.getMessageList()).find('li').its('length').then(($length) => {
            cy.get(LEConversationsModal.getMessageContainer()).eq($length - 1).should('contain', conversations.messageFromLearner)
        })
    })
})