/**
 * QAAUT-2653 - Tests for Invalid User Login 
 * Tests include incorrect username, incorrect password, no username, no password, space for a username and space for a password
 * Final test is to login a legitimate user to avoid locking the user out
 *
 */

// ---------------- Support Code: ----------------


/// <reference types="cypress" />
import arLoginPage from '../../../../../../helpers/AR/pageObjects/Auth/ARLoginPage'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import CreateCoursePage from '../../../../../../helpers/AR/pageObjects/SmokeObjects/CreateCoursePage'


describe('AR - Smoke - Auth - Login and Logout - Invalid', () => {
   it('Login attempt with invalid username, valid password on the admin side', () =>{ 
        cy.visit("/admin")
        cy.get(arLoginPage.getUsernameTxtF()).type(users.adminLogInOut.admin_loginout_fname)
        cy.get(arLoginPage.getPasswordTxtF()).type(users.adminLogInOut.admin_loginout_password)
        cy.wrap(arLoginPage.WaitForElementStateToChange(arLoginPage.getLoginBtn()))
        cy.get(arLoginPage.getLoginBtn()).click()
        cy.get(arLoginPage.getLoginErrorMsg()).should('have.text', arLoginPage.getLoginErrorTxt())
    })

    it('Login attempt with valid username, invalid password on the admin side', () =>{ 
      cy.visit("/admin")
      cy.get(arLoginPage.getUsernameTxtF()).type(users.adminLogInOut.admin_loginout_username)
      cy.get(arLoginPage.getPasswordTxtF()).type(users.adminLogInOut.admin_loginout_fname)
      cy.wrap(arLoginPage.WaitForElementStateToChange(arLoginPage.getLoginBtn()))
      cy.get(arLoginPage.getLoginBtn()).click()
      cy.get(arLoginPage.getLoginErrorMsg()).should('have.text', arLoginPage.getLoginErrorTxt())
  })


   it('Login attempt with valid username only, , verify login button is grayed out', () => {
      cy.visit("/admin")
      cy.get(arLoginPage.getUsernameTxtF()).type(users.adminLogInOut.admin_loginout_username)
      cy.get(arLoginPage.getLoginBtn()).should('have.attr', 'aria-disabled', 'true')
   })

   it('Login attempt with valid username and blank password, verify error message', () => {
      cy.visit("/admin")
      cy.get(arLoginPage.getUsernameTxtF()).type(users.adminLogInOut.admin_loginout_username)
      cy.get(arLoginPage.getPasswordTxtF()).type(" ")
      cy.wrap(arLoginPage.WaitForElementStateToChange(arLoginPage.getLoginBtn()))
      cy.get(arLoginPage.getLoginBtn()).click()
      cy.get(arLoginPage.getLoginErrorMsg()).should('have.text', arLoginPage.getLoginErrorTxt())
   })

   it('Login attempt with valid password only, verify login button is grayed out', () => {
      cy.visit("/admin")
      cy.get(arLoginPage.getPasswordTxtF()).type(users.adminLogInOut.admin_loginout_password)
      cy.get(arLoginPage.getLoginBtn()).should('have.attr', 'aria-disabled', 'true')
   })

   it('Login attempt with blank username and valid password, verify error message', () => {
      cy.visit("/admin")
      cy.get(arLoginPage.getUsernameTxtF()).type(" ")
      cy.get(arLoginPage.getPasswordTxtF()).type(users.adminLogInOut.admin_loginout_password)
      cy.wrap(arLoginPage.WaitForElementStateToChange(arLoginPage.getLoginBtn()))
      cy.get(arLoginPage.getLoginBtn()).click()
      cy.get(arLoginPage.getLoginErrorMsg()).should('have.text', arLoginPage.getLoginErrorTxt())
   })

   it('Login to the Admin side to make sure the account is not locked', () =>{ 
      cy.loginAdmin(users.adminLogInOut.admin_loginout_username, users.adminLogInOut.admin_loginout_password);
      cy.get(arDashboardPage.getCurrentUserLabel()).should('contain.text',"GUI_Auto Admin LogInOut")
      cy.logoutAdmin()
      cy.get(CreateCoursePage.getARLoginBtn()).should('contain.text', 'Login')
   })

})




