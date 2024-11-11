import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARCreditsReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCreditsReportPage"
import { users } from "../../../../../../helpers/TestData/users/users"


describe("C2078 GUIA-Story - NLE-2774 - Update Credits Report to Include Credits from Historic Enrollments ",() =>{

    beforeEach("Login as an admin and visit Credits Report Page", function () {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Credits'))
        cy.intercept('/api/rest/v2/admin/reports/credits/operations').as('getCredits').wait('@getCredits')
    })

    it('Verify that Credits report displays both active and historic enrollment credits', () => {
        cy.get(ARCreditsReportPage.getGridTable()).each( (row, index) => {
            // Report shows all active and historic enrollmenets (active = Yes OR No), , the 7th column (0-based index)
            cy.get(ARDashboardPage.getA5TableCellRecordByColumn(9)).contains(new RegExp('Yes|No'))
            // Credit values are displayed by default for all enrollments, the 7th column (0-based index)
            cy.get(ARDashboardPage.getA5TableCellRecordByColumn(6)).should('not.be.empty')
        })
    })

    it('Verify that the report can be filtered to show credits from active enrollments', () => {
        cy.get(ARDashboardPage.getElementByDataNameAttribute('data-filter-item')).should('not.exist')

        //Verify that the report can be filtered to show credits from active enrollments
        ARCreditsReportPage.addRadioFilter('Active Enrollment', 'Yes')
        cy.intercept('/api/rest/v2/admin/reports/credits/operations').as('getCredits').wait('@getCredits')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('name')).should('contain', 'Active Enrollment')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', 'Yes')
        cy.get(ARDashboardPage.getRemoveFilterBtn()).click()
        ARCreditsReportPage.getMediumWait()    

        // Assert that after filtering the Active course, only the active courses are displayed
        cy.get(ARCreditsReportPage.getGridTable()).each( (row, index) => {
            cy.get(ARDashboardPage.getA5TableCellRecordByColumn(9)).contains('Yes')
        })
    })

    it('Verify that the report can be filtered to show credits from active enrollments', () => {
        cy.get(ARDashboardPage.getElementByDataNameAttribute('data-filter-item')).should('not.exist')

        //Verify that the report can be filtered to show credits from active enrollments
        ARCreditsReportPage.addRadioFilter('Active Enrollment', 'No')
        cy.intercept('/api/rest/v2/admin/reports/credits/operations').as('getCredits').wait('@getCredits')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('name')).should('contain', 'Active Enrollment')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('value')).should('contain', 'No')
        cy.get(ARDashboardPage.getRemoveFilterBtn()).click()
        ARCreditsReportPage.getMediumWait()    

        // Assert that after filtering the Active course, only the active courses are displayed
        cy.get(ARCreditsReportPage.getGridTable()).each( (row, index) => {
            cy.get(ARDashboardPage.getA5TableCellRecordByColumn(9)).contains('No')
        })
    })

})