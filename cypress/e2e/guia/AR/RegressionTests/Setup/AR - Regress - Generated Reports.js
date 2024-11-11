import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARGeneratedReportsPage from "../../../../../../helpers/AR/pageObjects/Setup/ARGeneratedReportsPage"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C6325 - Setup - Generated Reports', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            '/admin'
        )
    })
    it('Generate Report', () => {
        //Navigate to Generated Report
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        ARDashboardPage.getMenuItemOptionByName('Generated Reports')
        ARDashboardPage.getMediumWait()

        // //Click on Print report option in header
        // cy.get(ARDashboardPage.getElementByTitleAttribute('Print Report')).click()
        // // cy.get('div').contains('Cancel').click()
        // const fn = cy.stub()
        // cy.on('window:alert', fn)
        // cy.get('button').contains('Cancel').click().then(() => {
        //     cy.log('Reached here')
        // })

        //Select and Delete Report then Cancel
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByTitleAttribute('Delete Generated Report')).click()
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('cancel')).click()

        //Click on deselect
        cy.get(ARDashboardPage.getDeselectBtn()).click()

        ARDashboardPage.getMediumWait()

        //Click on Export All Element Data and Back
        cy.get(ARDashboardPage.getElementByTitleAttribute('Export All Enrollment Data')).click()
        ARDashboardPage.getLongWait()
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click({ force: true })

        //Click on Export All Element Data and Create new Export
        ARDashboardPage.getLongWait()
        ARDashboardPage.getLongWait()
        cy.get(ARDashboardPage.getElementByTitleAttribute('Export All Enrollment Data')).click()
        ARDashboardPage.getLongWait()
        ARGeneratedReportsPage.getAndClickCreateNewExportButton()
        // ARDashboardPage.getLongWait()
        // ARDashboardPage.getMediumWait()
        // ARGeneratedReportsPage.getAndClickCreateNewExportButton(0)

    })
})