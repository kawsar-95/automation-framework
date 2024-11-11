import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARGeneratedReportsPage from "../../../../../../helpers/AR/pageObjects/Setup/ARGeneratedReportsPage"
import { users } from "../../../../../../helpers/TestData/users/users"
import actionButtons from "../../../../../fixtures/actionButtons.json"

describe("C6330 - AR - Regress - Setup - Saved Reports", function () {

    it("Log in as an admin and go to saved reports", function () {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Navigate to Logins
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        ARDashboardPage.getMenuItemOptionByName('Saved Reports')
        ARDashboardPage.getMediumWait()
        //Asserting Page Header Buttons 
        cy.get(ARDashboardPage.getElementByTitleAttribute(actionButtons.GENERATE_REPORT_FILE)).should('have.class', 'btn circle');
        cy.get(ARDashboardPage.getElementByTitleAttribute(actionButtons.PRINT_REPORT)).should('have.class', 'btn circle');
        cy.get(ARDashboardPage.getElementByTitleAttribute(actionButtons.SCHEDULE_REPORT_EMAIL)).should('have.class', 'disabled');
        cy.get(ARDashboardPage.getElementByTitleAttribute(actionButtons.SHARE_REPORT)).should('have.class', 'disabled');
        cy.get(ARDashboardPage.getElementByTitleAttribute(actionButtons.SAVED_LAYOUT)).should('have.class', 'btn circle');
        //Selecting the table body 
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        //Click on deselct
        cy.get(ARGeneratedReportsPage.getSideBarDeselectBtn()).should('have.text', "Deselect").click()

    })

})