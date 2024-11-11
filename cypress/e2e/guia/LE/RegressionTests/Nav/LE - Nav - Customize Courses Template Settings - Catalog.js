import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import ARAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsCatalogVisibilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LEManageTemplateMenu from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateMenu'
import LEManageTemplateCoursesPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateCoursesPage'

let courseName = ocDetails.courseName

describe('LE - Nav - Customize Catalog in Courses Template Settings - Create Course Test Data', function () {
    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
      })

    it('Create Course Data for test', () => {
      cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
      ARDashboardPage.getCoursesReport()
      //Create Course
      cy.createCourse('Online Course',courseName)
      //Open Catalog Visibility Section
      cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
    //Select a Category
      cy.get(ARCourseSettingsCatalogVisibilityModule.getChooseCategoryBtn(), {timeout: 1000}).click()
      ARSelectModal.SearchAndSelectFunction([courses.category_01_name])
      //Open Enrollment Rules
      cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules'), {timeout: 1000}).click()

      //Select Allow Self Enrollment Specific Radio Button
      ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
      //Publish course
      cy.publishCourseAndReturnId().then((id) => {
        commonDetails.courseIDs.push(id.request.url.slice(-36))
    })
    cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Course successfully published')
})


    
describe('LE - Nav - Customize Catalog in Courses Template Settings - Verify LE Side', function () {

  after(function() {
    //Cleanup - delete learner
    cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
    cy.get(LEDashboardPage.getNavProfile()).click()  
    cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
    cy.url().then((currentURL) => {
        cy.deleteUser(currentURL.slice(-36));
    })
    //Delete Course
    cy.deleteCourse(commonDetails.courseID)
  })

    it('Toggle Hide Categories & Enrolled Coureses ON', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')     
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Courses').should('be.visible').click()
        cy.url().should('include', '/#/learner-mgmt/courses')
        LEManageTemplateCoursesPage.getManageTemplateCoursesContainerByNameThenClick('Catalog')
        LEManageTemplateCoursesPage.getTurnOnOffAlwaysHideCategoriesToggleBtn('true')
        LEManageTemplateCoursesPage.getTurnOnOffAlwaysHideEnrolledCoursesToggleBtn('true')
        LEManageTemplateCoursesPage.getCatalogCheckSave()
      })

    it('Enroll in Course, verify Categories & Enrolled Courses are Hidden from the Catalog', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick("Catalog")
        cy.get(LEDashboardPage.getCategorySelector(courses.category_01_name), {timeout: 1000}).should('not.exist')
        LEFilterMenu.getSearchAndEnrollInCourseByNameWithShowCategoriesToggleBtnOff(courseName)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick("Catalog")
        cy.get(LEFilterMenu.getShowCategoriesTxt(), {timeout: 1000}).should('not.exist')
        LEFilterMenu.SearchForCourseByNameWithShowCategoriesToggleBtnOff(courseName)
        cy.get(LEDashboardPage.getLEWaitSpinner(), {timeout:10000}).should('not.exist')
        LEDashboardPage.getSearchCourseNotFoundMsg()
      })

    it('Toggle Hide Categories & Enrolled Courses OFF', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')     
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Courses').should('be.visible').click()
        cy.url().should('include', '/#/learner-mgmt/courses')
        LEManageTemplateCoursesPage.getManageTemplateCoursesContainerByNameThenClick('Catalog')
        LEManageTemplateCoursesPage.getTurnOnOffAlwaysHideCategoriesToggleBtn('false')
        LEManageTemplateCoursesPage.getTurnOnOffAlwaysHideEnrolledCoursesToggleBtn('false')
        LEManageTemplateCoursesPage.getCatalogCheckSave()
     })

    it('Verify Categories & Enrolled Courses are Restored the Catalog', () => {
      cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
      cy.get(LEDashboardPage.getNavMenu()).click()
      LESideMenu.getLEMenuItemsByNameThenClick("Catalog")
      LEFilterMenu.SearchForCourseByName(courseName)
      cy.get(LEDashboardPage.getLEWaitSpinner(), {timeout:10000}).should('not.exist')
      cy.get(LEDashboardPage.getCategorySelector(courses.category_01_name)).should('exist').click()
      LEDashboardPage.getVerifyCourseCardNameAndBtn(courseName, "Completed")
    })

  })
  
})
