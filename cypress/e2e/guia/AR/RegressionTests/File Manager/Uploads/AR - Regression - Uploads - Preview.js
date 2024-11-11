import ARCollaborationAddEditPage from "../../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage"
import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARFileManagerUploadsModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARFileManagerUploadsModal"
import ARUploadFileModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import { users } from "../../../../../../../helpers/TestData/users/users"


describe("C7368 - AUT-736   - AR - Regression - Uploads - Preview ", () => {

    //Go to Engage and open Uploads Modal 
    beforeEach("Prerequisites", () => {
        //Login as an admin
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
        //Assering Add Collaboration Page
        cy.get(ARDashboardPage.getElementByDataNameAttribute('title')).should('contain', 'Add Collaboration')
        //Click on Add Resource Button
        cy.get(ARCollaborationAddEditPage.getAddResourceBtn()).click()

        cy.get(ARDashboardPage.getElementByDataNameAttribute('collaboration-resource')).within(() => {
            //Clicking on the upload button 
            cy.get(ARDashboardPage.getElementByDataNameAttribute("select")).click()
        })

    })

    it("Admin can see preview option on the Media Library modal", () => {
        //Selecting the Media Library modal
        cy.get(ARFileManagerUploadsModal.getMediaLibraryModal()).within(() => {
            //Asserting the Media Library modal header
            cy.get(ARUploadFileModal.getFileManagerModalTitle()).should('have.text', 'File Manager')
            //Asserting preview has URL 
             cy.get(ARUploadFileModal.getMediaLibraryImagePreview()).first().invoke('attr','style').should('contain', 'url') 

            //hover over the images 
            cy.get(ARUploadFileModal.getMediaLibraryImagePreview()).first().trigger('mouseover').parent().parent().within(() => {
                // asserting preview icon 
                cy.get(ARUploadFileModal.getPreview()).find('span').should('have.class', 'icon icon-eye')
                // asserting ellipse button
                cy.get(ARUploadFileModal.getOption()).find('span').should('have.class', 'icon icon-ellipsis')
                //clicking on the fly out menu 
                cy.get(ARUploadFileModal.getOption()).invoke('show')
                ARDashboardPage.getShortWait()
                cy.get(ARUploadFileModal.getMediaLibraryFileMenuBtn()).invoke('show').click({ force: true })

            })
            //Clicking on the Preview button from flyout menu 
            cy.get(ARUploadFileModal.getMediaLibraryFileMenuBtn()).first().click()

            cy.get(ARUploadFileModal.getFlyOutModal()).last().within(() => {
                //Assering Preview as the first item 
                cy.get(ARUploadFileModal.getMenuItem()).first().should('have.text', "Preview")
            })
            //Flyout options can be travelled by using keyboard    
            cy.get(ARUploadFileModal.getFlyOutModal()).type('{downarrow}').then(($item) => {
                let name = $item.find("span").text()
                expect(name).to.contain("Preview")
            })

            //Asserting the Media Library modal header
            cy.get(ARUploadFileModal.getFileManagerModalTitle()).should('have.text', 'File Manager')

            //Clicking on the Preview button from flyout menu 
            cy.get(ARUploadFileModal.getMediaLibraryFileMenuBtn()).first().click()

            //Clicking on the Preview button from flyout menu 
            cy.get(ARUploadFileModal.getMediaLibraryFileMenuBtn()).first().click()
            //using arrow keys on the flyout menu to navigate 
            cy.get(ARUploadFileModal.getFlyOutModal()).type('{downarrow}{downarrow}').then(($item) => {
                let name = $item.find("span").text()
                expect(name).to.contain("Download")
            })

        })


    })

})