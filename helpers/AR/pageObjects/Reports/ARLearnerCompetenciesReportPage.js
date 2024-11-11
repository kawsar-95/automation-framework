import arBasePage from "../../ARBasePage";


export default new class ARLearnerCompetenciesReportPage extends arBasePage {

   getDeptmentDDown() {
      return '.value-select .select'
   }

   getDepartmentDDownValue() {
      return "li[class='folder selected'] a[class='title']"
   }

   getRightActionMenuLabel() {
      cy.get('[class*="sidebar-content"]').children().should(($child) => {
         expect($child).to.contain('Edit User');
         expect($child).to.contain('Message User');
         expect($child).to.contain('User Transcript');
         expect($child).to.contain('Delete Learner Competency');
         expect($child).to.contain('Deselect');
      })
   }

   DeptAddFilter(propertyName, Operator = null, Value = null) {
      cy.get(this.getA5AddFilterBtn()).click();
      cy.get(this.getA5PropertyNameDDown()).select(propertyName);
      cy.get(this.getA5OperatorDDown()).select(Operator);
      if (Value != null) cy.get(this.getDeptmentDDown()).click()
      cy.get(this.getDepartmentDDownValue()).contains(Value).click()
      cy.get(this.getA5SubmitAddFilterBtn()).click();
}

   getUserName() {
      return '[class="select2-result-label"]'
   }

   getLayoutMenuItems() {
      return '[data-bind="term: Title"]'
   }

   //this method verify layout items' name and index at the same time
   getVerifyLayoutMenuItemByNameAndIndex(index, name) {
      cy.get(this.getLayoutMenuItems()).eq(index).should('contain', name)
   }

   getRightActionMenuContainer() {
      return '[class="sidebar-content"]'
   }

   //this method verify action menu items' name and index at the same time
   getActionMenuItemsInOrder(index, name) {
      cy.get(this.getRightActionMenuContainer()).children(index).should(($child) => {
         expect($child).to.contain(name);
      })
   }

   getSideBarMenu() {
      return '[data-menu="Sidebar"]'
   }

   getChooseField() {
      return '[class="select2-input select2-default"]'
   }

   getUnsavedChangesModal() {
      return '[id="confirm-modal-content"]'
   }

   getCancelMessage() {
      return "You haven't saved your changes. Are you sure you want to leave this page?"
   }

   getCancelBtn() {
      return '[data-bind="text: CancelText"]'
   }

   getSaveBtn() {
      return '[class="btn has-icon success"]'
   }

   getPageTitle() {
      return '[class="section-title"]'
   }

   getAddCompetenciesBtn() {
      return '[data-bind="text: SelectButtonTitle"]'
   }

   getSelectCompetenciesModal() {
      return '[id="modal-content-1"]'
   }

   getSelectCompetenciesModalCompetencies() {
      return '[class="select-box"]'
   }

   getCompetenciesModal() {
      return '[id="content-container"]'
   }

   getAddCompetenciesSeachField() {
      return '[type="text"]'
   }

   getSelectCompetenciesModalContinueBtn() {
      return '[data-bind="text: absorb.data.terms.Continue"]'
   }

   getAssignedCompetencyContainer() {
      return '[id="edit-content"]'
   }
   getFilterItemInfo() {
      return 'div[class*="filter-item-info"]'
   }
}