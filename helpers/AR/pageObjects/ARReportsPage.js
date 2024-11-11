import arBasePage from "../ARBasePage";
import arDeleteModal from '../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arGeneratedReportsPage from '../../../helpers/AR/pageObjects/Setup/ARGeneratedReportsPage.js'

export default new class ARReportsPage extends arBasePage {

  selectReportGUIDFromGeneratedReportPageAndDelete(guid){ 
   // cy.intercept('**/generated-reports').as('getGeneratedReports');
    cy.wrap(arGeneratedReportsPage.AddFilter('Id', null, guid)) 
    arGeneratedReportsPage.getLShortWait()

    cy.get(this.getReportColumnHeader()).then($GUIDColumn => {
      if ($GUIDColumn.find('span:contains("Id")').length == 0){
        this.selectReportColumnThenClick('Id');
      }
    })

    cy.wrap(arGeneratedReportsPage.selectTableCellRecord(`${guid}`));
    this.getShortWait();
    cy.get(arGeneratedReportsPage.getGeneratedReportsDeleteGenReportBtn()).click();
    cy.get(arGeneratedReportsPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click()
  }

  // remove or add column to report grid
  selectReportColumnThenClick(columnName){    
    cy.get(this.getReportColumnSelect()).click();
    cy.get(this.getReportColumnSelectOption()).contains(`${columnName}`).should('be.visible', true).click();
    cy.get(this.getReportColumnSelect()).click();
  }


  getReportTotalNumberofRecords(){ 
    return 'tbody > tr';
  }


  // Report Grid

  getReportGridMenuReportLayoutsBtn(){ 
    return 'Report Layouts' //aria-label
  }

  getReportGridMenuGenerateReportBtn(){
    return 'Generate Report File' //aria-label
  }

  getReportGridMenuLayoutName(){ 
    return 'layout-name' //data-name
  }

  getReportsGridMenuSelectedLayoutName(){ 
    return 'Selected Report Layout' //aria-label
  }


  // Report Grid - Report Layout Menu

  getReportLayoutMenuCreateNewBtn() {   
    return 'create-full'; //data-name
  }
  getReportLayoutNickname(){
    return '[aria-label="Nickname"]'
  }
  getSetAsFavoriteBtn(){
    return '[aria-label="Set as favorite"]'
  }
  getFavoriteReportLayout(){
    return '[aria-label="Favorite Report Layout"]'
  }

  getReportLayoutSaveBtn(){
    return '[data-name="save"]';
  }

  getReportLayoutMenuListSelected() { 
    return 'div[data-name="saved-layout-list"] div[aria-selected="true"]';
 }  



  getReportLayoutMenuResetBtn(){ 
    return 'Reset Layout'; //aria-label
  }

  getReportLayoutMenuDeleteLayoutBtn() { 
    return 'Delete Layout'
  }

  // Report Grid - Generate Report File Menu

  getGenerateReportMenuFileTypeSelection() { 
    return 'selection'; //data-name
  }

  getReportPageTimezone() { 
    return "time-format-message"; //data-name
  }

  getGenerateReportMenuSelectReportFile() { //To use, use contains on cy.get. Available Values: Choose, Excel, CSV 
    return '[class*="_option_1mq8e_10"]';
  }
      
  getGenerateReportMenuGenerateBtn(){  
    return 'generate-report-button' //data-name
  }


  // Report Grid - Columns

  getReportColumnSelect(){
    return 'div[class*="grid-table-module__column_select_header"]'
  }

  getReportColumnSelectOption(){
    return `${this.getReportColumnSelect()} label[class*="managed-checkbox-module__checkbox"]`
  }

  getReportColumnHeader(){
    return `th[role="columnheader"]`
  }

 // Start Report A5 Elements - to be deleted once all Hybrid Pages are converted to AR

 // A5 Report Grid

  // AR: getReportGridMenuReportLayoutsBtn  
   getA5ReportGridMenuSavedLayoutsBtn() {
    return 'span[class="icon icon-reports"]';
  }

  //AR: getReportGridMenuGenerateReportBtn
   getA5GenerateReportMenuGenerateBtn() {
      return 'div[class="grid-settings-drop-down report-picker"] span[data-bind="text: absorb.data.terms.Generate"]';
  }

  //AR: getReportGridMenuLayoutName 
  getA5ReportGridMenuSavedLayoutNickName() {
    return 'div[class="selected-title overflow"]';
  }

  //AR: getReportsGridMenuSelectedLayoutName
  getA5SavedLayoutMenuNickName(){
    return 'div.list > div > a.item > span.name > span[data-bind="text: Name"]'
  }


 // A5 Report Grid - Report Layout Menu


  // AR: getReportLayoutMenuCreateNewBtn
  getA5SavedLayoutsMenuCreateNewBtn() {
    return 'span[data-bind="text: absorb.data.terms.CreateNew"]';
  }

  //AR: getReportLayoutMenuListSelected
  getA5SavedLayoutMenuListSelected() {
    return 'div.list > div.selection.wider.selected > a.item';
  }
  
  //AR: getReportLayoutMenuResetBtn
  getA5SavedLayoutsMenuResetLayoutBtn() {
    return 'span[class="icon icon-reset"]';
  }

  //getReportLayoutMenuDeleteLayoutBtn
  getA5SavedLayoutMenuDeleteBtn() {
      return 'div.layout-options > a.btn.circle.delete'
  }
  

  // A5 Report Grid - Generate Report File Menu

  //AR: getGenerateReportMenuFileTypeSelection getGenerateReportMenuSelectReportFile
  getA5GenerateReportMenuSelectReportFile() {
    return 'div[class="grid-settings-drop-down report-picker"] select[id="report-selection"]';
  }

  //AR: getGenerateReportMenuGenerateBtn
  getA5ReportGridMenuGenerateReportFileBtn() {
      return 'span[class="icon icon-paper-arrow-up"]';
  }



  A5GenerateReporProgressModalStatus() {
    return 'div[id="report-generation-modal-content"]  div[class="dialog-progress-message"]';
  }

  A5GenerateReportProgressModalDownload(){
    return 'div[id="report-generation-modal-content"]  a[title="Download"]';
  }

  A5GenerateReportProgressModalTitle(){
    return 'div[id="report-generation-modal-content"]  label[data-bind="text: absorb.data.terms.GenerateReportFile"]';
  }


  // A5 ARCreateNewReportLayoutModal

  //AR: ARReportLayoutNewLayoutModalSaveBtn
  A5SavedLayoutCreateModalCreateNewBtn() {  
    return 'a[data-bind="click: SubmitModal"] > span[data-bind="text: absorb.data.terms.CreateNew"]';
  }

  //AR: ARReportLayoutNewLayoutModalNicknameF
  A5SavedLayoutCreateModalNickNameF() {
    return 'form[data-bind="submit: SubmitModal"] > div input[name="name"]'
  }


  // End Report A5 Elements - to be deleted once all Hybrid Pages are converted to AR

};