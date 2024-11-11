import BasePage from "../../../BasePage";

export default new class ReviewerTopToolbar extends BasePage {
    

    getBackBtn() {
        return '[class*="header-button-module__text"]';
    }


    getMenuBtn() {
        return '[data-name="header-menu-button-icon"]';
    }


    getCloseBtn() {
        return '[class*="icon-x-rounded"]';
    }


}