import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage";
import LESideMenu from "../../../../../../helpers/LE/pageObjects/Menu/LESideMenu";
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage";
import LECourseLessonPlayerPage from "../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage";
import LECourseDetailsCURRModule from "../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsCurrModule";
import LECourseDetailsOCModule from "../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule";
import LEFilterMenu from "../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu";
import LEShoppingPage from "../../../../../../helpers/LE/pageObjects/ECommerce/LEShoppingPage";
import LEInvoicePage from "../../../../../../helpers/LE/pageObjects/ECommerce/LEInvoicePage";
import LEAccountPage from "../../../../../../helpers/LE/pageObjects/ECommerce/LEAccountPage";
import arDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import arEnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage";
import arUserUnEnrollModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUserUnEnrollModal'
import arUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage";
import arEditActivityPage from "../../../../../../helpers/AR/pageObjects/Enrollment/AREditActivityPage";
import arSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal";
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { courses } from "../../../../../../helpers/TestData/Courses/courses";
import ARUserEnrollmentPage from "../../../../../../helpers/AR/pageObjects/User/ARUserEnrollmentPage";


describe("LE - Course Activity - Learner Un-enroll - CURR - Admin Side", function () {
  before(function () {
    cy.createUser(void 0, userDetails.username, ["Learner"], void 0);
  });

  beforeEach(function () {
    cy.apiLoginWithSession(
      users.sysAdmin.admin_sys_01_username,
      users.sysAdmin.admin_sys_01_password,
      "/admin"
    );
    arDashboardPage.getUserEnrollmentsReport()
    cy.wrap(arEnrollUsersPage.EnrollmentPageFilter(userDetails.username)); 
  it("Admin - Enroll in CURR via Admin", () => {
    cy.wrap(
      arEnrollUsersPage.WaitForElementStateToChange(
        arEnrollUsersPage.getAddEditMenuActionsByName("Add Enrollment")
      ),
      1000
    );
    cy.get(arEnrollUsersPage.getAddEditMenuActionsByName("Add Enrollment")).should('have.attr','aria-disabled','false').click();
    cy.get(
      arUserPage.getElementByDataNameAttribute(
        arEnrollUsersPage.getEnrollUsersAddCourseBtn()
      )
    ).click();
    cy.wrap(
      arSelectModal.SearchAndSelectFunction([
        courses.curr_filter_01_name,
      ])
    );
    cy.wrap(
      arEnrollUsersPage.WaitForElementStateToChange(
        arEnrollUsersPage.getSaveBtn()
      ),
      1000
    );
    cy.get(arEnrollUsersPage.getSaveBtn()).click();
    cy.get(arDashboardPage.getToastSuccessMsg()).should('be.visible')
  });
});

describe("LE - Course Activity - Learner Un-enroll - CURR - Ineligible Criteria", function () {
  beforeEach(() => {
    //Login and go to the course before each test
    cy.apiLoginWithSession(userDetails.username, userDetails.validPassword);
    cy.get(LEDashboardPage.getNavMenu()).click();
    LESideMenu.getLEMenuItemsByNameThenClick("Catalog");
  });
  it("Verify a user cannot Unenroll from an CURR enrolled by Admin", () => {
    LEFilterMenu.SearchForCourseByName(courses.curr_filter_01_name);
    LEFilterMenu.getMediumWait();
    cy.get(LEDashboardPage.getLEWaitSpinner()).should('not.exist', { timeout: 10000 })
    LEDashboardPage.getSpecificCourseCardBtnThenClick(
      courses.curr_filter_01_name
    );
    LEFilterMenu.getShortWait();
    cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {
      timeout: 10000,
    }).should("not.exist");
    cy.get(LECourseDetailsCURRModule.getOverflowMenuBtn()).should("not.exist");
    cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click();
    LESideMenu.getLEMenuItemsByNameThenClick("Catalog");
  
    LEFilterMenu.SearchForCourseByName(courses.curr_filter_01_name);
    LEFilterMenu.getMediumWait();
    cy.get(LEDashboardPage.getLEWaitSpinner()).should('not.exist', { timeout: 10000 })
    cy.get(LEDashboardPage.getCourseCardName()).should("exist");
  });
  it("Enroll in an CURR from Learner side to be set to Not Completed by Admin", () => {
    LEFilterMenu.SearchForCourseByName(courses.curr_01_learner_unenroll_name);
    LEFilterMenu.getMediumWait();
    cy.get(LEDashboardPage.getLEWaitSpinner()).should('not.exist', { timeout: 10000 })
    LEFilterMenu.getShortWait()
    LEDashboardPage.getSpecificCourseCardBtnThenClick(courses.curr_01_learner_unenroll_name)
    LEFilterMenu.getMediumWait();
    LEDashboardPage.getSpecificCourseCardBtnThenClick(
      courses.curr_01_learner_unenroll_name
    );
    cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {
      timeout: 10000,
    }).should("not.exist");
  });
});
describe("LE - Course Activity - Learner Un-enroll - CURR Ineligible - Admin Side 2", () => {

  it("Admin - Unenroll from initial course and set second enrollment to Not Completed", () => {
    //Unenroll from initial course
    cy.apiLoginWithSession(
      users.sysAdmin.admin_sys_01_username,
      users.sysAdmin.admin_sys_01_password,
      "/admin"
    );
    arDashboardPage.getUserEnrollmentsReport()
    cy.wrap(arEnrollUsersPage.EnrollmentPageFilter(userDetails.username)); 
    cy.wrap(
      arEnrollUsersPage.selectTableCellRecordByIndexAndName(
        courses.curr_filter_01_name,2
      )
    );
    cy.wrap(
      arEnrollUsersPage.WaitForElementStateToChange(
        arEnrollUsersPage.getAddEditMenuActionsByName("Un-enroll User")
      ),
      1000
    );
    cy.get(
      arEnrollUsersPage.getAddEditMenuActionsByName("Un-enroll User")
    ).click();
    cy.wrap(arUserPage.WaitForElementStateToChange(arUserUnEnrollModal.getOKBtn()), arEnrollUsersPage.getShortWait())
        cy.get(arUserUnEnrollModal.getOKBtn()).click()
        cy.wrap(arUserPage.getLShortWait())
        //set second enrollment to Not Completed
        cy.wrap(
       arEnrollUsersPage.selectTableCellRecordByIndexAndName(
        courses.curr_01_learner_unenroll_name,2
       )
        );
        cy.wrap(
          arEnrollUsersPage.WaitForElementStateToChange(
            arEnrollUsersPage.getAddEditMenuActionsByName("Edit Enrollment")
          ),
          1000
        );
        cy.get(
          arEnrollUsersPage.getAddEditMenuActionsByName("Edit Enrollment")
        ).click();
        cy.wrap(arEditActivityPage.getMarkEnrollmentAsRadioBtn("Not Completed"));
        cy.wrap(
          arEnrollUsersPage.WaitForElementStateToChange(
            arEnrollUsersPage.getSaveBtn()
          ),
          1000
        );
        cy.get(arEnrollUsersPage.getSaveBtn()).click();
        cy.get(arDashboardPage.getToastSuccessMsg()).should('be.visible')
      });

})

