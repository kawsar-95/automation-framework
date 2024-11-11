import BasePage from "../../../BasePage";

export default new class ReviewerTopRightMenu extends BasePage {
 
    
    getUserName() {
        return '[class*="main-menu-module__username"] [class*="main-menu-module__username"]';
    }


    getAdminExperienceBtn() {
        return '[class*="main-menu-item-module"] [role="link"]';
    }


    getLogOffBtn() {
        return '[class*="icon-logout-arrow"]';
    }


}