/*
AR - Smoke - CDD - Reports.js
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
import arGenerateReportModal from '../../../../../../helpers/AR/pageObjects/Modals/ARGenerateReportModal'
import arGeneratedReportsPage from '../../../../../../helpers/AR/pageObjects/Setup/ARGeneratedReportsPage.js'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arCreateNewReportLayoutModal from '../../../../../../helpers/AR/pageObjects/Modals/ARCreateNewReportLayoutModal'


let intTotalGroupRecords; // News: Articles total number
let intTotalGroupRecordsAfterFilter; // News Articles: total number after apply filter

describe('AR - Smoke - CDD - Reports', function () {

    beforeEach(function() {
        cy.loginAdmin(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        arDashboardPage.getUserGroupReport()
        cy.get(arReportsPage.getPageHeaderTitle()).should('have.text', "Groups")        
                 
    })

    it('Should show correct records when a filter is used', () => {        
        intTotalGroupRecords = Cypress.$(arReportsPage.getReportTotalNumberofRecords()).length;

        cy.addContext(`Total Group Records: ${intTotalGroupRecords}`);
        cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.length.above', 0);
        cy.wrap(arReportsPage.AddFilter('Behaviour', 'Manual', null))
          .then(() => {
              
            intTotalGroupRecordsAfterFilter = Cypress.$(arReportsPage.getReportTotalNumberofRecords()).length;

            cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.length.above', 0);
           cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.lengthOf', intTotalGroupRecords);
  
          })
        
    })

    it('Should save a new layout for Groups', () => {
         intTotalGroupRecords = Cypress.$(arReportsPage.getReportTotalNumberofRecords()).length;

        cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.length.above', 0);
        cy.wrap(arReportsPage.AddFilter('Behaviour', 'Manual', null))
        cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportGridMenuReportLayoutsBtn())).click();
        cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getReportLayoutMenuCreateNewBtn())).click();
        cy.get(arReportsPage.getElementByAriaLabelAttribute(arCreateNewReportLayoutModal.ARReportLayoutNewLayoutModalNicknameF())).type(`${reports.ced_rep_name}`);
        arDashboardPage.getShortWait();

        cy.get(arCreateNewReportLayoutModal.ARReportLayoutNewLayoutModalSaveBtn()).should('not.be.disabled').click();    
        cy.get(arCreateNewReportLayoutModal.ARReportLayoutNewLayoutModalSaveBtn()).should('not.exist');    
        cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getReportGridMenuLayoutName())).contains(`${reports.ced_rep_name}`);

        cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.length.above', 0);
        cy.wrap(arReportsPage.AddFilter('Behaviour', 'Manual', null))
          .then(() => {
              
            intTotalGroupRecordsAfterFilter = Cypress.$(arReportsPage.getReportTotalNumberofRecords()).length;

                            
        cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.length.above', 0);
        cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.lengthOf', intTotalGroupRecords);
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist',{timeout:5000})
        cy.wait(5000)
        cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportsGridMenuSelectedLayoutName())).click();
        cy.get(arReportsPage.getReportLayoutMenuListSelected()).click();

        cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.length.above', 0);        
        cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.lengthOf', intTotalGroupRecordsAfterFilter);
        cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.lengthOf', intTotalGroupRecordsAfterFilter);
        cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.length', intTotalGroupRecords);

          })
      
    })
   
  it('Re-apply Saved layout after resetting', () => {
    intTotalGroupRecords = Cypress.$(arReportsPage.getReportTotalNumberofRecords()).length;

    cy.wrap(arReportsPage.AddFilter('Behaviour', 'Manual', null))
    .then(() => {
        
      intTotalGroupRecordsAfterFilter = Cypress.$(arReportsPage.getReportTotalNumberofRecords()).length;

      cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportGridMenuReportLayoutsBtn())).click();

     cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportLayoutMenuResetBtn())).click().wait(1000);
      cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportGridMenuReportLayoutsBtn())).click();
      cy.get(arReportsPage.getElementByAriaLabelAttribute(`${reports.ced_rep_name}`)).click().wait(1000);
  
  
      cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.length.above', 0);        
      cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.lengthOf', intTotalGroupRecords);
      cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.length', intTotalGroupRecordsAfterFilter);
  
    })

  });

  it('Start Generating Report', () => {
    
    cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportGridMenuReportLayoutsBtn())).click();
    cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportLayoutMenuResetBtn())).click();
    cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportGridMenuReportLayoutsBtn())).click();
    cy.get(arReportsPage.getElementByAriaLabelAttribute(`${reports.ced_rep_name}`)).click().wait(1000);
    cy.wait(3000)
    cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportGridMenuGenerateReportBtn())).click();
    cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getGenerateReportMenuGenerateBtn())).should('exist');
    cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getGenerateReportMenuFileTypeSelection())).should('exist');
    cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getGenerateReportMenuFileTypeSelection())).click();
    cy.get(arReportsPage.getGenerateReportMenuSelectReportFile).contains('Excel').click();
    cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getGenerateReportMenuGenerateBtn())).click();
    
    cy.get(arGenerateReportModal.getGenerateReportStatus(), { timeout: arDashboardPage.getDomainEventsWait() }).should('have.text', arGenerateReportModal.getGenerateReportModalSuccessTxt());
  });

  
  it('Delete Saved Layout', () => {
    cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportGridMenuReportLayoutsBtn())).click();
    cy.get(arReportsPage.getElementByAriaLabelAttribute(`${reports.ced_rep_name}`)).click().wait(1000);
    cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportsGridMenuSelectedLayoutName())).click();

    cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportLayoutMenuDeleteLayoutBtn())).click().wait(1000);

    cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportGridMenuReportLayoutsBtn())).should('be.visible');
    cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportGridMenuReportLayoutsBtn())).click();

    cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getReportLayoutMenuCreateNewBtn())).should('be.visible');
    cy.get(arReportsPage.getElementByAriaLabelAttribute(`${reports.ced_rep_name}`)).should('not.exist');
    
  });

  it('Filter for and delete generated report', function() {
    cy.visit("/admin")
    cy.get(arReportsPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Setup'))).click()
    cy.wrap(arDashboardPage.getMenuItemOptionByName('Generated Reports'))
    cy.get(arDashboardPage.getWaitSpinner()).should('not.exist',{timeout:5000})
    cy.get(arGeneratedReportsPage.getPageHeaderTitle()).should('have.text', "Generated Reports");
    cy.wrap(arGeneratedReportsPage.AddFilter('Nickname', 'Contains', `${reports.ced_rep_name}`))
    cy.get(arGeneratedReportsPage.getTableCellName(2)).contains(reports.ced_rep_name).click()
    cy.wrap(arGeneratedReportsPage.WaitForElementStateToChange(arGeneratedReportsPage.getAddEditMenuActionsByName('Delete Generated Report'), 1000))
    cy.get(arGeneratedReportsPage.getGeneratedReportsDeleteGenReportBtn()).click()
    cy.get(arGeneratedReportsPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click().wait(1000)
    cy.get(arDashboardPage.getNoResultMsg()).should('have.text', "No results found.")

  });  
})

