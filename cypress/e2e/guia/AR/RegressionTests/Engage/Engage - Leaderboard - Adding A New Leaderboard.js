import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import A5LeaderboardsAddEditPage from "../../../../../../helpers/AR/pageObjects/Leaderboards/A5LeaderboardsAddEditPage"
import ARUnsavedChangesModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal"
import { billboardsDetails } from "../../../../../../helpers/TestData/Billboard/billboardsDetails"
import { leaderboardsDetails } from "../../../../../../helpers/TestData/Leaderboard/leaderboardsDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C7409 - Adding A New Leaderboard', () => {
    beforeEach(() => {
        // Enter the username & password then click on Login button
        cy.loginAdmin(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password
        )
        // Navigate to leaderboard
        ARDashboardPage.getLeaderboardsReport()
        // Click on Add LeaderBoard option from RHS
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click()
        // Go to General section and enter LeaderBoard Name in the Name text field and Description
        cy.get(ARDashboardPage.getElementByNameAttribute('Name')).type(leaderboardsDetails.leaderboardName)
        cy.get(ARDashboardPage.getElementByNameAttribute('redactor-editor-0')).type(leaderboardsDetails.leaderboardDescription)
        cy.get(A5LeaderboardsAddEditPage.getStartDate()).click()
        // Add start and end date
        cy.get(A5LeaderboardsAddEditPage.getDatePickerDays()).within(() => {
            cy.get(ARDashboardPage.getTableDataCell()).eq('1').click()
        })
        cy.get(A5LeaderboardsAddEditPage.getEndDate()).click()

        cy.get(A5LeaderboardsAddEditPage.getDatePickerDays()).within(() => {
            cy.get(ARDashboardPage.getTableDataCell()).eq('26').click()
        })
    })

    it('Adding A New Leaderboard and Cancel', () => {
        // Click on cancel button
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).contains('Cancel').click()
        cy.get(ARUnsavedChangesModal.getBlatantUnsavedChangesTxt()).should('exist')
        cy.get(ARUnsavedChangesModal.getBtn()).contains("Don't Save").click()
        cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('contain', 'Leaderboards')
        
    })
    it('Adding A New Leaderboard and Save', () => {       
        // Navigate to availability
        cy.get(ARDashboardPage.getListItem()).contains('Availability').click()
        // Add rule
        A5LeaderboardsAddEditPage.getAddRule('First Name', 'Starts With', 'John')
        // Click on save button
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).contains('Save').click()
        cy.get(ARDashboardPage.getA5PageHeaderTitle(), {timeout:10000}).should('contain', 'Leaderboards')
    })
})