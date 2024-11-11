/// <reference types = "cypress"/>

import { users } from '../../../../../../helpers/TestData/users/users'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import { messages } from '../../../../../../helpers/TestData/Courses/ilc'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import ARComposeMessage from '../../../../../../helpers/AR/pageObjects/Departments/ARComposeMessage'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'



describe("AR - Enrollments - Enrollments by Course Mass Action Message Users", function () {

    beforeEach(function () {
        //Admin is logged into the admin side
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Admin has access to the Course Enrollments page
        ARDashboardPage.getCourseEnrollmentReport()
        //Filter courses based on name 
        ARCoursesPage.EnrollmentPageFilter(courses.oc_filter_01_name)
        cy.get(ARCoursesPage.getTableCellName(2)).eq(0).click()
        ARCoursesPage.getShortWait()
        cy.get(ARCoursesPage.getTableCellName(2)).eq(1).click()
        ARCoursesPage.getShortWait()
        //As an Admin I select the Message users button
        cy.get(ARCoursesPage.getCourseEnrollmentActionHeader()).should("contain", "Mass Actions")
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Message Users')).should("contain", "Message Users")
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Message Users')).click()
        ARCoursesPage.getShortWait()
    })

   

    it("Admin can select Message users Button", function () {
         
        cy.get(ARCoursesPage.getPageHeaderTitle()).should("contain", "Compose Message")

        //Verify Send button is greyed out
        cy.get(ARComposeMessage.getSaveBtn()).should('have.attr', 'aria-disabled', 'true')

        cy.get(ARComposeMessage.getElementByDataNameAttribute(ARComposeMessage.getRecipientTagBtn())).first().click()

        //Verify Reciepient Count TF
        cy.get(ARComposeMessage.getRecipientCountTxtField()).should("contain", "This message will be sent to 1 Users.")
        //Verify BodyTF and SubjectTF
        cy.get(ARComposeMessage.getSubjectTxtF()).should('have.value', '')
        cy.get(ARCoursesPage.getElementByAriaLabelAttribute(ARComposeMessage.getTextArea())).should('have.value', '')

        //Assertions on compose message page 
        cy.get(ARComposeMessage.getSubjectTxtF()).type(messages.emailTemplateSubject)
        cy.get(ARCoursesPage.getElementByAriaLabelAttribute(ARComposeMessage.getTextArea())).type(messages.emailTemplateBody)
        cy.get(ARComposeMessage.getSaveBtn()).should('have.attr', 'aria-disabled', 'false')
        //Verify send to individuals only radio btn allows you to select 
        cy.get(ARComposeMessage.getSendToRadioBtn()).contains('Send to individuals only').click()
        //Verify send to departments radio btn allows you to select
        cy.get(ARComposeMessage.getSendToRadioBtn()).contains('Send to departments').click()
        //Verify send to groups radio btn allows you to select
        cy.get(ARComposeMessage.getSendToRadioBtn()).contains('Send to groups').click()

    })


    it("Admin can cancel sending message ", function () {
        //Different Test
        //Admin can cancel sending message
        cy.get(ARComposeMessage.getCancelBtn()).click()
        ARCoursesPage.getShortWait()
        cy.get(ARCoursesPage.getPageHeaderTitle()).should("contain", "Course Enrollments")
    })

    it("Admin can type in the subject and body ", function () {
         
        //After typing data in SubjectTF and BodyTF 
        cy.get(ARComposeMessage.getSubjectTxtF()).type(messages.emailTemplateSubject)
        cy.get(ARCoursesPage.getElementByAriaLabelAttribute(ARComposeMessage.getTextArea())).type(messages.emailTemplateBody)
        cy.get(ARComposeMessage.getSaveBtn()).should('have.attr', 'aria-disabled', 'false')
        //After clearing out SubjectTF and BodyTF , Send button is Disabled
        cy.get(ARComposeMessage.getSubjectTxtF()).clear()
        cy.get(ARComposeMessage.getSubjectTxtF()).should('have.value', '')
        cy.get(ARCoursesPage.getElementByAriaLabelAttribute(ARComposeMessage.getTextArea())).clear()
        cy.get(ARCoursesPage.getElementByAriaLabelAttribute(ARComposeMessage.getTextArea())).should('have.value', '')
        cy.get(ARComposeMessage.getSaveBtn()).should('have.attr', 'aria-disabled', 'true')

    })

    it("Admin can send messages", function () {
         
        cy.get(ARComposeMessage.getSubjectTxtF()).type(messages.emailTemplateSubject)
        cy.get(ARCoursesPage.getElementByAriaLabelAttribute(ARComposeMessage.getTextArea())).type(messages.emailTemplateBody)
        cy.get(ARComposeMessage.getSaveBtn()).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARComposeMessage.getSaveBtn()).click()
    })



})

