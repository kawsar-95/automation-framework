/**
 * QAAUT-2752 - GUIA - Create - Stand Alone - Login and Logout - Invalid
 * Tests include incorrect username, incorrect password, no username, no password, space for a username and space for a password
 * Final test is to login a legitimate user to verify login still works
 *
 */

// ---------------- Support Code: ----------------

/// <reference types="cypress" />
//import users from "../../../../../fixtures/users.json";
import {users} from "../../../../../../helpers/TestData/users/users";
import {courses} from "../../../../../../helpers/TestData/Courses/courses";
import createLoginPage from "../../../../../../helpers/Create/pageObjects/Auth/CreateLoginPage";
import createDashboardPage from "../../../../../../helpers/Create/pageObjects/Dashboard/CreateDashboardPage";
import createTrialDashboardPage from "../../../../../../helpers/Create/pageObjects/Dashboard/CreateTrialDashboardPage";
import createInviteOthers from "../../../../../../helpers/Create/pageObjects/Modals/InviteOthers";
import createCongratulations from "../../../../../../helpers/Create/pageObjects/Modals/Congratulation";
import createCourses from "../../../../../../helpers/Create/pageObjects/Courses/CreateCourse";

describe("Create - Auth - Valid Trial", () => {
    it("Create a Trial client", () => {
        //Verify that the trial website is reached
        cy.visit(Cypress.env("createTrialURL"));
        cy.get(createTrialDashboardPage.getTrialTitle()).should(
            "have.text",
            createTrialDashboardPage.getTrialtxt()
        );

        //Enter trial user information
        cy.get(createTrialDashboardPage.getFirstName()).type(users.createTrialUser.create_trial_fname);
        cy.get(createTrialDashboardPage.getLastName()).type(users.createTrialUser.create_trial_lname);
        cy.get(createTrialDashboardPage.getEmail()).type(users.createTrialUser.create_type_emailprt1 + createTrialDashboardPage.getDate() + users.createTrialUser.create_type_emailprt2);
        cy.get(createTrialDashboardPage.getPassword()).type(users.createTrialUser.create_trial_password);
        cy.get(createTrialDashboardPage.getCompany()).type(users.createTrialUser.create_company_name);
        cy.get(createTrialDashboardPage.getPricayPolicy()).click();
        cy.get(createTrialDashboardPage.getCountryBtn()).click();
        cy.get(createTrialDashboardPage.getCountry()).contains(users.createTrialUser.create_country_name).click();
        cy.get(createTrialDashboardPage.getStartTrialBtn()).click();

        //Verify and send Invite emails
        cy.get(createInviteOthers.getInviteOthers()).should("contain.text", createInviteOthers.getInviteOthersWelcometxt());
        cy.get(createInviteOthers.getInviteEmail()).type(createInviteOthers.getSendInviteEmailtxt());
        cy.get(createInviteOthers.getSendInviteBtn()).click();

        //Verify Congratulations for Trial message appears
        cy.get(createCongratulations.getCongratulations()).should("contain.text", createCongratulations.getCongratulationstxt());
        cy.wait(100);
        //cy.get(createCongratulations.getCongratulations()).eq(1).click();
        cy.get(createCongratulations.getCongratulations()).click();

        //Verify user is on Create Dashboard
        cy.get(createCourses.getThemeTemplates()).should("contain.text", createCourses.getThemeTemplatesValue());
        cy.get(createCourses.getCreateCourseTitle()).should("contain.text", createCourses.getCreateCourseTitleValue());
        cy.get(createCourses.getCreateThemeList()).children().eq(0).click();
        cy.get(createCourses.getThemeTitle()).should("contain.text", createCourses.getThemeTitleValue());
        cy.get(createCourses.getUseThemeBtn()).click();

       //Enter a Course Name
        cy.get(createCourses.getEnterCourseTitle()).should("contain.text", createCourses.getEnterCourseTitleValue());
        cy.get(createCourses.getCourseTitleTxtF()).eq(1).type(courses.create_TrialSmokeTest_01);
        cy.get(createCourses.getCreateContinueBtn()).eq(1).click();

        //Select pages to add to the Course
        cy.get(createCourses.getCreatePageBtn()).children().eq(0).click();
        cy.get(createCourses.getPageName()).should("contain.value",createCourses.getPageNameWelcomeValue());
        cy.get(createCourses.getCreatePageContinueBtn()).click();
        cy.get(createCourses.getPlusBtn()).click();
        cy.get(createCourses.getCreatePageBtn()).children().eq(32).click();
        cy.get(createCourses.getPageName()).should("contain.value",createCourses.getPageNameThankYou());
        cy.get(createCourses.getCreatePageContinueBtn()).click();
        
        //Return to main page and exit
        cy.get(createCourses.getHomeBtn()).click();
        cy.get(createDashboardPage.getUserBtn()).click()
        cy.get(createDashboardPage.getUser()).should("contain.text", users.createTrialUser.create_trial_fullname); //verify correct user is logged in

        //Verify user is logged out
        cy.logoutCreate();
        cy.get(createLoginPage.getLoginBtn()).should("contain.text", createLoginPage.getSignInValue());
    });
});
