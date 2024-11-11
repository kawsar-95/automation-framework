import { departmentDetails } from "../../../TestData/Department/departmentDetails";
import arBasePage from "../../ARBasePage";
import ARDashboardPage from "../Dashboard/ARDashboardPage";


export default new class ARDepartmentProgressReportPage extends arBasePage {

  getDeptDdownTxtF() {
    return 'div[class="select"]'
  }
  getA5DValueTxtF() {
    return '.value-select [class="select2-search"] [type]'
  }
  getValueDDownOpt() {
    return `li > [class*="title no-children"]`
  }
  getRightActionMenuLabel() {
    cy.get('[class*="sidebar-content"]').children().should(($child) => {
      expect($child).to.contain('Edit');
      expect($child).to.contain('Message Department');
      expect($child).to.contain('Message Department and Subs');
      expect($child).to.contain('View Users');
      expect($child).to.contain('Deselect')
    })
  }
  A5DeptAddFilter(propertyName, Operator = null, Value = null) {
    cy.get(this.getA5AddFilterBtn()).click();
    cy.get(this.getA5PropertyNameDDown()).select(propertyName);
    cy.get(this.getA5OperatorDDown()).select(Operator);
    if (Value != null) cy.get(this.getDeptDdownTxtF()).click()
    cy.get(this.getA5DValueTxtF()).type(Value);
    this.getLShortWait()
    cy.get(this.getValueDDownOpt()).contains(Value).click()
    cy.get(this.getA5SubmitAddFilterBtn()).click();
  }
  //Filter and select department
  filterAndSelectDepartment(departmentName = departmentDetails.departmentName) {
    //Filter Department
    this.A5DeptAddFilter('Department', 'Is Only', departmentName)
    this.getMediumWait()
    //Select Department
    cy.get(this.getGridTable()).eq(0).click()
    this.getMediumWait()
  }
  // Navigate to Department Progress
  navigateToDepartmentProgress() {
    //Navigate to Department Progress
    this.getMediumWait()
    cy.get(this.getElementByAriaLabelAttribute('Reports')).click()
    ARDashboardPage.getMenuItemOptionByName('Department Progress')
    this.getMediumWait()
  }

  getLayoutMenuItems(){
    return '[data-bind="term: Title"]'
    }
      
  //this method verify layout items' name and index at the same time
  getVerifyLayoutMenuItemByNameAndIndex(index,name){
    cy.get(this.getLayoutMenuItems()).eq(index).should('contain',name)
  }
    
  getRightActionMenuContainer(){
    return '[class="sidebar-content"]'
  }
  
  //this method verify action menu items' name and index at the same time
  getActionMenuItemsInOrder(index,name){
    cy.get(this.getRightActionMenuContainer()).children(index).should(($child) =>{
        expect($child).to.contain(name);
    })
  }
    

}