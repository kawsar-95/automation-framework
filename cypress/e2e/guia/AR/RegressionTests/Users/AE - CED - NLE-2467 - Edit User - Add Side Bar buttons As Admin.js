import ARAddEditCategoryPage from "../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARRolesAddEditPage from "../../../../../../helpers/AR/pageObjects/Roles/ARRolesAddEditPage"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import ARUserAddEditPage from "../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage"
import ARUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage"
import { rolesDetails } from "../../../../../../helpers/TestData/Roles/rolesDetails"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"



describe('C1984 - AUT-536 - GUIA-Story - NLE-2467 - Edit User - Add Side Bar buttons', () => {

    it("create an admin user with Custom Roles", () => {
        //create a user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
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
        //Selecting only View and Delete of Course Bundles Permissions
        ARRolesAddEditPage.getSelectCheckboxBySectionNameAndIndexNumber('users', 0, 'Users')
        ARRolesAddEditPage.getSelectCheckboxBySectionNameAndIndexNumber('courses', 4, 'Enrollments')
        ARRolesAddEditPage.getSelectCheckboxBySectionNameAndIndexNumber('reports', 0, 'User Transcript')


        //Saving the role 
        cy.get(ARRolesAddEditPage.getSaveBtn()).contains('Save').click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')
        //Add the role to new user
        ARDashboardPage.getUsersReport()
        ARUserAddEditPage.getEditUserByUsername(userDetails.username)

        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Edit User")
        //This wait is necessary
        ARDashboardPage.getMediumWait()
        //Give the user admin permission
        ARUserAddEditPage.generalToggleSwitch('true', ARUserAddEditPage.getAdminToggleContainer())
        ARUserAddEditPage.getAddRoleByName(rolesDetails.roleName)
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Users')
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
    })

    it(` Navigate to the users report page as ${userDetails.username} and assert`, () => {
        //Log in with custom user
        cy.apiLoginWithSession(userDetails.username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Navigate to the users report page
        ARDashboardPage.getUsersReport()
        //Asserting page 
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Users')
        //Filter out a user from users report
        ARCoursesPage.AddFilter('Username', 'Equals', users.learner01.learner_01_username)
        //
        cy.get(ARDashboardPage.getTableCellName(4)).contains(users.learner01.learner_01_username).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Edit User'), 1000))
        // asserting these buttons 
        // *Enroll User
        // * Message User
        // * User Transcript
        // * Reset Password
        // * Delete
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Enroll User')).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Message User')).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('User Transcript')).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Reset Password')).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete')).should('have.attr', 'aria-disabled', 'false')
        //Asserting Enroll User Page
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Enroll User')).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        cy.get(AREnrollUsersPage.getEnrollUsersPageTitle()).should('have.text', "Enroll Users")
        cy.go('back')
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        //Asserting Message User Page
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Message User')).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Compose Message")
        cy.go('back')
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        //Asserting User Transcript Page
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('User Transcript')).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "User Transcript")
        cy.go('back')
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        //Asserting Delete
        cy.get(ARUserPage.getAddEditMenuActionsByName('Delete')).click()
        //Verify that clicking [Delete] button will open the Delete user modal
        cy.wrap(ARUserPage.WaitForElementStateToChange(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())))
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        //Verify that clicking [Delete] button will open the Delete user modal
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).should('be.visible')
        //Verify that selecting the [Cancel] button user is not deleted and the user  remains in the list of users
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Users')
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getCancelBtn())).click()

    })
})