import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARCBAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARRolesAddEditPage from "../../../../../../helpers/AR/pageObjects/Roles/ARRolesAddEditPage"
import { rolesDetails } from "../../../../../../helpers/TestData/Roles/rolesDetails"
import { users } from "../../../../../../helpers/TestData/users/users"




describe('C1979 - AUT-532 - Acceptance Tests- NLE-2429- Roles Report - Viewing Permissions for Default Roles', () => {
    it("Verify View role' button is Available", () => {
        //Login as an Blat Administrator
        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')
        //Navigate to Roles Report page
        ARDashboardPage.getRolesReport()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
        //Filtering out Admins
        ARDashboardPage.AddFilter('Name', 'Contains', rolesDetails.Admin)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
        //Asserting Admin is the default role
        cy.get(ARDashboardPage.getTableCellName(2)).contains(rolesDetails.Admin).find('span').should('have.attr', 'title', 'Default Role').click()
        //Asserting view Role Button
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('View Role')))
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('View Role')).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('View Role')).should('have.text', 'View Role').click()
        //Clicking on View Role Button Takes it to View Role Page 
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', 'View Role')

    })

    it("Verify that elements in the Edit Role Page are read-only", () => {

        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')
        //Navigate to Roles Report page
        ARDashboardPage.getRolesReport()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
        //Filtering out Admins
        ARDashboardPage.AddFilter('Name', 'Contains', rolesDetails.Admin)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
        //Asserting Admin is the default role
        cy.get(ARDashboardPage.getTableCellName(2)).contains(rolesDetails.Admin).find('span').should('have.attr', 'title', 'Default Role').click()
        //Asserting view Role Button
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('View Role')))
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('View Role')).should('have.attr', 'aria-disabled', 'false')
        //Asserting that Edit Role is disabled
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit Role')).should('have.attr', 'aria-disabled', 'true')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('View Role')).should('have.text', 'View Role').click()
        //Clicking on View Role Button Takes it to View Role Page 
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', 'View Role')
        //Asserting that Name field is read only
        cy.get(ARRolesAddEditPage.getGeneralNameTxtF()).should('have.attr', 'readonly')
        //Asserting that Description field is read only
        cy.get(ARRolesAddEditPage.getGeneralDescriptionTxtF()).should('have.attr', 'readonly')
        //default role permissions cannot be modified
        cy.get(ARRolesAddEditPage.getRolePermissionsForm()).contains('Instructor Led Courses').parent().find('input').should('have.attr', 'readonly')
        cy.get(ARRolesAddEditPage.getRolePermissionsForm()).contains('Online Courses').parent().find('input').should('have.attr', 'readonly')
        cy.get(ARRolesAddEditPage.getRolePermissionsForm()).contains('Course Bundles').parent().find('input').should('have.attr', 'readonly')
        cy.get(ARRolesAddEditPage.getRolePermissionsForm()).contains('Curricula').parent().find('input').should('have.attr', 'readonly')

        cy.get(ARCBAddEditPage.getViewHistoryBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
        cy.get(ARCBAddEditPage.getHistoryTitle()).should('contain', 'Role History')
        cy.get(ARCBAddEditPage.getCloseModal()).click()
        cy.get(ARCBAddEditPage.getHistoryTitle()).should('not.exist')
        

    })
})