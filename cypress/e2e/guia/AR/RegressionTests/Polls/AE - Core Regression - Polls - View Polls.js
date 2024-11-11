import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARPollsAddEditPage, { pollsData } from "../../../../../../helpers/AR/pageObjects/Polls/ARPollsAddEditPage"
import { pollDetails } from "../../../../../../helpers/TestData/poll/pollDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C7413 - AUT-721 - AE - Core Regression - Polls View Polls T832342', () => {

    before('Login as an Admin and create a Poll for the test', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getShortWait()
        cy.get(ARPollsAddEditPage.getLeftMenuEngageBtn()).click()
        cy.wrap(ARPollsAddEditPage.getMenuItemPollsOption())
        // ARDashboardPage.getMediumWait()

        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click()
        ARDashboardPage.getMediumWait()
        // Enter the Question  (Required field)
        cy.get(ARPollsAddEditPage.getQuestionTxtF()).clear().type(pollDetails.pollQuestion)
        // Write answer
        cy.get(ARPollsAddEditPage.getOptionAnswerTxtF()).type(pollDetails.answer)
        // Set the Publication toggle button as Published
        cy.get(ARPollsAddEditPage.getA5IsPublishedToggleON()).click()
        // Click on Availability tab present at the Header
        cy.get(ARPollsAddEditPage.getTabItem()).eq(1).click()
        // Click on Add Rule Button and set a Rule as per the requirement
        cy.get(ARPollsAddEditPage.getAddRuleBtn()).click()
        cy.get(ARPollsAddEditPage.getAddRuleTxtF()).type(pollsData.rulesText)
        // Click on Save button
        cy.get(ARDashboardPage.getA5SaveBtn()).click()
    })

    after('Delete Poll as part of clean-up', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getShortWait()
        cy.get(ARPollsAddEditPage.getLeftMenuEngageBtn()).click()
        cy.wrap(ARPollsAddEditPage.getMenuItemPollsOption())
        ARDashboardPage.getMediumWait()

        // Filter created poll
        ARDashboardPage.A5AddFilter('Question', 'Starts With', pollDetails.pollQuestion)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(3)).click()
        cy.get(ARDeleteModal.getA5OKBtn()).click()
    })


    it('Login as an Admin and View Polls', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Admin login successfull
        cy.url('/admin/dashboard').should('exist')
        ARDashboardPage.getShortWait()
        // Click on Engage From Left Panel
        cy.get(ARPollsAddEditPage.getLeftMenuEngageBtn()).click()
        // Click on polls option 
        cy.wrap(ARPollsAddEditPage.getMenuItemPollsOption())
        // Verify that Polls page is open 
        cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('contain', 'Polls')
        ARDashboardPage.getMediumWait()
        // Filter created poll
        ARDashboardPage.A5AddFilter('Question', 'Starts With', pollDetails.pollQuestion)
        ARDashboardPage.getMediumWait()
        // Select an existing Poll to be deleted
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        // Right action menu displays
        ARPollsAddEditPage.getRightActionMenu()
        // Right menu view votes btn
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).should('contain', 'View Votes').click()
        ARDashboardPage.getMediumWait()
        cy.get(ARPollsAddEditPage.getPollsVotesQuestion()).should('contain', `Question: ${pollDetails.pollQuestion} `)
        // Poll votes page display with table data
        ARPollsAddEditPage.getPollsVotePageData()
        // Click on back btn
        cy.get(ARPollsAddEditPage.getBackBtn()).contains('Back').click()
        ARDashboardPage.getMediumWait()
        // Verify that Polls page is open 
        cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('contain', 'Polls')
    })
})