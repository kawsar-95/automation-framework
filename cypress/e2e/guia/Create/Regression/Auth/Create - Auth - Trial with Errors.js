/**
 * QAAUT-2812 - GUIA - Create- Stand Alone - Invalid Trial
 * Tests include missing firstname, missing lastname, missing email address, incorrect email address. missing password, missing Company name.
 * Tests also include unchecked Privay policy 
 * Final test creates a valid Trial account to verify error checking for a malformed email address for inviting others and then logging the user out at the end of the test
 *
 */

// ---------------- Support Code: ----------------


/// <reference types="cypress" />
//import users from '../../../../../fixtures/users.json'
import {users} from "../../../../../../helpers/TestData/users/users";
import createLoginPage from '../../../../../../helpers/Create/pageObjects/Auth/CreateLoginPage'
import createDashboardPage from '../../../../../../helpers/Create/pageObjects/Dashboard/CreateDashboardPage'
import createTrialDashboardPage from '../../../../../../helpers/Create/pageObjects/Dashboard/CreateTrialDashboardPage'
import createInviteOthers from '../../../../../../helpers/Create/pageObjects/Modals/InviteOthers'
import createCongratulations from '../../../../../../helpers/Create/pageObjects/Modals/Congratulation'
import createCourses from '../../../../../../helpers/Create/pageObjects/Courses/CreateCourse'


