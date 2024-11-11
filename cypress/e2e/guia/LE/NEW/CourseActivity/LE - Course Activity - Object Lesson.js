import { users } from '../../../../../../helpers/TestData/users/users'
import { resourcePaths, pdfs, images, videos, others } from '../../../../../../helpers/TestData/resources/resources'
import { defaultThemeColors } from '../../../../../../helpers/TestData/Template/templateTheme'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { ocDetails, lessonObjects } from '../../../../../../helpers/TestData/Courses/oc'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import ARAddObjectLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'

describe('LE - Course Activity - Course Activity - Object Lesson - Admin Side', function(){
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
        //Add Video File Object Lesson Desktop Iframe
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddCustomObjectLesson(lessonObjects.objectName, 'File', resourcePaths.resource_video_folder_selectFile, videos.video_small)
        //Add Image File Object Lesson Desktop Iframe
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddCustomObjectLesson(lessonObjects.objectName + '2', 'File', resourcePaths.resource_image_folder_selectFile, images.moose_filename)
        //Add PDF Object Lesson Desktop Iframe
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddCustomObjectLesson(lessonObjects.objectName + '3', 'File', resourcePaths.resource_pdf_folder_selectFile, pdfs.sample_filename)
        //This commented out code includes testing of audio files in LE, at present was not able to get this to work
        // //Add Audio Object Lesson Desktop Iframe
        // cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        // ARSelectLearningObjectModal.getObjectTypeByName('Object')
        // cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        // ARAddObjectLessonModal.getAddCustomObjectLesson(lessonObjects.objectName + '4', 'File', resourcePaths.resource_other_folder_selectFile, others.bass_wav_audio_filename)
        //Add Downloadable Object Lesson Desktop Iframe
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddCustomObjectLesson(lessonObjects.objectName + '5', 'File', resourcePaths.resource_other_folder_selectFile, others.guia_word_doc_filename)
        //Add Image Object Lesson Desktop popup
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddCustomObjectLesson(lessonObjects.objectName + '6', 'File', resourcePaths.resource_image_folder_selectFile, images.moose_filename, ARAddObjectLessonModal.getDesktopRadioBtn(), 'Launch in a popup')
        //Add PDF Object Lesson Mobile new tab
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddCustomObjectLesson(lessonObjects.objectName + '7', 'File', resourcePaths.resource_pdf_folder_selectFile, pdfs.security_training_certificate_filename, ARAddObjectLessonModal.getMobileRadioBtn(), 'Launch in a new tab')
        

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

    it('Verify Object Lessons can be started and Completed', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist', {timeout: 15000})
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName).click()
        //Start 1st Object Lesson
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout: 10000}).should('not.exist', {timeout: 10000})
        LECourseDetailsOCModule.getMediumWait()
        LECourseDetailsOCModule.getCourseLessonActionBtn(lessonObjects.objectName, 'Start', true)
        cy.get(LECourseLessonPlayerPage.getSidebarHeader()).eq(0).find(LECourseLessonPlayerPage.getCountPill()).contains('0/6')
        cy.get(LECourseLessonPlayerPage.getVideoPlayBtn()).should('be.visible', {timeout: 9000}).click()
        cy.get(LECourseLessonPlayerPage.getVideoPlayBtn()).should('be.visible', {timeout: 20000})
        LECourseLessonPlayerPage.getLessonByStatus(lessonObjects.objectName, 'Complete')
        cy.get(LECourseLessonPlayerPage.getSidebarHeader()).eq(0).find(LECourseLessonPlayerPage.getCountPill()).contains('1/6')
        //Start 2nd Object Lesson
        LECourseLessonPlayerPage.getStartLessonByName(lessonObjects.objectName + '2')
        cy.get(LECourseLessonPlayerPage.getLEEllipsesLoader()).should('not.exist', {timeout: 9000})
        cy.get(LECourseLessonPlayerPage.getIframeSelector()).should('have.attr', 'src').and('include', images.moose_filename)
        LECourseLessonPlayerPage.getLessonByStatus(lessonObjects.objectName + '2', 'Complete')
        cy.get(LECourseLessonPlayerPage.getSidebarHeader()).eq(0).find(LECourseLessonPlayerPage.getCountPill()).contains('2/6')
        //Start 3rd Object Lesson
        LECourseLessonPlayerPage.getStartLessonByName(lessonObjects.objectName + '3')
        cy.get(LECourseLessonPlayerPage.getCoursePlayerContent()).find('object').should('have.attr', 'data').and('include', pdfs.sample_filename)
        LECourseLessonPlayerPage.getLessonByStatus(lessonObjects.objectName + '3', 'Complete')
        cy.get(LECourseLessonPlayerPage.getSidebarHeader()).eq(0).find(LECourseLessonPlayerPage.getCountPill()).contains('3/6')
        //This commented out code includes testing of audio files in LE, at present was not able to get this to work
        //Start 4th Object Lesson
        // LECourseLessonPlayerPage.getStartLessonByName(lessonObjects.objectName + '4')
        // cy.get(LECourseLessonPlayerPage.getCoursePlayerDownloadLink()).should('have.attr', 'href').and('include', others.bass_wav_audio_filename)
        // cy.get(LECourseLessonPlayerPage.getCoursePlayerDownloadLink()).click()
        // LECourseLessonPlayerPage.getMediumWait()
        // cy.get(LECourseLessonPlayerPage.getXBtn()).click()
        //Start 5th Object Lesson
        LECourseLessonPlayerPage.getStartLessonByName(lessonObjects.objectName + '5')
        cy.get(LECourseLessonPlayerPage.getCoursePlayerDownloadLink()).should('have.attr', 'href').and('include', others.guia_word_doc_filename)
        cy.get(LECourseLessonPlayerPage.getCoursePlayerDownloadLink()).click()
        LECourseLessonPlayerPage.getLessonByStatus(lessonObjects.objectName + '5', 'Complete')
        cy.get(LECourseLessonPlayerPage.getSidebarHeader()).eq(0).find(LECourseLessonPlayerPage.getCountPill()).contains('4/6')
        //Start 6th Object Lesson
        LECourseLessonPlayerPage.getStartLessonByName(lessonObjects.objectName + '6')
        LECourseLessonPlayerPage.getLessonByStatus(lessonObjects.objectName + '6', 'Complete')
        cy.get(LECourseLessonPlayerPage.getSidebarHeader()).eq(0).find(LECourseLessonPlayerPage.getCountPill()).contains('5/6')
        //Start 7th Object Lesson
        LECourseLessonPlayerPage.getStartLessonByName(lessonObjects.objectName + '7')
        LECourseLessonPlayerPage.getLessonByStatus(lessonObjects.objectName + '7', 'Complete')
        cy.get(LECourseLessonPlayerPage.getSidebarHeader()).eq(0).find(LECourseLessonPlayerPage.getCountPill()).contains('6/6')
        cy.get(LECourseLessonPlayerPage.getXBtn()).click()
        cy.get(LECourseDetailsOCModule.getCourseProgressPercentText()).should('contain', '100%')
        
    })
    
        


        
        

    })