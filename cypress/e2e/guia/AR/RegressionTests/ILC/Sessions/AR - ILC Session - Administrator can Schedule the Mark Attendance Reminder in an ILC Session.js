import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails } from '../../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import ARCourseSettingsMessagesModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsMessages.module'
import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'

describe('C820, AR - ILC Session - An Administrator can  (cloned)', function(){
    before('Create ILC with Sessions, Publish Course', () => {
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

    it('Edit ILC, Schedule the Mark Attendance Reminder in an ILC Session', () => {
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        // 1. Check "Mark Attendance Reminder Email" toggle is unavailable when 
        // "Send mark attendance reminder email" is OFF
        // Open Messages Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Messages')).click()
        ARILCAddEditPage.getShortWait()

        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsMessagesModule.getSendEmailNotificationToggleContainer()) + ' ' + ARILCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
       
        // Check Send mark attendance reminder email Checkbox Off
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Send mark attendance reminder email'))
            .should('have.attr', 'aria-checked', 'false')
        
        // Cancel the session changes
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        cy.intercept('PUT', 'api/rest/v2/admin/instructor-led-courses-new/**').as('getSessionId')

        // Verify "Mark Attendance Reminder Email" toggle is Unavailable
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('sendMarkAttendanceReminderEmail')).should('not.exist')

        // Cancel the session changes
        cy.get(ARILCAddEditPage.getAddEditSessionCancelBtn()).click()
        ARILCAddEditPage.getMediumWait()

        // Check "Mark Attendance Reminder Email" toggle is available when 
        // "Send mark attendance reminder email" is on
        // Open Messages Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Messages')).click()
        ARILCAddEditPage.getShortWait()

        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsMessagesModule.getSendEmailNotificationToggleContainer()) + ' ' + ARILCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')

        // Click Send mark attendance reminder email Checkbox
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Send mark attendance reminder email')).click()
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Send mark attendance reminder email'))
            .should('have.attr', 'aria-checked', 'true')
        ARILCAddEditPage.getMediumWait()

        // Save the session changes
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        cy.intercept('PUT', 'api/rest/v2/admin/instructor-led-courses-new/**').as('getSessionId')

        // Verify "Mark Attendance Reminder Email" toggle is available
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('sendMarkAttendanceReminderEmail')).should('exist')
        
        // 2. Verify "Mark Attendance Reminder Email" toggle is on/off
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Mark Attendance Reminder Email'))
            .should('have.attr', 'aria-checked', 'false')

        // Verify 'Set Reminder Before' Unavailable
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('remindHoursBefore')).should('not.exist')
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('sendMarkAttendanceReminderEmail')).find(ARILCAddEditPage.getToggleDisabled()).click()
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Mark Attendance Reminder Email'))
            .should('have.attr', 'aria-checked', 'true')

        // 3. "Hours" textbox validation Verify Does not take non-numeric or negative values.
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('remindHoursBefore')).should('exist')
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Set Reminder Before')).clear().type('5dgdfgdgh').blur()
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Set Reminder Before')).should('have.value', '5')
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Set Reminder Before')).clear().type(-31313).blur()
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('remindHoursBefore')).find(ARCourseSettingsMessagesModule.getErrorMsg())
            .should('have.text', 'Field must be greater than or equal to 0.')
        
        // Enter correct value
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Set Reminder Before')).clear().type(7)

        // Click Save Button
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.intercept('**/sessions/report').as(`getSession2`).wait(`@getSession2`)

        // 7. Turn off "Send email notification" toggle in the Messages course settings
        // "Mark Attendance Reminder Email" toggle and hours text box are hidden in the ILC session modal.
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Messages')).click()
        ARILCAddEditPage.getShortWait()

        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsMessagesModule.getSendEmailNotificationToggleContainer()) + ' ' + ARILCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('allowNotifications')).find(ARILCAddEditPage.getToggleEnabled()).click()
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsMessagesModule.getSendEmailNotificationToggleContainer()) + ' ' + ARILCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'false')

        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        cy.intercept('PUT', 'api/rest/v2/admin/instructor-led-courses-new/**').as('getSessionId')

        // Verify "Mark Attendance Reminder Email" toggle is Unavailable
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('sendMarkAttendanceReminderEmail')).should('not.exist')

        // Click Save Button
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.intercept('**/sessions/report').as(`getSession2`).wait(`@getSession2`)
    })
})

