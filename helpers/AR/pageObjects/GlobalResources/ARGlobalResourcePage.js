import arBasePage from "../../ARBasePage";
import { globalResources } from "../../../TestData/GlobalResources/globalResources";
import ARCoursesPage from "../Courses/ARCoursesPage";


export default new (class ARGlobalResourcePage extends arBasePage {

    AddGlobalResource() {

        return cy.getActionBtnByTitle("Add Global Resource");
    }

    getAddGlobalresourceBtn() {
        return `button[title="Add Global Resource"]`;
    }

    getAddNewResourceCategoryBtn() {
        return `button[data-name="add-resource-category-context-button"]`
    }

    getAddGlobalResourcePage() {
        cy.contains('Add Global Resource').should('be.visible')
    }
    getManageResourceCategoryBtn() {
        return `button[data-name="manage-resource-categories-context-button"]`
    }

    getCategory() {
        return 'div[data-name="categoryId"] button[data-name="select"]';
    }

    getChooseCategoryBtn() {
        return 'button[data-name="select"]'
    }

    getUnsavedChangesModalFooter() {
        return 'div[data-name="prompt-footer"]'
    }

    getSearchTxtBox() {
        return 'input[aria-label="Search"]';
    }

    getFirstSelectOpt() {
        //   return 'ul[role="tree"]:nth-of-type(1) li[class*="hierarchy-tree-module__list_tree_item"]';
        return 'ul[role="tree"] li[data-name="hierarchy-tree-item"]';
    }

    getChooseBtn() {
        return 'div[class*="_modal_footer"] button[data-name="submit"]';
    }

    getNameField() {
        return 'input[aria-label="Name"]'
    }

    getNameFieldErrorMsg() {
        cy.get('[data-name="name"] [data-name="error"]').should('contain', 'Field is required.')
    }

    getGRNameFieldErrorMsg(){
        return 'div[data-name="error"]'
    }

    getDescriptionField() {
        return 'textarea[aria-label="Description"]'
    }

    getTagsDropDown() {
        return 'div[data-name="tags"] div[data-name="field"]';
    }

    getTagsOptions() {
        return 'ul[aria-label="Tags"] li';
    }

    getAddAvailabilityRuleBtn() {
        return this.getElementByDataNameAttribute("add-rule");
    }

    searchCategoriesAndSelect(arrayElements) {
        cy.wrap(arrayElements).each((el) => {
            cy.get(this.getSearchTxtBox()).clear().type(el, { timeout: 5000 });
            this.getLShortWait()
            cy.get(this.getFirstSelectOpt()).first().click({ force: true })
        })
        cy.get(this.getChooseBtn()).contains('Choose').click();
    }

    getAddFilterBtn() {
        // return 'button[class*="icon-button-module_icon_button--FSyW9 data-filters-module_add_filter--FYB1X"]'
        return `[data-name="add-filter"]`;
    }

    getPropertyNameDDown() {
        //return `[class="property-select-dropdown"]`
        //return `[class^="data-filter-editor-module"] [data-name="field"]`;
        return '[class*="_field"] [data-name="field"]';


    }

    getOperatorDDown() {
        //return `[class="operator-select"] > select`
        // return `[class^="select-option-value-module"] [title="Name"]`;
        //return `[class^="select-item-module"] [id="select-39-options-name"]`
        // return ` ul[id="select-20-options-name"] li`;
    }

    getA5ValueTxtF() {
        return `.value-select [type]`
    }

    getA5SubmitAddFilterBtn() {
        return `.full-width.margin-bottom-10 > span:nth-of-type(2)`
    }

    getFilterSearchTxtBox() {
        return '[data-name="list-content"] [data-name="input"]';
    }

    getListOptions() {
        /*
        <div data-name="options">
        <ul id="select-1499-options" class="select-list-module__select_list--UYA0S" role="listbox" aria-label="Property">
        <li id="select-1499-options-name" class="select-item-module__option--WdWnx" role="option" aria-selected="false">
        <div class="select-option-module__select_option--s3K4z"><div class="select-option-module__select_box--zNWXo">
        <div class="select-option-module__select_inner--r40rJ"></div></div><span class="select-option-module__label--oe6uY">Name</span></div></li></ul></div>
        */

        return '[data-name="options"] ul li';
    }

    getFilterValueTxtBox() {

        // return '[class^="text-input-module"]';
        return '[class*="_text_input_"]'
    }

    getAddFilterSubmitBtn() {
        return `button[data-name="submit-filter"]`;
    }

    AddFilter(propertyName, Operator = null, value = null) {
        cy.get(this.getAddFilterBtn()).click();
        cy.get(this.getPropertyNameDDown()).first().click();
        cy.get(this.getFilterSearchTxtBox()).first().type(propertyName);
        cy.get(this.getListOptions()).first().click();

        cy.get(this.getFilterValueTxtBox()).type(value);
        cy.wait(500);
        cy.get(this.getAddFilterSubmitBtn()).click();

    }

    getTableCellRecordByColumn(columnIndex) {
        return `tr > td:nth-of-type(${columnIndex})`;
    }

    // Updated for AR
    getARAddEditMenuActionsByNameThenClick(name) {
        cy.get(this.getARMenuActionsBtn()).filter(`:contains(${name})`).should('have.attr','aria-disabled','false').click()
    }
    // Updated for AR 
    getARMenuActionsBtn() {
        return `button[data-name="edit-global-resource-context-button"]`;
    }

    // Updated for AR
    getARDeleteMenuActionsByNameThenClick(name) {
        this.getMediumWait()
        cy.get(this.getDeleteMenuActionsBtn()).filter(`:contains(${name})`).should('have.attr','aria-disabled','false').click()
    }

    // Updated for AR delete global resource btn
    getDeleteMenuActionsBtn() {
        return `button[data-name="delete-global-resource-context-button"]`;
    }

    getDeleteResourceCategoryBtn() {
        return 'button[data-name="delete-resource-category-context-button"]'
    }

    getdeleteexistingtag() {
        return `[aria-label="Deselect All"]`;
    }

    getDeleteExistingAvailabilityRule() {
        return `[data-name="remove"]`;
    }


    getAvailabilityForm() {
        return '[data-name="edit-global-resource-availability-form"]';
    }

    getRulesBanner() {
        // return '[class*="highlight no-items margin-bottom"]'
        return `[data-name="availability-rule-item"]`
    }

    getRulesTxt() {
        return "These rules match 231 users."
    }

    getAddGlobalResourcePage() {
        cy.contains('Add Global Resource').should('be.visible')
    }

    getARSourceChooseFileBtn() {
        return `[data-name="file"] [name="file"]`;
    }
    getARFileReuse() {
        return `[data-name="image-preview"]`;
    }
    getFileApplyBtn() {
        return `[data-name="media-library-apply"]`;
    }
    getFileCancelBtn() {
        return `button[data-name="media-library-cancel"]`;
    }

    getUploadBtn() {
        return `button[data-name="media-library-file-upload"]`;
    }

    getARFileTxtF() {
        return this.getElementByNameAttribute("file")
    }

    getuploadedfile() {
        return `["value=CourseResourceUploadImage1.jpg']`;
    }

    getEdituploadfile() {
        return `["value=moose.jpg']`;
    }

    getGLThumbnUrlBtn() {
        // return `[aria-labelledby="radio-button-7_label"]`;
        // return `[id="radio-button-37_label"]`;
        //return `[class="radio-button-module__radio_button--Wqshh radio_button"]`;
        // return ' [class*="_radio_button"] [name="radio-group-1"]';
        return `[class*="_radio_button_"] [class*="_circle_container"]`;
        // return `[class*="_radio_button_"] [name="radio-group-1"]`;
        //return `[class*="_radio_button_"] [class*="_dot_"]`;
    }
    getThumbnUrlTxtField() {
        return this.getElementByNameAttribute("thumbnailImage");
    }

    getFileValueTxt() {
        return `[data-name="value"]`;
    }
    getPublicFileRadioBtn() {
       return `[data-name="accessMode"] [data-name="radio-button"] [class="_label_6rnpz_32"]`
    }
    getuploadmodalBtn() {
        return '[class*="_file_select"]'
    }
    getFileSaveBtn() {
        return `[data-name="submit"]`;
    }

    getClearTagBtn() {
        return `[data-name="clear"]`
    }

    getEditGlobalRecourseBtn() {
        return `button[data-name="edit-global-resource-context-button"]`
    }

    getDeleteGlobalRecourseBtn() {
        return `[data-name="delete-global-resource-context-button"]`
    }

    getTagsContainer() {
        return `[data-name="tags"]`
    }

    //Availability Section

    getAddRuleBtn() {
        return 'button[data-name="add-rule"]'
    }

    getFirstRulesContainer() {
        return `[aria-label="Rules"]`
    }

    getSecondRulesContainer() {
        return `[aria-label="Or Rule 2 of 2"]`
    }

    getRuleDropDownBtn() {
        return `[data-name="selection"]`
    }

    getRuleFirstDropDownOptions() {
        return `[class="_label_ledtw_62"]`
    }

    getRuleTextF() {
        return `[class="_text_input_1c8rc_1"]`
    }

    getRuleDeleteBtn() {
        return `button[aria-label="Delete"]`
    }

    getRefineRuleBtn() {
        return `button[data-name="add"]`
    }

    getAddRule(label, selectOpt1, selectOpt2, name) {
        label.within(() => {
            cy.get(this.getRuleDropDownBtn()).eq(0).click()
            cy.wait(1000)
            cy.get(this.getRuleFirstDropDownOptions()).contains(selectOpt1).click()
            cy.wait(1000)
            cy.get(this.getRuleDropDownBtn()).eq(1).click()
            cy.wait(1000)
            cy.get(this.getRuleFirstDropDownOptions()).contains(selectOpt2).click()
            cy.wait(1000)
            cy.get(this.getRuleTextF()).type(name)
        })
    }

    getThumbnailFormSection() {
        return 'div[aria-label="Thumbnail"]'
    }

    getFileInput() {
        return 'input[class="_text_input_17ufv_7"]'
    }
    getChooseFileBtn() {
        return 'button[data-name="select"]:contains(Choose File)'
    }

    getDeselectBtn() {
        return 'span[class*="icon icon-no"]'
    }

    // Added for the TC# C5014
    getModalOkBtn() {
        return '[data-name="prompt-footer"] [data-name="confirm"]'
    }

    getModalCancelBtn() {
        return '[data-name="prompt-footer"] [data-name="cancel"]'
    }
    
    getPromptDes() {
        return '[data-name="prompt-content"]'
    }

    getAddResourceCategoryMenu() {
        return this.getAddEditMenuActionsByName('Add New Resource Category')
    }

    getManageCategoryMenu() {
        return this.getAddEditMenuActionsByName('Manage Resource Categories')
    }

    //Added for JIRA #AUT-869, TC# C7840
    AddSubCategoryFilterGlobalResourceReport(propertyName) {
        cy.get(this.getResourceCategoryColumnFilterBtn()).click({force:true});
        cy.get(ARCoursesPage.getCategoryFilterOptPicker()).click();
        cy.get(ARCoursesPage.getOperatorNameDDownOpt()).contains(propertyName).click();
        cy.get(ARCoursesPage.getChooseCategoryBtn()).click();
        cy.get(ARCoursesPage.getCategorySelectBox()).eq(0).click()
        cy.get(ARCoursesPage.getCategoryChooseBtn()).click()
        cy.get(this.getSubmitAddFilterBtn()).should('be.visible',{timeout:3000}).click()
     }

     getResourceCategoryColumnFilterBtn(){
        return '[title="Resource Category Filter"]'
     }

     getThumbnailSpan() {
        return 'div[aria-label="Thumbnail"] span'
     }

     getVisibilityDescription() { 
        return `[data-name="accessMode"] [data-name="description"]`
     }

})();