describe("LE - Course Activity - Learner Un-enroll - CURR - Ineligible Criteria", function () {
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
  });

  it("Verify a user cannot Unenroll from an CURR in the Not Completed status", () => {
    LEFilterMenu.SearchForCourseByName(courses.curr_01_learner_unenroll_name);
    LEFilterMenu.getLongWait();
    cy.get(LEDashboardPage.getLEWaitSpinner()).should('not.exist', {timeout:10000})
    LEDashboardPage.getSpecificCourseCardBtnThenClick(
      courses.curr_01_learner_unenroll_name
    );
    LEFilterMenu.getShortWait();
    cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {
      timeout: 10000,
    }).should("not.exist");
    cy.get(LECourseDetailsCURRModule.getOverflowMenuBtn()).should("not.exist");
    cy.get(LEDashboardPage.getNavMenu()).click();
    LESideMenu.getLEMenuItemsByNameThenClick("Catalog");
    LEFilterMenu.SearchForCourseByName(courses.curr_01_learner_unenroll_name);
    LEFilterMenu.getLongWait();
    cy.get(LEDashboardPage.getLEWaitSpinner()).should('not.exist', {timeout:10000})
    cy.get(LEDashboardPage.getCourseCardName()).should("exist");
  });
  it("Enroll in an CURR which has Ecomm enabled", () => {
    LEFilterMenu.SearchForCourseByName(courses.curr_ecomm_free_course_01_name);
    LEFilterMenu.getLongWait();
    cy.get(LEDashboardPage.getLEWaitSpinner()).should('not.exist', {timeout:10000})
    LEDashboardPage.getSpecificCourseCardBtnThenClick(
      courses.curr_ecomm_free_course_01_name
    );
    LEFilterMenu.getShortWait();
    LEDashboardPage.getSpecificCourseCardBtnThenClick(
      courses.curr_ecomm_free_course_01_name
    );
    cy.get(LEShoppingPage.getCheckoutBtn()).should("be.visible").click();
    LEAccountPage.getShortWait();
    cy.get(LEAccountPage.getCheckoutBtn()).should("be.visible").click();
    cy.get(LEAccountPage.getProceedToCheckoutBtn()).click();
    cy.get(LEInvoicePage.getOrderCompletedHeader()).should(
      "contain",
      "Order Completed!"
    );
  });

  it("Verify a user cannot Unenroll from an CURR which has Ecomm enabled", () => {
    LEFilterMenu.SearchForCourseByName(courses.curr_ecomm_free_course_01_name);
    LEFilterMenu.getLongWait();
    cy.get(LEDashboardPage.getLEWaitSpinner()).should('not.exist', {timeout:10000})
    LEDashboardPage.getSpecificCourseCardBtnThenClick(
      courses.curr_ecomm_free_course_01_name
    );
    LEFilterMenu.getLongWait();
    cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {
      timeout: 10000,
    }).should("not.exist");
    cy.get(LECourseDetailsCURRModule.getOverflowMenuBtn()).should("not.exist");
    cy.get(LEDashboardPage.getNavMenu()).click();
    LESideMenu.getLEMenuItemsByNameThenClick("Catalog");
    LEFilterMenu.SearchForCourseByName(courses.curr_ecomm_free_course_01_name);
    LEFilterMenu.getLongWait();
    cy.get(LEDashboardPage.getLEWaitSpinner()).should('not.exist', {timeout:10000})
    cy.get(LEDashboardPage.getCourseCardName()).should("exist");
  });

  it("Verify a user cannot Unenroll from an CURR which is set to Mandatory", () => {
    LEFilterMenu.SearchForCourseByName(courses.curr_01_mandatory_name);
    LEFilterMenu.getLongWait();
    LEDashboardPage.getSpecificCourseCardBtnThenClick(courses.curr_01_mandatory_name);
    LEFilterMenu.getShortWait();
    LEDashboardPage.getSpecificCourseCardBtnThenClick(courses.curr_01_mandatory_name);
    cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {
      timeout: 10000,
    }).should("not.exist");
    cy.get(LECourseDetailsCURRModule.getOverflowMenuBtn()).should("not.exist");
    cy.get(LEDashboardPage.getNavMenu()).click();
    LESideMenu.getLEMenuItemsByNameThenClick("Catalog");
    LEFilterMenu.SearchForCourseByName(courses.curr_01_mandatory_name);
    LEFilterMenu.getLongWait();
    cy.get(LEDashboardPage.getLEWaitSpinner()).should('not.exist', {timeout:10000})
    cy.get(LEDashboardPage.getCourseCardName()).should("exist");
  });
  it("Enroll in a Curricula then Complete", () => {
    LEFilterMenu.getMediumWait();
    LEFilterMenu.SearchForCourseByName(courses.curr_filter_01_name);
    LEFilterMenu.getLongWait();
    cy.get(LEDashboardPage.getLEWaitSpinner()).should('not.exist', {timeout:10000})
    LEDashboardPage.getSpecificCourseCardBtnThenClick(courses.curr_filter_01_name);
    LEFilterMenu.getMediumWait();
    cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {
      timeout: 10000,
    }).should("not.exist");
    LECourseDetailsCURRModule.getMediumWait();
    LECourseDetailsCURRModule.getCurrCourseActionBtnThenClick(
      "Group 1",
      courses.curr_filter_01_oc_child_01,
      "Enroll"
    );
    LECourseDetailsCURRModule.getCurrCourseActionBtnThenClick(
      "Group 1",
      courses.curr_filter_01_oc_child_01,
      "Start"
    );
    LECourseDetailsOCModule.getMediumWait();
    LECourseDetailsOCModule.getCourseLessonActionBtn("Quiz 1", "Start", true);
    LECourseDetailsOCModule.getLongWait()
    LECourseLessonPlayerPage.getIframeLessonPlayerElementandClick(LECourseLessonPlayerPage.getQuestionContainer(), LECourseLessonPlayerPage.getElementByAriaLabelAttribute(1))
    LECourseLessonPlayerPage.getIframeLessonPlayerElementandClick(LECourseLessonPlayerPage.getQuestionContainer(), LECourseLessonPlayerPage.getSubmitResponseBtn())
    LECourseDetailsOCModule.getLShortWait()
    cy.get(LECourseLessonPlayerPage.getCloseBtn()).click();
    cy.get(LECourseDetailsOCModule.getCourseProgressStatusText()).should(
      "contain",
      "Complete"
    );
  })
    it("Verify a user cannot Unenroll from a Curricula in the Complete status", () => {
      LEFilterMenu.getMediumWait();

      LEFilterMenu.SearchForCourseByName(courses.curr_filter_01_name);
      LEFilterMenu.getLongWait();
      cy.get(LEDashboardPage.getLEWaitSpinner()).should('not.exist', {timeout:10000})
      LEDashboardPage.getSpecificCourseCardBtnThenClick(courses.curr_filter_01_name);
      LEFilterMenu.getMediumWait();
    LECourseDetailsOCModule.getMediumWait();
    cy.get(LECourseDetailsCURRModule.getCourseProgressStatusText()).should(
      "contain",
      "Complete"
    );
    cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {
      timeout: 10000,
    }).should("not.exist");
    cy.get(LECourseDetailsCURRModule.getOverflowMenuBtn()).should("not.exist");
    cy.get(LEDashboardPage.getNavMenu()).click();
    LESideMenu.getLEMenuItemsByNameThenClick("Catalog");
    LEFilterMenu.SearchForCourseByName(courses.curr_filter_01_name);
    LEFilterMenu.getLongWait();
    cy.get(LEDashboardPage.getLEWaitSpinner()).should('not.exist', {timeout:10000})
    cy.get(LEDashboardPage.getCourseCardName()).should("exist");
  });
})
})
