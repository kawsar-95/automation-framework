/// <reference types="cypress" />
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage";
import LECatalogPage from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage";
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage";
import MLHelper from "../../../../../../helpers/ML/Helpers";
import ARCourseSettingsCatalogVisibilityModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module";
import { learnerDetails } from "../../../../../../helpers/TestData/ML/learnerData";
import { courseDetails } from "../../../../../../helpers/TestData/ML/courseData";
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal";
import ARAddVideoLessonModal from "../../../../../../helpers/AR/pageObjects/Modals/ARAddVideoLessonModal";
import { lessonVideo } from "../../../../../../helpers/TestData/Courses/oc";
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARSelectLearningObjectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal";
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal";
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage";
import arAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module";
import { miscData } from "../../../../../../helpers/TestData/Misc/misc";
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails";
import MLEnvironments from "../../../../../../helpers/ML/MLEnvironments";
/**
 * Testrail URL:
 * https://absorblms.testrail.io/index.php?/cases/view/3002
 */
describe("C3002 GUIA-Auto - Regression - Time to Complete (Does not use ML Service)", function () {
    // NOTE: This regression test doesn't test for the case: when TTC FF is off, manual TTC on a course should not show up.
    // Required feature flags: EstimatedTimeToComplete Global AND EstimatedTimeToComplete Client toggle
    // Required feature flags for MT-9592: thumbnails ffs on
    // before(() => {
    //     MLHelper.logIn();
    //     MLHelper.deleteCourses();
    //     MLHelper.deleteUsers();
    //     MLHelper.createCourses();
    //     MLHelper.createUsers();
    //     cy.logoutAdmin();
    // });
    // after(() => {
    //     MLHelper.logIn();
    //     MLHelper.deleteCourses();
    //     MLHelper.deleteUsers();
    // });

    it("Test Information:", function () {
        MLEnvironments.testInformation();
    });

    beforeEach(() => {
        // cy.viewport(800, 600);
        cy.viewport("macbook-16");
        MLEnvironments.signInAdmin("sml");
    });

    it("When the ttc of a course with course completions and automatic ttc is toggled to manual and then back to automatic ttc, the automatic ttc is unaffected.", () => {
        MLHelper.goToCoursesReport();
        MLHelper.editCourse(courseDetails["automatic"]["name"]);
        cy.get(`button[title="Catalog Visibility"]`).should("be.visible");
        cy.get(`button[title="Catalog Visibility"]`).first().click();
        cy.wait(3000);
        cy.get(`[data-name=estimatedTimeToComplete]`).contains("Manual").click();
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        });
        MLHelper.goToCoursesReport();
        MLHelper.editCourse(courseDetails["automatic"]["name"]);
        cy.get(`button[title="Catalog Visibility"]`).should("be.visible");
        cy.get(`button[title="Catalog Visibility"]`).first().click();
        arAddMoreCourseSettingsModule.getLShortWait();
        cy.get(`[data-name=estimatedTimeToComplete]`).contains("Automatic").click();
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        });
        MLHelper.goToUsersReport();
        MLHelper.impersonateLearner(learnerDetails[learnerDetails.length - 1]);
        MLHelper.searchCourseByName(courseDetails["automatic"]["name"]);
        cy.wait(3000);
        cy.get(LECatalogPage.getCatalogContainer()).contains(courseDetails["automatic"]["name"]);
        cy.get(LECatalogPage.getCardCourse()).should("have.length.least", 1);
        cy.get(LECatalogPage.getCardCourse()).first().find(`[class*=online-course-card-module__etc]`).should("contain", "1m");
    });
    
    it("should not show Time to Complete for ILC, Curriculum, and Bundles.", () => {
        MLHelper.goToCoursesReport();
        // Test ILC, Curriculum, Bundles
        [ARCoursesPage.getAddInstructorLedBtn(), ARCoursesPage.getAddCurriculaBtn(), ARCoursesPage.getAddCourseBundleBtn()].map((AddLearningResourceBtn) => {
            cy.wait(3000);
            MLHelper.WaitThenClick(AddLearningResourceBtn);
            cy.wait(3000);
            cy.get(`button[title="Catalog Visibility"]`).should("be.visible");
            cy.wait(3000);
            cy.get(`button[title="Catalog Visibility"]`).first().click();
            cy.wait(3000);
            cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Time to Complete")).should("not.exist");
            cy.wait(3000);
            MLHelper.goToCoursesReport();
        });
        // Online Courses
        cy.get(ARCoursesPage.getAddOnlineCourseBtn()).click();
        cy.wait(3000);
        cy.get(`button[title="Catalog Visibility"]`).should("be.visible");
        cy.get(`button[title="Catalog Visibility"]`).first().click();
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Time to Complete")).should("exist");
    });

    it("When webpage is resized into a mobile view, ttc still shows up.", () => {
        MLHelper.goToUsersReport();
        cy.viewport(300, 500);
        MLHelper.impersonateLearner(learnerDetails[0]);
        MLHelper.searchCourseByName(courseDetails["curriculum"]["name"]);
        cy.get('[class*="card-module__name"]').should("exist").contains(courseDetails["curriculum"]["name"]).click();
        cy.get(`[class*=course-list__course_name]`)
            .contains(courseDetails["manual"]["name"])
            .parent()
            .parent()
            .parent()
            .within(() => {
                cy.get(`[class*=course-list__etc]`).should("contain", "1h");
            });
    });

    it("MT-9326 Check that Time to Complete shows for a learner that is unenrolled and enrolled in a curriculum", () => {
        MLHelper.goToUsersReport();
        MLHelper.impersonateLearner(learnerDetails[0]);
        MLHelper.searchCourseByName(courseDetails["curriculum"]["name"]);
        cy.get('[class*="card-module__name"]').should("exist").contains(courseDetails["curriculum"]["name"]).click();
        cy.get(`[class*=course-list__course_name]`)
            .contains(courseDetails["manual"]["name"])
            .parent()
            .parent()
            .parent()
            .within(() => {
                cy.get(`[class*=course-list__etc]`).should("contain", "1h");
            });
        cy.wait(3000);
        // Enroll
        cy.get(`[class*="course-detail-header__container"] [class*="icon icon-plus-circle"]`).click();
        // Refresh
        cy.reload();
        cy.get(`[class*=course-list__course_name]`)
            .contains(courseDetails["manual"]["name"])
            .parent()
            .parent()
            .parent()
            .within(() => {
                cy.get(`[class*=course-list__etc]`).should("contain", "1h");
            });
    });

    it("MT-9592 Automatic TTC shows up accordingly AND Course change history doesn't show that time to complete was changed when some other field was changed.", () => {
        MLHelper.goToCoursesReport();
        MLHelper.editCourse(courseDetails["automatic"]["name"]);

        cy.get(`button[title="Catalog Visibility"]`).should("be.visible");
        cy.get(`button[title="Catalog Visibility"]`).first().click();
        arAddMoreCourseSettingsModule.getLShortWait();

        //Add a Poster Via File Source
        cy.get(ARCourseSettingsCatalogVisibilityModule.getAddPosterBtn()).click();
        cy.wait(2000);
        cy.get(ARCoursesPage.getElementByDataNameAttributeAndIndex(ARCourseSettingsCatalogVisibilityModule.getPosterGroup(), 0) + " " + ARCourseSettingsCatalogVisibilityModule.getPosterChooseFileBtn()).click();
        cy.wait(2000);
        //Opening Media Library
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click();
        cy.wait(2000);
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.posterImgName);
        cy.wait(2000);

        cy.get(`[data-name="file-browser"] [data-name=submit]`).click({ force: true });
        cy.wait(2000);

        // Add a Thumbnail Via URL Source
        cy.wait(3000);
        cy.contains(ARCourseSettingsCatalogVisibilityModule.getAddImageBtn(), "File").click({ force: true });
        cy.wait(3000);
        cy.contains(ARCourseSettingsCatalogVisibilityModule.getAddUrlBtn(), "Url").click();

        cy.wait(3000);
        cy.get(`input[name="thumbnailImage"]`).clear().type(miscData.switching_to_absorb_img_url);
        cy.wait(3000);
        cy.get(ARCourseSettingsCatalogVisibilityModule.getAddPosterBtn()).click();

        // Add video object
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should("have.attr", "aria-disabled", "false").click();
        ARSelectLearningObjectModal.getObjectTypeByName("Video");
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click();
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARAddVideoLessonModal.getNameTxt())).type(lessonVideo.ocVideoName);
        //Add Valid Width and Height to Video Lesson
        cy.get(`input[aria-label="Video Width"]`).type("640");
        cy.get(`input[aria-label="Video Height"]`).type("480");
        //Add a Video Label
        cy.get(`input[aria-label="Label (e.g. HD, SD, 720p, 480p)"]`).type(lessonVideo.videoLabel);
        //Add a Video Via File Upload
        cy.get(ARAddVideoLessonModal.getVideoSourceChooseFileBtn()).click();
        cy.wait(2000);
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click();
        cy.wait(2000);
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.videoPath + lessonVideo.videoName);
        cy.wait(2000);
        cy.get(`[data-name="file-browser"] [data-name=submit]`).click({ force: true });
        cy.wait(2000);

        //Save the Video Lesson
        cy.get(`[data-name="dialog-title"]:contains("Add Video Lesson")`)
            .parent()
            .parent()
            .within(() => {
                cy.get(`[data-name=save]`).should("be.visible").click().click({ force: true });
            });
        ARUploadFileModal.getLShortWait();
        // Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        });

        // Check that most recent change doesn't include TTC but includes changes to thumbnails etc.
        // cy.visit("/admin");
        MLHelper.goToCoursesReport();
        MLHelper.editCourse(courseDetails["automatic"]["name"]);
        cy.get(`button[title="View History"]`).click();
        MLHelper.getLongWait();
        // MLHelper.WaitForElementStateToChange(`[data-name="dialog-title"]:contains("Online Course History")`);
        cy.get(`[class*=_content_container]`).first().contains(`EstimatedTimeToComplete Mode From`).should("not.exist");
        cy.get(`[class*=_content_container]`).contains(`GUIA Video Lesson`).should("exist");
        cy.get(`[class*=_content_container]`).contains(`Absorb logo small`).should("exist");
        cy.get(`[class*=_content_container]`).contains(miscData.switching_to_absorb_img_url).should("exist"); // Just checking that this was changed at least once.
        // Impersonate learner and check TTC still shows up.
        MLHelper.goToUsersReport();
        MLHelper.impersonateLearner(learnerDetails[learnerDetails.length - 1]);
        MLHelper.searchCourseByName(courseDetails["automatic"]["name"]);
        cy.wait(2000);
        cy.get(LECatalogPage.getCatalogContainer()).contains(courseDetails["automatic"]["name"]);
        cy.wait(3000);
        cy.get(LECatalogPage.getCardCourse()).should("have.length.least", 1);
        cy.wait(3000);
        cy.get(LECatalogPage.getCardCourse()).first().find(`[class*=online-course-card-module__etc]`).should("contain", "1m");
    });

    it("ML-859 Make sure time to complete values are correctly showing up on courses for course bundles", () => {
        MLHelper.goToUsersReport();
        MLHelper.impersonateLearner(learnerDetails[0]);
        MLHelper.searchCourseByName(courseDetails["course bundle"]["name"]);
        cy.wait(2000);
        cy.get('[class*="card-module__name"]').should("exist").contains(courseDetails["course bundle"]["name"]).click();
        cy.get(`[class*=course-list__course_name]`)
            .contains(courseDetails["manual"]["name"])
            .parent()
            .parent()
            .parent()
            .within(() => {
                cy.get(`[class*=course-list__etc]`).should("contain", "1h");
            });
        cy.get(`[class*=course-list__course_name]`)
            .contains(courseDetails["automatic"]["name"])
            .parent()
            .parent()
            .parent()
            .within(() => {
                cy.get(`[class*=course-list__etc]`).should("contain", "1m");
            });
    });
    it("should show time to complete values on the learners side", () => {
        MLHelper.impersonateLearner(learnerDetails[0]);
        cy.wait(3000);
        MLHelper.searchCourseByName(courseDetails["manual"]["name"]);
        cy.wait(3000);
        cy.get(LECatalogPage.getCatalogContainer()).contains(courseDetails["manual"]["name"]);
        cy.get(LECatalogPage.getCardCourse()).should("have.length.least", 1);
        cy.get(LECatalogPage.getCardCourse()).first().find(`[class*=online-course-card-module__etc]`).should("contain", "1h");
        // // Check on learner side that time to complete shows up
        // MLHelper.stopImpersonating();
    });
});
