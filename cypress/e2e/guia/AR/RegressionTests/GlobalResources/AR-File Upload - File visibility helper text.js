import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { resourcePaths, images } from '../../../../../../helpers/TestData/resources/resources'
import ARUnsavedChangesModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal'
import { helperTextMessages } from '../../../../../../helpers/TestData/NewsArticle/NewsArticleDetails'
import ARGlobalResourcePage from '../../../../../../helpers/AR/pageObjects/GlobalResources/ARGlobalResourcePage'

describe('AR - File Visibility - Helper Text', function () {
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getMediumWait()
        //Navigate to Global Resources
        cy.get(arDashboardPage.getElementByAriaLabelAttribute("Courses")).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName("Global Resources"))
        arDashboardPage.getMediumWait()
    })

    after(function() {
        arDashboardPage.getMediumWait()
        cy.get(arDashboardPage.getCancelBtn()).click()
        arDashboardPage.getShortWait()

        cy.get(ARUnsavedChangesModal.getPromptContent()).should('contain', ARUnsavedChangesModal.getUnsavedChangesMsg())
        cy.get(ARUnsavedChangesModal.getOKBtn()).click()
        arDashboardPage.getShortWait()
    })


    it('Verify Helper Text in Global Resource', () => {
        // Create Global Resource
        cy.get(ARGlobalResourcePage.getAddGlobalresourceBtn()).click()
        arDashboardPage.getShortWait()

        // Check if User is navigated to Add resource page
        ARGlobalResourcePage.getAddGlobalResourcePage()

        // Open Upload File Pop up
        cy.get(ARGlobalResourcePage.getARChooseFileBtn()).first().click()

        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click({ force: true })
        cy.get(ARUploadFileModal.getOcLoFileUploadDiv()).find(arDashboardPage.getFileInput()).attachFile(resourcePaths.resource_image_folder + images.moose_filename)
        arDashboardPage.getMediumWait()

        // Check Helper text when Public radio button is selecetd
        cy.get(ARUploadFileModal.getPublicPrivateHelperText()).should('have.text',helperTextMessages.textWhenPublicSelecetd)

        // Change the Visibility to Private from Public.
        cy.get(ARUploadFileModal.getPublicPrivateRadioBtn()).contains('Private').click()
        arDashboardPage.getShortWait()
        
        // Check Helper text when private radio button is selecetd
        cy.get(ARUploadFileModal.getPublicPrivateHelperText()).should('have.text',helperTextMessages.textWhenPrivateSelecetd)
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        arDashboardPage.getVLongWait()
    })   
}) 
 