import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { resourceDetails, file, globalResources } from '../../../../../../helpers/TestData/GlobalResources/globalResources'
import { resourcePaths, images } from '../../../../../../helpers/TestData/resources/resources'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LEResourcesPage from '../../../../../../helpers/LE/pageObjects/Resources/LEResourcesPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARGlobalResourcePage from '../../../../../../helpers/AR/pageObjects/GlobalResources/ARGlobalResourcePage'
import ARFileManagerUploadsModal from '../../../../../../helpers/AR/pageObjects/Modals/ARFileManagerUploadsModal'
import ARDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'

let resourceName;
describe('C4927 AR - File Upload- Change File Visibility', function () {
  beforeEach(function () {
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    arDashboardPage.getGlobalResourcesReport()
  })

  after(function() {
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    arDashboardPage.getGlobalResourcesReport()
    ARGlobalResourcePage.AddFilter('Name','Contains', resourceDetails.resourceName)
    cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
    cy.get(arDashboardPage.getA5TableCellRecordByColumn(2)).contains(resourceDetails.resourceName).click()
    ARGlobalResourcePage.getARDeleteMenuActionsByNameThenClick('Delete Global Resource')
    cy.get(arDeleteModal.getARDeleteBtn()).click()
    cy.get(arDashboardPage.getToastSuccessMsg()).should('be.visible')
  })

  it('Verify Admin Can Create a New Global Resource and Change File Visibility', () => { 
    // Create Global Resource
    cy.get(ARGlobalResourcePage.getAddGlobalresourceBtn()).click()
    // Check if User is navigated to Add resource page
    ARGlobalResourcePage.getAddGlobalResourcePage()

    // Enter valid resource name
    cy.get(ARGlobalResourcePage.getNameField()).type(resourceDetails.resourceName)

    // Open Upload File Manager
    cy.get(ARGlobalResourcePage.getARSourceChooseFileBtn()).click()

    // Select Available Resource File private path
    cy.get(ARGlobalResourcePage.getARFileReuse()).first().click()
    cy.get(ARGlobalResourcePage.getARFileReuse()).first().parent()
    .parent(ARFileManagerUploadsModal.getPresentationDiv())
    .children(ARFileManagerUploadsModal.getFileNameUsingId())
    .invoke('text').then((text)=>{
      resourceName = text
    })
    cy.get(ARGlobalResourcePage.getFileApplyBtn()).click()
    // Save Global Resource
    cy.get(ARGlobalResourcePage.getSaveBtn()).click()
    cy.get(arDashboardPage.getToastSuccessMsg()).should('have.text', 'Global resource created successfully.')
  })

  it('Verify Admin can edit Competency and Change File Visibility', () => {
    // Filter for global resource and edit
    ARGlobalResourcePage.AddFilter('Name', 'Contains', resourceDetails.resourceName)
    cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')

    cy.get(arDashboardPage.getA5TableCellRecordByColumn(2)).contains(resourceDetails.resourceName).click()
    ARGlobalResourcePage.getARAddEditMenuActionsByNameThenClick('Edit Global Resource')
    // Verify name persisted
    cy.get(ARGlobalResourcePage.getNameField()).should('have.value', resourceDetails.resourceName)

    // Open Upload File Manager via Public path
    cy.get(ARGlobalResourcePage.getARSourceChooseFileBtn()).click()
    cy.get(ARGlobalResourcePage.getUploadBtn()).click()
    cy.get(ARGlobalResourcePage.getFileValueTxt()).should('contain.text', resourceName)
    cy.get(ARGlobalResourcePage.getPublicFileRadioBtn()).first().click()
    cy.get(ARGlobalResourcePage.getuploadmodalBtn()).first().click()
    cy.get(ARGlobalResourcePage.getFileInput()).attachFile(resourcePaths.resource_image_folder + images.moose_filename)
    cy.get(ARGlobalResourcePage.getPublicFileRadioBtn()).last().click()
    cy.get(ARGlobalResourcePage.getPublicFileRadioBtn()).first().click()
    cy.get(ARGlobalResourcePage.getFileSaveBtn()).first().should('have.attr','aria-disabled','false').click()
    // Check if Uploaded file title is seen in file text field
    ARGlobalResourcePage.getEdituploadfile()
    // URL Global resource Thumbnail
    cy.get(ARGlobalResourcePage.getGLThumbnUrlBtn()).last().click()
    cy.get(ARGlobalResourcePage.getThumbnUrlTxtField()).should('be.visible')
    cy.get(ARGlobalResourcePage.getThumbnUrlTxtField()).type(file.fileName2)
    
    // Enter description
    cy.get(ARGlobalResourcePage.getDescriptionField()).type(resourceDetails.FilevisibilityDescription)

    // Save Global Resource
    cy.get(ARGlobalResourcePage.getSaveBtn()).click()
    cy.get(arDashboardPage.getToastSuccessMsg()).should('be.visible')
  })
  
  it('Verify User can see uploaded File at Learner Side', () => {
    cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password) 
    cy.get(LEDashboardPage.getNavSearch()).should('be.visible')
    cy.get(LEDashboardPage.getNavMenu()).click()
    LESideMenu.getLEMenuItemsByNameThenClick('Resources')
    LEFilterMenu.SearchForResourceByName(resourceDetails.resourceName)
    cy.get(LEResourcesPage.getResourceCardName()).should('contain', resourceDetails.resourceName).should('be.visible')
    cy.get(LEDashboardPage.getCoursestartbutton()).click()
  })  
})

  
