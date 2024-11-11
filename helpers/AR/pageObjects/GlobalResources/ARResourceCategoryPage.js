import ARBasePage from "../../ARBasePage";
import ARGlobalResourcePage from "./ARGlobalResourcePage";
import ARDashboardPage from "../Dashboard/ARDashboardPage";

export default new (class ARResourceCategory extends ARBasePage {

    CategoryAddFilter(propertyName, Operator = null, value = null) {
        cy.get(this.getAddFilterBtn()).click();
        cy.get(this.getPropertynameDDown()).first().click();
        cy.get(this.getCategoryFilterSearchTxtBox()).first().type(propertyName);
        cy.wait(500);
        // ARDashboardPage.getShortWait()
        cy.get(this.getfilterListOptions()).first().click();
        cy.wait(500);
        // ARDashboardPage.getShortWait()
        cy.get(this.getCategoryFilterValueTxtBox()).type(value);

        cy.wait(500);
        cy.get(this.getCategoryAddFilterSubmitBtn()).click();

    }
    getfilterListOptions() {
        //  return '[data-name="options"] [role="option"]';
        //    return ' ul[id*="select-"][role="listbox"]';
        //return '[data-name="options"] ul li';
        return '[data-name="options"] ul li[id*="-options-name"]';
    }

    getCategoryFilterValueTxtBox() {
        return '[class*="_text_input_"]'

    }

    getPropertynameDDown() {
        //return `[class="property-select-dropdown"]`
        // return `[class^="data-filter-editor-"] [data-name="field"]`;
        return `[data-name="field"]`;


    }

    getCategoryFilterSearchTxtBox() {
        return '[data-name="list-content"] [data-name="input"]';
    }

    getCategoryAddFilterSubmitBtn() {
        return `button[data-name="submit-filter"]`;
    }

    getAREditCategoryMenuActionsByNameThenClick(name) {
        this.getMediumWait()
        cy.get(this.getAREditCategoryActionsBtn()).filter(`:contains(${name})`).click({ force: true });
    }

    getAREditCategoryActionsBtn() {
        return `button[data-name="edit-resource-category-context-button"]`
    }

    getGCategoryF() {
        // return '[id="ParentId"]'
        return '[data-name="text-input"]'
    }

    getARResourceCategoryDeleteMenuActionsByNameThenClick(name) {
        this.getMediumWait()
        cy.get(this.getResourceCategoryDeleteMenuActionsBtn()).filter(`:contains(${name})`).click({ force: true });
    }

    // Updated for AR delete global resource btn
    getResourceCategoryDeleteMenuActionsBtn() {
        return `button[data-name="delete-resource-category-context-button"]`;
    }

})