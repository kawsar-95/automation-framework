import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage";
import LESideMenu from "../../../../../../helpers/LE/pageObjects/Menu/LESideMenu";
import LECourseDetailsOCModule from "../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule";
import LEFilterMenu from "../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu";
import arDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import arEnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage";
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails";
import { lessonObjects, ocDetails, ocEnrollments } from "../../../../../../helpers/TestData/Courses/oc";
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module";
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage";
import ARSelectLearningObjectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal";
import ARAddObjectLessonModal from "../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal";
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module";
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import LECatalogPage from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage";


describe('C6359- Online Discovery Modal - Re-enroll into the course', function () {

    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
    })

    it('Create course with an Object Lesson & Publish OC Course and enroll learner in this course', () => {
        cy.createCourse('Online Course', ocDetails.courseName)
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click().click()
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules'),{timeout:10000}).should('have.attr','class').and('include','enabled')
        ARCourseSettingsEnrollmentRulesModule. getAllowSelfEnrollmentRadioBtn('All Learners')
        cy.get(ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentAllLearnersRadioBtn()).should('have.attr','aria-checked','true')
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click().click()
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion'),{timeout:10000}).should('have.attr','class').and('include','enabled')
        ARCourseSettingsCompletionModule.generalToggleSwitch('true',ARCourseSettingsCompletionModule.getAllowReEnrollmentToggleContainer())

        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddBasicObjectLesson(lessonObjects.objectName)
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })

        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])

    })
})

describe('As a Learner Re-enroll into the Course', function () {

    beforeEach(() => {
        //Login and go to the course before each test
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword);
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        LESideMenu.getLEMenuItemsByNameThenClick("Catalog");
    })
        
    it('As a Learner Re-enroll into the Course', () => {
        LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
        cy.get(LEDashboardPage.getLEWaitSpinner(), {timeout: 10000}).should('not.exist', {timeout: 10000})
        LEDashboardPage.getSpecificCourseCardBtnThenClickOnName(ocDetails.courseName)
        cy.get(LECatalogPage.getCoursesModal()).should('be.visible')
        LECourseDetailsOCModule.getCourseLessonActionBtn(lessonObjects.objectName, 'Start', true)
        cy.get(LEDashboardPage.getCourseCloseBtn()).should('be.visible').click()
        cy.get(LEDashboardPage.getReEnrollBtn()).should('be.visible').click()
        //Get userID for deletion later
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            userDetails.userID = currentURL.slice(-36);
        })
    })
})

describe('Delete the course and the user', function () {
    
    it('Clean up', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
        //Cleanup - Delete Learner
        cy.deleteUser(userDetails.userID)
    })

})

