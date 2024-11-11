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

describe('AR - Regress - CED - OC - Lesson - Video - Create Course T832327', {browser: '!firefox'}, function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Create OC Course, Verify Video Lesson Fields, Saving & Editing', () => { 
        cy.createCourse('Online Course')

        //Verify Video Lesson Can Be Selected
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Video')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()

        //Assert Name Field Cannot Be Blank
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddVideoLessonModal.getNameTxt())).type('a').clear()
        cy.get(ARAddVideoLessonModal.getNameErrorMsg()).should('contain', miscData.FIELD_REQUIRED_ERROR)
        
        //Add Valid Name to Video Lesson
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddVideoLessonModal.getNameTxt())).type(lessonVideo.ocVideoName)

        //Add Description and Set Text to Underline
        cy.get(ARAddVideoLessonModal.getVideoDescriptionTxtF()).type(lessonVideo.ocVideoDescription)
        cy.get(ARAddVideoLessonModal.getVideoDescriptionTxtF()).type('{selectall}')
        arCoursesPage.getUnderlineBtnByLabelThenClick('Description')

        //Add a Note
        cy.get(ARAddVideoLessonModal.getNotesTxtF()).type(lessonVideo.videoNotes)

        //Turn the Disable Seeking Toggle ON
        cy.get(arOCAddEditPage.getElementByDataNameAttribute(ARAddVideoLessonModal.getDisableSeekingToggleContainer()) + ' ' + arOCAddEditPage.getToggleDisabled()).click()

        //Assert Width and Height Fields Do Not Accept Negative Values
        cy.get(ARAddVideoLessonModal.getWidthTxtF()).type('-1')
        cy.get(ARAddVideoLessonModal.getWidthErrorMsg()).should('contain', miscData.NEGATIVE_CHARS_ERROR)
        cy.get(ARAddVideoLessonModal.getHeightTxtF()).type('-1')
        cy.get(ARAddVideoLessonModal.getHeightErrorMsg()).should('contain', miscData.NEGATIVE_CHARS_ERROR)

        //Assert Width and Height Fields Do Not Accept Non-Numeric Values (field is auto-cleared)
        cy.get(ARAddVideoLessonModal.getWidthTxtF()).clear().type('a').blur()
        cy.get(ARAddVideoLessonModal.getWidthTxtF()).should('have.value', '')
        cy.get(ARAddVideoLessonModal.getHeightTxtF()).clear().type('a').blur()
        cy.get(ARAddVideoLessonModal.getHeightTxtF()).should('have.value', '')

        //Add Valid Width and Height to Video Lesson
        cy.get(ARAddVideoLessonModal.getWidthTxtF()).type('640')
        cy.get(ARAddVideoLessonModal.getHeightTxtF()).type('480')

        //Add a Poster Image Via File Upload
        cy.get(ARAddVideoLessonModal.getPosterChooseFileBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.posterImgName)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click
        ARUploadFileModal.getVShortWait()
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        ARUploadFileModal.getLShortWait()

        //Add a Video Label
        cy.get(ARAddVideoLessonModal.getVideoSourceLabelTxtF()).type(lessonVideo.videoLabel)

        //Add a Video Via File Upload
        cy.get(ARAddVideoLessonModal.getVideoSourceChooseFileBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.videoPath + lessonVideo.videoName)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click
        ARUploadFileModal.getShortWait()
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        ARUploadFileModal.getMediumWait()

        //Save the Video Lesson
        cy.get(ARAddVideoLessonModal.getApplyBtn()).should('be.visible').click()
        ARUploadFileModal.getLShortWait()

        //Publish the Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })
})

