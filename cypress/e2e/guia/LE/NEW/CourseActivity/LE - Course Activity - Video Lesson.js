import { users } from '../../../../../../helpers/TestData/users/users'
import { resourcePaths, images, videos} from '../../../../../../helpers/TestData/resources/resources'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { miscData } from "../../../../../../helpers/TestData/Misc/misc"
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { ocDetails, lessonVideo } from '../../../../../../helpers/TestData/Courses/oc'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import ARAddVideoLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddVideoLessonModal'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'

describe('LE - Course Activity - Course Activity - Video Lesson - Admin Side', function(){
    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0);
      });
    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Add New OC with Access Date In past and Publish OC', () => {
        cy.createCourse('Online Course', ocDetails.courseName)
        //Add Video File Lesson, with File poster and specified length and width
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Video')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddVideoLessonModal.getAddCustomVideoLesson(lessonVideo.ocVideoName, 'false', '640', '480', 'Url', null, null, 'Url', null, null, 'false', 'false')
        //Add subtitle Video File Lesson, with File poster and specified length and width
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Video')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddVideoLessonModal.getAddCustomVideoLesson(lessonVideo.ocVideoName + '2', 'false', '640', '480', 'File', resourcePaths.resource_image_folder_selectFile, images.sintel_poster, 'File', resourcePaths.resource_video_folder_selectFile, videos.subtitles_video_webm, 'false', 'true')
        //Add Video File Lesson, with File poster and specified length and width, seeking disabled
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Video')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddVideoLessonModal.getAddCustomVideoLesson(lessonVideo.ocVideoName + '3', 'true', '640', '480', 'File', resourcePaths.resource_image_folder_selectFile, images.moose_filename, 'File', resourcePaths.resource_video_folder_selectFile, videos.video_small, 'false', 'false')
        
       
        

        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Course successfully published')


        //Enroll User
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
     })
})



describe('LE - Course Activity - Course Activity - Object Lesson - Learner Side', function(){
    

    after(function() {
        //Delete all courses
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], 'online-courses')
        }
        
        //Cleanup - delete learner
        
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Verify Video Lessons can be started and Completed', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist', {timeout: 15000})
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName).click()
        //Start 1st Video Lesson
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout: 10000}).should('not.exist', {timeout: 10000})
        LECourseDetailsOCModule.getMediumWait()
        LECourseDetailsOCModule.getCourseLessonActionBtn(lessonVideo.ocVideoName, 'Start', true)
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        //Verify Poster
        cy.get(LECourseLessonPlayerPage.getCoursePlayerPoster()).should('have.attr', 'style').and('include', miscData.switching_to_absorb_img_url)
        LECourseDetailsOCModule.getMediumWait()
        cy.get(LECourseLessonPlayerPage.getVideoPlayBtn()).click()
        cy.get(LECourseLessonPlayerPage.getVideoLoadingSpinner(), {timeout: 15000}).should('not.be.visible')
        //Verify Seeking
        cy.get(LECourseLessonPlayerPage.getVideoProgressBar(), {timeout: 10000}).click()
        LECourseLessonPlayerPage.getHFJobWait()
        LECourseLessonPlayerPage.getLessonByStatus(lessonVideo.ocVideoName, 'Complete')
        //Start 2nd Video Lesson
        LECourseLessonPlayerPage.getStartLessonByName(lessonVideo.ocVideoName + '2')
        cy.get(LECourseLessonPlayerPage.getLEEllipsesLoader(), {timeout: 9000}).should('not.exist')
        //Verify Poster
        cy.get(LECourseLessonPlayerPage.getCoursePlayerPoster()).should('have.attr', 'style').and('include', images.sintel_poster)
        cy.get(LECourseLessonPlayerPage.getVideoPlayBtn()).click()
        cy.get(LECourseLessonPlayerPage.getVideoLoadingSpinner()).should('not.be.visible')
        //Verify Seeking
        cy.get(LECourseLessonPlayerPage.getVideoProgressBar(), {timeout: 10000}).click()
        cy.get(LECourseLessonPlayerPage.getVideoSubtitlesBtn()).click()
        cy.get(LECourseLessonPlayerPage.getVideoSubtitlesMenu()).contains('captions off')
        cy.get(LECourseLessonPlayerPage.getVideoSubtitlesMenu()).contains('English ')
        cy.get(LECourseLessonPlayerPage.getVideoPlayBtn(), {timeout: 65000}).should('be.visible')
        LECourseLessonPlayerPage.getLessonByStatus(lessonVideo.ocVideoName + '2', 'Complete')
        //Start 3rd Video Lesson
        LECourseLessonPlayerPage.getStartLessonByName(lessonVideo.ocVideoName + '3')
        cy.get(LECourseLessonPlayerPage.getLEEllipsesLoader(), {timeout: 9000}).should('not.exist')
        //Verify Poster
        cy.get(LECourseLessonPlayerPage.getCoursePlayerPoster()).should('have.attr', 'style').and('include', images.moose_filename)
        cy.get(LECourseLessonPlayerPage.getVideoPlayBtn()).click()
        cy.get(LECourseLessonPlayerPage.getVideoLoadingSpinner()).should('not.be.visible')
        //Verify Seeking is disabled
        cy.get(LECourseLessonPlayerPage.getVideoProgressBar()).click()
        LECourseLessonPlayerPage.getMediumWait()
        cy.get(LECourseLessonPlayerPage.getVideoPlayBtn(), {timeout: 0}).should('not.be.visible')
        LECourseLessonPlayerPage.getLessonByStatus(lessonVideo.ocVideoName + '3', 'Complete')
        cy.get(LECourseLessonPlayerPage.getXBtn()).click()
        cy.get(LECourseDetailsOCModule.getCourseProgressPercentText()).should('contain', '100%')
        
    })
    
        


        
        

    })