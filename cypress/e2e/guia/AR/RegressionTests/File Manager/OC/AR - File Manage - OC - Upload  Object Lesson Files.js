// AR -  CED - OC - Lesson - Object.js
import users from '../../../../../../fixtures/users.json'
import miscData from '../../../../../../fixtures/miscData.json'
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arOCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectLearningObjectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARAddObjectLessonModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import ARDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { ocDetails, lessonObjects } from '../../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import ARUploadFileModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'

/**
 * Testrail URL:
 * https://absorblms.testrail.io//index.php?/tests/view/288885
 * Original NASA story: https://absorblms.atlassian.net/browse/NASA-6779
 * Automation Subtask: https://absorblms.atlassian.net/browse/NASA-7502
 */

describe('AR - CED - OC - Lesson - Object - Create Course - T288885', function(){

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

    it('Create OC Course, Add File to object lesson using File Manager, Save lesson, Publish course', () => { 
        cy.createCourse('Online Course')

        //Verify Object Lesson Can Be Selected
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()

        //Add Valid Name to Object Lesson
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARSelectLearningObjectModal.getNameTxt())).type(lessonObjects.ocObjectNameFileManager)

        //Set Source to be file
      //  cy.get(ARSelectLearningObjectModal.getSelectFileBtnOption()).click()

        //Choose a File
        cy.get(ARAddObjectLessonModal.getChooseFileBtn()).click()

        //Select upload from the media library
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(lessonObjects.objectUploadPathFM)

        // Save the Object lesson
        arOCAddEditPage.getMediumWait()
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        arOCAddEditPage.getMediumWait()
        cy.get(ARAddObjectLessonModal.getApplyBtn()).click()
        arOCAddEditPage.getMediumWait()
        cy.get(ARAddObjectLessonModal.getObjectDescriptionTxtF()).should('not.exist')
        cy.get(ARAddObjectLessonModal.getWaitSpinner()).should('not.exist')
        arOCAddEditPage.getMediumWait()

        //Publish the Course
        cy.publishCourseAndReturnId().then((id) => {
        commonDetails.courseID = id.request.url.slice(-36);
        })
    })
})

 