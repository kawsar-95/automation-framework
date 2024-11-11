import DataDashboards from "../../../../../../helpers/Data/PageObjects/Dashboards/DataDashboards";
import DataImportsMenu from "../../../../../../helpers/Data/PageObjects/DataMenu/DataImportsMenu";
import DataLeftSideMenu from "../../../../../../helpers/Data/PageObjects/DataMenu/DataLeftSideMenu";
import { generalTestData } from "../../../../../../helpers/TestData/DataTeam/generalTestData";
import DataImportsFormPage from "../../../../../../helpers/Data/PageObjects/Imports/DataImportsFormPage";


describe('Batch 3 Import a set of integration for multiple modules (ActivityEnroll, Assessments, Enrollments, Lessons, QuestionBank, QuestionOptions, Questions Modules)', () => {
    it('batch 3 should Import configuration JSON file and upload csv files to Manage Files and Run the Job', () => {
    // visit QA DMS 
    cy.visit('/')
    cy.get(DataDashboards.getUserProfile()).should('be.visible')

    // Click on Integration side menu and Click on Import submenu
    DataLeftSideMenu.getLeftMenuBtnThenClick('Integrations')
    DataLeftSideMenu.getSubMenuThenClick('Imports')

    // Click on Import button at Imports page and Import modal appears
    DataImportsMenu.getImportsRightSideMenuThenClick('Import')
    cy.get(DataImportsMenu.getImportIntegrationModal()).should('be.visible')
    
    // uploading Json file contained configurations for ActivityEnroll Assessments Enrollments Lessons QuestionBank QuestionOptions Questions Modules
    cy.get(DataImportsMenu.getUploadField()).attachFile(generalTestData.uploadBatch3ImportFilePath + generalTestData.uploadBatch3JsonFile)
    cy.get(DataImportsMenu.getSubmitBtn()).click()
    cy.get(DataImportsFormPage.getImportCreatedSuccessMessage(),{timeout:10000}).should('be.visible').contains('Imported Import')

    // launch File Manager modal  
    DataImportsMenu.getImportsRightSideMenuThenClick('Manage Files')
    cy.get(DataImportsFormPage.getFileManagerModal()).should('be.visible').contains('File Manager')   
    cy.get(DataImportsFormPage.getModalSideBarRootFolder()).should('be.visible').and('contain','Import Root').click()
    
    //attaching batch3 files 
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch3ImportFilePath + generalTestData.uploadBatch3ActivityEnrollments)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch3ImportFilePath + generalTestData.uploadBatch3SampleAssessments)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch3ImportFilePath + generalTestData.uploadBatch3SampleEnrollments)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch3ImportFilePath + generalTestData.uploadBatch3SampleLessons)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch3ImportFilePath + generalTestData.uploadBatch3SampleQuestionBank)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch3ImportFilePath + generalTestData.uploadBatch3SampleQuestionOptions)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch3ImportFilePath + generalTestData.uploadBatch3SampleQuestions)
    DataImportsFormPage.getMediumWait()

    // check upload message pop up gone before check assertion for files attached
     cy.get(DataImportsFormPage.getManageFilesUploadSuccessBox()).should('exist')
     cy.get(DataImportsFormPage.getManageFilesUploadSuccessBox()).should('not.exist') 
    //assert files uploaded success 
    cy.get(DataImportsFormPage.getAttachedFileElementInFileManager())
    .should('contain', generalTestData.uploadBatch3ActivityEnrollments)
    .should('contain', generalTestData.uploadBatch3SampleAssessments)
    .should('contain', generalTestData.uploadBatch3SampleEnrollments)
    .should('contain', generalTestData.uploadBatch3SampleLessons)
    .should('contain', generalTestData.uploadBatch3SampleQuestionBank)
    .should('contain', generalTestData.uploadBatch3SampleQuestionOptions)
    .should('contain', generalTestData.uploadBatch3SampleQuestions)

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
