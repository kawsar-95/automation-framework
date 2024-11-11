import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsMessagesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsMessages.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import AREmailTemplateModal from '../../../../../../helpers/AR/pageObjects/Modals/AREmailTemplateModal'
import { ilcDetails, messages } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('AR - Regress - CED - ILC - Messages Section - Create Course', function(){
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Verify Messages Section Toggles & Checkboxes, Edit Email Template, Publish ILC Course', () => {
        cy.createCourse('Instructor Led')

        //Open Messages Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Messages')).click()
        ARILCAddEditPage.getShortWait()

        //Verify Email Options Available for ILC
        for (let i = 0; i < messages.chkBoxLabels.length; i++) {
            cy.get(ARCourseSettingsMessagesModule.getEmailNotificationsChkBox()).contains(`Send ${messages.chkBoxLabels[i]} email`).should('exist')
        }

        //Assert Send Email Notifications Toggle is ON
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsMessagesModule.getSendEmailNotificationToggleContainer()) + ' ' + ARILCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')

        /* For some reason turning this toggle on and off in cypress only unchecks all of the email notifications (does not happen when manually doing it)
        //Turn the Send Email Notifications Toggle OFF
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsMessagesModule.getSendEmailNotificationToggleContainer()) + ' ' + ARILCAddEditPage.getToggleEnabled()).click()
        //Assert the Email Options are Not Visible
        cy.get(ARCourseSettingsMessagesModule.getEmailNotificationsChkBox()).should('not.exist')
        //Turn the Send Email Notifications Toggle back ON
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsMessagesModule.getSendEmailNotificationToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled()).click()
        ARILCAddEditPage.getShortWait()
        */

        //Assert the Default State of the Email Notification Buttons
        for (let i = 0; i < messages.chkBoxLabels.length; i++) {
            ARCourseSettingsMessagesModule.getChkBoxStateByLabel(`Send ${messages.chkBoxLabels[i]} email`, messages.chkBoxDefaults[i])
        }

        //Send Enrollment Email - Turn Use Custom Template Toggle ON
        ARCourseSettingsMessagesModule.getCustomTemplateToggleThenClick(`Send ${messages.chkBoxLabels[0]} email`)
        ARILCAddEditPage.getShortWait()

        //Click Edit Template
        ARCourseSettingsMessagesModule.getEditTemplateThenClick(`Send ${messages.chkBoxLabels[0]} email`)
        //Assert Send to Learner, Administrators, and Supervisor Toggles are Visible
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToLearnerToggleContainer())).should('exist')
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToAdministratorsToggleContainer())).should('exist')
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToSupervisorToggleContainer())).should('exist')
        
        //Assert Subject Field Cannot be Blank
        cy.get(AREmailTemplateModal.getSubjectTxtF()).clear()
        cy.get(AREmailTemplateModal.getSubjectErrorMsg()).should('contain', 'Field is required.')
        //Assert Subject Field Does Not Allow >255 Chars
        cy.get(AREmailTemplateModal.getSubjectTxtF()).invoke('val', ARILCAddEditPage.getLongString()).type('a')
        cy.get(AREmailTemplateModal.getSubjectErrorMsg()).should('contain', 'Field cannot be more than 255 characters.')
        //Assert Subject Field Does Not Allow HTML'
        cy.get(AREmailTemplateModal.getSubjectTxtF()).clear().type(commonDetails.textWithHtmlTag)
        ARILCAddEditPage.getVShortWait()
        cy.get(AREmailTemplateModal.getSaveBtn()).click()
        cy.get(AREmailTemplateModal.getModalErrorMsg()).should('contain', 'Field contains invalid characters.')
        //Set Valid Value in Subject Field
        cy.get(AREmailTemplateModal.getSubjectTxtF()).clear().type(messages.emailTemplateSubject + ilcDetails.courseName + commonDetails.timestamp)
        //Turn Send to Administrators & Send to Supervisor Toggles ON
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToAdministratorsToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled()).click()
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToSupervisorToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled()).click()
        //Save the Template
        cy.get(AREmailTemplateModal.getSaveBtn()).click()
        ARILCAddEditPage.getShortWait()

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit ILC Course & Verify Email Template Changes Persisted, Verify Session Reminder Fields', () => {
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()
        //Open Messages Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Messages')).click()
        ARILCAddEditPage.getShortWait()

        //Assert Edits to the Send Enrollment Email Template Persisted
        ARCourseSettingsMessagesModule.getEditTemplateThenClick(`Send ${messages.chkBoxLabels[0]} email`)
        //Assert Send to Administrators and Send to Supervisor Toggles are ON
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToAdministratorsToggleContainer()) + ' ' + ARILCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToSupervisorToggleContainer()) + ' ' + ARILCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        //Assert Subject Field
        cy.get(AREmailTemplateModal.getSubjectTxtF()).should('have.value', messages.emailTemplateSubject + ilcDetails.courseName + commonDetails.timestamp)
        //Close the Modal
        cy.get(AREmailTemplateModal.getCancelBtn()).click()

        //Turn on Session Reminder Emails
        cy.get(ARCourseSettingsMessagesModule.getEmailNotificationsChkBox()).contains(`Send ${messages.chkBoxLabels[6]} email`).click()
        //Verify Session Reminder Fields Do Not Accept Negative Values
        cy.get(ARCourseSettingsMessagesModule.getYearsTxtF()).clear().type('-1')
        cy.get(ARCourseSettingsMessagesModule.getErrorMsgByFieldName('years')).should('contain', 'Field must be greater than or equal to 0.')
        cy.get(ARCourseSettingsMessagesModule.getMonthsTxtF()).clear().type('-1')
        cy.get(ARCourseSettingsMessagesModule.getErrorMsgByFieldName('months')).should('contain', 'Field must be greater than or equal to 0.')
        cy.get(ARCourseSettingsMessagesModule.getDaysTxtF()).clear().type('-1')
        cy.get(ARCourseSettingsMessagesModule.getErrorMsgByFieldName('days')).should('contain', 'Field must be greater than or equal to 0.')
        cy.get(ARCourseSettingsMessagesModule.getHoursTxtF()).clear().type('-1')
        cy.get(ARCourseSettingsMessagesModule.getErrorMsgByFieldName('hours')).should('contain', 'Field must be greater than or equal to 0.')
        cy.get(ARCourseSettingsMessagesModule.getMaxRemindersTxtF()).clear().type('-1')
        cy.get(ARCourseSettingsMessagesModule.getMaxRemindersErrorMsg()).should('contain', 'Field must be greater than or equal to 0.')

        //Verify Max Reminders Field Does Not Accept Blank Values
        cy.get(ARCourseSettingsMessagesModule.getMaxRemindersTxtF()).clear()
        cy.get(ARCourseSettingsMessagesModule.getMaxRemindersErrorMsg()).should('contain', 'Field is required.')

        //Enter Valid Values for Session Reminder Fields
        cy.get(ARCourseSettingsMessagesModule.getYearsTxtF()).clear().type('1')
        cy.get(ARCourseSettingsMessagesModule.getMonthsTxtF()).clear().type('3')
        cy.get(ARCourseSettingsMessagesModule.getDaysTxtF()).clear().type('2')
        cy.get(ARCourseSettingsMessagesModule.getHoursTxtF()).clear().type('4')
        cy.get(ARCourseSettingsMessagesModule.getMaxRemindersTxtF()).clear().type('7')
        ARILCAddEditPage.getVShortWait()

        //Publish ILC
        cy.publishCourse()
    })

    it('Edit ILC Course & Verify Session Reminder Field Changes Persisted', () => {
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()
        //Open Messages Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Messages')).click()
        ARILCAddEditPage.getShortWait()

        //Assert Values for Session Reminder Fields Persisted
        cy.get(ARCourseSettingsMessagesModule.getYearsTxtF()).should('have.value', '1')
        cy.get(ARCourseSettingsMessagesModule.getMonthsTxtF()).should('have.value', '3')
        cy.get(ARCourseSettingsMessagesModule.getDaysTxtF()).should('have.value', '2')
        cy.get(ARCourseSettingsMessagesModule.getHoursTxtF()).should('have.value', '4')
        cy.get(ARCourseSettingsMessagesModule.getMaxRemindersTxtF()).should('have.value', '7')
    })
})