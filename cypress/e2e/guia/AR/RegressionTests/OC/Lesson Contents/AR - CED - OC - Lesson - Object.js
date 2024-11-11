// AR -  CED - OC - Lesson - Object.js
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arOCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARAddObjectLessonModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import ARDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARSelectLearningObjectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { lessonObjects, ocDetails } from '../../../../../../../helpers/TestData/Courses/oc'
import miscData from '../../../../../../fixtures/miscData.json'
import users from '../../../../../../fixtures/users.json'


describe('AR - CED - OC - Lesson - Object - Create Course', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Create OC Course, Verify Object Lesson Fields, Saving & Editing', () => { 
        cy.createCourse('Online Course')

        //Verify Object Lesson Can Be Selected
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        //Verify the Back Button will Return You to Lesson Type Selection
        cy.get(ARAddObjectLessonModal.getBackBtn()).click()
        arOCAddEditPage.getVShortWait()
        cy.get(ARSelectLearningObjectModal.getModalTitle()).should('contain', 'Add Learning Object')
        //Click Next Button after Returning From Back Button
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()

        //Verify Object Name Cannot Be Empty
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARAddObjectLessonModal.getNameTxt())).type('a').clear()
        cy.get(ARAddObjectLessonModal.getNameErrorMsg()).should('contain', 'Field is required.')

        //Set Source to URL
        cy.get(ARAddObjectLessonModal.getSourceRadioBtn()).contains('Url').click()
        cy.get(ARAddObjectLessonModal.getURLTxtF()).type(miscData.REMOTE_VIDEO_URL)

        //Verify Desktop Launch Options Can be Toggled
        cy.get(ARAddObjectLessonModal.getDesktopRadioBtn()).contains('Launch in a popup').click().click()
        cy.get(ARAddObjectLessonModal.getDesktopRadioBtn()).contains('Launch in a modal (iFrame)').click().click()

        //Add a Description and Right Align Text
        cy.get(ARAddObjectLessonModal.getObjectDescriptionTxtF()).type(ocDetails.description)
        cy.get(ARAddObjectLessonModal.getObjectDescriptionTxtF()).type('{selectall}')
        arCoursesPage.getRightAlignBtnByLabelThenClick('Description')

        //Add Text to Notes Field
        cy.get(ARAddObjectLessonModal.getNotesTxtF()).type(lessonObjects.objectNotes)

        //HTML Tests Now that All Required Fields Are Filled Out
        //Verify Object Name, Source, and Notes Fields Do Not Accept HTML
        for (let i = 0; i < lessonObjects.funcNames.length; i++) {
            //Add HTML to Field
            cy.get(lessonObjects.funcNames[i]).type(commonDetails.textWithHtmlTag)
            
            arOCAddEditPage.getVShortWait() //Wait for Save btn to become enabled
            cy.get(ARAddObjectLessonModal.getApplyBtn()).click()
            arOCAddEditPage.getVShortWait()
            cy.get(arOCAddEditPage.getElementByDataNameAttribute(ARAddObjectLessonModal.getModalErrorMsg()))
                .should('contain', miscData.INVALID_CHARS_ERROR)
            //Add Valid Value to Field
            cy.get(lessonObjects.funcNames[i]).clear().type(lessonObjects.validValues[i])
        }

        //Verify Description Field Does Accept HTML
        cy.get(ARAddObjectLessonModal.getObjectDescriptionTxtF()).clear()
        cy.get(ARAddObjectLessonModal.getObjectDescriptionTxtF()).type(commonDetails.textWithHtmlTag)

        //Save Object
        cy.get(ARAddObjectLessonModal.getApplyBtn()).click()
        cy.get(ARAddObjectLessonModal.getObjectDescriptionTxtF()).should('not.exist')
        cy.get(ARAddObjectLessonModal.getWaitSpinner()).should('not.exist')
        arOCAddEditPage.getMediumWait()

        //Verify Object Field Values Persisted
        arOCAddEditPage.getEditBtnByLessonNameThenClick(lessonObjects.objectName)
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARAddObjectLessonModal.getNameTxt())).should('have.value', lessonObjects.objectName)
        cy.get(ARAddObjectLessonModal.getURLTxtF()).should('have.value', miscData.REMOTE_VIDEO_URL)
        cy.get(ARAddObjectLessonModal.getNotesTxtF()).should('contain.text', lessonObjects.objectNotes)
        cy.get(ARAddObjectLessonModal.getObjectDescriptionTxtF()).should('contain.text', commonDetails.textWithHtmlTag)

        //Edit Object Lesson Fields and Save
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARAddObjectLessonModal.getNameTxt())).type(lessonObjects.objectName + commonDetails.appendText)
        cy.get(ARAddObjectLessonModal.getURLTxtF()).type(`/${commonDetails.appendText}`)
        cy.get(ARAddObjectLessonModal.getNotesTxtF()).type(commonDetails.appendText)
        cy.get(ARAddObjectLessonModal.getObjectDescriptionTxtF()).type(commonDetails.appendText)
        cy.get(ARAddObjectLessonModal.getApplyBtn()).click()
        arOCAddEditPage.getLShortWait()

        //Add a Second Object Lesson and Save
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        //Add Valid Values to Fields
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARAddObjectLessonModal.getNameTxt())).type(`${lessonObjects.objectName} - 2`)
        cy.get(ARAddObjectLessonModal.getSourceRadioBtn()).contains('Url').click().click()
        cy.get(ARAddObjectLessonModal.getURLTxtF()).type(`${miscData.REMOTE_VIDEO_URL} - 2`)
        arOCAddEditPage.getVShortWait()
        cy.get(ARAddObjectLessonModal.getApplyBtn()).click()
        cy.get(ARAddObjectLessonModal.getURLTxtF()).should('not.exist')
        cy.get(ARAddObjectLessonModal.getWaitSpinner()).should('not.exist')
        arOCAddEditPage.getLShortWait()

        //Verify Object 1's Field Values Persisted After Adding a Second Object
        arOCAddEditPage.getEditBtnByLessonNameThenClick(`${lessonObjects.objectName}${commonDetails.appendText}`)
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARAddObjectLessonModal.getNameTxt())).should('have.value', `${lessonObjects.objectName}${commonDetails.appendText}`)
        cy.get(ARAddObjectLessonModal.getURLTxtF()).should('have.value', `${miscData.REMOTE_VIDEO_URL}/${commonDetails.appendText}`)
        cy.get(ARAddObjectLessonModal.getNotesTxtF()).should('contain.text', `${lessonObjects.objectNotes}${commonDetails.appendText}`)
        cy.get(ARAddObjectLessonModal.getObjectDescriptionTxtF()).should('contain.text', `${commonDetails.textWithHtmlTag}${commonDetails.appendText}`)
        //Close Modal
        cy.get(ARAddObjectLessonModal.getCancelBtn()).click()
        cy.get(ARAddObjectLessonModal.getObjectDescriptionTxtF()).should('not.exist')
        cy.get(ARAddObjectLessonModal.getWaitSpinner()).should('not.exist')
        arOCAddEditPage.getLShortWait()

        //Verify Object 2's Field Values Persisted
        arOCAddEditPage.getEditBtnByLessonNameThenClick(`${lessonObjects.objectName} - 2`)
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARAddObjectLessonModal.getNameTxt())).should('have.value', `${lessonObjects.objectName} - 2`)
        cy.get(ARAddObjectLessonModal.getURLTxtF()).should('have.value', `${miscData.REMOTE_VIDEO_URL} - 2`)
        //Close Modal
        cy.get(ARAddObjectLessonModal.getCancelBtn()).click()
        arOCAddEditPage.getShortWait()

        //Publish the Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })
})

