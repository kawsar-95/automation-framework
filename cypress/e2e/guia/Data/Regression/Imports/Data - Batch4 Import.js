import DataDashboards from "../../../../../../helpers/Data/PageObjects/Dashboards/DataDashboards";
import DataImportsMenu from "../../../../../../helpers/Data/PageObjects/DataMenu/DataImportsMenu";
import DataLeftSideMenu from "../../../../../../helpers/Data/PageObjects/DataMenu/DataLeftSideMenu";
import { generalTestData } from "../../../../../../helpers/TestData/DataTeam/generalTestData";
import DataImportsFormPage from "../../../../../../helpers/Data/PageObjects/Imports/DataImportsFormPage";


describe('Batch 4 Import a set of integration for multiple modules (Attendance Certificates Competencies CompetenciesAssignment EnrollKeys EnrollRules ExternalTrainings)', () => {
    it('batch 4 should Import configuration JSON file and upload csv files to Manage Files and Run the Job', () => {
    // visit QA DMS 
    cy.visit('/')
    cy.get(DataDashboards.getUserProfile()).should('be.visible')

    // Click on Integration side menu and Click on Import submenu
    DataLeftSideMenu.getLeftMenuBtnThenClick('Integrations')
    DataLeftSideMenu.getSubMenuThenClick('Imports')

    // Click on Import button at Imports page and Import modal appears
    DataImportsMenu.getImportsRightSideMenuThenClick('Import')
    cy.get(DataImportsMenu.getImportIntegrationModal()).should('be.visible')
    
    // uploading Json file contained configurations for Attendance Certificates Competencies CompetenciesAssignment EnrollKeys EnrollRules ExternalTrainings Modules
    cy.get(DataImportsMenu.getUploadField()).attachFile(generalTestData.uploadBatch4ImportFilePath + generalTestData.uploadBatch4JsonFile)
    cy.get(DataImportsMenu.getSubmitBtn()).click()
    cy.get(DataImportsFormPage.getImportCreatedSuccessMessage(),{timeout:10000}).should('be.visible').contains('Imported Import')

    // launch File Manager modal  
    DataImportsMenu.getImportsRightSideMenuThenClick('Manage Files')
    cy.get(DataImportsFormPage.getFileManagerModal()).should('be.visible').contains('File Manager')   
    cy.get(DataImportsFormPage.getModalSideBarRootFolder()).should('be.visible').and('contain','Import Root').click()
   
    //attaching batch4 files 
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch4ImportFilePath + generalTestData.uploadBatch4Attendance)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch4ImportFilePath + generalTestData.uploadBatch4Certificates)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch4ImportFilePath + generalTestData.uploadBatch4Competencies)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch4ImportFilePath + generalTestData.uploadBatch4CompetencyAssignments)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch4ImportFilePath + generalTestData.uploadBatch4EnrollmentKeys)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch4ImportFilePath + generalTestData.uploadBatch4EnrollmentRules)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch4ImportFilePath + generalTestData.uploadBatch4ExternalTrainings)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch4ImportFilePath + generalTestData.uploadBatch4Managers)
    
    // check upload message pop up gone before check assertion for files attached
     cy.get(DataImportsFormPage.getManageFilesUploadSuccessBox()).should('exist')
     cy.get(DataImportsFormPage.getManageFilesUploadSuccessBox()).should('not.exist') 
    //assert files uploaded success 
    cy.get(DataImportsFormPage.getAttachedFileElementInFileManager())
    .should('contain', generalTestData.uploadBatch4Attendance)
    .should('contain', generalTestData.uploadBatch4Certificates)
    .should('contain', generalTestData.uploadBatch4Competencies)
    .should('contain', generalTestData.uploadBatch4CompetencyAssignments)
    .should('contain', generalTestData.uploadBatch4EnrollmentKeys)
    .should('contain', generalTestData.uploadBatch4EnrollmentRules)
    .should('contain', generalTestData.uploadBatch4ExternalTrainings)
    .should('contain', generalTestData.uploadBatch4Managers)
  
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
