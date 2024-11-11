import ARDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARQuestionBanksPage from '../../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksPage'
import ARQuestionBanksAddEditPage from '../../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksAddEditPage'
import A5GlobalResourceAddEditPage from '../../../../../../../helpers/AR/pageObjects/GlobalResources/A5GlobalResourceAddEditPage'
import ARAddObjectLessonModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import ARDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARSelectLearningObjectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARUploadInstructionsModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARUploadInstructionsModal'
import AROCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { qbDetails } from '../../../../../../../helpers/TestData/QuestionBank/questionBanksDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { lessonAssessment } from '../../../../../../../helpers/TestData/Courses/oc'


describe('C777 - AR - CED - OC - Assessment - Manage - Question Banks', function () {

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

    })



    it('Verify Admin Can Create a New Question Bank ', () => {

        // Click the Courses menu item
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        ARDashboardPage.getMenuItemOptionByName('Question Banks')

        // Create Question 1
        cy.get(ARQuestionBanksPage.getA5PageHeaderTitle()).should('have.text', "Question Banks")
        ARQuestionBanksPage.getA5AddEditMenuActionsByNameThenClick('Question Bank')
        ARQuestionBanksPage.A5WaitForElementStateToChange(ARQuestionBanksAddEditPage.getA5NameTxtF())

        // Verify that the name field cannot be empty
        cy.get(ARQuestionBanksAddEditPage.getA5SaveBtn()).click()
        cy.get(ARQuestionBanksAddEditPage.getA5NameErrorMsg()).should('have.text', qbDetails.nameFieldErrorMsg)

        // Enter a name in the name text field
        cy.get(ARQuestionBanksAddEditPage.getA5NameTxtF()).type(qbDetails.questionBanksName)
        cy.get(ARQuestionBanksAddEditPage.getA5CreateQuestionBtn()).click()
        cy.get(ARQuestionBanksAddEditPage.getA5OptionAnswerBtn()).click()

        // Verify that Question and answer fields cannot be empty
        cy.get(ARQuestionBanksAddEditPage.getA5SaveBtn()).click()
        cy.get(ARQuestionBanksAddEditPage.getA5QuestionOrAnswerErrorMsg(1)).should('have.text', qbDetails.questionFieldErrorMsg)
        cy.get(ARQuestionBanksAddEditPage.getA5QuestionOrAnswerErrorMsg(2)).should('have.text', qbDetails.answerFieldErrorMsg)

        // Enter question and answer
        ARQuestionBanksAddEditPage.getVShortWait()
        cy.get(ARQuestionBanksAddEditPage.getA5EditQuestionBtnByIndex()).click()
        cy.get(ARQuestionBanksAddEditPage.getA5QuestionTxtA()).type(qbDetails.qb_question_1_text)
        cy.get(ARQuestionBanksAddEditPage.getA5OptionAnswerTxtFByIndex(1)).type(qbDetails.qb_q1_answer_1)
        cy.get(ARQuestionBanksAddEditPage.getA5OptionAnswerTxtFByIndex(2)).type(qbDetails.qb_q1_answer_2)

        //Save Question Bank
        cy.get(A5GlobalResourceAddEditPage.getA5SaveBtn()).click()
        ARDashboardPage.getShortWait()
    })

    it('Verify Question Bank Exists', () => {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Click the Courses menu item
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        ARDashboardPage.getMenuItemOptionByName('Question Banks')

        // Search and Edit Question Bank
        ARQuestionBanksPage.A5AddFilter('Name', 'Starts With', qbDetails.questionBanksName)
        ARQuestionBanksPage.getMediumWait()
        ARQuestionBanksAddEditPage.selectA5TableCellRecord(qbDetails.questionBanksName)
        ARQuestionBanksPage.A5WaitForElementStateToChange(ARQuestionBanksAddEditPage.getA5AddEditMenuActionsByIndex())
        ARDashboardPage.getMediumWait()
        ARQuestionBanksPage.getA5AddEditMenuActionsByNameThenClick('Edit')
        ARQuestionBanksPage.A5WaitForElementStateToChange(ARQuestionBanksAddEditPage.getA5EditQuestionBtnByIndex())

        cy.get(ARQuestionBanksAddEditPage.getA5EditQuestionBtnByIndex()).click()


        //Verify name persisted
        cy.get(A5GlobalResourceAddEditPage.getNameTxtF()).should('have.value', qbDetails.questionBanksName)


    })


    // Create OC By Managing Question Bank, save, cancel, edit
    it('Create Online Course, with assessment from questionbank', () => {

        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        

        //create online course with assessment
        cy.createCourse('Online Course')

        AROCAddEditPage.getShortWait()

        //Add learning object on assessment from questionbank
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARDashboardPage.getMediumWait()
        ARAddObjectLessonModal.getTxtFByName('Name', lessonAssessment.ocAssessmentName)
        ARDashboardPage.getMediumWait()
        cy.get(ARQuestionBanksAddEditPage.getExpandQuestionsDropdown()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARQuestionBanksAddEditPage.getManageQuestionsButton()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARQuestionBanksAddEditPage.getUseQuestionBankButton()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARQuestionBanksAddEditPage.getSelectQuestionBankDropdown()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARQuestionBanksAddEditPage.getEnterQuestionBankName()).type(qbDetails.questionBanksName)
        ARDashboardPage.getMediumWait()
        cy.get(ARQuestionBanksAddEditPage.getSelectQuestionBank()).first().click()
        ARDashboardPage.getShortWait()

        // question bank can be cancelled
        cy.get(ARQuestionBanksAddEditPage.getQuestionBankModalContainer()).within(() => {
            cy.get(ARQuestionBanksAddEditPage.getCancelBtn()).first().click()
        })


        // question bank can be saved
        ARDashboardPage.getShortWait()
        cy.get(ARQuestionBanksAddEditPage.getUseQuestionBankButton()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARQuestionBanksAddEditPage.getSelectQuestionBankDropdown()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARQuestionBanksAddEditPage.getEnterQuestionBankName()).type(qbDetails.questionBanksName)
        ARDashboardPage.getMediumWait()
        cy.get(ARQuestionBanksAddEditPage.getSelectQuestionBank()).first().click()
        ARDashboardPage.getShortWait()
        cy.get(ARQuestionBanksAddEditPage.getSaveButton()).click()

        ARDashboardPage.getShortWait()
        //Assert Question Bank name and Weight is visible
        cy.get(ARQuestionBanksAddEditPage.getElementByTitleAttribute(qbDetails.questionBanksName)).should('be.visible')
        cy.get(ARQuestionBanksAddEditPage.getElementByDataName("weight-label")).should('be.visible').and('contain', 'Weight')


        //question bank can be edited
        cy.get(ARQuestionBanksAddEditPage.getElementByAriaLabelAttribute("Edit Question Bank")).find("span").click()

        //click on cancel button
        ARDashboardPage.getShortWait()
        cy.get(ARQuestionBanksAddEditPage.getQuestionBankModalContainer()).within(() => {
            cy.get(ARQuestionBanksAddEditPage.getCancelBtn()).first().click()
        })




        //question bank can be deleted
        cy.get(ARQuestionBanksAddEditPage.getElementByAriaLabelAttribute("Delete Question Bank")).find("span").click()

        ARDashboardPage.getShortWait()
        cy.get(ARQuestionBanksAddEditPage.getElementByDataName("confirm")).click()
        ARDashboardPage.getShortWait()


        cy.get(ARQuestionBanksAddEditPage.getApplyButton()).click()
        cy.get(ARUploadInstructionsModal.getApplyBtn()).click()
        ARDashboardPage.getShortWait()


        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })


    })





    after(() => {
        //Delete course
        cy.deleteCourse(commonDetails.courseID)


        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        ARDashboardPage.getMenuItemOptionByName('Question Banks')
        cy.intercept('**/GetQuestionBanks').as('getQuestionBanks').wait('@getQuestionBanks');

        // Search and Delete Question Bank
        ARQuestionBanksPage.A5AddFilter('Name', 'Starts With', qbDetails.questionBanksName)
        ARQuestionBanksPage.selectA5TableCellRecord(qbDetails.questionBanksName)
        ARQuestionBanksPage.A5WaitForElementStateToChange(ARQuestionBanksPage.getA5AddEditMenuActionsByIndex(3))
        ARQuestionBanksPage.getA5AddEditMenuActionsByNameThenClick('Delete')
        cy.get(ARDeleteModal.getA5OKBtn()).click().wait('@getQuestionBanks')
        // Verify Question Bank is deleted
        cy.get(ARQuestionBanksPage.getA5NoResultMsg()).should('have.text', "Sorry, no results found.");


    })

})

