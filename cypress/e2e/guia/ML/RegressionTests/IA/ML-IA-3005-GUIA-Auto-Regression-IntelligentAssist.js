/// <reference types="cypress" />
import { users } from "../../../../../../helpers/TestData/users/users";
import { logIn } from "../../../../../../helpers/ML/Helpers";
import arDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import arLoginPage from "../../../../../../helpers/AR/pageObjects/Auth/ARLoginPage";
import { QueriesIA } from "../../../../../../helpers/TestData/ML/iaData";
import { validate_test_case } from "../../../../../../helpers/ML/IA/ValidateTestCase";
import MLEnvironments from "../../../../../../helpers/ML/MLEnvironments";
import MLHelper from "../../../../../../helpers/ML/Helpers";

/**
 * Testrail URL:
 * https://absorblms.testrail.io/index.php?/cases/view/3005
 */
describe("3005 GUIA-Auto - Regression - Intelligent Assist", function () {
    // Required feature flags: AdminSearchSuggestions
    // Related hangfire job: ReindexEntityNameJob.Execute
    // Run on the guiar env.
    beforeEach(() => {
        MLEnvironments.signInAdmin();
    });

    it("Test Information:", function () {
        MLEnvironments.testInformation()
    });
  
      
    it("Returns course activity report queries correctly", () => {
        MLHelper.goToCoursesReport();
        cy.wait(2000);
        MLHelper.createCourse("Online Course", "IA Course");
        cy.wait(2000);
        cy.get(`button[data-name=submit]`).click({ force: true });
        cy.wait(2000);
        cy.get(`button[data-name="confirm"]`).click();

        cy.get(arDashboardPage.getIntelligentAssistBtn()).click();
        QueriesIA["course_activity"].forEach((test_case) => {
            validate_test_case(test_case);
        });

        MLHelper.deleteCourse("IA Course");
    });

    it("Returns role report queries correctly", () => {
        cy.get(arDashboardPage.getIntelligentAssistBtn()).click();
        QueriesIA["role"].forEach((test_case) => {
            validate_test_case(test_case);
        });
    });

    it("Returns course report queries correctly", () => {
        cy.get(arDashboardPage.getIntelligentAssistBtn()).click();
        QueriesIA["course"].forEach((test_case) => {
            validate_test_case(test_case);
        });
    });

    it("Returns collaboration activity report queries correctly", () => {
        cy.get(arDashboardPage.getIntelligentAssistBtn()).click();
        QueriesIA["collaboration_activity"].forEach((test_case) => {
            validate_test_case(test_case);
        });
    });

    it("Returns user report queries correctly", () => {
        cy.get(arDashboardPage.getIntelligentAssistBtn()).click();
        QueriesIA["user"].forEach((test_case) => {
            validate_test_case(test_case);
        });
    });

    it("Returns collaboration report queries correctly", () => {
        cy.get(arDashboardPage.getIntelligentAssistBtn()).click();
        QueriesIA["collaboration"].forEach((test_case) => {
            validate_test_case(test_case);
        });
    });
});
