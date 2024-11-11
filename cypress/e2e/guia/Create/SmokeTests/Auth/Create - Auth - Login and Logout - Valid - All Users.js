/**
 * Tests for the Create Login and Logout process for all users (valid cases only)
 * Verifying the user reaches the correct page and  can log in
 * Verifying that the correct user is logged in
 * 
    Covers: 
    QAAUT-2749 - Create - Stand Alone - Login and Logout - Valid
 */

    let userName = [users.createAuthor.create_type_author, users.createDesigner.create_type_designer, users.createOwner.create_type_owner, users.createProducer.create_type_producer, users.createPublisher.create_type_publisher, users.createReviewer.create_type_reviewer]

/// <reference types="cypress" />
//import users from '../../../../../fixtures/users.json'
import {users} from "../../../../../../helpers/TestData/users/users";
import createLoginPage from '../../../../../../helpers/Create/pageObjects/Auth/CreateLoginPage'
import createDashboardPage from '../../../../../../helpers/Create/pageObjects/Dashboard/CreateDashboardPage'

describe('Create - Auth - Login and Logout - Valid', () => {
   it('Login to Absorb Createside', () => {
     for (let i = 0; i < userName.length; i++) {
         switch(userName[i]){
            case users.createReviewer.create_type_reviewer:
               cy.createAdmin(users.createReviewer.create_reviewer_username, users.createReviewer.create_reviewer_password);
               cy.get(createDashboardPage.getReviewTab()).should('have.text',  createDashboardPage.getReviewBtnValue());  //verify that we are on correct login page as correct user
               cy.get(createDashboardPage.getCreateBtn()).should('not.exist', createDashboardPage.getCreateBtn()) //Verify create button does not appear
               cy.get(createDashboardPage.getUserBtn()).click();
               cy.get(createDashboardPage.getUser()).should('contain.text', `${userName[i]}`); //verify correct user is logged in
               cy.logoutCreate()
               cy.get(createLoginPage.getLoginBtn()).should('contain.text', "Sign in"); //verify logout was successful
            break;          
            case users.createAuthor.create_type_author:
               cy.createAdmin(users.createAuthor.create_author_username, users.createAuthor.create_author_password);
               break;
            case users.createDesigner.create_type_designer:
               cy.createAdmin(users.createDesigner.create_designer_username, users.createDesigner.create_designer_password)
               break;
            case users.createOwner.create_type_owner:
               cy.createAdmin(users.createOwner.create_owner_username, users.createOwner.create_owner_password);
               break;
            case users.createProducer.create_type_producer:
               cy.createAdmin(users.createProducer.create_producer_username, users.createProducer.create_producer_password)
               break;
            case users.createPublisher.create_type_publisher:
               cy.createAdmin(users.createPublisher.create_publisher_username, users.createPublisher.create_publisher_password)
               break;
            
            default:
               cy.addContext(`Invalid user in switch case, user provided was: ${userName[i]}`)
              break;
         }
               if(userName[i] != "Reviewer"){
               cy.get(createDashboardPage.getCreateBtn()).should('have.text', createDashboardPage.getCreateBtnValue());   //verify that we are on correct login page
               cy.get(createDashboardPage.getUserBtn()).click()
               cy.get(createDashboardPage.getUser()).should('contain.text', `${userName[i]}`); //verify correct user is logged in
               cy.logoutCreate();
               cy.get(createLoginPage.getLoginBtn()).should('contain.text', createLoginPage.getSignInValue()); //verify logout was successful
               }

         
      }
   
   })
})