import DataDashboards from "../../../../../../helpers/Data/PageObjects/Dashboards/DataDashboards";
import DataImportsMenu from "../../../../../../helpers/Data/PageObjects/DataMenu/DataImportsMenu";
import DataLeftSideMenu from "../../../../../../helpers/Data/PageObjects/DataMenu/DataLeftSideMenu";
import { generalTestData } from "../../../../../../helpers/TestData/DataTeam/generalTestData";
import DataImportsFormPage from "../../../../../../helpers/Data/PageObjects/Imports/DataImportsFormPage";


describe('Batch 1 Import a set of integration for multiple modules (Department, Group, User, Role, Category, ThirdPartyCourse and Course)', () => {
    it('batch1 should Import configuration JSON file and upload csv files to Manage Files and Run the Job', () => {
    // visit QA DMS 
    cy.visit('/')
    cy.get(DataDashboards.getUserProfile()).should('be.visible')

    // Click on Integration side menu and Click on Import submenu
    DataLeftSideMenu.getLeftMenuBtnThenClick('Integrations')
    DataLeftSideMenu.getSubMenuThenClick('Imports')

    // Click on Import button at Imports page and Import modal appears
    DataImportsMenu.getImportsRightSideMenuThenClick('Import')
    cy.get(DataImportsMenu.getImportIntegrationModal()).should('be.visible')
    
    // uploading first batch file contained configurations for Department, Group, User, Role, Category, ThirdPartyCourse and Course Modules
    cy.get(DataImportsMenu.getUploadField()).attachFile(generalTestData.uploadBatch1ImportFilePath + generalTestData.uploadBatch1JsonFile)
    cy.get(DataImportsMenu.getSubmitBtn()).click()
    cy.get(DataImportsFormPage.getImportCreatedSuccessMessage(),{timeout:10000}).should('be.visible').contains('Imported Import')

    // launch File Manager modal  
    DataImportsMenu.getImportsRightSideMenuThenClick('Manage Files')
    cy.get(DataImportsFormPage.getFileManagerModal()).should('be.visible').contains('File Manager')   
    cy.get(DataImportsFormPage.getModalSideBarRootFolder()).should('be.visible').and('contain','Import Root').click()
    
    //attaching batch1 files 
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch1ImportFilePath + generalTestData.uploadBatch1CourseSampleFile)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch1ImportFilePath + generalTestData.uploadBatch1CategorySampleFile)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch1ImportFilePath + generalTestData.uploadBatch1DepartmentSampleFile)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch1ImportFilePath + generalTestData.uploadBatch1GroupSampleFile)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch1ImportFilePath + generalTestData.uploadBatch1RoleAssignementSampleFile)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch1ImportFilePath + generalTestData.uploadBatch1ThirdPartyCourseSampleFile)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch1ImportFilePath + generalTestData.uploadBatch1UserSampleFile)
    cy.get(DataImportsFormPage.getFileAttachModalInput())
    .attachFile(generalTestData.uploadBatch1ImportFilePath + generalTestData.uploadBatch1ScormSampleFile)
    DataImportsFormPage.getMediumWait()

    // check upload message pop up gone before check assertion for files attached
    cy.get(DataImportsFormPage.getManageFilesUploadSuccessBox()).should('exist')
    cy.get(DataImportsFormPage.getManageFilesUploadSuccessBox()).should('not.exist') 
    //assert files uploaded success 
    cy.get(DataImportsFormPage.getAttachedFileElementInFileManager())
    .should('contain', generalTestData.uploadBatch1CategorySampleFile)
    .should('contain', generalTestData.uploadBatch1CourseSampleFile)
    .should('contain', generalTestData.uploadBatch1DepartmentSampleFile)
    .should('contain', generalTestData.uploadBatch1GroupSampleFile)
    .should('contain', generalTestData.uploadBatch1RoleAssignementSampleFile)
    .should('contain', generalTestData.uploadBatch1UserSampleFile)
    .should('contain', generalTestData.uploadBatch1ThirdPartyCourseSampleFile)
    .should('contain', generalTestData.uploadBatch1ScormSampleFile)

    //close the Modal
    cy.get(DataImportsFormPage.getFileManagerCloseBtn()).should('exist').scrollIntoView().click()
    
    // Trigger the import job from Run Now submenu by Click Run Now, and Confirm, then assert Import job is triggered
    DataImportsMenu.getImportsRightSideMenuThenClick('Run Now')
    cy.get(DataImportsFormPage.getRunNowModal()).should('contain', 'Confirm')
    cy.get(DataImportsFormPage.getRunNowModalConfirmBtn()).click()
    
    //assert HF job btn displayed  
    cy.get(DataImportsFormPage.getRunPreviewBtn()).should('be.visible')

});
});
