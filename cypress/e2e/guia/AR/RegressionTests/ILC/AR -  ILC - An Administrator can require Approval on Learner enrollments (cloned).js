import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { ilcDetails } from '../../../../../../helpers/TestData/Courses/ilc'

describe('C808 - AR - ILC - An Administrator can require Approval on Learner enrollments (cloned)', function(){
    before('Create ILC with Daily Recurring Sessions, Publish Course', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        arDashboardPage.getMediumWait()

        // Create ILC course
        cy.createCourse('Instructor Led', ilcDetails.courseName, true)

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    after('Delete Created Course', function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Edit a ILC and verify radio buttons and messages', () => {
        cy.editCourse(ilcDetails.courseName)
        arDashboardPage.getMediumWait()
        
        //verfiy Enrollment Radio Buttons  
        cy.get(ARCourseSettingsEnrollmentRulesModule.getEnrollmentRulesBtn()).first().click()
        ARCourseSettingsEnrollmentRulesModule.scrollToEnrolmentRule()
        ARCourseSettingsEnrollmentRulesModule.verifyAllowSelfEnrollmentOption()

        cy.get(arDashboardPage.getElementByDataNameAttribute('approvalType')).within(() => {
            ARCourseSettingsEnrollmentRulesModule.verifyApprovalOptions()

            // Verify default approver selection is "None"
            cy.get(arCoursesPage.getElementByDataNameAttribute('radio-button-None')).should('have.attr', 'aria-checked', 'true')

            //click one Approval radio buttons and verify messages 
            cy.contains('Course Editor').click()
            cy.get(arCoursesPage.getElementByDataNameAttribute('radio-button-CourseEditor')).should('have.attr', 'aria-checked', 'true')
            ARCourseSettingsEnrollmentRulesModule.verifyApproval_CourseEditorMessage()

            cy.contains('Supervisor').click()
            cy.get(arCoursesPage.getElementByDataNameAttribute('radio-button-Supervisor')).should('have.attr', 'aria-checked', 'true')
            ARCourseSettingsEnrollmentRulesModule.verifyApproval_SupervisorMessage()

            cy.contains('Administrator').click()
            cy.get(arCoursesPage.getElementByDataNameAttribute('radio-button-Administrator')).should('have.attr', 'aria-checked', 'true')
            ARCourseSettingsEnrollmentRulesModule.verifyApproval_AdminMessage()

            cy.contains('Other').click()
            cy.get(arCoursesPage.getElementByDataNameAttribute('radio-button-Other')).should('have.attr', 'aria-checked', 'true')
            ARCourseSettingsEnrollmentRulesModule.verifyApproval_OtherMessage()

            cy.contains('None').click()
            cy.get(arCoursesPage.getElementByDataNameAttribute('radio-button-None')).should('have.attr', 'aria-checked', 'true')
            ARCourseSettingsEnrollmentRulesModule.verifyApproval_NoneMessage()
        })
    })
})
