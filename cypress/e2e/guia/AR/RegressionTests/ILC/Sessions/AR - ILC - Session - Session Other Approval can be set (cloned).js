import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails, sessions } from '../../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'

describe('C811, AR - ILC - Session - Session Other Approval can be set (cloned))', function(){
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

        //Redirect to the left panel and click on the Users Icon
        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Users')).click()
        //Click on Users button
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser');
        cy.wrap(arDashboardPage.AddFilter('Is Admin', 'Yes'))
        ARCoursesPage.getMediumWait()

        cy.get(arDashboardPage.getElementByDataNameAttribute('table-container')).find('tbody > tr').its('length').as('adminUserNumber')
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

        // The updates to the session are discarded
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        cy.intercept('PUT', 'api/rest/v2/admin/instructor-led-courses-new/**').as('getSessionId')

        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('session-approval-settings')).contains('Approval').scrollIntoView()

        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('session-approval-settings')).within(() => {
            // Verify Approval Other options Visible
            cy.contains('Other').should('be.visible')

            cy.contains('Other').click()
            cy.get(ARCoursesPage.getElementByDataNameAttribute('radio-button-Other')).should('have.attr', 'aria-checked', 'true')
            ARCourseSettingsEnrollmentRulesModule.verifyApproval_OtherMessage()

            // Multiple administrators can be selected when the "Other" option is selected
            cy.get(ARCoursesPage.getElementByDataNameAttribute('approvalUserIds')).contains('Choose').click()
            ARCoursesPage.getShortWait()

            cy.get(ARCoursesPage.getElementByAriaLabelAttribute('Other Approval')).eq(1).should('have.attr', 'aria-multiselectable', 'true')

            // Select randomly
            cy.get(ARCoursesPage.getElementByAriaLabelAttribute('Other Approval')).eq(1).find('li')
                .its('length')
                .then((len) => {
                    cy.get(ARCoursesPage.getElementByAriaLabelAttribute('Other Approval')).eq(1).find('li')
                        .eq(Math.floor(Math.random() * ((len-1) - 0 + 1)) + 0).click()
                    cy.get(ARCoursesPage.getElementByAriaLabelAttribute('Other Approval')).eq(1).find('li')
                        .eq(Math.floor(Math.random() * ((len-1) - 0 + 1)) + 0).click()
                })          
            ARCoursesPage.getShortWait()

            // Verify Only administrators appear in the drop down
            cy.get(ARCoursesPage.getElementByAriaLabelAttribute('Other Approval')).eq(1).find('li').its('length').then(($length) => {
                cy.get('@adminUserNumber').then((adminUserNumber)=> {
                    expect(adminUserNumber).to.eq($length)
                })
            })
        })

        // Cancel the session changes
        cy.get(ARILCAddEditPage.getAddEditSessionCancelBtn()).click()
        ARILCAddEditPage.getShortWait()

        // The updates to the session are Saved
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        cy.intercept('PUT', 'api/rest/v2/admin/instructor-led-courses-new/**').as('getSessionId')

        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('session-approval-settings')).contains('Approval').scrollIntoView()

        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('session-approval-settings')).within(() => {
            // Verify Approval Other options Visible
            cy.contains('Other').should('be.visible')

            cy.contains('Other').click()
            cy.get(ARCoursesPage.getElementByDataNameAttribute('radio-button-Other')).should('have.attr', 'aria-checked', 'true')
            ARCourseSettingsEnrollmentRulesModule.verifyApproval_OtherMessage()

            // Multiple administrators can be selected when the "Other" option is selected
            cy.get(ARCoursesPage.getElementByDataNameAttribute('approvalUserIds')).contains('Choose').click()
            ARCoursesPage.getShortWait()

            cy.get(ARCoursesPage.getElementByAriaLabelAttribute('Other Approval')).eq(1).should('have.attr', 'aria-multiselectable', 'true')

            // Select randomly
            cy.get(ARCoursesPage.getElementByAriaLabelAttribute('Other Approval')).eq(1).find('li')
                .its('length')
                .then((len) => {
                    cy.get(ARCoursesPage.getElementByAriaLabelAttribute('Other Approval')).eq(1).find('li')
                        .eq(Math.floor(Math.random() * ((len-1) - 0 + 1)) + 0).click()
                    cy.get(ARCoursesPage.getElementByAriaLabelAttribute('Other Approval')).eq(1).find('li')
                        .eq(Math.floor(Math.random() * ((len-1) - 0 + 1)) + 0).click()
                })          
            ARCoursesPage.getShortWait()

            // Verify Only administrators appear in the drop down
            cy.get(ARCoursesPage.getElementByAriaLabelAttribute('Other Approval')).eq(1).find('li').its('length').then(($length) => {
                cy.get('@adminUserNumber').then((adminUserNumber)=> {
                    expect(adminUserNumber).to.eq($length)
                })
            })
        })

        // Save the session changes
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getMediumWait()

        // Add New session 
        ARILCAddEditPage.getAddSession(sessions.sessionName_1, ARILCAddEditPage.getFutureDate(2))
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).type(`${ilcDetails.sessionDescription}`)
    
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('session-approval-settings')).contains('Approval').scrollIntoView()

        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('session-approval-settings')).within(() => {
            // Verify Approval Other options Visible
            cy.contains('Other').should('be.visible')

            cy.contains('Other').click()
            cy.get(ARCoursesPage.getElementByDataNameAttribute('radio-button-Other')).should('have.attr', 'aria-checked', 'true')
            ARCourseSettingsEnrollmentRulesModule.verifyApproval_OtherMessage()

            // Multiple administrators can be selected when the "Other" option is selected
            cy.get(ARCoursesPage.getElementByDataNameAttribute('approvalUserIds')).contains('Choose').click()
            ARCoursesPage.getShortWait()

            cy.get(ARCoursesPage.getElementByAriaLabelAttribute('Other Approval')).eq(1).should('have.attr', 'aria-multiselectable', 'true')

            // Select randomly
            cy.get(ARCoursesPage.getElementByAriaLabelAttribute('Other Approval')).eq(1).find('li')
                .its('length')
                .then((len) => {
                    cy.get(ARCoursesPage.getElementByAriaLabelAttribute('Other Approval')).eq(1).find('li')
                        .eq(Math.floor(Math.random() * ((len-1) - 0 + 1)) + 0).click()
                    cy.get(ARCoursesPage.getElementByAriaLabelAttribute('Other Approval')).eq(1).find('li')
                        .eq(Math.floor(Math.random() * ((len-1) - 0 + 1)) + 0).click()
                })          
            ARCoursesPage.getShortWait()

            // Verify Only administrators appear in the drop down
            cy.get(ARCoursesPage.getElementByAriaLabelAttribute('Other Approval')).eq(1).find('li').its('length').then(($length) => {
                cy.get('@adminUserNumber').then((adminUserNumber)=> {
                    expect(adminUserNumber).to.eq($length)
                })
            })
        })

        // Save the session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getMediumWait()

    })
})

