/**
 * AR - Smoke - Auth - Forgot Password - Valid.js
 * QAAUT-2437 - Tests for Forgot Password Admin Side
 * Test includes triggering of sending email to reset password for unauthenticated users
 * Checking of email is to be done manually on qa.guiauto5@absorblms.com
 */

// ---------------- Support Code: ----------------


/// <reference types="cypress" />
import arLoginPage from '../../../../../../helpers/AR/pageObjects/Auth/ARLoginPage'
import arForgotPasswordPage from '../../../../../../helpers/AR/pageObjects/Auth/ARForgotPasswordPage'
import arStrings from '../../../../../../helpers/AR/modules/ARStrings.module.json'
import { users } from '../../../../../../helpers/TestData/users/users'


describe('AR - Smoke - Auth - Forgot Password - Valid', () => {

   beforeEach(function () {
      /*Direct path to the forgot password page, the title for the page is not correct, bug https://absorblms.atlassian.net/browse/NASA-7809
      //has been created for the issue, the line will remain commented out until the issue is resolved.*/
     // cy.visit('/admin/login/forgotPassword'); 
      cy.visit("/admin");
      cy.contains('button', 'Forgot Password?').click()
   })

   it('Verify Form Contents', () => {
      // this replaces the verify visual test
      cy.title().should('eq', 'Forgot Password? - Absorb LMS');
      cy.get(arForgotPasswordPage.getUsernameTxt()).should('have.text', 'Username');
      cy.get(arForgotPasswordPage.getEmailTxt()).should('have.text', 'Email Address');
      cy.get(arForgotPasswordPage.getSubmitBtn()).should('be.visible');
      cy.get(arForgotPasswordPage.getSubmitBtn()).should('have.attr', 'aria-disabled', 'true');

   })

   it('Enter valid username, click Submit button', function () {
      cy.get(arForgotPasswordPage.getUsernameTxtF()).clear().type(`${users.sysAdminLogInOut.admin_sys_loginout_username}`);
      cy.get(arForgotPasswordPage.getSubmitBtn()).should('have.attr', 'aria-disabled', 'false');
      cy.get(arForgotPasswordPage.getSubmitBtn()).click();
   })

   it('Verify Success Form Contents after reset with username', function () {
      // this replaces the verify visual test
      cy.title().should('eq', 'Forgot Password? - Absorb LMS');
      cy.get(arForgotPasswordPage.getUsernameTxt()).should('have.text', 'Username');
      cy.get(arForgotPasswordPage.getEmailTxt()).should('have.text', 'Email Address');
      cy.get(arForgotPasswordPage.getSubmitBtn()).should('be.visible');
      cy.get(arForgotPasswordPage.getSubmitBtn()).should('have.attr', 'aria-disabled', 'true');


      cy.get(arForgotPasswordPage.getUsernameTxtF()).clear().type(`${users.sysAdminLogInOut.admin_sys_loginout_username}`);
      arForgotPasswordPage.getShortWait()
      cy.get(arForgotPasswordPage.getSubmitBtn()).click();
      cy.get(arForgotPasswordPage.getSuccessMsg()).should('have.text', arStrings.AR_TOAST_MSG_FORGOT_PASSWORD_LINK_SENT_SUCCESSFUL);
   });


   it('Enter valid email, click Submit button', function () {
      cy.get(arForgotPasswordPage.getEmailTxtF()).clear().type(`${users.sysAdminLogInOut.admin_sys_loginout_username}`);
      cy.get(arForgotPasswordPage.getSubmitBtn()).should('have.attr', 'aria-disabled', 'false');
      cy.get(arForgotPasswordPage.getSubmitBtn()).click();
   });

   it('Verify Success Form Contents after reset with email', function () {
      // this replaces the verify visual test
      cy.title().should('eq', 'Forgot Password? - Absorb LMS');
      cy.get(arForgotPasswordPage.getUsernameTxt()).should('have.text', 'Username');
      cy.get(arForgotPasswordPage.getEmailTxt()).should('have.text', 'Email Address');
      cy.get(arForgotPasswordPage.getSubmitBtn()).should('be.visible');
      cy.get(arForgotPasswordPage.getSubmitBtn()).should('have.attr', 'aria-disabled', 'true');

      cy.get(arForgotPasswordPage.getUsernameTxtF()).clear().type(`${users.sysAdminLogInOut.admin_sys_loginout_username}`);
      arForgotPasswordPage.getShortWait()
      cy.get(arForgotPasswordPage.getSubmitBtn()).click();
      cy.get(arForgotPasswordPage.getSuccessMsg()).should('have.text', arStrings.AR_TOAST_MSG_FORGOT_PASSWORD_LINK_SENT_SUCCESSFUL);
   })
});

