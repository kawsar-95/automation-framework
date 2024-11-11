import { users } from '../../../../../../helpers/TestData/users/users'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import { messages } from '../../../../../../helpers/TestData/Courses/ilc'
import LEMessagesMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEMessagesMenu'
import ARComposeMessage from '../../../../../../helpers/AR/pageObjects/Departments/ARComposeMessage'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'

describe("C970 - Enrollments by Course Mass Action Message Users", function () {

    beforeEach(function () {
        //Admin is logged into the admin side
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Admin has access to the Course Enrollments page
        ARDashboardPage.getCourseEnrollmentReport()

        //Filter courses based on name 
        ARCoursesPage.EnrollmentPageFilter('GUIA')
        cy.get(ARCoursesPage.getTableCellName(2)).eq(0).click()
        ARCoursesPage.getShortWait()

        // 1.2 When one item is selected the single select menu is displayed on the right
        cy.get(ARCoursesPage.getCourseEnrollmentActionHeader()).should("contain", "Actions")
        // 1.1 Multiple line items (users) can be selected
        cy.get(ARCoursesPage.getTableCellName(2)).eq(1).click()
        ARCoursesPage.getShortWait()
    })

    it("As an admin can select multiple line items", function () {
        // 1.3 When multiple items are selected the multi select menu is displayed on the
        // 1.4 Message users is one of the options on the multi-select menu
        cy.get(ARCoursesPage.getCourseEnrollmentActionHeader()).should("contain", "Mass Actions")
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Message Users')).should("contain", "Message Users")
    })

    it("Admin can select Message users Button", function () {
        //As an Admin I select the Message users button
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Message Users')).click()
        ARCoursesPage.getShortWait()

        // 2.1 The Compose message page is displayed
        cy.get(ARCoursesPage.getPageHeaderTitle()).should("contain", "Compose Message")

        // 2.2 Verify Send button is greyed out
        cy.get(ARComposeMessage.getSaveBtn()).should('have.attr', 'aria-disabled', 'true')
        // 2.3 The To field is per-populated with the users selected from the Course Enrollments page
        cy.get(ARComposeMessage.getElementByDataNameAttribute(ARComposeMessage.getRecipientTagBtn())).its('length').should('be.gt', 0) 

        // 2.4 The Subject and Body fields are blank and required
        cy.get(ARComposeMessage.getSubjectTxtF()).should('have.value', '')
        cy.get(ARComposeMessage.getElementByDataNameAttribute(ARComposeMessage.getSubjectDataNameText())).should('contain', '(Required)')
        cy.get(ARCoursesPage.getElementByAriaLabelAttribute(ARComposeMessage.getTextArea())).should('have.value', '')
        cy.get(ARComposeMessage.getElementByDataNameAttribute(ARComposeMessage.getBodyDataNameText())).should('contain', '(Required)')
    })

    it("Admin can cancel sending message ", function () {
        //As an Admin I select the Message users button
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Message Users')).click()
        ARCoursesPage.getShortWait()
        //Admin can cancel sending message
        cy.get(ARComposeMessage.getCancelBtn()).click()
        ARCoursesPage.getShortWait()
        cy.get(ARCoursesPage.getPageHeaderTitle()).should("contain", "Course Enrollments")
    })    

    it("Admin can send messages", function () {
        //As an Admin I select the Message users button
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Message Users')).click()
        ARCoursesPage.getShortWait()
        
        // Add a learner
        cy.createUser(void 0, userDetails.username6, ["Learner"], void 0)
        cy.log('Username:',userDetails.username6)

        cy.get(ARComposeMessage.getElementByDataNameAttribute(ARComposeMessage.getToTextFieldDDown())).click()
        cy.get(ARComposeMessage.getToTextFieldDDownSearchTxtF()).type(userDetails.username6)
        ARComposeMessage.getShortWait()
        ARComposeMessage.getToTextFieldDDownUserNameOpt(userDetails.username6).click()

        cy.get(ARComposeMessage.getSubjectTxtF()).type('C970-test-subject')
        cy.get(ARCoursesPage.getElementByAriaLabelAttribute(ARComposeMessage.getTextArea())).type(messages.emailTemplateBody)
        // 4.1 When all required information is entered the Send button is enabled
        cy.get(ARComposeMessage.getSaveBtn()).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARComposeMessage.getSaveBtn()).click()

        // 4.2 Verify message appears to the selected users 
        cy.apiLoginWithSession(userDetails.username6, userDetails.validPassword, '/#/dashboard')
        cy.get(LEMessagesMenu.getMessageMenuBtn()).click()
        cy.get(LEMessagesMenu.getAllMessagesContainer()).within(() => {
            cy.get(LEMessagesMenu.getPriorityMessagesLinkBtn()).click()            
        })

        cy.get(LEMessagesMenu.getMessagesMenuMessageItem()).should('contain','C970-test-subject')
    })

    it("Admin can type in the subject and body ", function () {
        //As an Admin I select the Message users button
        cy.get(ARCoursesPage.getAddEditMenuActionsByName('Message Users')).click()
        ARCoursesPage.getShortWait()    
        // 5.1 After typing data in SubjectTF and BodyTF 
        cy.get(ARComposeMessage.getSubjectTxtF()).type(messages.emailTemplateSubject)
        cy.get(ARCoursesPage.getElementByAriaLabelAttribute(ARComposeMessage.getTextArea())).type(messages.emailTemplateBody)
        cy.get(ARComposeMessage.getSaveBtn()).should('have.attr', 'aria-disabled', 'false')
        // 5.2 After clearing out SubjectTF and BodyTF , Send button is Disabled
        cy.get(ARComposeMessage.getSubjectTxtF()).clear()
        cy.get(ARComposeMessage.getSubjectTxtF()).should('have.value', '')
        cy.get(ARCoursesPage.getElementByAriaLabelAttribute(ARComposeMessage.getTextArea())).clear()
        cy.get(ARCoursesPage.getElementByAriaLabelAttribute(ARComposeMessage.getTextArea())).should('have.value', '')
        cy.get(ARComposeMessage.getSaveBtn()).should('have.attr', 'aria-disabled', 'true')

        // 5.3 Correct error messages appear
        cy.get(ARComposeMessage.getElementByDataNameAttribute(ARComposeMessage.getSubjectDataNameText())).should('contain', 'Field is required.')
        cy.get(ARComposeMessage.getElementByDataNameAttribute(ARComposeMessage.getBodyDataNameText())).should('contain', 'Field is required.')
    })
})
