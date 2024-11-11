
import ARAddEditCategoryPage from "../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARRolesAddEditPage from "../../../../../../helpers/AR/pageObjects/Roles/ARRolesAddEditPage"
import { rolesDetails } from "../../../../../../helpers/TestData/Roles/rolesDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import menuItems from '../../../../../fixtures/menuItems.json'
import ARCouponsAddEditPage from "../../../../../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage"
import ARUserAddEditPage from "../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"


//Create a new role and delete that role 
let duplicateRoleName = rolesDetails.roleName + ' - Copy';
describe('C1992 - AUT-544 - GUIA-Story - Acceptance Tests- NLE-2388 - Roles Report - Duplicate Role', () => {
    it(` Admin can add a role named ${rolesDetails.roleName}`, () => {
        //create a user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        //create user 2 
        cy.createUser(void 0, userDetails.username2, ["Learner"], void 0)
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
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')
        //Add the role to new user
        ARDashboardPage.getUsersReport()
        ARUserAddEditPage.getEditUserByUsername(userDetails.username)

        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Edit User")
        //Here this wait is necessary for the context
        ARDashboardPage.getMediumWait()
        //Give the user admin permission
        ARUserAddEditPage.generalToggleSwitch('true', ARUserAddEditPage.getAdminToggleContainer())
        ARUserAddEditPage.getAddRoleByName(rolesDetails.roleName)
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Users')


    })

    it("Admin can make a duplicate role of the newly created role", () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        ARDashboardPage.getRolesReport()
        //Verify navigated window
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', "Roles")
        ARDashboardPage.AddFilter('Name', 'Equals', rolesDetails.roleName)
        cy.get(ARDashboardPage.getTableCellRecord()).contains(rolesDetails.roleName).click()
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARCoursesPage.getCoursesActionsButtonsByLabel('Delete Role')))
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Duplicate Role')).should('have.attr', 'aria-disabled', 'false').click()

        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Add Role")

        cy.get(ARRolesAddEditPage.getGeneralNameTxtF()).invoke('val').then((text) => {
            expect(text).to.equal(duplicateRoleName)
        })
        cy.get(ARRolesAddEditPage.getGeneralDescriptionTxtF()).invoke('val').then((description) => {
            expect(description).to.equal(rolesDetails.roleDescription)
        });
        //Saving the role 
        cy.get(ARRolesAddEditPage.getSaveBtn()).contains('Save').click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')

        //Add this role to 2nd user
        ARDashboardPage.getUsersReport()
        ARUserAddEditPage.getEditUserByUsername(userDetails.username2)

        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Edit User")
        //Here this wait is necessary for the context
        ARDashboardPage.getMediumWait()
        //Give the user admin permission
        ARUserAddEditPage.generalToggleSwitch('true', ARUserAddEditPage.getAdminToggleContainer())
        ARUserAddEditPage.getAddRoleByName(duplicateRoleName)
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Users')
    })

    it(`Login as  ${userDetails.username} in AE and verify that 'Courses' is available `, () => {

        //Log in with custom user
        cy.apiLoginWithSession(userDetails.username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Go to courses page
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel(menuItems.COURSES))).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        //Asserting that Courses is available
        cy.get(ARDashboardPage.getMenuItem()).should('contain', menuItems.COURSES)
        //Asserting that Venues are not available
        cy.get(ARDashboardPage.getMenuItem()).should('not.contain', menuItems.VENUES)


    })

    it(`Login as  ${userDetails.username2} in AE and verify that 'Courses' is available `, () => {

        //Log in with custom user
        cy.apiLoginWithSession(userDetails.username2, users.sysAdmin.admin_sys_01_password, '/admin')
        //Go to courses page
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel(menuItems.COURSES))).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        //Asserting that Courses is available
        cy.get(ARDashboardPage.getMenuItem()).should('contain', menuItems.COURSES)
        //Asserting that Venues are not available
        cy.get(ARDashboardPage.getMenuItem()).should('not.contain', menuItems.VENUES)


    })

    it(`Admin can delete a role named ${rolesDetails.roleName}`, () => {
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

        //Delete duplicated Role
        ARDashboardPage.AddFilter('Name', 'Equals', duplicateRoleName)
        cy.get(ARDashboardPage.getTableCellRecord()).contains(duplicateRoleName).click()
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARCoursesPage.getCoursesActionsButtonsByLabel('Delete Role')))
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Delete Role')).should('have.attr', 'aria-disabled', 'false').click()

        //Close the delete role pop up
        cy.get(ARRolesAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
        // Verify Role is deleted
        cy.get(ARDashboardPage.getNoResultMsg()).should('have.text', "No results found.")
    })

    after('clean up', () => {
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
        //Delete 2nd User
        cy.apiLoginWithSession(userDetails.username2, userDetails.validPassword)
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