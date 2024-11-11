import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import A5FeatureFlagsPage, { featureFlagDetails } from "../../../../../../helpers/AR/pageObjects/FeatureFlags/A5FeatureFlagsPage"
import ARGlobalResourcePage from "../../../../../../helpers/AR/pageObjects/GlobalResources/ARGlobalResourcePage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import AREditClientUserPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEResourcesPage from "../../../../../../helpers/LE/pageObjects/Resources/LEResourcesPage"
import { file } from "../../../../../../helpers/TestData/GlobalResources/globalResources"
import { globalResources } from "../../../../../../helpers/TestData/GlobalResources/globalResources"
import { resourceDetails } from "../../../../../../helpers/TestData/GlobalResources/globalResources"
import { miscData } from "../../../../../../helpers/TestData/Misc/misc"
import { users } from "../../../../../../helpers/TestData/users/users"


describe('AUT-797 - C7513 - Global Resource Thumbnail', () => {

    before('Turn on Global Resource Thumbnail Feature Flag', () => {
        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin/featureflags')
        A5FeatureFlagsPage.getTurnOnOffFeatureFlagbyName(featureFlagDetails.EnableGlobalResourceThumbnails, 'true')
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        ARDashboardPage.getMediumWait()
    })

    after('Turn Off the FF', () => {
        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin/featureflags')
        A5FeatureFlagsPage.getTurnOnOffFeatureFlagbyName(featureFlagDetails.EnableGlobalResourceThumbnails, 'false')
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        ARDashboardPage.getMediumWait()
    })

    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    it('Thumbnail set to Public ', () => {
        ARDashboardPage.getGlobalResourcesReport()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Global Resource')).click()
        ARGlobalResourcePage.getAddGlobalResourcePage()

        cy.get(ARGlobalResourcePage.getNameField()).type(resourceDetails.resourceNamePublic)
        cy.get(ARGlobalResourcePage.getThumbnailFormSection()).within(() => {
            cy.get(ARGlobalResourcePage.getChooseFileBtn()).click()

        })
        cy.get(ARGlobalResourcePage.getUploadBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(miscData.resource_image_folder_path + file.FileName)
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(ARDashboardPage.getUploadFileDialog()).within(() => {
            cy.get(ARDashboardPage.getSaveBtn()).should('have.attr','aria-disabled','false').click()
        })
        cy.get(ARDashboardPage.getUploadFileDialog()).should('not.exist')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(ARGlobalResourcePage.getSaveBtn()).click()
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('be.visible')
    })

    it('Thumbnail set to Private ', () => {
        ARDashboardPage.getGlobalResourcesReport()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Global Resource')).click()
        ARGlobalResourcePage.getAddGlobalResourcePage()
        cy.get(ARGlobalResourcePage.getNameField()).type(resourceDetails.resourceNamePrivate)
        cy.get(ARGlobalResourcePage.getThumbnailFormSection()).within(() => {
            cy.get(ARGlobalResourcePage.getChooseFileBtn()).click()
        })
        cy.get(ARGlobalResourcePage.getUploadBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(miscData.resource_image_folder_path + file.FileName)
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(ARDashboardPage.getUploadFileDialog()).within(() => {
            cy.get(ARDashboardPage.getSaveBtn()).should('have.attr','aria-disabled','false').click()
        })
        cy.get(ARDashboardPage.getUploadFileDialog()).should('not.exist')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(ARGlobalResourcePage.getSaveBtn()).click()
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('be.visible')
    })
    it('Thumbnail file not image file', () => {
        ARDashboardPage.getGlobalResourcesReport()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Global Resource')).click()
        ARGlobalResourcePage.getAddGlobalResourcePage()
        cy.get(ARGlobalResourcePage.getNameField()).type(resourceDetails.resourceNameNotImage)
        cy.get(ARGlobalResourcePage.getThumbnailFormSection()).within(() => {
            cy.get(ARGlobalResourcePage.getChooseFileBtn()).click()
        })
        cy.get(ARGlobalResourcePage.getUploadBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(miscData.resource_video_folder_path + 'small.mp4')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(ARDashboardPage.getUploadFileDialog()).within(() => {
            cy.get(ARDashboardPage.getSaveBtn()).should('have.attr','aria-disabled','false').click()
        })
        cy.get(ARDashboardPage.getUploadFileDialog()).should('not.exist')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(ARGlobalResourcePage.getSaveBtn()).click()
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('be.visible')
    })
    it('Check resources on learner side', () => {
        LEDashboardPage.visitAndSearch('resources','name', resourceDetails.resourceName)
        cy.get(LEResourcesPage.getChooseViewBtn()).should('be.visible')
        cy.get(LEResourcesPage.getChooseViewBtn()).click()
        cy.get(LEResourcesPage.getChooseCardViewBtn()).click()
        // Test resource with public thumbnail has image
        cy.get(LEResourcesPage.getResourceCardThumbnail()).eq(0).within(() => {
            cy.get(LEResourcesPage.getResourceCardThumbnailImg()).should('not.exist')
        })
        // Test resource with private thumbnail has image
        cy.get(LEResourcesPage.getResourceCardThumbnail()).eq(1).within(() => {
            cy.get(LEResourcesPage.getResourceCardThumbnailImg()).should('exist')
        })
        // Test resource with other file thumbnail has no image
        cy.get(LEResourcesPage.getResourceCardThumbnail()).eq(2).within(() => {
            cy.get(LEResourcesPage.getResourceCardThumbnailImg()).should('exist')
        })
    })
    it('Delete created resources', () => {
        ARDashboardPage.getGlobalResourcesReport()
        ARDashboardPage.AddFilter('Name', 'Contains', resourceDetails.resourceName)
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        cy.get(ARDashboardPage.getGridTable()).eq(1).click()
        cy.get(ARDashboardPage.getGridTable()).eq(2).click()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete Global Resources')).should('have.attr','aria-disabled','false').click()
        cy.get(ARDeleteModal.getARDeleteBtn()).click()
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('be.visible')
    })
})