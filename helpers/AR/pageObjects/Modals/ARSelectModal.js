import arBasePage from "../../ARBasePage";

export default new class ARSelectModal extends arBasePage {

  getSearchTxtF() {
    return 'input[aria-label="Search"]';
  }

  getFirstSelectOpt() {
    return `[role='tree'] > [role='treeitem']:nth-child(1) [class*="_hierarchy_node"]`
  }

  getSelecDepartmentDropDownBtn() {
    return `[data-name="hierarchy-tree-item"] [data-name="toggle"]`
  }

  getSelectDepartmentBtn() {
    return '[class*="_select_list_1wh85_4"]';
  }

  getSelectOpt() {
    return '[data-name="hierarchy-tree-item"] [data-name="label"]'
  }

  getLockedDeptMainTxtD() {
    return '[aria-label="DEPTB"]'
  }

  getLockedDeptSubDeptTxtD() {
    return `[aria-label="Sub-Dept B"]`
  }

  getLockedDeptSubSubDeptTxtD() {
    return `[aria-label="Sub Dept B's sub dept BB"]`
  }

  getChooseBtn() {
    return '[data-name="submit"]'
  }

  getCancelBtn() {
    return `[data-name="cancel"][class="_button_4zm37_1 _cancel_4zm37_86"]`
  }

  getHierarchySelectModal() {
    return `[data-name*="-hierarchy-select-modal"]`
  }

  /**
    * A function that searches and selects object in the Select modal.
    * If there are more than one objects in the array, then it goes through the loop to search, select,
    * and clear the search field until all objects have been selected. It clicks the Choose button at the end of the loop
    * @param arrayElements - Contains a single or a list of objects.
   */
  SearchAndSelectFunction(arrayElements) {
    cy.wrap(arrayElements).each((el) => {
      cy.get(this.getSearchTxtF()).clear().type(el);
      this.getLShortWait()
      cy.get(this.getSelectOpt(), { timeout: 10000 }).contains(el).click({ force: true });
    })
    this.getLShortWait()
    cy.get(this.getHierarchySelectModal()).within(() => {
      cy.get(this.getChooseBtn()).click()
    })
  }

  /**
  * A function that searches and selects object in the Select modal.
  * If there are more than one objects in the array, then it goes through the loop to search, select,
  * and clear the search field until all objects have been selected. It clicks the Cancel button at the end of the loop
  * @param arrayElements - Contains a single or a list of objects.
 */
  SearchSelectAndCancelFunction(arrayElements) {
    cy.wrap(arrayElements).each((el) => {
      cy.get(this.getSearchTxtF()).clear().type(el);
      cy.wait(1000)
      cy.get(this.getSelectOpt(), { timeout: 10000 }).contains(el).click({ force: true });
    })
    cy.get(this.getCancelBtn()).contains('Cancel').click();
  }

  // Selects object in the Select modal with the given name.
  SelectFunction(name) {
    //this.getLongWait()
    cy.get(this.getSelecDepartmentDropDownBtn()).click()
    cy.get(this.getSearchTxtF()).clear().type(name);
    this.getLShortWait()
    cy.get(this.getSelectOpt(), { timeout: 10000 }).contains(name).click({ force: true });
    cy.get(this.getChooseBtn()).contains('Choose').click();
  }

  // Added for the TC# C2081
  searchAndSelectSessionName(arrayElements) {
    cy.wrap(arrayElements).each((el) => {
      cy.get(this.getSearchTxtF()).clear().type(el);
      cy.wait(1000)
      cy.get(this.getSelectOpt(), { timeout: 10000 }).contains(el).click({ force: true });
    })
    cy.get(this.getChooseBtn()).contains('Choose').click();
  }

  // Search and select competencines
  SearchAndSelectCompetencies(arrayElements) {
    cy.wrap(arrayElements).each((el) => {
      cy.get(this.getSearchTxtF()).clear().type(el);
      this.getShortWait()
      cy.get(this.getFirstSelectOpt()).click();
    })
    this.getShortWait()
    cy.get(this.getCompetencyModalHierarchy()).within(() => {
      cy.get(this.getChooseBtn()).click()
    })
  }

  getCompetencyModalHierarchy() {
    return '[class*="_competency_hierarchy_select_modal_16edj_1"]'
  }

  getFirstSelectedOption() {
    return `[role='tree'] > [role='treeitem']:nth-child(1)  [class*="_selected_"]`
  }

  SearchAndDeselectFunction(arrayElements) {
    cy.wrap(arrayElements).each((el) => {
      cy.get(this.getSearchTxtF()).clear().type(el);
      cy.get(this.getWaitSpinner() , {timeout:15000}).should('not.exist')
      this.getLShortWait()
      cy.get(this.getFirstSelectedOption()).click()
      cy.get(this.getFirstSelectOpt()).should('not.have.class' , '_selected_1se1s_66' )
    })
    this.getLShortWait()
    cy.get(this.getHierarchySelectModal()).within(() => {
      cy.get(this.getChooseBtn()).click()
    })
  }
}