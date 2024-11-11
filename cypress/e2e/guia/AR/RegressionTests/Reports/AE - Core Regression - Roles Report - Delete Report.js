import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage";
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import { users } from "../../../../../../helpers/TestData/users/users";
ARCoursesPage

describe('AUT-491 C1932 GUIA-Story - Acceptance Test - NLE-2389 - Roles Report - Delete Role', function () {


    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })


    it('Delete Role ', () => {
        // Go to Users page
        //Click on Roles
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Roles'))
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Delete Role')).should('exist')

    })
})
