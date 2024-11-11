import ARBasePage from "../../../ARBasePage";

export default new class ARCourseSettingsCourseAdministratorsModule extends ARBasePage {
    
    getDisabledCourseVisibilityAllAdminRadioBtn() {
        return '[aria-label="Course Visibility"] input[data-name="radio-button-AllAdmins"][aria-disabled="true"]'
    }
    
    getCourseVisibilityRadioBtn() {
        return '[data-name="radio-button"]'
    }

    getDepartmentDDownF(){
        return '[aria-label="Department 1 of 1"] [data-name="department-input"]'

    }

    getDepartmentVisibilityAddRuleBtn() {
        return '[data-name="add-rule"] [class*="icon icon-plus"]'
    }
    
    getCourseVisibilityTogggleDescription(){
        return this.getElementByDataNameAttribute("adminVisibilityType")
    }
    
    getAdditionalAdminEditorContainer(){
        return this.getElementByDataNameAttribute("editorIds")
    }
    getRadioBtnLabel() {
        return '[class*="_label"]'
    }

    getVisibilityRuleSelectDepartmentBtn() {
        return '[data-name="department-availability-rule"] [class*="icon icon-flowchart"]'
    }

    getDefaultCourseVisibilityeRadioBtn(allAdminRadioBtn) {
        cy.get(this.getElementByDataNameAttribute("adminVisibilityType")).children().find(this.getRadioBtnLabel()).contains(allAdminRadioBtn).parent().find('input').should('be.checked')
    }

    getVisibilityRuleDepartmentTxtF() {
        return '[data-name="department-availability-rule"] [class*="department-select-module__input"]'
    }

    getDeleteVisibilityRuleByDepartmentName(name) {
        cy.get('[data-name="department-availability-rule"] [class*="department-select-module__input"]').should('have.value', name)
            .parents('[class*="department-availability-predicate-module__content"]').within(() => {
                cy.get('[class*="icon icon-trash"]').click()
            })
    }

    getSelectPrimaryDepartmentEditorBtn() {
        return '[data-name="department-select"] [class*="icon icon-flowchart"]'
    }

    getPrimaryDepartmentEditor() {
        return '[data-name="department-select"] [class*="department-select-module__input"]'
    }

    getPrimaryDepartmentEditorBtnTxt(){
        return '[data-name="department-select"] [class*="department_button"]'
    }

    getNoDepartmentDescription(){
        return '#department-select-description'
    }

    getPrimaryDepartmentEditorDDown() {
        return '[data-name="predicates"] [class*="select-field-module__selection"]'
    }
    
    getCourseVisibilityTogggleDescription(){
        return this.getElementByDataNameAttribute("adminVisibilityType")
    }

    getPrimaryDepartmentEditorOpt() {
        return '[class*="select-option-module__label"]'
    }

    getAdditionalAdminEditorsDDown() {
        return '[data-name="editorIds"] [data-name="field"]'
    }

    getAdditionalAdminEditorsSearchTxtF() {
        return '[data-name="editorIds"] [data-name="input"]'
    }

    getAdditionalAdminEditorsOpt() {
        return '[data-name="editorIds"] [class*="_select_option_"]'
    }

    getPrimaryDepartmentEditorChildrenDDown() {
        return '[class*="_department_editor"] [data-name="selection"]'
    }

    getPrimaryDepartmentEditorChildrenDDownOpt() {
        return '[aria-label="Primary Department Editor Children"] [class*="_label"]'
    }
   
   
    getPrimaryDepartmentEditorChildren() {
        return '[name="department-children-select"]'
    }

    getPrimaryDepartmentEditorChildren() {
        return '[name="department-children-select"]'
    }

    // Added for the TC# C98583
    addTag(tagName) {
        cy.get('div[data-name="courseTagIds"]').within(() => {
            cy.get('[class="icon icon-arrows-up-down"]').click()
            cy.get('input[data-name="input"]').type(tagName)
            cy.get('[class*="_select_option_ledtw_"]').contains(tagName).click()
        })
    }

}

