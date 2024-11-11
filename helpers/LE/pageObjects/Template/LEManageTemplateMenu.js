import LEBasePage from '../../LEBasePage'

export default new class LEManageTemplateMenu extends LEBasePage {

    getManageTemplateMenuItemsByName(name) {
        return cy.get('[class*="tab-list-module__tabs"] div', {timeout: 30000}).contains(name)
    }

    getDepartmentName() {
        return `[class*="learner-management__department_name"]`;
    }

}