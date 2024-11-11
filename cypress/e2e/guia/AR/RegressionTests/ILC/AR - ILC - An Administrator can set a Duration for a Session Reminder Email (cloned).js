import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsMessagesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsMessages.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import AREmailTemplateModal from '../../../../../../helpers/AR/pageObjects/Modals/AREmailTemplateModal'
import { ilcDetails, messages } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('C815, AR - ILC - An Administrator can set a Duration for a Session Reminder Email (cloned)', function(){
    before('Create ILC with Daily Recurring Sessions, Publish Course', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        ARILCAddEditPage.getMediumWait()

        // Create ILC course
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)

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

    it('Verify Messages Section Toggles & Checkboxes, Edit Email Template', () => {
        cy.editCourse(ilcDetails.courseName)
        arDashboardPage.getMediumWait()

        //Open Messages Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Messages')).click()
        ARILCAddEditPage.getShortWait()

        // Assert Send Email Notifications Toggle is ON
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsMessagesModule.getSendEmailNotificationToggleContainer()) + ' ' + ARILCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')

        // Verify Email Options Available for ILC
        for (let i = 0; i < messages.chkBoxLabels.length; i++) {
            cy.get(ARCourseSettingsMessagesModule.getEmailNotificationsChkBox()).contains(`Send ${messages.chkBoxLabels[i]} email`).should('exist')
        }

        // Check Send session reminder Email Checkbox Off
        cy.get(ARCourseSettingsMessagesModule.getElementByAriaLabelAttribute('Send session reminder email'))
            .should('have.attr', 'aria-checked', 'false')        

        // Click Send session reminder Email Checkbox
        cy.get(ARCourseSettingsMessagesModule.getElementByAriaLabelAttribute('Send session reminder email')).click()

        // Verify Session reminder email can have a duration scheduled
        cy.get(arDashboardPage.getElementByDataNameAttribute('maxReminderCount')).should('exist')
        cy.get(arDashboardPage.getElementByDataNameAttribute('frequency')).should('exist')
        cy.get(arDashboardPage.getElementByDataNameAttribute('startDateEnabled')).should('exist')

        // Verify session reminder email goes out based on the set duration
        // Verify Max reminders works
        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Max reminders')).should('have.value',1)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Max reminders')).clear().type(2)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Max reminders')).should('have.value',2)
 
        // Verify Before the start of the first class, remind every works
        cy.get(arDashboardPage.getElementByNameAttribute('frequency-years')).should('have.value', 0)
        cy.get(arDashboardPage.getElementByNameAttribute('frequency-months')).should('have.value', 0)
        cy.get(arDashboardPage.getElementByNameAttribute('frequency-days')).should('have.value', 7)
        cy.get(arDashboardPage.getElementByNameAttribute('frequency-hours')).should('have.value', 0)

        cy.get(arDashboardPage.getElementByNameAttribute('frequency-years')).clear().type(1)
        cy.get(arDashboardPage.getElementByNameAttribute('frequency-months')).clear().type(2)
        cy.get(arDashboardPage.getElementByNameAttribute('frequency-days')).clear().type(5)
        cy.get(arDashboardPage.getElementByNameAttribute('frequency-hours')).clear().type(4)

        // Verify Use Start Date
        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Use Start Date')).should('have.attr', 'aria-checked', 'false')
        ARCourseSettingsMessagesModule.getCustomTemplateToggleThenClick(`Send ${messages.chkBoxLabels[6]} email`)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Use Start Date')).should('have.attr', 'aria-checked', 'true')
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Start Date and Time')).find(ARILCAddEditPage.getDateInputField()).click()
        ARILCAddEditPage.getSelectDate(ARILCAddEditPage.getFutureDate(7))

        //Send session reminder Email - Turn Use Custom Template Toggle ON
        ARCourseSettingsMessagesModule.getCustomTemplateToggleThenClick(`Send ${messages.chkBoxLabels[6]} email`, 1)
        ARILCAddEditPage.getMediumWait()

        //Click Edit Template
        ARCourseSettingsMessagesModule.getEditTemplateThenClick(`Send ${messages.chkBoxLabels[6]} email`)

        //Set Valid Value in Subject Field
        cy.get(AREmailTemplateModal.getSubjectTxtF()).clear().type(messages.emailTemplateSubject + ilcDetails.courseName)
        //Turn Send to Administrators & Send to Supervisor Toggles ON
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToAdministratorsToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled()).click()
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(AREmailTemplateModal.getSendToSupervisorToggleContainer()) + ' ' + ARILCAddEditPage.getToggleDisabled()).click()

        //Save the Template
        cy.get(AREmailTemplateModal.getSaveBtn()).click()
        ARILCAddEditPage.getShortWait()

        // An edited template retains any changes after re-opening and saving
        // Click Edit Template
        ARCourseSettingsMessagesModule.getEditTemplateThenClick(`Send ${messages.chkBoxLabels[6]} email`)

        // Verify changes are saved
        cy.get(AREmailTemplateModal.getSubjectTxtF()).should('have.value', messages.emailTemplateSubject + ilcDetails.courseName)
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Send to administrators')).should('have.attr', 'aria-checked', 'true')
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Send to supervisor')).should('have.attr', 'aria-checked', 'true')

        // The reset button resets all fields including toggles to the default state
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('reset-template')).click()
        ARILCAddEditPage.getShortWait()

        // Verify value reset to default state
        cy.get(AREmailTemplateModal.getSubjectTxtF()).should('have.value', 'Reminder for {{CourseName}}')
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Send to administrators')).should('have.attr', 'aria-checked', 'false')
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Send to supervisor')).should('have.attr', 'aria-checked', 'false')

        // Cancel the Template
        cy.get(AREmailTemplateModal.getCancelBtn()).click()
        ARILCAddEditPage.getShortWait()

        // Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })
})

