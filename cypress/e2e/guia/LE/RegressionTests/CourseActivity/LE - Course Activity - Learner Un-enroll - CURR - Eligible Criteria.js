import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage";
import LESideMenu from "../../../../../../helpers/LE/pageObjects/Menu/LESideMenu";
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage";
import LECourseLessonPlayerPage from "../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage";
import LECourseDetailsCurrModule from "../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsCurrModule";
import LECourseDetailsOCModule from "../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule";
import LELearnerUnenrollModal from "../../../../../../helpers/LE/pageObjects/Modals/LELearnerUnenroll.modal";
import LEFilterMenu from "../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu";
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { courses } from "../../../../../../helpers/TestData/Courses/courses";

describe("LE - Course Activity - Learner Un-enroll - CURR - Eligible Criteria", function () {
  before(function () {
    cy.createUser(void 0, userDetails.username, ["Learner"], void 0);
  });

  after(function () {
    //Cleanup - Get userID and delete them
    cy.get(LEDashboardPage.getNavProfile()).click();
    cy.get(LEProfilePage.getViewSocialProfileBtn()).click();
    cy.url().then((currentURL) => {
      cy.deleteUser(currentURL.slice(-36));
    });
  });
  
  beforeEach(() => {
    //Login and go to the course before each test
    cy.apiLoginWithSession(userDetails.username, userDetails.validPassword);
    cy.get(LEDashboardPage.getNavMenu()).click();
    LESideMenu.getLEMenuItemsByNameThenClick("Catalog");
    LEFilterMenu.SearchForCourseByName(courses.curr_01_learner_unenroll_name);
    LEFilterMenu.getMediumWait();
    LEDashboardPage.getCourseCardBtnThenClick(
      courses.curr_01_learner_unenroll_name
    );
    LEFilterMenu.getShortWait();
  });

  it("Verify a user can Unenroll from a Curricula in the Not Started status", () => {
    cy.get(LECourseDetailsCurrModule.getCourseCardName())
      .contains(courses.curr_01_learner_unenroll_name)
      .click();
    cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {
      timeout: 10000,
    }).should("not.exist");
    cy.get(LECourseDetailsCurrModule.getOverflowMenuBtn())
      .should("be.visible")
      .click();
    LECourseDetailsCurrModule.getOverflowMenuOptThenClick(
      "Unenroll from Course"
    );
    cy.get(LELearnerUnenrollModal.getUnenrollBtn()).click();
    cy.get(LECourseDetailsCurrModule.getToastNotificationMsg()).should(
      "contain",
      "Unenrolled successfully."
    );
    cy.get(LECourseDetailsCurrModule.getToastNotificationMsg()).should(
      "not.be.visible"
    );
    LEFilterMenu.SearchForCourseByName(courses.curr_01_learner_unenroll_name);
    LEFilterMenu.getMediumWait();
    cy.get(LEDashboardPage.getCourseCardName()).should("not.exist");
  });

  it("Verify a user can Unenroll from a Curricula in the In Progress status", () => {
    LEFilterMenu.getMediumWait();
    cy.get(LECourseDetailsCurrModule.getCourseCardName())
      .contains(courses.curr_01_learner_unenroll_name)
      .click();
    cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {
      timeout: 10000,
    }).should("not.exist");
    LECourseDetailsCurrModule.getMediumWait();
    LECourseDetailsCurrModule.getCurrCourseActionBtnThenClick(
      "Group 1",
      courses.curr_filter_01_oc_child_01,
      "Enroll"
    );
    LECourseDetailsCurrModule.getCurrCourseActionBtnThenClick(
      "Group 1",
      courses.curr_filter_01_oc_child_01,
      "Start"
    );
    LECourseDetailsOCModule.getMediumWait();
    LECourseDetailsOCModule.getCourseLessonActionBtn("Quiz 1", "Start", true);
    LECourseDetailsOCModule.getVLongWait(); //Wait for quiz to load
    cy.get(LECourseLessonPlayerPage.getCloseBtn()).click();
    LECourseDetailsOCModule.getMediumWait(); //2s delay when closing lesson
    cy.get(LECourseDetailsOCModule.getCourseProgressStatusText()).should(
      "contain",
      "In Progress", {timeout: 10000}
    );
    cy.get(LECourseDetailsOCModule.getBacktoCurrDetailsBtn()).click();
    LECourseDetailsOCModule.getMediumWait();
    cy.get(LECourseDetailsCurrModule.getCourseProgressStatusText()).should(
      "contain",
      "In Progress", {timeout: 10000}
    );
    cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {
      timeout: 10000,
    }).should("not.exist");
    cy.get(LECourseDetailsCurrModule.getOverflowMenuBtn())
      .should("be.visible")
      .click();
    LECourseDetailsCurrModule.getOverflowMenuOptThenClick(
      "Unenroll from Course"
    );
    cy.get(LELearnerUnenrollModal.getUnenrollBtn()).click();
    cy.get(LECourseDetailsCurrModule.getToastNotificationMsg()).should(
      "contain",
      "Unenrolled successfully."
    );
    cy.get(LECourseDetailsCurrModule.getToastNotificationMsg()).should(
      "not.be.visible"
    );
    LEFilterMenu.SearchForCourseByName(courses.oc_lesson_act_ssta_name);
    LEFilterMenu.getMediumWait();
    cy.get(LEDashboardPage.getCourseCardName()).should("not.exist");
  });
});
