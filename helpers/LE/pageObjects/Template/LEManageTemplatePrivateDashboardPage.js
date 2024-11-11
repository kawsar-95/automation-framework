import LEBasePage from '../../LEBasePage'

export default new class LEManageTemplatePrivateDashboardPage extends LEBasePage {
    
    getManageTemplatePrivateDashContainerByNameThenClick(name) {
        cy.get('[class*="private-dashboard-settings-module__wrapper"] div',{timeout:15000}).contains(name).should('be.visible').click()
    }

    getToggleBtnToInheritSettingsOfParent () {
        return `input[class*="toggle-module__checkbox___r1NCJ toggle__checkbox"]` ;
    }

    getInheritSettingsModule () {
        return `[class*="inherit-settings-module__toggle_wrapper___"]` ;
    }

    getReturnToAdminTemplateBtn () {
        return `[class*="btn button-module__btn___svB4M"]`;
    }

}