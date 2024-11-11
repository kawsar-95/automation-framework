import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESocialProfilePage from '../../../../../../helpers/LE/pageObjects/User/LESocialProfilePage'
import LELeaderboardsPage from '../../../../../../helpers/LE/pageObjects/Leaderboards/LELeaderboardsPage'
import LESocialFlyoverModal from '../../../../../../helpers/LE/pageObjects/Modals/LESocialFlyover.modal'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import A5LeaderboardsAddEditPage from '../../../../../../helpers/AR/pageObjects/Leaderboards/A5LeaderboardsAddEditPage'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../helpers/TestData/users/users'

let userNames = [userDetails.username, userDetails.username2, userDetails.username3, userDetails.username4];

describe('LE - Social Profile - Learner Viewing Another Learners Social Profile (Leaderboards) - Setup', function(){

    before(function() {
        //Create 4 new users and change each of their names
        for (let i = 0; i < 4; i++) {
            cy.createUser(void 0, userNames[i], ["Learner"], void 0)
            cy.apiLoginWithSession(userNames[i], userDetails.validPassword) 
            cy.get(LEDashboardPage.getNavProfile()).click()  
            cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
            cy.url().then((currentURL) => {
                userDetails.userID = currentURL.slice(-36);
                userDetails.userIDs.push(userDetails.userID)
                cy.editUser(userDetails.userID, userNames[i], 'Learner', i+1);
            })   
        }
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
        //Navigate to availability and add all new users to leaderboard
        cy.get(A5LeaderboardsAddEditPage.getAvailabilityTabBtn()).click()
        for (let i = 0; i < 4; i++) {
            A5LeaderboardsAddEditPage.getAddRule('Username', 'Equals', userNames[i], i+1)
        }
        //Save leaderboard
        cy.wrap(ARDashboardPage.A5WaitForElementStateToChange(ARDashboardPage.getA5SaveBtn(), 1000))
        cy.get(A5LeaderboardsAddEditPage.getA5SaveBtn()).click()
        LEDashboardPage.getMediumWait()
    })
})

describe('LE - Social Profile - Learner Viewing Another Learners Social Profile (Leaderboards)', function(){

    after(function() {
        //Cleanup - Delete Learner 1, 2, 4
        cy.deleteUser(userDetails.userIDs[0]);
        cy.deleteUser(userDetails.userIDs[1]);
        cy.deleteUser(userDetails.userIDs[3]);
    })

    it('Should Allow Learner 1 to See Learner 1, 2, and 3 on the Leaderboard and Click Their Social Profiles', () => { 
        cy.apiLoginWithSession(userNames[0], userDetails.validPassword) 
        LEDashboardPage.getTileByNameThenClick('Leaderboards')
        LEDashboardPage.getLShortWait()
        //View Learner 2's social profile
        LELeaderboardsPage.getUserSocialProfileByName('Learner', '2')
        LEDashboardPage.getShortWait()
        cy.get(LESocialFlyoverModal.getViewProfileBtn()).click()
        cy.get(LESocialProfilePage.getSocialProfileHeaderName()).should('contain', 'Learner 2')
        cy.go('back')
        //View Learner 3's social profile
        LEDashboardPage.getLShortWait()
        LELeaderboardsPage.getUserSocialProfileByName('Learner', '3')
        LEDashboardPage.getVShortWait()
        cy.get(LESocialFlyoverModal.getViewProfileBtn()).click()
        cy.get(LESocialProfilePage.getSocialProfileHeaderName()).should('contain', 'Learner 3')
        //We cannot see Learner 4 as the leaderboard will only show the top 3 Learners
    })

    it('Should Allow Admin to Set Learner 2 as Inactive and Delete Learner 3', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin') 
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
        ARDashboardPage.getMenuItemOptionByName('Users')  
        cy.intercept('**/users/operations').as('getUser').wait('@getUser')
        //Delete Learner 3
        cy.wrap(ARDashboardPage.AddFilter('Username', 'Contains', userNames[2]))
        cy.get(ARDashboardPage.getTableCellName(4)).contains(userNames[2]).click();
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Delete'), 1000))
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete')).click()
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        
        //Set Learner 2 as Inactive
        cy.wrap(ARDashboardPage.UpdateFilter(userNames[2], null, null, userNames[1])).wait('@getUser')
        cy.get(ARDashboardPage.getTableCellName(4)).contains(userNames[1]).click();
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Edit User'), 1000))
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit User')).click()
        cy.intercept('/api/rest/v2/admin/reports/departments').as('getUser').wait('@getUser')   
        LEDashboardPage.getMediumWait()
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute(ARUserAddEditPage.getIsActiveToggleContainer()) + ' ' + ARUserAddEditPage.getToggleEnabled()).click()
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn(), 1000))
        cy.get(ARDashboardPage.getSaveBtn()).click()
        LEDashboardPage.getLShortWait()
    })

    it('Should Allow Learner 1 to See and Learner 4 on the Leaderboard and Click Their Social Profile', () => { 
        cy.apiLoginWithSession(userNames[0], userDetails.validPassword) 
        LEDashboardPage.getTileByNameThenClick('Leaderboards')
        LEDashboardPage.getLShortWait()
        //View Learner 4's social profile
        LELeaderboardsPage.getUserSocialProfileByName('Learner', '4')
        LEDashboardPage.getShortWait()
        cy.get(LESocialFlyoverModal.getViewProfileBtn()).click()
        cy.get(LESocialProfilePage.getSocialProfileHeaderName()).should('contain', 'Learner 4')
    })

    it('Should Allow Admin to Remove Availability Rules From a Leaderboard', () => { 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Engage'))).click()
        ARDashboardPage.getMenuItemOptionByName('Leaderboards')   
        ARDashboardPage.A5AddFilter('Name', 'Starts With', 'GUIA - LE - Leaderboard')
        LEDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getA5TableCellRecordByColumn(2)).contains('GUIA - LE - Leaderboard').click()
        cy.wrap(ARDashboardPage.A5WaitForElementStateToChange(ARDashboardPage.getA5AddEditMenuActionsByIndex(1), 1000))
        //Edit the leaderboard
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click()
        LEDashboardPage.getVShortWait()
        //Navigate to availability and remove all rules
        cy.get(A5LeaderboardsAddEditPage.getAvailabilityTabBtn()).click()
        cy.get(A5LeaderboardsAddEditPage.getRemoveRuleByIndexBtn()).click()
        cy.get(A5LeaderboardsAddEditPage.getRemoveRuleByIndexBtn()).click()
        cy.get(A5LeaderboardsAddEditPage.getRemoveRuleByIndexBtn()).click()
        cy.get(A5LeaderboardsAddEditPage.getRemoveRuleByIndexBtn()).click()
        //Save leaderboard
        cy.wrap(ARDashboardPage.A5WaitForElementStateToChange(ARDashboardPage.getA5SaveBtn(), 1000))
        cy.get(A5LeaderboardsAddEditPage.getA5SaveBtn()).click()
        LEDashboardPage.getMediumWait()
    })
})