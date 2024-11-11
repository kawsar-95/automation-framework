// TestRail TC reference: GUIA-Auto - ML-600 -IA search collaboration activity report based on country, province, city, and location
// https://absorblms.testrail.io/index.php?/cases/view/3024
// TestRail TC reference:  ML-599 - IA search 'collaboration activities by (username)' should identify that the username is a username and not a collaboration activity itself
// https://absorblms.testrail.io/index.php?/cases/view/3021
// TestRail TC reference:  ML-709 -Merge partially detected ES entities into a single ES entity
// https://absorblms.testrail.io/index.php?/cases/view/3023
//
// Note: Because collaborations cannot be deleted, We prep the portal with this active collaboration: TTC-Collaboration

// <reference types="cypress" />
import MLHelper from "../../../../../../helpers/ML/Helpers";
import MLEnvironments from "../../../../../../helpers/ML/MLEnvironments";
import adminMainMenu from "../../../../../../helpers/ML/mlPageObjects/adminMainMenu";
import adminContextMenu from "../../../../../../helpers/ML/mlPageObjects/adminContextMenu";
import adminReportCourse from "../../../../../../helpers/ML/mlPageObjects/adminReportCourse";

const menuGroupEngage = `[id="engage-menu-group"]`;
const reportCollaboration = `[id="collaborations-report-menu-option"]`;
const reportCollaborationActivity = `[id="collaboration-activity-report-menu-option"]`;


