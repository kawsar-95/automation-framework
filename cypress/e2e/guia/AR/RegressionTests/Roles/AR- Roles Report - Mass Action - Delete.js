import ARAddEditCategoryPage from "../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARRolesAddEditPage from "../../../../../../helpers/AR/pageObjects/Roles/ARRolesAddEditPage"
import {rolesDetails} from "../../../../../../helpers/TestData/Roles/rolesDetails"
import {users} from "../../../../../../helpers/TestData/users/users"


const numberOfRoles = 2;
let secondRole = "";
describe('C1938 AUT-497 - GUIA-Story - Acceptance Test - NLE-2392 - Roles Report - Mass Action - Delete', () => {
    before(`create ${numberOfRoles} Roles as Prerequisite`, () => {

        //Log in as an system admin user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getCurrentUserLabel()).should('contain.text', users.sysAdmin.admin_sys_01_full_name)
        //Go to Roles Report
        ARDashboardPage.getRolesReport()
        //Asserting correct Page
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')
        for (let i = 1; i <= numberOfRoles; i++) {
            cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Add Role'), 1000))
            cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Add Role')).click()
            cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Add Role")
            if (i === 1) {
                cy.get(ARRolesAddEditPage.getGeneralNameTxtF()).clear().type(rolesDetails.roleName)
            } else {
                cy.get(ARRolesAddEditPage.getGeneralNameTxtF()).clear().type(secondRole = `${rolesDetails.roleName}-${i}`)
            }
            cy.get(ARRolesAddEditPage.getGeneralDescriptionTxtF()).clear().type(rolesDetails.roleDescription)
            //Selecting only View and Delete of Course Bundles Permissions
            ARRolesAddEditPage.getSelectCheckboxBySectionNameAndIndexNumber('courses', 2, 'View')
            ARRolesAddEditPage.getSelectCheckboxBySectionNameAndIndexNumber('courses', 2, 'Delete')
            //Saving the role 
            cy.get(ARRolesAddEditPage.getSaveBtn()).contains('Save').click()
            cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 150000}).should('not.exist')
            cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')
        }

    })

    
    it('Verifying that selecting multiple roles Delete Role Button becomes available', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getRolesReport()
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', "Roles")
        ARDashboardPage.AddFilter('Name', 'Equals', rolesDetails.roleName)
        ARDashboardPage.AddFilter('Name', 'Equals', secondRole)
        cy.get(ARDashboardPage.getTableCellRecord()).contains(rolesDetails.roleName).click()
        cy.get(ARDashboardPage.getTableCellRecord()).contains(secondRole).click()
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARCoursesPage.getCoursesActionsButtonsByLabel('Delete Roles')))
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Delete Roles')).should('have.attr', 'aria-disabled', 'false')


    })

    after(function () {
        //delete the role
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        ARDashboardPage.getRolesReport()
        for (let i = 1; i <= numberOfRoles; i++) {
            //Verify navigated window
            cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', "Roles")
            if (i === 1) {
                ARDashboardPage.AddFilter('Name', 'Equals', rolesDetails.roleName)
                cy.get(ARDashboardPage.getTableCellRecord()).contains(rolesDetails.roleName).click()
            } else {
                ARDashboardPage.AddFilter('Name', 'Equals', secondRole)
                cy.get(ARDashboardPage.getTableCellRecord()).contains(secondRole).click()
            }

            cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARCoursesPage.getCoursesActionsButtonsByLabel('Delete Role')))
            cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Delete Role')).should('have.attr', 'aria-disabled', 'false').click()

            //Close the delete role pop up
            cy.get(ARRolesAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
            cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 150000}).should('not.exist')
            cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', "Roles")
        }

    })
})