import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARUnsavedChangesModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal"
import ARPollsAddEditPage from "../../../../../../helpers/AR/pageObjects/Polls/ARPollsAddEditPage"
import { pollDetails } from "../../../../../../helpers/TestData/poll/pollDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
const createPoll = () => {
    //Navigate to Polls
    ARDashboardPage.getShortWait()
    cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Engage')).click()
    cy.wrap(ARDashboardPage.getMenuItemOptionByName('Polls'))
    //Verify that Polls page is open 
    cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('contain', 'Polls')
    //add Poll
    ARDashboardPage.getShortWait()
    cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click()
    ARDashboardPage.getShortWait()
    //Verify that Add Poll page is open
    cy.get(ARDashboardPage.getAccountHeaderLabel()).should('contain', 'Add Poll')
    ARDashboardPage.getShortWait()
    //Enter the Question  (Required field)
    cy.get(ARPollsAddEditPage.getQuestionTxtF()).clear().type(pollDetails.pollQuestion)
    //Write answer
    cy.get(ARPollsAddEditPage.getOptionAnswerTxtF()).type(pollDetails.answer)
    //Set the Publication toggle button as Published
    cy.get(ARPollsAddEditPage.getA5IsPublishedToggleON()).click()
}
const searchPoll = (pollQuestion = pollDetails.pollQuestion) => {
    ARDashboardPage.getMediumWait()
    ARDashboardPage.A5AddFilter('Question', 'Starts With', pollQuestion)
    ARDashboardPage.getMediumWait()
}
describe('C6306 - Delete Poll T832346', () => {
    beforeEach(() => {
        //Login  admin
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            '/admin'
        )
    })
    //Create temporary poll to delete later
    it('Create temporary Poll for deleting', () => {
        //Create Poll
        createPoll()
        //save poll
        cy.get(ARDashboardPage.getA5SaveBtn()).click()
        ARDashboardPage.getMediumWait()

    })
    //Delete the temporary poll
    it('Delete Poll', () => {
        const pollQuestion = pollDetails.pollQuestion
        //Navigate to Polls
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Engage')).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Polls'))
        //Verify that Polls page is open 
        cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('contain', 'Polls')
        searchPoll(pollQuestion)
        //Select an existing Poll to be deleted
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        //Verify that [Delete] button has been added to Poll page.
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(3)).should('contain', 'Delete Poll')
        //Verify that the added button is the second to the last button and above [Deselect] button
        //todo
        //Click on Delete button
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(3)).click()
        ARDashboardPage.getShortWait()
        //Verify that clicking [Delete] button will open the Delete  modal
        cy.get(ARDeleteModal.getA5ModalContent()).should('be.visible')
        //Verify that the modal displays [ok] and [Cancel] buttons
        cy.get(ARDeleteModal.getA5OKBtn()).should('exist')
        cy.get(ARDeleteModal.getA5CancelBtn()).should('exist')
        //Verify the message "Are you sure you want to delete 'xxxx'? , xxxx is name of the Poll"
        cy.get(ARDeleteModal.getA5ModalContent()).should('contain', ARDeleteModal.getDeleteMsg(pollQuestion))
        //Verify that selecting the [Cancel] button, Poll is not deleted and the Poll  remains in the list of Polls
        cy.get(ARDeleteModal.getA5CancelBtn()).click()
        cy.get('div').should('contain', pollQuestion)
        ARDashboardPage.getShortWait()
        //Verify that selecting the [ok] button deletes the Poll from list of Polls
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(3)).click()
        cy.get(ARDeleteModal.getA5OKBtn()).click()
        ARDashboardPage.getShortWait()
        cy.get('div').should('contain', 'Sorry, no results found.')

    })

})