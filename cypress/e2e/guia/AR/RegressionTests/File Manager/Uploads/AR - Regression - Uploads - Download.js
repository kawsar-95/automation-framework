import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARFileManagerUploadsModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARFileManagerUploadsModal"
import ARUploadFileModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import { users } from "../../../../../../../helpers/TestData/users/users"
const PATH = require("path")


describe('C7379 - AUT-747 - NASA-7142 - Uploads - Download',()=>{
    const downloadsFolder = Cypress.config("downloadsFolder");
    let fileName = "" ;

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

    it("clickin on the download button from flyout menu" , () =>{
        cy.get(ARFileManagerUploadsModal.getMediaLibraryModal()).within(() => {
            //Asserting the Media Library modal header
            cy.get(ARUploadFileModal.getFileManagerModalTitle()).should('have.text', 'File Manager')

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
                //saving file name 
                cy.get(ARFileManagerUploadsModal.getFileNameUsingId()).then(($value) =>{
                    fileName = $value.text()
                })

            })
            //Clicking on the Preview button from flyout menu 
            cy.get(ARUploadFileModal.getMediaLibraryFileMenuBtn()).first().click()

            cy.get(ARFileManagerUploadsModal.getFlyoutMenu()).within(() => {
                //Asserting Download as 2nd item in the menu 
                cy.get(ARUploadFileModal.getMenuItem()).eq(1).should('have.text', "Download").click()
                ARDashboardPage.getMediumWait()
            })

            //Asserting file has been downloaded
            cy.readFile(PATH.join(downloadsFolder, fileName)).should("exist")

        })
    })

})