import { users } from '../../../../../../helpers/TestData/users/users'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import {userDetails}  from '../../../../../../helpers/TestData/users/UserDetails'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import arLearnerActivityReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARLearnerActivityReportPage'
import ARUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import ARLearnerProgressReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARLearnerProgressReportPage'
import ARPublishModal from '../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal'

describe('C7277 - AE - Core Regression - Learner Progress - Enroll users', function () {
    before('Should create a user and course for learner progress', () =>  {
        // Login as an Admin and navigate to the Dashboard page
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getUsersReport()    
        // Create a new user
        cy.wrap(ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getAddEditMenuActionsByName('Add User'), 1000))
        cy.get(ARUserAddEditPage.getAddEditMenuActionsByName('Add User')).click()
        
        // Input general fields
        cy.get(ARUserAddEditPage.getFirstNameTxtF()).type(userDetails.firstName)
        cy.get(ARUserAddEditPage.getLastNameTxtF()).type(userDetails.lastName)
        cy.get(ARUserAddEditPage.getUsernameTxtF()).type(userDetails.username)
        cy.get(ARUserAddEditPage.getPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getConfirmPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.dept_top_name])
        arLearnerActivityReportPage.getShortWait()
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', 'User has been created successfully.')
        arLearnerActivityReportPage.getMediumWait()
        // Create a new course
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        cy.createCourse('Online Course')
        arLearnerActivityReportPage.getMediumWait()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
        arLearnerActivityReportPage.getMediumWait()
    })
    
    after('Delete the new user and course as part of clean-up', () => {
        // Login as an Admin and navigate to the Dashboard page
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getVLongWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        ARDashboardPage.getShortWait()
        ARDashboardPage.getMediumWait()
        cy.wrap(ARUserPage.AddFilter('Username', 'Contains', userDetails.username))
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getShortWait()
        cy.wrap(ARUserPage.WaitForElementStateToChange(ARUserPage.getAddEditMenuActionsByName('Delete'), 5000))
        cy.get(ARUserPage.getAddEditMenuActionsByName('Delete')).click()
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click() 

        // Delete the new Course
        cy.deleteCourse(commonDetails.courseID)
        ARDashboardPage.getLongWait()
    })

    it("Attempt to choose a Course to Enroll for the Learner, Cancel the attempt and Save finally", () => {
        // Login as an Admin and navigate to the Dashboard page
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getMediumWait()

        // Click on reports from left hand panel 
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Learner Progress'))
        arLearnerActivityReportPage.getLongWait()
        cy.get(arLearnerActivityReportPage.getPageHeaderTitle()).should('have.text', "Learner Progress")
        arLearnerActivityReportPage.getShortWait()
        // Select a Learner from the existing Learner Progress report
        cy.wrap(arLearnerActivityReportPage.AddFilter('Username', 'Contains', userDetails.username))
        arLearnerActivityReportPage.getLongWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()

        // Assert that the Action items should be displayed
        cy.get(ARLearnerProgressReportPage.getActionContextMenu()).should('exist').and('be.visible')

        // Click on edit user      
        arLearnerActivityReportPage.getShortWait()
        cy.get(ARLearnerProgressReportPage.getAddEditMenuActionsByName('Edit User')).click()
        arLearnerActivityReportPage.getLongWait()

        // Assert that the Edit user page should be displayed
        cy.get(arLearnerActivityReportPage.getPageHeaderTitle()).should('have.text', "Edit User")
        // Assert that Action item also displayed on the Eidt User page
        cy.get(arLearnerActivityReportPage.getEditUserContextMenu()).should('exist').and('be.visible')

        // Click on enroll users and Asserting Enroll user page should be displayed.
        cy.get(arLearnerActivityReportPage.getAddEditMenuActionsByName('Enroll User')).click()
        arLearnerActivityReportPage.getMediumWait()
        
        // Click on Add course and Click on choose button
        cy.get(arLearnerActivityReportPage.getAddCoursesBtn2Enroll()).click()
        arSelectModal.SearchAndSelectFunction([ocDetails.courseName])
        arLearnerActivityReportPage.getShortWait()

        cy.get(arCoursesPage.getCancelBtn()).click({ force: true })  
        arLearnerActivityReportPage.getLShortWait()
        cy.get(ARPublishModal.getContinueBtn()).click()
        arLearnerActivityReportPage.getMediumWait()

        // Assert that the Admin still stays in Edit User page
        cy.get(arLearnerActivityReportPage.getPageHeaderTitle()).should('have.text', "Edit User")
        arLearnerActivityReportPage.getShortWait()

        // Enroll in a course again and Save this time instead of Cancel
        // Click on enroll users and Asserting Enroll user page should be displayed.
        cy.get(arLearnerActivityReportPage.getAddEditMenuActionsByName('Enroll User')).click()
        arLearnerActivityReportPage.getMediumWait()
        
        // Click on Add course and Click on choose button
        cy.get(arLearnerActivityReportPage.getAddCoursesBtn2Enroll()).click()
        arSelectModal.SearchAndSelectFunction([ocDetails.courseName])
        arLearnerActivityReportPage.getShortWait()

        cy.get(arCoursesPage.getSaveBtn()).click({ force: true })  
        arLearnerActivityReportPage.getLShortWait()
        cy.get(arLearnerActivityReportPage.getToastSuccessMsg()).should('contain', 'User has been enrolled.')
        arLearnerActivityReportPage.getMediumWait()

        // Click on save button
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        arLearnerActivityReportPage.getShortWait()
    })
})