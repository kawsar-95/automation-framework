// TestRail TC reference: Course Thumbnail Suggestions:  https://absorblms.testrail.io//index.php?/cases/view/3003


/// <reference types="cypress" />
import MLEnvironments from "../../../../../../helpers/ML/MLEnvironments";
import adminMainMenu from "../../../../../../helpers/ML/mlPageObjects/adminMainMenu";
import adminContextMenu from "../../../../../../helpers/ML/mlPageObjects/adminContextMenu";
import adminReportCourse from "../../../../../../helpers/ML/mlPageObjects/adminReportCourse";
import adminUserMenu from "../../../../../../helpers/ML/mlPageObjects/adminUserMenu";
import adminAbsorbUtilities from "../../../../../../helpers/ML/mlPageObjects/adminAbsorbUtilities";
import MLHelpers from "../../../../../../helpers/ML/Helpers";

// Auto tagging FF is enabled
// Auto tagging toggle is enabled in the Client portal
// Auto tagging is enabled for the the course

describe("Automatic Tagging", function () {
    it("Test Information:", function () {
        MLEnvironments.testInformation()
    });
 
       
    it("With Automatic tagging Enabled: Check online course, ILC, Course Bundle, and Curriculum for Automatic Tagging toggle", function () {
        // Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(adminMainMenu.menuGroupCourse()).click();
        cy.get(adminMainMenu.reportsCourse()).should("have.text", "Courses").click();
        cy.wait(4000);

        //Confirm Automatic Tagging is enabled for a new online course
        cy.get(adminContextMenu.btnAddOnlineCourse()).should("have.text", "Add Online Course").click();
        cy.wait(7000);
        MLHelpers.checkAutomaticTaggingEnabled();

        //Confirm Automatic Tagging is enabled for a new ILC
        cy.get(adminContextMenu.btnAddInstructorLed()).should("have.text", "Add Instructor Led").click();
        MLHelpers.checkAutomaticTaggingEnabled();

        //Confirm Automatic Tagging is enabled for a new course bundle
        cy.get(adminContextMenu.btnAddCourseBundle()).should("have.text", "Add Course Bundle").click();
        MLHelpers.checkAutomaticTaggingEnabled();

        //Confirm Automatic Tagging is enabled for a new curriculum
        cy.get(adminContextMenu.btnAddCurriculum()).should("have.text", "Add Curriculum").click();
        MLHelpers.checkAutomaticTaggingEnabled();
    });

    //DO NOT run this on AU Sandbox
    it("With Automatic tagging Disabled: Check online course, ILC, Course Bundle, and Curriculum for no Automatic Tagging toggle", function () {
        MLEnvironments.signInAdmin("sml");
        //Disable the Automatic Tagging from the client portal
        MLHelpers.toggleEnableAutotagging();
        cy.get(adminMainMenu.menuGroupCourse()).click();
        cy.get(adminMainMenu.reportsCourse()).should("have.text", "Courses").click();
        cy.wait(3000);

        //Confirm Automatic Tagging is enabled for a new online course
        cy.get(adminContextMenu.btnAddOnlineCourse()).should("have.text", "Add Online Course").click();
        MLHelpers.checkAutomaticTaggingDisabled();

        //Confirm Automatic Tagging is enabled for a new ILC
        cy.get(adminContextMenu.btnAddInstructorLed()).should("have.text", "Add Instructor Led").click();
        MLHelpers.checkAutomaticTaggingDisabled();

        //Confirm Automatic Tagging is enabled for a new course bundle
        cy.get(adminContextMenu.btnAddCourseBundle()).should("have.text", "Add Course Bundle").click();
        MLHelpers.checkAutomaticTaggingDisabled();

        //Confirm Automatic Tagging is enabled for a new curriculum
        cy.get(adminContextMenu.btnAddCurriculum()).should("have.text", "Add Curriculum").click();
        MLHelpers.checkAutomaticTaggingDisabled();

        //Enable the Automatic Tagging from the client portal
        MLHelpers.toggleEnableAutotagging();
        cy.wait(60000); //For QA Main & Secondary
        // cy.wait(90000); //For 5.qa
        // cy.wait(1200000); //AU Sandbox
    });
    
    it("Edit existing online course type for Automatic Tagging FF enabled", function () {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(adminMainMenu.menuGroupCourse()).click();
        cy.get(adminMainMenu.reportsCourse()).should("have.text", "Courses").click();
        cy.wait(2000);

        //Search for course
        cy.get(adminMainMenu.columnNameFilter()).click({force: true})
        cy.wait(1000);
        cy.get(adminMainMenu.textFieldValue()).type("001 - OC");
        cy.get(adminMainMenu.btnAddFilter()).contains("Add Filter").click();
        cy.wait(2000);

        // Edit an online course
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("001 - OC").click();
        cy.wait(1000);
        cy.get(adminContextMenu.btnEditCourse()).should("have.text", "Edit").click();
        cy.wait(1000);

        // Ensure online course has automatic tag(s)
        cy.get(`[class*="_tag_select_value"]`).contains("Guia *");
        cy.get(`[class*="_tag_select_value"]`).contains("Pdf *");
        cy.get(adminContextMenu.btnCancel()).click();
    });

    it("Edit existing ILC course type for Automatic Tagging FF enabled", function () {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(adminMainMenu.menuGroupCourse()).click();
        cy.get(adminMainMenu.reportsCourse()).should("have.text", "Courses").click();
        cy.wait(1000);

        //Search for course
        cy.get(adminMainMenu.columnNameFilter()).click({force: true})
        cy.wait(1000);
        cy.get(adminMainMenu.textFieldValue()).type("003 - ILC");
        cy.get(adminMainMenu.btnAddFilter()).contains("Add Filter").click();
        cy.wait(3000);

        // Edit an ILC course
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("003 - ILC").click();
        cy.wait(1000);
        cy.get(adminContextMenu.btnEditCourse()).should("have.text", "Edit").click();
        cy.wait(3000);

        // Ensure ILC course has automatic tag(s)
        cy.get(`[class*="_tag_select_value"]`).contains("Ilc");
        cy.get(adminContextMenu.btnCancel()).click();
    });

    it("Edit existing Course Bundle type for Automatic Tagging FF enabled", function () {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(adminMainMenu.menuGroupCourse()).click();
        cy.get(adminMainMenu.reportsCourse()).should("have.text", "Courses").click();
        cy.wait(1000);

        //Search for course
        cy.get(adminMainMenu.columnNameFilter()).click({force: true})
        cy.wait(1000);
        cy.get(adminMainMenu.textFieldValue()).type("004 - Course Bundle");
        cy.get(adminMainMenu.btnAddFilter()).contains("Add Filter").click();
        cy.wait(3000);

        // Edit an course bundle
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("004 - Course Bundle").click();
        cy.wait(1000);
        cy.get(adminContextMenu.btnEditCourse()).should("have.text", "Edit").click();
        cy.wait(1000);

        // Ensure course bundle has automatic tag(s)
        cy.get(`[class*="_tag_select_value"]`).contains("004 - Course Bundle *");
        cy.get(adminContextMenu.btnCancel()).click();
    });

    it("Edit existing Curriculum type for Automatic Tagging FF enabled", function () {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.get(adminMainMenu.menuGroupCourse()).click();
        cy.get(adminMainMenu.reportsCourse()).should("have.text", "Courses").click();
        cy.wait(1000);

        //Search for course
        cy.get(adminMainMenu.columnNameFilter()).click({force: true})
        cy.wait(1000);
        cy.get(adminMainMenu.textFieldValue()).type("005 - Curriculum");
        cy.get(adminMainMenu.btnAddFilter()).contains("Add Filter").click();
        cy.wait(3000);

        // Edit Curriculum
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("005 - Curriculum").click();
        cy.wait(2000);
        cy.get(adminContextMenu.btnEditCourse()).should("have.text", "Edit").click();
        cy.wait(3000);

        // Ensure Curriculum has automatic tag(s)
        cy.get(`[class*="_tag_select_value"]`).contains("- Oc *");
        cy.get(`[class*="_tag_select_value"]`).contains("- Ilc *");
        // cy.get(`[class*="_tag_select_value"]`).contains("005 - Curriculum *");
        cy.get(adminContextMenu.btnCancel()).click();
    });



    //Anything under this line cannot be ran in production
    //==============================================================================================================
    // it("Run the AbsorbLMS.Scheduler.Jobs.Global.TrainTopicModelingForAllDatabases Job", function () {
    //     //Go to main blatant portal to run the HF (Hang Fire) job
    //     MLEnvironments.signInAdmin("global");
    //     cy.get(adminMainMenu.menuGroupSetup()).click();
    //     cy.get(adminMainMenu.absorbUtilities()).should("have.text", "Absorb Utilities").click();
    //     cy.wait(1000);
    //     cy.get(adminAbsorbUtilities.global()).click();
    //     cy.wait(1000);
    //     cy.get(adminAbsorbUtilities.headerRecurringjobs()).click();
    //     cy.wait(1000);
    //     cy.get(adminAbsorbUtilities.itemsPerPage500()).click();
    //     cy.wait(1000);
    //     cy.get(adminAbsorbUtilities.trainTopicModelingForAllDatabasesJob()).contains("AbsorbLMS.Scheduler.Jobs.Global.TrainTopicModelingForAllDatabasesJob").click();
    //     cy.wait(1000);
    //     cy.get(adminAbsorbUtilities.btnTriggerNow()).click();
    //     cy.wait(1000);
    //     cy.get(adminAbsorbUtilities.headerJobs()).click();
    //     cy.wait(20000);
    //     cy.get(adminAbsorbUtilities.headerJobsSucceeded()).click();
    //     cy.wait(1000);
    //     cy.get(adminAbsorbUtilities.headerJobsSucceededJobDetails()).contains("TrainTopicModelingForAllDatabasesJob.Execute").should("be.visible");
    // });

    // // Disable feature flag: AutomaticTagging
    // it('Disable AutomaticTagging FF (feature Flag)', function() {
    //     //Go to Website
    //     MLEnvironments.signInAdmin("global");
    //     cy.visit(MLEnvironments.envs[MLEnvironments.env]["global"]["urlAdmin"] + "/FeatureFlags");

    //     cy.get(`label:contains("AutomaticTagging")`).parent().within(() => {
    //         cy.get('[data-bind*="click: ToggleChecked"]').click({force:true})
    //     })

    //     cy.get(`[class="has-icon btn submit-edit-content success large"][data-menu="Sidebar"]`).should("have.text", "Save").click({force:true});
    // })

    // it("With Automatic tagging Disabled: Check new online course, ILC, Course Bundle, and Curriculum for Automatic Tagging toggle", function () {
    //     //Go to Website
    //     MLEnvironments.signInAdmin("sml");
    //     cy.get(adminMainMenu.menuGroupCourse()).click();
    //     cy.get(adminMainMenu.reportsCourse()).should("have.text", "Courses").click();
    //     cy.wait(1000);

    //     //Confirm Automatic Tagging is enabled for a new online course
    //     cy.get(adminContextMenu.btnAddOnlineCourse()).should("have.text", "Add Online Course").click();
    //     MLHelpers.checkAutomaticTaggingDisabled();

    //     //Confirm Automatic Tagging is enabled for a new ILC
    //     cy.get(adminContextMenu.btnAddInstructorLed()).should("have.text", "Add Instructor Led").click();
    //     MLHelpers.checkAutomaticTaggingDisabled();

    //     //Confirm Automatic Tagging is enabled for a new course bundle
    //     cy.get(adminContextMenu.btnAddCourseBundle()).should("have.text", "Add Course Bundle").click();
    //     MLHelpers.checkAutomaticTaggingDisabled();

    //     //Confirm Automatic Tagging is enabled for a new curriculum
    //     cy.get(adminContextMenu.btnAddCurriculum()).should("have.text", "Add Curriculum").click();
    //     MLHelpers.checkAutomaticTaggingDisabled();


    // })

    // it('Enable AutomaticTagging FF (feature Flag)', function() {
    //     //Go to Website
    //     MLEnvironments.signInAdmin("global");
    //     cy.visit(MLEnvironments.envs[MLEnvironments.env]["global"]["urlAdmin"] + "/FeatureFlags");

    //     cy.get(`label:contains("AutomaticTagging")`).parent().within(() => {
    //         cy.get('[data-bind*="click: ToggleChecked"]').click({force:true})
    //     })

    //     cy.get(`[class="has-icon btn submit-edit-content success large"][data-menu="Sidebar"]`).should("have.text", "Save").click({force:true});
    // })
});
