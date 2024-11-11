/**
 * Tests for the Create Login and Logout process as a System Admin (valid cases only)
 *
 * 
    Covers: 
    AC-536 GUIA - Create - Stand Alone - Login and Logout - Valid
 */

    
/// <reference types="cypress" />
//import users from '../../../../../fixtures/users.json'
import {users} from "../../../../../../helpers/TestData/users/users";
import createLoginPage from '../../../../../../helpers/Create/pageObjects/Auth/CreateLoginPage'
import createDashboardPage from '../../../../../../helpers/Create/pageObjects/Dashboard/CreateDashboardPage'

describe('Create - Auth - Login and Logout - Valid - As System Admin', () => {
   it('Login to Absorb Createside', () =>{ 
        cy.createAdmin(users.createSystemAdmin.create_system_admin_username, users.createSystemAdmin.create_system_admin_password);
        cy.get(createDashboardPage.getCreateBtn()).should('have.text', createDashboardPage.getCreateBtnValue());   //verify that we are on correct login page
        cy.get(createDashboardPage.getUserBtn()).click();
        cy.get(createDashboardPage.getUser()).should('contain.text', users.createSystemAdmin.create_system_admin_fullname); //verify correct user is logged in
        cy.logoutCreate();
        cy.get(createLoginPage.getLoginBtn()).should('contain.text', createLoginPage.getSignInValue()); //verify logout was successful
    })
})


