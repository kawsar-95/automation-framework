import DataDashboards from "../../../../../../helpers/Data/PageObjects/Dashboards/DataDashboards";
import DataImportsMenu from "../../../../../../helpers/Data/PageObjects/DataMenu/DataImportsMenu";
import DataLeftSideMenu from "../../../../../../helpers/Data/PageObjects/DataMenu/DataLeftSideMenu";
import { generalTestData } from "../../../../../../helpers/TestData/DataTeam/generalTestData";
import DataImportsFormPage from "../../../../../../helpers/Data/PageObjects/Imports/DataImportsFormPage";


describe('Import a Course Enrollment Integration', () => {
  it('should automatically log in and able to Import Enrollment JSON file', () => {
    // Visit the authenticated page and assert that the user is logged in
    cy.visit('/')
    cy.get(DataDashboards.getUserProfile()).should('be.visible')

    // Click on Integration side menu and Click on Import submenu
    DataLeftSideMenu.getLeftMenuBtnThenClick('Integrations')
    DataLeftSideMenu.getSubMenuThenClick('Imports')

    // Click on Import button at Imports page and Import modal appears
    DataImportsMenu.getImportsRightSideMenuThenClick('Import')
    cy.get(DataImportsMenu.getImportIntegrationModal()).should('be.visible')
    
    // uploading enrollment file
    cy.get(DataImportsMenu.getUploadField()).attachFile(generalTestData.uploadImportFilePath + generalTestData.uploadCourseEnrollmentFile)
    cy.get(DataImportsMenu.getSubmitBtn()).click()
    DataImportsMenu.getShortWait()
    cy.get(DataImportsFormPage.getImportCreatedSuccessMessage()).should('be.visible').contains('Imported Import')

  });
});
