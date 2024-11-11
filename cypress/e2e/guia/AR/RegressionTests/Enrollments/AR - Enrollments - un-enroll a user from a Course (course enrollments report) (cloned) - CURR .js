
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARGenerateReportModal from "../../../../../../helpers/AR/pageObjects/Modals/ARGenerateReportModal"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import ARUnsavedChangesModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal"
import ARCourseActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseActivityReportPage"
import ARCourseEnrollmentReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseEnrollmentReportPage"
import ARCurriculaActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCurriculaActivityReportPage"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import ARUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage"
import { cbDetails } from "../../../../../../helpers/TestData/Courses/cb"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { currDetails } from "../../../../../../helpers/TestData/Courses/curr"
import { ilcDetails } from "../../../../../../helpers/TestData/Courses/ilc"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"



describe('C866 - AUT-287 - un-enroll a user from a Course (course enrollments report) (cloned) - Curriculum course', () => {
    before("create a new user and an online course and enroll that user to the course", () => {
        // Create a user for enrollment
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        //Log into the admin side
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()

        cy.createCourse('Curriculum', currDetails.courseName)
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])

        // Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

        // Enroll User 
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([currDetails.courseName], [userDetails.username])

    })

    after('Delete the user and course as part of clean-up', () => {
        // Delete user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getUsersReport()
        ARUserPage.deleteUser('Username',userDetails.username)

          // Delete Course
          cy.deleteCourse(commonDetails.courseID, 'curricula')

    })

    beforeEach('Login as an admin to execute the tests', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    it("Un-enroll Button Appear's in the Course Enrollments report when a single user is selected", () => {
        //Go to Course Enrollments Report page
        ARDashboardPage.getCourseEnrollmentReport()
        //Filter out the course 
        cy.get(ARCourseEnrollmentReportPage.getFilterItem()).click({ force: true })
        //Selecting Course in Choose Course 
        ARCourseActivityReportPage.ChooseAddFilter(currDetails.courseName)
        //Filtering out the is enrollments to true
        ARDashboardPage.AddFilter('Is Enrolled', 'Yes')
        //Asserting user has been enrolled 
        cy.get(ARDashboardPage.getTableCellContentByIndex(4)).should('contain', userDetails.username).click()
        //After clicking Un enroll User button appears 
        //waiting for element to appear
        cy.wrap(ARUserPage.WaitForElementStateToChange(ARUserPage.getAddEditMenuActionsByName('Un-enroll User'), AREnrollUsersPage.getShortWait()))
        //Asserting Un-enroll User Button
        cy.get(ARUserPage.getAddEditMenuActionsByName('Un-enroll User')).should('exist')
        cy.get(ARUserPage.getAddEditMenuActionsByName('Un-enroll User')).should('have.attr', 'aria-disabled', 'false').click()
        //Asserting Un enroll modal appears 
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Un-enroll')
        //Asserting the Modal message
        cy.get(ARDeleteModal.getDeletePromptContent()).should('contain', "Are you sure you want to delete this enrollment?")
        //Clicking on the Cancel button
        cy.get(ARUnsavedChangesModal.getCancelBtn()).click()
        //Clicking on Cancel button persists enrollment
        cy.get(ARDashboardPage.getTableCellContentByIndex(4)).should('contain', userDetails.username)
        //Unenroll a user
        cy.get(ARUserPage.getAddEditMenuActionsByName('Un-enroll User')).click()
        //Asserting Un enroll modal appears 
        cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Un-enroll')
        //Cliking on Ok button
        cy.get(ARUnsavedChangesModal.getOKBtn()).click()
        //Asserting Toast message appears
        cy.get(ARCurriculaActivityReportPage.getToastSuccessMsg()).should('contain', 'User has been un-enrolled.')

        cy.get(ARDashboardPage.getNoResultMsg()).should('have.text', "No results found.")

    })


})