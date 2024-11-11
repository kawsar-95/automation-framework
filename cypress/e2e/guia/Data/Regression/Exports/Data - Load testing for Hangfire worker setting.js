import DataDashboards from "../../../../../../helpers/Data/PageObjects/Dashboards/DataDashboards";
import DataImportsMenu from "../../../../../../helpers/Data/PageObjects/DataMenu/DataImportsMenu";
import DataLeftSideMenu from "../../../../../../helpers/Data/PageObjects/DataMenu/DataLeftSideMenu";
import DataImportsFormPage from "../../../../../../helpers/Data/PageObjects/Imports/DataImportsFormPage";
import { generalTestData } from "../../../../../../helpers/TestData/DataTeam/generalTestData";

describe('Load testing with big report - import "n" scheduled jobs', () => {
    
    // this test is to help load testing when needed, import a preconfigured job with schedule import
    // so we can watch our the DMS Hangfire performs. For DATA-2777 story, we set HF worker to 20 in QA
    // this will help us to check that only 20 jobs should be processed at same time and 5 to be waited in queue
    // you can change 25 to any number for this type of testing purpose.

    Cypress._.times(25, (n)=>{
    it.skip(`should import configured jobs 25 times ${n+1} / 25`, () => {
    // Visit the authenticated page and assert that the user is logged in
    cy.visit('/')
    cy.get(DataDashboards.getUserProfile()).should('be.visible')

    // Click on Integration side menu and Click on Exports submenu
    DataLeftSideMenu.getLeftMenuBtnThenClick('Integrations')
    DataLeftSideMenu.getSubMenuThenClick('Exports')

    // Import pre-built Export configuration json
    // the loadTestReport file is a preconfigure json that will generate report joining tables of users, course enrollments and activity in the last month
    // it has scheduled to run daily 
    // this should give us decent amount of data to process and observe HF job
    // ** note: after the test we should clean them out from the db and turn off the future schedule in HF GUI 
    DataImportsMenu.getImportsRightSideMenuThenClick('Import')
    cy.get(DataImportsMenu.getUploadField()).attachFile(generalTestData.uploadExportFilePath + generalTestData.loadTestReport)
    cy.get(DataImportsMenu.getSubmitBtn()).click()
    cy.get(DataImportsFormPage.getImportCreatedSuccessMessage(),{timeout:10000}).should('be.visible').contains('Imported Report')

});
})
});