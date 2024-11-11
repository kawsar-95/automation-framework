import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsMessagesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsMessages.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import AREmailTemplateModal from '../../../../../../helpers/AR/pageObjects/Modals/AREmailTemplateModal'
import { ocDetails, messageSection } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('AR - Regress - CED - OC - Messages Section - Create Course', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Create OC Course, Verify Messages Section Toggles & Checkboxes, Edit Email Template, Publish Course', () => {
        cy.createCourse('Online Course')

        //Open Messages Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Messages')).click()
        AROCAddEditPage.getShortWait()

        //Assert Send Email Notifications Toggle is ON
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsMessagesModule.getSendEmailNotificationToggleContainer()) + ' ' + AROCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')

        //Verify Email Options Available for OC
        for (let i = 0; i < messageSection.ChkBoxLabels.length; i++) {
            cy.get(ARCourseSettingsMessagesModule.getEmailNotificationsChkBox()).contains(`Send ${messageSection.ChkBoxLabels[i]} email`).should('exist')
        }

        //Turn the Send Email Notifications Toggle OFF
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsMessagesModule.getSendEmailNotificationToggleContainer()) + ' ' + AROCAddEditPage.getToggleEnabled()).click()

        //Assert the Email Options are Not Visible
        cy.get(ARCourseSettingsMessagesModule.getEmailNotificationsChkBox()).should('not.exist')

        //Turn the Send Email Notifications Toggle back ON
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsMessagesModule.getSendEmailNotificationToggleContainer()) + ' ' + AROCAddEditPage.getToggleDisabled()).click()
        AROCAddEditPage.getShortWait()

        //Assert the Default State of the Email Notification Buttons
        for (let i = 0; i < messageSection.ChkBoxLabels.length; i++) {
            ARCourseSettingsMessagesModule.getChkBoxStateByLabel(`Send ${messageSection.ChkBoxLabels[i]} email`, messageSection.ChkBoxDefaults[i])
        }

        //Assert that Unchecking Send Enrollment Email Hides the Options
        cy.get(ARCourseSettingsMessagesModule.getEmailNotificationsChkBox()).contains(`Send ${messageSection.ChkBoxLabels[0]} email`).click()
        cy.get(ARCourseSettingsMessagesModule.getEmailDescriptionBanner()).contains('Default enrollment email will be sent to learners.').should('not.exist')

        //Re-enable Send Enrollment Email and Turn on Custom Template Toggle
        cy.get(ARCourseSettingsMessagesModule.getEmailNotificationsChkBox()).contains(`Send ${messageSection.ChkBoxLabels[0]} email`).click()
        ARCourseSettingsMessagesModule.getCustomTemplateToggleThenClick(`Send ${messageSection.ChkBoxLabels[0]} email`)
        AROCAddEditPage.getShortWait()

        //Edit Enrollment Email Template
        ARCourseSettingsMessagesModule.getEditTemplateThenClick(`Send ${messageSection.ChkBoxLabels[0]} email`)

        //Assert Send to Learner, Administrators, and Supervisor Toggles are Visible
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToLearnerToggleContainer())).should('exist')
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToAdministratorsToggleContainer())).should('exist')
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToSupervisorToggleContainer())).should('exist')
        //Assert Subject Field Cannot be Blank
        cy.get(AREmailTemplateModal.getSubjectTxtF()).clear()
        cy.get(AREmailTemplateModal.getSubjectErrorMsg()).should('contain', 'Field is required.')
        //Assert Subject Field Does Not Allow >255 Chars
        cy.get(AREmailTemplateModal.getSubjectTxtF()).invoke('val', AROCAddEditPage.getLongString()).type('a')
        cy.get(AREmailTemplateModal.getSubjectErrorMsg()).should('contain', miscData.char_255_error)
        //Assert Subject Field Does Not Allow HTML'
        cy.get(AREmailTemplateModal.getSubjectTxtF()).clear().type(commonDetails.textWithHtmlTag)
        AROCAddEditPage.getVShortWait()
        cy.get(AREmailTemplateModal.getSaveBtn()).click()
        cy.get(AREmailTemplateModal.getModalErrorMsg()).should('contain', miscData.invalid_chars_error)
        //Set Valid Value in Subject Field
        cy.get(AREmailTemplateModal.getSubjectTxtF()).clear().type(messageSection.emailTemplateSubject)
        //Turn Send to Administrators & Send to Supervisor Toggles ON
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToAdministratorsToggleContainer()) + ' ' + AROCAddEditPage.getToggleDisabled()).click()
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToSupervisorToggleContainer()) + ' ' + AROCAddEditPage.getToggleDisabled()).click()
        //Save the Template
        cy.get(AREmailTemplateModal.getSaveBtn()).click()
        AROCAddEditPage.getShortWait()

        //Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

})

