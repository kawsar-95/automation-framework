import leBasePage from '../../LEBasePage'

export default new class LEDeleteModal extends leBasePage {

    getModalContainer() {
        return '[class*="confirmation-modal-module__container"]'
    }

    getConfirmationMsg() {
        //return '[class*="confirmation-modal-module__last_message"]'
        return '[class*="confirmation-modal-module__message"]'
    }

    getCancelBtn() {
        //return '[class*="confirmation-modal-module__cancel_btn"]'
        return 'button[class*="btn__cancel"]'
    }

    getDeleteBtn() {
        return '[class*="btn__warning"]'
    }

}