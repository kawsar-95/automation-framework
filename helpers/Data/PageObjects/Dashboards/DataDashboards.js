import DataBasePage from "../../DataBasePage"

export default new class DataDashboards extends DataBasePage {

    getUserProfile() {
        return `[class*="user-info"]`
    }

    getDashBoardTabItem() {
        return `[class*="nav nav-tabs centered"] > li > a`
    }
    
    getDashBoardsTab(name) {
        cy.get(this.getDashBoardTabItem()).contains(name).click()
    }
}
