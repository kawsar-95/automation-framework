// TestRail TC reference: GUIA-Auto - ML - PinPoint Regression (Does not use ML Service):
// https://absorblms.testrail.io//index.php?/cases/view/3006

// Some tests are not automated yet.  MAUNAL testing must be done for:
// - Learner confirming enabled and disabled seeking from video control panel
// - Learner opening and closing the transcription icon within the video control panel


/// <reference types="cypress" />
import MLEnvironments from "../../../../../../helpers/ML/MLEnvironments";
import adminMainMenu from "../../../../../../helpers/ML/mlPageObjects/adminMainMenu";
import adminContextMenu from "../../../../../../helpers/ML/mlPageObjects/adminContextMenu";
import adminReportCourse from "../../../../../../helpers/ML/mlPageObjects/adminReportCourse";
import learnerAppModule from "../../../../../../helpers/ML/mlPageObjects/learnerAppModule";

describe('PinPoint (Video Transcription) Regression', function() {
    it("Test Information:", function () {
        MLEnvironments.testInformation()
    });
  
  
    it('Create a course with a video learning object that has transcription enabled', function() {
        //NOTE: 
        //Once this course with the video is created, it will take 5 to 30 minutes or more to complete the transcripttion.
        //While it is doing this, we will run some checks on an existing course that hasa video transcribed already.
        //Once the 'Video: Little Dragon' is transcribed, the nwe will exercise it.

        //Go to Website
        MLEnvironments.signInAdmin("sml");

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
        cy.get('input[aria-label="Title"]').type('0 - PinPoint Test');
        cy.wait(1000);

        //Add a video learning object
        cy.get(`[data-name="section-button-syllabus"]`).click();
        cy.wait(1000);
        cy.get(`[data-name="add_learning_object"]`).click(); 
        cy.wait(1000);
        cy.get(`[class*="icon-video"]`).click();
        cy.wait(1000);
        cy.get(`[data-name="submit"]`).contains("Next").click(); 
        cy.wait(1000);
        cy.get('input[placeholder="Enter Title"]').type('Video: Little Dragon');
        cy.wait(1000);
        cy.get(`[class*="video_source_fields"]`).contains("Choose File").click(); 
        cy.wait(1000);
        cy.get(`[title*="sintel-short"]`).contains("sintel-short").click(); 
        cy.wait(1000);
        cy.get(`[data-name="media-library-apply"]`).contains("Apply").click(); 
        cy.wait(1000);
        cy.get(`[data-name="transcriptionEnabled"]` + ' ' + `[data-name="disable-label"]`).click({force:true});
        cy.wait(1000);
        cy.get(`[data-name="disableSeeking"]` + ' ' + `[data-name="disable-label"]`).click({force:true});
        cy.wait(1000);
        cy.get(`[data-name="useTranscriptionAsEnglishSubtitle"]`).click();
        cy.wait(1000);
        cy.get(`[data-name="save"]`).contains("Apply").click(); 
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

        // Publish course
        cy.get(adminContextMenu.btnPublishCourse()).should('have.text', "Publish").click();
        cy.wait(1000);
        cy.get(adminContextMenu.btnContinue()).should('have.text', "Continue").click();
        cy.wait(5000);
    })

    it('Check Transcription in progress status message in 0 - PinPoint Test course', function() {
        //Go to Website
        MLEnvironments.signInAdmin("sml");

        cy.get(adminMainMenu.menuGroupCourse()).click();
        cy.get(adminMainMenu.reportsCourse()).should('have.text', "Courses").click();
        cy.wait(7000)

        // Edit course
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("0 - PinPoint Test").click();
        cy.wait(1000);
        cy.get(adminContextMenu.btnEditCourse()).should("have.text", "Edit").click();
        cy.wait(7000);

        cy.get(`[title="Edit Lesson"]`).click();
        cy.wait(1000);
        cy.get(`[data-name="transcribe-video-container"]`).contains("Transcription in progress");

    })


    it('Check transcription on an existing video:  006 - OC - Jackets Video with Transcription by selecting Launch content', function() {
        //Go to Website
        MLEnvironments.signInLearner("sml");

        //Use the search icon and search for  
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`)
            .click().focus().type("Ja{enter}");
        cy.wait(3000);
        cy.get(learnerAppModule.btnAction()).contains("Launch Content").click();
        cy.wait(10000);
        //Check for specific time stamp and description at: 00:02:18
        cy.get(`[class*="video-lesson-transcription-module__search_mentions"]`).contains("14 mentions of");
        cy.wait(1000);
        cy.get(`[class*="video-lesson-transcription-module__time_stamp"]`).contains("00:02:18");
        cy.wait(1000);
        cy.get(`[class*="video-lesson-transcription-module__text"]`).contains("critical in my").click();
        //Check for specific time stamp and description at: 00:00:32
        cy.get(`[class*="video-lesson-transcription-module__time_stamp"]`).contains("00:00:3");
        cy.wait(1000);
        cy.get(`[class*="video-lesson-transcription-module__text"]`).contains("sophistication").click();
        //Check for specific time stamp and description at: 00:08:13
        cy.get(`[class*="video-lesson-transcription-module__time_stamp"]`).contains("00:08:13");
        cy.wait(1000);
        cy.get(`[class*="video-lesson-transcription-module__text"]`).contains("weight").click();
        //Check for specific time stamp and description at: 00:00:01
        // cy.get(`[class*="video-lesson-transcription-module__time_stamp"]`).contains("00:00:01");
        cy.wait(1000);
        cy.get(`[class*="video-lesson-transcription-module__text"]`).contains("uterwear").click();
    })

    it('Edit transcription text to something different:  006 - OC - Jackets Video with Transcription', function() {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(adminMainMenu.menuGroupCourse()).click();
        cy.get(adminMainMenu.reportsCourse()).should('have.text', "Courses").click();
        cy.wait(7000)

        // Edit course
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("006 - OC - Jackets Video with Transcription").click();
        cy.wait(1000);
        cy.get(adminContextMenu.btnEditCourse()).should("have.text", "Edit").click();
        cy.wait(7000);

        cy.get(`[title="Edit Lesson"]`).click();
        cy.wait(1000);
        cy.get(`[title="Edit Transcription"]`).click();
        cy.wait(1000);
        cy.get(`[value*="uterwear for"]`).clear().type('Yup this was totally edited');
        cy.get(`[data-name="submit"]`).contains("OK").click();
        cy.wait(1000);
        cy.get(`[data-name="save"]`).contains("Apply").click(); 
        cy.wait(1000);

        // Publish course
        cy.get(adminContextMenu.btnPublishCourse()).should('have.text', "Publish").click();
        cy.wait(1000);
        cy.get(adminContextMenu.btnContinue()).should('have.text', "Continue").click();
        cy.wait(5000);

    })

    it('Switch to Learner and check for the edited text in  006 - OC - Jackets Video with Transcription', function() {
        //Go to Website
        MLEnvironments.signInLearner("sml");

        //Use the search icon and search for  
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`)
            .click().focus().type("Ja{enter}");
        cy.wait(3000);
        cy.get(learnerAppModule.btnAction()).contains("Launch Content").click();
        cy.wait(5000);    
        //Check for specific time stamp and description at: 00:00:01
        // cy.get(`[class*="video-lesson-transcription-module__time_stamp"]`).contains("00:00:01");
        cy.get(`[class*="video-lesson-transcription-module__text"]`).contains("Yup this was totally edited");
        cy.wait(1000);
    })

    it('Edit transcription text back to to the original:  006 - OC - Jackets Video with Transcription', function() {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(adminMainMenu.menuGroupCourse()).click();
        cy.get(adminMainMenu.reportsCourse()).should('have.text', "Courses").click();
        cy.wait(7000)

        // Edit course
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("006 - OC - Jackets Video with Transcription").click();
        cy.wait(1000);
        cy.get(adminContextMenu.btnEditCourse()).should("have.text", "Edit").click();
        cy.wait(7000);

        cy.get(`[title="Edit Lesson"]`).click();
        cy.wait(1000);
        cy.get(`[title="Edit Transcription"]`).click();
        cy.wait(1000);
        cy.get(`[value="Yup this was totally edited"]`).clear().type('about outerwear for fall');
        cy.get(`[data-name="submit"]`).contains("OK").click();
        cy.wait(1000);
        cy.get(`[data-name="save"]`).contains("Apply").click(); 
        cy.wait(1000);

        // Publish course
        cy.get(adminContextMenu.btnPublishCourse()).should('have.text', "Publish").click();
        cy.wait(1000);
        cy.get(adminContextMenu.btnContinue()).should('have.text', "Continue").click();
        cy.wait(5000);

    })


    it('Wait 10 minutes, and then edit the Video: Little Dragon & confirm the transcription', function() {
        // cy.wait(300000);
        cy.wait(800000);

        //Go to Website
        MLEnvironments.signInAdmin("sml");

        cy.get(adminMainMenu.menuGroupCourse()).click();
        cy.get(adminMainMenu.reportsCourse()).should('have.text', "Courses").click();
        cy.wait(7000)

        // Edit course
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("0 - PinPoint Test").click();
        cy.wait(1000);
        cy.get(adminContextMenu.btnEditCourse()).should("have.text", "Edit").click();
        cy.wait(7000);

        cy.get(`[title="Edit Lesson"]`).click();
        cy.wait(1000);
        cy.get(`[title="Edit Transcription"]`).click();
        cy.wait(3000);
        cy.get(`[data-name="edit-video-transcription"]`).contains("00:00:18");
        cy.get(`[value*="blade"]`).should("be.visible");
    })

    it('Delete the course Video: Little Dragon', function() {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.wait(1000);
        cy.get(adminMainMenu.menuGroupCourse()).click();
        cy.get(adminMainMenu.reportsCourse()).should('have.text', "Courses").click();
        cy.wait(7000)
    
        // Delete the course
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("0 - PinPoint Test").click();
        cy.wait(1000);    
        cy.get(`[data-name="delete-course-context-button"]`).click();
        cy.wait(1000);    
        cy.get(`[data-name="confirm"]`).should('have.text', "Delete").click();
        cy.wait(1000);    
    })

    it('Unenroll learner:  006 - OC - Jackets Video with Transcription', function() {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(adminMainMenu.menuGroupCourse()).click();
        cy.get(adminMainMenu.reportsCourse()).should('have.text', "Courses").click();
        cy.wait(7000)

        // Edit course
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("006 - OC - Jackets Video with Transcription").click();
        cy.wait(1000);   
        cy.get(adminContextMenu.btnCourseEnrollments()).contains("Course Enrollments").click();
        cy.wait(1000);   
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("zzzML-Learner").click();
        cy.wait(1000);   
        cy.get(adminContextMenu.btnUnenrollUser()).click();
        cy.wait(7000);   
        cy.get(adminReportCourse.btnUnenrollOK()).contains("OK").click();
        cy.wait(1000);   
    })

    
    /////////////////////////////////////////////////////////////////////////////////////////////
    // it('Ensure the VideoTranscription FF (feature Flag) is enabled', function() {
    //     //Go to main blatant portal Feature Flags location
    //     MLEnvironments.signInDefaultAdmin();
    //     MLEnvironments.goToFeatureFlags();

    //     //Ensure Video transcription flag is enabled
    //     cy.get(`[data-bind="text: Name"]`).contains("VideoTranscription").should('include','toggle on');
    // })
    
    // it('Disable the VideoTranscription FF (feature Flag) and ensure it does not show in the course', function() {
    //     //Go to main blatant portal to run the HF (Hang Fire) job
    //     MLEnvironments.signInDefaultAdmin();

    // })




    // it('Check transcription on an existing video:  006 - OC - Jackets Video with Transcription by enrolling and starting', function() {
    //     //Go to Website
    //     MLEnvironments.signInLearner("sml");

    //     //Use the search icon and search for  
    //     cy.get(`[class*="icon-button-module__btn"][title="Search"]`)
    //         .click().focus().type("Ja{enter}");
    //     cy.wait(3000);
    //     cy.get(learnerAppModule.btnAction()).contains("Enroll").click();
    //     cy.wait(4000);
    //     cy.get(learnerAppModule.btnAction()).contains("Start").click();
    //     cy.wait(5000);
    //     //Check for specific time stamp and description at: 00:02:18
    //     cy.get(`[class*="video-lesson-transcription-module__search_mentions"]`).contains("14 mentions of");
    //     cy.get(`[class*="video-lesson-transcription-module__time_stamp"]`).contains("00:02:18");
    //     cy.get(`[class*="video-lesson-transcription-module__text"]`).contains("critical in my").click();
    //     //Check for specific time stamp and description at: 00:00:32
    //     cy.get(`[class*="video-lesson-transcription-module__time_stamp"]`).contains("00:00:3");
    //     cy.get(`[class*="video-lesson-transcription-module__text"]`).contains("sophistication to the whole collection").click();
    //     //Check for specific time stamp and description at: 00:08:13
    //     cy.get(`[class*="video-lesson-transcription-module__time_stamp"]`).contains("00:08:13");
    //     cy.get(`[class*="video-lesson-transcription-module__text"]`).contains("weight").click();
    //     //Check for specific time stamp and description at: 00:00:01
    //     cy.get(`[class*="video-lesson-transcription-module__time_stamp"]`).contains("00:00:01");
    //     cy.get(`[class*="video-lesson-transcription-module__text"]`).contains("uterwear for").click();
    // })

})