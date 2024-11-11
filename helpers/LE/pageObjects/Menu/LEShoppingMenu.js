import LEBasePage from '../../LEBasePage'

export default new class LEShoppingMenu extends LEBasePage {

    getViewShoppingCart() {
        return `[class*="shopping-cart-menu__shopping_cart_link"]`;
    }


}
