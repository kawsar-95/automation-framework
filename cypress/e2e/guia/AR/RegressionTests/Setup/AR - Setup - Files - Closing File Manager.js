import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARUnsavedChangesModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal"
import ARFilesPage from "../../../../../../helpers/AR/pageObjects/Setup/ARFilesPage"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C7244 - Closing File Manager', () => {
    beforeEach(() => {
        // Enter the username & password then click on Login button
        cy.loginAdmin(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password
        )
    })
    it('Closing File Manager', () => {
        ARDashboardPage.getMediumWait()
        // Navigate to Files
        // Click on Setup From Left Panel.
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        ARDashboardPage.getVShortWait()
        // Click on Files
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Files'))
        ARDashboardPage.getMediumWait()
        // As an Admin I wish to cancel the File Manager Modal and return to AE
        // Exit the File Manager (x on the right hand side of the modal)
        cy.get(ARFilesPage.getFileManagerModal()).should('exist').within(() => {
           cy.get(ARUnsavedChangesModal.getModalCancelBtn()).click()
        })
        ARDashboardPage.getMediumWait()
        cy.reload(true)
        // The UI should be either redirected to somewhere logical or refresh in a AR view
        cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('contain', 'Files')

    })

})