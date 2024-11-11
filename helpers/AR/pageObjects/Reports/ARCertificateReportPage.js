import arBasePage from "../../ARBasePage";


export default new class ARLearnerCompetenciesReportPage extends arBasePage {

   getSidebarContent() {
      return '[class*="sidebar-content"]'
   }

   getRightActionMenuLabel() {
      cy.get(this.getSidebarContent()).children().should(($child) => {
         expect($child).to.contain('Edit');
         expect($child).to.contain('Delete');
         expect($child).to.contain('Download');
         expect($child).to.contain('Deselect');
      })
   }
   getDatePicker() {
      return 'div[class*="input-group date datepicker katana-date-picker"]'
   }
   getTimePicker() {
      return 'div[class*="input-group time timepicker katana-time-picker"]'
   }
   getMonthNextBtn() {
      return 'th.next'
   }
   getDayBtn() {
      return 'td.day'
   }
   getHistoryCloseBtn() {
      return '[class="footer"]>[class="btn icon cancel"]'
   }

   getLayoutMenuItems(){
      return '[data-bind="term: Title"]'
   }

   //this method verify layout items' name and index at the same time
   getVerifyLayoutMenuItemByNameAndIndex(index,name){
      cy.get(this.getLayoutMenuItems()).eq(index).should('contain',name)
   }

   getRightActionMenuContainer(){
      return '[class*="sidebar-content"]'
   }

   //this method verify action menu items' name and index at the same time
   getActionMenuItemsInOrder(index,name){
      cy.get(this.getRightActionMenuContainer()).children(index).should(($child) =>{
         expect($child).to.contain(name);
      })
   }

   // Added for the JIRA# AUT-571, TC# C2029
   getFooterBtn() {
      return '[class="footer"] [class="btn has-icon error"]'
   }

   getCertificateDeleteBtn() {
      return '[class="sidebar-content"] [class="confirm-modal has-icon btn"]'
   }

   getColumnFilterLabel() {
      return 'li label'
   }

   getSidebarMenu() {
      return `${this.getSidebarContent()} a[data-menu="Sidebar"]`
   }

   getIssuerTextInput() {
      return 'input[name="Issuer"]'
   }

   getSaveModifyBtn() {
      return 'a[class*="submit-edit-content"]'
   }

   getIssuerColumnHeader() {
      return 'th[data-header="Certificate Issuer"]'
   }

   getIssuerColumnHeaderFilter() {
      return `${this.getIssuerColumnHeader()} span[class*="icon-filter"]`
   }
}

export const certificateData = {
   "ISSUER_NAME1": "Absorb LMS"
}