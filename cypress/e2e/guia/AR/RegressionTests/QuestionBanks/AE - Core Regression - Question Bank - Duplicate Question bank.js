import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARQuestionBanksPage from "../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksPage"
import { qbDetails } from "../../../../../../helpers/TestData/QuestionBank/questionBanksDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import ARQuestionBanksAddEditPage from '../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksAddEditPage'

describe('C7423 - AE - Core Regression - Question Bank - Duplicate Question bank', () => {

    before('System admin login and question bank create', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel("Courses"))).click()
        ARDashboardPage.getMenuItemOptionByName('Question Banks')
        cy.intercept('**/Admin/QuestionBanks/DefaultGridActionsMenu').as('getQuestionBanks').wait('@getQuestionBanks')
        cy.get(ARQuestionBanksPage.getA5PageHeaderTitle()).should('have.text', "Question Banks")
        ARQuestionBanksPage.getA5AddEditMenuActionsByNameThenClick('Question Bank')
        ARQuestionBanksPage.A5WaitForElementStateToChange(ARQuestionBanksAddEditPage.getA5NameTxtF())
        cy.get(ARQuestionBanksAddEditPage.getA5NameTxtF()).type(qbDetails.questionBanksName)
        cy.get(ARQuestionBanksAddEditPage.getA5CreateQuestionBtn()).click()
        cy.get(ARQuestionBanksAddEditPage.getA5QuestionTxtA()).type(qbDetails.qb_question_1_text)
        cy.get(ARQuestionBanksAddEditPage.getA5OptionAnswerTxtFByIndex(1)).type(qbDetails.qb_q1_answer_1)
        cy.get(ARQuestionBanksAddEditPage.getA5SaveBtn()).click()
    })

    beforeEach('Admin login', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel("Courses"))).click()
        ARDashboardPage.getMenuItemOptionByName('Question Banks')
        cy.intercept('**/Admin/QuestionBanks/DefaultGridActionsMenu').as('getQuestionBanks').wait('@getQuestionBanks')
    })


    it('Duplicate Question bank create with newly added question', () => {
        // Fiter question bank
        ARQuestionBanksAddEditPage.getA5TableCellRecord(qbDetails.questionBanksName)
        ARDashboardPage.getLongWait()
        ARQuestionBanksPage.A5AddFilter('Name', 'Contains', qbDetails.questionBanksName)
        cy.wait('@getQuestionBanks')
        ARQuestionBanksAddEditPage.selectA5TableCellRecord(qbDetails.questionBanksName)
        ARDashboardPage.getShortWait()

        // Hover on Actions dropdown
        cy.get(ARQuestionBanksAddEditPage.getQuestionBankActions()).contains('Actions').trigger('mouseover')
        cy.get(ARQuestionBanksAddEditPage.getQuestionBankActionsDropDown(1)).contains("Edit").should('exist')
        cy.get(ARQuestionBanksAddEditPage.getQuestionBankActionsDropDown(3)).contains('Delete').should('exist')
        cy.get(ARQuestionBanksAddEditPage.getQuestionBankActionsDropDown(2)).contains('Duplicate').should('exist').click()
        cy.get(ARQuestionBanksAddEditPage.getA5NameTxtF()).should('have.value', qbDetails.questionBanksName + " - Copy")
        ARDashboardPage.getMediumWait()

        // Type on pre-filled name
        cy.get(ARQuestionBanksAddEditPage.getA5NameTxtF()).clear().type(qbDetails.questionBanksName + " - update")
        ARDashboardPage.getShortWait()
        // Questions of previously selected question bank already added
        cy.get(ARDashboardPage.getElementByTitleAttribute(qbDetails.qb_question_1_text)).should('contain', qbDetails.qb_question_1_text)

        // Create another question on Add Question Bank existing course
        cy.get(ARQuestionBanksAddEditPage.getA5CreateQuestionBtn()).contains('Create Question').click()
        cy.get(ARQuestionBanksAddEditPage.getA5QuestionTxtA()).type(qbDetails.qb_question_2_text)
        cy.get(ARQuestionBanksAddEditPage.getA5OptionAnswerTxtFByIndex(1)).type(qbDetails.qb_q1_answer_2)
        cy.get(ARQuestionBanksAddEditPage.getA5CancelBtn()).should('exist')

        // Click on save button
        cy.get(ARQuestionBanksAddEditPage.getA5SaveBtn()).should('exist').click()
        ARDashboardPage.getMediumWait()
    })

    it("Duplicate Question bank and don't save", () => {
        // Fiter question bank
        ARQuestionBanksPage.A5AddFilter('Name', 'Contains', qbDetails.questionBanksName)
        cy.wait('@getQuestionBanks')
        ARQuestionBanksAddEditPage.selectA5TableCellRecord(qbDetails.questionBanksName)
        ARDashboardPage.getShortWait()

        // Hover on actions dropdown
        cy.get(ARQuestionBanksAddEditPage.getQuestionBankActions()).contains('Actions').trigger('mouseover')
        cy.get(ARQuestionBanksAddEditPage.getQuestionBankActionsDropDown(1)).contains("Edit").should('exist')
        cy.get(ARQuestionBanksAddEditPage.getQuestionBankActionsDropDown(3)).contains('Delete').should('exist')
        cy.get(ARQuestionBanksAddEditPage.getQuestionBankActionsDropDown(2)).contains('Duplicate').should('exist').click()

        // Name field pre-filled "Question bank name - Copy"
        cy.get(ARQuestionBanksAddEditPage.getA5NameTxtF()).should('have.value', qbDetails.questionBanksName + " - Copy")
        // Questions of previously selected question bank already added
        cy.get(ARDashboardPage.getElementByTitleAttribute(qbDetails.qb_question_1_text)).should('contain', qbDetails.qb_question_1_text)

        // Name field pre-filled change
        cy.get(ARQuestionBanksAddEditPage.getA5NameTxtF()).clear().type(qbDetails.questionBanksName + " - change")
        ARDashboardPage.getShortWait()
        cy.get(ARQuestionBanksAddEditPage.getA5SaveBtn()).should('exist')
        // Click on cancel button
        cy.get(ARQuestionBanksAddEditPage.getA5CancelBtn()).should('exist').click()

        // Confirmation pop-up display
        cy.get(ARQuestionBanksAddEditPage.getUnsavedModalTitle()).should('contain', 'Unsaved Changes')
        cy.get(ARQuestionBanksAddEditPage.getUnsavedModalMsg()).should('contain', "You haven't saved your changes. Are you sure you want to leave this page?")
        cy.get(ARQuestionBanksAddEditPage.getUnsavedModalBtn("ConfirmText")).should('have.text', "Don't Save")
        cy.get(ARQuestionBanksAddEditPage.getUnsavedModalBtn("SaveText")).should('have.text', 'Save')

        // Click on cancel button on pop up
        cy.get(ARQuestionBanksAddEditPage.getUnsavedModalBtn("CancelText")).should('contain', 'Cancel').eq(0).click()
        // Add Question Bank display
        cy.get(ARQuestionBanksAddEditPage.getPageHeadertitleName()).should('have.text', "Add Question Bank")
        ARDashboardPage.getShortWait()
        // Click on cancel button
        cy.get(ARQuestionBanksAddEditPage.getA5CancelBtn()).click()
        ARDashboardPage.getShortWait()

        // Click on Dont't save button
        cy.get(ARQuestionBanksAddEditPage.getUnsavedModalBtn("ConfirmText")).eq(0).click()
        ARDashboardPage.getMediumWait()

        // User will stay on Add Question Bank page
        cy.url('/admin/QuestionBanks').should('exist')
        ARDashboardPage.getShortWait()

        // Check Don't save question bank not found
        ARQuestionBanksPage.A5AddFilter('Name', 'Contains', qbDetails.questionBanksName + " - change")
        cy.get(ARQuestionBanksPage.getA5NoResultMsg()).should('have.text', "Sorry, no results found.")
        ARDashboardPage.getShortWait()
    })

    it('Duplicate question bank create', () => {
        // Fiter question bank
        ARQuestionBanksPage.A5AddFilter('Name', 'Contains', qbDetails.questionBanksName)
        cy.wait('@getQuestionBanks')
        ARQuestionBanksAddEditPage.selectA5TableCellRecord(qbDetails.questionBanksName)
        ARDashboardPage.getShortWait()

        // Hover on actions dropdown
        cy.get(ARQuestionBanksAddEditPage.getQuestionBankActions()).contains('Actions').trigger('mouseover')
        cy.get(ARQuestionBanksAddEditPage.getQuestionBankActionsDropDown(2)).contains('Duplicate').click()
        // Name field pre-filled "Question bank name - Copy"
        cy.get(ARQuestionBanksAddEditPage.getA5NameTxtF()).should('have.value', qbDetails.questionBanksName + " - Copy")
        // Questions of previously selected question bank already added
        cy.get(ARDashboardPage.getElementByTitleAttribute(qbDetails.qb_question_1_text)).should('contain', qbDetails.qb_question_1_text)
        // Name field pre-filled update
        cy.get(ARQuestionBanksAddEditPage.getA5NameTxtF()).clear().type(qbDetails.questionBanksName + " - update2")
        ARDashboardPage.getShortWait()
        cy.get(ARQuestionBanksAddEditPage.getA5SaveBtn()).should('exist')
        // Click on cancel button
        cy.get(ARQuestionBanksAddEditPage.getA5CancelBtn()).should('exist').click()

        // Confirmation pop-up display
        cy.get(ARQuestionBanksAddEditPage.getUnsavedModalTitle()).should('contain', 'Unsaved Changes')
        cy.get(ARQuestionBanksAddEditPage.getUnsavedModalMsg()).should('contain', "You haven't saved your changes. Are you sure you want to leave this page?")
        cy.get(ARQuestionBanksAddEditPage.getUnsavedModalBtn("ConfirmText")).should('have.text', "Don't Save")
        cy.get(ARQuestionBanksAddEditPage.getUnsavedModalBtn("CancelText")).should('contain', 'Cancel')

        // Click on save button on pop up
        cy.get(ARQuestionBanksAddEditPage.getUnsavedModalBtn("SaveText")).should('have.text', 'Save').click()
        ARDashboardPage.getMediumWait()
    })

    after('Delete question bank', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel("Courses"))).click()
        ARDashboardPage.getMenuItemOptionByName('Question Banks')
        cy.intercept('**/Admin/QuestionBanks/DefaultGridActionsMenu').as('getQuestionBanks').wait('@getQuestionBanks')
        cy.get(ARQuestionBanksPage.getA5PageHeaderTitle()).should('have.text', "Question Banks")
        ARQuestionBanksPage.A5AddFilter('Name', 'Contains', qbDetails.questionBanksName)
        cy.wait('@getQuestionBanks')
        ARQuestionBanksAddEditPage.selectA5TableCellRecord(qbDetails.questionBanksName)
        ARDashboardPage.getShortWait()
        cy.get(ARQuestionBanksAddEditPage.getQuestionBankActions()).contains('Actions').trigger('mouseover')
        cy.get(ARQuestionBanksAddEditPage.getQuestionBankActionsDropDown(3)).contains('Delete').click()
        cy.get(ARQuestionBanksAddEditPage.getUnsavedModalBtn("ConfirmText")).eq(0).click()
        ARQuestionBanksPage.A5AddFilter('Name', 'Contains', qbDetails.questionBanksName + " - update")
        cy.wait('@getQuestionBanks')
        ARQuestionBanksAddEditPage.selectA5TableCellRecord(qbDetails.questionBanksName + " - update")
        ARDashboardPage.getShortWait()
        cy.get(ARQuestionBanksAddEditPage.getQuestionBankActions()).contains('Actions').trigger('mouseover')
        cy.get(ARQuestionBanksAddEditPage.getQuestionBankActionsDropDown(3)).contains('Delete').click()
        cy.get(ARQuestionBanksAddEditPage.getUnsavedModalBtn("ConfirmText")).eq(0).click()

        ARQuestionBanksPage.A5AddFilter('Name', 'Contains', qbDetails.questionBanksName + " - update2")
        cy.wait('@getQuestionBanks')
        ARQuestionBanksAddEditPage.selectA5TableCellRecord(qbDetails.questionBanksName + " - update2")
        ARDashboardPage.getShortWait()
        cy.get(ARQuestionBanksAddEditPage.getQuestionBankActions()).contains('Actions').trigger('mouseover')
        cy.get(ARQuestionBanksAddEditPage.getQuestionBankActionsDropDown(3)).contains('Delete').click()
        cy.get(ARQuestionBanksAddEditPage.getUnsavedModalBtn("ConfirmText")).eq(0).click()
    })
})