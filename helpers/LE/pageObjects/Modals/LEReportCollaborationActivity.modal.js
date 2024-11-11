import leBasePage from '../../LEBasePage'

export default new class LEReportCollaborationActivityModal extends leBasePage {

    getReasonRadioBtn() {
        return '[data-name="reason"] [class*="radio-button-module__label"]'
    }

    getOtherTxtF() {
        return 'textarea[name="details"]'
    }

    getReportBtn() {
        return 'button[type="submit"][role="button"]'
    }

    getCancelBtn() {
        return '[class*="btn__cancel"]'
    }

}