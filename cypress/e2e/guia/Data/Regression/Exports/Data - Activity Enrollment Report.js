import DataDashboards from "../../../../../../helpers/Data/PageObjects/Dashboards/DataDashboards";
import DataImportsMenu from "../../../../../../helpers/Data/PageObjects/DataMenu/DataImportsMenu";
import DataLeftSideMenu from "../../../../../../helpers/Data/PageObjects/DataMenu/DataLeftSideMenu";
import DataReportPage from "../../../../../../helpers/Data/PageObjects/Exports/DataReportPage";
import DataImportsFormPage from "../../../../../../helpers/Data/PageObjects/Imports/DataImportsFormPage";
import { generalTestData } from "../../../../../../helpers/TestData/DataTeam/generalTestData";

describe('Activity Enrollment Export - import preconfig, run the job and view data', () => {
  it('should able to import report config, run job and view data', () => {
    // Visit the authenticated page and assert that the user is logged in
    cy.visit('/')
    cy.get(DataDashboards.getUserProfile()).should('be.visible')

    // Click on Integration side menu and Click on Exports submenu
    DataLeftSideMenu.getLeftMenuBtnThenClick('Integrations')
    DataLeftSideMenu.getSubMenuThenClick('Exports')

    // Import pre-built Export configuration json
    DataImportsMenu.getImportsRightSideMenuThenClick('Import')
    cy.get(DataImportsMenu.getUploadField()).attachFile(generalTestData.uploadExportFilePath + generalTestData.activityEnrollmentFile)
    cy.get(DataImportsMenu.getSubmitBtn()).click()
    cy.get(DataImportsFormPage.getImportCreatedSuccessMessage(),{timeout:10000}).should('be.visible').contains('Imported Report')

    // Run and View Report
    DataImportsMenu.getImportsRightSideMenuThenClick('Run Now')
    cy.get(DataImportsFormPage.getRunNowModal()).should('contain', 'Confirm')
    cy.get(DataImportsFormPage.getRunNowModalConfirmBtn()).click()
    cy.get(DataImportsFormPage.getRunPreviewBtn()).should('be.visible')
    DataImportsMenu.getImportsRightSideMenuThenClick('View Data')
    cy.get(DataReportPage.getReportDataColumnTitle()).should('be.visible').contains('Activity')

  });
});
