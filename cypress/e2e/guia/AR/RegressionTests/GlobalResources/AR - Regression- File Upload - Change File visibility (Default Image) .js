import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARGlobalResourcePage from "../../../../../../helpers/AR/pageObjects/GlobalResources/ARGlobalResourcePage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARFileManagerUploadsModal from "../../../../../../helpers/AR/pageObjects/Modals/ARFileManagerUploadsModal"
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import LECourseDetailsOCModule from "../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule"
import LECourseLessonPlayerPage from "../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LESideMenu from "../../../../../../helpers/LE/pageObjects/Menu/LESideMenu"
import LEResourcesPage from "../../../../../../helpers/LE/pageObjects/Resources/LEResourcesPage"
import { resourceDetails } from "../../../../../../helpers/TestData/GlobalResources/globalResources"
import { helperTextMessages } from "../../../../../../helpers/TestData/NewsArticle/NewsArticleDetails"
import { images, resourcePaths } from "../../../../../../helpers/TestData/resources/resources"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C5169 AUt-33 - File Upload - Replace Existing uploaded file using Choose file', () => {


    after("Clean Up", function () {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getGlobalResourcesReport()

        ARDashboardPage.AddFilter('Name', 'Contains', resourceDetails.resourceName)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(ARDashboardPage.getA5TableCellRecordByColumn(2)).contains(resourceDetails.resourceName).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        ARGlobalResourcePage.getARDeleteMenuActionsByNameThenClick('Delete Global Resource')
        cy.get(ARDeleteModal.getDeletePromptContent()).should('have.text', ARDeleteModal.getDeleteMsg(resourceDetails.resourceName))
        cy.get(ARDeleteModal.getARDeleteBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('have.text', 'Global resource deleted successfully.')
    })

    it('Create temporary global resource', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getGlobalResourcesReport()
        // Add New Resource
        cy.get(ARGlobalResourcePage.getAddGlobalresourceBtn()).click()

        //Type the Global Resource name
        cy.get(ARGlobalResourcePage.getNameField()).type(resourceDetails.resourceName)


        // Open Upload File Manager
        cy.get(ARGlobalResourcePage.getARSourceChooseFileBtn()).click()

        //Clicking on the upload button
        cy.get(ARFileManagerUploadsModal.getUploadButton()).click()

        //Asserting that Public is selected by default 
        cy.get(ARUploadFileModal.getPublicPrivateRadioBtn()).contains('Public').parent().find('input').should('have.attr', 'aria-checked', 'true')

        //Adding the file 
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_image_folder + images.moose_filename)
        //Saving the file
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(ARDashboardPage.getSaveBtn()).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('have.text', 'Global resource created successfully.')

    })

    it('File Upload - Replace Existing uploaded file using Choose file', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getGlobalResourcesReport()
        // Click on edit existing Resource.
        ARDashboardPage.AddFilter('Name', 'Contains', resourceDetails.resourceName)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(ARDashboardPage.getA5TableCellRecordByColumn(2)).contains(resourceDetails.resourceName).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        ARGlobalResourcePage.getARAddEditMenuActionsByNameThenClick('Edit Global Resource')

        // Open Upload File Manager
        cy.get(ARGlobalResourcePage.getARSourceChooseFileBtn()).click()

        //Clicking on the upload button
        cy.get(ARFileManagerUploadsModal.getUploadButton()).click()

        //Asserting that Public is selected by default 
        cy.get(ARUploadFileModal.getPublicPrivateRadioBtn()).contains('Public').parent().find('input').should('have.attr', 'aria-checked', 'true')

        // Change the Visibility to Private from Public.
        cy.get(ARUploadFileModal.getPublicPrivateRadioBtn()).contains('Public').click()

        // Check Helper text when Public radio button is selecetd
        cy.get(ARUploadFileModal.getPublicPrivateHelperText()).should('have.text', helperTextMessages.textWhenPublicSelecetd)

        // Change the Visibility to Private from Public.
        cy.get(ARUploadFileModal.getPublicPrivateRadioBtn()).contains('Private').click()

        // Check Helper text when private radio button is selecetd
        cy.get(ARUploadFileModal.getPublicPrivateHelperText()).should('have.text', helperTextMessages.textWhenPrivateSelecetd)

        // Change the Visibility to Private from Public.
        cy.get(ARUploadFileModal.getPublicPrivateRadioBtn()).contains('Public').click()
        //Asserting that Last modified time is present
        cy.get(ARUploadFileModal.getLastModifiedSpan()).should('exist')
        //Adding a different file 
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_image_folder + images.billboard_01_filename)

        //Saving the file
        cy.get(ARUploadFileModal.getSaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(ARDashboardPage.getSaveBtn()).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('have.text', 'Global resource updated successfully.')

    })

    it("Users Can View the Global Resource in Learner side " , ()=>{
        //Log  into the learner side 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Resources')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), { timeout: 15000 }).should('not.exist', { timeout: 15000 })
        cy.get(LEResourcesPage.getResourcesPageTitle()).should('contain', 'Resources')
        cy.get(LEResourcesPage.getResourceNameSearchTxtField()).clear().type(resourceDetails.resourceName)
        cy.get(LEResourcesPage.getSearchNameBtn()).click()
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), { timeout: 10000 }).should('not.exist', { timeout: 10000 })
        cy.get(LEResourcesPage.getResourceName()).should('contain', resourceDetails.resourceName )
    
    })
})