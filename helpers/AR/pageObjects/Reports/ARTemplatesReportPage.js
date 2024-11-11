import ARBasePage from "../../ARBasePage";
import ARDashboardPage from "../Dashboard/ARDashboardPage";
import ARCouponsAddEditPage from "../E-commerce/Coupons/ARCouponsAddEditPage";
import ARDepartmentProgressReportPage from "./ARDepartmentProgressReportPage";

export default new class ARTemplatesReportPage extends ARBasePage {
    getTemplatesPage() {
        cy.get(ARDashboardPage.getMenuItem()).filter(`:contains("Templates")`).eq(1).click();
    }

    getTemplatesPageBtn() {
        cy.get(ARDashboardPage.getMenuItem()).contains("Templates").eq(1).click();
    }

    getSectionHeader() {
        return `[class="section-title"]`;
    }

    SearchAndSelectFunction(arrayElements) {
        cy.wrap(arrayElements).each((el) => {
            cy.get('#DepartmentId > div.select').click({ force: true })
            cy.wait(1000)
            cy.get(`[placeholder="Search"]`).clear().type(el)
            cy.wait(1000)
            cy.get(`[class="options"]`).filter(`:contains(${el})`).click();
        })


    }
    SearchAndSelectTemplatesFunction(arrayElements) {
        cy.wrap(arrayElements).each((el) => {
            cy.get('#DepartmentId > div.select').click({ force: true })
            cy.wait(1000)
            cy.get('a[class="caret"] [class="icon icon-caret-right"]').click()
            cy.wait(1000)
            cy.get(`[class="options"]`).contains(el).click({multiple:true});
        })
    }

    A5AddFilter(propertyName, Operator = null, Value = null) {
        cy.get(this.getA5AddFilterBtn()).click();
        cy.get(this.getA5PropertyNameDDown()).select(propertyName);
        cy.get(this.getA5OperatorDDown()).select(Operator);
        if (Value != null) {
            cy.get('[class="value-select"]').click()
            cy.get(`[placeholder="Search"]`).clear().type(Value)
            cy.wait(1000)
            cy.get(`[class="options"]`).filter(`:contains(${Value})`).click();
            cy.wait(1000)
        }
        cy.get(this.getA5SubmitAddFilterBtn()).click();

    }

    getTemplateEditbutton() {
        return '[class*="icon-pencil icon"]'
    }

    getTemplateDeletebutton() {
        return '[class*="icon-trash icon"]'
    }

    getTemplateDeselectButton() {
        return '[class*="icon-no icon"]'
    }

    getAddtemplateButton() {
        return `[href*="/Admin/Templates/Add"]`;
    }

    getCLearAllFiltersButton () {
        return `[class *="btn has-icon-only delete white clear-filters"]`;
    }

    
    getWarningBanner(){
        return `[class*="field highlight warning"]`
    }

    getExpandableContentToggleBtn() {
        return '[data-name="expandable-content-toggle-button"]'
    }

    getShowInactiveCoursesToggleCheckbox() {
        return '[name="showInactiveCourses"]'
    }

    getSaveProfileBtn() {
        return '[title="Save Profile"]'
    }

    getTemplateEditIcon() {
        return '[data-menu="Sidebar"] [class*="icon-pencil icon"]'
    }

    getInheritSettingsOfParentDepartmentCheckbox() {
        return '[aria-labelledby*="inheritSettingsLabel"]'
    }

    getProfileSettingsBlocker() {
        return '[class*="profile-settings__blocker"]'
    }

    getShowBadgesAndCompetenciesCheckbox() {
        return '[name="showBadgesAndCompetencies"]'
    }

    getShowCertificatesCheckbox() {
        return '[name="showCertificates"]'
    }

    getShowCoursesCheckbox() {
        return '[name="showCourses"]'
    }

    getSuccessMessage() {
        return '[class*="form-info-panel-module__success_message"]'
    }

    setCheckboxValue(value, element) {
        cy.wait(2000)
        cy.get(element).invoke('attr','value').then((status) =>{
            if(status === value){
                cy.get(element).should('have.attr', 'value', value)
            }
            else{
            cy.get(element).siblings('div').click()
                cy.wait(1000)
                cy.get(element).should('have.attr', 'value', value)
            }
        })
    }

    saveProfile() {
        cy.get(this.getSaveProfileBtn()).invoke('attr', 'disabled').then((value) => {
            if(value) {
                cy.get(this.getSaveProfileBtn()).should('have.attr', 'disabled')
            }
            else {
                cy.get(this.getSaveProfileBtn()).click()
                cy.get(this.getSuccessMessage()).should('have.text', 'Changes Saved.')
                this.getMediumWait()
            }
        })
    }
    deleteExistingTemplate(dept) {
        this.A5AddFilter('Department', 'Is Only', dept);
        cy.get(ARDepartmentProgressReportPage.getA5TableCellRecordByColumn()).then((element) => {
            if (cy.get(ARDepartmentProgressReportPage.getA5TableCellRecordByColumn()).contains(dept)) {
                cy.get(ARDepartmentProgressReportPage.getA5TableCellRecordByColumn(2 + parseInt([0]))).contains(dept).click()
                cy.get(ARCouponsAddEditPage.getSideBarContent()).within(function () {
                    cy.get(this.getTemplateDeletebutton()).click()   

            })
        }
        })

    }
}