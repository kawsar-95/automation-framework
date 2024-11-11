
import arBasePage from "../../ARBasePage";

export default new (class ARCompetencyPage extends arBasePage {

  // Elements are inherited from ARBasePage


  //Added for JIRA #AUT-869, TC# C7840
  AddSubCategoryFilterCourseReport(propertyName) {
    cy.get(this.getA5CompetencyCategoryColumnFilterBtn()).click({force:true});
    cy.get(this.getA5CompetenciesPickerBtn()).click();
    cy.get(this.getA5CompetencyFilterDDownSearchTxtF()).type(propertyName)
    cy.get(this.getA5CompetencyCategorySelectBox()).first().click()
    cy.get(this.getA5CompetencyAddFilterBtn()).should('be.visible',{timeout:3000}).click()
 }

 getA5CompetencyCategoryColumnFilterBtn(){
  return '[data-header="Category"] [title="Filter"]'
 }

 getA5CompetenciesPickerBtn(){
  return '[class="value-select"] [class="select"]'
 }

 getA5CompetencyFilterDDownSearchTxtF(){
  return '[class="drop-down"] [class="select2-search"]'
 }

 getA5CompetencyCategorySelectBox(){
  return '[class="title no-children"]'
}

getA5CompetencyAddFilterBtn(){
  return '[data-bind="click: AddFilter"]'
}

})();