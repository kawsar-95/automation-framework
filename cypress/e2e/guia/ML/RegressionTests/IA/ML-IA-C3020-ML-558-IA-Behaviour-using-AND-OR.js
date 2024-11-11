
//ML-558 - Change Intelligent Assist behaviour for some AND statements to OR statements
//https://absorblms.testrail.io/index.php?/cases/view/3020
//

//
// Note: Because collaborations cannot be deleted, We prep the portal with this active collaboration: TTC-Collaboration

// <reference types="cypress" />
import MLHelper from "../../../../../../helpers/ML/Helpers";
import MLEnvironments from "../../../../../../helpers/ML/MLEnvironments";
import adminMainMenu from "../../../../../../helpers/ML/mlPageObjects/adminMainMenu";
import adminContextMenu from "../../../../../../helpers/ML/mlPageObjects/adminContextMenu";
import adminReportCourse from "../../../../../../helpers/ML/mlPageObjects/adminReportCourse";
import LECatalogPage from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage";
import { learnerDetails } from "../../../../../../helpers/TestData/ML/learnerData";
import { courseDetails } from "../../../../../../helpers/TestData/ML/courseData";
import LECourseLessonPlayerPage from "../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage";

const menuGroupEngage = `[id="engage-menu-group"]`;
const reportCollaboration = `[id="collaborations-report-menu-option"]`;
const reportCollaborationActivity = `[id="collaboration-activity-report-menu-option"]`;


