import ARILCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEFilterMenu from "../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu"
import LESideMenu from "../../../../../../helpers/LE/pageObjects/Menu/LESideMenu"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import { ilcDetails, enrollment } from '../../../../../../helpers/TestData/Courses/ilc'
import ARCourseApprovalReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseApprovalReportPage"
import ARQuestionBanksAddEditPage from "../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksAddEditPage"
import AdminNavationModuleModule from "../../../../../../helpers/AR/modules/AdminNavationModule.module"

describe('C7297 - AUT-661 - AE - Report - Core Regression - Course Approval - Deselect', () => {

    before('Create an ILC course and set rule to aprrove for other', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        ARDashboardPage.getCoursesReport()
        
        cy.createCourse('Instructor Led')
        // Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()
        // Select Allow All Learners Enrollment All Learners Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        // Select Other for Account Approval
        cy.get(ARCourseSettingsEnrollmentRulesModule.getApprovalRadioBtn()).contains('Other').click().click()
        cy.get(ARCourseSettingsEnrollmentRulesModule.getChoseApprovedUsersDDown()).contains('Choose').click()
        cy.get(ARCourseSettingsEnrollmentRulesModule.getApprovedUserIDsTxt()).type(enrollment.approvalAccount)
        ARCourseSettingsEnrollmentRulesModule.getOtherApprovalOpt(enrollment.approvalAccount)
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    after('Delete the new courese as part clean-up', () => {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Enroll to the course', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        //Enroll learner in course
        LEFilterMenu.getSearchAndEnrollInCourseByName(ilcDetails.courseName)
    })

    it('Verify approved course can be selected and unselected', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        AdminNavationModuleModule.navigateToCourseApprovalPage()
        ARDashboardPage.getMediumWait()
        ARCourseApprovalReportPage.A5AddFilter('Course Title', 'Contains', ilcDetails.courseName)
        ARQuestionBanksAddEditPage.selectA5TableCellRecord(ilcDetails.courseName)
        ARCourseApprovalReportPage.getRightActionMenuLabel()
        cy.get(ARCourseApprovalReportPage.getDataMenuAttribute('Sidebar')).contains('Deselect').click()
        // Assert that the selected item has been deselected
        cy.get(ARCourseApprovalReportPage.getSelectedItemChkBox()).should('not.exist')
    })
})