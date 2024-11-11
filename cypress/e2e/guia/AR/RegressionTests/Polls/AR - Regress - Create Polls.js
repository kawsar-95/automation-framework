///<reference types="cypress"/>

import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARUnsavedChangesModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal"
import ARPollsAddEditPage from "../../../../../../helpers/AR/pageObjects/Polls/ARPollsAddEditPage"
import { pollDetails } from "../../../../../../helpers/TestData/poll/pollDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

function deleteCreatedPoll() {
    //Delete the created Poll
    ARPollsAddEditPage.searchPoll()
    cy.get(ARDashboardPage.getGridTable()).eq(0).click()
    cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(3)).click()
    cy.get(ARDeleteModal.getA5OKBtn()).click()
    ARDashboardPage.getShortWait()
}

describe('C6303 - Create Polls T832345', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            '/admin'
        )

    })

    //Create Poll - Click on save button
    it('Create Poll - Click Save Button', () => {
        //Create a Poll with question, answers, add/remove answers, select author, published toggle on 
        ARPollsAddEditPage.createPoll()

        // Click on Save button
        cy.get(ARDashboardPage.getA5SaveBtn()).click()
        deleteCreatedPoll()


    })
    // Create Poll - Click on Cancel Button, then Save Button
    it('Create Poll - Click on Cancel Button => Save Button', () => {
        //Create Poll
        ARPollsAddEditPage.createPoll()
        // Click on cancel button
        cy.get(ARDashboardPage.getA5CancelBtn()).click()
        //If there are changes the Admin will be shown the Unsaved Changes Modal
        cy.get(ARUnsavedChangesModal.getModalContent()).should('contain', ARUnsavedChangesModal.getUnsavedChangesMsg())
        //Click on Save button inside the modal
        cy.get(ARUnsavedChangesModal.getSaveBtn()).click()
        deleteCreatedPoll()

    })
    //Create Poll - Click on Cancel Button, then "Don't Save" Button
    it('Create Poll - Click on Cancel Button => Dont Save Button', () => {
        //Create Poll
        ARPollsAddEditPage.createPoll()
        // Click on cancel button
        cy.get(ARDashboardPage.getA5CancelBtn()).click()
        //If there are changes the Admin will be shown the Unsaved Changes Modal
        cy.get(ARUnsavedChangesModal.getModalContent()).should('contain', ARUnsavedChangesModal.getUnsavedChangesMsg())
        //Click on Don't Save button inside the modal
        ARUnsavedChangesModal.getClickUnsavedActionBtnByName(`Don't Save`)
        ARDashboardPage.getShortWait()
        //Verify admin is returned to the poll page
        cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('contain', 'Polls')

    })

    //Create Poll - Click on Cancel Button, then Cancel Button
    it('Create Poll - Click on Cancel Button => Cancel Button', () => {
        //Create Poll
        ARPollsAddEditPage.createPoll()
        // Click on cancel button
        cy.get(ARDashboardPage.getA5CancelBtn()).click()
        //If there are changes the Admin will be shown the Unsaved Changes Modal
        cy.get(ARUnsavedChangesModal.getModalContent()).should('contain', ARUnsavedChangesModal.getUnsavedChangesMsg())
        //Click on Don't Save button inside the modal
        ARUnsavedChangesModal.getClickUnsavedActionBtnByName(`Cancel`)
        ARDashboardPage.getShortWait()
        //Verify admin is still in Add Poll Page
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should('contain', 'Add Poll')

    })
})
