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
let username = "GUIA-LESSON-COMPLETION-SSTA-USER- " + timestamp

describe('LE - Course Activity - Lessons - (SSTA) - OLD LE', function () {

    before(function () {
        cy.createUser(void 0,username, ["Learner"], void 0)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LECatalogPage.turnOffNextgenToggle()
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
        //Login before each test
        cy.apiLoginWithSession(username, defaultTestData.USER_PASSWORD)
        LEFilterMenu.getShortWait()
    })

    it('Enroll in course', () => {
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(courses.OC_LESSON_ACT_SSTA_NAME)
        LEFilterMenu.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(courses.OC_LESSON_ACT_SSTA_NAME)
        LEFilterMenu.getMediumWait()
    })

    it('Start and complete third party Lessons, then verify progress', () => {
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LECourseDetailsOCModule.getLongWait()
        LEFilterMenu.SearchForCourseByName(courses.OC_LESSON_ACT_SSTA_NAME)
        LEDashboardPage.getCourseCardBtnThenClick(courses.OC_LESSON_ACT_SSTA_NAME)
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(),{timeout:10000}).should('not.exist')

        //SCORM 1.2 Lesson Completion
        cy.get(LECourseDetailsOCModule.getLessonName()).contains(courses.OC_LESSON_ACT_SSTA_SCORM_1_2_NAME).should('be.visible')
        LECourseDetailsOCModule.getCourseLessonActionBtn(courses.OC_LESSON_ACT_SSTA_SCORM_1_2_NAME, 'Start', true)
        LECourseDetailsOCModule.getVLongWait()
        cy.frameLoaded(LECourseLessonPlayerPage.getSCORMiFrame())
        cy.iframe(LECourseLessonPlayerPage.getSCORMiFrame()).should('be.visible').find(LECourseLessonPlayerPage.getNEXTbtnSCORMTinCan()).contains('NEXT').click({force:true})
        LECourseDetailsOCModule.getShortWait()
        cy.iframe(LECourseLessonPlayerPage.getSCORMiFrame()).find(LECourseLessonPlayerPage.getTrueRadioBtn()).click({force:true})
        LECourseLessonPlayerPage.getIframeSCORMBtnandClick('SUBMIT')
        cy.iframe(LECourseLessonPlayerPage.getSCORMiFrame()).should('be.visible').find(LECourseLessonPlayerPage.getSCORMContinueBtn()).click()
        LECourseDetailsOCModule.getShortWait()
        cy.iframe(LECourseLessonPlayerPage.getSCORMiFrame()).find(LECourseLessonPlayerPage.getTrueRadioBtn()).click({force:true})
        LECourseLessonPlayerPage.getIframeSCORMBtnandClick('SUBMIT')
        cy.iframe(LECourseLessonPlayerPage.getSCORMiFrame()).should('be.visible').find(LECourseLessonPlayerPage.getSCORMContinueBtn()).click()
        LECourseDetailsOCModule.getShortWait()
        cy.iframe(LECourseLessonPlayerPage.getSCORMiFrame()).find(LECourseLessonPlayerPage.getTrueRadioBtn()).click({force:true})
        LECourseLessonPlayerPage.getIframeSCORMBtnandClick('SUBMIT')
        cy.iframe(LECourseLessonPlayerPage.getSCORMiFrame()).should('be.visible').find(LECourseLessonPlayerPage.getSCORMContinueBtn()).click()
        LECourseDetailsOCModule.getShortWait()
        cy.get(LECourseLessonPlayerPage.getCloseBtn()).click()
        LECourseDetailsOCModule.getShortWait()
        LECourseDetailsOCModule.getMediumWait() //2s timeout added on lesson player close
        //cy.get(LECourseLessonPlayerPage.confirmPopup()).click({force:true})
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(LECourseDetailsOCModule.getCourseProgressPercentText()).should('contain', '25%')

        //SCORM 2004 Lesson Completion
        LECourseDetailsOCModule.getCourseLessonActionBtn(courses.OC_LESSON_ACT_SSTA_SCORM_2004_NAME, 'Start', true)
        //LECourseDetailsOCModule.getVLongWait()
        //cy.get(LECourseLessonPlayerPage.getNextActivityBtn()).click()   
        LECourseDetailsOCModule.getVLongWait()
        cy.iframe(LECourseLessonPlayerPage.getSCORMiFrame()).should('be.visible').find(LECourseLessonPlayerPage.getNEXTbtnSCORMTinCan()).contains('NEXT').click()
        LECourseDetailsOCModule.getShortWait()
        cy.iframe(LECourseLessonPlayerPage.getSCORMiFrame()).find(LECourseLessonPlayerPage.getTrueRadioBtn()).click({force:true})
        LECourseLessonPlayerPage.getIframeSCORMBtnandClick('SUBMIT')
        cy.iframe(LECourseLessonPlayerPage.getSCORMiFrame()).should('be.visible').find(LECourseLessonPlayerPage.getSCORMContinueBtn()).click()
        LECourseDetailsOCModule.getShortWait()
        cy.iframe(LECourseLessonPlayerPage.getSCORMiFrame()).find(LECourseLessonPlayerPage.getTrueRadioBtn()).click({force:true})
        LECourseLessonPlayerPage.getIframeSCORMBtnandClick('SUBMIT')
        cy.iframe(LECourseLessonPlayerPage.getSCORMiFrame()).should('be.visible').find(LECourseLessonPlayerPage.getSCORMContinueBtn()).click()
        LECourseDetailsOCModule.getShortWait()
        cy.iframe(LECourseLessonPlayerPage.getSCORMiFrame()).find(LECourseLessonPlayerPage.getTrueRadioBtn()).click({force:true})
        LECourseLessonPlayerPage.getIframeSCORMBtnandClick('SUBMIT')
        cy.iframe(LECourseLessonPlayerPage.getSCORMiFrame()).should('be.visible').find(LECourseLessonPlayerPage.getSCORMContinueBtn()).click()
        LECourseDetailsOCModule.getShortWait()
        LECourseDetailsOCModule.getMediumWait() //2s timeout added on lesson player close
        //cy.get(LECourseLessonPlayerPage.confirmPopup()).click({force:true})
        LECourseDetailsOCModule.getMediumWait() //2s timeout added on lesson player close
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(LECourseLessonPlayerPage.getCloseBtn()).click()
        cy.get(LECourseDetailsOCModule.getCourseProgressPercentText()).should('contain', '50%')

        //Tin-Can Lesson Completion
        LECourseDetailsOCModule.getCourseLessonActionBtn(courses.OC_LESSON_ACT_SSTA_TIN_CAN_NAME, 'Start', true)
        LECourseDetailsOCModule.getVLongWait()
        cy.frameLoaded(LECourseLessonPlayerPage.getTinCanAICCiFrame())
        cy.iframe(LECourseLessonPlayerPage.getTinCanAICCiFrame()).should('be.visible').find(LECourseLessonPlayerPage.getNEXTbtnSCORMTinCan()).contains('NEXT').click()
        cy.iframe(LECourseLessonPlayerPage.getTinCanAICCiFrame()).find(LECourseLessonPlayerPage.getTrueRadioBtn()).click({force:true})
        LECourseLessonPlayerPage.getIframeTinCanAICCBtnandClick('SUBMIT')
        cy.iframe(LECourseLessonPlayerPage.getTinCanAICCiFrame()).should('be.visible').find(LECourseLessonPlayerPage.getSCORMContinueBtn()).click()
        LECourseDetailsOCModule.getShortWait()
        cy.iframe(LECourseLessonPlayerPage.getTinCanAICCiFrame()).find(LECourseLessonPlayerPage.getTrueRadioBtn()).click({force:true})
        LECourseLessonPlayerPage.getIframeTinCanAICCBtnandClick('SUBMIT')
        cy.iframe(LECourseLessonPlayerPage.getTinCanAICCiFrame()).should('be.visible').find(LECourseLessonPlayerPage.getSCORMContinueBtn()).click()
        LECourseDetailsOCModule.getShortWait()
        cy.iframe(LECourseLessonPlayerPage.getTinCanAICCiFrame()).find(LECourseLessonPlayerPage.getTrueRadioBtn()).click({force:true})
        LECourseLessonPlayerPage.getIframeTinCanAICCBtnandClick('SUBMIT')
        cy.iframe(LECourseLessonPlayerPage.getTinCanAICCiFrame()).should('be.visible').find(LECourseLessonPlayerPage.getSCORMContinueBtn()).click()
        LECourseDetailsOCModule.getShortWait()
        cy.get(LECourseLessonPlayerPage.getCloseBtn()).click()
        LECourseDetailsOCModule.getMediumWait() //2s timeout added on lesson player close
       // cy.get(LECourseLessonPlayerPage.confirmPopup()).click({force:true})
        LECourseDetailsOCModule.getMediumWait() //2s timeout added on lesson player close
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(LECourseDetailsOCModule.getCourseProgressPercentText()).should('contain', '75%')

        //AICC Lesson Completion
        LECourseDetailsOCModule.getCourseLessonActionBtn(courses.OC_LESSON_ACT_SSTA_AICC_NAME, 'Start', true)
        LECourseDetailsOCModule.getVLongWait()
        cy.frameLoaded(LECourseLessonPlayerPage.getTinCanAICCiFrame())
        LECourseDetailsOCModule.getVLongWait()
        cy.iframe(LECourseLessonPlayerPage.getTinCanAICCiFrame()).should('be.visible').find(LECourseLessonPlayerPage.getNEXTbtnAICC()).contains('NEXT').click()
        LECourseDetailsOCModule.getMediumWait()
        cy.iframe(LECourseLessonPlayerPage.getTinCanAICCiFrame()).should('be.visible').find(LECourseLessonPlayerPage.getNEXTbtnAICC()).contains('NEXT').click()
        LECourseDetailsOCModule.getMediumWait()
        cy.get(LECourseLessonPlayerPage.getCloseBtn()).click()
        LECourseDetailsOCModule.getMediumWait() //2s timeout added on lesson player close
        //cy.get(LECourseLessonPlayerPage.confirmPopup()).click({force:true})
        
        LECourseDetailsOCModule.getMediumWait() //2s timeout added on lesson player close
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(LECourseDetailsOCModule.getCourseProgressPercentText()).should('contain', '100%')

    })

    it('Verify Course lesson rollup and completion', () => {
        LEDashboardPage.getTileByNameThenClick('My Courses')
        cy.get(LECourseDetailsOCModule.getCourseCardName(), {timeout: 15000}).contains(courses.OC_LESSON_ACT_SSTA_NAME).click()
        cy.get(LECourseDetailsOCModule.getCourseProgressPercentText(), {timeout: 15000}).should('contain', '100%')
    })
})
