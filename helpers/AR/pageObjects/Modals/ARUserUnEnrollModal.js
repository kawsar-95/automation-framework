import arBasePage from "../../ARBasePage"

export default new class ARUserUnEnrollModal extends arBasePage {

    // Use this text as value for data-name attribute to get this element
    getOKBtn() {
        return 'button[data-name="confirm"]';
    }

    // Use this text as value for data-name attribute to get this element
    getCancelBtn() {
        return 'button[data-name="cancel"]';
    }
    getUnenrollModalContainer() {
        return 'div[data-name="unenroll-user-prompt"][class="_prompt_layout_1jon3_1"]'
    }

    getModalNotification () {
        return `[aria-label="Notification"]`
    }

    getApplyBtn() {
        return `button[data-name="save"]`
    }

}