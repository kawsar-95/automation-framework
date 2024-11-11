import ARAddEditCategoryPage from "../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARRolesAddEditPage from "../../../../../../helpers/AR/pageObjects/Roles/ARRolesAddEditPage"
import ARUserAddEditPage from "../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage"
import { rolesDetails } from "../../../../../../helpers/TestData/Roles/rolesDetails"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"


const numberOfRoles = 2;
let secondRole = "";
describe('C1933 AUT-492 - GUIA-Story - NLE-2389 - Roles Report - Delete Role - Single Role Delete', () => {
    before(`create ${numberOfRoles} Roles as Prerequisite`, () => {
        //create a user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        //Log in as an system admin user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getCurrentUserLabel()).should('contain.text', users.sysAdmin.admin_sys_01_full_name)
        for (let i = 1; i <= numberOfRoles; i++) {
            //Go to Roles Report
            ARDashboardPage.getRolesReport()
            //Asserting correct Page
            cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')

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
            cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
            cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')

            //Add the role to new user
            ARDashboardPage.getUsersReport()
            ARUserAddEditPage.getEditUserByUsername(userDetails.username)

            cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Edit User")
            //Here this wait is necessary for the context
            ARDashboardPage.getMediumWait()
            //Give the user admin permission
            ARUserAddEditPage.generalToggleSwitch('true', ARUserAddEditPage.getAdminToggleContainer())
            if (i === 1) {
                ARUserAddEditPage.getAddRoleByName(rolesDetails.roleName)
            } else {
                ARUserAddEditPage.getAddRoleByName(secondRole)
            }

            ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
            cy.get(ARUserAddEditPage.getSaveBtn()).click()
            cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
            cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Users')
        }

    })
    it(`Verify that Roles are present in ${userDetails.username}`, () => {
        //Login as an Admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Go to Users Report Page
        ARDashboardPage.getUsersReport()
        //Edit the newly created user
        ARUserAddEditPage.getEditUserByUsername(userDetails.username)

        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Edit User")
        //Here this wait is necessary for the context
        ARDashboardPage.getMediumWait()
        //Search for the created Roles to be present 
        cy.get(ARUserAddEditPage.getRolesByNameInsideSelected(rolesDetails.roleName), { timeout: 150000 }).should('exist')
        cy.get(ARUserAddEditPage.getRolesByNameInsideSelected(secondRole), { timeout: 150000 }).should('exist')
    })

    it("Verify Delete Role button is Available but disabled", () => {
        //Login as an Admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
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
        //Asserting Delete Role Button is Disabled
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete Role')).should('have.attr', 'aria-disabled', 'true')

    })

    it('Verifying that selecting multiple roles Delete Role Button becomes available', () => {
        //Log in as an administrator
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Go to Roles Report page
        ARDashboardPage.getRolesReport()
        //Asserting Header title 
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', "Roles")
        //Filtering out first role
        ARDashboardPage.AddFilter('Name', 'Equals', rolesDetails.roleName)
        //Clicking on the first role
        cy.get(ARDashboardPage.getTableCellRecord()).contains(rolesDetails.roleName).click()

        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARCoursesPage.getCoursesActionsButtonsByLabel('Delete Role')))
        //Clicking on Delete Role button
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Delete Role')).should('have.attr', 'aria-disabled', 'false').click()
        //Asserting that modal header is delete role
        cy.get(ARDeleteModal.getModalHeader()).should('have.text', 'Delete Role')
        //Asserting Prompt content 
        
        cy.get(ARDeleteModal.getDeletePromptContent()).should('contain', `Are you sure you want to delete '${rolesDetails.roleName}'?`)
        //Clicking on the cancel button
        cy.get(ARDeleteModal.getARCancelBtn()).click()
        //Modal should not exist
        cy.get(ARDeleteModal.getModalHeader()).should('not.exist')
        //Selection prevails 
        cy.get(ARDashboardPage.getTableCellRecord()).contains(rolesDetails.roleName).parent().find('input').first().should('have.attr', 'aria-checked', 'true')
        //Clicking on Delete Roles button
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Delete Role')).should('have.attr', 'aria-disabled', 'false').click()
        //Asserting that modal header is delete role
        cy.get(ARDeleteModal.getModalHeader()).should('have.text', 'Delete Role')
        //Close the delete role pop up
        cy.get(ARRolesAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        //Veryfying Toast Message 
        

    })

    it(`Verify that Roles are not present in ${userDetails.username}`, () => {
        //Login as an Admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Go to Users Report Page
        ARDashboardPage.getUsersReport()
        //Edit the newly created user
        ARUserAddEditPage.getEditUserByUsername(userDetails.username)

        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Edit User")
        //Here this wait is necessary for the context
        ARDashboardPage.getMediumWait()
        //Search for the created Roles to be present 
        cy.get(ARUserAddEditPage.getRolesByNameInsideSelected(rolesDetails.roleName), { timeout: 150000 }).should('not.exist')
        cy.get(ARUserAddEditPage.getRolesByNameInsideSelected(secondRole), { timeout: 150000 }).should('exist')
    })
    // 
    it("Verifying that the roles are not present in the roles report page ", () => {
        //Log in as an admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Go to roles report page
        ARDashboardPage.getRolesReport()
        //Assert the title
        cy.get(ARCoursesPage.getPageHeaderTitle(), { timeout: 160000 }).should('have.text', "Roles")
        //filter out the first role
        ARDashboardPage.AddFilter('Name', 'Equals', rolesDetails.roleName)
        //Asserting role is not present
        cy.get(ARDashboardPage.getNoResultMsg() , {timeout:150000}).should('have.text', "No results found.")

        //Filter out the second role
        ARDashboardPage.AddFilter('Name', 'Equals', secondRole)
        //Asserting that second role is present
        cy.get(ARDashboardPage.getNoResultMsg()).should('not.exist')

    })



    after(function () {

        //Log in as an administrator
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Go to Roles Report page
        ARDashboardPage.getRolesReport()
        //Asserting Header title 
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', "Roles")
        //Filtering out first role
        ARDashboardPage.AddFilter('Name', 'Equals', secondRole)
        //Clicking on the first role
        cy.get(ARDashboardPage.getTableCellRecord()).contains(secondRole).click()

        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARCoursesPage.getCoursesActionsButtonsByLabel('Delete Role')))
        //Clicking on Delete Role button
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Delete Role')).should('have.attr', 'aria-disabled', 'false').click()
        //Asserting that modal header is delete role
        cy.get(ARDeleteModal.getModalHeader()).should('have.text', 'Delete Role')
        //Asserting Prompt content 
        cy.get(ARDeleteModal.getDeletePromptContent()).should('contain', `Are you sure you want to delete '${secondRole}'?`)
        //Close the delete role pop up
        cy.get(ARRolesAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        
        //Delete the created User
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        //Cleanup - Get userID and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })

    })
})