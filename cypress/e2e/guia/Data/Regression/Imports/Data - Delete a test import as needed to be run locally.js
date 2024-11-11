import DataDashboards from "../../../../../../helpers/Data/PageObjects/Dashboards/DataDashboards";
import DataImportsMenu from "../../../../../../helpers/Data/PageObjects/DataMenu/DataImportsMenu";
import DataLeftSideMenu from "../../../../../../helpers/Data/PageObjects/DataMenu/DataLeftSideMenu";
import DataImportsFormPage from "../../../../../../helpers/Data/PageObjects/Imports/DataImportsFormPage";


describe('run detele import test locally when needed', () => {
    // remove ".skip" when there's need to run the test and remember to change the import name accordingly as note below
    it.skip('run detele import test locally when needed', () => {
    // visit QA DMS 
    cy.visit('/')
    cy.get(DataDashboards.getUserProfile()).should('be.visible')

    // Click on Integration side menu and Click on Import submenu
    DataLeftSideMenu.getLeftMenuBtnThenClick('Integrations')
    DataLeftSideMenu.getSubMenuThenClick('Imports')

    // selecting name filters
    cy.get(DataImportsMenu.getImportReportFilters('Name')).click()
    cy.get(DataImportsMenu.getSelectOperatorValue()).should('be.visible')
    cy.get(DataImportsMenu.getSelectOperatorValue()).select('Contains')
    // Change the name at -> type () to a desired import name that needs deleted
    cy.get(DataImportsMenu.getFilterTextF()).type('enter import name')
    cy.get(DataImportsMenu.getFilterAddBtn()).contains('Add Filter').click()
    DataDashboards.getShortWait()
    // select client filter
    cy.get(DataImportsMenu.getImportReportFilters('Client')).click()
    cy.get(DataImportsMenu.getFilterTextF2()).should('be.visible').click()
    
    cy.get(DataImportsMenu.getFilterSearchField()).type('Sunny{enter}')
    cy.get('li > option').contains('Sunny').click()
    cy.get(DataImportsMenu.getFilterAddBtn()).contains('Add Filter').click()

    // select filtered result 
    // Change the name at -> and('contain','enter import name') to a desired import name that needs deleted
    DataDashboards.getShortWait()
    cy.get(DataImportsMenu.getImportFilterResults()).should('be.visible').and('contain','enter import name')
    cy.get(DataImportsMenu.getImportFilterResults()).contains('Sunny').click()
    cy.get(DataImportsMenu.getDeleteBtn()).click()

    // confirm modal
    cy.get(DataImportsFormPage.getRunNowModal()).should('contain', 'Confirm')
    cy.get(DataImportsFormPage.getRunNowModalConfirmBtn()).click()
    cy.get(DataImportsFormPage.getImportCreatedSuccessMessage()).should('be.visible').contains('Deleted Import')

});
});