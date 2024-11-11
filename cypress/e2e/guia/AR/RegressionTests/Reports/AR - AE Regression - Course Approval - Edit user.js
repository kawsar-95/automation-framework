import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import { ilcDetails, enrollment } from '../../../../../../helpers/TestData/Courses/ilc'
import arCourseApprovalReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCourseApprovalReportPage'

describe('C7296, AR - AE Regression - Course Approval - Edit user', function(){
    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Verify Enrollment & Approval Rules Radio Buttons and Fields, & Publish ILC Course', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        

        // Create ILC with Sessions
        cy.createCourse('Instructor Led')

        // Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()

        // elect Allow All Learners Enrollment All Learners Radio Button
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()
        ARILCAddEditPage.getShortWait()

        // Select Other for Account Approval
        cy.get(ARCourseSettingsEnrollmentRulesModule.getApprovalRadioBtn()).contains('Other').click().click()
        cy.get(ARCourseSettingsEnrollmentRulesModule.getOtherApprovalDDown()).click()
        cy.get(ARCourseSettingsEnrollmentRulesModule.getOtherAprrovalSearchF()).type(enrollment.approvalAccount)
        cy.get(ARCourseSettingsEnrollmentRulesModule.getOtherApprovalOptFullName()).contains(enrollment.approvalAccount).click()

        // Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Enroll in course and Session by the learner side ', () => {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)

        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        LESideMenu.getMediumWait ()

        // Enroll learner in course
        LEFilterMenu.getSearchAndEnrollInCourseByName(ilcDetails.courseName)
        arDashboardPage.getShortWait()
    })

    it("Filter the saved course in Course Approval Report ",()=>{
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Course Approvals'))
        cy.intercept('/Admin/CourseApprovals/GetCourseApprovals').as('getCourseApproval').wait('@getCourseApproval')
        
        //Filter By course title    
        arCourseApprovalReportPage.A5AddFilter('Course Title', 'Contains', ilcDetails.courseName)
        arCourseApprovalReportPage.getMediumWait()

        cy.get(arCourseApprovalReportPage.getA5TableCellRecordByColumn(4)).contains(ilcDetails.courseName).click()
        arCourseApprovalReportPage.getShortWait()

        //validate action btn levels
        arCourseApprovalReportPage.getRightActionMenuLabel()

        // Click on Edit User button
        arCourseApprovalReportPage.getA5AddEditMenuActionsByNameThenClick('Edit User')
        arCourseApprovalReportPage.getMediumWait()
        
        // Verify Edit user page should be displayed
        cy.url().should('contain', '/Admin/Users/Edit')
    })
})