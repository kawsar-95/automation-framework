/// <reference types="cypress" />
import MLHelper from "../../../../../../helpers/ML/Helpers";
import { learnerDetails } from "../../../../../../helpers/TestData/ML/learnerData";
import { courseDetails } from "../../../../../../helpers/TestData/ML/courseData";
import MLEnvironments from "../../../../../../helpers/ML/MLEnvironments";
/**
 * Testrail URL:
 * https://absorblms.testrail.io/index.php?/cases/view/3002
 */
describe("C3002 GUIA-Auto - Regression - Time to Complete (Does not use ML Service)", function () {
    // NOTE: This regression test doesn't test for the case: when TTC FF is off, manual TTC on a course should not show up.
    // Required feature flags: EstimatedTimeToComplete Global AND EstimatedTimeToComplete Client toggle
    // Required feature flags for MT-9592: thumbnails ffs on
    // This is to test MT-10780 that was fixed in 5.114.0

    // beforeEach(() => {
    //     // cy.viewport(800, 600);
    //     cy.viewport("macbook-16");
    //     MLEnvironments.signInLearner();  
    // });

    it("Test Information:", function () {
        MLEnvironments.testInformation()
    });

    it("should display TTC for all types of course views when using search bar.", () => {
        MLEnvironments.signInLearner();  
        let course_name = courseDetails["manual"]["name"];
        cy.get(`[title=Search]`).should("exist").click();
        cy.get(`[class*=header-module__menu_container]`).find(`[class*=search-header-module__search_input]`).first().should("exist").type(`${course_name}{enter}`); // type and press enter
        // Check in list view (default)
        cy.get(`[class*=name-column-module__search_name_container]`).contains(course_name).parent().parent().parent().find(`[class*=search-result-list-items-module]`).should("exist");
        // Check in card view
        cy.get(`[class*=icon-view-list]`).should("exist").click();
        cy.get(`[class*=view-options__options] [class*=icon-view-cards]`).should("exist").click();
        cy.get(`[class*="card-module__name"]`).contains(course_name).parent().find(`[class*=online-course-card-module__etc]`).should("exist");
        // Check in detailed view
        cy.get(`[class*=icon-view-cards]`).should("exist").click();
        cy.get(`[class*=view-options__options] [class*=icon-view-detailed]`).should("exist").click();
        cy.get(`[class*="panel__header_name"]`).contains(course_name).parent().parent().parent().parent().parent().parent().parent().find(`[class*=online-course-panel-module__etc]`).should("exist");
    });

});
