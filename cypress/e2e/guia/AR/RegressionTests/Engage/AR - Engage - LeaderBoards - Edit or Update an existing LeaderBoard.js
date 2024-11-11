import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARCouponsAddEditPage from "../../../../../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage"
import A5LeaderboardsAddEditPage from "../../../../../../helpers/AR/pageObjects/Leaderboards/A5LeaderboardsAddEditPage"
import ARUnsavedChangesModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { leaderboardsDetails } from "../../../../../../helpers/TestData/Leaderboard/leaderboardsDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C7405 AUT-722, AR - Engage - LeaderBoards - Edit or Update an existing LeaderBoard', () => {
    before(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        // Navigate to leaderboard
        ARDashboardPage.getLeaderboardsReport()

        // Click on Add LeaderBoard option from RHS
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1), {timeout:10000}).should('contain', 'Leaderboards').click()

        cy.get(ARCouponsAddEditPage.getPageHeadertitleName(), {timeout:10000}).should('have.text', 'Add Leaderboard').and('be.visible')
        cy.get(ARCouponsAddEditPage.getGeneralTabMenu(), {timeout:10000}).should('be.visible')

        // Go to General section and enter LeaderBoard Name in the Name text field and Description
        cy.get(A5LeaderboardsAddEditPage.getNameTxtF()).type(leaderboardsDetails.leaderboardName)
        cy.get(A5LeaderboardsAddEditPage.getDescriptionTxtF()).type(leaderboardsDetails.leaderboardDescription)
        cy.get(A5LeaderboardsAddEditPage.getStartDate()).click()

        // Add start and end date
        cy.get(A5LeaderboardsAddEditPage.getDatePickerDays()).within(() => {
            cy.get(ARDashboardPage.getTableDataCell()).eq('1').click()
        })
        cy.get(A5LeaderboardsAddEditPage.getEndDate()).click()

        cy.get(A5LeaderboardsAddEditPage.getDatePickerDays()).within(() => {
            cy.get(ARDashboardPage.getTableDataCell()).eq('26').click()
        })

        // Navigate to availability
        cy.get(ARDashboardPage.getListItem()).contains('Availability').click()

        // Add rule
        A5LeaderboardsAddEditPage.getAddRule('First Name', 'Starts With', 'John')

        // Click on save button
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).contains('Save').click()
        cy.get(ARCouponsAddEditPage.getA5PageHeaderTitle(), {timeout:10000}).should('have.text', 'Leaderboards')
    })

    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        // Navigate to leaderboard
        ARDashboardPage.getLeaderboardsReport()

        // Select existing LeaderBoard
        ARDashboardPage.A5AddFilter('Name', 'Equals', leaderboardsDetails.leaderboardName)
        ARDashboardPage.selectA5TableCellRecord(leaderboardsDetails.leaderboardName)

        // Click on Edit button from right panel
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1), {timeout:10000}).should('contain', 'Edit Leaderboard').click()

        cy.get(ARCouponsAddEditPage.getPageHeadertitleName(), {timeout:10000}).should('have.text', 'Edit Leaderboard').and('be.visible')
        cy.get(ARCouponsAddEditPage.getGeneralTabMenu(), {timeout:10000}).should('be.visible')
    })

    it("Edit Leaderboard and Don't Save", () => {
        // Change or update Name/Description/Start date/ End Date
        cy.get(A5LeaderboardsAddEditPage.getNameTxtF()).should('have.value', leaderboardsDetails.leaderboardName)
        cy.get(A5LeaderboardsAddEditPage.getNameTxtF()).type(commonDetails.appendText)

        cy.get(A5LeaderboardsAddEditPage.getDescriptionTxtF()).type(commonDetails.appendText)

        // Add start and end date
        cy.get(A5LeaderboardsAddEditPage.getStartDate()).click()
        cy.get(A5LeaderboardsAddEditPage.getDatePickerDays()).within(() => {
            cy.get(ARDashboardPage.getTableDataCell()).eq('5').click()
        })

        cy.get(A5LeaderboardsAddEditPage.getEndDate()).click()
        cy.get(A5LeaderboardsAddEditPage.getDatePickerDays()).within(() => {
            cy.get(ARDashboardPage.getTableDataCell()).eq('23').click()
        })

        // Click on cancel button
        ARDashboardPage.getA5AddEditMenuActionsByNameThenClick('Cancel')

        // Click Cancel on Unsaved Changes Modal
        cy.get(ARUnsavedChangesModal.getUnsavedModalContainer() + " " + ARUnsavedChangesModal.getModalCancelBtn(), {timeout:10000}).should('be.visible').click()

        // Verify User on edit leaderboard page
        cy.get(A5LeaderboardsAddEditPage.getA5EditPageHeadertitle()).should('contain', 'Edit Leaderboard')

        // Again Click on cancel button
        ARDashboardPage.getA5AddEditMenuActionsByNameThenClick('Cancel')

        // Click Don't Save on Unsaved Changes Modal
        cy.get(ARUnsavedChangesModal.getUnsavedModalContainer() + " " + ARUnsavedChangesModal.getDontSaveBtn(), {timeout:10000}).should('be.visible').click()

        // Verify user will redirected to LeaderBoard list page
        cy.get(ARDashboardPage.getA5PageHeaderTitle(), {timeout:10000}).should('contain', 'Leaderboards')
    })

    it("Edit Leaderboard and Save", () => {
        // Change or update Name/Description/Start date/ End Date
        cy.get(A5LeaderboardsAddEditPage.getNameTxtF()).should('have.value', leaderboardsDetails.leaderboardName)
        cy.get(A5LeaderboardsAddEditPage.getNameTxtF()).type(commonDetails.appendText)

        cy.get(A5LeaderboardsAddEditPage.getDescriptionTxtF()).type(commonDetails.appendText)

        // Add start and end date
        cy.get(A5LeaderboardsAddEditPage.getStartDate()).click()
        cy.get(A5LeaderboardsAddEditPage.getDatePickerDays()).within(() => {
            cy.get(ARDashboardPage.getTableDataCell()).eq('5').click()
        })

        cy.get(A5LeaderboardsAddEditPage.getEndDate()).click()
        cy.get(A5LeaderboardsAddEditPage.getDatePickerDays()).within(() => {
            cy.get(ARDashboardPage.getTableDataCell()).eq('23').click()
        })

        // Click on cancel button
        ARDashboardPage.getA5AddEditMenuActionsByNameThenClick('Cancel')

        // Click Save on Unsaved Changes Modal
        cy.get(ARUnsavedChangesModal.getSaveBtn(), {timeout:10000}).should('be.visible').click()

        // Verify user will redirected to LeaderBoard list page
        cy.get(ARDashboardPage.getA5PageHeaderTitle(), {timeout:10000}).should('contain', 'Leaderboards')
    })
})