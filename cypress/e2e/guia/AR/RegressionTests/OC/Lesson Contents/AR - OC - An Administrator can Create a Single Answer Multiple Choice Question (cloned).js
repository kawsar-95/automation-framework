import AROCAddEditPage from "../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage";
import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARAddObjectLessonModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal";
import ARSelectLearningObjectModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal";
import { commonDetails } from "../../../../../../../helpers/TestData/Courses/commonDetails";
import { lessonAssessment, ocDetails } from "../../../../../../../helpers/TestData/Courses/oc";
import { miscData } from "../../../../../../../helpers/TestData/Misc/misc";
import { questionDetails } from "../../../../../../../helpers/TestData/QuestionBank/questionBanksDetails";
import { users } from "../../../../../../../helpers/TestData/users/users";

describe('C775 AUT-207, AR - OC - An Administrator can Create a Single Answer Multiple Choice Question (cloned)', function () {
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
    })

    after(function() {        
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Create Online Course with Single Answer Multiple Choice Question', () =>{
        cy.createCourse('Online Course')

        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        // Add learning object Assessment        
        ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        ARAddObjectLessonModal.getTxtFByName('Assessment Name', lessonAssessment.ocAssessmentName)
        
        // Add Assesment Weight
        cy.get(ARAddObjectLessonModal.getAddassessmentweight()).clear().type(10)

        // Expand Questions under Assessment  
        cy.get(ARAddObjectLessonModal.getExpandQuestionsbutton()).click()
        cy.get(ARAddObjectLessonModal.getManageQuestions()).click()
        cy.get(ARAddObjectLessonModal.getAddQuestions()).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        // Enter Valid Name
        cy.get(ARAddObjectLessonModal.getQuestionNameTextBox()).clear()
        cy.get(ARAddObjectLessonModal.getQuestionNameTextBox()).type(questionDetails.questionName)

        // Ensure ability to add a Multiple Choice (Single Answer) question type
        cy.get(ARAddObjectLessonModal.getQuestionTypeSelectedLabel()).should('contain', 'Multiple Choice (Single Answer)')

        // Option text fields allow up to 4000 characters
        cy.get(ARAddObjectLessonModal.getQuestionOptionByIndex()).clear().invoke('val', ARDashboardPage.getLongString(4000)).type('a')
        cy.get(ARAddObjectLessonModal.getQuestionOptionErrorMsgByIndex()).first().should('contain', miscData.char_4000_error)
        
        // Option cannot be null
        cy.get(ARAddObjectLessonModal.getQuestionOptionByIndex()).clear().blur()
        cy.get(ARAddObjectLessonModal.getQuestionOptionErrorMsgByIndex()).first().should('contain', miscData.field_required_error)

        // Enter Valid Option
        cy.get(ARAddObjectLessonModal.getQuestionOptionByIndex()).clear().type(questionDetails.option0)
        
        // 2. User can add up to 10 options
        cy.get(ARAddObjectLessonModal.getAddOption()).click()
        cy.get(ARAddObjectLessonModal.getQuestionOptionByIndex("1")).type(questionDetails.option1)
        cy.get(ARAddObjectLessonModal.getAddOption()).click()
        cy.get(ARAddObjectLessonModal.getQuestionOptionByIndex("2")).type(questionDetails.option2)
        cy.get(ARAddObjectLessonModal.getAddOption()).click()
        cy.get(ARAddObjectLessonModal.getQuestionOptionByIndex("3")).type(questionDetails.option3)
        cy.get(ARAddObjectLessonModal.getAddOption()).click()
        cy.get(ARAddObjectLessonModal.getQuestionOptionByIndex("4")).type(questionDetails.option4)
        cy.get(ARAddObjectLessonModal.getAddOption()).click()
        cy.get(ARAddObjectLessonModal.getQuestionOptionByIndex("5")).type(questionDetails.option5)
        cy.get(ARAddObjectLessonModal.getAddOption()).click()
        cy.get(ARAddObjectLessonModal.getQuestionOptionByIndex("6")).type(questionDetails.option6)
        cy.get(ARAddObjectLessonModal.getAddOption()).click()
        cy.get(ARAddObjectLessonModal.getQuestionOptionByIndex("7")).type(questionDetails.option7)
        cy.get(ARAddObjectLessonModal.getAddOption()).click()
        cy.get(ARAddObjectLessonModal.getQuestionOptionByIndex("8")).type(questionDetails.option8)
        cy.get(ARAddObjectLessonModal.getAddOption()).click()
        cy.get(ARAddObjectLessonModal.getQuestionOptionByIndex("9")).type(questionDetails.option9)
        
        // Add Option button becomes disabled
        cy.get(ARAddObjectLessonModal.getAddOption()).should('have.attr', 'aria-disabled', 'true')

        // 2. remove options
        ARAddObjectLessonModal.deleteOptionByName(questionDetails.option9)
        ARAddObjectLessonModal.deleteOptionByName(questionDetails.option8)
        ARAddObjectLessonModal.deleteOptionByName(questionDetails.option2)
        ARAddObjectLessonModal.deleteOptionByName(questionDetails.option6)
        ARAddObjectLessonModal.deleteOptionByName(questionDetails.option3)
        ARAddObjectLessonModal.deleteOptionByName(questionDetails.option7)

        // A single correct answer is required
        ARDashboardPage.generalToggleSwitch('true', ARAddObjectLessonModal.getOptionAnswersToggleContainerByIndex("0"))
        ARDashboardPage.generalToggleSwitch('true', ARAddObjectLessonModal.getOptionAnswersToggleContainerByIndex("1"))
        cy.get(ARAddObjectLessonModal.getOptionAnswersError()).should('contain', 'A single correct answer is required.')

        ARDashboardPage.generalToggleSwitch('false', ARAddObjectLessonModal.getOptionAnswersToggleContainerByIndex("0"))
        ARDashboardPage.generalToggleSwitch('false', ARAddObjectLessonModal.getOptionAnswersToggleContainerByIndex("1"))
        cy.get(ARAddObjectLessonModal.getOptionAnswersError()).should('contain', 'A single correct answer is required.')

        ARDashboardPage.generalToggleSwitch('true', ARAddObjectLessonModal.getOptionAnswersToggleContainerByIndex("0"))

        // When Weight Per Question is null
        cy.get(ARAddObjectLessonModal.getWeightPerQuestion()).clear()
        cy.get(ARAddObjectLessonModal.getWeightPerQuestionErrorMsg()).should('contain', miscData.field_required_error)
        cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).filter(':contains("Save")').should('have.attr', 'aria-disabled', 'true')
        // When Weight Per Question is negative
        cy.get(ARAddObjectLessonModal.getWeightPerQuestion()).type(-55)
        cy.get(ARAddObjectLessonModal.getWeightPerQuestionErrorMsg()).should('contain', miscData.negative_chars_error)

        // When Weight Per Question is > 100
        cy.get(ARAddObjectLessonModal.getWeightPerQuestion()).clear().type(160)
        cy.get(ARAddObjectLessonModal.getWeightPerQuestionErrorMsg()).should('contain', miscData.char_1000_error)

        // Weight Per Question field does not accept non-numeric characters
        cy.get(ARAddObjectLessonModal.getWeightPerQuestion()).clear().type('dfgdg')
        cy.get(ARAddObjectLessonModal.getWeightPerQuestionErrorMsg()).should('contain', miscData.field_required_error)

        // validation error displays and save button is disabled
        cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).filter(':contains("Save")').should('have.attr', 'aria-disabled', 'true')
        // Enter valid Value
        cy.get(ARAddObjectLessonModal.getWeightPerQuestion()).clear().type(65)
        
        // Save Question
        cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).filter(':contains("Save")').should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).filter(':contains("Save")').should('not.exist')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).eq(1).click({ force: true })    
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).should('have.attr', 'aria-disabled', 'false').click({ force: true })        
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).should('not.exist')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        // Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Course successfully published')
    })

    it('Edit Online Course and edit Question', () =>{
        cy.editCourse(ocDetails.courseName)

        // Verify lesson object and edit lesson object
        cy.get(AROCAddEditPage.getLearningObjectName()).should('contain', lessonAssessment.ocAssessmentName)
        AROCAddEditPage.getEditBtnByLessonNameThenClick(lessonAssessment.ocAssessmentName)

        // Expand Question under Assessment  
        cy.get(ARAddObjectLessonModal.getExpandQuestionsbutton()).click()
        cy.get(ARAddObjectLessonModal.getManageQuestions()).click()

        // 5. Ensure ability to edit Questions
        ARAddObjectLessonModal.editQuestionByName(questionDetails.questionName)
        // verify Question name
        cy.get(ARAddObjectLessonModal.getQuestionNameTextBox()).should('have.text', questionDetails.questionName)

        // verify Question Type
        cy.get(ARAddObjectLessonModal.getQuestionTypeSelectedLabel()).should('contain', 'Multiple Choice (Single Answer)')

        // edit options
        cy.get(ARAddObjectLessonModal.getQuestionOptionByIndex("0")).should('have.value', questionDetails.option0)
        cy.get(ARAddObjectLessonModal.getQuestionOptionByIndex("2")).clear().type(questionDetails.option9)
        
        // 3. remove options
        ARAddObjectLessonModal.deleteOptionByName(questionDetails.option1)
        
        // edit Weight Per Question
        cy.get(ARAddObjectLessonModal.getWeightPerQuestion()).should('have.value', 65)
        cy.get(ARAddObjectLessonModal.getWeightPerQuestion()).clear().type(75)
        
        // Save Question
        cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).filter(':contains("Save")').should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).filter(':contains("Save")').should('not.exist')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).eq(1).click({ force: true })    
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).should('have.attr', 'aria-disabled', 'false').click({ force: true })        
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).should('not.exist')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        // Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit Online Course and Delete Question', () =>{
        cy.editCourse(ocDetails.courseName)

        // Verify lesson object and edit lesson object
        cy.get(AROCAddEditPage.getLearningObjectName()).should('contain', lessonAssessment.ocAssessmentName)
        AROCAddEditPage.getEditBtnByLessonNameThenClick(lessonAssessment.ocAssessmentName)

        // Expand Question under Assessment
        cy.get(ARAddObjectLessonModal.getExpandQuestionsbutton()).click()
        cy.get(ARAddObjectLessonModal.getManageQuestions()).click()

        // 6. Ensure ability to delete question
        ARAddObjectLessonModal.deleteQuestionByName(questionDetails.questionName)
        // verify question deleted
        cy.get(ARAddObjectLessonModal.getQuestionsName()).should('not.exist')
        cy.get(ARAddObjectLessonModal.getNoQuestionsMessage()).should('have.text', 'No questions have been added.')

        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).eq(1).click({ force: true })    
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).should('have.attr', 'aria-disabled', 'false').click({ force: true })        
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).should('not.exist')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        // Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })
})