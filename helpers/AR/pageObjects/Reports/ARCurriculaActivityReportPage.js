import arBasePage from "../../ARBasePage";
import ARDashboardPage from "../Dashboard/ARDashboardPage"
import ARAddObjectLessonModal from "../Modals/ARAddObjectLessonModal"

export default new class ARCurriculaReportPage extends arBasePage {

     getChooseDDownSearchTxtF(){
        return '[class*="_search_"] [data-name="input"]'
     }

     getTableProgressColTxt(){
          return "tr > th:nth-child(9) > div >button>span"
     }
     
     ChooseAddFilter(propertyName) {
        cy.get(this.getElementByDataName("selection")).click()
        cy.get(this.getChooseDDownSearchTxtF()).type(propertyName);
        cy.get(this.getPropertyNameDDownOpt()).contains(propertyName).click()
        cy.get(this.getSubmitAddFilterBtn()).click();
   }

   getDeleteCourseBtn() {
    return '[data-name="delete-course-context-button"]'
   }

   // Added for the TC# C7290
   getRightContextMenu() {
    return '[class*="_context_menu_"]'
   }

   // Added for the TC# C7334 
   getActionRightMenuDeletebtn() {
       return 'delete-course-context-button'
   }

   getInactiveMenuItem() {
       return 'button[aria-disabled="true"]'
   }

   // Added for the TC# C7322
   getDeselectBtn() {
        return 'button[class*="_deselect_button_"]'
   }

   getActionRightMenuDeletebtn() {
       return `delete-course-context-button`
   }

   getModalTitle() {
       return `prompt-header`
   }

   getModalContent() {
       return `prompt-content`
   }

   // Added for the JIRA# AUT-539, TC# C1987
   getDropDownOption() {
    return '[class*="_label_led"]'
   }

   AddGroupFilter(name) {
    cy.get(this.getAddFilterBtn()).click()
    cy.get(this.getPropertyName() + this.getDDownField()).eq(0).click();
    cy.get(this.getPropertyNameDDownSearchTxtF()).type('Groups')
    cy.get(this.getPropertyNameDDownOpt()).contains(new RegExp("^" + 'Groups' + "$", "g")).click()
    cy.get(ARAddObjectLessonModal.getChooseDDownBtn()).eq(1).type(name)
    cy.get(this.getDropDownOption()).contains(name).click()
    cy.get(ARAddObjectLessonModal.getChooseDDownBtn()).eq(1).click()
    cy.get(this.getSubmitAddFilterBtn()).click()
   }

   getFilterContainer() {
    return '[class*="_filter_menu"]'
   }

   getFilteredLabel() {
    return '[aria-describedby="data-filter-item-1-label"]'
   }
}