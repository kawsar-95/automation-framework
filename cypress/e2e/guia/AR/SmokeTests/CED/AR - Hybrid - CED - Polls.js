/// <reference types="cypress" />
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arPollsAddEditPage from '../../../../../../helpers/AR/pageObjects/Polls/ARPollsAddEditPage'
import arPollsPage from '../../../../../../helpers/AR/pageObjects/Polls/ARPollsPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { pollDetails } from '../../../../../../helpers/TestData/poll/pollDetails'
import { users } from '../../../../../../helpers/TestData/users/users'


describe('AR - Hybrid - CED - Polls', function () {

    beforeEach(function() {
        // Sign in with System Admin account
        cy.loginAdmin(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        //cy.get(arDashboardPage.getSysAdminDashboardPageTitle()).should('have.text', arDashboardPage.getSysAdminDashboardPageTitleTxt())
        // Click the Engage menu item
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Engage'))).click()
        arDashboardPage.getMenuItemOptionByName('Polls')
        cy.intercept('**/DefaultGridActionsMenu').as('getPolls').wait('@getPolls');
    })

    it('should allow admin to create a Poll', () => {
        // Create Poll
        cy.get(arPollsPage.getA5PageHeaderTitle()).should('have.text', "Polls")
        arPollsPage.getA5AddEditMenuActionsByNameThenClick('Poll')
        arPollsPage.A5WaitForElementStateToChange(arPollsAddEditPage.getQuestionTxtF())
        cy.get(arPollsAddEditPage.getQuestionTxtF()).type(pollDetails.pollQuestion)
        cy.get(arPollsAddEditPage.getOptionAnswerTxtF()).type(pollDetails.answer)
        // Save Poll
        cy.get(arPollsAddEditPage.getA5SaveBtn()).click().wait('@getPolls')
        arPollsAddEditPage.getA5TableCellRecord(pollDetails.pollQuestion);
    })

    it('should allow admin to edit a Poll', () => {
        // Search and Edit Poll
        arPollsPage.A5AddFilter('Question', 'Starts With', pollDetails.pollQuestion)
        cy.wait('@getPolls')
        arPollsPage.selectA5TableCellRecord(pollDetails.pollQuestion)
        arPollsPage.A5WaitForElementStateToChange(arPollsPage.getA5AddEditMenuActionsByIndex())
        arPollsPage.getA5AddEditMenuActionsByNameThenClick('Edit Poll')
        cy.get(arPollsAddEditPage.getQuestionTxtF()).clear().type(pollDetails.pollQuestionEdited)
        // Save Poll
        cy.get(arPollsAddEditPage.getA5SaveBtn()).click()
        arPollsAddEditPage.getA5TableCellRecord(pollDetails.pollQuestionEdited);
    })

    it('should allow admin to delete a Poll', () => {
        // Search and Delete Poll
        arPollsPage.A5AddFilter('Question', 'Starts With', pollDetails.pollQuestionEdited)
        cy.wait('@getPolls')
        arPollsPage.selectA5TableCellRecord(pollDetails.pollQuestionEdited)
        arPollsPage.A5WaitForElementStateToChange(arPollsPage.getA5AddEditMenuActionsByIndex(3))
        arPollsPage.getA5AddEditMenuActionsByNameThenClick('Delete Poll')
        cy.get(arDeleteModal.getA5OKBtn()).click().wait('@getPolls')
        // Verify Poll is deleted
        cy.get(arPollsPage.getA5NoResultMsg()).should('have.text', "Sorry, no results found.");
    })
})