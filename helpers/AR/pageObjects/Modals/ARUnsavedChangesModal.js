import arBasePage from "../../ARBasePage";

export default new class ARUnsavedChangesModal extends arBasePage {

  getClickUnsavedActionBtnByName(actionName) {
    return cy.get('div#confirm-modal-content .btn.has-icon').contains(actionName).click()
  }

  getUnsavedModalContainer() {
    return '[id="confirm-modal-content"]'
  }

  getSaveBtn() {
    return '[class*="btn has-icon success"]'
  }

  getUnsavedChangesTxt() {
    return '[class*="_prompt_content"] span'
  }

  getBlatantUnsavedChangesTxt() {
    return '[class*="confirm-dialog info"]'
  }

  getUnsavedChangesMsg() {
    return "You haven't saved your changes. Are you sure you want to leave this page?"
  }

  getOKBtn() {
    return `[data-name="prompt-footer"] div ${this.getElementByDataNameAttribute('confirm')}`
  }

  getCancelBtn() {
    return '[data-name="prompt-footer"]' + ' ' + this.getElementByDataNameAttribute("cancel")
  }
  getModalContent() {
    return 'div.confirm-dialog.info'
  }
  getDontSaveBtn() {
    return '[class*="icon icon-arrow-forward"]'
  }
  getModalCancelBtn() {
    return '[class*="btn cancel has-icon"]'
  }
  getBtn() {
    return "a[class*='btn has-icon']"
  }

  getPromptHeader() {
    return '[data-name="prompt-header"]'
  }

  getPromptContent() {
    return '[data-name="prompt-content"]'
  }

  getPromptFooter() {
    return '[data-name="prompt-footer"]'
  }

  getUnsavedModalMsg() {
    return '[id="confirm-modal-content"] [class="message"]'
  }
}