import arBasePage from "../../ARBasePage"
import arReportsPage from '../../../../helpers/AR/pageObjects/ARReportsPage'

export default new class ARGenerateReportModal extends arBasePage{
    
    GenerateReportPromptContainer = '[class*="Toastify__toast-body"]';

    getGenerateReportFileThenClick(type) {
        if (type=='File')
            return cy.get(this.GenerateReportPromptContainer).contains(this.getGenerateReportModalDownloadTxt()).click();
        else if (type=='Email')
            return cy.get(this.GenerateReportPromptContainer).contains(this.getGenerateReportModalEmailTxt()).click();
        else if (type=='Close')
            return cy.get(this.GenerateReportPromptContainer).contains(this.getGenerateReportModalCloseTxt()).click();
    }

    //Possible parameter values: Excel or CSV
    generateReportToFile(fileType) {
        let GUID;

        cy.intercept('POST', '**/generated-reports').as('post')
        cy.get(arReportsPage.getElementByAriaLabelAttribute(arReportsPage.getReportGridMenuGenerateReportBtn())).click();
        cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getGenerateReportMenuGenerateBtn())).should('exist');
        cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getGenerateReportMenuFileTypeSelection())).should('exist');
        cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getGenerateReportMenuFileTypeSelection())).click();
        cy.get(arReportsPage.getGenerateReportMenuSelectReportFile).contains(fileType).click();
        cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getGenerateReportMenuGenerateBtn())).click(); 
        arReportsPage.getMediumWait()    
        cy.get(this.getReportPromptContainer()).should('have.text', this.getGenerateReportModalSuccessTxt())
        cy.get('@post').then( xhr => {
          GUID =  xhr.request.body.generatedReportId
          cy.wrap(GUID).as('pGUID');
      })
    }

    getReportPromptContainer(){
        return '[class*="Toastify__toast-body"]'
    }

    getGenerateReportsHeader(){
        return `${this.GenerateReportPromptContainer} h1[data-name="prompt-header"]`
    }

    getGenerateReportStatus() {
        return `${this.GenerateReportPromptContainer}`
    }
    
    getGenerateReportLoadingStatus() {
        return `${this.GenerateReportPromptContainer} div[data-name="loading-message"] span`
    }

    getGenerateReportDesc() {
        return `${this.GenerateReportPromptContainer} span[id="generate-report-message"]`
    }

    getGenerateReportBtn() {
        return `${this.GenerateReportPromptContainer} div[class*="prompt-footer-module__child"] button`
    }

    getGenerateReportModalHeaderTxt(){
        return 'Generate Report'
    }    

    getGenerateReportModalInProgressTxt(){
        return 'Report Generation In Progress. This may take a while.'
    }

    getGenerateReportModalSuccessTxt(){
        return 'Report Generation Successful'
    }

    getGenerateReportModalDescTxt(){
        return 'Download the report when complete or have it emailed to you when finished.'
    }

    getGenerateReportModalDownloadTxt(){
        return 'Download Report'
    }

    getGenerateReportModalEmailTxt(){
        return 'Email Upon Completion'
    }

    getGenerateReportModalCloseTxt(){
        return 'Close'
    }
};
