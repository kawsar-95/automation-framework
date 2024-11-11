import leBasePage from '../../LEBasePage'

export default new class LEChangePasswordModal extends leBasePage {

    getCurrentPasswordTxtF() {
        return `input[name='password']`;
    }
    getNewPasswordTxtF() {
        return `input[name='newPassword']`;
    }
    getReEnterPasswordTxtF() {
        return `input[name='verifyPassword']`;
    }
    getSavePasswordBtn() {
        return `[title='Save Change Password']`;
    }
    getCancelPasswordBtn() {
        return `[title='Cancel Change Password']`;
    }
    getChangePasswordModalErrorMsg() {
        return `[class*="redux-form-input-field-module__error_message"]`;
    }
    getChangePasswordErrorMsg() {
        return `[class*="redux-form-input-field-module__error_message"]`;
    }
    getPasswordSuccessMsg() {
        return '[class*="form-info-panel-module__success_message"]'
    }
    getPasswordSuccessTxt() {
        return 'Your password has been successfully changed'
    }
    getCloseBtn() {
        return '[class*="password-form-module__btn_group"]'
    }
    getCloseDialog() {
        return '[class*="icon icon-x-thin"]'
    }
}