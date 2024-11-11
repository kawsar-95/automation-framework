import arBasePage from "../../ARBasePage"

export default new class ARDeleteModal extends arBasePage {

    getDeletePromptContent() {
        return '[data-name="prompt-content"]'
    }

    getDeleteUserMessage(){
        return '#delete-user-message'
    }

    getDeleteBtn() {
        return "confirm";
    }

    getCancelBtn() {
        return "cancel";
    }

    getA5OKBtn() {
        return `div#confirm-modal-content .btn.error.has-icon`;
    }

    getA5CancelBtn() {
        return `div#confirm-modal-content .btn.cancel.has-icon`
    }

    //Updated for AR
    getARCancelBtn() {

        return `[data-name="cancel"]`;
    }

    getARDeleteBtn() {
        return `[data-name="confirm"]`;
    }
    getPromptFooter() {
        return '[data-name="prompt-footer"]'
    }
    //Pass 'A5' or 'AR' and button name
    getDeleteItem(pageType = 'AR', buttonName = 'Delete') {
        switch (pageType) {
            case 'AR':
                cy.wrap(this.WaitForElementStateToChange(this.getAddEditMenuActionsByName(buttonName), 1000))
                cy.get(this.getAddEditMenuActionsByName(buttonName)).click()
                cy.get(this.getElementByDataNameAttribute(this.getDeleteBtn())).click()
                this.getShortWait()
                break;
            case 'A5':
                cy.wrap(this.A5WaitForElementStateToChange(this.getA5AddEditMenuActionsByIndex(2), 1000))
                this.getA5AddEditMenuActionsByNameThenClick(buttonName)
                cy.get(this.getA5OKBtn()).click()
                this.getShortWait()
                break;
            default: cy.addContext(`No pageType of ${pageType} Exists`)
        }
    }

    getDeleteMsg(name) {
        return `Are you sure you want to delete ${name ? "'" : ""}${name || ''}${name ? "'?" : ""}`
    }
    getModalContent() {
        return '[data-name="prompt-content"]>span'
    }

    getA5ModalContent() {
        return `[class="message has-icon"]`
    }

    getDeleteUserModal() {
        return `[data-name="delete-user-prompt"]`
    }

    getDeleteCourseModal() {
        return `[data-name="delete-user-prompt"]`
    }

    getDeleteConfirmBtn() {
        return `[data-name="${this.getDeleteBtn()}"]`
    }

    // Added for the TC# C2039
    getDeletePromptHeader() {
        return 'prompt-header'
    }

    getModalHeader() {
        return `[data-name="${this.getDeletePromptHeader()}"]`
    }

    getCanncelDeleteBtn() {
        return `[data-name="${this.getCancelBtn()}"]`
    }
    getDeleteMsgSection() {
        return 'span[id="delete-user-message"]'
    }

    getUnsavedChangesPrompt() {
        return `[data-name="discard-changes-prompt"]`
    }

    getPromptIcon() {
        return '[data-name="prompt-icon"]'
    }
}