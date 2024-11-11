// TestRail TC reference: ML-675- Implement report based overlapping entities resolution logic
// https://absorblms.testrail.io//index.php?/cases/view/3019

/// <reference types="cypress" />
import MLEnvironments from "../../../../../../helpers/ML/MLEnvironments";
import adminMainMenu from "../../../../../../helpers/ML/mlPageObjects/adminMainMenu";
import adminContextMenu from "../../../../../../helpers/ML/mlPageObjects/adminContextMenu";
import adminReportCourse from "../../../../../../helpers/ML/mlPageObjects/adminReportCourse";
import learnerAppModule from "../../../../../../helpers/ML/mlPageObjects/learnerAppModule";

describe('ML-675- Implement report based overlapping entities resolution logic', function() {
    it("Test Information:", function () {
        MLEnvironments.testInformation()
    });
    
    it('Search for two courses, but I repeat one course name twice', function() {
        //E.g. courses with name of "Jacket" or "Work" or "Jacket"
        const searchText = 'courses with name of "Jacket" or "Work" or "Jacket"'
        // const searchResultJacket
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type(searchText);
        cy.wait(3000)
        cy.get(`[data-name="search-suggestion-filter"]`).contains("Name Contains Jacket").click();
        cy.wait(2000)

        //Ensure the two specific courses are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("006 - OC - Jackets Video with Transcription");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("zzz-ML-stopword: Learn At Work");
    })

    it('Search for two users by their first name', function() {
        //E.g. courses with name of "Jacket" or "Work" or "Jacket"
        const searchText2 = 'Users by the first name "ml" or first name "Learner"'
        // const searchResultJacket
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type(searchText2);
        cy.wait(3000)
        cy.get(`[data-name="search-suggestion-filter"]`).contains("First Name Contains Learner").click();
        cy.wait(2000)

        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("mlsysadmin");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("zzzML-Learner");
    })
})
