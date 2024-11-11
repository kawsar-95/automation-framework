import LEBasePage from '../../LEBasePage'

export default new class LEInvoicePage extends LEBasePage {

    getOrderCompletedHeader() {
        return `[class*="cart-receipt-module__header"]`;
    }

    getTotalPrice() {
        return `[class*="cart-receipt__total"]`;
    }

    getViewCourseBtn() {
        return `[class*="cart-receipt__view_courses"]`;
    }

    getBillingFullNameTxt() {
        return `[class*="cart-receipt__address_name"]`;
    }

    getBillingAddressStreetTxt() {
        return `[class*="cart-receipt__address_street"]`;
    }

    // [City], [Province Code] [Postal Code]
    getBillingAddressRegionTxt() {
        return `[class*="cart-receipt__address_region"]`;
    }

    getBillingEmailTxt() {
        return `[class*="cart-receipt__address_email"]`;
    }

//---------For E-Key verification in multi-seat guest purchases---------

    //Pass expected number of enrollment keys to verify
    //This counts the number of 'Key Name' labels
    getNumberOfEKeys(num) {
        cy.get('[class*="cart-receipt-module__key_term"]:contains("Key Name")').should('have.length', num)
    }

    getEKeyByIndex(tabIndex1, tabIndex2=1) {
        return `div:nth-of-type(${tabIndex1}) > div:nth-of-type(${tabIndex2}) > [class*="cart-receipt-module__key_name"]`
    }

}
