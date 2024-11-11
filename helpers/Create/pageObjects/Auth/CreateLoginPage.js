import CreateBasePage from '../../CreateBasePage'

export default new class CreateLoginPage extends CreateBasePage {
    getUsernameTxtF() {
        return `[name="email"]`
    }

    getPasswordTxtF() {
        return `[name="password"]`
    }

    getLoginBtn() {
        return 'button[data-name="login-button"]'
    }
    
    getSignInValue() {
        return "Sign in"
    }


    getLoginErrorMsg() {
        return '[class*="koan-login-right-container"] > div';
    }

    getLoginErrorTxt() {
        return 'The username or password you entered is not valid';
    }

}