describe('AR - Regress - CED - OC - Lesson - Video', {browser: '!firefox'}, function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        //Filter for Course & Edit it
        cy.editCourse(ocDetails.courseName)
        arOCAddEditPage.getMediumWait()
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Edit OC Course & Verify Video Lesson Has Been Persisted, Edit Video Lesson and Add Another', () => {
        //Edit Video Lesson
        arOCAddEditPage.getEditBtnByLessonNameThenClick(lessonVideo.ocVideoName)

        //Assert Video Fields Persisted
        cy.get(ARAddVideoLessonModal.getVideoDescriptionTxtF()).should('contain.text', lessonVideo.ocVideoDescription)
        cy.get(ARAddVideoLessonModal.getNotesTxtF()).should('have.value', lessonVideo.videoNotes)
        cy.get(arOCAddEditPage.getElementByDataNameAttribute(ARAddVideoLessonModal.getDisableSeekingToggleContainer()) + ' ' + arOCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        cy.get(ARAddVideoLessonModal.getWidthTxtF()).should('have.value', '640')
        cy.get(ARAddVideoLessonModal.getHeightTxtF()).should('have.value', '480')
        cy.get(ARAddVideoLessonModal.getPosterFilePathF()).should('have.value', commonDetails.posterImgName)
        cy.get(ARAddVideoLessonModal.getVideoSourceFilePathF()).should('have.value', lessonVideo.videoName)

        //Edit Fields and Save First Video Lesson Edits
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddVideoLessonModal.getNameTxt())).type(commonDetails.appendText)
        cy.get(ARAddVideoLessonModal.getVideoDescriptionTxtF()).type(commonDetails.appendText)
        cy.get(ARAddVideoLessonModal.getNotesTxtF()).type(commonDetails.appendText)
        cy.get(ARAddVideoLessonModal.getWidthTxtF()).clear().type('700')
        cy.get(ARAddVideoLessonModal.getHeightTxtF()).clear().type('500')
        cy.get(ARAddVideoLessonModal.getApplyBtn()).click()
        ARUploadFileModal.getLShortWait()

        //Add Second Video Lesson
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Video')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        //Fill out Fields
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddVideoLessonModal.getNameTxt())).type(lessonVideo.ocVideoName2)
        cy.get(ARAddVideoLessonModal.getVideoDescriptionTxtF()).type(lessonVideo.ocVideoDescription)
        cy.get(ARAddVideoLessonModal.getNotesTxtF()).type(lessonVideo.videoNotes)
        cy.get(ARAddVideoLessonModal.getWidthTxtF()).type('640')
        cy.get(ARAddVideoLessonModal.getHeightTxtF()).type('480')
        
        //Select Url Source for Poster
        cy.get(ARAddVideoLessonModal.getPosterRadioBtn()).contains('Url').click().click()
        cy.get(ARAddVideoLessonModal.getPosterUrlFilePathTxtF()).type(miscData.SWITCHING_TO_ABSORB_IMG_URL)

        //Select Url Source for Video
        cy.get(ARAddVideoLessonModal.getVideoSourceRadioBtn()).contains('Url').click().click()
        //Assert URL Cannot be Blank
        cy.get(ARAddVideoLessonModal.getVideoSourceUrlFilePathTxtF()).type('a').clear()
        cy.get(ARAddVideoLessonModal.getVideoSourceUrlFilePathErrorMsg()).should('contain', miscData.FIELD_REQUIRED_ERROR)
        //Enter Valid URL
        cy.get(ARAddVideoLessonModal.getVideoSourceUrlFilePathTxtF()).type(miscData.REMOTE_VIDEO_URL)
        ARUploadFileModal.getVShortWait()

        //Save the Second Video Lesson
        cy.get(ARAddVideoLessonModal.getApplyBtn()).click()
        ARUploadFileModal.getLShortWait()

        //Publish the Course
        cy.publishCourse()
    })

    it('Edit OC Course & Verify Video Lesson Edits Have Persisted, Delete a Video Lesson', () => {
        //Edit First Video Lesson
        arOCAddEditPage.getEditBtnByLessonNameThenClick(lessonVideo.ocVideoName + commonDetails.appendText)
        //Assert Video Field Edits Persisted
        cy.get(ARAddVideoLessonModal.getVideoDescriptionTxtF()).should('contain.text', lessonVideo.ocVideoDescription + commonDetails.appendText)
        cy.get(ARAddVideoLessonModal.getNotesTxtF()).should('have.value', lessonVideo.videoNotes + commonDetails.appendText)
        cy.get(arOCAddEditPage.getElementByDataNameAttribute(ARAddVideoLessonModal.getDisableSeekingToggleContainer()) + ' ' + arOCAddEditPage.getToggleStatus())
            .should('have.attr', 'aria-checked', 'true')
        cy.get(ARAddVideoLessonModal.getWidthTxtF()).should('have.value', '700')
        cy.get(ARAddVideoLessonModal.getHeightTxtF()).should('have.value', '500')
        cy.get(ARAddVideoLessonModal.getPosterFilePathF()).should('have.value', commonDetails.posterImgName)
        cy.get(ARAddVideoLessonModal.getVideoSourceFilePathF()).should('have.value', lessonVideo.videoName)
        //Close Modal
        cy.get(ARAddVideoLessonModal.getCancelBtn()).click()
        arOCAddEditPage.getVShortWait()

        //Edit Second Video Lesson
        arOCAddEditPage.getEditBtnByLessonNameThenClick(lessonVideo.ocVideoName2)
        //Assert Video Field Edits Persisted
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddVideoLessonModal.getNameTxt())).should('have.value', lessonVideo.ocVideoName2)
        cy.get(ARAddVideoLessonModal.getVideoDescriptionTxtF()).should('contain.text', lessonVideo.ocVideoDescription)
        cy.get(ARAddVideoLessonModal.getNotesTxtF()).should('have.value', lessonVideo.videoNotes)
        cy.get(ARAddVideoLessonModal.getWidthTxtF()).should('have.value', '640')
        cy.get(ARAddVideoLessonModal.getHeightTxtF()).should('have.value', '480')
        cy.get(ARAddVideoLessonModal.getPosterUrlFilePathTxtF()).should('have.value', miscData.SWITCHING_TO_ABSORB_IMG_URL)
        cy.get(ARAddVideoLessonModal.getVideoSourceUrlFilePathTxtF()).should('have.value', miscData.REMOTE_VIDEO_URL)
        //Close Modal
        cy.get(ARAddVideoLessonModal.getCancelBtn()).click()
        arOCAddEditPage.getShortWait()

        //Delete Second Video Lesson
        arOCAddEditPage.getDeleteBtnByLessonNameThenClick(lessonVideo.ocVideoName2)
        cy.get(arCoursesPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        arOCAddEditPage.getShortWait()

        //Publish the Course
        cy.publishCourse()
    })

    it('Edit OC Course & Verify Video Lesson Deletion Has Persisted', () => {
        //Assert First Video Lesson Still Exists
        cy.get(arOCAddEditPage.getLearningObjectName()).contains(lessonVideo.ocVideoName + commonDetails.appendText).should('exist')
        //Assert Second Video Lesson was Deleted
        cy.get(arOCAddEditPage.getLearningObjectName()).contains(lessonVideo.ocVideoName2).should('not.exist')
    })
})