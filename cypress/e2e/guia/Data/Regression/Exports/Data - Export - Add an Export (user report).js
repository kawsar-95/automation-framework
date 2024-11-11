import DataDashboards from "../../../../../../helpers/Data/PageObjects/Dashboards/DataDashboards";
import DataImportsMenu from "../../../../../../helpers/Data/PageObjects/DataMenu/DataImportsMenu";
import DataLeftSideMenu from "../../../../../../helpers/Data/PageObjects/DataMenu/DataLeftSideMenu";
import DataReportPage from "../../../../../../helpers/Data/PageObjects/Exports/DataReportPage";
import DataImportsFormPage from "../../../../../../helpers/Data/PageObjects/Imports/DataImportsFormPage";
import { generalTestData } from "../../../../../../helpers/TestData/DataTeam/generalTestData";

describe('Create a User Report', () => {
  it('should able to add and configure a new User Report', () => {
    // Visit the authenticated page and assert that the user is logged in
    cy.visit('/')
    cy.viewport(1660, 1080)

    cy.get(DataDashboards.getUserProfile()).should('be.visible')

    // Click on Integration side menu and Click on Exports submenu
    DataLeftSideMenu.getLeftMenuBtnThenClick('Integrations')
    DataLeftSideMenu.getSubMenuThenClick('Exports')

    //  Click on Add button at Exports page
    DataImportsMenu.getImportsRightSideMenuThenClick('Add')
    
    // Fill in required data at General
    DataImportsFormPage.getSelectClientByFieldName(generalTestData.client_name)
    cy.get(DataImportsFormPage.getImportName()).type(generalTestData.user_report_name); 
    cy.get(DataImportsFormPage.getImportProjectID()).type(generalTestData.project_id);

    // Navigate to File Format tab to add file name
    DataReportPage.getReportAddPageNavTabThenClick('File Format')
    cy.get(DataReportPage.getFileFormatFileNameField()).type(generalTestData.user_report_filename)

    // Navigate to Configure tab to add tables and columns  
    // Intial Table - Users 
    DataReportPage.getReportAddPageNavTabThenClick('Configure')
    DataReportPage.getSelectTableByFieldName('dbo.Users')
    DataReportPage.getColumnsButtonAndClick('Columns')
    cy.get(DataReportPage.getSelectColumnsModal()).should('be.visible')
    DataReportPage.getColumnsCheckBoxAndClick('Username',0)
    DataReportPage.getColumnsCheckBoxAndClick('FirstName',0)
    DataReportPage.getColumnsCheckBoxAndClick('LastName',0)
    DataReportPage.getColumnsCheckBoxAndClick('ActiveStatus',0)
    DataReportPage.getColumnsCheckBoxAndClick('IsAdmin',0)
    cy.get(DataReportPage.getSelectColumnsModalSaveBtn()).eq(0).click()
    
    // Join Departments table
    cy.get(DataReportPage.getJoinTitleBox()).should('be.visible').and('contain','Join')
    cy.get(DataReportPage.getJoinTitleBox()).contains('Join').parent(DataReportPage.getReportJoinCardBox()).within(()=>{
      cy.get(DataReportPage.getInitialTableSearchField()).click()
    })
    cy.get(DataReportPage.getInitialTableTextF()).type('dbo.Departments')
    cy.get(DataReportPage.getInitialTableListItems()).click()

    // Save report and assert success
    cy.get(DataReportPage.getReportConfigureSaveBtn()).click()
    cy.get(DataImportsFormPage.getImportCreatedSuccessMessage()).should('be.visible').contains('Created Report');
    
  });
});
