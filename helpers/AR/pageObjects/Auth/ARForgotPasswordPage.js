import arBasePage from "../../ARBasePage";

export default new class ARForgotPassword extends arBasePage{
    
    getForgotPasswordnHeaderTitle() {
        return `[class*="forgot-password-module__header"]`
    }

    getUsernameTxtF() {
        return `[name="username"]`
    }

    getEmailTxtF() {
        return `[name="email"]`
    }

    getSubmitBtn() {
        return 'button[type="submit"]';
    }

    getUsernameTxt() {
       return '[data-name="username"]'
    }

    getEmailTxt() {
        return '[data-name="email"]';

    }

    getForgotPasswordTitleTxt() {
        return 'Forgot Password?';
    }

    getUsernameErrorMsg() {
        return 'div[id*="form-control-username"][data-name="error"]';
    }

    getEmailErrorMsg() {
        return 'div[id*="form-control-email"][data-name="error"]';
    }

    getSuccessMsg() {
        return '[data-name="success-message"]'
    }

}
