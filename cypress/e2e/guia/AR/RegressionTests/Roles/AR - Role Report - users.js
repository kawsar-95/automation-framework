import ARAddEditCategoryPage from "../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARCouponsAddEditPage from "../../../../../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARRolesAddEditPage from "../../../../../../helpers/AR/pageObjects/Roles/ARRolesAddEditPage"
import ARUserAddEditPage from "../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage"
import { rolesDetails } from "../../../../../../helpers/TestData/Roles/rolesDetails"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import menuItems from '../../../../../fixtures/menuItems.json'



describe('C1944 AUT-503  GUIA-Story - Acceptance Test - NLE-2400 - Roles Report - Add/Edit Role Form - Users Section', () => {
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
      //Selecting only View and Delete of Users Permissions
      ARRolesAddEditPage.getSelectCheckboxBySectionNameAndIndexNumber('users', 0, 'Users')
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

   it(`Login as  ${userDetails.username} in AE and verify that 'Users' is available but ${menuItems.ROLES} , ${menuItems.DEPARTMENTS} , ${menuItems.GROUPS} ,  ${menuItems.ENROLLMENT_KEYS} are not available`, () => {

      //Log in with custom user
      cy.apiLoginWithSession(userDetails.username, users.sysAdmin.admin_sys_01_password, '/admin')
      //Go to users page
      ARDashboardPage.getMediumWait()
      cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
      cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel(menuItems.USERS))).click()
      cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
      //Asserting that Users is available
      cy.get(ARDashboardPage.getMenuItem()).should('contain', menuItems.USERS)
      //Asserting that Roles are not available
      cy.get(ARDashboardPage.getMenuItem()).should('not.contain',menuItems.ROLES)
      //Asserting that Departments are  not available
      cy.get(ARDashboardPage.getMenuItem()).should('not.contain', menuItems.DEPARTMENTS)
      //Asserting that Groups are not available
      cy.get(ARDashboardPage.getMenuItem()).should('not.contain', menuItems.GROUPS)
      //Asserting that ENROLLMENT KEYS are not available
      cy.get(ARDashboardPage.getMenuItem()).should('not.contain', menuItems.ENROLLMENT_KEYS)

   })

   it(`Editing ${rolesDetails.roleName} to ADD Question Bank , Venues , Global Resources  Permission`, () => {
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
      //Adding Roles Permissions
      ARRolesAddEditPage.getSelectCheckboxBySectionNameAndIndexNumber('users', 1 , menuItems.ROLES)
      //Adding DEPARTMENTS Permissions
      ARRolesAddEditPage.getSelectCheckboxBySectionNameAndIndexNumber('users', 2 , menuItems.DEPARTMENTS)
      //Adding GROUPS Permissions
      ARRolesAddEditPage.getSelectCheckboxBySectionNameAndIndexNumber('users', 3, menuItems.GROUPS)
      //Adding ENROLLMENT KEYS Permissions
      ARRolesAddEditPage.getSelectCheckboxBySectionNameAndIndexNumber('users', 4, menuItems.ENROLLMENT_KEYS)

      //Saving the role 
      cy.get(ARRolesAddEditPage.getSaveBtn()).contains('Save').click()
      cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
      cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')
      cy.get(ARDashboardPage.getTableCellRecord()).contains(rolesDetails.roleName).click()
   })


   it(` verifying ${userDetails.username2} have access to 'Add Course Bundle' and other features`, () => {

      //Log in with custom user
      cy.apiLoginWithSession(userDetails.username2, users.sysAdmin.admin_sys_01_password, '/admin')
      //Go to users page
      ARDashboardPage.getMediumWait()
      cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
      cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel(menuItems.USERS))).click()
      cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
      //Asserting that Users is available
      cy.get(ARDashboardPage.getMenuItem()).should('contain', menuItems.USERS)
      //Asserting that Roles are not available
      cy.get(ARDashboardPage.getMenuItem()).should('contain',menuItems.ROLES)
      //Asserting that Departments are  not available
      cy.get(ARDashboardPage.getMenuItem()).should('contain', menuItems.DEPARTMENTS)
      //Asserting that Groups are not available
      cy.get(ARDashboardPage.getMenuItem()).should('contain', menuItems.GROUPS)
      //Asserting that ENROLLMENT KEYS are not available
      cy.get(ARDashboardPage.getMenuItem()).should('contain', menuItems.ENROLLMENT_KEYS)


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

