// TestRail TC reference: Course Thumbnail Suggestions:  https://absorblms.testrail.io//index.php?/cases/view/3001
const dayjs = require('dayjs')

/// <reference types="cypress" />
import MLEnvironments from "../../../../../../helpers/ML/MLEnvironments";
import adminMainMenu from "../../../../../../helpers/ML/mlPageObjects/adminMainMenu";
import adminContextMenu from "../../../../../../helpers/ML/mlPageObjects/adminContextMenu";
import adminReportCourse from "../../../../../../helpers/ML/mlPageObjects/adminReportCourse";

describe("CED Course Thumbnail Suggestions", function () {
    it("Test Information:", function () {
        MLEnvironments.testInformation()
    });

    it("Exercise and validate the thumbnail, its preview, when using the shuffle button", function () {
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
        cy.get('input[aria-label="Title"]').type("Big cat");
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

        // Check the course thumbnail image file name
        cy.get(adminReportCourse.catalogVisibilityThumbnailPreview()).find("img").should("have.attr", "src").should("include", "oEgiJNbYw8w.jpg");

        // Click the thumbnail shuffle button again
        cy.get(`[data-name="shuffle"][title="Shuffle"]`).click();
        cy.wait(1000);

        // Check the new course thumbnail image file name
        cy.get(adminReportCourse.catalogVisibilityThumbnailPreview()).find("img").should("have.attr", "src").should("include", "4fWlc-iW3ME.jpg");

        // Publish course
        cy.get(adminContextMenu.btnPublishCourse()).should("have.text", "Publish").click();
        cy.wait(1000);
        cy.get(adminContextMenu.btnContinue()).should("have.text", "Continue").click();
        cy.wait(8000);

        //Search for course
        cy.get(adminMainMenu.columnNameFilter()).click({force: true})
        cy.wait(1000);
        cy.get(adminMainMenu.textFieldValue()).type("Big cat");
        cy.get(adminMainMenu.btnAddFilter()).contains("Add Filter").click();
        cy.wait(2000);

        // Edit course
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Big cat").click();
        cy.wait(1000);
        cy.get(adminContextMenu.btnEditCourse()).should("have.text", "Edit").click();
        cy.wait(7000);

        // Ensure course thumbnail persists
        cy.get(adminReportCourse.catalogVisibilityThumbnailPreview()).find("img").should("have.attr", "src").should("include", "4fWlc-iW3ME.jpg");
        cy.wait(1000);

        // Publish course
        cy.get(adminContextMenu.btnPublishCourse()).should("have.text", "Publish").click();
        cy.wait(1000);
        cy.get(adminContextMenu.btnContinue()).should("have.text", "Continue").click();
        cy.wait(5000);

        // Edit course
        cy.get(adminContextMenu.btnEditCourse()).should("have.text", "Edit").click();
        cy.wait(5000);

        //Open Catalog Visibility Section
        cy.get(`[data-name="section-button-catalogVisibility"]`).click();
        cy.wait(1000);

        // Click the thumbnail shuffle button
        cy.get(`[data-name="shuffle"][title="Shuffle"]`).click();
        cy.wait(1000);

        // Validate updated course thumbnail image file name
        cy.get(adminReportCourse.catalogVisibilityThumbnailPreview()).find("img").should("have.attr", "src").should("include", "oEgiJNbYw8w.jpg");

        // Publish course
        cy.get(adminContextMenu.btnPublishCourse()).should("have.text", "Publish").click();
        cy.wait(1000);
        cy.get(adminContextMenu.btnContinue()).should("have.text", "Continue").click();
        cy.wait(5000);
    });

    it('As Learner, confirm the latest course thumbnail "Big Cat" display in different views', function () {
        //Go to Website
        MLEnvironments.signInLearner("sml");

        //Use the search icon and search for Big cat
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`).click().focus().type("Big cat{enter}");
        cy.wait(3000);
        //By default the list view will display with no course thumbnail
        cy.get(`[title="Big cat"]`).should("be.visible");
        cy.wait(3000);
        //Select the view list
        cy.get('[class*="icon icon-view-list"]').click();
        //Select the view cards icon
        cy.wait(3000);
        cy.get('[class*="icon icon-view-cards"]').click();
        cy.wait(4000);
        //Verify the course thumbnail displays
        cy.get(`[class*="thumbnail-module__container"]`).find("img").should("have.attr", "src").should("include", "oEgiJNbYw8w");

        //Select the view list
        cy.get('[class*="icon icon-view-cards"]').click();
        //Select the view detailed icon
        cy.get('[class*="icon icon-view-detailed"]').click();
        //Verify the course thumbnail displays
        cy.get(`[class*="panel-module__thumbnail"]`).find("img").should("have.attr", "src").should("include", "oEgiJNbYw8w");
    });

    it("Exercise Suggested images in New File Manager", function () {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.wait(7000);
        cy.get(adminMainMenu.menuGroupCourse()).click();
        cy.get(adminMainMenu.reportsCourse()).should("have.text", "Courses").click();
        cy.wait(7000);

        //Search for course
        cy.get(adminMainMenu.columnNameFilter()).click({force: true})
        cy.wait(1000);
        cy.get(adminMainMenu.textFieldValue()).type("Big cat");
        cy.get(adminMainMenu.btnAddFilter()).contains("Add Filter").click();
        cy.wait(2000);

        // Edit course
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Big cat").click();
        cy.wait(1000);
        cy.get(adminContextMenu.btnEditCourse()).should("have.text", "Edit").click();
        cy.wait(7000);

        //Open Catalog Visibility Section
        cy.get(`[data-name="section-button-catalogVisibility"]`).click();
        cy.wait(2000);

        // Click the thumbnail shuffle button
        cy.get(`[data-name="shuffle"][title="Shuffle"]`).click();
        cy.wait(2000);

        // Select the Choose File button to launch New File Manager
        cy.get(adminReportCourse.btnChooseFile()).contains("Choose File").click();
        cy.wait(5000);

        // From the Suggested Images, Select the 4th image (Big cat yawning)
        cy.get('[title="/media_collections/unsplash/thumbnails/IClZkw4UhRA.jpg"]').click();
        cy.wait(1000);
        cy.get('[data-name="media-library-apply"]').click();
        cy.wait(5000);

        // Publish course
        cy.get(adminContextMenu.btnPublishCourse()).should("have.text", "Publish").click();
        cy.wait(1000);
        cy.get(adminContextMenu.btnContinue()).should("have.text", "Continue").click();
        cy.wait(5000);

        // Edit course
        cy.get(adminContextMenu.btnEditCourse()).should("have.text", "Edit").click();
        cy.wait(8000);

        //Open Catalog Visibility Section
        cy.get(`[data-name="section-button-catalogVisibility"]`).click();
        cy.wait(1000);

        // Click the thumbnail shuffle button again
        cy.get(`[data-name="shuffle"][title="Shuffle"]`).click();
        cy.wait(1000);

        // Select the Choose File button to launch New File Manager
        cy.get(adminReportCourse.btnChooseFile()).contains("Choose File").click();
        cy.wait(5000);

        //Search for specific course thumbnail images for 'Gun' and select it
        cy.get('[data-name="media-library-search-input"][class*="_search_"]').type("Gun");
        cy.get('[title="/media_collections/open-images/thumbnails/163936065619dc62.jpg"]').click();
        cy.get('[data-name="media-library-apply"]').click();
        cy.wait(5000);

        // Publish course
        cy.get(adminContextMenu.btnPublishCourse()).should("have.text", "Publish").click();
        cy.wait(1000);
        cy.get(adminContextMenu.btnContinue()).should("have.text", "Continue").click();
        cy.wait(5000);

        // Edit course
        cy.get(adminContextMenu.btnEditCourse()).should("have.text", "Edit").click();
        cy.wait(7000);

        //Open Catalog Visibility Section
        cy.get(`[data-name="section-button-catalogVisibility"]`).click();
        cy.wait(1000);

        // Ensure course thumbnail persists
        cy.get(adminReportCourse.catalogVisibilityThumbnailPreview()).find("img").should("have.attr", "src").should("include", "163936065619dc62");
        cy.wait(1000);

        // Publish course
        cy.get(adminContextMenu.btnPublishCourse()).should("have.text", "Publish").click();
        cy.wait(1000);
        cy.get(adminContextMenu.btnContinue()).should("have.text", "Continue").click();
        cy.wait(5000);

        // Edit course
        cy.get(adminContextMenu.btnEditCourse()).should("have.text", "Edit").click();
        cy.wait(7000);

        //Open Catalog Visibility Section
        cy.get(`[data-name="section-button-catalogVisibility"]`).click();
        cy.wait(2000);

        // Shuffle the thumbnail preview multiple times and select the trash can icon.
        var genArr = Array.from({ length: 10 }, (v, k) => k + 1);
        cy.wrap(genArr).each((index) => {
            cy.get(`[data-name="shuffle"][title="Shuffle"]`).click();
            cy.wait(2000);
        });
        cy.get(`[data-name="delete"][title="Delete"]`).click();
        cy.wait(1000);
        cy.get(adminReportCourse.catalogVisibilityThumbnailPreview()).find("img").should("have.attr", "src").should("include", "649849");

        // Publish course
        cy.get(adminContextMenu.btnPublishCourse()).should("have.text", "Publish").click();
        cy.wait(1000);
        cy.get(adminContextMenu.btnContinue()).should("have.text", "Continue").click();
        cy.wait(5000);

        // Edit course
        cy.get(adminContextMenu.btnEditCourse()).should("have.text", "Edit").click();
        cy.wait(8000);

        //Open Catalog Visibility Section
        cy.get(`[data-name="section-button-catalogVisibility"]`).click();
        cy.wait(1000);

        //Search for specific course thumbnail images for 'Operation Mincemeat' and select it
        cy.get(`[data-name="label"]`).contains("File").click();
        // Select the Choose File button to launch New File Manager
        cy.wait(2000);
        cy.get(adminReportCourse.btnChooseFile()).contains("Choose File").click();
        cy.wait(5000);
        cy.get('[data-name="media-library-search-input"][class*="_search_"]').type("Operation Mincemeat was a successful British deception operation");
        cy.get('[title="/media_collections/open-images/thumbnails/9767484b72ce1971.jpg"]').click();
        cy.get('[data-name="media-library-apply"]').click();
        cy.wait(5000);

        // Publish course
        cy.get(adminContextMenu.btnPublishCourse()).should("have.text", "Publish").click();
        cy.wait(1000);
        cy.get(adminContextMenu.btnContinue()).should("have.text", "Continue").click();
        cy.wait(5000);

        // Edit course
        cy.get(adminContextMenu.btnEditCourse()).should("have.text", "Edit").click();
        cy.wait(7000);

        //Open Catalog Visibility Section
        cy.get(`[data-name="section-button-catalogVisibility"]`).click();
        cy.wait(1000);

        // Ensure course thumbnail persists
        cy.get(adminReportCourse.catalogVisibilityThumbnailPreview()).find("img").should("have.attr", "src").should("include", "9767484b72ce1971");

        // Publish course
        cy.get(adminContextMenu.btnPublishCourse()).should("have.text", "Publish").click();
        cy.wait(1000);
        cy.get(adminContextMenu.btnContinue()).should("have.text", "Continue").click();
        cy.wait(5000);
    });

    it("As Learner, confirm the course thumbnail display in different views", function () {
        //Go to Website
        MLEnvironments.signInLearner("sml");

        //Use the search icon and search for Big cat
        cy.get(`[class*="icon-button-module__btn"][title="Search"]`).click().focus().type("Big cat{enter}");
        cy.wait(3000);
        //By default the list view will display with no course thumbnail
        cy.get(`[title="Big cat"]`).should("be.visible");
        //Select the view list
        cy.get('[class*="icon icon-view-list"]').click();
        //Select the view cards icon
        cy.get('[class*="icon icon-view-cards"]').click();
        cy.wait(1000);
        //Verify the course thumbnail displays
        cy.get(`[class*="thumbnail-module__container"]`).find("img").should("have.attr", "src").should("include", "9767484b72ce1971");

        //Select the view list
        cy.get('[class*="icon icon-view-cards"]').click();
        //Select the view detailed icon
        cy.get('[class*="icon icon-view-detailed"]').click();
        //Verify the course thumbnail displays
        cy.get(`[class*="panel-module__thumbnail"]`).find("img").should("have.attr", "src").should("include", "9767484b72ce1971");
    });

    it("Delete the course", function () {
        //Go to Website
        MLEnvironments.signInAdmin("sml");
        cy.wait(1000);
        cy.get(adminMainMenu.menuGroupCourse()).click();
        cy.get(adminMainMenu.reportsCourse()).should("have.text", "Courses").click();
        cy.wait(7000);

        //Search for course
        cy.get(adminMainMenu.columnNameFilter()).click({force: true})
        cy.wait(1000);
        cy.get(adminMainMenu.textFieldValue()).type("Big cat");
        cy.get(adminMainMenu.btnAddFilter()).contains("Add Filter").click();
        cy.wait(4000);
                
        // Delete the course
        cy.get(adminReportCourse.reportCourseTableContainer()).contains("Big cat").click();
        cy.wait(1000);
        cy.get(`[data-name="delete-course-context-button"]`).click();
        cy.wait(1000);
        cy.get(`[data-name="confirm"]`).should("have.text", "Delete").click();
        cy.wait(1000);
    });
});
