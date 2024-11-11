
import ARAddEditCategoryPage from "../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARRolesAddEditPage from "../../../../../../helpers/AR/pageObjects/Roles/ARRolesAddEditPage"
import { rolesDetails } from "../../../../../../helpers/TestData/Roles/rolesDetails"
import { users } from "../../../../../../helpers/TestData/users/users"



describe("C1925 - AUT-484 -  Acceptance Tests-NLE-2377-Roles Report - Add/Edit Role Form - General Section", () => {
    it(` Admin can add a role named ${rolesDetails.roleName}`, () => {
        //Log in as an system admin user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        
        //Go to Roles Report
        ARDashboardPage.getRolesReport()
        //Asserting correct Page
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Add Role'), 1000))
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Add Role')).click()
        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Add Role")
        cy.get(ARRolesAddEditPage.getGeneralNameTxtF()).clear().type(rolesDetails.roleName)
        cy.get(ARRolesAddEditPage.getGeneralDescriptionTxtF()).clear().type(rolesDetails.roleDescription)
        //Selecting only View and Delete of Course Bundles Permissions
        ARRolesAddEditPage.getSelectCheckboxBySectionNameAndIndexNumber('courses', 2, 'View')
        ARRolesAddEditPage.getSelectCheckboxBySectionNameAndIndexNumber('courses', 2, 'Delete')
        //Saving the role 
        cy.get(ARRolesAddEditPage.getSaveBtn()).contains('Save').click()
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should('not.exist')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')
    })

    it(`Editing ${rolesDetails.roleName} to ADD modify Course bundle Permission`, () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        
        //Go to Roles Report
        ARDashboardPage.getRolesReport()
        //Asserting correct Page
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Add Role'), 1000))
        //Filtering out Role
        ARCoursesPage.AddFilter('Name', 'Equals', rolesDetails.roleName)
        //clicking the role to select
        cy.get(ARDashboardPage.getTableCellRecord()).contains(rolesDetails.roleName).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARCoursesPage.getCoursesActionsButtonsByLabel('Edit Role')))
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Edit Role')).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Edit Role")
        ARRolesAddEditPage.getSelectCheckboxBySectionNameAndIndexNumber('courses', 2, 'Modify')
        //Saving the role 
        cy.get(ARRolesAddEditPage.getSaveBtn()).contains('Save').click()
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should('not.exist')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')
        cy.get(ARDashboardPage.getTableCellRecord()).contains(rolesDetails.roleName).click()
    })
    it(`Admin can delete a role named ${rolesDetails.roleName}`, ()=>{
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        
        ARDashboardPage.getRolesReport()
        //Verify navigated window
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', "Roles")
        ARDashboardPage.AddFilter('Name', 'Equals', rolesDetails.roleName)
        cy.get(ARDashboardPage.getTableCellRecord()).contains(rolesDetails.roleName).click()
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARCoursesPage.getCoursesActionsButtonsByLabel('Delete Role')))
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Delete Role')).should('have.attr', 'aria-disabled', 'false').click()

        //Close the delete role pop up
        cy.get(ARRolesAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
         // Verify Role is deleted
        cy.get(ARDashboardPage.getNoResultMsg()).should('have.text', "No results found.")
    })
      
})