/// <reference types="cypress" />
import arDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module";
import { users } from "../../../../../../helpers/TestData/users/users";
import arOCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage";
import ARSelectLearningObjectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal";
import ARAddVideoLessonModal from "../../../../../../helpers/AR/pageObjects/Modals/ARAddVideoLessonModal";
import {
  lessonVideo,
  ocDetails,
} from "../../../../../../helpers/TestData/Courses/oc";
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal";
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails";
import ARCourseSettingsCatalogVisibilityModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module";
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage";
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module";
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage";
import LEFilterMenu from "../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu";
import LECoursesPage from "../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage";
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";

/**
 * Testrail URL: https://absorblms.testrail.io/index.php?/cases/view/6379
 */
describe("Verify that admin user is able to upload video in chapter with 'Enable for Mobile App' toggle' enabled, without error 422", () => {
  beforeEach(() => {
    cy.apiLoginWithSession(
      users.sysAdmin.admin_sys_01_username,
      users.sysAdmin.admin_sys_01_password,
      "/admin"
    );

  });
  after(function () {
    //Delete Course
    cy.deleteCourse(commonDetails.courseID);
  });
  it("Toggle Enable for Mobile App", () => {
    cy.get(
      arDashboardPage.getElementByAriaLabelAttribute(
        arDashboardPage.getARLeftMenuByLabel("Courses")
      )
    ).click();
    cy.wrap(arDashboardPage.getMenuItemOptionByName("Courses"));
    cy.intercept("/api/rest/v2/admin/reports/courses/operations")
      .as("getCourses")
      .wait("@getCourses");

    //Add an online course
    cy.createCourse("Online Course");
    ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn(
      "All Learners"
    );

    //Set enrollment rule - Allow self enrollment for all learners
    cy.get(
      ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentForm()
    ).within(() => {
      cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnLabel())
        .contains("All Learners")

        .click();
    });
    //Enable Mobile for App
    cy.get(
      ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn(
        "Catalog Visibility"
      )
    ).click();
    cy.get(
      ARCoursesPage.getElementByDataNameAttribute(
        ARCourseSettingsCatalogVisibilityModule.getEnableForMobileAppToggleContainer()
      ) +
      " " +
      ARCoursesPage.getToggleDisabled()
    ).click();

    //Add a video type object lesson to a chapter.
    cy.get(arOCAddEditPage.getAddLearningObjectBtn()).click();
    ARSelectLearningObjectModal.getObjectTypeByName("Video");
    cy.get(ARSelectLearningObjectModal.getNextBtn()).click();
    cy.get(
      arOCAddEditPage.getElementByAriaLabelAttribute(
        ARAddVideoLessonModal.getNameTxt()
      )
    ).type(lessonVideo.ocVideoName);


    //Add a Video Label
    cy.get(ARAddVideoLessonModal.getVideoSourceLabelTxtF()).type(
      lessonVideo.videoLabel
    );

    //Add a Video Via File Upload
    cy.get(ARAddVideoLessonModal.getVideoSourceChooseFileBtn()).click();
    //Select upload from the media library
    cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
    cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(
      commonDetails.videoPath + lessonVideo.videoName
    );
    cy.get(ARUploadFileModal.getChooseFileBtn()).click;
    ARUploadFileModal.getShortWait();
    cy.get(ARUploadFileModal.getSaveBtn()).click();
    ARUploadFileModal.getMediumWait();

    //Save the Video Lesson
    cy.get(ARAddVideoLessonModal.getApplyBtn())
      .should("be.visible")
      .click()
      .click({ force: true });
    ARUploadFileModal.getLShortWait();

    //Publish Course
    cy.publishCourseAndReturnId().then((id) => {
      commonDetails.courseID = id.request.url.slice(-36);
    });
    ARDashboardPage.getLongWait();

  });
  it("Enroll to course", () => {
    cy.visit('/#/catalog')
    LEDashboardPage.getShortWait();
    ARDashboardPage.getActionBtnByTitle("Show filters");
    LEFilterMenu.SearchForCourseByName(ocDetails.courseName);
    LEDashboardPage.getLongWait();
    cy.get(LECoursesPage.getEnrollBtn()).click();
    LEDashboardPage.getMediumWait()
    LECoursesPage.getAndClickStartBtn();
    LEDashboardPage.getVLongWait()
  })
});
