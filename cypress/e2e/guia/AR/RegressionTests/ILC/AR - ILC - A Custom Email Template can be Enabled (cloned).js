import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsMessagesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsMessages.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import AREmailTemplateModal from '../../../../../../helpers/AR/pageObjects/Modals/AREmailTemplateModal'
import { ilcDetails, messages } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('C812 AR - ILC - A Custom Email Template can be Enabled (cloned)', function(){
    before('Create ILC, Publish Course', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        arDashboardPage.getMediumWait()

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

        // Check Send Enrollment Email Checkbox ON
        cy.get(ARCourseSettingsMessagesModule.getElementByAriaLabelAttribute('Send enrollment email'))
            .should('have.attr', 'aria-checked', 'true')

        //Send Enrollment Email - Turn Use Custom Template Toggle ON
        ARCourseSettingsMessagesModule.getCustomTemplateToggleThenClick(`Send ${messages.chkBoxLabels[0]} email`)
        ARILCAddEditPage.getShortWait()

        //Click Edit Template
        ARCourseSettingsMessagesModule.getEditTemplateThenClick(`Send ${messages.chkBoxLabels[0]} email`)

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
        ARCourseSettingsMessagesModule.getEditTemplateThenClick(`Send ${messages.chkBoxLabels[0]} email`)

        // Verify changes are saved
        cy.get(AREmailTemplateModal.getSubjectTxtF()).should('have.value', messages.emailTemplateSubject + ilcDetails.courseName)
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Send to administrators')).should('have.attr', 'aria-checked', 'true')
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Send to supervisor')).should('have.attr', 'aria-checked', 'true')

        // The reset button resets all fields including toggles to the default state.
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute('reset-template')).click()
        ARILCAddEditPage.getShortWait()

        // Verify value reset to default state 
        cy.get(AREmailTemplateModal.getSubjectTxtF()).should('have.value', 'You have been enrolled in {{CourseName}}')
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Send to administrators')).should('have.attr', 'aria-checked', 'false')
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute('Send to supervisor')).should('have.attr', 'aria-checked', 'false')

        // Cancel the Template
        cy.get(AREmailTemplateModal.getCancelBtn()).click()
        ARILCAddEditPage.getShortWait()

        // Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        ARILCAddEditPage.getMediumWait()

        // portal level template remains unchanged after making changes to a course level template
        // We Check Instructor Led Course Enrollment Template
        // Navigate to Message Templates
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Message Templates'))
        cy.intercept('/api/rest/v2/admin/reports/message-templates').as('messageTemplates').wait('@messageTemplates')
        
        arDashboardPage.AddFilter('Type', 'Instructor Led Course Enrollment')
        ARILCAddEditPage.getMediumWait()

        cy.get(arDashboardPage.getAddFilterBtn()).click();
        cy.get(arDashboardPage.getPropertyName() + arDashboardPage.getDDownField()).eq(0).click();
        cy.get(arDashboardPage.getPropertyNameDDownSearchTxtF()).type('Language')
        cy.get(arDashboardPage.getPropertyNameDDownOpt()).contains(new RegExp("^" + 'Language' + "$", "g")).click()
        ARILCAddEditPage.getMediumWait()

        cy.get(arDashboardPage.getOperator() + arDashboardPage.getDDownField()).eq(1).click()
        ARILCAddEditPage.getMediumWait()
        cy.get(arDashboardPage.getOperatorDDownOpt()).contains('English').click({ force: true })
        cy.get(arDashboardPage.getSubmitAddFilterBtn()).click();
        ARILCAddEditPage.getMediumWait()

        cy.get(arDashboardPage.getTableCellName(2)).contains('Instructor Led Course Enrollment').click({ force: true})
        ARILCAddEditPage.getMediumWait()
        cy.get(arDashboardPage.getElementByTitleAttribute('Reset to Default')).should('have.attr', 'aria-disabled', 'true')
    })
})
