import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule';
import LELearnerUnenrollModal from '../../../../../../helpers/LE/pageObjects/Modals/LELearnerUnenroll.modal';
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu';
import { ecommFields, userDetails } from "../../../../../../helpers/TestData/users/UserDetails";
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import ARDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import AREditClientUserPage from '../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage';

describe('LE - Course Activity - Learner Un-enroll - OC - Eligible Criteria  - OLD LE', function () {

    before(function () {
        //Signin with system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LECatalogPage.turnOffNextgenToggle()
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0);
    })

    after(function () {
        //Cleanup - Get userID, logout, and delete them
        cy.get(LEDashboardPage.getNavMenu()).click();
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
            cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LECatalogPage.turnOnNextgenToggle()
        })
    })
    beforeEach(() => {
        //Login and go to the course before each test
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(courses.oc_lesson_act_ssta_name)
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), { timeout: 10000 }).should('not.exist')
        LEDashboardPage.getSpecificCourseCardBtnThenClick(courses.oc_lesson_act_ssta_name)
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), { timeout: 10000 }).should('not.exist')
    })

    it('Verify a user can Unenroll from a Course in the Not Started status', () => {
        cy.get(LECourseDetailsOCModule.getCourseCardName()).contains(courses.oc_lesson_act_ssta_name).click()
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), { timeout: 10000 }).should('not.exist')
        cy.get(LECourseDetailsOCModule.getOverflowMenuBtn()).should('be.visible')
        cy.get(LECourseDetailsOCModule.getOverflowMenuBtn()).click()
        LECourseDetailsOCModule.getOverflowMenuOptThenClick('Unenroll from Course')
        cy.get(LELearnerUnenrollModal.getUnenrollBtn()).click()
        cy.get(LECourseDetailsOCModule.getToastNotificationMsg()).should('contain', 'Unenrolled successfully.')
        cy.get(LECourseDetailsOCModule.getToastNotificationCloseBtn()).click({ multiple: true })
        cy.get(LECourseDetailsOCModule.getToastNotificationMsg()).should('not.be.visible')
        LEFilterMenu.SearchForCourseByName(courses.oc_lesson_act_ssta_name)
        cy.get(LEDashboardPage.getCourseCardName(), { timeout: 3000 }).should('not.exist')
    })

    it('Verify a user can Unenroll from a Course in the In Progress status', () => {
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), { timeout: 10000 }).should('not.exist')
        LEDashboardPage.getSpecificCourseCardBtnThenClick(courses.oc_lesson_act_ssta_name)
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), { timeout: 10000 }).should('not.exist')
        LECourseDetailsOCModule.getCourseLessonActionBtn(courses.oc_lesson_act_ssta_scorm_1_2_name, 'Start', true)
        cy.get(LECourseLessonPlayerPage.getCloseBtn()).click()
        cy.get(LECourseDetailsOCModule.getCourseProgressStatusText()).should('contain', 'In Progress')
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), { timeout: 10000 }).should('not.exist')
        cy.get(LECourseDetailsOCModule.getOverflowMenuBtn()).should('be.visible')
        cy.get(LECourseDetailsOCModule.getOverflowMenuBtn()).click()
        LECourseDetailsOCModule.getOverflowMenuOptThenClick('Unenroll from Course')
        cy.get(LELearnerUnenrollModal.getUnenrollBtn()).click()
        cy.get(LECourseDetailsOCModule.getToastNotificationMsg()).should('contain', 'Unenrolled successfully.')
        LEFilterMenu.SearchForCourseByName(courses.oc_lesson_act_ssta_name)
        cy.get(LEDashboardPage.getCourseCardName(), { timeout: 3000 }).should('not.exist')
    })
})
