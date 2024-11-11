import ARLoginPage from "../../../../../../helpers/AR/pageObjects/Auth/ARLoginPage";
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal";
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal";
import ARUserAddEditPage from "../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage";
import ARUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage";
import { departments } from "../../../../../../helpers/TestData/Department/departments";
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails";
import { users } from "../../../../../../helpers/TestData/users/users";

describe("C7344 - AUT-709 - AE - Core Regression - Users - Reset Password for user ", () => {

    before('Navigate to the Users report page and create the test User', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getUsersReport()

        cy.wrap(ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getAddEditMenuActionsByName('Add User'), 1000))
        cy.get(ARUserAddEditPage.getAddEditMenuActionsByName('Add User')).click()
        // Verify Add user Page should be displayed
        cy.get(ARUserAddEditPage.getPageHeaderTitle()).should('have.text', "Add User")

        cy.get(ARUserAddEditPage.getFirstNameTxtF()).type(userDetails.firstName)
        cy.get(ARUserAddEditPage.getMiddleNameTxtF()).type(userDetails.middleName)
        cy.get(ARUserAddEditPage.getLastNameTxtF()).type(userDetails.lastName)
        cy.get(ARUserAddEditPage.getEmailAddressTxtF()).type(userDetails.emailAddress)
        cy.get(ARUserAddEditPage.getUsernameTxtF()).type(userDetails.username)
        cy.get(ARUserAddEditPage.getPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getConfirmPasswordTxtF()).type(userDetails.validPassword)

        cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.dept_top_name])

        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('be.visible')
    })

    after('Delete the new user as part of clean-up', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getUsersReport()
        ARDashboardPage.getMediumWait();
        cy.wrap(ARUserPage.AddFilter('Username', 'Equals', userDetails.username))
        ARDashboardPage.getMediumWait();
        cy.get(ARUserPage.getGridTable()).eq(0).click()
        ARDeleteModal.getDeleteItem()
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
        cy.get(ARUserAddEditPage.getNoResultMsg()).should('have.text', "No results found.")
    })

    it("Login and navigate to the Users report page to user\'s Passwrod Reset", () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.url().should('include', '/admin/dashboard')

        ARDashboardPage.getUsersReport()
        ARUserPage.getShortWait()
        cy.get(ARUserPage.getPageHeaderTitle('Users')).should('exist')
        cy.wrap(ARUserPage.AddFilter('Username', 'Equals', userDetails.username))
        ARUserPage.getMediumWait()
        cy.get(ARUserAddEditPage.getGridTable()).eq(0).click()
        ARUserAddEditPage.getMediumWait()

        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Reset Password'), 2000))
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Reset Password')).click()
        cy.url().should('contain', '/account/sendResetPasswordMessage')
        ARUserPage.getMediumWait()
        cy.get(ARUserPage.getSaveBtn()).click()
        ARUserPage.getShortWait()
        cy.get(ARUserAddEditPage.getSendResetPasswordAlert()).should('contain', 'Reset Password Succeeded')
        ARUserAddEditPage.getMediumWait()
    })    
});