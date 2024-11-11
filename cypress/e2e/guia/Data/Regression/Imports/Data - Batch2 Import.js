import DataDashboards from "../../../../../../helpers/Data/PageObjects/Dashboards/DataDashboards";
import DataImportsMenu from "../../../../../../helpers/Data/PageObjects/DataMenu/DataImportsMenu";
import DataLeftSideMenu from "../../../../../../helpers/Data/PageObjects/DataMenu/DataLeftSideMenu";
import { generalTestData } from "../../../../../../helpers/TestData/DataTeam/generalTestData";
import DataImportsFormPage from "../../../../../../helpers/Data/PageObjects/Imports/DataImportsFormPage";


describe('Batch 2 Import a set of integration for multiple modules (CourseFileUploader, DepartmentAdmin, GroupAssign, GroupAdmin, Venue, Session, Class Modules)', () => {
    it('batch2 should Import configuration JSON file and upload csv files to Manage Files and Run the Job', () => {
    // visit QA DMS 
    cy.visit('/')
    cy.get(DataDashboards.getUserProfile()).should('be.visible')

    // Click on Integration side menu and Click on Import submenu
    DataLeftSideMenu.getLeftMenuBtnThenClick('Integrations')
    DataLeftSideMenu.getSubMenuThenClick('Imports')

    // Click on Import button at Imports page and Import modal appears
    DataImportsMenu.getImportsRightSideMenuThenClick('Import')
    cy.get(DataImportsMenu.getImportIntegrationModal()).should('be.visible')
    
    // uploading second batch file contained configurations for CourseFileUploader, DepartmentAdmin, GroupAssign, GroupAdmin, Venue, Session, Class Modules
    cy.get(DataImportsMenu.getUploadField()).attachFile(generalTestData.uploadBatch2ImportFilePath + generalTestData.uploadBatch2JsonFile)
    cy.get(DataImportsMenu.getSubmitBtn()).click()
    cy.get(DataImportsFormPage.getImportCreatedSuccessMessage(),{timeout:10000}).should('be.visible').contains('Imported Import')

    // launch File Manager modal  
    DataImportsMenu.getImportsRightSideMenuThenClick('Manage Files')
    cy.get(DataImportsFormPage.getFileManagerModal()).should('be.visible').contains('File Manager')   
    cy.get(DataImportsFormPage.getModalSideBarRootFolder()).should('be.visible').and('contain','Import Root').click()
    
    //attaching batch2 files 
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch2ImportFilePath + generalTestData.uploadBatch2ClassSampleFile)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch2ImportFilePath + generalTestData.uploadBatch2CourseFileUploaderSampleFile)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch2ImportFilePath + generalTestData.uploadBatch2DepartmentAdminSampleFile)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch2ImportFilePath + generalTestData.uploadBatch2GroupAdminSampleFile)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch2ImportFilePath + generalTestData.uploadBatch2GroupAssignmentSampleFile)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch2ImportFilePath + generalTestData.uploadBatch2SessionSampleFile)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch2ImportFilePath + generalTestData.uploadBatch2VenueSampleFile)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch2ImportFilePath + generalTestData.uploadBatch2AbsorbJpgSampleFile)

    // check upload message pop up gone before check assertion for files attached
    cy.get(DataImportsFormPage.getManageFilesUploadSuccessBox()).should('exist')
    cy.get(DataImportsFormPage.getManageFilesUploadSuccessBox()).should('not.exist') 
    //assert files uploaded success 
    cy.get(DataImportsFormPage.getAttachedFileElementInFileManager())
    .should('contain', generalTestData.uploadBatch2ClassSampleFile)
    .should('contain', generalTestData.uploadBatch2CourseFileUploaderSampleFile)
    .should('contain', generalTestData.uploadBatch2DepartmentAdminSampleFile)
    .should('contain', generalTestData.uploadBatch2GroupAdminSampleFile)
    .should('contain', generalTestData.uploadBatch2GroupAssignmentSampleFile)
    .should('contain', generalTestData.uploadBatch2SessionSampleFile)
    .should('contain', generalTestData.uploadBatch2VenueSampleFile)
    .should('contain', generalTestData.uploadBatch2AbsorbJpgSampleFile)
    
    //close the Modal
    cy.get(DataImportsFormPage.getFileManagerCloseBtn()).should('exist').scrollIntoView().click()
    
    // Trigger the import job from Run Now 
    DataImportsMenu.getImportsRightSideMenuThenClick('Run Now')
    cy.get(DataImportsFormPage.getRunNowModal()).should('contain', 'Confirm')
    cy.get(DataImportsFormPage.getRunNowModalConfirmBtn()).click()
    
    //assert HF job btn displayed    
    cy.get(DataImportsFormPage.getRunPreviewBtn()).should('be.visible')

});
});
