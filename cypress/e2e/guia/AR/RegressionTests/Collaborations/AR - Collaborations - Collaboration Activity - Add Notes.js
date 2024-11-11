import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARCollaborationActivityEditPage from '../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationActivityEditPage'
import { collaborationDetails } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'

describe('AR - Collaborations - Collaboration Activity - Add Notes', function () {

    before(function () {
        //Create a post via API
        cy.createCollaborationPost(Cypress.env('A_COLLABORATION_ID'), collaborationDetails.postSummary, collaborationDetails.postDescription, "General")
    })

    beforeEach(() => {

        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Engage'))).click()

        //Navigate to Collaborations
        ARDashboardPage.getMenuItemOptionByName('Collaboration Activity')
        ARDashboardPage.getMediumWait()

        //Filter for Collaboration Activity & Edit it
        cy.wrap(ARDashboardPage.AddFilter('Summary', 'Contains', collaborationDetails.postSummary))
        cy.get(ARDashboardPage.getTableCellName(8)).contains(collaborationDetails.postSummary).click()
        ARDashboardPage.getShortWait()

        //Click on Edit Activity Button
        cy.get(ARCollaborationActivityEditPage.getEditActivityBtn()).click()
        ARDashboardPage.getMediumWait()

    })

    it('Edit Collaboration Activity and Add Note', () => {
        //Verify No Notes Exist
        cy.get(ARCollaborationActivityEditPage.getNoteContainer()).should('exist')

        //Verify Only Whitespace characters are not Allowed
        cy.get(ARCollaborationActivityEditPage.getNotesTxtF()).click().type('      ')
        cy.get(ARCollaborationActivityEditPage.getNotesErrorMsg()).should('contain', miscData.whitespace_chars_error)

        //Verify Notes Field Does not Allow > 4000 Chars
        cy.get(ARCollaborationActivityEditPage.getNotesTxtF()).clear().invoke('val', ARDashboardPage.getLongString(4000)).type('a')
        cy.get(ARCollaborationActivityEditPage.getNotesErrorMsg()).should('contain', miscData.char_4000_error)

        //Enter Valid Note into Note Field
        cy.get(ARCollaborationActivityEditPage.getNotesTxtF()).clear().type(collaborationDetails.note1)
        ARDashboardPage.getVShortWait() //Wait for error to clear

        //Save the Changes
        cy.get(ARDashboardPage.getSaveBtn()).click()
        ARDashboardPage.getMediumWait()
    })

    it('Edit Collaboration Activity and Verify Note Data Exists', () => {
        //Verify Past Notes Display Correct Info
        ARCollaborationActivityEditPage.getPastNotesExist(collaborationDetails.note1)

        //Verify You can Delete your Own Notes and Pending Icon Shown and Undo Delete
        ARCollaborationActivityEditPage.getDeleteNoteByContentAndUndo(collaborationDetails.note1)

        //Delete the Note
        ARCollaborationActivityEditPage.getDeleteNoteByContentAndConfirmDelete(collaborationDetails.note1)

        //Add Anoter Note
        cy.get(ARCollaborationActivityEditPage.getNotesTxtF()).type(collaborationDetails.note2)

        //Save the Changes
        cy.get(ARDashboardPage.getSaveBtn()).click()
        ARDashboardPage.getMediumWait()
    })

    it('Edit Collaboration Activity and Verify Note Changes Persisted', () => {
        //Verify Past Note Exists
        ARCollaborationActivityEditPage.getPastNotesExist(collaborationDetails.note2)

        //Verify Note Deletion Persisted
        ARCollaborationActivityEditPage.getPastNotesDoesNotExist(collaborationDetails.note1)

        //Delete Past Note
        ARCollaborationActivityEditPage.getDeleteNoteByContentAndUndo(collaborationDetails.note2)

        //Cancel Changes
        ARCollaborationActivityEditPage.getRightMenuCancelBtn()
        ARDashboardPage.getMediumWait()
    })
})

describe('AR - Collaborations - Collaboration Activity - Add Notes Different Admin', function () {
    beforeEach(() => {
        // Sign in with Department Admin account
        cy.apiLoginWithSession(users.depAdminLogInOut.admin_dep_loginout_username, users.depAdminLogInOut.admin_dep_loginout_password, '/admin')
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Engage'))).click()

        //Navigate to Collaborations
        ARDashboardPage.getMenuItemOptionByName('Collaboration Activity')
        ARDashboardPage.getMediumWait()

        //Filter for Collaboration Activity & Edit it
        cy.wrap(ARDashboardPage.AddFilter('Summary', 'Contains', collaborationDetails.postSummary))
        cy.get(ARDashboardPage.getTableCellName(8)).contains(collaborationDetails.postSummary).click()
        ARDashboardPage.getShortWait()

        //Verify collaboration activity can be selected and deselected
        cy.get(ARDashboardPage.getTableCellName(8)).click()

        //Verify Selection
        cy.get(ARDashboardPage.getTableCellContentByIndex(1)).should('not.be.checked')
        cy.get(ARDashboardPage.getTableCellName(8)).click()

        //Verify Deselection
        cy.get(ARDashboardPage.getTableCellContentByIndex(1)).should('not.be.checked')


        //Click on Edit Activity Button
        cy.get(ARCollaborationActivityEditPage.getEditActivityBtn()).click()
        ARDashboardPage.getMediumWait()

    })



    it('Login as Different Admin, Edit Collaboration Activity, Verify Existing Note Can Be Modified', () => {
        //Verify Note was Not Deleted
        ARCollaborationActivityEditPage.getPastNotesExist(collaborationDetails.note2)

        //Verify Admin Cannot Delete Other Admin's Note
        ARCollaborationActivityEditPage.getDeleteNoteByContentAndConfirmDeleteBtnNotExist(collaborationDetails.note2)

        //Verify other admin can Add New Note
        cy.get(ARCollaborationActivityEditPage.getNotesTxtF()).clear().type(collaborationDetails.note3)

        //Save the Changes
        cy.get(ARDashboardPage.getSaveBtn()).click()
        ARDashboardPage.getMediumWait()
    })

    it('Verify Notes are Ordered Most to Least Recent', () => {
        //Verify New Note is at the Top of the List and Contains the Correct Admin Name and Content
        
        ARCollaborationActivityEditPage.getPastNotesOrdersByRecnetToOldest(collaborationDetails.adminsandnotes)

    })

    after(function () {


        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Engage'))).click()

        //Navigate to Collaborations
        ARDashboardPage.getMenuItemOptionByName('Collaboration Activity')
        ARDashboardPage.getMediumWait()

        //Filter for Collaboration Activity & Edit it
        cy.wrap(ARDashboardPage.AddFilter('Summary', 'Contains', collaborationDetails.postSummary))
        cy.get(ARDashboardPage.getTableCellName(8)).contains(collaborationDetails.postSummary).click()
        ARDashboardPage.getShortWait()

        //Click on Delete Activity Button
        cy.get(ARCollaborationActivityEditPage.getDeleteEditActivityBtn()).click()
        ARDashboardPage.getMediumWait()

        //Delete
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        ARDashboardPage.getMediumWait()
    })
})




