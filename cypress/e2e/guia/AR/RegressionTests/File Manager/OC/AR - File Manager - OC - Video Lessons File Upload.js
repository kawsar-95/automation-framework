import users from '../../../../../../fixtures/users.json'
import miscData from '../../../../../../fixtures/miscData.json'
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arOCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectLearningObjectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARAddVideoLessonModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARAddVideoLessonModal'
import ARUploadFileModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import ARDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { ocDetails, lessonVideo } from '../../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'

//*This test currently skips the firefox browser as there is a cypress issue with uploading a video source file in firefox.*//
/**
 * Testrail URL:
 * https://absorblms.testrail.io//index.php?/tests/view/288885
 * Original NASA story: https://absorblms.atlassian.net/browse/NASA-6779
 * Automation Subtask: https://absorblms.atlassian.net/browse/NASA-7502
 */

describe('AR - Regress - CED - OC - Lesson - Video - Create Course - T288885', {browser: '!firefox'}, function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
    }) 

    it('Create OC Course, Upload Poster and Video files for lessons, Save Course and publish', () => { 
        cy.createCourse('Online Course')

        //Verify Video Lesson Can Be Selected
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Video')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()

        //Assert Name Field Cannot Be Blank
       // cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddVideoLessonModal.getNameTxt())).type('a').clear()
       // cy.get(ARAddVideoLessonModal.getNameErrorMsg()).should('contain', miscData.FIELD_REQUIRED_ERROR)
        
        //Add Valid Name to Video Lesson
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddVideoLessonModal.getNameTxt())).type(lessonVideo.ocVideoNameFileUpload)

        //Add a Poster Image Via File Upload
        cy.get(ARAddVideoLessonModal.getPosterChooseFileBtn()).click()
        //Select upload from the media library
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.posterFMUploadName)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click
        ARUploadFileModal.getVShortWait()
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        ARUploadFileModal.getLShortWait()

        //Add a Video Via File Upload
        cy.get(ARAddVideoLessonModal.getVideoSourceChooseFileBtn()).click()
        //Select upload from the media library
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.videoPath + lessonVideo.videoNameFileUploadMP4)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click
        ARUploadFileModal.getShortWait()
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        ARUploadFileModal.getLongWait()

        //Save the Video Lesson
        cy.get(ARAddVideoLessonModal.getApplyBtn()).should('be.visible').click()
        ARUploadFileModal.getLShortWait()

        //Publish the Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);

    })
    })
})