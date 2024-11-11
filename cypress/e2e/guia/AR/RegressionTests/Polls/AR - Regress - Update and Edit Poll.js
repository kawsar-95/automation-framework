import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARUnsavedChangesModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal"
import ARPollsAddEditPage from "../../../../../../helpers/AR/pageObjects/Polls/ARPollsAddEditPage"
import { pollDetails } from "../../../../../../helpers/TestData/poll/pollDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C6305 - Update And Edit Poll.js T832344', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            '/admin'
        )

    })
    //Create Temporary Poll to update
    it('Create Poll - Click Save Button', () => {
        //Create temporary Poll
        ARPollsAddEditPage.createPoll()

        // Click on Save button
        cy.get(ARDashboardPage.getA5SaveBtn()).click()
        ARDashboardPage.getMediumWait()

    })
    //Edit the temporary Poll - Click save button
    it('Edit the temporary Poll - Click save button', () => {
        //Edit Poll
        ARPollsAddEditPage.editPoll()
        //Save Edited Poll
        cy.get(ARDashboardPage.getA5SaveBtn()).click()

    })
    //Edit pole - Click cancel then save
    it('Edit pole - Click cancel then save', () => {
        //Edit Poll
        ARPollsAddEditPage.editPoll()
        // Click on cancel button
        cy.get(ARDashboardPage.getA5CancelBtn()).click()
        //If there are changes the Admin will be shown the Unsaved Changes Modal
        cy.get(ARUnsavedChangesModal.getModalContent()).should('contain', ARUnsavedChangesModal.getUnsavedChangesMsg())
        //Click on Save button inside the modal
        cy.get(ARUnsavedChangesModal.getSaveBtn()).click()

    })
    //Edit Poll - Click on Cancel Button, then Cancel Button
    it('Edit Poll - Click on Cancel Button, then Cancel Button', () => {
        //Edit Poll
        ARPollsAddEditPage.editPoll()
        // Click on cancel button
        cy.get(ARDashboardPage.getA5CancelBtn()).click()
        //If there are changes the Admin will be shown the Unsaved Changes Modal
        cy.get(ARUnsavedChangesModal.getModalContent()).should('contain', ARUnsavedChangesModal.getUnsavedChangesMsg())
        //Click on Don't Save button inside the modal
        ARUnsavedChangesModal.getClickUnsavedActionBtnByName(`Cancel`)
        ARDashboardPage.getShortWait()
        //Verify admin is still in Edit Poll Page
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should('contain', 'Edit Poll')

    })
    //Edit Poll - Click on Cancel Button, then "Don't Save" Button
    it('Edit Poll - Click on Cancel Button, then "Dont Save" Button', () => {
        //Edit Poll
        ARPollsAddEditPage.editPoll()
        // Click on cancel button
        cy.get(ARDashboardPage.getA5CancelBtn()).click()
        //If there are changes the Admin will be shown the Unsaved Changes Modal
        cy.get(ARUnsavedChangesModal.getModalContent()).should('contain', ARUnsavedChangesModal.getUnsavedChangesMsg())
        //Click on Don't Save button inside the modal
        ARUnsavedChangesModal.getClickUnsavedActionBtnByName(`Don't Save`)
        ARDashboardPage.getShortWait()
        //Verify admin is returned to the poll page
        cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('contain', 'Polls')
        ARDashboardPage.getMediumWait()
    })

    after(() => {
        //Delete created poll
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(3)).click()
        cy.get(ARDeleteModal.getA5OKBtn()).click()
        ARDashboardPage.getShortWait()
    })
})