import users from '../../../../../../fixtures/users.json'
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arOCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectLearningObjectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARAddTaskLessonModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARAddTaskLessonModal'
import { ocDetails, lessonTask } from '../../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'



describe('AR - Regress - CED - OC - Lesson - Task T832328', function(){

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

    it('Create OC Course, Verify Task Lesson Fields, Saving & Editing', () => { 
        cy.createCourse('Online Course')
        
        //Verify Task Lesson Can Be Selected
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Task')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        //Verify the Back Button will Return You to Lesson Type Selection
        cy.get(ARAddTaskLessonModal.getBackBtn()).click()
        arOCAddEditPage.getVShortWait()
        cy.get(ARSelectLearningObjectModal.getModalTitle()).should('contain', 'Add Learning Object')
        //Click Next Button after Returning From Back Button
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()

        //Verify Task Name Cannot Be Empty
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getNameTxt())).clear()
        cy.get(ARAddTaskLessonModal.getNameErrorMsg()).should('contain', 'Field is required.')
        //Verify Task Name Does Not Accept HTML
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getNameTxt())).type(commonDetails.textWithHtmlTag)
        arOCAddEditPage.getVShortWait() //Wait for Save btn to become enabled
        cy.get(ARAddTaskLessonModal.getSaveBtn()).click()
        arOCAddEditPage.getVShortWait()
        cy.get(ARAddTaskLessonModal.getDetailsErrorMsg()).should('contain', 'Field contains invalid characters.')
        //Add Valid Value to Name Field
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getNameTxt())).clear().type(lessonTask.ocTaskName)

        //Verify Description Field Accepts HTML Tags
        cy.get(ARAddTaskLessonModal.getDescriptionTxtF()).type(commonDetails.textWithHtmlTag)

        //Turn on Task is Scored, add Pass Grade & Weight
        cy.get(ARAddTaskLessonModal.getTaskIsScoredToggle()).click()
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getGradeToPassTxt())).clear().type('50')
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getWeightTxt())).clear().type('12')

        //Expand Messages Section, Turn Allow Notifications Toggle ON
        cy.get(ARAddTaskLessonModal.getExpandMessagesBtn()).click()
        cy.get(ARAddTaskLessonModal.getAllowNotificationToggle()).click()
        //Verify Placeholder Text
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getNotificationInstructionTxt()))
            .should('have.attr', 'placeholder', 'Click below to confirm you are ready for the task')
        //Verify Instructions Field Does Not Accept >255 Chars
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getNotificationInstructionTxt()))
            .invoke('val', arOCAddEditPage.getLongString()).type('a')
        cy.get(ARAddTaskLessonModal.getNotificationInstructionErrorMsg()).should('contain', 'Field cannot be more than 255 characters.')
        //Add Value Valid to Instructions Field
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getNotificationInstructionTxt())).clear().type(lessonTask.ocInstructions)

        //Turn On Send Task Notification Check Box
        cy.get(ARAddTaskLessonModal.getSendTaskNotificationChkBox()).click()
        arOCAddEditPage.getVShortWait() //Wait for Save btn to become enabled

        //Save Task
        cy.get(ARAddTaskLessonModal.getSaveBtn()).click()
        arOCAddEditPage.getLShortWait()

        //Edit Task, Verify Fields Persisted
        arOCAddEditPage.getEditBtnByLessonNameThenClick(lessonTask.ocTaskName)
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getNameTxt())).should('have.value', lessonTask.ocTaskName)
        cy.get(ARAddTaskLessonModal.getDescriptionTxtF()).should('contain.text', commonDetails.textWithHtmlTag)
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getGradeToPassTxt())).should('have.value', '50')
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getWeightTxt())).should('have.value', '12')
        cy.get(ARAddTaskLessonModal.getExpandMessagesBtn()).click()
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getNotificationInstructionTxt())).should('have.value', lessonTask.ocInstructions)

        //Edit Task and Save
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getNameTxt())).clear().type(lessonTask.ocTaskName + commonDetails.appendText)
        cy.get(ARAddTaskLessonModal.getDescriptionTxtF()).clear().type(lessonTask.ocTaskDescription + commonDetails.appendText)
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getGradeToPassTxt())).clear().type('55')
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getWeightTxt())).clear().type('5')
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getNotificationInstructionTxt())).clear().type(lessonTask.ocInstructions + commonDetails.appendText)
        cy.get(ARAddTaskLessonModal.getSaveBtn()).click()
        arOCAddEditPage.getLShortWait()

        //Edit Task, Verify Fields Persisted
        arOCAddEditPage.getEditBtnByLessonNameThenClick(lessonTask.ocTaskName + commonDetails.appendText)
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getNameTxt())).should('have.value', lessonTask.ocTaskName + commonDetails.appendText)
        cy.get(ARAddTaskLessonModal.getDescriptionTxtF()).should('contain.text', lessonTask.ocTaskDescription + commonDetails.appendText)
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getGradeToPassTxt())).should('have.value', '55')
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getWeightTxt())).should('have.value', '5')
        cy.get(ARAddTaskLessonModal.getExpandMessagesBtn()).click()
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getNotificationInstructionTxt())).should('have.value', lessonTask.ocInstructions + commonDetails.appendText)

        //Verify Cancel Button Closes Modal
        cy.get(ARAddTaskLessonModal.getCancelBtn()).click()
        arOCAddEditPage.getShortWait()
        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit OC Course, Verify Task Lesson Persisted', () => { 
        //Filter for Course & Edit it
        cy.editCourse(ocDetails.courseName)
        arOCAddEditPage.getMediumWait()

        //Verify Lesson Task Field Values Persisted
        arOCAddEditPage.getEditBtnByLessonNameThenClick(lessonTask.ocTaskName + commonDetails.appendText)
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getNameTxt())).should('have.value', lessonTask.ocTaskName + commonDetails.appendText)
        cy.get(ARAddTaskLessonModal.getDescriptionTxtF()).should('contain.text', lessonTask.ocTaskDescription + commonDetails.appendText)
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getGradeToPassTxt())).should('have.value', '55')
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getWeightTxt())).should('have.value', '5')
        cy.get(ARAddTaskLessonModal.getExpandMessagesBtn()).click()
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getNotificationInstructionTxt())).should('have.value', lessonTask.ocInstructions + commonDetails.appendText)
        cy.get(ARAddTaskLessonModal.getCancelBtn()).click()
        arOCAddEditPage.getShortWait()
    })
})
