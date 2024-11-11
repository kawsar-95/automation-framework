/// <reference types="cypress" />
import MLHelper from "../../../../../../helpers/ML/Helpers";
import MLEnvironments from "../../../../../../helpers/ML/MLEnvironments";
/**
 * Testrail URL:
 * https://absorblms.testrail.io/index.php?/cases/view/3002
 */
describe("C3002 GUIA-Auto - Regression - Time to Complete (Does not use ML Service)", function () {
    // NOTE: This regression test doesn't test for the case: when TTC FF is off, manual TTC on a course should not show up.
    // Required feature flags: EstimatedTimeToComplete Global AND EstimatedTimeToComplete Client toggle
    // Required feature flags for MT-9592: thumbnails ffs on
    // Requires the following resources to be precreated on the environment:
    // - 6 learners with usernames defined in: helpers/TestData/ML/learnerData (run Helper-CreateTTCUsers.js before test and DeleteTTCUsers after test).
    // to automate later

    it("Test Information:", function () {
        MLEnvironments.testInformation()
    });
    
    it("should create users", () => {
        MLEnvironments.signInAdmin("sml");
        MLHelper.createUsers();
    });
});
