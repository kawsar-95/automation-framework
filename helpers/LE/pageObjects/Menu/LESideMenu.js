import LEBasePage from '../../LEBasePage'

export default new class LESideMenu extends LEBasePage {

    //Scrollable element to see side menu items lower down
    getSideMenu() {
        return `[class*="menu__menu"]`
    }

    openSideMenu() {
        return cy.get('[data-name="nav-menu-button"]').click()
    }

    getLEMenuItemsByName(name) {
        return cy.get('[class*="navigation-menu-module__navigation_menu"] li').contains(name)
    }
        
    getLEMenuItemsByNameThenClick(name) {
        this.getShortWait()
        cy.get('[class*="navigation-menu-module__navigation_menu"] li').contains(name).should('be.visible')
        this.getShortWait()
        cy.get('[class*="navigation-menu-module__navigation_menu"] li').contains(name).click()
    }

    getAdminMenuItem() {
        return `[class*="icon icon-admin-gear navigation"]`
    }

}
