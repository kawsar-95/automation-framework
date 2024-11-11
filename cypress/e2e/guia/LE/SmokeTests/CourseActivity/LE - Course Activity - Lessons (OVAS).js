import defaultTestData from '../../../../../fixtures/defaultTestData.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import courses from '../../../../../fixtures/courses.json'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'

let timestamp = LEDashboardPage.getTimeStamp();
let username = "GUIA-Learner-Lessons - " + timestamp

describe('LE - Course Activity - Lessons - (OVAS)', function () {

    before(function () {
        cy.createUser(void 0,username, ["Learner"], void 0)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.url().then((url) => {
          if (url.includes('guianasa')===false) {
           LEProfilePage.turnOnNextgenToggle()
        }})
    })

    after(function() {
        //Cleanup - Get userID and delete them
        cy.get(LEDashboardPage.getNavMenu()).click();
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
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

    it('Start and complete Object, Video, Assessment and Survey lessons', () => { 
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LECourseDetailsOCModule.getLongWait()
        LEFilterMenu.SearchForCourseByName(courses.OC_LESSON_ACT_OVAS_NAME)
        LEFilterMenu.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.OC_LESSON_ACT_OVAS_NAME)
        LECourseDetailsOCModule.getMediumWait()
        LECourseLessonPlayerPage.getStartLessonByName(courses.OC_LESSON_ACT_OVAS_VIDEO_NAME)
        LECourseDetailsOCModule.getMediumWait()
        //cy.get(LECourseLessonPlayerPage.getExpandCourseDetailsDownBtn()).click()
        cy.get(LECourseLessonPlayerPage.getVideoPlayBtn()).click()
        LECourseDetailsOCModule.getVLongWait()
        LECourseLessonPlayerPage.getStartLessonByName(courses.OC_LESSON_ACT_OVAS_ASSESSMENT_NAME)
        cy.get(LEDashboardPage.getStartquizbutton()).contains("Start Quiz").click({ force: true })
        LECourseDetailsOCModule.getMediumWait()
        LECourseLessonPlayerPage.getIframeAnswer()
        LECourseLessonPlayerPage.getIframeLessonPlayerElementandClick(LECourseLessonPlayerPage.getQuestionContainer(), LECourseLessonPlayerPage.getSubmitResponseBtn())
        LECourseDetailsOCModule.getMediumWait()
        LECourseLessonPlayerPage.getStartLessonByName(courses.OC_LESSON_ACT_OVAS_SURVEY_NAME)
        LECourseDetailsOCModule.getVLongWait()
        LECourseLessonPlayerPage.getIframeLessonPlayerTxtFElementandTypeText(LECourseLessonPlayerPage.getSurveyTxtF(), '1234')
        LECourseLessonPlayerPage.getIframeLessonPlayerElementandClick(LECourseLessonPlayerPage.getQuestionContainer(), LECourseLessonPlayerPage.getSubmitResponseBtn())
        LECourseDetailsOCModule.getLShortWait()
        cy.get(LECourseLessonPlayerPage.getCloseBtn()).click()
        cy.get(LECourseLessonPlayerPage.getCoursePlayerProgressBar()).should('contain', '100%').should('contain', 'Completed')
    
})
})
