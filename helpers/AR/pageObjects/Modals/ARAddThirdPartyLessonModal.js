import arBasePage from "../../ARBasePage";

export default new class ARAddThirdPartyLessonModal extends arBasePage {

    getModal() {
        return 'h1[data-name="dialog-title"]'
    }

    getNameTxtF() {
        return '[role="dialog"] [name="name"]'
    }

    getDescription() {
        return '[role="dialog"] [aria-label="Description"]'
    }

    getApplyBtn() {
        return '[data-name="content"] [class*="icon-disk"]'
    }

    getCancelBtn() {
        return '[data-name="content"] [class*="icon icon-no"]'
    }
}