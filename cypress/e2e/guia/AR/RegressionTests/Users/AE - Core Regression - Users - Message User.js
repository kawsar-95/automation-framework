import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import ARComposeMessage from '../../../../../../helpers/AR/pageObjects/Departments/ARComposeMessage'
import { messages } from '../../../../../../helpers/TestData/Courses/ilc'
import ARLoginPage from '../../../../../../helpers/AR/pageObjects/Auth/ARLoginPage'
import AdminNavationModuleModule from '../../../../../../helpers/AR/modules/AdminNavationModule.module'

describe('C7347 - AUT-712 - AE - Core Regression - Users - Message user', () => {
    before('Create a Learner user for the test', () => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    it('Select and send message to the selected User', () => {
        // Navigate to the Login page, enter Admin credentials and hit Login
        cy.visit('/admin/login')
        ARDashboardPage.getLongWait()
        cy.get(ARLoginPage.getUsernameTxtF()).type(users.sysAdmin.admin_sys_01_username)
        cy.get(ARLoginPage.getPasswordTxtF()).type(users.sysAdmin.admin_sys_01_password)
        cy.wrap(ARLoginPage.WaitForElementStateToChange(ARLoginPage.getLoginBtn()))
        cy.get(ARLoginPage.getLoginBtn()).click()
        ARDashboardPage.getVLongWait()
        cy.url().should('include', '/admin/dashboard')

        // Navigate to the Users page
        AdminNavationModuleModule.navigateToUsersPage()

        // Select any user
        ARUserPage.AddFilter('Username', 'Contains', userDetails.username)
        ARUserPage.getMediumWait()
        cy.get(ARUserPage.getGridTable()).eq(0).click()
        ARUserPage.getMediumWait()
        // Click on message user button
        cy.get(ARUserPage.getAddEditMenuActionsByName('Message User')).click()
        ARUserPage.getMediumWait()
        // Verify Reciepient Count         
        cy.get(ARComposeMessage.getRecipientCountTxtField()).should("contain", "This message will be sent to 1 Users.")
        // Enter text in subject and message body 
        cy.get(ARComposeMessage.getSubjectTxtF()).type(messages.emailTemplateSubject)
        cy.get(ARComposeMessage.getMessageBodyText()).type(messages.emailTemplateBody)
        ARUserPage.getShortWait()
        // Click on send button
        cy.get(ARComposeMessage.getSaveBtn()).click({ force: true })
        ARUserPage.getLongWait()
        cy.get(ARUserPage.getRemovefilterBtn()).click()
    })

    after('Delete the new User', () => {
        ARUserPage.AddFilter('Username', 'Contains', userDetails.username)
        ARUserPage.getShortWait()
        cy.get(ARUserPage.getGridTable()).eq(0).click()
        ARUserPage.getMediumWait()
        cy.get(ARUserPage.getAddEditMenuActionsByName('Delete')).click()
        ARUserPage.getShortWait()
        cy.get(ARDeleteModal.getDeleteConfirmBtn()).click()
        ARUserPage.getMediumWait()
    })
})