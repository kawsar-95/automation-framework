// TestRail TC references:  
// Global Search regression:  https://absorblms.testrail.io//index.php?/cases/view/3004
// GUIA-Auto - ML-843 - Handle stop words correctly (e.g. it/IT, be, at) while supporting typical 2 character 
//    learner Search (e.g. 5G, BX): https://absorblms.testrail.io/index.php?/cases/view/4271

/// <reference types="cypress" />
import MLEnvironments from "../../../../../../helpers/ML/MLEnvironments";

//The following HF must be up to date and running properly.  If not, run the job prior to the test: 
//    - ReindexLmsJob
//    - ReindexEntityNameJob
//The following FFs (Feature Flags) must be enabled: 
//    - MachineLearningSearch
//    - AwsOpenSearch
//    - EnableTwoCharacterSearch
//    - ZeroDowntimeReindexing

describe('C3004 GUIA-Auto - ML Global Search regression', function(){
    beforeEach(() => {
        //Go to website 
        MLEnvironments.signInLearner("sml");
    })

    it("Test Information:", function () {
        MLEnvironments.testInformation()
    });
  
      
    it('Search by first part of a course title', () => {
        //Use the search icon and do a search 
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`).click().focus().type("zzz{enter}");
        cy.wait(5000);

        cy.get(`[title="zzzksl-999"]`).should('be.visible');
        cy.get(`[title="zzz-ML-Curriculum"]`).should('be.visible');
    })
    
    it('Search by last part of a Curriculum title', () => {
        //Use the search icon and do a search 
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`).click().focus().type("lum{enter}");
        cy.wait(5000);

        cy.get(`[title="zzz-ML-Curriculum"]`).should('be.visible');
    })

    it('Search by four characters of a course title', () => {
        //Use the search icon and do a search 
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`).click().focus().type("zz-ml{enter}");
        cy.wait(5000);

        cy.get(`[title="zzz-ML-Curriculum"]`).should('be.visible');
    })

    it('Search by two characters of a course title', () => {
        //Use the search icon and do a search 
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`).click().focus().type("ks{enter}");
        cy.wait(5000);

        cy.get(`[title="zzzksl-999"]`).should('be.visible');
    })

    it('Search by two characters of an ILC title', () => {
        //Use the search icon and do a search 
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`).click().focus().type("LC{enter}");
        cy.wait(5000);

        cy.get(`[title="zzz-ML-ILC"]`).should('be.visible');
    })

    it('Search by two characters of a Curriculum title', () => {
        //Use the search icon and do a search 
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`).click().focus().type("um{enter}");
        cy.wait(5000);

        cy.get(`[title="zzz-ML-Curriculum"]`).should('be.visible');
    })

    it('Search by two characters of a Course within a Bundle title', () => {
        //Use the search icon and do a search 
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`).click().focus().type("IL{enter}");
        cy.wait(5000);

        cy.get(`[title="003 - ILC"]`).should('be.visible');
    })

    it('Invalid search with 1 character', () => {
        //Use the search icon and do a search 
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`).click().focus().type("a{enter}");
        cy.wait(5000);

        cy.get(`[class*="search-results__no_results_header_text"]`)
            .should('have.text', "Sorry, we couldn't find any results.");
    })

    it('Invalid search with 2 characters that is a stop word', () => {
        //Use the search icon and do a search 
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`).click().focus().type("or{enter}");
        cy.wait(5000);

        cy.get(`[class*="search-results-module__no_results_header_text"]`)
            .should('have.text', "Sorry, we couldn't find any results.");
    })

    it('Valid search with 3 characters that includes a stop word', () => {
        //Use the search icon and do a search 
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`).click().focus().type("org{enter}");
        cy.wait(5000);

        cy.get(`[title="zzz-ML-stopword-organization"]`).should('be.visible');
    })

    it('Valid search with multiple characters that includes a stop word', () => {
        //Use the search icon and do a search 
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`).click().focus().type("arn at{enter}");
        cy.wait(5000);

        cy.get(`[title="zzz-ML-stopword: Learn At Work"]`).should('be.visible');
    })


})
