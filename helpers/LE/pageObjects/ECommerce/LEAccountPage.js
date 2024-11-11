import LEBasePage from '../../LEBasePage'

export default new class LEAccountPage extends LEBasePage {

//---------This page is for the ACCOUNT INFORMATION section---------

    getCheckoutBtn() {
        return `[class*="cart-account__submit_btn"]`;
    }

    getTotalPrice() {
        return `[class*="cart-total__total_value"]`;
    }

//---------For public users---------

    getSignupBtn() {
        return `[class*="cart-login__signup_btn"]`;
    }

    //Only avaible when checking out a multi-seat purchase
    getContinueAsGuestBtn() {
        return `[class*="cart-login__guest_link"]`;
    }

//For existing user login form

    getLoginUsernameTxtF() {
        return `[name="username"]`
    }

    getLoginPasswordTxtF() {
        return `[name="password"]`
    }

    getLoginBtn() {
        return `[class*="cart-login-module__submit_btn"]`;
    }

    //This button is only available if you are returning to checkout after submitting the 
    //account information form in the signup process
    getPrevSignedUpCheckoutBtn() {
        return `[class*="cart-login__continue_btn"]`;
    }

//---------For new user signup form---------

    getUsernameTxtF() {
        return `[name="Username"]`
    }

    getPasswordTxtF() {
        return `[name="Password"]`
    }

    getReEnterPasswordTxtF() {
        return `[name="VerifyPassword"]`
    }

    getProceedBtn() {
        return `[class*="profile-form-module__save_btn"]`;
    }

//---------Personal Information Fields---------
//*These can be used in any signup form (ex. after using E-Key)

    getFirstNameTxtF() {
        return `[name="FirstName"]`
    }
 
    getLastNameTxtF() {
        return `[name="LastName"]`
    }

    getEmailTxtF() {
        return `[name="EmailAddress"]`
    }

    getPhoneTxtF() {
        return `[name="Phone"]`
    }

    //Pass the field name and error message it should be displaying to verify
    getVerifyErrorMsgByFieldName(field, errorMsg) {
        cy.get('[class*="redux-form-input-field-module__label_wrapper"]').contains(field).parent().parent().within(() => {
            cy.get('[class*="form-field__error_message"]').should('contain.text', errorMsg)
        })
    }

//---------Shipping Information Fields---------

    getAddressTxtF() {
        return `[name="Address"]`
    }

    getAddress2TxtF() {
        return `[name="Address2"]`
    }

    getCountryDDown() {
        return `[name="CountryCode"]`
    }

    getProvinceDDown() {
        return `[name="ProvinceCode"]`
    }

    getCityTxtF() {
        return `[name="City"]`
    }

    getPostalCodeTxtF() {
        return `[name="PostalCode"]`
    }

    getJobTitleTxtF() {
        return `[name="JobTitle"]`
    }

    getProceedToCheckoutBtn() {
        return `[class*="cart-shipping-module__submit_btn"]`;
    }

    // Added for the TC # C6340
    getProceedToCheckoutBtnSecond() {
        return '[class*="cart-account__submit_btn"]';
    }

    getProceedToCheckoutSingUpBtn(){
        return `[class*="btn profile-form-module__save_btn"]`
    }

    getProceedToCheckoutPaymentBtn(){
        return `[class*="btn cart-shipping-module__submit_btn"]`
    }
}
