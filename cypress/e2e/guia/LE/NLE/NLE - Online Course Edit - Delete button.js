import ARManageCategoryPage from "../../../../../helpers/AR/pageObjects/Category/ARManageCategoryPage"
import ARCoursesPage from "../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARCBAddEditPage from "../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage"
import ARAddMoreCourseSettingsModule from "../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import AROCAddEditPage from "../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARDashboardPage from "../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARSelectModal from "../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import ARRolesAddEditPage from "../../../../../helpers/AR/pageObjects/Roles/ARRolesAddEditPage"
import ARUserAddEditPage from "../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage"
import ARUserPage from "../../../../../helpers/AR/pageObjects/User/ARUserPage"
import LECatalogPage from "../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage"
import LEDashboardPage from "../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEFilterMenu from "../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu"
import { commonDetails } from "../../../../../helpers/TestData/Courses/commonDetails"
import { ocDetails } from "../../../../../helpers/TestData/Courses/oc"
import { departments } from "../../../../../helpers/TestData/Department/departments"
import { rolesDetails } from "../../../../../helpers/TestData/Roles/rolesDetails"
import { userDetails } from "../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../helpers/TestData/users/users"

describe('C2039 - NLE-2643 - Online Course Edit - Delete button', () => {
    before('Create a Role and an Admin for the test', function() {        
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin/dashboard')
        ARDashboardPage.getMediumWait()

        // Create a Role disabling duplicate sesssion permission
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users',{timeout:5000}))).click()
        ARDashboardPage.getMenuItemOptionByName('Roles')
        cy.intercept('/api/rest/v2/admin/reports/roles/operations').as('getRoles').wait('@getRoles')

        cy.wrap(ARRolesAddEditPage.WaitForElementStateToChange(ARRolesAddEditPage.getAddEditMenuActionsByName('Add Role'), 1000))
        cy.get(ARRolesAddEditPage.getElementByTitleAttribute('Add Role')).click()
        cy.get(ARRolesAddEditPage.getGeneralNameTxtF()).clear().type(rolesDetails.roleName)  
        cy.get(ARRolesAddEditPage.getGeneralDescriptionTxtF()).clear().type(rolesDetails.roleDescription)
        cy.get(ARRolesAddEditPage.getCourseSelectAllCheckBox()).should("have.text","Select All").click({ force: true })

        // Save the role
        cy.get(ARRolesAddEditPage.getSaveBtn()).contains('Save').click()
        ARRolesAddEditPage.getLongWait()

        // Add a new Admin without duplication session prvilege 
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Users')).eq(0).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')

        cy.wrap(ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getAddEditMenuActionsByName('Add User'), 1000))
        cy.get(ARUserAddEditPage.getAddEditMenuActionsByName('Add User')).click()
        cy.intercept('/api/rest/v2/admin/reports/users').as('getUser').wait('@getUser')

        // Fill out general section fields
        cy.get(ARUserAddEditPage.getFirstNameTxtF()).type(userDetails.firstName2)
        cy.get(ARUserAddEditPage.getMiddleNameTxtF()).type(userDetails.middleName)
        cy.get(ARUserAddEditPage.getLastNameTxtF()).type(userDetails.lastName)
        cy.get(ARUserAddEditPage.getEmailAddressTxtF()).type(userDetails.emailAddress)
        cy.get(ARUserAddEditPage.getUsernameTxtF()).type(userDetails.username)
        cy.get(ARUserAddEditPage.getPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getConfirmPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.dept_top_name])

        // Turn Learner toggle OFF and turn Admin toggle ON
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute(ARUserAddEditPage.getLearnerToggleContainer()) + ' ' + ARUserAddEditPage.getToggleEnabled()).click()
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute(ARUserAddEditPage.getAdminToggleContainer()) + ' ' + ARUserAddEditPage.getToggleDisabled()).click()

        // Assign the role just created
        ARUserAddEditPage.getMediumWait()
        cy.get(ARUserAddEditPage.getRolesDDown()).click()
        
        cy.get(ARUserAddEditPage.getRolesDDownSearchTxtF()).type(rolesDetails.roleName)
        cy.get(ARUserAddEditPage.getRolesDDownOpt()).contains(rolesDetails.roleName).click()
        ARUserAddEditPage.getMediumWait()

        // Save the Admin user
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        ARUserAddEditPage.getLongWait()
    })

    after('Delete role and the Admin user', () => {
        // Delete Role
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getLongWait()

        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users',{timeout:5000}))).click()
        ARDashboardPage.getMenuItemOptionByName('Roles')
        cy.intercept('/api/rest/v2/admin/reports/roles/operations').as('getRoles').wait('@getRoles')
        
        ARRolesAddEditPage.AddFilter('Name', 'Contains', rolesDetails.roleName)
        ARRolesAddEditPage.getMediumWait()
        cy.get("body").then($body => {
            if ($body.find(ARRolesAddEditPage.getNoResultMsg()).length > 0) {
                // do nothing here
            } else {
                ARManageCategoryPage.SelectManageCategoryRecord()
                cy.wrap(ARRolesAddEditPage.WaitForElementStateToChange(ARRolesAddEditPage.getAddEditMenuActionsByName('Delete Role'), 1000))
                cy.get(ARRolesAddEditPage.getAddEditMenuActionsByName('Delete Role')).click()
                //Click on delete button on delete role pop up
                cy.get(ARRolesAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
                cy.get(ARRolesAddEditPage.getNoResultMsg()).should('have.text', 'No results found.')
            }
        })

        // Delete User
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users',{timeout:5000}))).click()
        ARDashboardPage.getMenuItemOptionByName('Users')
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
        ARDashboardPage.getShortWait()
        
        // Filter user
        cy.wrap(ARUserPage.AddFilter('Username', 'Contains', userDetails.username))
        ARUserPage.getMediumWait()
        cy.get(ARUserPage.getGridTable()).should('have.length', 1)
        cy.get(ARUserPage.getGridTable()).eq(0).click()
        ARUserPage.getMediumWait()
        cy.wrap(ARUserPage.WaitForElementStateToChange(ARUserPage.getAddEditMenuActionsByName('Delete'), 1000))
        cy.get(ARUserPage.getAddEditMenuActionsByName('Delete')).click()
        cy.get(ARUserPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        ARUserPage.getMediumWait()
        cy.get(ARUserPage.getNoResultMsg()).contains('No results found.').should('exist')
    })

    it('Create an Online Course for test later', () => {
        // cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin/dashboard')
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword, '/admin')
        ARDashboardPage.getMediumWait()

        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses',{timeout:5000}))).click()
        ARDashboardPage.getMenuItemOptionByName('Courses')
        ARDashboardPage.getMediumWait()
        // Create Online Course
        cy.createCourse('Online Course')
        AROCAddEditPage.getShortWait()
        cy.get(ARCBAddEditPage.getAutomaticTaggingToggle() + ' ' + ARCoursesPage.getEnableToggleStatus()).should('have.text', 'On')
        // Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        AROCAddEditPage.getShortWait()
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()
        // publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
    })

    it('New admin login and Edit online course, attempt to delete and cancel', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword, '/admin/dashboard')
        ARDashboardPage.getLongWait()

        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses', {timeout:5000}))).click()
        ARDashboardPage.getMenuItemOptionByName('Courses')
        ARDashboardPage.getLongWait()
        
        // Filter for existing collaboration and edit it
        cy.wrap(ARCoursesPage.AddFilter('Name', 'Contains', ocDetails.courseName))
        // Select filtered course
        cy.get(ARCoursesPage.getGridTable()).should('have.length', 1)
        cy.get(ARCoursesPage.getGridTable()).eq(0).click()
        ARCoursesPage.getShortWait()
        cy.wrap(ARCoursesPage.WaitForElementStateToChange(ARCoursesPage.getAddEditMenuActionsByName('Edit'), 1000))
        ARCoursesPage.getShortWait()
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Edit')).click()
        ARCoursesPage.getLongWait()
        // Assert that we are now in the edit course page
        cy.get(AROCAddEditPage.getPageHeaderTitle()).should('contain', 'Edit Online Course')
        // Attempt to delete the course from within the edit course page
        cy.wrap(AROCAddEditPage.WaitForElementStateToChange(AROCAddEditPage.getElementByDataNameAttribute(AROCAddEditPage.getDeleteCourseButton()), 5000))
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(AROCAddEditPage.getDeleteCourseButton())).should('be.visible').and('contain', 'Delete')
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(AROCAddEditPage.getDeleteCourseButton())).click()
        AROCAddEditPage.getMediumWait()
        // Assert that the Prompt modal contains correct header and content
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeletePromptHeader())).should('have.text', 'Delete Course')
        cy.get(ARDeleteModal.getDeletePromptContent()).should('have.text', `Are you sure you want to delete '${ocDetails.courseName}'?`) 
        // Assert that both Delete and Cancel buttons are present and cancel the delete attempt
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).should('be.visible')
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getCancelBtn())).should('be.visible').eq(0).click()
        
        // Assert that the course is deleted and we are still on the edit course page
        cy.get(AROCAddEditPage.getPageHeaderTitle()).should('contain', 'Edit Online Course')
    })

    it('New admin login and Edit online course, attempt to delete and finally delete the course', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword, '/admin')
        ARDashboardPage.getMediumWait()

        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses', {timeout:5000}))).click()
        ARDashboardPage.getMenuItemOptionByName('Courses')
        ARDashboardPage.getMediumWait()
        // Filter for existing collaboration and edit it
        cy.wrap(AROCAddEditPage.AddFilter('Name', 'Contains', ocDetails.courseName))
        // select filter course
        cy.get(AROCAddEditPage.getGridTable()).should('have.length', 1)
        cy.get(AROCAddEditPage.getGridTable()).eq(0).click()
        AROCAddEditPage.getShortWait()
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(AROCAddEditPage.getDeleteCourseButton())).should('be.visible').and('contain', 'Delete').click()
        // Asserting Prompt
        cy.get(AROCAddEditPage.getElementByDataNameAttribute('prompt-header')).should('have.text', 'Delete Course')
        cy.get(AROCAddEditPage.getElementByDataNameAttribute('prompt-content')).should('have.text', `Are you sure you want to delete '${ocDetails.courseName}'?`)
        //Click on delete button
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getCancelBtn())).should('be.visible')
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).should('be.visible').click()
        AROCAddEditPage.getMediumWait()
        // Assert that the the course does no longer exist in the Courses Report
        cy.get(AROCAddEditPage.getNoResultMsg()).should('have.text', "No results found.")
    })

    it('Login Learner side to verify that the deleted course is no longer found', () => {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEDashboardPage.getMediumWait()
        LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
        LEDashboardPage.getMediumWait()
        LECatalogPage.getSearchCourseNotFoundMsg()
    })
})

