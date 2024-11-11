/// <reference types="cypress" />
import LECatalogPage from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage";
import MLHelper from "../../../../../../helpers/ML/Helpers";
import MLEnvironments from "../../../../../../helpers/ML/MLEnvironments";
import { learnerDetails } from "../../../../../../helpers/TestData/ML/learnerData";
import { courseDetails } from "../../../../../../helpers/TestData/ML/courseData";

/**
 * Testrail test Case URLs:
 * https://absorblms.testrail.io/index.php?/cases/view/3002
 * https://absorblms.testrail.io/index.php?/cases/view/5924
 * https://absorblms.testrail.io/index.php?/cases/view/5871
 * https://absorblms.testrail.io/index.php?/cases/view/5857
 * 
 */
describe("Exercise C3002 GUIA-Auto - Regression TTC and additional tests", function () {
   
    it("Test Information:", function () {
        MLEnvironments.testInformation()
    });

    //Anything within these lines cannot be ran in production
    //==============================================================================================================
    // Disable feature flag: EstimatedTimeToComplete

    // it('Disable AutomaticTagging FF (feature Flag)', function() {
    //     //Go to Website
    //     MLEnvironments.signInAdmin("global");
    //     cy.visit(MLEnvironments.envs[MLEnvironments.env]["global"]["urlAdmin"] + "/FeatureFlags");

    //     cy.get(`label:contains("EstimatedTimeToComplete")`).parent().within(() => {
    //         cy.get('[data-bind*="click: ToggleChecked"]').click({force:true})
    //     })

    //     cy.get(`[class="has-icon btn submit-edit-content success large"][data-menu="Sidebar"]`).should("have.text", "Save").click({force:true});
    // });

    // // TestRail Reference: https://absorblms.testrail.io/index.php?/cases/view/5871
    // it("MT-9972 | With EstimatedTimeToComplete disabled: Check existing Curriculum for TTC not displaying in courses", function () {
    //     MLEnvironments.signInLearner("sml");
    //     let course_name = courseDetails["curriculum"]["name"];
    //     MLHelper.searchCourseByName(course_name);
    //     cy.get(LECatalogPage.getCardCourse()).first().find(`[class*=online-course-card-module__etc]`).should("not.exist");
    //     cy.get(`[class*="card-module__name"][title="TTCTestCurriculum"]`).click();
    //     cy.wait(3000);
    //     cy.get(`[class*="course-list-module"]`).contains("1h").should("not.exist");
    //     cy.get(`[class*="course-list-module"]`).contains("1m").should("not.exist");
    // });

    // it("When the ttc feature flag is off course with manual ttc should not dislay.", () => {
    //     MLEnvironments.signInAdmin("sml");
    //     MLHelper.goToUsersReport();
    //     MLHelper.impersonateLearner(learnerDetails[0]);
    //     let course_name = courseDetails["manual"]["name"];
    //     MLHelper.searchCourseByName(course_name);
    //     cy.get(LECatalogPage.getCardCourse()).first().find(`[class*=online-course-card-module__etc]`).should("not.exist");
    // });

    // // Enable feature flag: EstimatedTimeToComplete
    // it('Enable AutomaticTagging FF (feature Flag)', function() {
    //     //Go to Website
    //     MLEnvironments.signInAdmin("global");
    //     cy.visit(MLEnvironments.envs[MLEnvironments.env]["global"]["urlAdmin"] + "/FeatureFlags");

    //     cy.get(`label:contains("EstimatedTimeToComplete")`).parent().within(() => {
    //         cy.get('[data-bind*="click: ToggleChecked"]').click({force:true})
    //     })

    //     cy.get(`[class="has-icon btn submit-edit-content success large"][data-menu="Sidebar"]`).should("have.text", "Save").click({force:true});
    // });
    // ==============================================================================================================

    // TestRail Reference: https://absorblms.testrail.io/index.php?/cases/view/5871
    it("MT-9972 | With EstimatedTimeToComplete enabled: Check existing Curriculum for TTC displays in courses", function () {
        MLEnvironments.signInLearner("sml");
        let course_name = courseDetails["curriculum"]["name"];
        MLHelper.searchCourseByName(course_name);
        cy.get(LECatalogPage.getCardCourse()).first().find(`[class*=online-course-card-module__etc]`).should("not.exist");
        cy.get(`[class*="card-module__name"][title="TTCTestCurriculum"]`).click();
        cy.wait(3000);
        cy.get(`[class*="course-list-module"]`).contains("1h").should("exist");
        cy.get(`[class*="course-list-module"]`).contains("1m").should("exist");
    });

    // TestRail Reference: https://absorblms.testrail.io/index.php?/cases/view/5924
    it("ML-855 - Sort courses by Time to Complete via Catalog", function () {
        MLEnvironments.signInLearner("sml");
        cy.wait(5000);
        cy.get(`[class*="dashboard-tile-wrapper-module__tile"]`).contains("Catalog").click();
        cy.wait(2000);
        cy.get('[id="CatalogSortDropDown"]').select('Time to Complete');
        cy.get(`[class*="catalog-module__cards_container"]`).contains("1m").should("exist");
        cy.get(`[class*="catalog-module__cards_container"]`).contains("1h").should("exist");
        cy.wait(1000);
        cy.get(`[class*="icon-view-cards"]`).click();
        cy.wait(1000);
        cy.get(`[class*="icon-view-detailed"]`).click();
        cy.wait(1000);
        cy.get('[id="CatalogSortDropDown"]').select('Alphabetical');
        cy.wait(1000);
        cy.get('[id="CatalogSortDropDown"]').select('Time to Complete');
        cy.get(`[class*="panel-module__panel_header_focus"]`).contains("1m").should("exist");
        cy.get(`[class*="panel-module__panel_header_focus"]`).contains("1h").should("exist");
        cy.wait(1000);
        cy.get(`[class*="icon-view-detailed"]`).click();
        cy.wait(1000);
        cy.get(`[class*="icon-view-list"]`).click();
        cy.wait(1000);
        cy.get('[id="CatalogSortDropDown"]').select('Alphabetical');
        cy.wait(1000);
        cy.get('[id="CatalogSortDropDown"]').select('Time to Complete');
        cy.wait(1000);
        cy.get(`[class*="catalog-module__list_container"]`).contains("1m").should("exist");
        cy.get(`[class*="catalog-module__list_container"]`).contains("1h").should("exist");
    });

    // TestRail Reference: https://absorblms.testrail.io/index.php?/cases/view/5857
    it("ML-854 - Sort courses by Time to Complete via my Courses", function () {
        MLEnvironments.signInLearner("sml");
        cy.wait(5000);
        cy.get(`[class*="dashboard-tile-wrapper-module__tile"]`).contains("Catalog").click();
        cy.wait(2000);
        //Enroll user into the TTC courses
        cy.get('[id="CatalogSortDropDown"]').select('Time to Complete');
        cy.wait(6000);
        cy.get('[class*="card-module__name"]').should("exist").contains("TTCTestAutomatic").siblings().get(`[class*="icon-plus-circle"]`).first().should("exist").click();
        cy.wait(5000);
        cy.get('[class*="card-module__name"]').should("exist").contains("TTCTestManual").siblings().get(`[class*="icon-plus-circle"]`).first().should("exist").click();
        cy.wait(2000);
        cy.get(`[class*="header__brand_logo header"]`).click();
        cy.wait(5000);
        cy.get(`[class*="dashboard-tile-wrapper-module__tile"]`).contains("My Courses").click();
        cy.wait(5000);
        cy.get('[id="CoursesSortDropDown"]').select('Time to Complete');
        cy.wait(4000);
        cy.get(`[class*="courses-module__courses_container"]`).contains("1m").should("exist");
        cy.get(`[class*="courses-module__courses_container"]`).contains("1h").should("exist");
});
    
});
