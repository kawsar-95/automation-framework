import LEBasePage from '../../LEBasePage'

export default new class LECurrencySelection extends LEBasePage {

    getCurrencySelector() {
        return '*[class^="currency-selector-module__btn"]'
    }

    getCurrencySelectorModal() {
        return '*[class^="inline-modal-container-module__modal_container"]'
    }

    getEuroCurrencyButtonInModal() {
        return 'EUR Euro €'
    }

    getCanadianCurrencyButtonInModal() {
        return 'CAD Canadian Dollar $'
    }

    getSelectedCurrency() {
        return '*[class*="selected"][data-name="radio-button"]'
    }
    
    getCurrencyButtonByNameThenClick(name) {
        return cy.get('*[class^="currency-selector-modal-module__button_wrapper').contains(name).click()
    }

    getCoursesWithShoppingCartIcon() {
        return '*[class^="action-button-module__icon___hZHd0 icon icon-shopping-cart"]'
    }

    getShoppingCartIconFromNavBar() {
        return '*[class^="icon-button-module__btn___BQtJy header-module__btn___voeti header-module__shopping_cart_btn"]'
    }

    getViewShoppingCart() {
        return '*[class^="link-button-module__link___yIJIs shopping-cart-menu__shopping_cart_link btn"]'
    }

    getShoppingCartTotal() {
        return '*[class^="shopping-cart-total-module__item_value"]'
    }

    getWarningMessage() {
        return '*[class^="confirmation-modal-module__modal_container"]'
    }

    getOkFromWarningMessage() {
        return '*[class^="btn confirmation-modal-module__confirm_btn___sTw1M button-module__btn"]'
    }

    getCurrencyModal() {
        return '*[class^="inline-modal-container-module__modal_container"]'
    }

    getCurrencyModalSaveContainer() {
        return '*[class^="currency-selector-modal-module__button_wrapper'
    }

    getCoursePrices() {
        return '*[class^="action-button-module__container"]'
    }

    getProceedToCheckout() {
        return '[class^="btn cart-review-module__submit_btn___ns_ve cart-review_submit_btn button-module__btn"]'
    }

    getCheckoutLoginButton() {
        return '*[class^="btn cart-login-module__submit_btn"]'
    }

    getShoppingCartTotal() {
        return '*[class^="shopping-cart-total-module__item_value"]'
    }

    getHeaderButtons() {
        return '*[class^="header-module__menu___Yu7Uu header__menu"]'
    }

    getRemoveItemFromCheckoutButton() {
        return '*[class^="icon-button-module__btn___BQtJy shopping-cart-menu-item-module__remove_btn'
    }
}