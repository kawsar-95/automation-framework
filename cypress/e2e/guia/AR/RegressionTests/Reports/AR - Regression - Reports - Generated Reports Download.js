import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARCourseActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseActivityReportPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C6523 - Column Headers, on Generated Reports, are not displaying correctly', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })
    it('Generate Excel Report', () => {
        ARDashboardPage.getMediumWait()
        //Click on Reports
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        // Any Report
        ARDashboardPage.getMenuItemOptionByName('Learner Activity')
        ARDashboardPage.getMediumWait()
        // Click on generate file and select from drop down (excel/csv) and click on generate
        cy.get(ARDashboardPage.getElementByTitleAttribute('Generate Report File')).click()
        cy.get(ARCourseActivityReportPage.getGenerateReportFileFormatDDown()).click()
        //Select Excel
        cy.get(ARCourseActivityReportPage.getGenerateReportFileFormatOption()).eq(0).click({ force: true })
        cy.get(ARDashboardPage.getElementByDataNameAttribute('generate-report-button')).click()

        cy.get(ARDashboardPage.getToastNotificationMsg()).should('contain', 'Report Generation Requested.')

        LEDashboardPage.waitForLoader(ARDashboardPage.getWaitSpinner())

        cy.get(ARDashboardPage.getElementByDataNameAttribute('confirm')).contains('Download Report').click()

    })
    it('Generate CSV Report', () => {
        ARDashboardPage.getMediumWait()
        //Click on Reports
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        // Any Report
        ARDashboardPage.getMenuItemOptionByName('Learner Activity')
        ARDashboardPage.getMediumWait()
        // Click on generate file and select from drop down (excel/csv) and click on generate
        cy.get(ARDashboardPage.getElementByTitleAttribute('Generate Report File')).click()
        cy.get(ARCourseActivityReportPage.getGenerateReportFileFormatDDown()).click()
        //Select CSV
        cy.get(ARCourseActivityReportPage.getGenerateReportFileFormatOption()).eq(1).click({ force: true })
        cy.get(ARDashboardPage.getElementByDataNameAttribute('generate-report-button')).click()

        cy.get(ARDashboardPage.getToastNotificationMsg()).should('contain', 'Report Generation Requested.')

        LEDashboardPage.waitForLoader(ARDashboardPage.getWaitSpinner())

        cy.get(ARDashboardPage.getElementByDataNameAttribute('confirm')).contains('Download Report').click()

    })
})