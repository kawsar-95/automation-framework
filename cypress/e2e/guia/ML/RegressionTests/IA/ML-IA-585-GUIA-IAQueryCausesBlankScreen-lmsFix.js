/// <reference types="cypress" />
import { users } from "../../../../../../helpers/TestData/users/users";
import arDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import arLoginPage from "../../../../../../helpers/AR/pageObjects/Auth/ARLoginPage";
import { BlankScreenQueriesIA } from "../../../../../../helpers/TestData/ML/blankIaData";
import { validate_test_case } from "../../../../../../helpers/ML/IA/ValidateTestCase";
import MLEnvironments from "../../../../../../helpers/ML/MLEnvironments";

/**
 * Testrail URL:
 * https://absorblms.testrail.io/index.php?/tests/view/435200
 */
describe("T435200 ML-585 - IA Query Causes Blank Screen - LMS fix", function () {
    // Required feature flags: AdminSearchSuggestions
    // Related hangfire job: ReindexEntityNameJob.Execute
    // Using the guiar env
    beforeEach(() => {
        MLEnvironments.signInAdmin();
        cy.get(arDashboardPage.getIntelligentAssistBtn()).click();
    });

    it("Test Information:", function () {
        MLEnvironments.testInformation()
    });
  
  
    it("Returns queries that used to cause blank screen error correctly", () => {
        // Check if filter is returned properly
        BlankScreenQueriesIA["course"].forEach((test_case) => {
            validate_test_case(test_case);
        });
        arDashboardPage.getMediumWait();
        // See if blank screen error occured
        cy.get(arDashboardPage.getIntelligentAssistBtn()).should("be.visible");
        cy.get(arDashboardPage.getIntelligentAssistRes()).should("be.visible");
    });
});
