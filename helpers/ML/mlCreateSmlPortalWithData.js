/// <reference types="cypress" />
import MLEnvironments from "../../../../../../helpers/ML/MLEnvironments";
import adminMainMenu from "../../../../../../helpers/ML/mlPageObjects/adminMainMenu";
import adminContextMenu from "../../../../../../helpers/ML/mlPageObjects/adminContextMenu";
import adminReportCourse from "../../../../../../helpers/ML/mlPageObjects/adminReportCourse";

describe('CED Course Thumbnail Suggestions', function() {

    
    it('Create the client portal', function() {
        MLEnvironments.signInDefaultAdmin();
        
    })   


    it('Create an online course', function() {
        //Go to Website
        MLEnvironments.signInAdminSmlPortal();
        cy.get(adminMainMenu.menuGroupCourse()).click();
        cy.get(adminMainMenu.reportsCourse()).should('have.text', "Courses").click();
        cy.wait(7000)
        
        // Create OC
        cy.get(adminContextMenu.btnAddOnlineCourse()).should('have.text', "Add Online Course").click();
        cy.wait(5000);

        //Activate the course
        cy.get(adminReportCourse.courseEnableActive()).contains("Inactive").click();
        cy.wait(1000);

        // cy.createCourse('Online Course')
        cy.get('input[aria-label="Title"]').clear();
        cy.get('input[aria-label="Title"]').type('001 - OC');
        cy.wait(1000);

        //Open Enrollment Rules
        cy.get(`[data-name="section-button-enrollmentRules"]`).click();
        cy.wait(1000);
        cy.get(`[id*="radio-button"][data-name="label"]`).contains("All Learners").click();

        //Open Catalog Visibility Section
        cy.get(`[data-name="section-button-catalogVisibility"]`).click();
        cy.wait(1000);

        // Click the thumbnail shuffle button
        cy.get(`[data-name="shuffle"][title="Shuffle"]`).click();
        cy.wait(1000);

    })    
})
