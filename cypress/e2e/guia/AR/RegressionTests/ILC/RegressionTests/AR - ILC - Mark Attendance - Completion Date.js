///<reference types="cypress"/>

import ARCoursesPage from "../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage";
import ARILCAddEditPage from "../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage";
import ARILCMarkUserInActivePage from "../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCMarkUserInActivePage";
import ARAddMoreCourseSettingsModule from "../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module";
import ARCourseSettingsCompletionModule from "../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module";
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module";
import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARDeleteModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal";
import ARSelectModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal";
import ARUploadFileModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal";
import ARILCSessionReportPage from "../../../../../../../helpers/AR/pageObjects/Reports/ARILCSessionReportPage";
import AREnrollUsersPage from "../../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage";
import ARUserPage from "../../../../../../../helpers/AR/pageObjects/User/ARUserPage";
import ARUserTranscriptPage from "../../../../../../../helpers/AR/pageObjects/User/ARUserTranscriptPage";
import { commonDetails } from "../../../../../../../helpers/TestData/Courses/commonDetails";
import {
  ilcDetails,
  sessions,
} from "../../../../../../../helpers/TestData/Courses/ilc";
import { userDetails } from "../../../../../../../helpers/TestData/users/UserDetails";
import { users } from "../../../../../../../helpers/TestData/users/users";

function addSessionForTheFuture() {
  /** Add session for future */
  cy.get(ARILCAddEditPage.getAddSessionBtn()).click();

  //Set future title
  cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false')
    .clear()
    .type(sessions.futuresessionName);
  ARILCAddEditPage.getStartDatePickerBtnThenClick();
  ARILCAddEditPage.getSelectDate(sessions.date1);
  ARILCAddEditPage.getEndDatePickerBtnThenClick();
  ARILCAddEditPage.getSelectDate(sessions.date1);
  cy.get(ARILCAddEditPage.getEndDateTimeBtn()).click();
  ARILCAddEditPage.SelectTime("03", "00", "PM");
  cy.get(ARILCAddEditPage.getDateTimeLabel())
    .contains("Class End Date and Time")
    .click(); //hide timepicker

  //Set Timezone
  cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneDDown()).click();
  cy.get(
      ARILCAddEditPage.getSessionDetailsTimeZoneTxtF()
    )
  
    .first()
    .type("(UTC+06:00) Dhaka");
  cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneDDownOpt())
    .contains("(UTC+06:00) Dhaka")
    .click();
  //Save ILC Session
  cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click({ force: true });
  ARILCAddEditPage.getLShortWait();
}
function addSessionForThePast() {
  //Set session for the past
  cy.get(ARILCAddEditPage.getAddSessionBtn()).click();
  //Set Valid Title
  cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false')
    .clear()
    .type(sessions.pastsessionName);

  ARILCAddEditPage.getStartDatePickerBtnThenClick();
  ARILCAddEditPage.getSelectDate(sessions.date2);
  ARILCAddEditPage.getEndDatePickerBtnThenClick();
  ARILCAddEditPage.getSelectDate(sessions.date2);
  cy.get(ARILCAddEditPage.getEndDateTimeBtn()).click();
  ARILCAddEditPage.SelectTime("01", "00", "PM");
  cy.get(ARILCAddEditPage.getDateTimeLabel())
    .contains("Class End Date and Time")
    .click(); //hide timepicker

  //Set Timezone
  cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneDDown()).click();
  cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneTxtF())
  
    .first()
    .type("(UTC+06:00) Dhaka");
  cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneDDownOpt())
    .contains("(UTC+06:00) Dhaka")
    .click();

  //Save ILC Session
  cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click({ force: true });
  ARILCAddEditPage.getLShortWait();
}
function addRecurringSession() {
  cy.get(ARILCAddEditPage.getAddSessionBtn()).click();

  //Set title for recurring session
  cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false').clear();
  ARILCAddEditPage.getShortWait();
  cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false')
    .clear()
    .type(sessions.recurringsessionName);
  ARILCAddEditPage.getStartDatePickerBtnThenClick();
  ARILCAddEditPage.getSelectDate(sessions.date1);
  ARILCAddEditPage.getEndDatePickerBtnThenClick();
  ARILCAddEditPage.getSelectDate(sessions.date1);

  //Set Valid End Time
  cy.get(ARILCAddEditPage.getEndDateTimeBtn()).click();
  ARILCAddEditPage.SelectTime("01", "00", "PM");
  cy.get(ARILCAddEditPage.getStartDateTimeBtn()).click();
  ARILCAddEditPage.SelectTime("11", "00", "AM");
  cy.get(ARILCAddEditPage.getStartDateTimeBtn()).click();
  cy.get(ARILCAddEditPage.getDateTimeLabel())
    .contains("Class End Date and Time")
    .click(); //hide timepicker

  //Set Timezone
  cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneDDown()).click();
  cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneTxtF()
    )
  
    .first()
    .type("(UTC+06:00) Dhaka");
  cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneDDownOpt())
    .contains("(UTC+06:00) Dhaka")
    .click();

  //Set Recurring Classes
  cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDown()).click();
  cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDownOpt())
    .contains("day(s)")
    .click();
  cy.get(
    ARILCAddEditPage.getElementByAriaLabelAttribute(
      ARILCAddEditPage.getSessionDetailsReccuringClassesRepeatTxt()
    )
  )
    .clear()
    .type("2");
  //Save ILC Session
  cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click({ force: true });
  ARILCAddEditPage.getLShortWait();
}
/**
 * Testrail URL:
 * https://absorblms.testrail.io/index.php?/cases/view/5159
 */
