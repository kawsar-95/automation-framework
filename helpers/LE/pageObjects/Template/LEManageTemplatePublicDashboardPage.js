import LEBasePage from '../../LEBasePage'

export default new class LEManageTemplatePublicDashboardPage extends LEBasePage {
    
    getEnablePublicDashboardToggle() {
        return `[class*="toggle__slider"]`;
    }

    getManageTemplatePublicDashContainerByNameThenClick(name) {
        return cy.get('[class*="public-dashboard-settings-module__wrapper"] div').contains(name).click()
    }

}

