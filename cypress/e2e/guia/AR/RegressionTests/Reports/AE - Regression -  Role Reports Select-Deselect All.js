import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import { users } from "../../../../../../helpers/TestData/users/users";


describe('AUT 511 - C1954 GUIA-Story - Acceptance Test - NLE-2407 - Roles Report - Select All / Deselect All', function () {


    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getMediumWait()
    })


    it('Add/remove columns from Report Layout ', () => {
        // Go to Users page
        //Click on Roles
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Roles'))
        ARDashboardPage.getMediumWait()
        for (let i = 0; i < 2; i++) {
            cy.get(ARDashboardPage.getRowSelectOptionsBtn()).click()
            cy.get(ARDashboardPage.getRowSelectOpt()).eq(i).click()
        }

    })
})