describe('AR - Regress - CED - OC - Lesson - Object', function(){

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

    it('Edit OC Course, Verify Object Lesson Fields, Delete Object Lesson', () => { 
        //Verify Object 1's Field Values Persisted After Publishing
        cy.get(ARAddObjectLessonModal.getWaitSpinner()).should('not.exist')
        arOCAddEditPage.getEditBtnByLessonNameThenClick(lessonObjects.objectName + commonDetails.appendText)
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARAddObjectLessonModal.getNameTxt())).should('have.value', lessonObjects.objectName + commonDetails.appendText)
        cy.get(ARAddObjectLessonModal.getURLTxtF()).should('have.value', `${miscData.REMOTE_VIDEO_URL}/${commonDetails.appendText}`)
        cy.get(ARAddObjectLessonModal.getNotesTxtF()).should('contain.text', lessonObjects.objectNotes + commonDetails.appendText)
        cy.get(ARAddObjectLessonModal.getObjectDescriptionTxtF()).should('contain.text', commonDetails.textWithHtmlTag + commonDetails.appendText)
        //Close Modal
        cy.get(ARAddObjectLessonModal.getCancelBtn()).click()
        cy.get(ARAddObjectLessonModal.getObjectDescriptionTxtF()).should('not.exist')
        cy.get(ARAddObjectLessonModal.getWaitSpinner()).should('not.exist')
        arOCAddEditPage.getMediumWait()

        //Verify Object 2's Field Values Persisted After Publishing
        arOCAddEditPage.getEditBtnByLessonNameThenClick(`${lessonObjects.objectName} - 2`)
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARAddObjectLessonModal.getNameTxt())).should('have.value', `${lessonObjects.objectName} - 2`)
        cy.get(ARAddObjectLessonModal.getURLTxtF()).should('have.value', `${miscData.REMOTE_VIDEO_URL} - 2`)
        //Close Modal
        cy.get(ARAddObjectLessonModal.getCancelBtn()).click()
        arOCAddEditPage.getShortWait()

        //Delete 2nd Object Lesson
        arOCAddEditPage.getDeleteBtnByLessonNameThenClick(`${lessonObjects.objectName} - 2`)
        cy.get(arOCAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        arOCAddEditPage.getShortWait()

        //Publish the Course
        cy.publishCourse()
    })

    it('Edit OC Course, Verify Object Lesson 2 Was Deleted', () => { 
        cy.get(arOCAddEditPage.getLearningObjectName()).contains(`${lessonObjects.objectName} - 2`).should('not.exist')
    })
})