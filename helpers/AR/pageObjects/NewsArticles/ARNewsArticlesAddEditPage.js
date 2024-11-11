import arBasePage from "../../ARBasePage";

export default new class ARNewsArticlesAddEditPage extends arBasePage {

    getAddResourcePage()
    {
        cy.contains('Add News Article').should('be.visible')
    }
    getNameTxtF() {
        return this.getElementByNameAttribute("Title")
    }

    getDescriptionTxtF()
    {
        return 'div[class="redactor-editor"]>p'
    }


    getFileTxtF() {
        return this.getElementByNameAttribute("ArticleImage")
    }

    getFileName(fileName) {
        return 'img[src*="('+ fileName +').jpg"]'
    }

    getChooseFileBtn() {
        return '[data-bind="text: absorb.data.terms.ChooseFile"]';
    }

    getDropDown() {
        return '[id="UserId"]'
    }

    getDropDownSearchTxtF() {
        return '[id="s2id_autogen4_search"]'
    }

    getDropDownOpt() {
        return '[class*="select2-results-dept-0"]'
    }

    getPublishedBtn() {
        return '[id="IsPublished"]'
    }

    getAvailabilityTab() {
        return '[data-tab-menu="Availability"]'
    }

    getAddRuleContainer() {
        return '[class*="rules"]'
    }

    getPropertyAndSelect() {
        cy.get('[class="property-select"]').find("select").select("Username")
    }

    getRuleTxtInput() {
        return '[class="value-select"]'
    }

    getOperatorAndSelect() {
        cy.get('[class="operator-select"]').find("select").select("Equals").should("have.value", "1")
    }

    getSideBar() {
        return '[class="sidebar-content"]'
    }

    getFooter() {
        return '[class*="footer"]'
    }

    getArticleFilterBtn() {
        return '[title="Add Filter"]'
    }

    getFilterPropertyContainer() {
        return '[class="property-select"]'
    }

    getFilterOperatorContainer() {
        return '[class="operator-select"]'
    }

    getFilterValueContainer() {
        return '[class="value-select"]'
    }

    getDropDownContainer() {
        return '[class="filter-dropdown"]'
    }

    getArticleFilterSubmitBtn() {
        return 'button[class*="margin-bottom"]'
    }

    getNewsArticlesFirstSearchResultItem() {
        return '[class="results"] > table > tbody > tr:first-child > td[class*=select]'
    }

    getDeleteConfirmDialogOkBtn() {
        return '[class*=has-icon][class*="error"]'
    }

    getCancelDialogOkBtn() {
        return 'a[class*=success]'
    }

    getNewsArticles() {
        return '[data-bind="foreach: Rows"]'
    }

    getConfirmModal(){
        return '[id="confirm-modal-content"]'
    }

    getUnselectedArticleCell() {
        return 'div[class*="checkbox-wrapper"] > span > span[class*="icon-box"]'
    }

    getConfirmModalBtnLinks() {
        return '[class*="footer"] > a'
    }

    getConfirmModalWarningMsg() {
        return '[class*="message"]'
    }

    // Added for TC # C6317
    getEditMenuItem() {
        return 'a[class*="edit-content"]'
    }

    getArticleImageNameInput() {
        return 'input[name="ArticleImage"]'
    }

    getDeleteConfirmModal() {
        return 'div[id*="confirm-modal-content"]'
    }

    getA5UploadFormDialogue() {
        return `[id="uploadFileForm"]`;
    }

    getRadioSourceTitle() {
        return `span[class="title"]`;
    }

    getSelectedIconBox() {
        return `span[class="icon icon-box"]`;
    }
}
