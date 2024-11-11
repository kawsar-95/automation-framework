import DataBasePage from "../../DataBasePage";

export default new class DataReportPagesNavigation extends DataBasePage {

    getDashboardsSubTab() {
        return `[class*="nav nav-tabs centered"] > li > a`
    }

    getDashboardsSubTabThenClick(name) {
        cy.get(this.getDashboardsSubTab()).contains(name).click()  
    }

    getAuditLogSubMenu() {
        return `[id="auditLogsMenu"]> ul > li > a`
    }

    getAuditLogSubMenuThenClick(name) {
        cy.get(this.getAuditLogSubMenu()).contains(name).click()
    }

    getAlfredSubMenu() {
        return `[id="alfredMenu"]> ul > li > a`
    }
    
    getAlfredSubMenuThenClick(name) {
        cy.get(this.getAlfredSubMenu()).contains(name).click()
    }


    getDashboardsCardTitle() {
        return `[class*="card-title"]`
    }

    getReportPageTitle() {
        return `[class*="page-title margin-bottom-10"]`
    }

    getFeatureFlagImpersonatePageTitle() {
        return `[class*="page-title"]`
    }

    getUserRestoreCancelBtn() {
        return `[class*="btn btn-default btn-branded full-width cancel"]`
    }

}
