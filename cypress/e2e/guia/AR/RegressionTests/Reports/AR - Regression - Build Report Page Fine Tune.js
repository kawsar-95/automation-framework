import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARCourseActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseActivityReportPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C7607 - AUT-756 - Build report page fine tune', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })
    it('Build report page', () => {
        ARDashboardPage.getMediumWait()
        //Click on Reports
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        // Any Report
        ARDashboardPage.getMenuItemOptionByName('Learner Activity')
        ARDashboardPage.getMediumWait()
        // Click on generate file and select from drop down (excel/csv) and click on generate
        cy.get(ARDashboardPage.getGenerateReportFileBtn()).click()
        cy.get(ARCourseActivityReportPage.getGenerateReportFileFormatDDown()).click()
        //Select Excel
        cy.get(ARCourseActivityReportPage.getGenerateReportFileFormatOption()).eq(0).click({ force: true })
        cy.get(ARDashboardPage.getElementByDataNameAttribute('generate-report-button')).click()

        cy.get(ARDashboardPage.getToastNotificationMsg()).should('contain', 'Report Generation Requested.')

        LEDashboardPage.waitForLoader(ARDashboardPage.getWaitSpinner())
        // Toast message should be displayed indicating that the report was saved
        cy.get(ARDashboardPage.getToastNotificationMsg()).should('contain', 'Report Generation Successful')


        cy.get(ARDashboardPage.getElementByDataNameAttribute('confirm')).contains('Download Report').click()
    })
})