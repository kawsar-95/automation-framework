import LEBasePage from '../../LEBasePage'
import LEDashboardPage from '../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'

export default new class LEBuyOnBehalf extends LEBasePage {

    getRefreshButton() {
        return '*[class*="icon icon-update"]'
    }

    getRemoveCourseFromCheckout() {
        return '*[class^="icon icon-x-thin"]'
    }

    getOnBehalfOfOthersCheckBox() {
        return '[id="behalf_of_others_checkbox"]'
    }

    getCheckBox() {
        return '*[class^="checkbox-module__label"]'
    }

    getUpdateQuanitityButton() {
        return 'button[title="Update Quantity"]'
    }

    getDisabledUpdateQuanitityButton() {
    return'button[title="Update Quantity"][disabled]'
    }

    getCartQuantityInputBox() {
        return '*[class^="cart-quantity-cell-module__quantity_input"]'
    }

    getPreviousButton() {
        return '*[class^="cart-account-module__back"]'
    }

    turnByOnBehalfOff() {     
        cy.get(this.getOnBehalfOfOthersCheckBox()).invoke('attr', 'aria-checked').then(($box) => {
            cy.log($box)
            if($box == 'true'){
                cy.get(this.getCheckBox()).click()
                LEDashboardPage.getMediumWait()
            }
        })
    }
}