describe('Create - Auth - Trial with missing informaiton', () => {

   beforeEach(()=>{
      //Verify that the trial website is reached
      cy.visit(Cypress.env('createTrialURL'))
      cy.get(createTrialDashboardPage.getTrialTitle()).should('have.text', createTrialDashboardPage.getTrialtxt())

   })
   
   it('Verify correct error message appears when First name is not entered in creating Trial client', () =>{ 
      //enter trial user information with firstname missing
      cy.get(createTrialDashboardPage.getLastName()).type(users.createTrialUser.create_trial_lname)
      cy.get(createTrialDashboardPage.getEmail()).type(users.createTrialUser.create_type_emailprt1 + createTrialDashboardPage.getDate() + users.createTrialUser.create_type_emailprt2)
      cy.get(createTrialDashboardPage.getPassword()).type(users.createTrialUser.create_trial_password)
      cy.get(createTrialDashboardPage.getCompany()).type(users.createTrialUser.create_company_name)
      cy.get(createTrialDashboardPage.getPricayPolicy()).click()
      cy.get(createTrialDashboardPage.getCountryBtn()).click()
      cy.get(createTrialDashboardPage.getCountry()).contains(users.createTrialUser.create_country_name).click()
      cy.get(createTrialDashboardPage.getStartTrialBtn()).click()
      cy.get(createTrialDashboardPage.getErrorMessage()).should('have.text', createTrialDashboardPage.getGenralErrorMessagetxt())
   })

   it('Verify correct error message appears when Last Name is not entered in creating Trial client', () =>{ 
      //enter trial user information with last name missing
      cy.get(createTrialDashboardPage.getFirstName()).type(users.createTrialUser.create_trial_fname)
      cy.get(createTrialDashboardPage.getEmail()).type(users.createTrialUser.create_type_emailprt1 + createTrialDashboardPage.getDate() + users.createTrialUser.create_type_emailprt2)
      cy.get(createTrialDashboardPage.getPassword()).type(users.createTrialUser.create_trial_password)
      cy.get(createTrialDashboardPage.getCompany()).type(users.createTrialUser.create_company_name)
      cy.get(createTrialDashboardPage.getPricayPolicy()).click()
      cy.get(createTrialDashboardPage.getCountryBtn()).click()
      cy.get(createTrialDashboardPage.getCountry()).contains(users.createTrialUser.create_country_name).click()
      cy.get(createTrialDashboardPage.getStartTrialBtn()).click()
      cy.get(createTrialDashboardPage.getErrorMessage()).should('have.text', createTrialDashboardPage.getGenralErrorMessagetxt())
   })

   it('Verify correct error message appears when Email is not entered in creating Trial client', () =>{ 
      //enter trial user information with Email missing
      cy.get(createTrialDashboardPage.getFirstName()).type(users.createTrialUser.create_trial_fname)
      cy.get(createTrialDashboardPage.getLastName()).type(users.createTrialUser.create_trial_lname)
      cy.get(createTrialDashboardPage.getPassword()).type(users.createTrialUser.create_trial_password)
      cy.get(createTrialDashboardPage.getCompany()).type(users.createTrialUser.create_company_name)
      cy.get(createTrialDashboardPage.getPricayPolicy()).click()
      cy.get(createTrialDashboardPage.getCountryBtn()).click()
      cy.get(createTrialDashboardPage.getCountry()).contains(users.createTrialUser.create_country_name).click()
      cy.get(createTrialDashboardPage.getStartTrialBtn()).click()
      cy.get(createTrialDashboardPage.getErrorMessage()).should('have.text', createTrialDashboardPage.getEmailErrorMessagetxt())
   })

   it('Verify correct error message appears when Email is malformed', () =>{ 
      //enter trial user information with poorly formated email address
      cy.get(createTrialDashboardPage.getFirstName()).type(users.createTrialUser.create_trial_fname)
      cy.get(createTrialDashboardPage.getLastName()).type(users.createTrialUser.create_trial_lname)
      cy.get(createTrialDashboardPage.getEmail()).type(users.createTrialUser.create_type_emailprt1 + createTrialDashboardPage.getDate())
      cy.get(createTrialDashboardPage.getPassword()).type(users.createTrialUser.create_trial_password)
      cy.get(createTrialDashboardPage.getCompany()).type(users.createTrialUser.create_company_name)
      cy.get(createTrialDashboardPage.getPricayPolicy()).click()
      cy.get(createTrialDashboardPage.getCountryBtn()).click()
      cy.get(createTrialDashboardPage.getCountry()).contains(users.createTrialUser.create_country_name).click()
      cy.get(createTrialDashboardPage.getStartTrialBtn()).click()
      cy.get(createTrialDashboardPage.getErrorMessage()).should('have.text', createTrialDashboardPage.getEmailErrorMessagetxt())
   })


   //This test is currently commented out as it is not working correctly in the code. Bug https://absorblms.atlassian.net/browse/AC-596 has been created for that issue. The test below is valid and
   //will be commented out once the bug is resolved
  /* it('Verify correct error message appears when Password is not entered in creating Trial client', () =>{ 

      //enter trial user information with Password missing
      cy.get(createTrialDashboardPage.getFirstName()).type(users.createTrialUser.create_trial_fname)
      cy.get(createTrialDashboardPage.getLastName()).type(users.createTrialUser.create_trial_lname)
      cy.get(createTrialDashboardPage.getEmail()).type(users.createTrialUser.create_type_emailprt1 + createTrialDashboardPage.getDate() + users.createTrialUser.create_type_emailprt2)
      cy.get(createTrialDashboardPage.getCompany()).type(users.createTrialUser.create_company_name)
      cy.get(createTrialDashboardPage.getPricayPolicy()).click()
      cy.get(createTrialDashboardPage.getCountryBtn()).click()
      cy.get(createTrialDashboardPage.getCountry()).contains(users.createTrialUser.create_country_name).click()
      cy.get(createTrialDashboardPage.getStartTrialBtn()).click()
      cy.get(createTrialDashboardPage.getErrorMessage()).should('have.text', "All fields are mandatory")
   })*/

   it('Verify correct error message appears when Company is not entered in creating Trial client', () =>{ 
      //enter trial user information with Company name missing
      cy.get(createTrialDashboardPage.getFirstName()).type(users.createTrialUser.create_trial_fname)
      cy.get(createTrialDashboardPage.getLastName()).type(users.createTrialUser.create_trial_lname)
      cy.get(createTrialDashboardPage.getEmail()).type(users.createTrialUser.create_type_emailprt1 + createTrialDashboardPage.getDate() + users.createTrialUser.create_type_emailprt2)
      cy.get(createTrialDashboardPage.getPassword()).type(users.createTrialUser.create_trial_password)
      cy.get(createTrialDashboardPage.getPricayPolicy()).click()
      cy.get(createTrialDashboardPage.getCountryBtn()).click()
      cy.get(createTrialDashboardPage.getCountry()).contains(users.createTrialUser.create_country_name).click()
      cy.get(createTrialDashboardPage.getStartTrialBtn()).click()
      cy.get(createTrialDashboardPage.getErrorMessage()).should('have.text', createTrialDashboardPage.getGenralErrorMessagetxt())
   })

   it('Verify correct error message appears when Country is not selected in creating Trial client', () =>{ 

      //enter trial user information with Country missing
      cy.get(createTrialDashboardPage.getFirstName()).type(users.createTrialUser.create_trial_fname)
      cy.get(createTrialDashboardPage.getLastName()).type(users.createTrialUser.create_trial_lname)
      cy.get(createTrialDashboardPage.getEmail()).type(users.createTrialUser.create_type_emailprt1 + createTrialDashboardPage.getDate() + users.createTrialUser.create_type_emailprt2)
      cy.get(createTrialDashboardPage.getPassword()).type(users.createTrialUser.create_trial_password)
      cy.get(createTrialDashboardPage.getCompany()).type(users.createTrialUser.create_company_name)
      cy.get(createTrialDashboardPage.getPricayPolicy()).click()
      cy.get(createTrialDashboardPage.getStartTrialBtn()).click()
      cy.get(createTrialDashboardPage.getErrorMessage()).should('have.text', createTrialDashboardPage.getGenralErrorMessagetxt())
   })

   it('Verify correct error message appears when the Privacy Policy is not selected in creating Trial client', () =>{ 

      //enter trial user information with Privacy Policy missing
      cy.get(createTrialDashboardPage.getFirstName()).type(users.createTrialUser.create_trial_fname)
      cy.get(createTrialDashboardPage.getLastName()).type(users.createTrialUser.create_trial_lname)
      cy.get(createTrialDashboardPage.getEmail()).type(users.createTrialUser.create_type_emailprt1 + createTrialDashboardPage.getDate() + users.createTrialUser.create_type_emailprt2)
      cy.get(createTrialDashboardPage.getPassword()).type(users.createTrialUser.create_trial_password)
      cy.get(createTrialDashboardPage.getCompany()).type(users.createTrialUser.create_company_name)
      cy.get(createTrialDashboardPage.getCountryBtn()).click()
      cy.get(createTrialDashboardPage.getCountry()).contains(users.createTrialUser.create_country_name).click()
      cy.get(createTrialDashboardPage.getStartTrialBtn()).click()
      cy.get(createTrialDashboardPage.getErrorMessage()).should('have.text', createTrialDashboardPage.getGenralErrorMessagetxt())
   })

   it('Create a Trial client for more tests', () =>{ 
      //Enter trial user information
      cy.get(createTrialDashboardPage.getFirstName()).type(users.createTrialUser.create_trial_fname)
      cy.get(createTrialDashboardPage.getLastName()).type(users.createTrialUser.create_trial_lname)
      cy.get(createTrialDashboardPage.getEmail()).type(users.createTrialUser.create_type_emailprt1 + createTrialDashboardPage.getDate() + users.createTrialUser.create_type_emailprt2)
      cy.get(createTrialDashboardPage.getPassword()).type(users.createTrialUser.create_trial_password)
      cy.get(createTrialDashboardPage.getCompany()).type(users.createTrialUser.create_company_name)
      cy.get(createTrialDashboardPage.getPricayPolicy()).click()
      cy.get(createTrialDashboardPage.getCountryBtn()).click()
      cy.get(createTrialDashboardPage.getCountry()).contains(users.createTrialUser.create_country_name).click()
      cy.get(createTrialDashboardPage.getStartTrialBtn()).click()

      //Verify malformed emails do not allow progression to next page
      cy.get(createInviteOthers.getInviteOthers()).should('contain.text', createInviteOthers.getInviteOthersWelcometxt())
      cy.get(createInviteOthers.getInviteEmail()).type(createInviteOthers.getSendInviteMalformedEmailtxt())
      cy.get(createInviteOthers.getSendInviteBtn()).click()
      cy.get(createInviteOthers.getInviteOthers()).should('contain.text', createInviteOthers.getInviteOthersWelcometxt())
      cy.get(createInviteOthers.getSkipInviteBtn()).click()

      //Continue to the rest of trial creation and logout 
      cy.wait(100);
      //cy.get(createCongratulations.getCongratulations()).eq(1).click();
      cy.get(createCongratulations.getCongratulations()).click();

      //Verify user is on Create Dashboard
      cy.get(createCourses.getCloseCourseModal()).click();
      cy.get(createDashboardPage.getUserBtn()).click();  
      cy.get(createDashboardPage.getUser()).should('contain.text', users.createTrialUser.create_trial_fullname); //verify correct user is logged in

      //Verify user is logged out
      cy.logoutCreate()
      cy.get(createLoginPage.getLoginBtn()).should('contain.text', createLoginPage.getSignInValue())
   })
})



