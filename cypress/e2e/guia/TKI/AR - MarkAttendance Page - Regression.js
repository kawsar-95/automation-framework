import ARILCAddEditPage from "../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage";
import ARAddMoreCourseSettingsModule from "../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module";
import ARCourseSettingsEnrollmentRulesModule from "../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module";
import ARDashboardPage from "../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARBasePage from "../../../../helpers/AR/ARBasePage";
import AREditActivityPage from "../../../../helpers/AR/pageObjects/Enrollment/AREditActivityPage";
import ARDeleteModal from "../../../../helpers/AR/pageObjects/Modals/ARDeleteModal";
import ARCourseEvaluationReportPage from "../../../../helpers/AR/pageObjects/Reports/ARCourseEvaluationReportPage";
import AREnrollUsersPage from "../../../../helpers/AR/pageObjects/User/AREnrollUsersPage";
import ARUserEnrollmentPage from "../../../../helpers/AR/pageObjects/User/ARUserEnrollmentPage";
import { commonDetails } from "../../../../helpers/TestData/Courses/commonDetails";
import { ilcDetails, sessions } from "../../../../helpers/TestData/Courses/ilc";
import { reports } from "../../../../helpers/TestData/Reports/reports";
import { userDetails } from "../../../../helpers/TestData/users/UserDetails";
import { users } from "../../../../helpers/TestData/users/users";
import arAddMoreCourseSettingsModule from '../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsCompletionModule from '../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import ARILCMarkUserInActivePage from "../../../../helpers/AR/pageObjects/Courses/ILC/ARILCMarkUserInActivePage";
import ARSelectModal from "../../../../helpers/AR/pageObjects/Modals/ARSelectModal";
import ARILCActivityReportPage from "../../../../helpers/AR/pageObjects/Reports/ARILCActivityReportPage";
import ARILCEditActivityPage from '../../../../helpers/AR/pageObjects/Courses/ILC/ARILCEditActivityPage';
import ARBillboardsAddEditPage from '../../../../helpers/AR/pageObjects/Billboards/ARBillboardsAddEditPage';
import AdminNavationModuleModule from '../../../../helpers/AR/modules/AdminNavationModule.module'
import ARUserAddEditPage from "../../../../helpers/AR/pageObjects/User/ARUserAddEditPage";

describe('ILC - Mark Attendance - Allow Failure-5158', () => {
      before(() => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
      })

      beforeEach(() => {
        // Login as a Blatant Admin , System Admin,Dept Admin, Group Admin and Admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
      })
   
  after(() => {
    cy.deleteCourse(commonDetails.courseID, "instructor-led-courses-new")

    ARDashboardPage.deleteUsers([userDetails.username])
  })
    
  it('Create ILC Course', () => {
   
   // Navigate to Courses report in the Left Panel .
    cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Courses")).click()
    cy.wrap(ARDashboardPage.getMenuItemOptionByName("Courses"))
     
    // Navigate to Courses report in the Left Panel.
    ARDashboardPage.getCoursesReport()
    
    // Create an ILC Course A with Session A
    cy.createCourse("Instructor Led", ilcDetails.courseName, false)
    ARILCAddEditPage.addSessionForTheFuture()

    //Select Allow Self Enrollment Specific Radio Button
    ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn("All Learners")
    cy.wait(2000)

    //Open Completion Section
    cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
    ARILCAddEditPage.getMediumWait() //Wait for toggles to become enabled

    //Toggle Allow Failure to ON
    ARUserAddEditPage.generalToggleSwitch('true',ARCourseSettingsCompletionModule.getAllowFailureToggleContainer())
       
    //Publish Course
    cy.publishCourseAndReturnId().then((id) => {
      commonDetails.courseID = id.request.url.slice(-36);
    });
    ARDashboardPage.getLongWait()

  })



  it('Enroll users to sessions', () => {

    // Navigate to the Users report from the Left panel
    ARDashboardPage.getUsersReport()

    ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
    ARDashboardPage.getMediumWait()
    
    cy.get(ARDashboardPage.getGridTable()).contains(userDetails.username).click()
    
    ARDashboardPage.getMediumWait()

    // Enroll two Learners 'Learner ' to the ILC Course Session 
    cy.get(ARDashboardPage.getAddEditMenuActionsByName('Enroll User')).click()
    ARDashboardPage.getMediumWait()
    cy.get(ARDashboardPage.getElementByDataNameAttribute('add-course')).click()
    cy.wrap(ARSelectModal.SearchAndSelectFunction([ilcDetails.courseName]))
    ARILCMarkUserInActivePage.getSelectILCSessionWithinCourseAtt(ilcDetails.courseName, sessions.futuresessionName)
    cy.get(AREnrollUsersPage.getSaveBtn()).click()
    ARDashboardPage.getLongWait()

})
  it('Make Changes to the Edit Activity Page', () => {

    cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
    cy.wrap(ARDashboardPage.getMenuItemOptionByName('ILC Activity'))
    ARDashboardPage.getMediumWait()
    cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'ILC Activity')

    // Choose Course In ILC Activity 
    ARILCActivityReportPage.courseFilter(ilcDetails.courseName)
    ARDashboardPage.getMediumWait()

    // Filter User name 
    ARDashboardPage.AddFilter('Username', 'Equals', userDetails.username)

    // Select Session
    ARDashboardPage.getMediumWait()
    ARDashboardPage.selectA5TableCellRecord(sessions.futuresessionName)
    ARDashboardPage.getMediumWait()

    // Navigate to Mark Attendence
    cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit Activity')).click()
    ARDashboardPage.getMediumWait()
    cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Edit Activity')

    // Mark ILC Activity as Failed 

    cy.get(ARILCEditActivityPage.getMarkAsRadioBtn()).contains(/^Failed$/).click().click() //Do regex for exact text match here

    cy.get(ARDashboardPage.getSaveBtn()).click()
    ARDashboardPage.getMediumWait()


    // Changes are saved successfully and admin user gets redirected to the ILC Activity page
    cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'ILC Activity')
})

it('ILC Session - Mark Attendance ', () => {
  //Navigate to ILC Session
  ARDashboardPage.getLongWait()
  cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Reports')).click()
  // Click on ILC Sessions button
  cy.wrap(ARDashboardPage.getMenuItemOptionByName('ILC Sessions'))
  ARDashboardPage.getLongWait()
  //Filter for ILC Course
  ARDashboardPage.A5AddFilter('Course', 'Contains', ilcDetails.courseName)
  ARDashboardPage.getLongWait()
  // Select Existing  Session 
  cy.get(ARDashboardPage.getGridTable()).eq(0).click()
  ARDashboardPage.getMediumWait()
  // Verify that [Mark Attendance"] Page opens for selected Session
  cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).should('contain', 'Mark Attendance')
  cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click()
  ARDashboardPage.getLongWait()
  cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Mark Attendance')

})


})
