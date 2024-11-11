/*
AR - Smoke - Hybrid - CDD - Reports.js
QAAUT-2525
Covers: 
QAT-T80 (Step 5 - create, remove, reapply and delete a Saved Layout)
QAT-T80 (Step 6 - Filter a Report and Download)
*/

/// <reference types="cypress" />
import { users } from '../../../../../../helpers/TestData/users/users'
import { reports } from '../../../../../../helpers/TestData/reports/reports.js'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import basePage from '../../../../../../helpers/BasePage'
import arReportsPage from '../../../../../../helpers/AR/pageObjects/ARReportsPage'
import arGeneratedReportsPage from '../../../../../../helpers/AR/pageObjects/Setup/ARGeneratedReportsPage.js'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'

let intTotalNewsArticles; // News: Articles total number
let intTotalNewsArticlesAfterFilter; // News Articles: total number after apply filter


describe('AR - Smoke - Hybrid - CDD - Reports', function () {

    beforeEach(function() {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password,'/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Engage'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('News Articles'))
        cy.intercept('**/Admin/NewsArticle/GetNewsArticle').as('GetNewsArticle').wait('@GetNewsArticle');
        cy.get(arReportsPage.getA5PageHeaderTitle()).should('have.text', "News Articles")
                 
    })

    it('Should show correct records when a filter is used', () => {        
        intTotalNewsArticles = Cypress.$(arReportsPage.getReportTotalNumberofRecords()).length;

        cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.length.above', 0);
        cy.wrap(arReportsPage.A5AddFilter('Is Published', 'Yes')).wait('@GetNewsArticle')
          .then(() => {
              
            intTotalNewsArticlesAfterFilter = Cypress.$(arReportsPage.getReportTotalNumberofRecords()).length;

            cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.length.above', 0);
            cy.get(arReportsPage.getReportTotalNumberofRecords()).should('not.have.lengthOf', intTotalNewsArticles);
  
          })      
    })

    it('Should save a new layout for news article', () => {
         intTotalNewsArticles = Cypress.$(arReportsPage.getReportTotalNumberofRecords()).length;
           
        cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.length.above', 0);
        cy.wrap(arReportsPage.A5AddFilter('Is Published', 'Yes', null)).wait('@GetNewsArticle');
        cy.get(arReportsPage.getA5ReportGridMenuSavedLayoutsBtn()).click();
        cy.get(arReportsPage.getA5SavedLayoutsMenuCreateNewBtn()).click();
        cy.get(arReportsPage.A5SavedLayoutCreateModalNickNameF()).type(`${reports.ced_rep_name}`);
        cy.get(arReportsPage.A5SavedLayoutCreateModalCreateNewBtn()).click();        
        cy.get(arReportsPage.getA5ReportGridMenuSavedLayoutNickName()).should('have.text', `${reports.ced_rep_name}`);

        cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.length.above', 0);
        cy.wrap(arReportsPage.A5AddFilter('Is Published', 'Yes', null)).wait('@GetNewsArticle')
          .then(() => {
              
          intTotalNewsArticlesAfterFilter = Cypress.$(arReportsPage.getReportTotalNumberofRecords()).length;

                          
        cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.length.above', 0);
        cy.get(arReportsPage.getReportTotalNumberofRecords()).should('not.have.lengthOf', intTotalNewsArticles);

        cy.get(arReportsPage.getA5ReportGridMenuSavedLayoutsBtn()).click();
        cy.get(arReportsPage.getA5SavedLayoutMenuListSelected()).click();

        cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.length.above', 0);        
        cy.get(arReportsPage.getReportTotalNumberofRecords()).should('not.have.lengthOf', intTotalNewsArticlesAfterFilter);
        cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.length', intTotalNewsArticles);

        })      
    })
    
  it('Re-apply Saved layout after resetting', () => {
    intTotalNewsArticles = Cypress.$(arReportsPage.getReportTotalNumberofRecords()).length;    
    cy.wrap(arReportsPage.A5AddFilter('Is Published', 'Yes', null)).wait('@GetNewsArticle')
      .then(() => {
        
    intTotalNewsArticlesAfterFilter = Cypress.$(arReportsPage.getReportTotalNumberofRecords()).length;

    cy.get(arReportsPage.getA5ReportGridMenuSavedLayoutsBtn()).click();
    cy.get(arReportsPage.getA5SavedLayoutsMenuResetLayoutBtn()).click().wait('@GetNewsArticle');
    cy.get(arReportsPage.getA5ReportGridMenuSavedLayoutsBtn()).click();
    cy.get(arReportsPage.getA5SavedLayoutMenuNickName()).contains(`${reports.ced_rep_name}`).click().wait('@GetNewsArticle');

    cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.length.above', 0);        
    cy.get(arReportsPage.getReportTotalNumberofRecords()).should('not.have.lengthOf', intTotalNewsArticles);
    cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.length', intTotalNewsArticlesAfterFilter);

    })
  });

  
  it('Start Generating Report', () => {
    
    cy.get(arReportsPage.getA5ReportGridMenuSavedLayoutsBtn()).click();
    cy.get(arReportsPage.getA5SavedLayoutsMenuResetLayoutBtn()).click().wait('@GetNewsArticle');
    cy.get(arReportsPage.getA5ReportGridMenuSavedLayoutsBtn()).click();
    cy.get(arReportsPage.getA5SavedLayoutMenuNickName()).contains(`${reports.ced_rep_name}`).click().wait('@GetNewsArticle');


    cy.get(arReportsPage.getA5ReportGridMenuGenerateReportFileBtn()).click();
    cy.get(arReportsPage.getA5GenerateReportMenuGenerateBtn()).should('exist'); 
    cy.get(arReportsPage.getA5GenerateReportMenuSelectReportFile()).should('exist');
    cy.get(arReportsPage.getA5GenerateReportMenuSelectReportFile()).select('Excel');
    cy.get(arReportsPage.getA5GenerateReportMenuGenerateBtn()).click();      
    cy.get(arReportsPage.A5GenerateReporProgressModalStatus(), { timeout: arDashboardPage.getDomainEventsWait() }).should('have.text', 'Complete');
    
  });

  
  it('Delete Saved Layout', () => {
    cy.get(arReportsPage.getA5ReportGridMenuSavedLayoutsBtn()).click();
    arDashboardPage.getShortWait();
    cy.get(arReportsPage.getA5SavedLayoutsMenuResetLayoutBtn()).should('be.visible');   
    cy.get(arReportsPage.getA5SavedLayoutMenuNickName()).contains(`${reports.ced_rep_name}`).click();
    cy.get(arReportsPage.getA5ReportGridMenuSavedLayoutsBtn()).click();
    cy.get(arReportsPage.getA5SavedLayoutMenuDeleteBtn()).click().wait('@GetNewsArticle');   
    cy.get(arReportsPage.getA5ReportGridMenuSavedLayoutsBtn()).should('be.visible');
    cy.get(arReportsPage.getA5ReportGridMenuSavedLayoutsBtn()).click();
    cy.get(arReportsPage.getA5SavedLayoutsMenuCreateNewBtn()).should('be.visible');
    cy.get(arReportsPage.getA5SavedLayoutMenuNickName()).contains(`${reports.ced_rep_name}`).should('not.exist');
    
  });

  it('Filter for and delete generated report', function() {
    cy.visit("/admin")
    cy.get(arReportsPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Setup'))).click()
    cy.wrap(arDashboardPage.getMenuItemOptionByName('Generated Reports'))

    cy.get(arGeneratedReportsPage.getPageHeaderTitle()).should('have.text', "Generated Reports");

    cy.wrap(arGeneratedReportsPage.AddFilter('Nickname', 'Contains', `${reports.ced_rep_name}`))
    //Delete both reports if created twice (happens when first test fails and retries)
    cy.get(arGeneratedReportsPage.getTableCellName(2)).contains(reports.ced_rep_name).click({mulitiple:true})
    cy.wrap(arGeneratedReportsPage.WaitForElementStateToChange(arGeneratedReportsPage.getAddEditMenuActionsByName('Delete Generated Report'), 1000))
        cy.get(arGeneratedReportsPage.getGeneratedReportsDeleteGenReportBtn()).click()
        cy.get(arGeneratedReportsPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click()
        cy.wrap(arGeneratedReportsPage.selectTableCellRecord(`${reports.ced_rep_name}`)).then((response) => {
                expect(response).to.be.an('undefined');
        });

  });
    
})

