import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsCourseUploadsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseUploads.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import LECatalogPage from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEFilterMenu from "../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { courseUploadSection, ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { images, resourcePaths } from "../../../../../../helpers/TestData/resources/resources"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import LECoursesPage from "../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage"
import LECourseDetailsModal from "../../../../../../helpers/LE/pageObjects/Modals/LECourseDetails.modal"

describe
  ('C6518 - Verify upload status on course upload report page when user already approved', () => {
    before(() => {
      cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
      cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
      ARDashboardPage.getMediumWait()
      LECatalogPage.turnOffNextgenToggle()
    })
    beforeEach(() => {
      //Login as learner
      cy.viewport(1260, 786)
      cy.apiLoginWithSession(
        users.sysAdmin.admin_sys_01_username,
        users.sysAdmin.admin_sys_01_password,
        '/admin'
      )
    })
    after(() => {
      //Delete course
      cy.deleteCourse(commonDetails.courseID);
      //Delete created user
      cy.visit('/admin')
      ARDashboardPage.getLongWait()
      //Click on users
      cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Users')).click()
      //Click on users
      cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
      cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
      ARDashboardPage.getMediumWait()
      ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
      ARDashboardPage.getMediumWait()
      cy.get(ARDashboardPage.getGridTable()).eq(0).click()
      ARDashboardPage.getMediumWait()
      cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete')).click()
      ARDashboardPage.getShortWait()
      cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
      ARDashboardPage.getMediumWait()
    })
    
    it('Create and publish course', () => {
      ARDashboardPage.getMediumWait()
      // Click on courses
      cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Courses")).click();
      // Click on courses
      cy.wrap(ARDashboardPage.getMenuItemOptionByName("Courses"));
      cy.intercept("/api/rest/v2/admin/reports/courses/operations")
        .as("getCourses")
        .wait("@getCourses");
      // Toggle on for status as active & Enter course Name and Description
      cy.createCourse('Online Course')
      //Allow self enrollment - all learners
      cy.get(
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentForm()
      ).within(() => {
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnLabel())
          .contains("All Learners")
          .click();
      });
      //Click on Course upload icon from header
      cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Course Uploads")).click();
      // Click on Add Upload button
      cy.get(ARCourseSettingsCourseUploadsModule.getAddUploadBtn()).click();
      // Enter label name 
      cy.get(ARCourseSettingsCourseUploadsModule.getLabelTxtF()).type(courseUploadSection.uploadLabel);
      // mark Approval as Administrator
      cy.get(ARCourseSettingsCourseUploadsModule.getApprovalRadioBtn())
        .contains(courseUploadSection.approvalTypes[3]).click()

      // Publish Course
      cy.publishCourseAndReturnId().then((id) => {
        commonDetails.courseID = id.request.url.slice(-36);
      });

    })
    it('Enroll Course to user', () => {
      ARDashboardPage.getMediumWait()
      //Click on users
      cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click({ force: true })
      //Click on users
      cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
      cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
      //Verify that Users page is open 
      cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Users')
      ARDashboardPage.getMediumWait()
      // Select on learner user
      ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
      ARDashboardPage.getMediumWait()
      cy.get(ARDashboardPage.getGridTable()).eq(0).click()
      ARDashboardPage.getLongWait()
      // Click on enroll user button
      cy.get(ARDashboardPage.getAddEditMenuActionsByName('Enroll User')).click()
      ARDashboardPage.getMediumWait()
      // Click on add course button
      cy.get(
        ARDashboardPage.getElementByDataNameAttribute(
          AREnrollUsersPage.getEnrollUsersAddCourseBtn()
        )
      ).click();
      //Search course name which is created in step 10 and select and click on choose.
      ARSelectModal.SearchAndSelectFunction([ocDetails.courseName])
      cy.wrap(AREnrollUsersPage.WaitForElementStateToChange(AREnrollUsersPage.getSaveBtn()), 2000)
      cy.get(AREnrollUsersPage.getSaveBtn()).click();
      ARDashboardPage.getVLongWait()
    })
    it('Impersonate User', () => {
      ARDashboardPage.getMediumWait()
      //Click on users
      cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Users')).click()
      //Click on users
      cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
      cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
      //Verify that Users page is open 
      cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Users')
      ARDashboardPage.getMediumWait()
      // Select on learner user
      ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
      ARDashboardPage.getMediumWait()
      cy.get(ARDashboardPage.getGridTable()).eq(0).click()
      ARDashboardPage.getLongWait()
      // Click on enroll user button
      cy.get(ARDashboardPage.getAddEditMenuActionsByName('Impersonate')).click()
      ARDashboardPage.getLongWait()
      LEDashboardPage.waitForLoader(LEDashboardPage.getLEEllipsesLoader())
      //Go to catalog page
      LEDashboardPage.getTileByNameThenClick('Catalog')
      LEDashboardPage.waitForLoader(LEDashboardPage.getLEEllipsesLoader())
      //Search for the course
      LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
      LEDashboardPage.waitForLoader(LEDashboardPage.getCoursesLoader())
      cy.get(ARDashboardPage.getElementByAriaLabelAttribute(`Start ${ocDetails.courseName}`)).click({ force: true })
      ARDashboardPage.getLongWait()
      LECoursesPage.getCoursesPageTabBtnByName('Uploads')
      cy.get(LECatalogPage.getCourseDiscoveryStartBtn()).click()
      LEDashboardPage.getMediumWait()
      cy.get(ARDashboardPage.getInputFileTxtF()).attachFile(resourcePaths.resource_image_folder + images.happy_qas_filename)
      ARDashboardPage.getVLongWait()
      LEDashboardPage.waitForLoader(LEDashboardPage.getLEEllipsesLoader())
      ARDashboardPage.getVLongWait()
      cy.get(LECourseDetailsModal.getCourseFileSaveBtn()).contains('Save').click()
      ARDashboardPage.getVLongWait()
    })
    it('Approve Course Upload', () => {
      ARDashboardPage.getMediumWait()
      //Navigate to course uploads
      cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Reports')).click()
      cy.wrap(ARDashboardPage.getMenuItemOptionByName('Course Uploads'))
      // Select course which is created
      ARDashboardPage.getLongWait()
      ARDashboardPage.AddFilter('Course', 'Contains', ocDetails.courseName)
      ARDashboardPage.getLongWait()
      cy.get(ARDashboardPage.getGridTable()).eq(0).click()
      ARDashboardPage.getLongWait()
      cy.get(ARDashboardPage.getAddEditMenuActionsByName('Approve')).click()
      cy.get(ARDashboardPage.getToastNotificationMsg(), { timeout: 30000 }).should('contain', 'Course upload status successfully updated')
      ARDashboardPage.getLongWait()
      cy.get(ARDashboardPage.getGridTable()).eq(0).find('td').eq(7).should('contain', 'Approved')
      ARDashboardPage.getLongWait()
      cy.get(ARDashboardPage.getAddEditMenuActionsByName('Manage')).click()
      ARDashboardPage.getVLongWait()
      cy.get(ARDashboardPage.getElementByDataNameAttribute('course-upload-status')).should('contain', 'Approved')

    })
  })