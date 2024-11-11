/// <reference types="cypress" />
import MLHelper from "../../../../../../helpers/ML/Helpers";
import MLEnvironments from "../../../../../../helpers/ML/MLEnvironments";
import LECatalogPage from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage";
import LECourseLessonPlayerPage from "../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage";

const menuGroupUsers = `[id="users-menu-group"]`;
const reportsUsers = `[id="users-report-menu-option"]`;


/**
 * Testrail URL:
 * https://absorblms.testrail.io//index.php?/cases/view/10560
 */
describe("C10560 Fix Update Curricula Progress Job from Merge User function", function () {
    // Requires the following resources to be precreated on the environment:
    // - 6 learners with usernames defined in: helpers/TestData/ML/learnerData (run Helper-CreateTTCUsers.js before test and DeleteTTCUsers after test).
    // to automate later
    //
    // Additional prep:
    // Manually create this curriculum: zzz-zKnow_your_ABCs
    // Added the following specific courses:
    //    - 001 - OC
    //    - 002 - OC
    //    - zzzksl-999
    // Note: Each course will have an image/PDF learning object implement as a bare minimum.

    it("Test Information:", function () {
        MLEnvironments.testInformation()
    });
    
    it("Create users", () => {
        MLEnvironments.signInAdmin("sml");
        MLHelper.createUsers();
        cy.wait(5000);
    });

    it("As TTC_Learner_02 learner, enroll into the the curriculum: zzz-zKnow_your_ABCs", () => {
        //Go to Website
        MLEnvironments.signInLearner2("sml");
        
        //Search for the curriculum
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`).click().focus().type("zzz-zKnow_your_ABCs{enter}");
        cy.wait(3000);
        //Confirm curriculum found
        cy.get(`[title="zzz-zKnow_your_ABCs"]`).should("be.visible");
        cy.wait(2000);
        //Enroll into the curriculum
        cy.get(`[class*="action-button-module"]`).contains("Enroll").click();
        cy.wait(4000);
        cy.get(`[class*="button-module__btn"]`).contains("Start").click();
        cy.wait(4000);
    });

    it("As TTC_Learner_02 learner, complete course: 001 - OC", () => {
        //Go to Website
        MLEnvironments.signInLearner2("sml");
        //Search for the curriculum
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`).click().focus().type("zzz-zKnow_your_ABCs{enter}");
        cy.wait(4000);
        //Confirm curriculum found
        cy.get(`[title="zzz-zKnow_your_ABCs"]`).click();
        cy.wait(4000);
        
        //Enroll into: 001 - OC
        cy.get(`[class*="course-list-module__course_name"]`).contains("001 - OC").click();
        cy.wait(4000);
        cy.get(`[class*="course-discovery-start-button-module__btn"]`).contains("Start").click();
        cy.wait(4000);
        cy.get(`[class*="course-player-close-button-module__close_btn"]`).click();
        cy.wait(5000);
    });

    it("As TTC_Learner_03 learner, enroll into the the curriculum: zzz - Know your ABCs", () => {
        //Go to Website
        MLEnvironments.signInLearner3("sml");
        
        //Search for the curriculum
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`).click().focus().type("zzz-zKnow_your_ABCs{enter}");
        cy.wait(4000);
        //Confirm curriculum found
        cy.get(`[title="zzz-zKnow_your_ABCs"]`).should("be.visible");
        cy.wait(4000);
        //Enroll into the curriculum
        cy.get(`[class*="action-button-module"]`).contains("Enroll").click();
        cy.wait(4000);
        cy.get(`[class*="button-module__btn"]`).contains("Start").click();
        cy.wait(4000);
    });

    it("As TTC_Learner_03 learner, complete course: zzzksl-999", () => {
        //Go to Website
        MLEnvironments.signInLearner3("sml");
        
        //Search for the curriculum
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`).click().focus().type("zzz-zKnow_your_ABCs{enter}");
        cy.wait(4000);
        //Select the curriculum
        cy.get(`[title="zzz-zKnow_your_ABCs"]`).click();
        cy.wait(4000);

        //Enroll into: zzzksl-999
        cy.get(`[class*="course-list-module__course_name"]`).contains("zzzksl-999").click();
        cy.wait(4000);
        cy.get(`[class*="course-discovery-start-button-module__btn"]`).contains("Start").click();
        cy.wait(4000);
        cy.get(`[class*="course-player-close-button-module__close_btn"]`).click();
        cy.wait(5000);
    });  

    it("As TTC_Learner_03 learner, complete course: 002 - OC", () => {
        MLEnvironments.signInLearner3("sml");
        
        //Search for the curriculum
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`).click().focus().type("zzz-zKnow_your_ABCs{enter}");
        cy.wait(4000);
        //Select the curriculum
        cy.get(`[title="zzz-zKnow_your_ABCs"]`).click();
        cy.wait(4000);

        //Enroll into: 002 - OC
        cy.get(`[class*="course-list-module__course_name"]`).contains("002 - OC").click();
        cy.wait(4000);
        cy.get(`[class*="course-discovery-start-button-module__btn"]`).contains("Start").click();
        cy.wait(4000);
        cy.get(`[class*="course-player-close-button-module__close_btn"]`).click();
        cy.wait(5000);
    });  

    it("As the admin, use TTC_Learner_02 as the primary and merge TTC_Learner_03 to it.", () => {
        MLEnvironments.signInAdmin("sml");
        cy.wait(5000);
        cy.get(menuGroupUsers).click();
        cy.get(reportsUsers).should("have.text", "Users").click();
        cy.wait(3000);

        //Select: Merge User
        cy.get(`[class*="table_container"]`).contains("TTC_Learner_02").click();
        cy.wait(2000);
        cy.get(`[data-name="merge-user-context-button"]`).contains("Merge User").click();
        cy.wait(3000);
        cy.get(`[id="select2-chosen-4"]`).contains("Choose").click();
        cy.wait(3000);
        cy.get(`[id="s2id_autogen4_search"]`).click().focus().type("TTC 03");
        cy.wait(2000);
        cy.get(`[class="select2-result-label"]`).contains("TTC 03").click();
        cy.wait(4000);
        cy.get(`[class*="submit-edit-content"]`).contains("Merge").click();
        cy.wait(4000);
    });

    it("As the admin, view TTC_Learner_02 curriculum progress.  Curriculum is now completed", () => {
        MLEnvironments.signInAdmin("sml");
        cy.wait(5000);
        cy.get(menuGroupUsers).click();
        cy.get(reportsUsers).should("have.text", "Users").click();
        cy.wait(1000);

        //Select TTC_Learner_02 
        cy.get(`[class*="table_container"]`).contains("TTC_Learner_02").click();
        cy.wait(1000);
        cy.get(`[data-name="view-user-enrollments-for-user-single-context-button"]`).contains("View Enrollments").click();
        cy.wait(1000);
        cy.get('table').contains('td', 'zzz-zKnow_your_ABCs', '100').should('be.visible').click();
        cy.wait(1000);
        cy.get(`[data-name="edit-user-enrollment-context-button"]`).click();
        cy.wait(1000);
        cy.get(`[data-name="current-status"]`).contains("Current Status: Complete");
        cy.get(`[data-name="courseName"]`).contains("zzz-zKnow_your_ABCs");
    });

    it("As learner TTC_Learner_02, view curriculum progress.  Curriculum is now completed.", () => {
        //Go to Website
        MLEnvironments.signInLearner2("sml");
        //Search for the curriculum
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`).click().focus().type("zzz-zKnow_your_ABCs{enter}");
        cy.wait(3000);
        //Confirm curriculum found
        cy.get(`[title="zzz-zKnow_your_ABCs"]`).click();
        cy.wait(3000);
        cy.get(`[class*="course-progress-module__title_container"]`).contains("3/3 Courses");
        cy.wait(2000);
        cy.get(`[class*="course-progress-module__percent"]`).contains("100%");
    });

    it("Activate merged user TTC_Learner_03 in prep of the user clean up function.", () => {
        MLEnvironments.signInAdmin("sml");
        cy.wait(5000);
        cy.get(menuGroupUsers).click();
        cy.get(reportsUsers).should("have.text", "Users").click();
        cy.wait(1000);

        //Search for inactive user TTC_Learner_03
        cy.get(`[class*="_assist_text"]`).contains("Intelligent Assist").click()
        cy.get(`[aria-label="Ask LMS"]`).click().type("Inactive user");
        cy.get(`[data-name="search-suggestion-filter"]`).contains("Status Equals Inactive").click();
        cy.wait(1000);

        //Activate TTC_Learner_03 to be cleaned up
        cy.get(`[class*="table_container"]`).contains("TTC_Learner_03").click();
        cy.wait(1000);
        cy.get(`[data-name="edit-user-single-context-button"]`).contains("Edit User").click();
        cy.wait(4000);
        cy.get(`[class*="_toggle_button_xqxir"]`).contains("Inactive").click();
        cy.wait(1000);
        cy.get(`[data-name="submit"]`).contains("Save").click();
        cy.wait(3000);

    });    

    //#################################################################################
    //https://absorblms.atlassian.net/browse/MT-12418
    //500 Errors When Merging Users

    it("MT-12418: As TTC_Learner_04 learner, complete course: 001 - OC", () => {
        //Go to Website
        MLEnvironments.signInLearner4("sml");
        //Search for the course
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`).click().focus().type("001 - OC{enter}");
        cy.wait(4000);
        
        //Enroll into: 001 - OC
        cy.get(`[title="001 - OC"]`).click();
        cy.wait(4000);
        cy.get(`[class*="course-discovery-start-button-module__btn"]`).contains("Start").click();
        cy.wait(4000);
        cy.get(`[class*="course-player-close-button-module__close_btn"]`).click();
        cy.wait(5000);
    });

    it("As the admin, use TTC_Learner_04 as the primary and merge TTC_Learner_05 (Zero enrollments) to it.", () => {
        MLEnvironments.signInAdmin("sml");
        cy.wait(5000);
        cy.get(menuGroupUsers).click();
        cy.get(reportsUsers).should("have.text", "Users").click();
        cy.wait(3000);

        //Select: Merge User
        cy.get(`[class*="table_container"]`).contains("TTC_Learner_04").click();
        cy.wait(2000);
        cy.get(`[data-name="merge-user-context-button"]`).contains("Merge User").click();
        cy.wait(3000);
        cy.get(`[id="select2-chosen-4"]`).contains("Choose").click();
        cy.wait(3000);
        cy.get(`[id="s2id_autogen4_search"]`).click().focus().type("TTC 05");
        cy.wait(2000);
        cy.get(`[class="select2-result-label"]`).contains("TTC 05").click();
        cy.wait(4000);
        cy.get(`[class*="submit-edit-content"]`).contains("Merge").click();
        cy.wait(4000);
    });

    it("Activate merged user TTC_Learner_05 in prep of the user clean up function.", () => {
        MLEnvironments.signInAdmin("sml");
        cy.wait(5000);
        cy.get(menuGroupUsers).click();
        cy.get(reportsUsers).should("have.text", "Users").click();
        cy.wait(1000);

        //Search for inactive user TTC_Learner_05
        cy.get(`[class*="_assist_text"]`).contains("Intelligent Assist").click()
        cy.get(`[aria-label="Ask LMS"]`).click().type("Inactive user");
        cy.get(`[data-name="search-suggestion-filter"]`).contains("Status Equals Inactive").click();
        cy.wait(1000);

        //Activate TTC_Learner_05 to be cleaned up
        cy.get(`[class*="table_container"]`).contains("TTC_Learner_05").click();
        cy.wait(1000);
        cy.get(`[data-name="edit-user-single-context-button"]`).contains("Edit User").click();
        cy.wait(4000);
        cy.get(`[class*="_toggle_button_xqxir"]`).contains("Inactive").click();
        cy.wait(1000);
        cy.get(`[data-name="submit"]`).contains("Save").click();
        cy.wait(3000);

    });    

    it("Clean up: Delete users", () => {
        MLEnvironments.signInAdmin("sml");
        MLHelper.deleteUsers();
    });    


});
