import DataDashboards from "../../../../../../helpers/Data/PageObjects/Dashboards/DataDashboards";
import DataImportsMenu from "../../../../../../helpers/Data/PageObjects/DataMenu/DataImportsMenu";
import DataLeftSideMenu from "../../../../../../helpers/Data/PageObjects/DataMenu/DataLeftSideMenu";
import DataImportsFormPage from "../../../../../../helpers/Data/PageObjects/Imports/DataImportsFormPage";
import { generalTestData } from "../../../../../../helpers/TestData/DataTeam/generalTestData";

describe('Authenticate in and Create an Import', () => {
  it('should automatically log in and able to create an Import', () => {
    // Visit the authenticated page and assert that the user is logged in
    cy.visit('/')

    cy.get(DataDashboards.getUserProfile()).should('be.visible')

    // Click on Integration side menu and Click on Import submenu
    DataLeftSideMenu.getLeftMenuBtnThenClick('Integrations')
    DataLeftSideMenu.getSubMenuThenClick('Imports')

    //  Click on Add button at Imports page
    DataImportsMenu.getImportsRightSideMenuThenClick('Add')
    
    // Fill in required data

    DataImportsFormPage.getSelectClientByFieldName(generalTestData.client_name)

    cy.get(DataImportsFormPage.getImportName()).type(generalTestData.import_name); 
    cy.get(DataImportsFormPage.getImportProjectID()).type(generalTestData.project_id);

    // Save the import and Success message created  
    DataImportsMenu.getImportsRightSideMenuThenClick('Save');
    cy.get(DataImportsFormPage.getImportCreatedSuccessMessage()).should('be.visible').contains('Created Import');

  });
});
