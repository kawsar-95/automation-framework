import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arOCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectLearningObjectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARAddVideoLessonModal, { subtitles } from '../../../../../../../helpers/AR/pageObjects/Modals/ARAddVideoLessonModal'
import { lessonVideo, ocDetails } from '../../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../../helpers/TestData/Misc/misc'
import { videos } from '../../../../../../../helpers/TestData/resources/resources'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEProfilePage from '../../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import { userDetails } from '../../../../../../../helpers/TestData/users/UserDetails'
import LESideMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LECourseDetailsOCModule from '../../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import LECourseLessonPlayerPage from '../../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import AREnrollUsersPage from '../../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import LECatalogPage from '../../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'

describe('C906 AUT-118, AR - OC - Subtitles can be Added to a Video Lesson (cloned)', function(){
    before(function () {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LECatalogPage.turnOffNextgenToggle()

        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    after(function() {
        cy.deleteCourse(commonDetails.courseID)
        
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36))
        })
    })

    it('Create Online Course with Video Lesson and Subtitles', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()

        cy.createCourse('Online Course')

        //Verify Video Lesson Can Be Selected
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Video')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()

        ARAddVideoLessonModal.getAddCustomVideoLesson(lessonVideo.ocVideoName, 'true', '640', '480', 'URL', null, null, 'File', miscData.resource_video_folder_path, videos.subtitles_video_webm, 'false', subtitles)

        //Publish the Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
        cy.get(arDashboardPage.getToastSuccessMsg()).should('contain', 'Course successfully published')
        
        //Enroll User
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
    })

    it('Verify Video Lessons and Subtitles', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)

        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader()).should('not.exist')
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName).click()

        //Start 1st Video Lesson
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner()).should('not.exist')
        LECourseDetailsOCModule.getMediumWait()
        LECourseDetailsOCModule.getCourseLessonActionBtn(lessonVideo.ocVideoName, 'Start', true)
        cy.get(LECourseLessonPlayerPage.getButtonLoader()).should('not.exist')
        LECourseDetailsOCModule.getMediumWait()

        cy.get(LEDashboardPage.getLEEllipsesLoader()).should('not.exist')
        LECourseDetailsOCModule.getVLongWait()
        cy.get(LECourseLessonPlayerPage.getVideoPlayBtn(), { timeout: 15000 }).click({force:true})
        cy.get(LEDashboardPage.getLEEllipsesLoader()).should('not.exist')
        cy.get(LECourseLessonPlayerPage.getVideoLoadingSpinner()).should('not.be.visible')

        cy.get(LECourseLessonPlayerPage.getVideoSubtitlesBtn()).should('be.visible').click()
        cy.get(LECourseLessonPlayerPage.getVideoSubtitlesMenu()).should('contain', 'captions off')
        cy.get(LECourseLessonPlayerPage.getVideoSubtitlesMenu()).should('contain', 'English')
        cy.get(LECourseLessonPlayerPage.getVideoSubtitlesMenu()).should('contain', 'Español')
        cy.get(LECourseLessonPlayerPage.getVideoSubtitlesMenu()).should('contain', 'Deutsch')
        cy.get(LECourseLessonPlayerPage.getVideoSubtitlesMenu()).contains('Deutsch').click()
        LECourseDetailsOCModule.getShortWait()

        cy.get(LECourseLessonPlayerPage.getXBtn()).click()
        cy.get(LECourseLessonPlayerPage.getXBtn()).should('not.exist')
    })
})