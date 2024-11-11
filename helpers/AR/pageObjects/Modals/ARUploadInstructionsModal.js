import arBasePage from "../../ARBasePage"

export default new class ARUploadInstructionsModal extends arBasePage {

    getUploadFileInstructionsTxt() {
        return "Upload Instructions";
    }

    getApplyBtn() {
        return 'div[class*="_modal_footer_"] div[class*="_child_"] button[data-name="save"]'
    }

    getCancelBtn() {
        return `[data-name="content"] [class*="icon icon-no"]`
    }
    getModalContainer() {
        return '[data-name="instructions"]'
    }
    getBoldBtn() {
        return '[id^=bold-]';
    }
    getItalicBtn() {
        return '[id^=italic-]';
    }


}