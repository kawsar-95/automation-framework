import arBasePage from "../../ARBasePage";


export default new class ARExternalTrainingPage extends arBasePage {
      
   getSectionHeader () {
      return `[class="section-title"]`;
   }

   getExternalTrainingFirstResultItem() {
      return '[class="results"] > table > tbody > tr:first-child > td[class*=select]'
   }

   getExternalTrainingFirstResultItemStatus() {
      return '[class="results"] > table > tbody > tr:first-child > td:last-child'
   }

   getExternalTrainingSelectedResultItem() {
      return '[class="results"] > table > tbody > tr > td[class*=selected]'
   }

   getSidebarTitles() {
      return '[class*="sidebar-title"]';
   }

   getDeselectButton() {
      return '[class*="icon-no icon"]'
   }

   getEditButton() {
      return '[class="sidebar-content"] [class*="icon-pencil icon"]'
   }

   getApproveButton() {
      return '[class="sidebar-content"] [class*="icon-checkmark icon"]'
   }

   getDeclineButton() {
      return '[class="sidebar-content"] [class*="icon-x icon"]'
   }

   getDeleteButton() {
      return '[class="sidebar-content"] [class*="icon-trash icon"]'
   }

   getCancelButton() {
      return '[class="sidebar-content"] [class*="cancel"]'
   }

   getConfirmModal(){
      return '[id="confirm-modal-content"]'
   }

   getConfirmModalMessage(){
      return '[id="confirm-modal-content"] [class*="message"]'
   }

   getConfirmModalCancelButton(){
      return '[id="confirm-modal-content"] [class*="btn cancel has-icon"]'
   }

   getConfirmModalSaveButton(){
      return '[id="confirm-modal-content"] [class*="btn has-icon success"]'
   }

   getConfirmModalDontSaveButton(){
      return '[id="confirm-modal-content"] [class*="icon icon-arrow-forward"]'
   }

   getConfirmModalOkButton(){
      return '[id="confirm-modal-content"] [class*="btn has-icon error"]'
   }
   
   getConfirmModalBtnLinks() {
      return '[class*="footer"] > a'
   }

   getEditExternalTrainingMarkAsRadio() {
      return '[id="Status"] a[class*="radio-option"] [class*="title"]'
   }

   getEditExternalTrainingMarkAsRadioSelected() {
      return '[id="Status"] a[class*="radio-option selected"] [class*="title"]'
   }

   getDateElementByLabelAndClick(attrValue) {
      cy.get('[class*="field"]  label').contains(attrValue).next().find('[class*="date datepicker"]').click()
   }

   getDateElementClearItem() {
      return '[class*="datepicker-days"] tfoot [class*="clear"]'
   }

   getDateElementSelectedToday() {
      return '[class*="datepicker-days"] [class*="today day"]'
   }

   getActionMenuItems() {
      return `[data-menu="Sidebar"]`
   }

   getActionMenuItemsByName(name) {
      cy.get(this.getActionMenuItems()).contains(name).click()
   }

   getNameTextF() {
      return `[name="Name"]`
   }

   getInActiveToggleBtn() {
      return `[class="toggle"]`
   }

   getFieldsTabsMenuItem() {
      return `[data-tab-menu="Fields"]`
   }

   getUploadFileDDownBtn() {
      return `[placeholder="Upload File"]`
   }

   getUploadFileDDownOptions() {
      return `[placeholder="Upload File"] > option`
   }

   getSaveBtn() {
      return `[class*="has-icon btn submit"]`
   }

   getExternalTrainingNameLabel() {
      return `[class="preserve-whitespaces"]`
   }

   assertExternalTrainingStatus(trainingName, status) {
      this.A5AddFilter('Course Name', 'Contains', trainingName)
      cy.get(this.getA5WaitSpinner(), {timeout: 3000}).should('not.exist')
      cy.get(this.getTableDataCell()).contains(status)
   }

}

export const externalTrainingDetails = {
   "externalTrainingName": "GUIA - External - Training" + new arBasePage().getTimeStamp(),
   "externalTrainingName2": "GUIA - External - Training2" + new arBasePage().getTimeStamp(),
}