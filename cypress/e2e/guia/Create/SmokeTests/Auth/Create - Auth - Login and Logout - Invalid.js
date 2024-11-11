/**
 * QAAUT-2752 - GUIA - Create - Stand Alone - Login and Logout - Invalid
 * Tests include incorrect username, incorrect password, no username, no password, space for a username and space for a password
 * Final test is to login a legitimate user to verify login still works
 *
 */

// ---------------- Support Code: ----------------


/// <reference types="cypress" />
//import users from '../../../../../fixtures/users.json'
import {users} from "../../../../../../helpers/TestData/users/users";
import createLoginPage from '../../../../../../helpers/Create/pageObjects/Auth/CreateLoginPage'
import createDashboardPage from '../../../../../../helpers/Create/pageObjects/Dashboard/CreateDashboardPage'

describe('Create - Auth - Login and Logout - Invalid', () => {

   beforeEach(()=>{
      //Verify that the trial website is reached
      cy.visit(Cypress.env('createURL'))
   })

   it('Login attempt with invalid username, valid password for Create Standalone', () =>{ 
        cy.get(createLoginPage.getUsernameTxtF()).type(users.createOwner.create_owner_fname)
        cy.get(createLoginPage.getPasswordTxtF()).type(users.createOwner.create_owner_password)
        cy.get(createLoginPage.getLoginBtn()).click()
        cy.get(createLoginPage.getLoginErrorMsg()).should('have.text', createLoginPage.getLoginErrorTxt())     
    })

    it('Login attempt with valid username, invalid password for Create Standalone', () =>{ 
        cy.get(createLoginPage.getUsernameTxtF()).type(users.createOwner.create_owner_username)
        cy.get(createLoginPage.getPasswordTxtF()).type(users.createOwner.create_owner_fname)
        cy.get(createLoginPage.getLoginBtn()).click()
        cy.get(createLoginPage.getLoginErrorMsg()).should('have.text', createLoginPage.getLoginErrorTxt())   
  })    

   it('Login attempt with valid username only, verify correct error message appears', () => {
      cy.get(createLoginPage.getUsernameTxtF()).type(users.createOwner.create_owner_username)
      cy.get(createLoginPage.getLoginBtn()).click()
      cy.get(createLoginPage.getLoginErrorMsg()).should('have.text', createLoginPage.getLoginErrorTxt()) 
})

   it('Login attempt with valid username and blank password, verify error message', () => {
         cy.get(createLoginPage.getUsernameTxtF()).type(users.createOwner.create_owner_username)
         cy.get(createLoginPage.getPasswordTxtF()).type(" ")
         cy.get(createLoginPage.getLoginBtn()).click()
         cy.get(createLoginPage.getLoginErrorMsg()).should('have.text', createLoginPage.getLoginErrorTxt()) 
})

   it('Login attempt with valid password only, verify correct error message appears', () => {
         cy.get(createLoginPage.getPasswordTxtF()).type(users.createOwner.create_owner_password)
         cy.get(createLoginPage.getLoginBtn()).click()
         cy.get(createLoginPage.getLoginErrorMsg()).should('have.text', createLoginPage.getLoginErrorTxt()) 
   })

   it('Login attempt with blank username and valid password, verify error message', () => {
      cy.get(createLoginPage.getUsernameTxtF()).type(" ")
      cy.get(createLoginPage.getPasswordTxtF()).type(users.createOwner.create_owner_password)
      cy.get(createLoginPage.getLoginBtn()).click()
      cy.get(createLoginPage.getLoginErrorMsg()).should('have.text', createLoginPage.getLoginErrorTxt()) 
   })
})

describe('Create - Auth - Login and Logout - Invalid - Verify user can still login', () => {
   it('Login to Absorb Create Stand Alone - Verify user can still login', () =>{ 
        cy.createAdmin(users.createOwner.create_owner_username, users.createOwner.create_owner_password);
        cy.get(createDashboardPage.getCreateBtn()).should('have.text', createDashboardPage.getCreateBtnValue());   //verify that we are on correct login page
        cy.get(createDashboardPage.getUserBtn()).click()   
        cy.get(createDashboardPage.getUser()).should('contain.text', users.createOwner.create_owner_fullname); //verify correct user is logged in
        cy.logoutCreate()
        cy.get(createLoginPage.getLoginBtn()).should('contain.text', createLoginPage.getSignInValue()); //verify logout was successful
    })

})


