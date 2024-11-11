import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARUnsavedChangesModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal'
import ARCourseEnrollmentReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCourseEnrollmentReportPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import ARAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'
import ARCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'

describe('AUT-584 - C2044 , GUIA-Story - NLE-2648 Curricula Edit  - View Activity Report button', function () {
    before('Create CURR, Publish Course', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()

        // Create Curriculum course  
        cy.createCourse('Curriculum')

        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        // Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        // Select Allow Self Enrollment All learner Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        // Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
    })

    after('Delete Created Course', function () {
        cy.deleteCourse(commonDetails.courseID, 'curricula')
    })

    it('View Activity Report From Instructor Led Course Edit Page', () => {
        cy.editCourse(currDetails.courseName)

        // Verify that [View Activity Report] button has been added to ILC edit page
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('View Activity Report')).should('be.visible')

        // Verify that the added button is the 2nd last and above the [View Enrollments] button
        cy.get(ARCURRAddEditPage.getCURREditActionBtn()).eq(-2).contains('View Activity Report')
        cy.get(ARCURRAddEditPage.getCURREditActionBtn()).eq(-1).contains('Course Enrollments')

        // clicking [View Activity Report] button
        // cy.get(ARCURRAddEditPage.getCURREditActionBtn() + ARCoursesPage.getCoursesActionsButtonsByLabel('View Activity Report')).click()
        cy.get(ARCURRAddEditPage.getCURREditActionBtn()).contains('View Activity Report').click()

        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
        cy.get(ARDeleteModal.getARDeleteBtn(), { timeout: 10000 }).should('be.visible').click()
        cy.get(ARDeleteModal.getARDeleteBtn(), { timeout: 10000 }).should('not.exist')

        // Verify Admin redirected to the ILC Activity report
        cy.get(ARCoursesPage.getPageHeaderTitle(), { timeout: 10000 }).should('be.visible')
        cy.get(ARCoursesPage.getWaitSpinner()).should('not.exist')

        // Verify Page is filtered based on previously selected course
        ARCourseEnrollmentReportPage.verifyFilteredPropertyAndValue('Course', currDetails.courseName)
    })
})