import LEBasePage from '../../LEBasePage'
import LECurrencySelection from './LECurrencySelection';
import LEDashboardPage from '../Dashboard/LEDashboardPage';
import LEBuyOnBehalf from './LEBuyOnBehalf';

export default new class LEShoppingPage extends LEBasePage {

//This page is for the CART section

    getContinueShopping() {
        return `[class*="cart-review__back_btn"]`;
    }

    getCourseName() {
        return '[class*="cart-course-cell__name"]'
    }

    getTotalPrice() {
        return '[class*="cart-total__total_value"]'
    }

    //Only use if there is 1 course in cart
    getCourseQuantity(){
        return `[class*="cart-quantity-cell-module__quantity_input"]`;
    }

    //Only available if quantity has been updated - Only use if there is 1 course in cart
    getQuantityUpdateBtn(){
        return `[class*="icon icon-update"]`;
    }

    /*Updates the course quantity for a specified course - pass the name and desired quantity - use when multiple course are in cart.
    Note that when purchasing multi seat, updating the quantity of 1 course will update the quantities of all other courses in the cart
    To be the same */
    getUpdateCourseQuantityByName(name, quantity) {
        cy.get('[class*="cart-review-module__row"]').contains(name).parents('[class*="sortable-table-module__table_row"]').within(() => {
            cy.get('[class*="cart-quantity-cell-module__quantity_input"]').clear().type(quantity)
            cy.get('[class*="icon icon-update"]').click()
        })
    }

    getCouponCode(){
        return `[name="code"]`
    }

    //Only available if coupon code has been entered
    getApplyCouponCode(){
        return `[class*="btn coupon-input-module__submit_btn"]`;
    }

    getCheckoutBtn() {
        return `[class*="btn cart-review-module__submit_btn"]`;
    }

    //Used to verify coupon error messages - pass expected message
    getCouponErrorMsg(msg) {
        cy.get('[class*="coupon-input__error"]').should('contain.text', msg)
    }

    removeItemsFromShoppingCart(){
        cy.get(LECurrencySelection.getHeaderButtons()).then(($btn) => {
            if ($btn.text().includes('Shopping Cart')) {
                cy.get(LECurrencySelection.getShoppingCartIconFromNavBar()).click()
                cy.get(LECurrencySelection.getViewShoppingCart()).click()

                LEDashboardPage.getMediumWait()

                LEDashboardPage.getMediumWait()   
                // remove item from cart
                cy.get(LEBuyOnBehalf.getRemoveCourseFromCheckout()).click({ multiple: true })
                LEDashboardPage.getMediumWait()
            }
        })
    }

}
