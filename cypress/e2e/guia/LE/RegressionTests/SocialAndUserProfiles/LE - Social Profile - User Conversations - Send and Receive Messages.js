import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LELeaderboardsPage from '../../../../../../helpers/LE/pageObjects/Leaderboards/LELeaderboardsPage'
import LEConversationsModal from '../../../../../../helpers/LE/pageObjects/Modals/LEConversations.modal'
import LESocialFlyoverModal from '../../../../../../helpers/LE/pageObjects/Modals/LESocialFlyover.modal'
import LEMessagesPage from '../../../../../../helpers/LE/pageObjects/User/LEMessagesPage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import A5LeaderboardsAddEditPage from '../../../../../../helpers/AR/pageObjects/Leaderboards/A5LeaderboardsAddEditPage'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { conversations } from '../../../../../../helpers/TestData/users/social'

describe('LE - Social Profile - User Conversations - Send and Receive Messages - Setup', function(){

    before(function() {
        //Create 2 new users
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.createUser(void 0, userDetails.username2, ["Learner"], void 0)

        //Change Learner1s Firstname
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword) 
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            userDetails.userID = currentURL.slice(-36);
            cy.editUser(userDetails.userID, userDetails.username, userDetails.firstNameEdited, userDetails.lastName);
        })
    })

    it('Should Allow Admin to Add Learners to a Leaderboard', () => { 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin') 
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Engage'))).click()
        ARDashboardPage.getMenuItemOptionByName('Leaderboards')    
        //Search by leaderboard name
        ARDashboardPage.A5AddFilter('Name', 'Starts With', 'GUIA - LE - Leaderboard')
        LEDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getA5TableCellRecordByColumn(2)).contains('GUIA - LE - Leaderboard').click()
        cy.wrap(ARDashboardPage.A5WaitForElementStateToChange(ARDashboardPage.getA5AddEditMenuActionsByIndex(1), 1000))
        //Edit the leaderboard
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click()
        LEDashboardPage.getVShortWait()
        //Navigate to availability and add new users to leaderboard
        cy.get(A5LeaderboardsAddEditPage.getAvailabilityTabBtn()).click()
        A5LeaderboardsAddEditPage.getAddRule('Username', 'Equals', userDetails.username, 1)
        A5LeaderboardsAddEditPage.getAddRule('Username', 'Equals', userDetails.username2, 2)
        //Save leaderboard
        cy.wrap(ARDashboardPage.A5WaitForElementStateToChange(ARDashboardPage.getA5SaveBtn(), 1000))
        cy.get(A5LeaderboardsAddEditPage.getA5SaveBtn()).click()
        LEDashboardPage.getMediumWait()
    })
})

describe('LE - Social Profile - User Conversations - Send and Receive Messages', function(){

    it('Should Allow Learner1 to Go to Leaderboard, Click Learner2, and Initiate a Conversation', () => {  
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword) 
        LEDashboardPage.getTileByNameThenClick('Leaderboards')
        LEDashboardPage.getMediumWait()
        LELeaderboardsPage.getUserSocialProfileByName(userDetails.firstName, userDetails.lastName)
        LEDashboardPage.getShortWait()
        //Initiate conversation from Learner2's social flyover
        cy.get(LESocialFlyoverModal.getSendMessageBtn()).click()
        //Need to select both txt field classes with a multi-click before typing
        cy.get(LEConversationsModal.getMessageTxtF()).click({multiple:true}).type(conversations.messageFromLearner + userDetails.username)
        cy.get(LEConversationsModal.getMessageSendBtn()).click()
        LEDashboardPage.getShortWait()
        cy.get(LEConversationsModal.getModalCloseBtn()).click()
    })

    it('Should Allow Learner2 to View Messages, View Conversation, and Reply', () => {  
        cy.apiLoginWithSession(userDetails.username2, userDetails.validPassword) 
        cy.get(LEDashboardPage.getNavProfile()).click()
        LEProfilePage.getProfileTabByName('Messages')
        //Search for conversation by sender name
        LEMessagesPage.getConversationByLearnerName(userDetails.firstNameEdited, userDetails.lastName)
        //Verify message from Learner1 was received
        LEConversationsModal.getVerifyMessageExists(conversations.messageFromLearner + userDetails.username)
        //Send message back to Learner1
        cy.get(LEConversationsModal.getMessageTxtF()).click({multiple:true}).type(conversations.messageFromLearner2 + userDetails.username2)
        cy.get(LEConversationsModal.getMessageSendBtn()).click()
        LEDashboardPage.getShortWait()
        cy.get(LEConversationsModal.getModalCloseBtn()).click()
        //Get userID for deletion later
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            userDetails.userID2 = currentURL.slice(-36);
        })  
    })

    it('Should Allow Learner1 to View Messages and View Conversation', () => {  
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword) 
        cy.get(LEDashboardPage.getNavProfile()).click()
        LEProfilePage.getProfileTabByName('Messages')
        LEMessagesPage.getConversationByLearnerName(userDetails.firstName, userDetails.lastName)
        //Verify message was received from Learner2
        LEConversationsModal.getVerifyMessageExists(conversations.messageFromLearner2 + userDetails.username2)
        cy.get(LEConversationsModal.getModalCloseBtn()).click()
    })
})

describe('LE - Social Profile - User Conversations - Send and Receive Messages - Cleanup', function(){

    before(function() {
        //Sign into admin side as sys admin, navigate to leaderboard report
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin') 
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Engage'))).click()
        ARDashboardPage.getMenuItemOptionByName('Leaderboards')
    })

    after(function() {
        cy.deleteUser(userDetails.userID);
        cy.deleteUser(userDetails.userID2);  
    })

    it('Should Allow Admin to Remove Rules from Leaderboard Availability', () => {     
        //Search by leaderboard name
        ARDashboardPage.A5AddFilter('Name', 'Starts With', 'GUIA - LE - Leaderboard')
        LEDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getA5TableCellRecordByColumn(2)).contains('GUIA - LE - Leaderboard').click()
        cy.wrap(ARDashboardPage.A5WaitForElementStateToChange(ARDashboardPage.getA5AddEditMenuActionsByIndex(1), 1000))
        //Edit the leaderboard
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click()
        LEDashboardPage.getVShortWait()
        //Navigate to availability and remove rules
        cy.get(A5LeaderboardsAddEditPage.getAvailabilityTabBtn()).click()
        cy.get(A5LeaderboardsAddEditPage.getRemoveRuleByIndexBtn()).click()
        cy.get(A5LeaderboardsAddEditPage.getRemoveRuleByIndexBtn()).click()
        //Save leaderboard
        cy.wrap(ARDashboardPage.A5WaitForElementStateToChange(ARDashboardPage.getA5SaveBtn(), 1000))
        cy.get(A5LeaderboardsAddEditPage.getA5SaveBtn()).click()
        LEDashboardPage.getMediumWait()
    })
})

