import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule';
import LELearnerUnenrollModal from '../../../../../../helpers/LE/pageObjects/Modals/LELearnerUnenroll.modal';
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu';
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails";
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('LE - Course Activity - Learner Un-enroll - OC - Eligible Criteria', function () {

    before(function () {
        cy.createUser(void 0,userDetails.username, ["Learner"], void 0)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.url().then((url) => {
          if (url.includes('guianasa')===false) {
           LEProfilePage.turnOnNextgenToggle()
        }})
    })

    after(function () {
        //Cleanup - Get userID, logout, and delete them
        cy.get(LEDashboardPage.getNavMenu()).click();
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
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
        cy.get(LECourseDetailsOCModule.getOverflowBtn()).should('be.visible').should('have.attr' , 'aria-disabled', 'false').click()
        LECourseDetailsOCModule.getOverflowMenuOptThenClick('Unenroll')
        cy.get(LELearnerUnenrollModal.getUnenrollBtn()).click()
        cy.get(LECourseDetailsOCModule.getToastNotificationMsg()).should('contain', 'Unenrolled successfully.')
        cy.get(LECourseDetailsOCModule.getToastNotificationCloseBtn()).click({ multiple: true })
        cy.get(LECourseDetailsOCModule.getToastNotificationMsg()).should('not.be.visible')
        LEFilterMenu.SearchForCourseByName(courses.oc_lesson_act_ssta_name)
        cy.get(LEDashboardPage.getCourseCardName(), { timeout: 3000 }).should('not.exist')
    })

    it('Verify a user can Unenroll from a Course in the In Progress status', () => {
        cy.get(LECourseDetailsOCModule.getCourseCardName()).contains(courses.oc_lesson_act_ssta_name).click()
        cy.get(LECourseDetailsOCModule.getCourseViewBtn()).should('be.visible').should('have.attr' , 'aria-disabled', 'false').click()
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), { timeout: 10000 }).should('not.exist')
        cy.get(LECourseLessonPlayerPage.getLEEllipsesLoader(), { timeout: 10000 }).should('not.exist')
        //This wait is needed because of third party course considerations
        LECourseLessonPlayerPage.getVLongWait()
        cy.frameLoaded(LECourseLessonPlayerPage.getSCORMiFrame())
        cy.iframe(LECourseLessonPlayerPage.getSCORMiFrame()).should('be.visible').find(LECourseLessonPlayerPage.getNEXTbtnSCORMTinCan()).contains('NEXT')
        cy.get(LECourseLessonPlayerPage.getCloseBtn()).should('be.visible').click()
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), { timeout: 10000 }).should('not.exist')
        cy.get(LECourseLessonPlayerPage.getLEEllipsesLoader(), { timeout: 10000 }).should('not.exist')
        cy.get(LECourseDetailsOCModule.getBtn()).should('be.visible').contains('Leave Lesson').click()
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), { timeout: 10000 }).should('not.exist')
        cy.get(LECourseDetailsOCModule.getOverflowBtn()).should('be.visible').should('have.attr' , 'aria-disabled', 'false').click()
        LECourseDetailsOCModule.getOverflowMenuOptThenClick('Unenroll')
        cy.get(LELearnerUnenrollModal.getUnenrollBtn()).click()
        cy.get(LECourseDetailsOCModule.getToastNotificationMsg()).should('contain', 'Unenrolled successfully.')
        LEFilterMenu.SearchForCourseByName(courses.oc_lesson_act_ssta_name)
        cy.get(LEDashboardPage.getCourseCardName(), { timeout: 3000 }).should('not.exist')
    })
})
