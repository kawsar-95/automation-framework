/**
 * Tests for Admin Login and Logout process as an admin (valid cases only)
 *
 * Functionality not covered in the test below:
 * "Keep me logged in" checkbox (untested)
 * 
    Covers: 
    QAAUT-2571 GUIA - Cypress Rewrite - AR - Smoke  - Auth - Login and Logout - Valid - As Admin
 */


/// <reference types="cypress" />
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import CreateCoursePage from '../../../../../../helpers/AR/pageObjects/SmokeObjects/CreateCoursePage';
import { users } from '../../../../../../helpers/TestData/users/users'

//verify that the forgot password page can be reached from the login page
it('Verify that the Forgot Password page appears', () => {
    cy.visit("/admin");
   cy.contains('button', 'Forgot Password?').click()
   cy.title().should('eq', 'Forgot Password? - Absorb LMS');
  })*

  //Login and logout as a valid Admin
describe('AR - Smoke - Auth - Login and Logout - Valid - As Admin', () => {
   it('Login to the Admin side', () =>{ 
        cy.loginAdmin(users.adminLogInOut.admin_loginout_username, users.adminLogInOut.admin_loginout_password);
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain.text',"GUI_Auto Admin LogInOut")
        cy.logoutAdmin()
        cy.get(CreateCoursePage.getARLoginBtn()).should('contain.text', 'Login')
    })
})


