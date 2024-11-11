import defaultTestData from '../../../../../fixtures/defaultTestData.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import courses from '../../../../../fixtures/courses.json'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'

let timestamp = LEDashboardPage.getTimeStamp();
let username = "GUIA-Learner-Lessons - " + timestamp

describe('LE - Course Activity - Lessons - (OVAS) - OLD LE', function () {

    before(function () {
        cy.createUser(void 0,username, ["Learner"], void 0)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LECatalogPage.turnOffNextgenToggle()
       
    })

    after(function () {
        //Cleanup - Get userID and delete them
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
        //Login before each test
        cy.apiLoginWithSession(username, defaultTestData.USER_PASSWORD)
        LEFilterMenu.getShortWait()
    })

    it('Enroll in course', () => {
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(courses.OC_LESSON_ACT_OVAS_NAME)
        LEFilterMenu.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.OC_LESSON_ACT_OVAS_NAME)
        LEFilterMenu.getMediumWait()
    })

    it('Start and complete object, video and assessment Lessons', () => { 
        LEDashboardPage.getTileByNameThenClick('My Courses')
        
        LECourseDetailsOCModule.getLongWait()
        LEFilterMenu.SearchForCourseByName(courses.OC_LESSON_ACT_OVAS_NAME)
        LEFilterMenu.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.OC_LESSON_ACT_OVAS_NAME)
        LECourseDetailsOCModule.getMediumWait()
        LECourseDetailsOCModule.getCourseLessonActionBtn(courses.OC_LESSON_ACT_OVAS_OBJECT_NAME, 'Start', true)
        LECourseDetailsOCModule.getMediumWait()
        cy.get(LECourseLessonPlayerPage.getCloseBtn()).click()
        LECourseDetailsOCModule.getMediumWait()
        LECourseDetailsOCModule.getCourseLessonActionBtn(courses.OC_LESSON_ACT_OVAS_VIDEO_NAME, 'Start', true)
        LECourseDetailsOCModule.getMediumWait()
        cy.get(LECourseLessonPlayerPage.getVideoPlayBtn()).click()
        LECourseDetailsOCModule.getVLongWait()
        cy.get(LECourseLessonPlayerPage.getNextActivityBtn()).contains('Next Activity').click()
        LECourseDetailsOCModule.getVLongWait()
        LECourseLessonPlayerPage.getIframeAnswer()
        //LECourseLessonPlayerPage.getIframeLessonPlayerElementandClick(LECourseLessonPlayerPage.getAnswerContainer(), LECourseLessonPlayerPage.getElementByAriaLabelAttribute(2))
        LECourseLessonPlayerPage.getIframeLessonPlayerElementandClick(LECourseLessonPlayerPage.getQuestionContainer(), LECourseLessonPlayerPage.getSubmitResponseBtn())
        LECourseDetailsOCModule.getMediumWait()
    })

    it('Start and complete Survey Lesson', () => {
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LECourseDetailsOCModule.getLongWait()
        LEFilterMenu.SearchForCourseByName(courses.OC_LESSON_ACT_OVAS_NAME)
        LEFilterMenu.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.OC_LESSON_ACT_OVAS_NAME)
        LECourseDetailsOCModule.getLongWait()
        LECourseDetailsOCModule.getCourseLessonActionBtn(courses.OC_LESSON_ACT_OVAS_SURVEY_NAME, 'Start', true)
        LECourseDetailsOCModule.getLongWait()
        LECourseLessonPlayerPage.getIframeLessonPlayerTxtFElementandTypeText(LECourseLessonPlayerPage.getSurveyTxtF(), '1234')
        LECourseDetailsOCModule.getLongWait()
        //LECourseLessonPlayerPage.getIframeType('1234')
        LECourseLessonPlayerPage.getIframeLessonPlayerElementandClick(LECourseLessonPlayerPage.getQuestionContainer(), LECourseLessonPlayerPage.getSubmitResponseBtn())
        LECourseDetailsOCModule.getLongWait()
        LECourseLessonPlayerPage.getIframeLessonPlayerElementandClick(LECourseLessonPlayerPage.getPassLessonCompletionContainer(), LECourseLessonPlayerPage.getContinueBtn())
        LECourseDetailsOCModule.getLShortWait()
    })

    it('Verify Course lesson rollup and completion', () => {
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LECourseDetailsOCModule.getLongWait()
        LEFilterMenu.SearchForCourseByName(courses.OC_LESSON_ACT_OVAS_NAME)
        LEFilterMenu.getMediumWait()
        LECourseDetailsOCModule.getClickByCourseName(courses.OC_LESSON_ACT_OVAS_NAME)
        LEFilterMenu.getMediumWait()
        cy.get(LECourseDetailsOCModule.getCourseProgressPercentText()).should('contain', '100%')
    })
})