describe('GUIA-Auto - ML-600 -IA search collaboration activity report AND OR', function() {
    it("Test Information:", function () {
        MLEnvironments.testInformation()
    });

    it("Create users, courses, and enroll into the courses", () => {
        MLEnvironments.signInAdmin("sml");
        MLHelper.createCourses();
        MLHelper.createUsers();
        cy.wait(5000);
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

    //Run the above in the TTC test set of scripts so Cypress does not crash.

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


    ///////////////////ML-588 Speciifc/////////////////////////////
    it('ML-588: Search for items in Collaboration using AND', function() {
        const searchText2 = "View Collaboration containing 'TTC' and 'Col'"
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type(searchText2);
        cy.wait(3000)
        cy.get(`[data-name="search-suggestion-filter"]`).contains("Name Contains TTC").click();
        cy.wait(2000)

        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("TTC-Collaboration");
    })

    it('ML-588: Search for items in Collaboration using OR', function() {
        const searchText2 = "View Collaboration containing 'TTC' or 'Col'"
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type(searchText2);
        cy.wait(3000)
        cy.get(`[data-name="search-suggestion-filter"]`).contains("Name Contains TTC").click();
        cy.wait(2000)

        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("TTC-Collaboration");
    })

    it('ML-588: Search for items in Collaboration Activity using AND', function() {
        const searchText2 = "Edit Collaboration activity with '03' and '04'"
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type(searchText2);
        cy.wait(3000)
        // cy.get(`[data-name="search-suggestion-filter"]`).contains("First Name Contains Learner").click();
        // cy.wait(2000)

        cy.get('[class*="_title"]').contains("Edit Collaboration Activity").click()
           
        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 4");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 3");
    })

    it('ML-588: Search for items in Collaboration Activity using OR', function() {
        const searchText2 = "Edit Collaboration activity with '01' or '02'"
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type(searchText2);
        cy.wait(3000)
        cy.get('[class*="_title"]').contains("Edit Collaboration Activity").click()
        cy.wait(2000)
           
        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 1");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 2");
    })

    it('ML-588: Search for items in Course Activity using AND', function() {
        const searchText2 = "View Course activity containing user '006' and 'Jackets'"
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type(searchText2);
        cy.wait(3000);
        cy.get('[class*="_title"]').contains("Course Activity").click();
        cy.wait(2000);
           
        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("ml");
    })

    it('ML-588: Search for items in Course Activity using OR', function() {
        const searchText2 = "View Course activity containing 'learner' or 'zzz'"
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type(searchText2);
        cy.wait(3000);
        cy.get('[class*="_title"]').contains("Course Activity").click();
        cy.wait(2000);

        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("zzzksl-999");
    })

    it('ML-588: Search for items in Billboards using AND', function() {
        const searchText2 = "View Billboards containing '400' and '4001'"
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type(searchText2);
        cy.wait(3000);
        cy.get('[class*="_title"]').contains("Billboards").click();
        cy.wait(2000);
           
        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("4001_Billboard");
    })

    it('ML-558: Search for items in Billboards using OR', function() {
        const searchText2 = "View Billboards containing '2001' or '3001'"
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type(searchText2);
        cy.wait(3000);
        cy.get('[class*="_title"]').contains("Billboards").click();
        cy.wait(2000);

        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("2001_Billboard");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("3001_Billboard");
    })

    it('ML-558: Search for items in Venues using AND', function() {
        const searchText2 = "View Venues containing '400' and '4001'"
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type(searchText2);
        cy.wait(3000);
        cy.get('[class*="_title"]').contains("Venues").click();
        cy.wait(2000);
           
        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("4001_Venue");
    })

    it('ML-558: Search for items in Venues using OR', function() {
        const searchText2 = "View Venues containing '2001' or '3001'"
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type(searchText2);
        cy.wait(3000);
        cy.get('[class*="_title"]').contains("Venues").click();
        cy.wait(2000);

        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("2001_Venue");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("3001_Venue");
    })

    it('ML-558: Search for items in users report using AND', function() {
        const searchText2 = "View users report containing 'ml' and 'learn'"
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type(searchText2);
        cy.wait(3000);
        cy.get('[class*="_title"]').contains("User").click();
        cy.wait(2000);
           
        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("zzzML-Learner");
    })

    it('ML-558: Search for items in users report using OR', function() {
        const searchText2 = "View users report containing 'ml' or 'admin'"
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type(searchText2);
        cy.wait(3000);
        cy.get('[class*="_title"]').contains("User").click();
        cy.wait(2000);

        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("mlsysadmin");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("zzzML-Learner");
    })

    it('ML-558: Search for items in course report using AND', function() {
        const searchText2 = "View course report containing '005' and 'Curr'"
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type(searchText2);
        cy.wait(3000);
        cy.get('[class*="_title"]').contains("Course").click();
        cy.wait(2000);
           
        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("005 - Curriculum");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("zzz-ML-Curriculum");
    })

    it('ML-558: Search for items in course report using OR', function() {
        const searchText2 = "View course report containing '001' or '003'"
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type(searchText2);
        cy.wait(3000);
        cy.get('[class*="_title"]').contains("Course").click();
        cy.wait(2000);

        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("001 - OC");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("003 - ILC");
    })

    it('ML-558: Search for items in learner activity using AND', function() {
        const searchText2 = "View learner activity containing 'zzzML' and 'Learner'"
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type(searchText2);
        cy.wait(3000);
        cy.get('[class*="_title"]').contains("Learner Activity").click();
        cy.wait(2000);
           
        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("zzzML-Learner");
    })

    it('ML-558: Search for items in learner activity using OR', function() {
        const searchText2 = "View learner activity containing 'zzzML' or 'ml'"
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type(searchText2);
        cy.wait(3000);
        cy.get('[class*="_title"]').contains("Learner Activity").click();
        cy.wait(2000);

        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("mlsysadmin");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("zzzML-Learner");
    }) 
    
    it('ML-558: Search for items in user enrollments using AND', function() {
        const searchText2 = "View user enrollments containing 'TTC' and 'Learner_03'"
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type(searchText2);
        cy.wait(3000);
        cy.get('[class*="_title"]').contains("User Enrollments").click();
        cy.wait(10000);
           
        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("TTC");
    })

    it('ML-558: Search for items in user enrollments using OR', function() {
        const searchText2 = "View user enrollments containing 'mlsysadmin' or 'zzzML-Learner'"
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type(searchText2);
        cy.wait(3000);
        cy.get('[class*="_title"]').contains("User Enrollments").click();
        cy.wait(2000);

        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("zzzksl-999");
    }) 

    //Note: View Assessment is still in the old A5 UI so  the AND/OR search does not work
    it('ML-558: Search for items in View Assessments', function() {
        const searchText2 = "View Assessments"
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type(searchText2);
        cy.wait(3000);
        cy.get('[class*="_title"]').contains("Assessments").click();
        cy.wait(2000);
           
        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("TTCTestAutomatic");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("TTCTestManual");
    })

    //Not implemented/Not relevant/Known limitation:  
    //    IA to search for items in View OJT (AKA: On The Job Training or Observation Checklist)
    //    IA to search for items in Enroll User

    it('ML-558: Search for items in Roles Report', function() {
        const searchText2 = "View Roles Report contains 'Re' and 'port'"
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type(searchText2);
        cy.wait(3000);
        cy.get('[class*="_title"]').contains("Roles").click();
        cy.wait(2000);
           
        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Reporter");
    })

    it('ML-558: Search for items in Roles Report', function() {
        const searchText2 = "View Roles Report contains 'Reporter' or 'admin'"
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(`[id="intelligent-assist-toggle"]`).click();
        cy.get(`[class*="search_bar_container"]`).type(searchText2);
        cy.wait(3000);
        cy.get('[class*="_title"]').contains("Roles").click();
        cy.wait(2000);
           
        //Ensure the three specific names are displayed after clicking from the result list.
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Admin");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Reporter");
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("System Admin");
    })

    /////////////////////CLEAN UP/////////////////////////////
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
        cy.wait(6000);
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 4").click();
        cy.wait(5000);
        cy.get(`[data-name="delete-collaboration-activity-context-button"]`).click();
        cy.wait(6000);
        cy.get(`[data-name="confirm"]`).should("have.text", "Delete").click();
        cy.wait(5000);
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Collab comment from TTC learner 5").click();
        cy.wait(6000);
        cy.get(`[data-name="delete-collaboration-activity-context-button"]`).click();
        cy.wait(6000);
        cy.get(`[data-name="confirm"]`).should("have.text", "Delete").click();
        cy.wait(5000);
    }); 

    it("Delete courses", () => {
        MLEnvironments.signInAdmin("sml");
        MLHelper.deleteCourses();
    });

    it("Delete users", () => {
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
        cy.clearLocalStorage()
        cy.clearCookies()
    });    

})
