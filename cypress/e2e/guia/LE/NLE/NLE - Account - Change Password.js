import arDashboardPage from '../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../helpers/TestData/users/users'
import arDashboardAccountMenu from '../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import nleChangePasswordPage from '../../../../../helpers/LE/pageObjects/NLE/NLEChangePasswordPage'
import defaultTestData from '../../../../fixtures/defaultTestData.json'
import arUnsavedChangesModal from '../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal'

describe('NLE- Validate Change Password in Account menu', function () {
 let i=0;
let newPass = 'testing2'
let weekPass= 'test12'
let midPass=   `testinga`
let strongPass= 'testingtesting'

    it('Validate change password page ', () =>{ 

       //Admin login in application
        cy.loginAdmin(users.adminLogInOut.admin_loginout_username, defaultTestData.USER_PASSWORD);
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain.text',"GUI_Auto Admin LogInOut")
        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        //Select Change password option from account menu
        cy.get(arDashboardAccountMenu.getChangePasswordBtn()).click({ force: true });
        cy.get(nleChangePasswordPage.getPageHeaderTitle()).should('have.text','Change Password')
        //Validate text boxes in change password page
        nleChangePasswordPage.getChangePasswordTxtBox()
        //validate text box fileds
        cy.get(nleChangePasswordPage.getCurrentPasswordTxtF()).should('have.attr',`aria-label`,`Current Password`)
        cy.get(nleChangePasswordPage.getNewPasswordTxtF()).should('have.attr',`aria-label`,`New Password`)
        cy.get(nleChangePasswordPage.getConfirmPasswordTxtF()).should('have.attr',`aria-label`,`Confirm Password`)
        //Validate Text box levels
        nleChangePasswordPage.getChangePasswordTxtBLevel()
        //Verify text box value 
        cy.get(nleChangePasswordPage.getCurrentPasswordTxtF()).type(users.adminLogInOut.admin_loginout_password).should(`have.attr`,`aria-invalid`,`false`)
        //Validate all required fields text box 
        cy.get(nleChangePasswordPage.getNewPasswordTxtF()).type(newPass)
        cy.get(nleChangePasswordPage.getSubmitBtn()).should(`have.attr`,`aria-disabled`,`true`)
        //Validate after clear cureent password text box error msg
        cy.get(nleChangePasswordPage.getCurrentPasswordTxtF()).clear()
        cy.get(nleChangePasswordPage.getCurrentPasswordTxtErrorMsg()).should('contain','Field is required.')
        //Validate cureent password error msg
        cy.get(nleChangePasswordPage.getConfirmPasswordTxtF()).type(newPass)
        cy.get(nleChangePasswordPage.getCurrentPasswordTxtF()).type(newPass)
        cy.get(nleChangePasswordPage.getSubmitBtn()).click().click({force:true})
        cy.get(nleChangePasswordPage.getCurrentPasswordTxtErrorMsg()).should('contain','Current Password is incorrect.')
        //Validate confirm password text box error msg
        cy.get(nleChangePasswordPage.getConfirmPasswordTxtF()).clear().type(defaultTestData.USER_PASSWORD)
        cy.get(nleChangePasswordPage.getSubmitBtn()).click().click({force:true})
        cy.get(nleChangePasswordPage.getConfirmPasswordTxtErrorMsg()).should('contain','Passwords do not match')
        //Validate new password with week password 
        cy.get(nleChangePasswordPage.getNewPasswordTxtF()).clear().type(weekPass)
        cy.get(nleChangePasswordPage.getNewPasswordTxtErrorMsg()).should('contain','Password must contain at least: 1 letter, 1 number and be at least 8 characters in length')
        //Validate new password complexity medium
        cy.get(nleChangePasswordPage.getNewPasswordTxtF()).clear().type(midPass)
        cy.get(nleChangePasswordPage.getNewPasswordTxtErrorMsg()).should('contain','Password must contain at least: 1 letter, 1 number and be at least 8 characters in length')
        //Validate new password complexity strong 
        cy.get(nleChangePasswordPage.getNewPasswordTxtF()).clear().type(strongPass)
        cy.get(nleChangePasswordPage.getNewPasswordTxtErrorMsg()).should('contain','Password must contain at least: 1 letter, 1 number and be at least 8 characters in length')
        //Validate after select the cancel redirect on the same page 
        cy.get(nleChangePasswordPage.getCancelBtn()).click()
        cy.get(arUnsavedChangesModal.getUnsavedChangesTxt()).should('contain',arUnsavedChangesModal.getUnsavedChangesMsg())
        cy.get(arUnsavedChangesModal.getCancelBtn()).contains('Cancel').click()
        cy.get(nleChangePasswordPage.getPageHeaderTitle()).should('contain','Change Password')

        //Validate after logoff to redirect on same page and able to save details 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardAccountMenu.getLogoutBtn())).click({ force: true });
        cy.loginAdmin(users.adminLogInOut.admin_loginout_username, defaultTestData.USER_PASSWORD);
        if(i==0){
            cy.log("Admin is not redirect on change password page")
        }else{
            cy.get(nleChangePasswordPage.getPageHeaderTitle()).should('have.text','Change Password')
        }
        
     })
 })