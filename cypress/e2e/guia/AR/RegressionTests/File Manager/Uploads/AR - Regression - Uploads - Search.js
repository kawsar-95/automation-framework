import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARFileManagerUploadsModal, { fileTypes } from "../../../../../../../helpers/AR/pageObjects/Modals/ARFileManagerUploadsModal"
import { images } from "../../../../../../../helpers/TestData/resources/resources"
import { users } from "../../../../../../../helpers/TestData/users/users"



describe('C7376 - AUT-744 - NASA-7168 - Uploads - Search',()=>{

    beforeEach("navigate to uploads file manager ", () => {
        //login as an admin
        cy.loginAdmin(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        ARDashboardPage.getMediumWait()
        // Navigate to collaboration
        // Click on Engage From Left Panel.
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Engage'))).click()
        // Click on Collaborations
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Collaborations'))
        cy.intercept('/api/rest/v2/admin/reports/collaborations/operations').as('getCollaborations').wait('@getCollaborations')
        ARDashboardPage.getMediumWait()
        // Click on Add Collaboration option from RHS
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Collaboration')).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('title')).should('contain', 'Add Collaboration')
        //Clicking on Add Resource button
        cy.get(ARFileManagerUploadsModal.getAddResourceBtn()).click()
        //Clickig on Choose file button to open the file dialog
        cy.get(ARFileManagerUploadsModal.getChooseFileBtn()).click()
        // Asserting File Manager Upload Modal has been opened
        cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', 'File Manager')
    })

    it("The user can enter a search term in the search bar and search for it , remove it using chicklet " , () =>{
        //Asserting File Manager Upload modal is there 
        cy.get(ARFileManagerUploadsModal.getSearchBar()).should('exist')
        //typing in the search bar
        cy.get(ARFileManagerUploadsModal.getSearchBar()).clear().type(images.moose_filename)
        ARDashboardPage.getShortWait()

        //Asserting the file  name in the filtered out section
        ARFileManagerUploadsModal.assertInFilteredOutSection(images.moose_filename)

        //clicking on the cross btn in the filtered out clichet 
        ARFileManagerUploadsModal.deselectFilteredOutSectionFromValue(images.moose_filename)
        //Asserting search bar is cleared out 
        cy.get(ARFileManagerUploadsModal.getSearchBar()).should('have.value' , '')

    })


})