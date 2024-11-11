/// <reference types="cypress" />
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arQuestionBanksPage from '../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksPage'
import arQuestionBanksAddEditPage from '../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksAddEditPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { qbDetails } from '../../../../../../helpers/TestData/QuestionBank/questionBanksDetails'
import { users } from '../../../../../../helpers/TestData/users/users'


describe('AR - Hybrid - CED - QuestionBanks T832347 T832343', function () {

    beforeEach(function () {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //cy.get(arDashboardPage.getSysAdminDashboardPageTitle()).should('have.text', arDashboardPage.getSysAdminDashboardPageTitleTxt())
        // Click the Courses menu item
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Question Banks')
        cy.intercept('**/Admin/QuestionBanks/DefaultGridActionsMenu').as('getQuestionBanks').wait('@getQuestionBanks');
    })

   
    it('should allow admin to create question 1 (multiple choice, single answer, 2 options)', () => {
        // Create Question 1
        cy.get(arQuestionBanksPage.getA5PageHeaderTitle()).should('have.text', "Question Banks")
        arQuestionBanksPage.getA5AddEditMenuActionsByNameThenClick('Question Bank')
        arQuestionBanksPage.A5WaitForElementStateToChange(arQuestionBanksAddEditPage.getA5NameTxtF())

        // Verify that the name field cannot be empty
        cy.get(arQuestionBanksAddEditPage.getA5SaveBtn()).click()
        cy.get(arQuestionBanksAddEditPage.getA5NameErrorMsg()).should('have.text', qbDetails.nameFieldErrorMsg)

        // Enter a name in the name text field
        cy.get(arQuestionBanksAddEditPage.getA5NameTxtF()).type(qbDetails.questionBanksName)
        cy.get(arQuestionBanksAddEditPage.getA5CreateQuestionBtn()).click()
        cy.get(arQuestionBanksAddEditPage.getA5OptionAnswerBtn()).click()

        // Verify that Question and answer fields cannot be empty
        cy.get(arQuestionBanksAddEditPage.getA5SaveBtn()).click()
        cy.get(arQuestionBanksAddEditPage.getA5QuestionOrAnswerErrorMsg(1)).should('have.text', qbDetails.questionFieldErrorMsg)
        cy.get(arQuestionBanksAddEditPage.getA5QuestionOrAnswerErrorMsg(2)).should('have.text', qbDetails.answerFieldErrorMsg)

        // Enter question and answer
        arQuestionBanksAddEditPage.getVShortWait()
        cy.get(arQuestionBanksAddEditPage.getA5EditQuestionBtnByIndex()).click()
        cy.get(arQuestionBanksAddEditPage.getA5QuestionTxtA()).type(qbDetails.qb_question_1_text)
        cy.get(arQuestionBanksAddEditPage.getA5OptionAnswerTxtFByIndex(1)).type(qbDetails.qb_q1_answer_1)
        cy.get(arQuestionBanksAddEditPage.getA5OptionAnswerTxtFByIndex(2)).type(qbDetails.qb_q1_answer_2)

        // Save Question 1
        cy.get(arQuestionBanksAddEditPage.getA5SaveBtn()).click()
        arQuestionBanksAddEditPage.getA5TableCellRecord(qbDetails.questionBanksName);
    })

    it('should allow admin to create question 2 (text, with attachment)', () => {
        // Create Question 2
        arQuestionBanksPage.A5AddFilter('Name', 'Starts With', qbDetails.questionBanksName)
        cy.wait('@getQuestionBanks')
        arQuestionBanksAddEditPage.selectA5TableCellRecord(qbDetails.questionBanksName)
        arQuestionBanksPage.A5WaitForElementStateToChange(arQuestionBanksAddEditPage.getA5AddEditMenuActionsByIndex())
        arQuestionBanksPage.getA5AddEditMenuActionsByNameThenClick('Edit')
        arQuestionBanksAddEditPage.A5WaitForElementStateToChange(arQuestionBanksAddEditPage.getA5EditQuestionBtnByIndex())
        cy.get(arQuestionBanksAddEditPage.getA5EditQuestionBtnByIndex()).click()
        cy.get(arQuestionBanksAddEditPage.getA5CreateQuestionBtn()).contains('Create Question').click()
        cy.get(arQuestionBanksAddEditPage.getA5OptionAnswerBtn()).click()
        cy.get(arQuestionBanksAddEditPage.getA5QuestionTxtA()).type(qbDetails.qb_question_2_text)
        cy.get(arQuestionBanksAddEditPage.getA5TypeDDown()).click()
        cy.get(arQuestionBanksAddEditPage.getA5TypeDDownOpt()).click()
        cy.get(arQuestionBanksAddEditPage.getA5OptionAnswerTxtFByIndex(1)).type(qbDetails.qb_q2_answer_1)
        cy.get(arQuestionBanksAddEditPage.getA5OptionAnswerTxtFByIndex(2)).type(qbDetails.qb_q2_answer_2)

        // Note: Upload works well in AE but the upload dialog does not work on A5 through automation
        // This will be implemented when this page is created in AE

        // Save Question 2
        cy.get(arQuestionBanksAddEditPage.getA5SaveBtn()).click()
        arQuestionBanksAddEditPage.getA5TableCellRecord(qbDetails.questionBanksName);
    })

    it('should allow admin to edit a Question Bank', () => {
        // Search and Edit Question Bank
        arQuestionBanksPage.A5AddFilter('Name', 'Starts With', qbDetails.questionBanksName)
        cy.wait('@getQuestionBanks')
        arQuestionBanksAddEditPage.selectA5TableCellRecord(qbDetails.questionBanksName)
        arQuestionBanksPage.A5WaitForElementStateToChange(arQuestionBanksAddEditPage.getA5AddEditMenuActionsByIndex())
        arQuestionBanksPage.getA5AddEditMenuActionsByNameThenClick('Edit')
        arQuestionBanksPage.A5WaitForElementStateToChange(arQuestionBanksAddEditPage.getA5EditQuestionBtnByIndex())

        cy.get(arQuestionBanksAddEditPage.getA5EditQuestionBtnByIndex()).click()
        cy.get(arQuestionBanksAddEditPage.getA5QuestionNameLBL(qbDetails.qb_question_1_text)).invoke('attr', 'title').then((value) => {
            expect(value).to.be.eq(qbDetails.qb_question_1_text);
        })
        cy.get(arQuestionBanksAddEditPage.getA5OptionAnswerTxtFByIndex()).invoke('attr', 'value').then((value) => {
            expect(value).to.be.eq(qbDetails.qb_q1_answer_1);
        })
        cy.get(arQuestionBanksAddEditPage.getA5OptionAnswerTxtFByIndex(2)).invoke('attr', 'value').then((value) => {
            expect(value).to.be.eq(qbDetails.qb_q1_answer_2);
        })
        cy.get(arQuestionBanksAddEditPage.getA5EditQuestionBtnByIndex(2)).click()
        cy.get(arQuestionBanksAddEditPage.getA5QuestionNameLBL(qbDetails.qb_question_2_text)).invoke('attr', 'title').then((value) => {
            expect(value).to.be.eq(qbDetails.qb_question_2_text);
        })
        cy.get(arQuestionBanksAddEditPage.getA5OptionAnswerTxtFByIndex()).invoke('attr', 'value').then((value) => {
            expect(value).to.be.eq(qbDetails.qb_q2_answer_1);
        })
        cy.get(arQuestionBanksAddEditPage.getA5OptionAnswerTxtFByIndex(2)).invoke('attr', 'value').then((value) => {
            expect(value).to.be.eq(qbDetails.qb_q2_answer_2);
        })
        cy.get(arQuestionBanksAddEditPage.getA5NameTxtF()).clear().type(qbDetails.questionBanksNameEdited)
        cy.get(arQuestionBanksAddEditPage.getA5DeleteQuestionBtnByIndex(2)).click();
        // Save Editted Question Bank
        cy.get(arQuestionBanksAddEditPage.getA5SaveBtn()).click()
        commonDetails.courseIDs.push(qbDetails.questionBanksNameEdited)
        arQuestionBanksAddEditPage.getA5TableCellRecord(qbDetails.questionBanksNameEdited);
    })

    it('should allow admin to Duplicate a Question Bank', () => {
        // Search and Delete Question Bank
        arQuestionBanksPage.A5AddFilter('Name', 'Starts With', qbDetails.questionBanksNameEdited)
        cy.wait('@getQuestionBanks')
        arQuestionBanksAddEditPage.selectA5TableCellRecord(qbDetails.questionBanksNameEdited)
        arQuestionBanksPage.A5WaitForElementStateToChange(arQuestionBanksAddEditPage.getA5AddEditMenuActionsByIndex())
        arQuestionBanksPage.getA5AddEditMenuActionsByNameThenClick('Duplicate')
        cy.get(arQuestionBanksAddEditPage.getA5NameTxtF()).clear().type(qbDetails.questionBanksNameDuplicate)
        cy.get(arQuestionBanksAddEditPage.getA5SaveBtn()).click()
        arQuestionBanksAddEditPage.getA5TableCellRecord(qbDetails.questionBanksNameDuplicate);   
    })

    it('should allow admin to filter for the created Duplicate Question Bank', () => {
        // Search and Delete Question Bank
        arQuestionBanksPage.A5AddFilter('Name', 'Starts With', qbDetails.questionBanksNameDuplicate)
        cy.wait('@getQuestionBanks')
        arQuestionBanksAddEditPage.selectA5TableCellRecord(qbDetails.questionBanksNameDuplicate)
        commonDetails.courseIDs.push(qbDetails.questionBanksNameDuplicate)
    })


    it('should allow admin to delete a Question Bank', () => {
        // Search and Delete Question Bank
        commonDetails.courseIDs.forEach((deps) => {
            arQuestionBanksPage.A5AddFilter('Name', 'Starts With', deps)
            cy.wait('@getQuestionBanks')
            arQuestionBanksPage.selectA5TableCellRecord(deps)
            arQuestionBanksPage.A5WaitForElementStateToChange(arQuestionBanksPage.getA5AddEditMenuActionsByIndex(3))
            arQuestionBanksPage.getA5AddEditMenuActionsByNameThenClick('Delete')
            cy.get(arDeleteModal.getA5OKBtn()).click().wait('@getQuestionBanks')
            // Verify Question Bank is deleted
            cy.get(arQuestionBanksPage.getA5NoResultMsg()).should('have.text', "Sorry, no results found.");
        })
    })
})

