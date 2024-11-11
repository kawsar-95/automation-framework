import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import LEMembersCollaborationModal from '../../../../../../helpers/LE/pageObjects/Modals/LEMembersCollaboration.modal'
import LESocialProfilePage from '../../../../../../helpers/LE/pageObjects/User/LESocialProfilePage'
import LEConversationsModal from '../../../../../../helpers/LE/pageObjects/Modals/LEConversations.modal'
import LEMessagesPage from '../../../../../../helpers/LE/pageObjects/User/LEMessagesPage'
import LEMessagesMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEMessagesMenu'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { conversations } from '../../../../../../helpers/TestData/users/social'
import { collaborationNames } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'

let userNames = [userDetails.username, userDetails.username2, userDetails.username3];
let messages = [conversations.messageFromLearner2, conversations.messageFromLearner3];

describe('LE - Conversations - Inbox and Mark as Read', function(){
  
    before(function() {
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
                cy.get(LECollaborationPage.getLEInnerModal()).should('be.visible')
                cy.get(LECollaborationPage.getElementByDataNameAttribute(LEMembersCollaborationModal.getMemberSearch()))
                    .type(userNames[i-1] + ' ' + userDetails.lastName)
                cy.get(LECollaborationPage.getLETableRowCell()).should('be.visible').and('contain',`${userNames[i-1]}`)
                cy.get(LEMembersCollaborationModal.getViewProfileBtn()).click()
                cy.get(LESocialProfilePage.getSocialProfileSendMessageBtn()).click()
                cy.get(LEConversationsModal.getMessageTxtF()).click({multiple:true}).type(messages[i-1])
                cy.get(LEConversationsModal.getMessageSendBtn()).click()
                LEDashboardPage.getVShortWait()
                cy.get(LEConversationsModal.getMessageContent()).should('contain', messages[i-1]) //Verify msg has been sent
                cy.get(LEConversationsModal.getModalCloseBtn()).click()
            }
        }
        //Login to AR Side, Set Learner 2 as Inactive
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin') 
        arDashboardPage.getUsersReport()
        cy.wrap(arDashboardPage.AddFilter('Username', 'Contains', userDetails.username2))
        cy.get(arDashboardPage.getTableCellName(4)).contains(userDetails.username2).click();
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Edit User'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit User')).click()  
        LEDashboardPage.getMediumWait()
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute(ARUserAddEditPage.getIsActiveToggleContainer()) + ' ' + ARUserAddEditPage.getToggleEnabled()).click()
        cy.wrap(arDashboardPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn(), 1000))
        cy.get(arDashboardPage.getSaveBtn()).click()
        LEDashboardPage.getLShortWait()
        //Delete Learner 3
        cy.wrap(arDashboardPage.UpdateFilter(userDetails.username2, null, null, userDetails.username3))
        cy.get(arDashboardPage.getTableCellName(4)).contains(userDetails.username3).click();
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Delete'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Delete')).click()
        cy.get(arDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        cy.get(arDashboardPage.getToastSuccessMsg()).should('be.visible')
    })

    beforeEach(() => {
        //Sign in as learner 1, navigate to Profile page conversations tab
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavProfile()).click()
        LEProfilePage.getProfileTabByName('Messages')
    })

    after(function() {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin') 
        //Cleanup - Delete Learner 1 and 2
        arDashboardPage.deleteUsers([userDetails.username, userDetails.username2])
    })

    it('Verify Conversation with Inactive Learner', () => {
        //Verify Inactive Learner's Name is Displayed in the Header
        cy.get(LEDashboardPage.getNavMessages()).click()
        cy.get(LEMessagesMenu.getConversationLearnerName()).contains(`${userDetails.username2} ${userDetails.lastName}`).should('exist')
        
        //Verify Inactive Learner's Name is Displayed in the Conversations List
        cy.get(LEMessagesPage.getLearnername()).contains(`${userDetails.username2} ${userDetails.lastName}`).should('exist')

        //Verify Inactive Learner's Name is Displayed in the Conversation Modal
        LEMessagesPage.getConversationByLearnerName(userDetails.username2, userDetails.lastName)
        cy.get(LEConversationsModal.getMessageAuthor()).contains(`${userDetails.username2} ${userDetails.lastName}`).should('exist')

        //Verify Banner in Conversation Modal
        cy.get(LEConversationsModal.getModalErrorBanner()).should('contain', 'This learner is unable to send and receive conversation messages.')

        //Verify Message Cannot be sent to Inactive Learner
        cy.get(LEConversationsModal.getMessageTxtF()).should('have.attr', 'disabled')
    })

    it('Verify Conversation with Deleted User', () => {
        //Verify Deleted Learner's Name is Not Displayed in the Header
        cy.get(LEDashboardPage.getNavMessages()).click()
        cy.get(LEMessagesMenu.getViewAllMessagesBtn()).click()
        cy.get(LEMessagesMenu.getConversationMessagesContainer()).click()

        //Verify Banner in Conversation Modal
        cy.get(LEConversationsModal.getModalErrorBanner()).should('contain', 'This learner is unable to send and receive conversation messages.')

        //Verify Message Cannot be sent to Deleted Learner
        cy.get(LEConversationsModal.getMessageTxtF()).should('have.attr', 'disabled')
    })
})