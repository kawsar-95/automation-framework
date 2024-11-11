import arBasePage from "../../ARBasePage";

export default new class ARLoginPage extends arBasePage {

    getLoginHeaderTitle() {
        return `[class*="login-module__header"]`
    }

    getUsernameTxtF() {
        return `[name="username"]`
    }

    getPasswordTxtF() {
        return `[name="password"]`
    }

    getLoginBtn() {
        return 'button[type="submit"]';
    }

    getLoginErrorMsg() {
        return '[class*="_errors"] [data-name="error"]';
    }

    getLoginErrorTxt() {
        return 'The username or password provided is incorrect or this user is not authorized to access this. Please try again.';
    }

    getLoginInactiveAccountErrorTxt() {
        return 'The username or password provided is incorrect or this user is not authorized to access this. Please try again.';
    }

    getAbsorbLogo() {
        return `[data-name="absorb-logo"]`
    }
}
