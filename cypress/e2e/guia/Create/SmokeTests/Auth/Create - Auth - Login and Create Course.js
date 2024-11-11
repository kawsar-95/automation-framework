/**
 * Tests for the Create Login and Logout process as a System Admin (valid cases only)
 *
 * 
    Covers: 
    AC-536 GUIA - Create - Stand Alone - Login and Logout - Valid
 */

/// <reference types="cypress" />
import {users} from "../../../../../../helpers/TestData/users/users";
import {courses} from "../../../../../../helpers/TestData/Courses/courses";
import createLoginPage from "../../../../../../helpers/Create/pageObjects/Auth/CreateLoginPage";
import createDashboardPage from "../../../../../../helpers/Create/pageObjects/Dashboard/CreateDashboardPage";
import createInviteOthers from "../../../../../../helpers/Create/pageObjects/Modals/InviteOthers";
import createCongratulations from "../../../../../../helpers/Create/pageObjects/Modals/Congratulation";
import createCourses from "../../../../../../helpers/Create/pageObjects/Courses/CreateCourse";
import createBasePage from "../../../../../../helpers/Create/CreateBasePage";

describe("Create - Auth - Login and Logout - Valid - As System Admin", () => {
    it("Login to Absorb Createside", () => {
        cy.createAdmin(
           users.createOwner.create_owner_username,
            users.createOwner.create_owner_password
        );
        //Verify correct user is logged in
        cy.get(createDashboardPage.getCreateBtn()).should("have.text", createDashboardPage.getCreateBtnValue()); //verify that we are on correct login page
        cy.get(createDashboardPage.getUserBtn()).click();
        cy.get(createDashboardPage.getUser()).should("contain.text", users.createOwner.create_owner_fullname); //verify correct user is logged in
        
        //Select and use a Theme
        cy.get(createDashboardPage.getCreateBtn()).click();
        cy.get(createCourses.getThemeTemplates()).should("contain.text", createCourses.getThemeTemplatesValue());
        cy.get(createCourses.getCreateCourseTitle()).should("contain.text", createCourses.getCreateCourseTitleValue());
        cy.get(createCourses.getCreateThemeList()).children().eq(0).click();
        cy.get(createCourses.getThemeTitle()).should("contain.text", createCourses.getThemeTitleValue());
        cy.get(createCourses.getUseThemeBtn()).click();
        
        //Enter a Course Name
        cy.get(createCourses.getEnterCourseTitle()).should("contain.text", createCourses.getEnterCourseTitleValue());
        cy.get(createCourses.getCourseTitleTxtF()).eq(1).type(courses.create_SmokeTest_01);
        cy.get(createCourses.getCreateContinueBtn()).eq(1).click();
       

        //Select pages to add to the Course
        cy.get(createCourses.getCreatePageBtn()).children().eq(0).click();
        cy.get(createCourses.getPageName()).should("contain.value",createCourses.getPageNameWelcomeValue());
        cy.get(createCourses.getCreatePageContinueBtn()).click();
        cy.get(createCourses.getPlusBtn()).click();
        cy.get(createCourses.getCreatePageBtn()).children().eq(32).click();
        cy.get(createCourses.getPageName()).should("contain.value",createCourses.getPageNameThankYou());
        cy.get(createCourses.getCreatePageContinueBtn()).click();

        //Retrun to main page and exit
        cy.get(createCourses.getHomeBtn()).click();
        cy.get(createDashboardPage.getUserBtn()).click()
        cy.logoutCreate()
        cy.get(createLoginPage.getLoginBtn()).should('contain.text', "Sign in"); //verify logout was successful
    });
});
