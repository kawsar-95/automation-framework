/// <reference types="cypress" />
import LECatalogPage from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage";
import MLHelper from "../../../../../../helpers/ML/Helpers";
import MLEnvironments from "../../../../../../helpers/ML/MLEnvironments";
import { learnerDetails } from "../../../../../../helpers/TestData/ML/learnerData";
import { courseDetails } from "../../../../../../helpers/TestData/ML/courseData";
import LECourseLessonPlayerPage from "../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage";
/**
 * Testrail URL:
 * https://absorblms.testrail.io/index.php?/cases/view/3002
 */
describe("C3002 GUIA-Auto - Regression - Time to Complete (Does not use ML Service)", function () {
    // NOTE: This regression test doesn't test for the case: when TTC FF is off, manual TTC on a course should not show up.
    // Required feature flags: EstimatedTimeToComplete Global AND EstimatedTimeToComplete Client toggle
    // Required feature flags for MT-9592: thumbnails ffs on

    it("Test Information:", function () {
        MLEnvironments.testInformation();
    });

    beforeEach(() => {
        // cy.viewport(800, 600);
        cy.viewport("macbook-16");
    });
    it("Check automatic time to complete works AFTER 5 or more users complete the course.", () => {
        learnerDetails.map((learner, idx) => {
            MLHelper.learnerLoginThruDashboardPageFirstTime(learner.username, learner.validPassword);
            let course_name = courseDetails["automatic"]["name"];
            MLHelper.searchCourseByName(course_name);

            if (idx < 5) {
                cy.get(LECatalogPage.getCardCourse()).first().find(`[class*=online-course-card-module__etc]`).should("not.exist");
                cy.wait(1000);
                cy.get('[class*="card-module__name"]').should("exist").contains(course_name).siblings().get(`[class*="icon-plus-circle"]`).first().should("exist").click();
                cy.wait(1000);
                cy.get('[class*="card-module__name"]').should("exist").contains(course_name).siblings().get(`[class*="icon-play-circle"]`).first().should("exist").click();
                cy.wait(7000);
                cy.get(`[class*="button-module__btn"]`).contains("Start").click(); // 5.113.X

                // if (MLEnvironments.env === "main") {
                //     MLHelper.WaitThenClick(`button[aria-label="Start Assessment Name"]`); // 5.114.X
                // } else if (MLEnvironments.env === "secondary") {
                //     // MLHelper.WaitThenClick(`[class*="button-module__btn"] button:contains("Start")`); // 5.113.X
                //     cy.get(`[class*="button-module__btn"]`).contains("Start").click();  // 5.113.X

                // }
                cy.wait(2000);
                LECourseLessonPlayerPage.getIframeAnswer();
                cy.wait(3000);
                LECourseLessonPlayerPage.getIframeLessonPlayerElementandClick(LECourseLessonPlayerPage.getQuestionContainer(), LECourseLessonPlayerPage.getSubmitResponseBtn());
                cy.wait(3000);
                MLHelper.learnerLogout();
                cy.clearLocalStorage();
            } else {
                cy.get(LECatalogPage.getCardCourse()).first().find(`[class*=online-course-card-module__etc]`).should("contain", "1m");
            }
        });
    });
});
