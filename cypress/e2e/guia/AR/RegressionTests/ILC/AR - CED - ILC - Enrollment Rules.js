
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails, enrollment } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'


describe('AR - Regress - CED - ILC - Enrollment Rules', function(){
    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Verify Enrollment & Approval Rules Radio Buttons and Fields, & Publish ILC Course', () => {
        cy.createCourse('Instructor Led')

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()

        //Select Allow Self Enrollment Specific Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('Specific')

        //Specify First Name to Use For Self Enrollment Rule
        ARCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Self', 'First Name', 'Contains', enrollment.selfEnrollmentName)

        //Select Other for Account Approval
        cy.get(ARCourseSettingsEnrollmentRulesModule.getApprovalRadioBtn()).contains('Other').click().click()
        cy.get(ARCourseSettingsEnrollmentRulesModule.getOtherApprovalDDown()).click()
        ARILCAddEditPage.getShortWait()

        cy.get(ARCourseSettingsEnrollmentRulesModule.getOtherApprovalSearchTxt()).type(enrollment.approvalAccount)
        ARILCAddEditPage.getShortWait()

        ARCourseSettingsEnrollmentRulesModule.getOtherApprovalOpt(enrollment.approvalAccount)

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit ILC Course, Verify Enrollment & Approval Rules Have Been Persisted, Set New Rules', () => {
        //Filter for Course & Edit it
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()

        //Assert Self Enrollment Rule has Persisted
        cy.get(ARCourseSettingsEnrollmentRulesModule.getSelectionTypeDDown()).should('contain.text', 'First Name')
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRuleTxtF()).should('have.value', enrollment.selfEnrollmentName)

        //Assert Approval Rule has Persisted
        cy.get(ARCourseSettingsEnrollmentRulesModule.getApprovalDescription()).should('contain', 'Specify the users that are responsible for approving enrollments.')
        cy.get(ARCourseSettingsEnrollmentRulesModule.getOtherApprovalDDown()).should('contain.text', enrollment.approvalAccount)

        //Set Approval to Administrator
        cy.get(ARCourseSettingsEnrollmentRulesModule.getApprovalRadioBtn()).contains('Administrator').click().click()

        //Select 'All Learners' For Self Enrollment Rule
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Publish ILC
        cy.publishCourse()
    })

    it('Edit ILC Course, Verify New Enrollment & Approval Rules Have Been Persisted', () => {
        //Filter for Course & Edit it
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()

        //Assert Self Enrollment Rule has Persisted
        cy.get(ARCourseSettingsEnrollmentRulesModule.getEnrollmentDescription()).should('contain', 'This course will be available for all learners to self-enroll in.')

        //Assert Approval Rule has Persisted
        cy.get(ARCourseSettingsEnrollmentRulesModule.getApprovalDescription()).should('contain', "A user's department administrator must approve all enrollments.")
    })
})