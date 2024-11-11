import ARAddEditCategoryPage from "../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARCouponsAddEditPage from "../../../../../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import AREditClientUserPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage"
import ARRolesAddEditPage from "../../../../../../helpers/AR/pageObjects/Roles/ARRolesAddEditPage"
import ARUserAddEditPage from "../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { rolesDetails } from "../../../../../../helpers/TestData/Roles/rolesDetails"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import menuitems from "../../../../../fixtures/menuItems.json"


describe('C1952 AUT-509 GUIA-Story - Acceptance Test - NLE-2398 - Roles Report - Add/Edit Role Form - Special Section', () => {
    it("create an admin user with Custom Roles", () => {
        //create a user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        //create user 2 
        cy.createUser(void 0, userDetails.username2, ["Learner"], void 0)
        //Log in as an system admin user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getCurrentUserLabel()).should('contain.text', users.sysAdmin.admin_sys_01_full_name)


        //Go to Roles Report
        ARDashboardPage.getRolesReport()
        //Asserting correct Page
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Add Role'), 1000))
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Add Role')).click()
        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Add Role")
        cy.get(ARRolesAddEditPage.getGeneralNameTxtF()).clear().type(rolesDetails.roleName)
        cy.get(ARRolesAddEditPage.getGeneralDescriptionTxtF()).clear().type(rolesDetails.roleDescription)
        //Adding Special Report Permissions
        ARRolesAddEditPage.getSelectCheckboxBySectionNameAndIndexNumber('special', 0, 'View Product Notifications')

        //Saving the role 
        cy.get(ARRolesAddEditPage.getSaveBtn()).contains('Save').click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
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

        cy.get(ARCouponsAddEditPage.getRemoveAllFilterBtn(), { timeout: 10000 }).should('be.visible').click()
        //Add this role to 2nd user
        ARUserAddEditPage.getEditUserByUsername(userDetails.username2)

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

    it(`Login as  ${userDetails.username} in AE and verify that 'Saved Report' is  available`, () => {

        //Log in with custom user
        cy.apiLoginWithSession(userDetails.username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Go to courses page
        ARDashboardPage.getSavedReport()
        //Asserting page 
        cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('have.text', menuitems.SAVED_REPORTS)

    })

    it(`Editing ${rolesDetails.roleName} to ADD modify Contact Us Permission`, () => {
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
        ARRolesAddEditPage.getSelectCheckboxBySectionNameAndIndexNumber('special', 0, 'Contact Us')
        //Saving the role
        cy.get(ARRolesAddEditPage.getSaveBtn()).contains('Save').click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')
        cy.get(ARDashboardPage.getTableCellRecord()).contains(rolesDetails.roleName).click()
    })


    it(` verifying ${userDetails.username2} have access to 'Generated Reports' and other features`, () => {

        //Log in with custom user
        cy.apiLoginWithSession(userDetails.username2, users.sysAdmin.admin_sys_01_password, '/admin')

        ARDashboardPage.getSavedReport()
        //Asserting page 
        cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('have.text', menuitems.SAVED_REPORTS)

        cy.get(ARRolesAddEditPage.getA5SetupBtn()).should('exist').click()
        cy.get(ARRolesAddEditPage.getA5GeneratedReportSubMenu()).should('exist').click()
        //Asserting page 
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', menuitems.GENERATED_REPORTS)

    })

    after(function () {
        //delete the role
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

       

        //delete user
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

