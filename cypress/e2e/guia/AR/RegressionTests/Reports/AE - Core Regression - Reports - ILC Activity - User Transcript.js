import AdminNavationModuleModule from "../../../../../../helpers/AR/modules/AdminNavationModule.module"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARCurriculaActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCurriculaActivityReportPage"
import ARILCActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARILCActivityReportPage"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import ARUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { ilcDetails } from "../../../../../../helpers/TestData/Courses/ilc"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import defaultTestData from '../../../../../fixtures/defaultTestData.json'

describe('C7267 - AUT-666 - AE - Reports - Core Regression - ILC Activity User Transcript', () => {

    before('Create a new user and an ILC course, enroll the user for the test', () => {
        // Create learner user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()      
        // Create Instructor Led course
        cy.createCourse('Instructor Led')
        ARDashboardPage.getMediumWait()
        // Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        // Select Allow Self Enrollment Alll learner Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        // Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })

        // Enroll User 
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName], [userDetails.username])
    })

    beforeEach('Log in as a system admin', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
    })

    after("Delete the new user and course as part of clean-up", () => {
        // Delete Course
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
        // Delete user
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getLongWait()
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Navigate to ILC Activity page, view and attempt to print transcript, navigate back, finally print the transcript', () => {
        // Admin dashboard
        cy.url('/admin/dashboard').should('exist')
        // Redirect to the left panel and click on the Reports Icon
        AdminNavationModuleModule.navigateToILCActivityPage()        
        ARDashboardPage.getMediumWait()
        // Filter course
        ARCurriculaActivityReportPage.ChooseAddFilter(ilcDetails.courseName)

        // Filter enrolled user selection
        ARCurriculaActivityReportPage.AddFilter('First Name', 'Contains', defaultTestData.USER_LEARNER_FNAME)
        cy.get(ARCurriculaActivityReportPage.getA5TableCellRecordByColumn(4)).contains(defaultTestData.USER_LEARNER_LNAME).should('be.visible').click()
        ARDashboardPage.getMediumWait()

        // ILC Activity page right menu display
        ARILCActivityReportPage.getRightActionMenuLabel()

        // Right Action Menu User transcript btn click
        cy.get(ARILCActivityReportPage.getUserTranscriptBtn()).click()
        ARDashboardPage.getMediumWait()
        // User transcript page header title
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', "User Transcript")

        // Select back button and come back to course activity page 
        cy.get(ARILCActivityReportPage.getBackBtn()).click()
        ARDashboardPage.getLongWait()

        // Course activity page display
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', "ILC Activity")

        cy.get(ARCurriculaActivityReportPage.getA5TableCellRecordByColumn(4)).contains(defaultTestData.USER_LEARNER_LNAME).should('be.visible')
        ARDashboardPage.getMediumWait()
        // Right Action Menu User transcript btn click
        cy.get(ARILCActivityReportPage.getUserTranscriptBtn()).click()
        ARDashboardPage.getMediumWait()

        cy.get(ARILCActivityReportPage.getPrintTranscriptBtn()).click()
        ARDashboardPage.getVLongWait()

        // View Competencies Btn click
        cy.get(ARILCActivityReportPage.getViewCompetenciesBtn()).click()
        ARDashboardPage.getVLongWait()
        // Learner Competencies page title
        cy.get(ARILCActivityReportPage.getILCActivityTitle()).should('contain', "Learner Competencies")
    })

    it('Navigate to ILC Activity page, view Transcript, navigate back, and finally navigate to Certificate page', () => {
        // Redirect to the left panel and click on the Reports Icon
        AdminNavationModuleModule.navigateToILCActivityPage()
        ARDashboardPage.getMediumWait()
        // Filter course
        ARCurriculaActivityReportPage.ChooseAddFilter(ilcDetails.courseName)

        // Filter enrolled user selection
        ARCurriculaActivityReportPage.AddFilter('First Name', 'Contains', defaultTestData.USER_LEARNER_FNAME)
        cy.get(ARCurriculaActivityReportPage.getA5TableCellRecordByColumn(4)).contains(defaultTestData.USER_LEARNER_LNAME).should('be.visible').click()
        ARDashboardPage.getMediumWait()

        // ILC Activity page right menu display
        ARILCActivityReportPage.getRightActionMenuLabel()
        // Right Action Menu User transcript btn click
        cy.get(ARILCActivityReportPage.getUserTranscriptBtn()).click()
        ARDashboardPage.getMediumWait()
        // User transcript page header title
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', "User Transcript")
        // View Certificate Btn click
        cy.get(ARILCActivityReportPage.getViewCertificateBtn()).click()
        ARDashboardPage.getMediumWait()
        // Certificares page title
        cy.get(ARILCActivityReportPage.getILCActivityTitle()).should('contain', "Certificates")
    })

    it('Navigate to ILC Activity page, view Transcript, and navigate to Credits page', () => {
        AdminNavationModuleModule.navigateToILCActivityPage()
        ARDashboardPage.getMediumWait()
        // Filter course
        ARCurriculaActivityReportPage.ChooseAddFilter(ilcDetails.courseName)

        // Filter enrolled user selection
        ARCurriculaActivityReportPage.AddFilter('First Name', 'Contains', defaultTestData.USER_LEARNER_FNAME)
        cy.get(ARCurriculaActivityReportPage.getA5TableCellRecordByColumn(4)).contains(defaultTestData.USER_LEARNER_LNAME).should('be.visible').click()
        ARDashboardPage.getMediumWait()

        // ILC Activity page right menu display
        ARILCActivityReportPage.getRightActionMenuLabel()
        // Right Action Menu User transcript btn click
        cy.get(ARILCActivityReportPage.getUserTranscriptBtn()).click()
        ARDashboardPage.getMediumWait()
        // User transcript page header title
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', "User Transcript")
        // View Credits btn click
        cy.get(ARILCActivityReportPage.getViewCreditsBtn()).click()
        ARDashboardPage.getMediumWait()
        // Credits page title
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', "Credits")
    })

    it('Navigate to ILC Activity page, view Transcript, and navigate to Users Enrollment page', () => {
        AdminNavationModuleModule.navigateToILCActivityPage()
        ARDashboardPage.getMediumWait()
        // Filter course
        ARCurriculaActivityReportPage.ChooseAddFilter(ilcDetails.courseName)

        // Filter enrolled user selection
        ARCurriculaActivityReportPage.AddFilter('First Name', 'Contains', defaultTestData.USER_LEARNER_FNAME)
        cy.get(ARCurriculaActivityReportPage.getA5TableCellRecordByColumn(4)).contains(defaultTestData.USER_LEARNER_LNAME).should('be.visible').click()
        ARDashboardPage.getMediumWait()

        // ILC Activity page right menu display
        ARILCActivityReportPage.getRightActionMenuLabel()

        // Right Action Menu User transcript btn click
        cy.get(ARILCActivityReportPage.getUserTranscriptBtn()).click()
        ARDashboardPage.getMediumWait()
        // User transcript page header title
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', "User Transcript")
        // User Enrollments btn click
        cy.get(ARILCActivityReportPage.getViewEnrollmentsBtn()).click()
        ARDashboardPage.getMediumWait()
        // User Enrollments page title
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', "User Enrollments")
    })
})