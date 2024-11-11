import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARILCActivityReportPage from "../../../../../../../helpers/AR/pageObjects/Reports/ARILCActivityReportPage"
import { users } from "../../../../../../../helpers/TestData/users/users"
import { messages } from '../../../../../../../helpers/TestData/Courses/ilc'
import { ilcDetails } from "../../../../../../../helpers/TestData/Courses/ilc"
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { userDetails } from '../../../../../../../helpers/TestData/users/UserDetails'
import AREnrollUsersPage from '../../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import ARComposeMessage from '../../../../../../../helpers/AR/pageObjects/Departments/ARComposeMessage'
import LEMessagesMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEMessagesMenu'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEProfilePage from '../../../../../../../helpers/LE/pageObjects/User/LEProfilePage'


describe("C7269 - AUT 668 - AR - ILC Activity message user", function () {
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

    it('ILC Activity page  message user', function() {
        cy.get(ARILCActivityReportPage.getPageHeaderTitle()).should('contain', "ILC Activity")
        // Select a course
        ARILCActivityReportPage.EnrollmentPageFilter(ilcDetails.courseName)
        // Select an ILC Activity from the list
        cy.get(ARILCActivityReportPage.getTableCellRecord(ilcDetails.courseName)).eq(0).click()
        ARILCActivityReportPage.getMediumWait()

        cy.get(ARILCActivityReportPage.getAddEditMenuActionsByName('Message User')).click()
        ARILCActivityReportPage.getMediumWait()

        cy.get(ARComposeMessage.getSubjectTxtF()).type('C7269-test-subject')
        cy.get(ARComposeMessage.getElementByAriaLabelAttribute(ARComposeMessage.getTextArea())).type(messages.emailTemplateBody)
        // When all required information is entered the Send button is enabled
        cy.get(ARComposeMessage.getSaveBtn()).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARComposeMessage.getSaveBtn()).click()
        ARILCActivityReportPage.getMediumWait()
        // Redirected to the ILC Activity page
        cy.get(ARILCActivityReportPage.getPageHeaderTitle()).should('contain', "ILC Activity")
    })

    it('ILC Activity message appears to the user', function() {
        // Verify message appears to the selected users 
        cy.apiLoginWithSession(userDetails.username5, userDetails.validPassword, '/#/dashboard')
        cy.get(LEMessagesMenu.getMessageMenuBtn()).click()
        cy.get(LEMessagesMenu.getAllMessagesContainer()).within(() => {
            cy.get(LEMessagesMenu.getPriorityMessagesLinkBtn()).click()            
        })

        cy.get(LEMessagesMenu.getMessagesMenuMessageItem()).should('contain','C7269-test-subject')
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