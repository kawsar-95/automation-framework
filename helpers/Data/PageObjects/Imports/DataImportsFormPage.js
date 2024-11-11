import DataBasePage from "../../DataBasePage";

export default new class DataImportsFormPage extends DataBasePage {

    getUserProfile() {
        return cy.get(`[class*="user-info"]`)
    }

    getFieldContainer() {
        return `[class="control-label"]`
    }

    getClientSearchField() {
        return `[aria-labelledby*="select2-ClientId-container"]`
    }

    getClientTextF() {
        return `[class*="select2-search__field"]`
    }

    getClientListItems() {
        return `[class*="select2-results__option select2-results__option--highlighted"]`
    }

    getSelectClientByFieldName(text) {
        this.getShortWait()
        cy.get(this.getClientSearchField()).click()
        this.getShortWait()
        cy.get(this.getClientTextF()).type(text)
        this.getShortWait()
        cy.get(this.getClientListItems()).click()
    }   

    getImportName() {
        return `[id="Name"]`
    }

    getImportProjectID() {
        return `[id="JiraId"]`
    }

    getImportCreatedSuccessMessage() {
       return '[data-notify="message"]'
    }

    getLearningObjectModuleTitle() {
        return `[id="add-learning-object"] [class="modal-title"]`
    }

    getModuleTypeRadio() {
        return `[class*="title margin"]`
    }

    getSelectedModuleTypeRadioThenClick(name) {
        cy.get(this.getModuleTypeRadio()).contains(name).click()
    }

    getSampleFileModalHeader() {
        return `[id="addNewModuleModal"] [class="modal-header"]`
    }

    getModulePageTitle() {
        return `[class="page-title"]`
    }

    getFileManagerModal() {
        return `[id="file-manager-modal"] [class="modal-title"]`
    }

    getModalSideBarRootFolder() {
        return `[class="modal-sidebar"] > [class="sidebar-row ui-droppable selected"]`
    }

    getFileManagerModalFolder() {
        return `[class="modal-content"] > [class="modal-body"] > [class="modal-folder-content dz-clickable"]`
    }

    getManageFilesUploadSuccessBox() {
        return `[data-notify="container"]`
    }

    getFileAttachModalInput() {
        return `input[class="dz-hidden-input"]`
    }

    getAttachedFileElementInFileManager() {
        return `[class*="directory-content-row"]`
    }

    getFileManagerCloseBtn() {
        return `[id="file-manager-modal"] [class="btn btn-default"]`
    }

    getRunNowModal() {
        return `[class="bootbox modal fade bootbox-confirm in"] [class="modal-content"] [class="modal-header"]`
    }

    getRunNowModalConfirmBtn() {
        return `[class="bootbox modal fade bootbox-confirm in"] [class="modal-content"] [class="btn btn-success width-150 btn-branded"]`
    }

    getRunPreviewBtn() {
        return `[class*="btn-group pull-right"]`
    }

}
