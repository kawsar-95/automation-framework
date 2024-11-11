import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails } from '../../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'

describe('C809, AR - ILC - Session - Session Approvals can be set (cloned)', function(){
    before('Create ILC with Daily Recurring Sessions, Publish Course', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        ARILCAddEditPage.getMediumWait()

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

    it('Edit ILC  Sessions and verify Approval radio buttons and messages', () => {
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        // The updates to the session are saved
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        cy.intercept('PUT', 'api/rest/v2/admin/instructor-led-courses-new/**').as('getSessionId')

        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('session-approval-settings')).contains('Approval').scrollIntoView()

        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('session-approval-settings')).within(() => {
            // Verify Approval options Visible
            cy.contains('None').should('be.visible')
            cy.contains('Instructor').should('be.visible')
            cy.contains('Supervisor').should('be.visible')
            cy.contains('Administrator').should('be.visible')
            cy.contains('Other').should('be.visible')

            // Verify default approver selection is "None"
            cy.get(ARCoursesPage.getElementByDataNameAttribute('radio-button-None')).should('have.attr', 'aria-checked', 'true')
            ARCourseSettingsEnrollmentRulesModule.verifyApproval_NoneMessage()

            //click one Approval radio buttons and verify messages 
            cy.contains('Instructor').click()
            cy.get(ARCoursesPage.getElementByDataNameAttribute('radio-button-Instructor')).should('have.attr', 'aria-checked', 'true')
            cy.contains("A session instructor must approve all enrollments.").should('be.visible')

            cy.contains('Supervisor').click()
            cy.get(ARCoursesPage.getElementByDataNameAttribute('radio-button-Supervisor')).should('have.attr', 'aria-checked', 'true')
            ARCourseSettingsEnrollmentRulesModule.verifyApproval_SupervisorMessage()

            cy.contains('Other').click()
            cy.get(ARCoursesPage.getElementByDataNameAttribute('radio-button-Other')).should('have.attr', 'aria-checked', 'true')
            ARCourseSettingsEnrollmentRulesModule.verifyApproval_OtherMessage()

            cy.contains('Administrator').click()
            cy.get(ARCoursesPage.getElementByDataNameAttribute('radio-button-Administrator')).should('have.attr', 'aria-checked', 'true')
            ARCourseSettingsEnrollmentRulesModule.verifyApproval_AdminMessage()
        })

        // Save the session changes
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getMediumWait()

        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        cy.intercept('PUT', 'api/rest/v2/admin/instructor-led-courses-new/**').as('getSessionId')

        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('session-approval-settings')).contains('Approval').scrollIntoView()

        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('session-approval-settings')).within(() => {
            // Verify default approver selection is "Administrator"
            cy.get(ARCoursesPage.getElementByDataNameAttribute('radio-button-Administrator')).should('have.attr', 'aria-checked', 'true')

            //click one Approval radio buttons and verify messages
            cy.contains('Instructor').click()
            cy.get(ARCoursesPage.getElementByDataNameAttribute('radio-button-Instructor')).should('have.attr', 'aria-checked', 'true')
            cy.contains("A session instructor must approve all enrollments.").should('be.visible')
        })

        // The updates to the session are discarded
        // Cancel the session changes
        cy.get(ARILCAddEditPage.getAddEditSessionCancelBtn()).click()
        ARILCAddEditPage.getShortWait()

        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        cy.intercept('PUT', 'api/rest/v2/admin/instructor-led-courses-new/**').as('getSessionId')

        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('session-approval-settings')).contains('Approval').scrollIntoView()

        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('session-approval-settings')).within(() => {
            // Verify default approver selection is not "Instructor"
            cy.get(ARCoursesPage.getElementByDataNameAttribute('radio-button-Instructor')).should('have.attr', 'aria-checked', 'false')

            // Verify default approver selection is "Administrator"
            cy.get(ARCoursesPage.getElementByDataNameAttribute('radio-button-Administrator')).should('have.attr', 'aria-checked', 'true')
            ARCourseSettingsEnrollmentRulesModule.verifyApproval_AdminMessage()
        })
    })
})

