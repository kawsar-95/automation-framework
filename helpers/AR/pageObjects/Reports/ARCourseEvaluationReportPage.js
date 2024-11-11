import arBasePage from "../../ARBasePage";

export default new class ARCourseEvaluationReportPage extends arBasePage {

getCourseNameDDownSearchTxtF(){
    return '[data-name= "list-content"]'
    }

getPropertyNameDDownField(){
    return '[data-name= "field"]'
    }

getPropertyNameDDownOpt(){
    return '[class*="_select_option_"]' 
    }

getRemoveBtn(){
    return '[class="filter-item applied"] [class="filter-item-btn remove"]'
    }

coursePanelAddFilter(propertyName) {
    cy.get(this.getPropertyNameDDownField()).click();
    cy.get(this.getCourseNameDDownSearchTxtF()).type(propertyName)
    cy.get(this.getPropertyNameDDownOpt()).contains(propertyName).click()
    cy.get(this.getSubmitAddFilterBtn()).click();
    }

getLayoutMenuItems(){
    return '[data-bind="term: Title"]'
    }
      
//this method verify layout items' name and index at the same time
getVerifyLayoutMenuItemByNameAndIndex(index,name){
    cy.get(this.getLayoutMenuItems()).eq(index).should('contain',name)
    }
      
}    