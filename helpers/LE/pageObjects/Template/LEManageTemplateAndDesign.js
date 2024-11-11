import LEBasePage from '../../LEBasePage'

export default new class LEManageTemplateAndDesign extends LEBasePage {

    getManageTemplateMenuItemsByName(name) {
        return cy.get('[class*="tab-list-module__tabs"] div', {timeout: 30000}).contains(name)
    }

    getDepartmentName() {
        return `[class*="learner-management__department_name"]`;
    }

    getMaxScreenWidthDDown() {
        return `[name*="dashboardWidthType"]`
    }

    getMaxScreenWidthDDownOpt(option) {
        return `[value*="${option}"]`
    }

    getCustomMaxWidthTxtF() {
        return `[name*="dashboardCustomWidth"]`
    }

    getBackgroundImageModuleLabelElement() {
        return `[class*="dashboard-advanced-module__label"]`
    }

    getBackgroundImageModuleContainer() {
        return `[class*="dashboard-advanced-module__section"]`
    }

    getBackgroundImageDisplayContainer() {
        return '[class*="dashboard-advanced__default_view_radio_buttons"]'
    }

}