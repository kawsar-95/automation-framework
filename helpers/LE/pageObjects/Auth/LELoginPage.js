import LEBasePage from '../../LEBasePage'

export default new class LELoginPage extends LEBasePage {
   
    getUsernameTxtF() {
        return `[name="username"]`
    }

    getPasswordTxtF() {
        return `[name="password"]`;
    }

    getLoginBtn() {
        return `[class*="btn login-form-module__btn"]`;
    }

    getSignUpBtn() {
        return `[class*="link-button-module__link"]`;
    }

    getForgotPasswordBtn() {
        return `[class*="login-form-module__forgot_password_link"]`;
    }

    getLoginPageTitle() {
        return `[class*="login-form-module__title"]`;
    }

}