import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { ilcDetails } from "../../../../../../helpers/TestData/Courses/ilc"
import { users } from "../../../../../../helpers/TestData/users/users"
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARILCActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARILCActivityReportPage"
import ARILCEditActivityPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCEditActivityPage"
import ARILCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage"
import ARILCSessionReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARILCSessionReportPage"


describe("AUT-702 - C7327 - ILC Sessions Report - Mark Attendance AR Form Regression", () => {
    after('Delete the test user and course as part of clean-up', () => {
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], 'instructor-led-courses-new')
        }
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")
        ARDashboardPage.deleteUsers([userDetails.username])
    })

    it('Scenario 11 Mark Attendance – Allow Session Fail', () => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        // Create ILC course
        cy.createCourse('Instructor Led', ilcDetails.courseName, true)

        //Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        cy.get(ARILCAddEditPage.getAllowFailureToggle()).click()

        // Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })

        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName], [userDetails.username],ilcDetails.sessionName)
    })

    it('Scenario 11 Admin can still view the Mark Attendance Page', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')        
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("ILC Activity"))

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        //Choose Course In ILC Activity 
        ARILCActivityReportPage.courseFilter(ilcDetails.courseName)
       
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)

        // Select Session
        ARDashboardPage.selectA5TableCellRecord(ilcDetails.sessionName)
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit Activity', {timeout:10000})).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit Activity')).click()

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        cy.get(ARILCActivityReportPage.getEditActivitySession(), {timeout:10000}).should('be.visible')

        cy.get(ARILCActivityReportPage.getEditActivityRadioBtn(), {timeout:10000}).contains('Failed').click()

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARILCSessionReportPage.getEditActivityDateCompleted()).should('be.visible')

        cy.get(ARILCEditActivityPage.getSaveBtn(), {timeout:10000}).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Mark Attendance', {timeout:10000})).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Mark Attendance')).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARILCActivityReportPage.getPageHeaderTitle()).should('contain', 'Mark Attendance')
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
   })
})