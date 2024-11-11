import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARFileManagerUploadsModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARFileManagerUploadsModal"
import ARUploadFileModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import { commonDetails } from "../../../../../../../helpers/TestData/Courses/commonDetails"
import { users } from "../../../../../../../helpers/TestData/users/users"


describe("C7373 - AUT-741 - NASA-7139 - Uploads - Rename ", () => {
    let fileName = "";
    let renamedFileName = ARFileManagerUploadsModal.getRenamedFileName();

    beforeEach("Navigate to File Upload Modal ", () => {
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

    it("File Manager Upload modal appears and 'Rename' appears in the flyout menu ", () => {

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

            })
            //Clicking on the Preview button from flyout menu 
            cy.get(ARUploadFileModal.getMediaLibraryFileMenuBtn()).first().click()

            cy.get(ARFileManagerUploadsModal.getFlyoutMenu()).within(() => {
                //Asserting Rename as 5th item in the menu 
                cy.get(ARUploadFileModal.getMenuItem()).eq(4).should('have.text', "Rename").click()
                ARDashboardPage.getShortWait()
            })

        })

    })

    it("Selecting the 'Rename' option in the fly-out menu opens up the 'Rename File' modal", () => {

        //Saving file name to assert it later 
        cy.get(ARFileManagerUploadsModal.getMediaLibraryModal()).within(() => {

            cy.get(ARUploadFileModal.getMediaLibraryImagePreview()).first().parent().parent().parent().within(() => {
                //saving the file name 
                cy.get(ARFileManagerUploadsModal.getFileNameInPresentation()).first().then(($span) => {
                    let splitPart = $span.text().split('.')
                    fileName = splitPart[0];
                })

            })

        })

        cy.get(ARFileManagerUploadsModal.getMediaLibraryModal()).within(() => {

            // hover over the images 
            cy.get(ARUploadFileModal.getMediaLibraryImagePreview()).first().parent().parent().within(() => {
                // asserting preview icon 
                cy.get(ARUploadFileModal.getPreview()).find('span').should('have.class', 'icon icon-eye')
                cy.get(ARUploadFileModal.getOption()).find('span').should('have.class', 'icon icon-ellipsis')
                cy.get(ARUploadFileModal.getOption()).invoke('show')
                ARDashboardPage.getShortWait()
                cy.get(ARUploadFileModal.getMediaLibraryFileMenuBtn()).invoke('show').click({ force: true })

            })

            //Clicking on the Preview button from flyout menu 
            cy.get(ARUploadFileModal.getMediaLibraryFileMenuBtn()).first().click({ force: true })

            //clicking on the Rename button from flyout menu
            cy.get(ARFileManagerUploadsModal.getFlyoutMenu()).within(() => {
                //Asserting Rename as 5th item in the menu 
                cy.get(ARUploadFileModal.getMenuItem()).eq(4).should('have.text', "Rename").click({ force: true })
                ARDashboardPage.getShortWait()
            })

        })

        //Asserting new dialogue as Rename File modal Appears 
        cy.get(ARFileManagerUploadsModal.getDialogues()).within(() => {

            cy.get(ARFileManagerUploadsModal.getDialoguesAsRole()).last().within(() => {

                //Asserting modal header
                cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', "Rename File")
                //Asserting Apply Button is greyed out
                cy.get(ARFileManagerUploadsModal.getRenameModalApplyBtn()).should('have.attr', 'aria-disabled', 'true')
                //Asserting modal notification
                cy.get(ARFileManagerUploadsModal.getModalNotification()).should('have.text', 'Renaming a file will break any direct links to this file. References within the LMS will not be affected.')
                //Asserting File Name Field 
                cy.get(ARFileManagerUploadsModal.getFileNameInput()).should('have.text', 'File Name')

                //Asserting default name is selected
                cy.get(ARFileManagerUploadsModal.getFileInputByArealable()).invoke('val').then(($text) => {
                    expect($text).to.equal(fileName)
                })

                //Asserting input filed is a required type
                cy.get(ARFileManagerUploadsModal.getFileInputByArealable()).clear()
                cy.get(ARFileManagerUploadsModal.getInputErrorFiled()).should('have.text', 'Field is required.')

                //input filed supports 255 characters
                cy.get(ARFileManagerUploadsModal.getFileInputByArealable()).type('a'.repeat(256), { delay: 0 })
                cy.get(ARFileManagerUploadsModal.getInputErrorFiled()).should('have.text', 'Field cannot be more than 255 characters.')

                //putting correct value 
                //Asserting Apply Button is greyed out
                cy.get(ARFileManagerUploadsModal.getFileInputByArealable()).clear().type('a', { delay: 0 })
                cy.get(ARFileManagerUploadsModal.getRenameModalApplyBtn()).should('have.attr', 'aria-disabled', 'true')

               //Clicking on the cancle button
               cy.get(ARFileManagerUploadsModal.getRenameModalCancelBtn()).click()

            })

        })
        // Asserting File Manager Upload Modal has been opened
        cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', 'File Manager')

    })

    it("The file name is updated in the File manager By Renaming it", () => {

        cy.get(ARFileManagerUploadsModal.getMediaLibraryModal()).within(() => {

            // hover over the images 
            cy.get(ARUploadFileModal.getMediaLibraryImagePreview()).first().parent().parent().within(() => {
                // asserting preview icon 
                cy.get(ARUploadFileModal.getPreview()).find('span').should('have.class', 'icon icon-eye')
                cy.get(ARUploadFileModal.getOption()).find('span').should('have.class', 'icon icon-ellipsis')
                cy.get(ARUploadFileModal.getOption()).invoke('show')
                ARDashboardPage.getShortWait()
                cy.get(ARUploadFileModal.getMediaLibraryFileMenuBtn()).invoke('show').click({ force: true })

            })

            //Clicking on the Preview button from flyout menu 
            cy.get(ARUploadFileModal.getMediaLibraryFileMenuBtn()).first().click({ force: true })

            //clicking on the Rename button from flyout menu
            cy.get(ARFileManagerUploadsModal.getFlyoutMenu()).within(() => {
                //Asserting Rename as 5th item in the menu 
                cy.get(ARUploadFileModal.getMenuItem()).eq(4).should('have.text', "Rename").click({ force: true })
                ARDashboardPage.getShortWait()
            })

        })

        cy.get(ARFileManagerUploadsModal.getDialogues()).within(() => {

            cy.get(ARFileManagerUploadsModal.getDialoguesAsRole()).last().within(() => {

                //Asserting modal header
                cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', "Rename File")
                //putting correct value 
                //Asserting Apply Button is not greyed out
                cy.get(ARFileManagerUploadsModal.getFileInputByArealable()).clear().type(renamedFileName)
                cy.get(ARFileManagerUploadsModal.getRenameModalApplyBtn()).should('have.attr', 'aria-disabled', 'false')

                //Clicking on the Apply button
                cy.get(ARFileManagerUploadsModal.getRenameModalApplyBtn()).click()
                ARDashboardPage.getVLongWait()

            })

        })
        // Asserting File Manager Upload Modal has been opened
        cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', 'File Manager')

        //Aserting file name has been updated

        cy.get(ARFileManagerUploadsModal.getMediaLibraryModal()).within(() => {

            cy.get(ARUploadFileModal.getMediaLibraryImagePreview()).first().parent().parent().parent().within(() => {
                //saving the file name 
                cy.get(ARFileManagerUploadsModal.getFileNameInPresentation()).first().then(($span) => {
                    let splitPart = $span.text().split('.')
                    expect(renamedFileName).to.be.equal(splitPart[0])
                })

            })

        })

    })

})