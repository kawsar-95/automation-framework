///<reference types="cypress"/>

import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module";
import ARCourseSettingsCourseUploadsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseUploads.module";
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module";
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARUploadInstructionsModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadInstructionsModal";
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails";
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc";
import { users } from "../../../../../../helpers/TestData/users/users";

describe("MT-8844-Edit Upload Instructions", () => {
  beforeEach(() => {
    cy.apiLoginWithSession(
      users.sysAdmin.admin_sys_01_username,
      users.sysAdmin.admin_sys_01_password,
      "/admin"
    );
    cy.get(
      ARDashboardPage.getElementByAriaLabelAttribute(
        ARDashboardPage.getARLeftMenuByLabel("Courses")
      )
    ).click();
    cy.wrap(ARDashboardPage.getMenuItemOptionByName("Courses"));
    cy.intercept("/api/rest/v2/admin/reports/courses/operations")
      .as("getCourses")
      .wait("@getCourses");
  });
  after(() => {
    //delete the temporary course
    cy.deleteCourse(commonDetails.courseID);
  })
  it("Create temporary Course to test Edit", () => {
    cy.createCourse("Online Course");
    ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn("All Learners");
    //Set enrollment rule - Allow self enrollment for all learners
    cy.get(
      ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentForm()
    ).within(() => {
      cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnLabel())
        .contains("All Learners")

        .click();
    });
    cy.publishCourseAndReturnId().then((id) => {
      commonDetails.courseID = id.request.url.slice(-36);
      cy.log('course ID : ', id);
    });
    cy.log('Course name: ', ocDetails.courseName);

  })
  it("Edit Upload Instruction in Course (MT-8844)", () => {
    //Select an existing course [Step #3,#4,#5, #6]
    cy.editCourse(ocDetails.courseName);

    // Click on course upload at header
    cy.get(
      ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Course Uploads")
    ).click();
    // Click on Add upload option
    cy.get(ARCourseSettingsCourseUploadsModule.getAddUploadBtn()).click();
    // Click on Edit Upload Instructions option
    cy.get(
      ARCourseSettingsCourseUploadsModule.getEditUploadInstructionsBtn()
    ).click();
    cy.get(
      ARCourseSettingsCourseUploadsModule.getElementByAriaLabelAttribute(
        "Upload Instructions"
      )
    ).type(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    );

    //Check cursor while editing/creating text field of Course Upload Instruction Box
    cy.get(
      ARCourseSettingsCourseUploadsModule.getElementByAriaLabelAttribute(
        "Upload Instructions"
      )
    ).type("{selectall}");
    cy.get(ARUploadInstructionsModal.getModalContainer()).find(ARUploadInstructionsModal.getBoldBtn()).click();
    cy.get(ARUploadInstructionsModal.getModalContainer()).find(ARUploadInstructionsModal.getItalicBtn()).click();
    cy.get(ARUploadInstructionsModal.getApplyBtn()).click();
    //publish course
    cy.publishCourseAndReturnId().then((id) => {
      commonDetails.courseID = id.request.url.slice(-36);
    });
  });
});
