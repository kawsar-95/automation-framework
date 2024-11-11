import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARUserUnEnrollModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUserUnEnrollModal"
import ARCourseActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseActivityReportPage"
import ARCourseEnrollmentReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseEnrollmentReportPage"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import ARUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"




describe("C870 AUT-291, AR - Enrollments - Enrollments by Course Mass Action Re-Enroll (cloned)", () => {

    before(()=>{
        //create a new user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()

        // Create ILC course
        cy.createCourse('Online Course', ocDetails.courseName)

        // Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
    })

   

    beforeEach("Prerequisite", () => {
        //Login into the admin side 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        //Go to Course Enrollment page
        ARDashboardPage.getCourseEnrollmentReport()
    })

    it("Admin can select multiple lines in Course Enrollments Report and The re-enroll tool does not appear", () => {
        //Clicking on Course Choose button
        cy.get(ARCourseEnrollmentReportPage.getFilterItem()).click({ force: true })
        //Selecting Course in Choose Course 
        ARCourseActivityReportPage.ChooseAddFilter(ocDetails.courseName)

        // filter user
        ARDashboardPage.AddFilter('Username', 'Contains', users.learner01.learner_01_username)
        ARDashboardPage.AddFilter('Username', 'Contains', users.learner02.learner_02_username)

        cy.get(ARDashboardPage.getRowSelectOptionsBtn()).click({ force: true })
        cy.get(ARDashboardPage.getSelectThisPageOptionBtn()).click()

        //waiting for element to appear
        cy.wrap(ARUserPage.WaitForElementStateToChange(ARUserPage.getAddEditMenuActionsByName('Re-enroll Users')))
        //Asserting Re-enroll Users Button
        cy.get(ARUserPage.getAddEditMenuActionsByName('Re-enroll Users'), {timeout:10000}).should('have.attr', 'aria-disabled', 'true')
    })

    it("Admin can select multiple lines in Course Enrollments Report and The re-enroll tool does appear", function () {
        //Clicking on Course Choose button
        cy.get(ARCourseEnrollmentReportPage.getFilterItem()).click({ force: true })
        //Selecting Course in Choose Course 
        ARCourseActivityReportPage.ChooseAddFilter(ocDetails.courseName)

        // filter user
        ARDashboardPage.AddFilter('Username', 'Contains', users.learner01.learner_01_username)
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
       

        cy.get(ARDashboardPage.getRowSelectOptionsBtn()).click({ force: true })
        cy.get(ARDashboardPage.getSelectThisPageOptionBtn()).click()

        //waiting for element to appear
        cy.wrap(ARUserPage.WaitForElementStateToChange(ARUserPage.getAddEditMenuActionsByName('Re-enroll Users')))
        //Asserting Re-enroll Users Button
        cy.get(ARUserPage.getAddEditMenuActionsByName('Re-enroll Users'), {timeout:10000}).should('have.attr', 'aria-disabled', 'false')

        //Clicking on Re enroll User button
        cy.get(ARUserPage.getAddEditMenuActionsByName('Re-enroll Users')).should('exist').click()

        // Cancel the re-enrollment request
        //Asserting Modal
        cy.get(ARDashboardPage.getModalTitle()).should('have.text', 'Re-enroll Users')
        //Clicking on Cancel button  
        cy.get(ARUserUnEnrollModal.getModalNotification()).should('have.text', 'There are 2 users selected.')
        cy.get(ARUserUnEnrollModal.getCancelBtn(), {timeout:10000}).should('be.visible').click()
        cy.get(ARUserUnEnrollModal.getCancelBtn(), {timeout:10000}).should('not.exist')

        // Verify items still selected
        cy.get(ARDashboardPage.getSelectRowCheckbox()).should('have.attr', 'aria-checked', 'true')

        // Verify The line items are not updated
        ARCourseEnrollmentReportPage.verifyLearnerIsEnrolledOrNot(userDetails.username, 'Yes')
        ARCourseEnrollmentReportPage.verifyLearnerIsEnrolledOrNot(users.learner01.learner_01_username, 'No')

        //Clicking on Re enroll User button
        cy.get(ARUserPage.getAddEditMenuActionsByName('Re-enroll Users')).should('exist').click()

        // Confirm the re-enrollment request
        //Asserting Modal
        cy.get(ARDashboardPage.getModalTitle()).should('have.text', 'Re-enroll Users')
        cy.get(ARUserUnEnrollModal.getModalNotification()).should('have.text', 'There are 2 users selected.')
        //Clicking on Ok button  
        cy.get(ARUserUnEnrollModal.getApplyBtn(), {timeout:10000}).should('be.visible').click()
        cy.get(ARUserUnEnrollModal.getApplyBtn(), {timeout:10000}).should('not.exist')

        // Re-enrollment Requested
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('contain', 'Re-enrollment Requested')
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('not.exist')

        // Re-enrollment Successful
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 30000}).should('contain', 'Re-enrollment Successful')
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('not.exist')

        cy.reload()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 15000}).should('not.exist')

        // Verify The line items are not updated
        ARCourseEnrollmentReportPage.verifyLearnerIsEnrolledOrNot(userDetails.username, 'Yes')
        ARCourseEnrollmentReportPage.verifyLearnerIsEnrolledOrNot(users.learner01.learner_01_username, 'Yes')
    })

    after("Clean up",() => {
        cy.deleteCourse(commonDetails.courseID)
        //Login into learner side 
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 15000}).should('not.exist')
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })
})