describe('AR - Regress - CED - OC - Messages Section', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        //Filter for Course & Edit it
        cy.editCourse(ocDetails.courseName)
        AROCAddEditPage.getMediumWait()
        //Open Messages Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Messages')).click()
        AROCAddEditPage.getShortWait()
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Edit OC Course & Verify Email Template Changes Persisted, Verify Nudge Fields', () => {
        //Assert Edits to the Send Enrollment Email Template Persisted
        ARCourseSettingsMessagesModule.getEditTemplateThenClick(`Send ${messageSection.ChkBoxLabels[0]} email`)
        //Assert Send to Administrators and Send to Supervisor Toggles are ON
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToAdministratorsToggleContainer()) + ' ' + AROCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToSupervisorToggleContainer()) + ' ' + AROCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        //Assert Subject Field
        cy.get(AREmailTemplateModal.getSubjectTxtF()).should('have.value', messageSection.emailTemplateSubject)
        //Close the Modal
        cy.get(AREmailTemplateModal.getCancelBtn()).click()

        //Enable Send Nudge Emails
        cy.get(ARCourseSettingsMessagesModule.getEmailNotificationsChkBox()).contains(`Send ${messageSection.ChkBoxLabels[2]} email`).click()

        //Verify Nudge Fields Do Not Allow Negative Values, Then Enter Valid Values
        for (let i = 0; i < messageSection.nudgeFields.length; i++) {
            cy.get(ARCourseSettingsMessagesModule[`get${messageSection.nudgeFields[i]}TxtF`]()).clear().type('-1').blur()
            cy.get(ARCourseSettingsMessagesModule.getErrorMsgByFieldName(messageSection.nudgeFields[i].toLowerCase())).should('contain', miscData.negative_chars_error)
            cy.get(ARCourseSettingsMessagesModule[`get${messageSection.nudgeFields[i]}TxtF`]()).clear().type(messageSection.nudgeValues[i])
        }
        cy.get(ARCourseSettingsMessagesModule.getMaxRemindersTxtF()).clear().type('-1')
        cy.get(ARCourseSettingsMessagesModule.getMaxRemindersErrorMsg()).should('contain', miscData.negative_chars_error)
        
        //Verify Max Reminders Field Does Not Accept Blank Values
        cy.get(ARCourseSettingsMessagesModule.getMaxRemindersTxtF()).clear()
        cy.get(ARCourseSettingsMessagesModule.getMaxRemindersErrorMsg()).should('contain', miscData.field_required_error)
        //Enter Valid Value for Max Reminders Fields
        cy.get(ARCourseSettingsMessagesModule.getMaxRemindersTxtF()).clear().type('7')
        AROCAddEditPage.getVShortWait()

        //Publish Course
        cy.publishCourse()
    })

    it('Edit OC Course & Verify Nudge Fields Persisted', () => {
        for (let i = 0; i < messageSection.nudgeFields.length; i++) {
            cy.get(ARCourseSettingsMessagesModule[`get${messageSection.nudgeFields[i]}TxtF`]()).should('have.value', messageSection.nudgeValues[i])
        }
        cy.get(ARCourseSettingsMessagesModule.getMaxRemindersTxtF()).should('have.value', '7')
    })
})