describe("Mark Attendance Completion Date", () => {
  var i = 0;
  let userNames = [
    `${userDetails.username}`,
    `${userDetails.username2}`,
    `${userDetails.username3}`,
  ]; //test specific array
  let sessionNames = [
    `${sessions.pastsessionName}`,
    `${sessions.futuresessionName}`,
    `${sessions.recurringsessionName}`,
  ]; //test specific array

  before(function () {
    cy.log("Creating 3 Learners");
    cy.createUser(void 0, userDetails.username, ["Learner"], void 0);
    cy.log('Username : ', userDetails.username);
    cy.createUser(void 0, userDetails.username2, ["Learner"], void 0);
    cy.log('Username : ', userDetails.username2);
    cy.createUser(void 0, userDetails.username3, ["Learner"], void 0);
    cy.log('Username : ', userDetails.username3);
  });
  beforeEach(() => {
    cy.apiLoginWithSession(
      users.sysAdmin.admin_sys_01_username,
      users.sysAdmin.admin_sys_01_password,
      "/admin"
    );
  });
  after(() => {
    cy.deleteCourse(commonDetails.courseID, "instructor-led-courses-new");
    //Delete created Users/Learners
    cy.apiLoginWithSession(
      users.sysAdmin.admin_sys_01_username,
      users.sysAdmin.admin_sys_01_password,
      "/admin"
    );
    cy.get(
      ARDashboardPage.getElementByAriaLabelAttribute(
        ARDashboardPage.getARLeftMenuByLabel("Users")
      )
    ).click();
    cy.wrap(ARDashboardPage.getMenuItemOptionByName("Users"));
    cy.intercept("**/users/operations").as("getUser").wait("@getUser");
    for (i = 0; i < userNames.length; i++) {
      ARUserPage.getLongWait();
      cy.wrap(ARUserPage.AddFilter("Username", "Equals", userNames[i]));
      cy.wrap(ARUserPage.selectTableCellRecord(userNames[i]));
      cy.wrap(
        ARUserPage.WaitForElementStateToChange(
          ARUserPage.getAddEditMenuActionsByName("Delete"),
          AREnrollUsersPage.getShortWait()
        )
      );
      cy.get(ARUserPage.getAddEditMenuActionsByName("Delete")).click();
      cy.wrap(
        ARUserPage.WaitForElementStateToChange(
          ARDashboardPage.getElementByDataNameAttribute(
            ARDeleteModal.getDeleteBtn()
          ),
          AREnrollUsersPage.getLShortWait()
        )
      );
      cy.get(
        ARDashboardPage.getElementByDataNameAttribute(
          ARDeleteModal.getDeleteBtn()
        )
      )
        .click()
        .wait("@getUser");
      cy.get(ARUserPage.getNoResultMsg())
        .contains("No results found.")
        .should("exist");
    }
  });
  it("Add Past,Future and Recurring Sessions", () => {
    cy.get(
      ARDashboardPage.getElementByAriaLabelAttribute(
        ARDashboardPage.getARLeftMenuByLabel("Courses")
      )
    ).click();
    cy.wrap(ARDashboardPage.getMenuItemOptionByName("Courses"));
    cy.intercept("/api/rest/v2/admin/reports/courses/operations")
      .as("getCourses")
      .wait("@getCourses");
    cy.createCourse("Instructor Led", ilcDetails.courseName, false);

    //Verify no total/past/future sessions exist
    cy.get(ARILCAddEditPage.getNoSessionsAddedTxt()).should(
      "contain",
      "No sessions have been added."
    );
    //Add Session
    addSessionForThePast();

    addSessionForTheFuture();

    addRecurringSession();

    //Open Completion Section
    cy.get(
      ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Completion")
    ).click();
    ARILCAddEditPage.getMediumWait(); //Wait for toggles to become enabled

    //Toggle Certificate to ON
    cy.get(
      ARILCAddEditPage.getElementByDataNameAttribute(
        ARCourseSettingsCompletionModule.getCertificateToggleContainer()
      ) +
      " " +
      ARILCAddEditPage.getToggleDisabled()
    ).click();

    //Select a Certificate File
    cy.get(
      ARCourseSettingsCompletionModule.getCertificateChooseFileBtn()
    ).click();
    cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(
      commonDetails.filePath + commonDetails.mooseFileName
    );
    cy.get(ARUploadFileModal.getChooseFileBtn()).click();
    ARUploadFileModal.getVShortWait();
    cy.get(ARUploadFileModal.getSaveBtn()).click();
    ARUploadFileModal.getLShortWait();

    //Open Enrollment Rules
    cy.get(
      ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn(
        "Enrollment Rules"
      )
    ).click();
    ARILCAddEditPage.getShortWait();

    //Select Allow Self Enrollment Specific Radio Button
    ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn(
      "All Learners"
    );

    //Publish Course
    cy.publishCourseAndReturnId().then((id) => {
      commonDetails.courseID = id.request.url.slice(-36);
    });
  });

  it("Enroll sessions to users", () => {
    cy.get(
      ARDashboardPage.getElementByAriaLabelAttribute(
        ARDashboardPage.getARLeftMenuByLabel("Users")
      )
    ).click();
    cy.wrap(ARDashboardPage.getMenuItemOptionByName("Users"));
    cy.intercept("/api/rest/v2/admin/reports/users/operations")
      .as("getUsers")
      .wait("@getUsers");

    for (i = 0; i < userNames.length; i++) {
      cy.wrap(ARUserPage.AddFilter("Username", "Equals", userNames[i]));
      cy.wrap(ARUserPage.selectTableCellRecord(userNames[i]))
      cy.wrap(
        ARUserPage.WaitForElementStateToChange(
          ARUserPage.getAddEditMenuActionsByName("Enroll User"),
          1000
        )
      );
      cy.get(ARUserPage.getAddEditMenuActionsByName("Enroll User")).click();
      cy.get(
        ARUserPage.getElementByDataNameAttribute(
          AREnrollUsersPage.getEnrollUsersAddCourseBtn()
        )
      ).click();
      //Search and select course 
      ARSelectModal.SearchAndSelectFunction([ilcDetails.courseName])
      //Select session from drop down
      ARILCMarkUserInActivePage.getSelectILCSessionWithinCourse(ilcDetails.courseName, sessionNames[i]);
      cy.wrap(AREnrollUsersPage.WaitForElementStateToChange(AREnrollUsersPage.getSaveBtn()), 1000)
      cy.get(AREnrollUsersPage.getSaveBtn()).click();
      AREnrollUsersPage.getMediumWait();
      cy.get(AREnrollUsersPage.getElementByAriaLabelAttribute(AREnrollUsersPage.getRemoveBtn())).click()
    }


  });
  it('Mark Completion', () => {
    cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click();
    cy.wrap(ARDashboardPage.getMenuItemOptionByName("Sessions"))
    // cy.intercept('/Admin/InstructorLedCourseSessions/DefaultGridActionsMenu').as('getILCSession').wait('@getILCSession')
    for (i = 0; i < userNames.length; i++) {
      ARILCSessionReportPage.A5AddFilter('Session', 'Starts With', sessionNames[i]);
      ARILCSessionReportPage.selectA5TableCellRecord(sessionNames[i]);
      //Select Mark Attendance Button for Course Completion 
      ARILCSessionReportPage.getA5AddEditMenuActionsByNameThenClick('Mark Attendance');
      ARILCSessionReportPage.getShortWait();
      cy.get(ARILCMarkUserInActivePage.getCheckBoxForLearner()).click();
      if (i == 2) {
        cy.get(ARILCMarkUserInActivePage.getCheckBoxForRLearner()).click()
      }
      cy.get(ARILCSessionReportPage.getA5SaveBtn()).click()
      cy.get(ARILCSessionReportPage.getElementByTitleAttribute(ARILCSessionReportPage.getRemoveBtn())).should('be.visible').click()
    }
  })
  it('Mark Absent for learners', () => {
    cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click();
    cy.wrap(ARDashboardPage.getMenuItemOptionByName("Sessions"))
    for (i = 0; i < userNames.length; i++) {
      ARILCSessionReportPage.A5AddFilter('Session', 'Starts With', sessionNames[i]);
      ARILCSessionReportPage.selectA5TableCellRecord(sessionNames[i]);
      //Select Mark Attendance Button for Course Completion 
      ARILCSessionReportPage.getA5AddEditMenuActionsByNameThenClick('Mark Attendance');
      ARILCSessionReportPage.getShortWait();
      cy.get(ARILCMarkUserInActivePage.getCheckBoxForAbsent()).first().click();

      cy.get(ARILCSessionReportPage.getA5SaveBtn()).click()
      cy.get(ARILCSessionReportPage.getElementByTitleAttribute(ARILCSessionReportPage.getRemoveBtn())).should('be.visible').click()

    }

  })
  it("Validate certificate", () => {
    cy.get(
      ARDashboardPage.getElementByAriaLabelAttribute(
        ARDashboardPage.getARLeftMenuByLabel("Users")
      )
    ).click();
    cy.wrap(ARDashboardPage.getMenuItemOptionByName("Users"));
    ARUserPage.getVLongWait()

    for (i = 0; i < userNames.length; i++) {
      //Validate course completion and Enrollment date 
      cy.wrap(ARUserPage.AddFilter('Username', 'Contains', userNames[i]));
      cy.get(ARUserPage.getTableCellRecord(userNames[i])).first().click()
      //Select User Transcript Button 
      cy.wrap(ARUserPage.WaitForElementStateToChange(ARUserPage.getAddEditMenuActionsByName('User Transcript'), 1000))
      cy.get(ARUserPage.getAddEditMenuActionsByName('User Transcript')).click({ force: true })
      cy.intercept('/api/rest/v2/admin/reports/credit-types/operations').as('getUserTranscript').wait('@getUserTranscript')
      //Validate user Taranscript Page header
      cy.get(ARUserTranscriptPage.getElementByDataNameAttribute(ARUserTranscriptPage.getTranscriptPageTitle())).should('have.text', 'User Transcript')
      //Validate Certificate Image availability
      cy.get(ARUserTranscriptPage.getCertificateImage()).should('exist')
      //Validate course name against certificate 
      cy.get(ARUserTranscriptPage.getCertificateName()).should('contain', ilcDetails.courseName)
      ARILCMarkUserInActivePage.getEnrollAndCompletionDate()
      //Select back button 
      cy.get(ARUserTranscriptPage.getBackIconBtn()).click()
      cy.get(ARUserPage.getElementByAriaLabelAttribute(ARUserPage.getRemoveBtn())).click()

    }
  })

});
