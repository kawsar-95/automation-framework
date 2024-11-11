
import ARAddEditCategoryPage from "../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARILCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARRolesAddEditPage from "../../../../../../helpers/AR/pageObjects/Roles/ARRolesAddEditPage"
import ARUserAddEditPage from "../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { ilcDetails } from "../../../../../../helpers/TestData/Courses/ilc"
import { rolesDetails } from "../../../../../../helpers/TestData/Roles/rolesDetails"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"


describe('C1977 AUT-530 GUIA-Story - NLE-2436 - Roles Report - Add/Edit Role Form - ILC', () => {

    it("create an admin user with Custom Roles", () => {
        //create a user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        //Log in as an system admin user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Go to Roles Report
        ARDashboardPage.getRolesReport()
        //Asserting correct Page
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Add Role'), 1000))
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Add Role')).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Add Role")
        cy.get(ARRolesAddEditPage.getGeneralNameTxtF()).clear().type(rolesDetails.roleName)
        cy.get(ARRolesAddEditPage.getGeneralDescriptionTxtF()).clear().type(rolesDetails.roleDescription)
        //Selecting only View and Delete of Instructor Led Couses Permissions
        ARRolesAddEditPage.getSelectCheckboxBySectionNameAndIndexNumber('courses', 0, 'View')
        ARRolesAddEditPage.getSelectCheckboxBySectionNameAndIndexNumber('courses', 0, 'Delete')
       
        //Saving the role 
        cy.get(ARRolesAddEditPage.getSaveBtn()).contains('Save').click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')
        //Add the role to new user
        ARDashboardPage.getUsersReport()
        ARUserAddEditPage.getEditUserByUsername(userDetails.username)

        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Edit User")
        ARDashboardPage.getMediumWait()
        //Give the user admin permission
        ARUserAddEditPage.generalToggleSwitch('true', ARUserAddEditPage.getAdminToggleContainer())
        ARUserAddEditPage.getAddRoleByName(rolesDetails.roleName)
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Users')
    })

    it(`Login as  ${userDetails.username} in AE and verify that 'Add Instructor Led' is not available`, () => {

        //Log in with custom user
        cy.apiLoginWithSession(userDetails.username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Go to courses page
        ARDashboardPage.getCoursesReport()
        //Filter out a Instructor Led course
        ARCoursesPage.AddFilter('Name', 'Equals', courses.ilc_filter_01_name)
        //Asserting that 'Add Instructor Led' is not accessible
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Instructor Led')).should('have.attr', 'aria-disabled', 'true')
        //Asserting different buttons are not accessible for lack of permissions 
        cy.get(ARDashboardPage.getTableCellRecord()).contains(courses.ilc_filter_01_name).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')

        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit')).should('have.attr', 'aria-disabled', 'true')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Duplicate')).should('have.attr', 'aria-disabled', 'true')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Enroll User')).should('have.attr', 'aria-disabled', 'true')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Course Enrollments')).should('have.attr', 'aria-disabled', 'true')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('View Activity Report')).should('have.attr', 'aria-disabled', 'true')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Ratings')).should('have.attr', 'aria-disabled', 'true')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Manage Comments')).should('have.attr', 'aria-disabled', 'true')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete')).should('have.attr', 'aria-disabled', 'true')

        cy.logoutAdmin()

    })

    it(`Editing ${rolesDetails.roleName} to ADD modify Instructor Led Permission`, () => {
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
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Edit Role')).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Edit Role")
        ARRolesAddEditPage.getSelectCheckboxBySectionNameAndIndexNumber('courses', 0, 'Modify')
        ARRolesAddEditPage.getSelectCheckboxSubMenuBySectionNameAndIndexNumber('courses', 0, 'Sessions')
        //Saving the role 
        cy.get(ARRolesAddEditPage.getSaveBtn()).contains('Save').click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Roles')
        cy.get(ARDashboardPage.getTableCellRecord()).contains(rolesDetails.roleName).click()
    })


    it(` verifying ${userDetails.username} have access to 'Add Instructor Led' and other features`, () => {
        //Log in with custom user
        cy.apiLoginWithSession(userDetails.username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Go to courses page
        ARDashboardPage.getCoursesReport()
        //Asserting that 'Add Instructor Led' is not accessible
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARCoursesPage.getCoursesActionsButtonsByLabel('Add Instructor Led')))
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Instructor Led')).should('have.attr', 'aria-disabled', 'false')
        //Asserting other buttons are not accessible
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Online Course')).should('have.attr', 'aria-disabled', 'true')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Curriculum')).should('have.attr', 'aria-disabled', 'true')

        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Instructor Led')).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
        //Asserting page header is there
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Add Instructor Led Course')
        cy.go('back')
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
        //Filter out a Instructor Led
        ARCoursesPage.AddFilter('Name', 'Equals', courses.ilc_filter_01_name)
        cy.get(ARDashboardPage.getTableCellRecord()).contains(courses.ilc_filter_01_name).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
        //Asserting that All the permissions are available
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit')).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Duplicate')).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Enroll User')).should('have.attr', 'aria-disabled', 'true')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Course Enrollments')).should('have.attr', 'aria-disabled', 'true')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('View Activity Report')).should('have.attr', 'aria-disabled', 'true')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Ratings')).should('have.attr', 'aria-disabled', 'true')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Manage Comments')).should('have.attr', 'aria-disabled', 'true')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete')).should('have.attr', 'aria-disabled', 'false')

        //Edit the course 
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit')).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
        //Edit Instructor Led
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Edit Instructor Led Course')

         //Add a session and open enrollment section
         ARILCAddEditPage.getAddSession(ilcDetails.sessionName, ARILCAddEditPage.getFutureDate(2))
         cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).type(`${ilcDetails.sessionDescription}`)
               
         cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
         cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()
         
         // Save Session
         cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()

         //Verifying that the session is present 
         ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
         cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false').clear().type(ilcDetails.sessionName_edited)

         // Save Session
         cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
         //Deleting the edited session
         ARILCAddEditPage.getDeleteSessionByName(ilcDetails.sessionName_edited)
         cy.get(ARCoursesPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()

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
})
