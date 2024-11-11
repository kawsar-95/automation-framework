import LEBasePage from '../../LEBasePage'
import defaultTestData from '../../../../cypress/fixtures/defaultTestData.json'
let countryName;
export default new class LEPaymentPage extends LEBasePage {

    //Use this to select a payment method by passing the name
    getPaymentOptionByNameThenClick(name) {
        return cy.get(`[data-name="${name}-radio-button"]`).click()
    }

    getProceedToCheckoutBtn() {
        return `[class*="btn cart-payment-module__submit_btn"]`;
    }

    //Billing info fields

    getEmailTxtF() {
        return `[name="customer_email"]`
    }

    getFirstNameTxtF() {
        return `[name="billing_first_name"]`
    }

    getLastNameTxtF() {
        return `[name="billing_last_name"]`
    }

    getPhoneTxtF() {
        return `[name="billing_phone"]`
    }

    getAddressTxtF() {
        return `[name="billing_address1"]`
    }

    getPostalCodeTxtF() {
        return `[name="billing_postal_code"]`
    }

    getProvinceDDown() {
        return `[class*="fc-form-control--city-options"]`;
    }

    //Pass the field name and error message it should be displaying to verify
    getVerifyErrorMsgByFieldName(field, errorMsg) {
        cy.get(`[class*="fc-form-label"]`).contains(field).parents(`[class*="fc-alert-container--error"]`).within(() => {
            cy.get('[class*="fc-alert fc-alert--danger"]').should('contain', errorMsg)
        })
    }

    //Credit card payment fields

    getCCardNumbertxtF() {
        return `[name="cc_number"]`
    }

    getCCardMonthDDown() {
        return `[name="cc_exp_month"]`
    }

    getCCardYearDDown() {
        return `[name="cc_exp_year"]`
    }

    getCCardCSCTxtF() {
        return `[name="cc_cvv2"]`
    }

    //Function to fill out credit card info
    getCCardInfo(CCNumber, CCMonth, CCYear, CSC) {
        cy.origin('https://guiaarqa.securecheckout.myabsorb.com',
        { args: [CCNumber, CCMonth, CCYear,CSC] },
        ([CCNumber, CCMonth, CCYear, CSC]) => {
        cy.get(`[name="cc_number"]`).type(CCNumber)
        cy.get(`[name="cc_exp_month"]`).select(CCMonth)
        cy.get(`[name="cc_exp_year"]`).select(CCYear)
        cy.get(`[name="cc_cvv2"]`).type(CSC)
    })
    }

    //Pass the expected credit card error message to verify
    getVerifyCCardErrorMsg(errorMsg) {
        cy.get(`[data-fc-container="payment"]`).within(() => {
            cy.get('[class*="fc-alert fc-alert--danger show"]').should('contain.text', errorMsg)
        })
    }

    getSubmitOrderBtn() {
        return `[class*="fc-container__grid--checkout-submit"]`;
    }

    getClickSubmitOrderBtn() {
        cy.origin('https://guiaarqa.securecheckout.myabsorb.com', () => {
          cy.get(`[class*="fc-container__grid--checkout-submit"]`).click()
        })
    }

    //Purchase Order / Wire Transfer / Cheque form fields

    getReferenceNumberTxtF() {
        return `[name="ReferenceNumber"]`
    }

    getPOrderProceedToCheckoutBtn() {
        return `[class*="cart-billing__submit_btn"]`;
    }

    getCountryNameDDown() {
        return 'input[data-fc-id="billing_country_name"]';
    }

    getCountryListDropDownOpt(countryCode) {
        return `[data-awesomecomplete-value="${countryCode}"]`
    }

    /**
 * CI test agents run from the USA so they need to select Canada and then re-enter a postal code
 * Country is auto-detected in the app code
 * Does nothing when CANADA is detected/default
 */
    getSelectCanadaAndPCIfInOtherCountry() {
        cy.origin('https://guiaarqa.securecheckout.myabsorb.com', () => {
            cy.get('input[data-fc-id="billing_country_name"]').invoke('val').then(($text) => {
            if ( $text !== 'Canada') {
                cy.wait(2000)
                cy.get('input[data-fc-id="billing_country_name"]').click()
                cy.get(`[data-awesomecomplete-value="CA"]`).click({ force: true })
                cy.get('[name="billing_postal_code"]').clear().type(defaultTestData.USER_LEARNER_POSTALCODE)
                cy.wait(2000)
                cy.get(`[name="billing_postal_code"]`).should('have.value', ecommFields.postalCode)
                cy.get('[class*="fc-form-control--city-options"]').should('have.value', ecommFields.city + ', ' + ecommFields.provinceCode)
            }
        })
        })
        // cy.get(this.getCountryNameDDown()).invoke('val').then(($text) => {
        //     cy.addContext(`Current Country is ${$text}`)
        //     if ( $text !== 'Canada') {
        //         this.getVShortWait()
        //         cy.get(this.getCountryNameDDown()).click()
        //         cy.addContext('Switching country to canada')
        //         cy.get(this.getCountryListDropDownOpt('CA')).click({ force: true })
        //         cy.get(this.getPostalCodeTxtF()).clear().type(defaultTestData.USER_LEARNER_POSTALCODE)
        //         this.getLShortWait()
        //     }
        // })
    }
}
