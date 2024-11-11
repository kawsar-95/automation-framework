import LEBasePage from '../../LEBasePage'

export default new class LEForgotDashboardPage extends LEBasePage {
   
    getPublicDashboardLoginBtn() {
        return '[class*="header-module__login_container"]'
    }
    getUsernameTxtF() {
        return `[name="username"]`
    }
    getEmailAddressTxtF() {
        return `[name="emailAddress"]`
    }
    getValidEmailErrorTxt() {
        return "You have not entered a valid email address."
    }
    getResetPasswordBtn() {
        return `[class*="btn forgot-password-module__btn"]`
    }
    getCannotProvideBothErrorTxt() {
        return "Cannot provide both a username and email"
    }
    // This link is also on the subsequent Check Your Email Inbox Section of this page
    getReturnToMyDashboardLink() {
        return `[class*="forgot-password-module__login_link"]`
    }
    // Check Your Email Inbox
    getForgotPasswordModuleform() {
        return `[class*="forgot-password-module__form"]`
    }
    getCheckYourEmailInboxTitleTxt() {
        return "Check Your Email Inbox";
    }
    getPasswordResetLinkSentMsgTxt() {
        return "A password reset link has been sent to you.";
    }
    
}