describe('GUIA-Auto - ML-600 -IA search collaboration activity report based on country, province, city, and location', function() {
    it("Test Information:", function () {
        MLEnvironments.testInformation()
    });

    it("Create users", () => {
            MLEnvironments.signInAdmin("sml");
            MLHelper.createUsers();
            cy.wait(5000);
    });

    it('ML-600: Edit an existing collaboration and add users', function() {
        //Go to Website
        MLEnvironments.signInAdmin("sml");

        //Go to Engage and find the specific collaboration
        cy.get(menuGroupEngage).click();
        cy.get(reportCollaboration).should("have.text", "Collaborations").click();
        cy.wait(2000);   

        // Edit the collaboration
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("TTC-Collaboration").click();
        cy.wait(1000);
        cy.get(`[data-name="edit-collaboration-context-button"]`).should("have.text", "Edit Collaboration").click();
        cy.wait(10000);

        //Add TTC users
        cy.get('div[data-name="userIds"]').within(() => {
            cy.wait(1000);
            cy.get('div[data-name="field"]').click()
            cy.wait(1000);
            cy.get('div[data-name="options"]').find('li').contains("TTC_Learner_01").click()
            cy.wait(1000);
            cy.get('div[data-name="options"]').find('li').contains("TTC_Learner_02").click()
            cy.wait(1000);
            cy.get('div[data-name="options"]').find('li').contains("TTC_Learner_03").click()
            cy.wait(1000);
            cy.get('div[data-name="options"]').find('li').contains("TTC_Learner_04").click()
            cy.wait(1000);
            cy.get('div[data-name="options"]').find('li').contains("TTC_Learner_05").click()
            cy.wait(1000);
            cy.get('div[data-name="options"]').find('li').contains("TTC_Learner_06").click()
        })
        cy.get('div[data-name="userIds"]').find('div[data-name="field"]').click()
        cy.wait(2000);
        cy.get('[data-name="submit"]').contains("Save").click()
    });

    it('ML-600: Create a course and add a collaboration', function() {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(adminMainMenu.menuGroupCourse()).click();
        cy.get(adminMainMenu.reportsCourse()).should("have.text", "Courses").click();
        cy.wait(7000);

        // Create OC
        cy.get(adminContextMenu.btnAddOnlineCourse()).should("have.text", "Add Online Course").click();
        cy.wait(5000);

        //Activate the course
        cy.get(adminReportCourse.courseEnableActive()).contains("Inactive").click();
        cy.wait(1000);

        //Enter the name of the course
        cy.get('input[aria-label="Title"]').clear();
        cy.get('input[aria-label="Title"]').type("000-Check_Collab");
        cy.wait(1000);

        //Add a image learning object
        cy.get(`[data-name="section-button-syllabus"]`).click();
        cy.wait(1000);
        cy.get(`[data-name="add_learning_object"]`).click(); 
        cy.wait(1000);
        cy.get(`[class*="icon-video"]`).click();
        cy.wait(1000);
        cy.get(`[data-name="submit"]`).contains("Next").click(); 
        cy.wait(1000);
        cy.get('input[placeholder="Enter Title"]').type('Temp: Image');
        cy.wait(1000);
        cy.get(`[class*="video_source_fields"]`).contains("Choose File").click(); 
        cy.wait(3000);
        cy.get(`[title*="2022-07-19"]`).contains("2022-07-19").click(); 
        cy.wait(1000);
        cy.get(`[data-name="media-library-apply"]`).contains("Apply").click(); 
        cy.wait(1000);
        cy.get(`[data-name="save"]`).contains("Apply").click(); 
        cy.wait(3000);

        //Open Enrollment Rules
        cy.get(`[data-name="section-button-enrollmentRules"]`).click();
        cy.wait(1000);
        cy.get(`[id*="radio-button"][data-name="label"]`).contains("All Learners").click();

        //Add the TTC-Collaboration to the course.
        cy.get(`[data-name="section-button-social"] button[title="Social"]`).click();
        cy.wait(2000);
            
        cy.get('div[data-name="courseCollaborations"]').within(() => {
            cy.get('div[data-name="field"]').click()
            cy.get('div[data-name="options"]').find('li').contains("TTC-Collaboration").click()
        })
        cy.get('div[data-name="courseCollaborations"]').find('div[data-name="field"]').click()
        cy.wait(2000);

        // Publish course
        cy.get(adminContextMenu.btnPublishCourse()).should("have.text", "Publish").click();
        cy.wait(1000);
        cy.get(adminContextMenu.btnContinue()).should("have.text", "Continue").click();
        cy.wait(8000);
    
    });

    it('ML-600: As TTC learner 2, join the course and add a comment in the collaboration', function() {
        //Go to Website
        MLEnvironments.signInLearner2("sml");

        //Use the search icon and search for  
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`)
            .click().focus().type("000-Check{enter}");
        cy.wait(3000);

        //Enroll into: 001 - OC
        cy.get(`[class*="name-column-module__search_name_link"]`).contains("000-Check_Collab").click();
        cy.wait(4000);
        cy.get(`[class*="course-discovery-details-panel-module__tabs_container"]`).contains("Collaborations").click();
        cy.wait(1000);
        cy.get(`[class*="button-module__btn"]`).contains("Create Post").click();
        cy.wait(1000);
        cy.get(`[name="title"]`).type("Collab comment from TTC learner 2");
        cy.wait(1000);
        cy.get(`[class*="collaboration-post-modal-module__button_wrapper"]`).contains("Create Post").click();
        cy.wait(1000);
  
    });

    it('ML-600: As TTC learner 3, join the course and add a comment in the collaboration', function() {
        //Go to Website
        MLEnvironments.signInLearner3("sml");

        //Use the search icon and search for  
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`)
            .click().focus().type("000-Check{enter}");
        cy.wait(3000);

        //Enroll into: 001 - OC
        cy.get(`[class*="name-column-module__search_name_link"]`).contains("000-Check_Collab").click();
        cy.wait(4000);
        cy.get(`[class*="course-discovery-details-panel-module__tabs_container"]`).contains("Collaborations").click();
        cy.wait(1000);
        cy.get(`[class*="collaboration-activity-card-module__author_header_container"]`).contains("TTC-Collaboration").click();
        cy.wait(1000);
        cy.get(`[title="Share something with your peers"]`).click();
        cy.wait(1000);
        cy.get(`[name="title"]`).type("Collab comment from TTC learner 3");
        cy.wait(1000);
        cy.get(`[class*="collaboration-post-modal-module__button_wrapper"]`).contains("Create Post").click();
        cy.wait(1000);
  
    });

    it('ML-600: As TTC learner 4, join the course and add a comment in the collaboration', function() {
        //Go to Website
        MLEnvironments.signInLearner4("sml");

        //Use the search icon and search for  
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`)
            .click().focus().type("000-Check{enter}");
        cy.wait(3000);

        //Enroll into: 001 - OC
        cy.get(`[class*="name-column-module__search_name_link"]`).contains("000-Check_Collab").click();
        cy.wait(4000);
        cy.get(`[class*="course-discovery-details-panel-module__tabs_container"]`).contains("Collaborations").click();
        cy.wait(3000);
        cy.get(`[class*="collaboration-activity-card-module__author_header_container"]`).contains("TTC-Collaboration").click();
        cy.wait(1000);
        cy.get(`[title="Share something with your peers"]`).click();
        cy.wait(1000);
        cy.get(`[name="title"]`).type("Collab comment from TTC learner 4");
        cy.wait(1000);
        cy.get(`[class*="collaboration-post-modal-module__button_wrapper"]`).contains("Create Post").click();
        cy.wait(1000);
  
    });

    it('ML-600: As TTC learner 5, join the course and add a comment in the collaboration', function() {
        //Go to Website
        MLEnvironments.signInLearner5("sml");

        //Use the search icon and search for  
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`)
            .click().focus().type("000-Check{enter}");
        cy.wait(3000);

        //Enroll into: 001 - OC
        cy.get(`[class*="name-column-module__search_name_link"]`).contains("000-Check_Collab").click();
        cy.wait(4000);
        cy.get(`[class*="course-discovery-details-panel-module__tabs_container"]`).contains("Collaborations").click();
        cy.wait(1000);
        cy.get(`[class*="collaboration-activity-card-module__author_header_container"]`).contains("TTC-Collaboration").click();
        cy.wait(1000);
        cy.get(`[title="Share something with your peers"]`).click();
        cy.wait(1000);
        cy.get(`[name="title"]`).type("Collab comment from TTC learner 5");
        cy.wait(1000);
        cy.get(`[class*="collaboration-post-modal-module__button_wrapper"]`).contains("Create Post").click();
        cy.wait(1000);
  
    });

    it('ML-600: As TTC learner 1, join the course and add a comment in the collaboration', function() {
        //Go to Website
        MLEnvironments.signInLearner1("sml");

        //Use the search icon and search for  
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`)
            .click().focus().type("000-Check{enter}");
        cy.wait(3000);

        //Enroll into: 001 - OC
        cy.get(`[class*="name-column-module__search_name_link"]`).contains("000-Check_Collab").click();
        cy.wait(4000);
        cy.get(`[class*="course-discovery-details-panel-module__tabs_container"]`).contains("Collaborations").click();
        cy.wait(1000);
        cy.get(`[class*="collaboration-activity-card-module__author_header_container"]`).contains("TTC-Collaboration").click();
        cy.wait(1000);
        cy.get(`[title="Share something with your peers"]`).click();
        cy.wait(1000);
        cy.get(`[name="title"]`).type("Collab comment from TTC learner 1");
        cy.wait(1000);
        cy.get(`[class*="collaboration-post-modal-module__button_wrapper"]`).contains("Create Post").click();
        cy.wait(1000);
  
    });    

    it('ML-600: As an Admin use IA to search for a collaboration activity report in a country', function() {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type("collaboration activity report from Ireland");
        cy.wait(3000)
        cy.get(`[data-name="search-suggestion-filter"]`).contains("Country Contains Ireland").click();
        cy.wait(2000)

        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 2");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Ireland");
    });

    it('ML-600: As an Admin use IA to search for a collaboration activity report in a State/Province', function() {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type("collaboration activity report State/Province from New South Wales");
        cy.wait(3000)
        cy.get(`[data-name="search-suggestion-filter"]`).contains("State/Province Contains New South Wales").click();
        cy.wait(2000)

        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 4");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("New South Wales");

    });

    it('ML-600: As an Admin use IA to search for a collaboration activity report in a province', function() {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type("collaboration activity report State/Province from Alberta");
        cy.wait(3000)
        cy.get(`[data-name="search-suggestion-filter"]`).contains("State/Province Contains Alberta").click();
        cy.wait(2000)

        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 1");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Alberta");

    });

    it('ML-600: As an Admin use IA to search for a collaboration activity report in a city', function() {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type("collaboration activity report City from Calgary");
        cy.wait(3000)
        cy.get(`[data-name="search-suggestion-filter"]`).contains("City Contains Calgary").click();
        cy.wait(2000)

        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 1");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Calgary");
    });
    
    it('ML-600: As an Admin use IA to search for a collaboration activity report in a specific location', function() {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type("collaboration activity report Location is 'Floor 300'");
        cy.wait(3000)
        cy.get(`[data-name="search-suggestion-filter"]`).contains("Location Contains Floor 300").click();
        cy.wait(2000)

        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 3");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Floor 300");
    });   
    
    it('ML-599: As an Admin search IA collaboration activity report by the username with first name only', function() {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type("Collaboration activities by first name 'TTC'");
        cy.wait(3000)
        cy.get(`[data-name="search-suggestion-filter"]`).contains("First Name Contains TTC").click();
        cy.wait(2000)

        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 1");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 2");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 3");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 4");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 5");
    });   
    
    it('ML-599: As an Admin search IA collaboration activity report by the username with Last name only', function() {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type("Collaboration activities by last Name '05'");
        cy.wait(3000)
        cy.get(`[data-name="search-suggestion-filter"]`).contains("Last Name Contains 05").click();
        cy.wait(2000)

        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 5");
    }); 

    it('ML-599: As an Admin search IA collaboration activity report by username with first and last name only', function() {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type("Collaboration activities by username first name 'TTC' and last name '01'");
        cy.wait(3000)
        cy.get(`[data-name="search-suggestion-filter"]`).contains("Username Contains TTC").click();
        cy.wait(2000)

        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 1");
    }); 

    it('ML-599: As an Admin search IA edit collaboration activity report by the full first and last name only', function() {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type("Edit Collaboration activities by full Name 'TTC 04'");
        cy.wait(3000)
        cy.get(`[data-name="search-suggestion-filter"]`).contains("1 Users Like 'TTC 04'").click();
        cy.wait(2000)

        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 4");
    });

    it('ML-599: As an Admin search IA edit collaboration activity report by the first name only', function() {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type("Edit Collaboration activities by first name 'TTC'");
        cy.wait(3000)
        cy.get(`[data-name="search-suggestion-filter"]`).contains("6 Users Like 'TTC'").click();
        cy.wait(2000)

        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 1");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 2");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 3");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 4");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 5");
    });

    it('ML-599: As an Admin search IA edit collaboration activity report by the last name only', function() {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type("Edit Collaboration activities by last name '02'");
        cy.wait(3000)
        cy.get(`[class*="_search_suggestion"]`).contains("Edit Collaboration Activity").contains("Users Like '02'").click();
        cy.wait(2000)

        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 2");
    });

    it('ML-709: Merge partially detected ES entities into a single ES entity - User enrollments', function() {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type("user enrollments 'ml admin'");
        cy.wait(4000)
        cy.get(`[class*="_search_suggestion"]`).contains("1 Users Like 'ml admin'").click();
        cy.wait(2000)

        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("006 - OC - Jackets Video with Transcription");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("zzzksl-999");
    });   


    it('ML-709: Merge partially detected ES entities into a single ES entity - Course enrollments', function() {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type("course enrollment '006 - OC - Jackets Video with Transcription'");
        cy.wait(3000)
        cy.get(`[class*="_search_suggestion"]`).contains("1 Courses Like '006 - OC - Jac...'").click();
        cy.wait(2000)

        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("mlsysadmin");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("zzzML-Learner");
    });  

    ///////////////////CLEAN UP/////////////////////////////
    it("Clean up: Delete collaboration activities", () => {
        MLEnvironments.signInAdmin("sml");

        //Delete the collaboration activities
        cy.get(menuGroupEngage).click();
        cy.wait(1000);
        cy.get(reportCollaborationActivity).should("have.text", "Collaboration Activity").click();
        cy.wait(3000);   
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 1").click();
        cy.wait(2000);
        cy.get(`[data-name="delete-collaboration-activity-context-button"]`).click();
        cy.wait(3000);
        cy.get(`[data-name="confirm"]`).should("have.text", "Delete").click();
        cy.wait(4000);
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 2").click();
        cy.wait(2000);
        cy.get(`[data-name="delete-collaboration-activity-context-button"]`).click();
        cy.wait(3000);
        cy.get(`[data-name="confirm"]`).should("have.text", "Delete").click();
        cy.wait(4000);
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 3").click();
        cy.wait(2000);
        cy.get(`[data-name="delete-collaboration-activity-context-button"]`).click();
        cy.wait(3000);
        cy.get(`[data-name="confirm"]`).should("have.text", "Delete").click();
        cy.wait(4000);
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 4").click();
        cy.wait(4000);
        cy.get(`[data-name="delete-collaboration-activity-context-button"]`).click();
        cy.wait(5000);
        cy.get(`[data-name="confirm"]`).should("have.text", "Delete").click();
        cy.wait(4000);
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 5").click();
        cy.wait(5000);
        cy.get(`[data-name="delete-collaboration-activity-context-button"]`).click();
        cy.wait(5000);
        cy.get(`[data-name="confirm"]`).should("have.text", "Delete").click();
        cy.wait(4000);
    }); 

    it("Clean up: Delete users", () => {
        MLEnvironments.signInAdmin("sml");
        MLHelper.deleteUsers();
    });    

    it("Clean up: Delete the specific course", () => {
        MLEnvironments.signInAdmin("sml");
        // Delete the course
        cy.get(adminMainMenu.menuGroupCourse()).click();
        cy.wait(1000);
        cy.get(adminMainMenu.reportsCourse()).should("have.text", "Courses").click();
        cy.wait(7000);
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("000-Check_Collab").click();
        cy.wait(1000);
        cy.get(`[data-name="delete-course-context-button"]`).click();
        cy.wait(1000);
        cy.get(`[data-name="confirm"]`).should("have.text", "Delete").click();
        cy.wait(3000);
    });    



    //Commentted out for possible known issue from ML-599:
    //https://absorblms.atlassian.net/browse/ML-710
    //https://absorblms.atlassian.net/browse/ML-430
    // it('ML-599 & ML-170: As an Admin search IA delete collaboration activity report by the full username only', function() {
    //     //Go to Website
    //     MLEnvironments.signInAdmin("sml");
    //     cy.get(`[id="intelligent-assist-toggle"]`).click();
    //     cy.get(`[class*="search_bar_container"]`).type("Delete Collaboration activities by full Name 'TTC 04'");
    //     cy.wait(3000)
    //     cy.get(`[data-name="search-suggestion-filter"]`).contains("Full Name Contains TTC 04").click();
    //     cy.wait(2000)

    //     //Ensure the three specific names are displayed after clicking from the result list.
    //     cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 4");
    // }); 
    // it('ML-599 & ML-170: As an Admin search IA delete collaboration activity report by  first name only', function() {
    //     //Go to Website
    //     MLEnvironments.signInAdmin("sml");
    //     cy.get(`[id="intelligent-assist-toggle"]`).click();
    //     cy.get(`[class*="search_bar_container"]`).type("Delete Collaboration activities by Last Name '03'");
    //     cy.wait(3000)
    //     cy.get(`[data-name="search-suggestion-filter"]`).contains("Full Name Contains TTC 04").click();
    //     cy.wait(2000)

    //     //Ensure the three specific names are displayed after clicking from the result list.
    //     cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 3");
    // }); 
    // it('ML-599 & ML-170: As an Admin search IA delete collaboration activity report by the full username only', function() {
    //     //Go to Website
    //     MLEnvironments.signInAdmin("sml");
    //     cy.get(`[id="intelligent-assist-toggle"]`).click();
    //     cy.get(`[class*="search_bar_container"]`).type("Delete Collaboration activities by first Name 'TTC'");
    //     cy.wait(3000)
    //     cy.get(`[data-name="search-suggestion-filter"]`).contains("6 Users Like 'TTC'").click();
    //     cy.wait(2000)

    //     //Ensure the three specific names are displayed after clicking from the result list.
    //     cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 4");
    // }); 

})
