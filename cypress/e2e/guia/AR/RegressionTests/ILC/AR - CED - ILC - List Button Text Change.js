import ARILCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C936 - List Button Text Change', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password,"/admin")
    })

    it('List Button Text Change', () => {
        ARDashboardPage.getMediumWait()
        // Navigate to Courses
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        

        cy.createCourse('Instructor Led')


        ARILCAddEditPage.getLongWait();

        cy.get(ARILCAddEditPage.getSessionDetailsEditBtn()).eq(0).click()
        // Check that Button has text "Close" rather than "Cancel"
        cy.get(ARILCAddEditPage.getAddEditSessionCancelBtn()).should('contain', 'Close')
        ARDashboardPage.getLongWait()

    })
})