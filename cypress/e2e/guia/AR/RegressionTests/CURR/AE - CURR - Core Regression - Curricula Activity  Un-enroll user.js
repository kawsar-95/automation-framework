import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import ARCurriculaActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCurriculaActivityReportPage"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import ARUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { currDetails } from "../../../../../../helpers/TestData/Courses/curr"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import defaultTestData from '../../../../../fixtures/defaultTestData.json'

describe('C7290 AE Regression - Curricula Activity  Un-enroll user', () => {

    before('Create a Learner user and Curriculam course, finally enroll the new user', () => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        
        // Create Curriculum course
        cy.createCourse('Curriculum')
      
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        //Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        // Select Allow Self Enrollment Alll learner Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')        
        // Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
       
        // Enroll User 
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([currDetails.courseName], [userDetails.username])
    })

    after('Delete Course and User as part of clean-up', () => {
        cy.deleteCourse(commonDetails.courseID, 'curricula')
        // Delete User
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getUsersReport()
        ARUserPage.deleteUser('Username',userDetails.username)
    })

    it('Curricula Activity Un-enroll user', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCurriculaActivityReport()
        
        // Filter course
        ARCurriculaActivityReportPage.ChooseAddFilter(currDetails.courseName)
       
        // Filter enrolled user
        ARCurriculaActivityReportPage.AddFilter('First Name', 'Contains', defaultTestData.USER_LEARNER_FNAME)
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.get(ARCurriculaActivityReportPage.getA5TableCellRecordByColumn(2)).contains(defaultTestData.USER_LEARNER_LNAME).should('be.visible').click()
        ARCurriculaActivityReportPage.getShortWait()

        // Assert that action items are be displayed
        cy.get(ARCurriculaActivityReportPage.getRightContextMenu()).children().should(($child) => {
            expect($child).to.contain('Edit Activity')
            expect($child).to.contain('User Transcript')
            expect($child).to.contain('Edit User')
            expect($child).to.contain('Message User')
            expect($child).to.contain('View Enrollments')
            expect($child).to.contain('Un-enroll User')
            expect($child).to.contain('Deselect')
        })
        // Right Action Menu Un-enroll btn click
        cy.get(ARDashboardPage.getElementByDataNameAttribute("unenroll-user-single-context-button")).click()
       
        cy.get(ARDashboardPage.getElementByDataNameAttribute("prompt-header"),{timeout:15000}).should('be.visible')
        // Assert that a pop up window is displayed
        cy.get(ARDashboardPage.getElementByDataNameAttribute("prompt-header")).should('contain', "Un-enroll")
        // Assert popup message
        cy.get(ARDashboardPage.getElementByDataNameAttribute("prompt-content")).should('contain', "Are you sure you want to delete this enrollment?")
        cy.get(ARDashboardPage.getElementByDataNameAttribute("cancel")).contains('Cancel')
        cy.get(ARDashboardPage.getElementByDataNameAttribute("confirm")).contains('OK').click()
        // User un-enrolled msg popup
        cy.get(ARCurriculaActivityReportPage.getToastSuccessMsg()).should('contain', 'User has been un-enrolled.')
       
        // Assert that the page stays still at Curricula Activity
        cy.url('/admin/curriculaActivity').should('exist')
    })
})