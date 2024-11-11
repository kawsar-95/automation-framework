import arBasePage from "../../ARBasePage";

export default new (class ARAddEditCategoryPage extends arBasePage {

    getParentCategoryTxtF() {
        return '[class*="_text_ad5vm_6"]';
    }

    getChooseCategoryBtn() {
        return '[class*="category-picker-module__button"]';
    }

    getReportPageTitle() {
        return '[class*="_report_header"] [data-name="title"]';
    }

    getChooseCategoryBtn() {
        return '[class*="category-picker-module__button"]';
    }

    // Use this text as value for aria-label attribute to get this element
    getCategoryNameTxtF() {
        return "Name";
    }

    getNameErrorMsg() {
        return 'span#Name-error';
    }

    // Use this text as value for aria-label attribute to get this element
    getCategoryDescriptionTxtA() {
        return "Description";
    }

    getA5CategoryNameTxtF() {
        return "#Name";
    }

    getA5CategoryDescriptionTxtA() {
        return 'div[name="redactor-editor-0"]';
    }
    getCoursesActionsButtonsByLabel(label) {
        return `button[title="${label}"]`;
    }

    getSearchTxtF() {
        return 'input[aria-label="Search"]';
    }
    getFirstSelectOpt() {
        return 'div[class*="_node_1jnlq_1 _hierarchy_node"]'
    }
    getChooseBtn() {
        return 'div[class*="_child_1o8lk_11"] [data-name="submit"][class*="_button_4zm37_1"]'
    }

    getAlertOKBtn() {
        return '[data-name="prompt-footer"] div:nth-child(1) > button'
    }
    getAlertCancelBtn() {
        return '[data-name="prompt-footer"] div:nth-child(2) > button'
    }
    SearchAndSelectFunction(arrayElements) {
        cy.wrap(arrayElements).each((el) => {
            cy.get(this.getSearchTxtF()).clear().type(el, { timeout: 5000 });
            cy.get(this.getFirstSelectOpt()).first().click({ force: true })
        })
        cy.get(this.getChooseBtn()).contains('Choose').click();
    }
    getCoursesRightActionMenuContainer(){
        return '[class*="_child_w33d3_9"]'
      }
      
      //this method verify action menu items' name and index at the same time
      getRightActionMenuItemsOrder(index,name){
        cy.get(this.getCoursesRightActionMenuContainer()).children(index).should(($child) =>{
            expect($child).to.contain(name);
        })
      }
    

})();
