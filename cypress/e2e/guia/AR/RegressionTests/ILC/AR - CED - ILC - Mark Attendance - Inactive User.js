import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage";
import ARILCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage";
import ARILCMarkUserInActivePage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCMarkUserInActivePage";
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module";
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal";
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage";
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails";
import { ilcDetails, sessions } from "../../../../../../helpers/TestData/Courses/ilc";
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails";
import { users } from "../../../../../../helpers/TestData/users/users";
import defaultTestData from '../../../../../fixtures/defaultTestData.json'

function addSessionForTheFuture() {
  /** Add session for future */
  cy.get(ARILCAddEditPage.getAddSessionBtn()).click()

  //Set future title
  cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false').clear().type(sessions.futuresessionName)
  ARILCAddEditPage.getStartDatePickerBtnThenClick()
  ARILCAddEditPage.getSelectDate(sessions.date1)
  ARILCAddEditPage.getEndDatePickerBtnThenClick()
  ARILCAddEditPage.getSelectDate(sessions.date1)

  cy.get(ARILCAddEditPage.getEndDateTimeBtn()).click()
  ARILCAddEditPage.SelectTime("03", "00", "PM");
  cy.get(ARILCAddEditPage.getDateTimeLabel()).contains("Class End Date and Time").click(); //hide timepicker

  //Set Timezone
  cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneDDown()).click()
  cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneTxtF()).first().type("(UTC+06:00) Dhaka");

  cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneDDownOpt()).contains("(UTC+06:00) Dhaka").click();

  //Save ILC Session
  cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click({ force: true });
  ARILCAddEditPage.getLShortWait();
}

describe('C5157 - Mark Attendance - Inactive User', () => {
  before(() => {
    cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    cy.createUser(void 0, userDetails.username2, ["Learner"], void 0)
  })

  beforeEach(() => {
    // Login as a Blatant Admin , System Admin,Dept Admin, Group Admin and Admin
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
  })

  after(() => {
    cy.deleteCourse(commonDetails.courseID, "instructor-led-courses-new")

    ARDashboardPage.deleteUsers([userDetails.username, userDetails.username2])
  })

  it('Create ILC Course', () => {
    ARDashboardPage.getMediumWait()
    // Navigate to Courses report in the Left Panel .
    cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Courses")).click()
    cy.wrap(ARDashboardPage.getMenuItemOptionByName("Courses"))
    cy.intercept("/api/rest/v2/admin/reports/courses/operations").as("getCourses").wait("@getCourses")

    // Create an ILC Course A with Session A
    cy.createCourse("Instructor Led", ilcDetails.courseName, false)
    addSessionForTheFuture()

    //Select Allow Self Enrollment Specific Radio Button
    ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn("All Learners")
    
    //Publish Course
    cy.publishCourseAndReturnId().then((id) => {
      commonDetails.courseID = id.request.url.slice(-36);
    });
    ARDashboardPage.getLongWait()
  })

  it('Enroll sessions to users', () => {
    ARDashboardPage.getMediumWait()
    // Navigate to the Users report from the Left panel
    cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Users")).click()
    cy.wrap(ARDashboardPage.getMenuItemOptionByName("Users"))
    cy.intercept("/api/rest/v2/admin/reports/users/operations").as("getUsers").wait("@getUsers")

    ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
    ARDashboardPage.getMediumWait()
    ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username2)
    ARDashboardPage.getMediumWait()

    cy.get(ARDashboardPage.getGridTable()).eq(0).click()
    cy.get(ARDashboardPage.getGridTable()).eq(1).click()
    ARDashboardPage.getMediumWait()

    // Enroll two Learners 'Learner 1' and 'Learner 2' to the ILC Course Session 
    cy.get(ARDashboardPage.getAddEditMenuActionsByName('Enroll Users')).click()
    ARDashboardPage.getMediumWait()
    cy.get(ARDashboardPage.getElementByDataNameAttribute('add-course')).click()
    cy.wrap(ARSelectModal.SearchAndSelectFunction([ilcDetails.courseName]))
    ARILCMarkUserInActivePage.getSelectILCSessionWithinCourse(ilcDetails.courseName, sessions.futuresessionName)
    cy.get(AREnrollUsersPage.getSaveBtn()).click()
    ARDashboardPage.getLongWait()

  })

  it('Inactive Learner 1', () => {
    ARDashboardPage.getMediumWait()
    //Navigate to user
    cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Users")).click()
    cy.wrap(ARDashboardPage.getMenuItemOptionByName("Users"))
    cy.intercept("/api/rest/v2/admin/reports/users/operations").as("getUsers").wait("@getUsers")

    // Search for Learner 1
    ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
    ARDashboardPage.getMediumWait()

    cy.get(ARDashboardPage.getGridTable()).eq(0).click()
    ARDashboardPage.getMediumWait()
    // Edit User
    cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit User')).click()
    ARDashboardPage.getLongWait()

    // Make the Learner 1 Inactive
    cy.get(ARDashboardPage.getElementByDataNameAttribute('enable-label')).contains('Active').click()
    cy.get(ARDashboardPage.getElementByDataNameAttribute('submit')).click()
    ARDashboardPage.getLongWait()
  })
  
  it('Check only learner 2 shows in ILC session', () => {
    ARDashboardPage.getMediumWait()
    // Navigate to the ILC Sessions report
    cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
    cy.wrap(ARDashboardPage.getMenuItemOptionByName("ILC Sessions"))
    ARDashboardPage.getMediumWait()
    ARDashboardPage.A5AddFilter('Course', 'Contains', ilcDetails.courseName)
    ARDashboardPage.getMediumWait()
    cy.get(ARDashboardPage.getGridTable()).eq(0).click()
    ARDashboardPage.getMediumWait()

    // Select the Session A for ILC Course A and click 'Mark Attendance' Button in the Right hand Action Buttons
    cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click()
    ARDashboardPage.getMediumWait()

    // Only learner 2 should be Visible in the Mark Attendance Page
    cy.get(ARDashboardPage.getGridTable()).should('contain', defaultTestData.USER_LEARNER_FNAME)
    ARDashboardPage.getMediumWait()
  })
})