import users from '../../../../../../fixtures/users.json'
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arOCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectLearningObjectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARAddTaskLessonModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARAddTaskLessonModal'
import { ocDetails, lessonTask } from '../../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { miscData } from '../../../../../../../helpers/TestData/Misc/misc'


describe('C902 AUT-115, AR - OC - A Task Lesson Type Can be Scored & Appears with the Proper Design (cloned)', function(){
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, '/admin')
        arDashboardPage.getCoursesReport()
    })

    after(function() {
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Create OC Course, Verify Task Lesson Fields, Saving & Editing', () => { 
        cy.createCourse('Online Course')
        
        // Verify Task Lesson Can Be Selected
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Task')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()

        // Add Valid Value to Name Field
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getNameTxt())).clear().type(lessonTask.ocTaskName)

        // add Description
        cy.get(ARAddTaskLessonModal.getDescriptionTxtF()).type(lessonTask.ocTaskDescription)

        // Turn on/off Score toggle
        ARAddTaskLessonModal.generalToggleSwitch('false', ARAddTaskLessonModal.getTaskIsScoredToggleContainer())
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getGradeToPassTxt())).should('not.exist')
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getWeightTxt())).should('not.exist')
        ARAddTaskLessonModal.generalToggleSwitch('true', ARAddTaskLessonModal.getTaskIsScoredToggleContainer())
        
        // Score field validation:
        // Negative number
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getGradeToPassTxt())).clear().type(-50).blur()
        cy.get(ARAddTaskLessonModal.getPassingScoreError()).should('contain', miscData.negative_chars_error)
        // Non-numeric
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getGradeToPassTxt())).clear().type('Non-numeric').blur()
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getGradeToPassTxt())).should('not.have.value', 'Non-numeric')
        // More than 100
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getGradeToPassTxt())).clear().type(258).blur()
        cy.get(ARAddTaskLessonModal.getPassingScoreError()).should('contain', miscData.char_1000_error)

        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getGradeToPassTxt())).clear().type(50)

        // Weight field validation:
        // Negative number
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getWeightTxt())).clear().type(-50).blur()
        cy.get(ARAddTaskLessonModal.getWeightError()).should('contain', miscData.negative_chars_error)
        // Non-numeric
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getWeightTxt())).clear().type('Non-numeric').blur()
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getWeightTxt())).should('not.have.value', 'Non-numeric')
        // More than 500
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getWeightTxt())).clear().type(658).blur()
        cy.get(ARAddTaskLessonModal.getWeightError()).should('contain', miscData.char_500_error)

        // Add Weight
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getWeightTxt())).clear().type(12)

        //Save Task
        cy.get(ARAddTaskLessonModal.getSaveBtn()).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARAddTaskLessonModal.getSaveBtn()).click()
        cy.get(ARAddTaskLessonModal.getSaveBtn()).should('not.exist')
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')

        //Edit Task, Verify Fields Persisted
        arOCAddEditPage.getEditBtnByLessonNameThenClick(lessonTask.ocTaskName)
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getNameTxt())).should('be.visible').and('have.value', lessonTask.ocTaskName)
        cy.get(ARAddTaskLessonModal.getDescriptionTxtF()).should('contain.text', lessonTask.ocTaskDescription)
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getGradeToPassTxt())).should('have.value', '50')
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getWeightTxt())).should('have.value', '12')

        //Edit Task and Save
        cy.get(ARAddTaskLessonModal.getDescriptionTxtF()).clear().type(lessonTask.ocTaskDescription + commonDetails.appendText)
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getGradeToPassTxt())).clear().type(55)
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getWeightTxt())).clear().type(5)

        cy.get(ARAddTaskLessonModal.getSaveBtn()).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARAddTaskLessonModal.getSaveBtn()).click()
        cy.get(ARAddTaskLessonModal.getSaveBtn()).should('not.exist')
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')

        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
    })

    it('Edit OC Course, Verify Task Lesson Persisted', () => { 
        cy.editCourse(ocDetails.courseName)

        //Verify Lesson Task Field Values Persisted
        arOCAddEditPage.getEditBtnByLessonNameThenClick(lessonTask.ocTaskName)
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getNameTxt())).should('have.value', lessonTask.ocTaskName)
        cy.get(ARAddTaskLessonModal.getDescriptionTxtF()).should('contain.text', lessonTask.ocTaskDescription + commonDetails.appendText)
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getGradeToPassTxt())).should('have.value', 55)
        cy.get(arOCAddEditPage.getElementByAriaLabelAttribute(ARAddTaskLessonModal.getWeightTxt())).should('have.value', 5)     
    })
})
