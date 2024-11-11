import DataDashboards from "../../../../../../helpers/Data/PageObjects/Dashboards/DataDashboards";
import DataImportsMenu from "../../../../../../helpers/Data/PageObjects/DataMenu/DataImportsMenu";
import DataLeftSideMenu from "../../../../../../helpers/Data/PageObjects/DataMenu/DataLeftSideMenu";
import DataImportsFormPage from "../../../../../../helpers/Data/PageObjects/Imports/DataImportsFormPage";
import { generalTestData } from "../../../../../../helpers/TestData/DataTeam/generalTestData";

describe('Add Modules of Deparment and User', () => {
  beforeEach(() => {
    // visit QA DMS 
    cy.visit('/')
    cy.get(DataDashboards.getUserProfile()).should('be.visible')

    // Click on Integration side menu and Click on Import submenu
    DataLeftSideMenu.getLeftMenuBtnThenClick('Integrations')
    DataLeftSideMenu.getSubMenuThenClick('Imports')

    //  Click on Add button at Imports page
    DataImportsMenu.getImportsRightSideMenuThenClick('Add')
    
    // Fill in required data
    DataImportsFormPage.getSelectClientByFieldName(generalTestData.client_name)
    cy.get(DataImportsFormPage.getImportName()).type(generalTestData.import_name)
    cy.get(DataImportsFormPage.getImportProjectID()).type(generalTestData.project_id)

    // Save the import and Success message created  
    DataImportsMenu.getImportsRightSideMenuThenClick('Save')
    cy.get(DataImportsFormPage.getImportCreatedSuccessMessage()).should('be.visible').contains('Created Import')

    // Click on Add Module to open Module Type modal
    DataImportsMenu.getImportsRightSideMenuThenClick('Add Module')
    cy.get(DataImportsFormPage.getLearningObjectModuleTitle()).should('be.visible').contains('Please select a module type')

    });

    it('should add Department module', () => {
    // selecting Department Module Radio
    DataImportsFormPage.getSelectedModuleTypeRadioThenClick('Department')
    DataImportsMenu.getShortWait()
    cy.get(DataImportsMenu.getModuleTypeModalNextBtn()).click()   
    cy.get(DataImportsFormPage.getSampleFileModalHeader()).should('be.visible').contains('Sample File')
    
    // Uploading Department File
    cy.get(DataImportsMenu.getUploadField()).attachFile(generalTestData.uploadImportFilePath + generalTestData.uploadDepartmentSampleFIle)
    cy.get(DataImportsMenu.getModuleTypeModalAddBtn()).click()
    DataImportsMenu.getMediumWait()
    cy.get(DataImportsFormPage.getModulePageTitle()).scrollIntoView().should('be.visible').contains('Department Module')

    });


    it('should add User module', () => {
    // selecting User Module Radio
    DataImportsFormPage.getSelectedModuleTypeRadioThenClick('User')
    DataImportsMenu.getShortWait()
    cy.get(DataImportsMenu.getModuleTypeModalNextBtn()).click()   
    cy.get(DataImportsFormPage.getSampleFileModalHeader()).should('be.visible').contains('Sample File')
        
    // Uploading User File
    cy.get(DataImportsMenu.getUploadField()).attachFile(generalTestData.uploadImportFilePath + generalTestData.uploadUserSampleFIle)
    cy.get(DataImportsMenu.getModuleTypeModalAddBtn()).click()
    DataImportsMenu.getMediumWait()
    cy.get(DataImportsFormPage.getModulePageTitle()).scrollIntoView().should('be.visible').contains('User Module')
    
    });

});