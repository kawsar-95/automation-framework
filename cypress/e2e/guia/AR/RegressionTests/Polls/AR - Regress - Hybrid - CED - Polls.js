import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import arPollAddEditPage from '../../../../../../helpers/AR/pageObjects/Polls/ARPollsAddEditPage'
import arReportsPage from '../../../../../../helpers/AR/pageObjects/ARReportsPage'
import arUnsavedChangesModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal'
import arPollVotesPage from '../../../../../../helpers/AR/pageObjects/Polls/ARPollVotesPage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEPollsPage from '../../../../../../helpers/LE/pageObjects/Polls/LEPollsPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { pollDetails } from '../../../../../../helpers/TestData/poll/pollDetails'
import { users } from '../../../../../../helpers/TestData/users/users'


describe('AR - Regress - Hybrid - CED - Polls', function () {

    beforeEach(function () {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Click the Engage menu item
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Engage'))).click()
        arDashboardPage.getMenuItemOptionByName('Polls')
        //cy.intercept('**/Admin/Users/JoinMsgHub').as('getPoll').wait('@getPoll');
    })

    it('should allow admin user to Cancel the create new Poll process', () => {
        // Verify that a poll cannot be saved without a question
        cy.get(arReportsPage.getA5PageHeaderTitle()).should('have.text', "Polls")
        arReportsPage.getA5AddEditMenuActionsByNameThenClick('Poll')
        cy.get(arReportsPage.getA5SaveBtn()).click({force:true})
        cy.get(arPollAddEditPage.getQuestionErrorMsg()).should('have.text', 'Question is required')

        // Enter a valid question and answer
        cy.get(arPollAddEditPage.getQuestionTxtF()).type(pollDetails.pollQuestion)
        cy.get(arPollAddEditPage.getOptionAnswerTxtF()).type(pollDetails.answer)

        // Verify that Question is not saved when user clicks the "Cancel" and "Don't Save" buttons
        arPollAddEditPage.getA5AddEditMenuActionsByNameThenClick('Cancel')
        arUnsavedChangesModal.getClickUnsavedActionBtnByName("Don't Save")
        arPollAddEditPage.getShortWait()
        arPollAddEditPage.A5AddFilter('Question', 'Starts With', pollDetails.pollQuestion)
        arPollAddEditPage.getShortWait()
        cy.get(arPollAddEditPage.getA5NoResultMsg()).should('have.text', "Sorry, no results found.");

    })

    it('should allow admin user to create a poll and vote', () => {
        // Enter a valid question and answer
        arReportsPage.getA5AddEditMenuActionsByNameThenClick('Poll')
        cy.get(arPollAddEditPage.getQuestionTxtF()).should('be.visible').type(pollDetails.pollQuestion)
        cy.get(arPollAddEditPage.getOptionAnswerTxtF()).type(pollDetails.answer)
        cy.get(arPollAddEditPage.getA5IsPublishedToggleON()).click()
        cy.get(arReportsPage.getA5SaveBtn()).click()

        // Connect to the learner side and submit a poll 
        cy.get(arDashboardAccountMenu.getA5AccountSettingsBtn()).click()
        arDashboardAccountMenu.getMediumWait() // This wait is needed for Navigation to Learner side in Firefox
        cy.get(arDashboardAccountMenu.getA5LearnerExperienceBtn()).click({force:true})
        //cy.intercept('**/api/rest/v2/conversations-subscriptions').as('getLearner').wait('@getLearner');
        LEDashboardPage.getTileByNameThenClick('Polls & Surveys')
        LEDashboardPage.getShortWait()
        cy.get(LEPollsPage.getRadioBtnByIndex()).click()
        cy.get(LEPollsPage.getPollSubmitBtnByName(pollDetails.pollQuestion)).click()
        LEDashboardPage.getShortWait()
    })

    it('should allow admin user to view a vote', () => {
        // Searh for Poll Question
        arPollAddEditPage.A5AddFilter('Question', 'Starts With', pollDetails.pollQuestion)
        arPollAddEditPage.getShortWait()
        arPollAddEditPage.selectA5TableCellRecord(pollDetails.pollQuestion)

        // View Votes
        cy.get(arPollAddEditPage.getA5AddEditMenuActionsByIndex(2)).should('be.visible').click()
        cy.get(arPollVotesPage.getTotalVotesCount()).should('have.text', '1')
    })

    it('should allow admin user to deselect a poll', () => {
        // Searh for Poll Question
        arPollAddEditPage.A5AddFilter('Question', 'Starts With', pollDetails.pollQuestion)
        arPollAddEditPage.getShortWait()
        arPollAddEditPage.selectA5TableCellRecord(pollDetails.pollQuestion)
        cy.get(arPollAddEditPage.getA5AddEditMenuActionsByIndex(4)).click()

        // Verify that the Poll question is deselected
        cy.get(arPollAddEditPage.getTableCellContentByIndex(1)).should('not.be.checked')
    })
    
    it('should allow admin user to delete a poll', () => {
        // Searh for Poll Question
        arPollAddEditPage.A5AddFilter('Question', 'Starts With', pollDetails.pollQuestion)
        arPollAddEditPage.getShortWait()
        arPollAddEditPage.selectA5TableCellRecord(pollDetails.pollQuestion)
        arPollAddEditPage.getShortWait()
        arReportsPage.getA5AddEditMenuActionsByNameThenClick('Delete Poll')
        cy.get(arDeleteModal.getA5OKBtn()).click()
        // Verify Poll is deleted
        cy.get(arReportsPage.getA5NoResultMsg()).should('have.text', "Sorry, no results found.");
    })

})
