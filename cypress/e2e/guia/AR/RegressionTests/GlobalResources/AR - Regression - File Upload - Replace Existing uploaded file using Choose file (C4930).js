import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARGlobalResourcePage from "../../../../../../helpers/AR/pageObjects/GlobalResources/ARGlobalResourcePage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import { resourceDetails } from "../../../../../../helpers/TestData/GlobalResources/globalResources"
import { images, resourcePaths } from "../../../../../../helpers/TestData/resources/resources"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C4930 - File Upload - Replace Existing uploaded file using Choose file', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getGlobalResourcesReport()
    })

    after(function () {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getGlobalResourcesReport()

        ARDashboardPage.AddFilter('Name', 'Contains', resourceDetails.resourceName)
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getA5TableCellRecordByColumn(2)).contains(resourceDetails.resourceName).click()
        ARGlobalResourcePage.getARDeleteMenuActionsByNameThenClick('Delete Global Resource')
        cy.get(ARDeleteModal.getARDeleteBtn()).click()
        ARDashboardPage.getShortWait()
    })

    it('Create temporary global resource', () => {
        // Add New Resource
        cy.get(ARGlobalResourcePage.getAddGlobalresourceBtn()).click()
        ARDashboardPage.getMediumWait()

        cy.get(ARGlobalResourcePage.getNameField()).type(resourceDetails.resourceName)

        // Open Upload File Pop up
        cy.get(ARGlobalResourcePage.getARChooseFileBtn()).first().click()

        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click({ force: true })
        cy.get(ARUploadFileModal.getOcLoFileUploadDiv()).find(ARDashboardPage.getFileInput()).attachFile(resourcePaths.resource_image_folder + images.moose_filename)
        ARDashboardPage.getMediumWait()
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        cy.get(ARDashboardPage.getSaveBtn()).click()
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('have.text', 'Global resource created successfully.')
        ARDashboardPage.getShortWait()
    })

    it('File Upload - Replace Existing uploaded file using Choose file', () => {
        // Click on edit existing Resource.
        ARDashboardPage.AddFilter('Name', 'Contains', resourceDetails.resourceName)
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getShortWait()

        ARGlobalResourcePage.getARAddEditMenuActionsByNameThenClick('Edit Global Resource')
        ARDashboardPage.getLongWait()

        // Step 9
        // Click on Choose File button in File (or URL) field.
        cy.get(ARGlobalResourcePage.getARChooseFileBtn()).first().click()

        // Click on Choose file button on upload file pop-up.
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click({ force: true })
        ARDashboardPage.getShortWait()
        // Change the Visibility to Private from Public.
        cy.get(ARUploadFileModal.getPublicPrivateRadioBtn()).contains('Private').click()
        ARDashboardPage.getShortWait()
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        ARDashboardPage.getVLongWait()

        // Step 10,  
        // Click on Choose File button in File (or URL) field.
        cy.get(ARGlobalResourcePage.getARChooseFileBtn()).first().click()
        // Previously uploaded file name and selected permission level should

        // Click on Choose file button on upload file pop-up.
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click({ force: true })
        // Click on Choose file button on upload file pop-up again and select file 
        cy.get(ARUploadFileModal.getOcLoFileUploadDiv()).find(ARDashboardPage.getFileInput()).attachFile(resourcePaths.resource_image_folder + images.wave_filename)
        ARDashboardPage.getShortWait()        
        
        // Click on cancel
        cy.get(ARUploadFileModal.getCancelBtn()).click({ force: true })
        ARDashboardPage.getShortWait()
        cy.get(ARGlobalResourcePage.getFileCancelBtn()).click({force:true})
        ARDashboardPage.getMediumWait()

        // Step 11
        // Click on Choose File button in File (or URL) field.
        cy.get(ARGlobalResourcePage.getARChooseFileBtn()).first().click()
        // Previously uploaded file name and selected permission level should

        // Click on Choose file button on upload file pop-up.
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click({ force: true })
        ARDashboardPage.getShortWait()
        cy.get(ARUploadFileModal.getSaveBtn()).should('have.attr', 'aria-disabled', 'true')

        // Click on Choose file button on upload file pop-up again and select file 
        cy.get(ARUploadFileModal.getOcLoFileUploadDiv()).find(ARDashboardPage.getFileInput()).attachFile(resourcePaths.resource_image_folder + images.wave_filename)
        ARDashboardPage.getShortWait()

        // Change the Visibility to Private from Public.
        cy.get(ARUploadFileModal.getSaveBtn()).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        // Step 13
        // Click on Choose File button in File (or URL) field.

        cy.get(ARGlobalResourcePage.getARChooseFileBtn()).first().click()
        // Previously uploaded file name and selected permission level should

        // Click on Choose file button on upload file pop-up.
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click({ force: true })
        ARDashboardPage.getShortWait()
        cy.get(ARUploadFileModal.getSaveBtn()).should('have.attr', 'aria-disabled', 'true')

        // Click on Choose file button on upload file pop-up again and select file 
        cy.get(ARUploadFileModal.getOcLoFileUploadDiv()).find(ARDashboardPage.getFileInput()).attachFile(resourcePaths.resource_image_folder + images.wave_special_character_filename)
        ARDashboardPage.getShortWait()

        cy.get(ARUploadFileModal.getSaveBtn()).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        
        ARDashboardPage.getVLongWait()
    })
})