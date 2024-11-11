import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARILCActivityReportPage from "../../../../../../../helpers/AR/pageObjects/Reports/ARILCActivityReportPage"
import { users } from "../../../../../../../helpers/TestData/users/users"
import { ilcDetails } from "../../../../../../../helpers/TestData/Courses/ilc"
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { userDetails } from '../../../../../../../helpers/TestData/users/UserDetails'
import AREnrollUsersPage from '../../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEProfilePage from '../../../../../../../helpers/LE/pageObjects/User/LEProfilePage'


describe("C7272 - AUT 671 - AR - ILC Activity Unenroll", function () {
    before(function () {
        cy.createUser(void 0, userDetails.username5, ["Learner"], void 0)

        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        cy.visit('/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        cy.intercept('/api/rest/v2/admin/reports/courses/operations').as('getCourses').wait(6000).wait('@getCourses')
        cy.createCourse('Instructor Led', ilcDetails.courseName)
        //publish Course
        cy.publishCourseAndReturnId().then((id)=> {
            commonDetails.courseID = id.request.url.slice(-36)
        })

        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName], [userDetails.username5])

        //Choose In ILC Activity from reports
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        ARDashboardPage.getMenuItemOptionByName('ILC Activity')
        
    })

    it('ILC Activity page opens un-enroll', function() {
        cy.get(ARILCActivityReportPage.getPageHeaderTitle()).should('contain', "ILC Activity")
        // Select a course
        ARILCActivityReportPage.EnrollmentPageFilter(ilcDetails.courseName)
        // Select an ILC Activity from the list
        cy.get(ARILCActivityReportPage.getTableCellRecord(ilcDetails.courseName)).eq(0).click()
        ARILCActivityReportPage.getMediumWait()

        // Un-enroll Cancel
        cy.get(ARILCActivityReportPage.getAddEditMenuActionsByName(ARILCActivityReportPage.getUnrollUser())).click()
        ARILCActivityReportPage.getMediumWait()
        cy.get(ARILCActivityReportPage.getElementByDataNameAttribute(ARILCActivityReportPage.getUnrollUserPrompt())).contains('Cancel').click()
        cy.get(ARILCActivityReportPage.getPageHeaderTitle()).should('contain', "ILC Activity")

        // Un-enroll
        cy.get(ARILCActivityReportPage.getAddEditMenuActionsByName(ARILCActivityReportPage.getUnrollUser())).click()
        ARILCActivityReportPage.getMediumWait()
        cy.get(ARILCActivityReportPage.getElementByDataNameAttribute(ARILCActivityReportPage.getUnrollUserPrompt())).contains('OK').click()
        cy.get(ARILCActivityReportPage.getToastNotificationMsg()).should('contain', ARILCActivityReportPage.getUserUnenrollText())
    })

    after(function() {
        // Delete Course
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')

        // Delete User
        cy.apiLoginWithSession(userDetails.username5, users.sysAdmin.admin_sys_01_password)
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })
})