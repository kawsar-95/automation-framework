/*
AR - Reports - Generate Report Modal.js

Contains check for story : QAAUT-2525 - GUIA - AE - Generated Reports Modal
Test Coverage detailed here: NASA-T1434
*/

/// <reference types="cypress" />
import { users } from '../../../../../../helpers/TestData/users/users'
import { reports } from '../../../../../../helpers/TestData/reports/reports.js'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arReportsPage from '../../../../../../helpers/AR/pageObjects/ARReportsPage'
import arGenerateReportModal from '../../../../../../helpers/AR/pageObjects/Modals/ARGenerateReportModal'
import arGeneratedReportsPage from '../../../../../../helpers/AR/pageObjects/Setup/ARGeneratedReportsPage.js'
import arCreateNewReportLayoutModal from '../../../../../../helpers/AR/pageObjects/Modals/ARCreateNewReportLayoutModal'


let intTotalGroupRecords; // News: Articles total number
let intTotalGroupRecordsAfterFilter; // News Articles: total number after apply filter
let strGenRepId; // News: Articles total number

describe('AR - Smoke - CDD - Reports', function () {

    beforeEach(function() {
        cy.loginAdmin(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        //cy.get(arDashboardPage.getSysAdminDashboardPageTitle()).should('have.text', arDashboardPage.getSysAdminDashboardPageTitleTxt())
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Groups'))
        cy.get(arReportsPage.getPageHeaderTitle()).should('have.text', "Groups")  
        arReportsPage.getLShortWait()      
                 
    })

    it('Should generate a report to excel without saved layouts', () => {

      //function will save the GUID of the generated report file to @pGUID 
      arGenerateReportModal.generateReportToFile('Excel');

      
      cy.get('@pGUID').then(
          (value) => {
              strGenRepId = value        
          })      
    })

      
 
    it('Should filter for generated report without layout and delete generated report', function() {
      cy.get(arReportsPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Setup'))).click()
      cy.wrap(arDashboardPage.getMenuItemOptionByName('Generated Reports'))
  
      cy.get(arGeneratedReportsPage.getPageHeaderTitle()).should('have.text', "Generated Reports");      
      
      arReportsPage.selectReportGUIDFromGeneratedReportPageAndDelete(strGenRepId);

      cy.wrap(arGeneratedReportsPage.selectTableCellRecord(`${strGenRepId}`)).then((response) => {
        expect(response).to.be.an('undefined');
       });
  
    });  


    it('Should save a new layout for Groups', () => {
         intTotalGroupRecords = Cypress.$(arReportsPage.getReportTotalNumberofRecords()).length;

        cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.length.above', 0);
        cy.wrap(arReportsPage.AddFilter('Behaviour', 'Manual',null))
        arReportsPage.getLShortWait()
        cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportGridMenuReportLayoutsBtn())).click();
        cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getReportLayoutMenuCreateNewBtn())).click();
        cy.get(arReportsPage.getElementByAriaLabelAttribute(arCreateNewReportLayoutModal.ARReportLayoutNewLayoutModalNicknameF())).type(`${reports.ced_rep_name}`);

        cy.get(arCreateNewReportLayoutModal.ARReportLayoutNewLayoutModalSaveBtn()).should('be.visible').click();
        arReportsPage.getMediumWait()   
        cy.get(arCreateNewReportLayoutModal.ARReportLayoutNewLayoutModalSaveBtn()).should('not.exist');    
       // cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getReportGridMenuLayoutName())).contains(`${reports.ced_rep_name}`);

        cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.length.above', 0);
        arReportsPage.getLShortWait()
         
              
            intTotalGroupRecordsAfterFilter = Cypress.$(arReportsPage.getReportTotalNumberofRecords()).length;

                            
            cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.length.above', 0);
            cy.get(arReportsPage.getReportTotalNumberofRecords()).should('not.have.length.above', intTotalGroupRecords);

        //     cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportsGridMenuSelectedLayoutName())).click();
             
        // arReportsPage.getShortWait()
            //cy.get(arReportsPage.getReportLayoutMenuListSelected()).click();

            cy.get(arReportsPage.getReportTotalNumberofRecords()).should('have.length.above', 0);        
            cy.get(arReportsPage.getReportTotalNumberofRecords()).should('not.have.length.above', intTotalGroupRecordsAfterFilter);
           

         
      
    })
   

  it('Should generate a report to CSV with saved layouts', () => {
    
    cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportGridMenuReportLayoutsBtn())).click();
    cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportLayoutMenuResetBtn())).click();
    cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportGridMenuReportLayoutsBtn())).click();
    cy.get(arReportsPage.getElementByAriaLabelAttribute(`${reports.ced_rep_name}`)).click()
    
    arGenerateReportModal.generateReportToFile('CSV');

    cy.get('@pGUID').then(
        (value) => {
            strGenRepId = value        
        })     

  });

  it('Should filter and delete CSV generated report', function() {
    cy.get(arReportsPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Setup'))).click()
    cy.wrap(arDashboardPage.getMenuItemOptionByName('Generated Reports'))

    cy.get(arGeneratedReportsPage.getPageHeaderTitle()).should('have.text', "Generated Reports");

    cy.wrap(arGeneratedReportsPage.AddFilter('Nickname', 'Contains', `${reports.ced_rep_name}`))
    
    cy.get(arGeneratedReportsPage.getTableCellRecord()).filter(`:contains("Csv")`).should('be.visible', true)
    cy.get(arGeneratedReportsPage.getTableCellRecord()).filter(`:contains("${reports.ced_rep_name}")`).should('be.visible', true)    
        
      
    arReportsPage.selectReportGUIDFromGeneratedReportPageAndDelete(strGenRepId);

    cy.wrap(arGeneratedReportsPage.selectTableCellRecord(`${strGenRepId}`)).then((response) => {
      expect(response).to.be.an('undefined');
     });


  });  
  
  it('Should show Generate Report Modal with correct details - and close via Send Email Button', () => {
  
    cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportGridMenuReportLayoutsBtn())).click();
    cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportLayoutMenuResetBtn())).click();
    cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportGridMenuReportLayoutsBtn())).click();
    cy.get(arReportsPage.getElementByAriaLabelAttribute(`${reports.ced_rep_name}`)).click()

    
    //performing generate report file manually here instead of through the function to check status of the buttons

    cy.intercept('POST', '**/generated-reports').as('post')

    cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportGridMenuGenerateReportBtn())).click();
    cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getGenerateReportMenuGenerateBtn())).should('exist');
    cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getGenerateReportMenuFileTypeSelection())).should('exist');
    cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getGenerateReportMenuFileTypeSelection())).click();
    cy.get(arReportsPage.getGenerateReportMenuSelectReportFile).contains('Excel').click();
    cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getGenerateReportMenuGenerateBtn())).click();
    

    cy.get(arGenerateReportModal.getGenerateReportLoadingStatus()).should('have.text', arGenerateReportModal.getGenerateReportModalInProgressTxt());
    cy.get(arGenerateReportModal.getGenerateReportsHeader()).should('have.text', arGenerateReportModal.getGenerateReportModalHeaderTxt());
    cy.get(arGenerateReportModal.getGenerateReportDesc()).should('have.text', arGenerateReportModal.getGenerateReportModalDescTxt());
    cy.get(arGenerateReportModal.getGenerateReportBtn()).contains(arGenerateReportModal.getGenerateReportModalDownloadTxt()).should('exist');    
    cy.get(arGenerateReportModal.getGenerateReportBtn()).contains(arGenerateReportModal.getGenerateReportModalDownloadTxt()).parent().should('have.attr', 'aria-disabled', 'true');
    cy.get(arGenerateReportModal.getGenerateReportBtn()).contains(arGenerateReportModal.getGenerateReportModalEmailTxt()).should('exist');
    cy.get(arGenerateReportModal.getGenerateReportBtn()).contains(arGenerateReportModal.getGenerateReportModalEmailTxt()).parent().should('have.attr', 'aria-disabled', 'false');
    cy.get(arGenerateReportModal.getGenerateReportBtn()).contains(arGenerateReportModal.getGenerateReportModalCloseTxt()).should('exist');
    cy.get(arGenerateReportModal.getGenerateReportBtn()).contains(arGenerateReportModal.getGenerateReportModalCloseTxt()).parent().should('be.enabled', 'true');
        
    cy.get(arGenerateReportModal.getGenerateReportLoadingStatus()).should('have.text', arGenerateReportModal.getGenerateReportModalInProgressTxt());
    arGenerateReportModal.getGenerateReportFileThenClick('Email');

    cy.get('@post').then( xhr => {
      strGenRepId = xhr.request.body.generatedReportId
  })
  
  cy.get(arReportsPage.getToastSuccessMsg(), {timeout: arDashboardPage.getDomainEventsWait()}).should('contain', 'Report Generation Requested')
  cy.get(arReportsPage.getToastCloseBtn()).click()
  arReportsPage.getShortWait()
  cy.get(arReportsPage.getToastSuccessMsg(), {timeout: arDashboardPage.getGeneratedReportsWait()}).should('contain', arGenerateReportModal.getGenerateReportModalSuccessTxt())
  cy.get(arGenerateReportModal.getGenerateReportsHeader()).should('not.exist');
  });



  it('Should filter for generated report when Send Email button is clicked and delete generated report', function() {
    cy.get(arReportsPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Setup'))).click()
    cy.wrap(arDashboardPage.getMenuItemOptionByName('Generated Reports'))

    cy.get(arGeneratedReportsPage.getPageHeaderTitle()).should('have.text', "Generated Reports");

    cy.wrap(arGeneratedReportsPage.AddFilter('Nickname', 'Contains', `${reports.ced_rep_name}`))
    
    cy.get(arGeneratedReportsPage.getTableCellRecord()).filter(`:contains("Excel")`).should('be.visible', true)
    cy.get(arGeneratedReportsPage.getTableCellRecord()).filter(`:contains("${reports.ced_rep_name}")`).should('be.visible', true)    
        
      
    arReportsPage.selectReportGUIDFromGeneratedReportPageAndDelete(strGenRepId);

    cy.wrap(arGeneratedReportsPage.selectTableCellRecord(`${strGenRepId}`)).then((response) => {
      expect(response).to.be.an('undefined');
     });

  });  

  it('Should show Generate Report Modal - and close via Close button', () => {

    cy.intercept('POST', '**/generated-reports').as('post')
    cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportGridMenuReportLayoutsBtn())).click();
    cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportLayoutMenuResetBtn())).click();
    cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportGridMenuReportLayoutsBtn())).click();
    cy.get(arReportsPage.getElementByAriaLabelAttribute(`${reports.ced_rep_name}`)).click()

    cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportGridMenuGenerateReportBtn())).click();
    cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getGenerateReportMenuGenerateBtn())).should('exist');
    cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getGenerateReportMenuFileTypeSelection())).should('exist');
    cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getGenerateReportMenuFileTypeSelection())).click();
    cy.get(arReportsPage.getGenerateReportMenuSelectReportFile).contains('Excel').click();
    cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getGenerateReportMenuGenerateBtn())).click();
    cy.get(arGenerateReportModal.getGenerateReportLoadingStatus()).should('have.text', arGenerateReportModal.getGenerateReportModalInProgressTxt());
    
    arGenerateReportModal.getGenerateReportFileThenClick('Close');
    
    cy.get('@post', { timeout: arDashboardPage.getDomainEventsWait() }).then( xhr => {
      strGenRepId = xhr.request.body.generatedReportId
  })
  
  cy.get(arReportsPage.getToastSuccessMsg(), {timeout: arDashboardPage.getDomainEventsWait()}).should('contain', 'Report Generation Requested')
  cy.get(arReportsPage.getToastCloseBtn()).click()
  arReportsPage.getShortWait()
  cy.get(arReportsPage.getToastSuccessMsg(), {timeout: arDashboardPage.getGeneratedReportsWait()}).should('contain', arGenerateReportModal.getGenerateReportModalSuccessTxt())
    cy.get(arGenerateReportModal.getGenerateReportsHeader()).should('not.exist');

  });

  
  it('Should filter for generated report when close button is clicked and delete generated report', function() {
    cy.get(arReportsPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Setup'))).click()
    cy.wrap(arDashboardPage.getMenuItemOptionByName('Generated Reports'))

    cy.get(arGeneratedReportsPage.getPageHeaderTitle()).should('have.text', "Generated Reports");

    cy.wrap(arGeneratedReportsPage.AddFilter('Nickname', 'Contains', `${reports.ced_rep_name}`))
    
    cy.get(arGeneratedReportsPage.getTableCellRecord()).filter(`:contains("Excel")`).should('be.visible', true)
    cy.get(arGeneratedReportsPage.getTableCellRecord()).filter(`:contains("${reports.ced_rep_name}")`).should('be.visible', true)    
        
      
    arReportsPage.selectReportGUIDFromGeneratedReportPageAndDelete(strGenRepId);

    cy.wrap(arGeneratedReportsPage.selectTableCellRecord(`${strGenRepId}`)).then((response) => {
      expect(response).to.be.an('undefined');
     });
    
  });  

  it('Delete Saved Layout', () => {
    cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportGridMenuReportLayoutsBtn())).click();
    cy.get(arReportsPage.getElementByAriaLabelAttribute(`${reports.ced_rep_name}`)).click()
    cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportsGridMenuSelectedLayoutName())).click();

    cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportLayoutMenuDeleteLayoutBtn())).click()

    cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportGridMenuReportLayoutsBtn())).should('be.visible');
    cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportGridMenuReportLayoutsBtn())).click();

    cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getReportLayoutMenuCreateNewBtn())).should('be.visible');
    cy.get(arReportsPage.getElementByAriaLabelAttribute(`${reports.ced_rep_name}`)).should('not.exist');
    
  });

})

