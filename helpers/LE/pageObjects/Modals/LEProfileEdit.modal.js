import leBasePage from '../../LEBasePage'

export default new class LEProfileEditModal extends leBasePage {

    getMiddleNameTxtF() {
        return `input[name='MiddleName']`;
    }
    getSaveProfileBtn() {
        return `[title='Save Profile']`;
    }
    getCancelBtn() {
        return `[title='Cancel Edit Profile']`;
    }
    getProfileEditSuccessMsg() {
        return '[class*="form-info-panel-module__success_message"]'
    }
    getProfileEditSuccessTxt() {
        return 'Your profile has successfully been updated with your specified details.'
    }
    getCloseDialog() {
        return '[class*="icon icon-x-thin"]'
    }
    getJobTitleTxtF() {
        return `[name="JobTitle"]`
    }
}