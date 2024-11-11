import ARBasePage from "../../../AR/ARBasePage";

export default new (class ReviewerLoginPage extends ARBasePage {
  
  // Reviewer Login Page Elements


  getUsernameTxtF() {
    return '[name="username"]';
  }


  getPasswordTxtF() {
    return '[name="password"]';
  }

  getUsernameErrorMsg() {
    return '[data-name="username"] div';
  }


  getPasswordErrorMsg() {
    return '[data-name="password"] div';
  }

  getLoginBtn() {
    return '[data-name="button"]';
  }


  getLoginErrorMessage() {
    return '[class*="error-module__error_message"]';
  }









});