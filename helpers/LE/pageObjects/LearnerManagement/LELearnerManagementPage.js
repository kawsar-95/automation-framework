import LEBasePage from "../../LEBasePage";
import LEManageTemplateCoursesPage from "../Template/LEManageTemplateCoursesPage";



export default new class LearnerManagementPage extends LEBasePage {

    getNavbarMenuItemByNameAndClick(name) {
      cy.get(this.getLearnerManagementTabList()).contains(name).click()
    }

    getLearnerManagementTabList() {
        return `nav[data-name="horizontal-tab-list"] [class*="horizontal-tab-list-module__tab___"]`
    }

    getExpandableContainer() {
        return `[class*='learner-management__expandable_content']`
    }

    getSocialProfileCheckbox() {
        return `[class*="social-profile-module__checkbox___"]`
    }

    getSocialProfileHeader() {
        return `[class*="my-settings-module__header"]`
    }

    getSettingsCheckBoxHeader() {
        return `[class*="my-settings-module__checkbox___"]`
    }

    getSettingsCheckBoxByname(name) {
        return cy.get(this.getSettingsCheckBoxHeader()).contains(name)
    }

    getCoursesCheckBox() {
        return `[class*="my-settings__courses_checkbox"]`
    }

    getCoursesCheckboxByName(name){
        return cy.get(this.getCoursesCheckBox()).contains(name)
    }

    getSaveBtn() {
        return `[class*="my-settings-module__button_container__"] button[class*="my-settings__save_btn button-module__btn___"]`
    }

    getGenericSettingsClass() {
        return `[class*="my-settings__"]`
    }

    getSettingsToggleByName(name, value) {
        cy.get(this.getGenericSettingsClass()).contains(name).find('input').invoke('attr','value').then((status)=>{
            
            if(status === value) {
                cy.get(this.getGenericSettingsClass()).contains(name).find('input').should('have.attr', 'value', value)
            }else {
                cy.get(this.getGenericSettingsClass()).contains(name).find('input').click({force:true})
                cy.get(this.getGenericSettingsClass()).contains(name).find('input').should('have.attr', 'value', value)
            }
        })
    }

    saveIfSettingsChanged () {
        cy.get(this.getSaveBtn()).invoke('attr', 'aria-disabled').then((status)=>{
            if (status === 'false') {
                cy.get(this.getSaveBtn()).click()
                cy.get(LEManageTemplateCoursesPage.getManageTemplateSuccessMessage(), { timeout: 1500000 }).should('be.visible').and('contain', 'Changes Saved.')
            }
        })
    }

}

export const SocialProfileOptions ={
    "Certificates" : "Certificates",
    "CompetenciesAndBadges" : "Competencies and Badges",
    "Courses" : "Courses"
}