import DataBasePage from "../../DataBasePage";

export default new class DataLeftSideMenu extends DataBasePage {

    getSubMenuItem() {
        return `[data-submenu]`
    }

    getSubMenuList() {
        return `[class*="subMenuGroup"] > ul > li > a`
    }

    getLeftMenuBtnThenClick(name) {
        cy.get(this.getSubMenuItem()).contains(name).click()
    }
    
    getSubMenuThenClick(name) {
        cy.get(this.getSubMenuList()).contains(name).click()
    }
}
