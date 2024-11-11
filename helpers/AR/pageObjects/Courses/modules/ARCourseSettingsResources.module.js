import ARBasePage from "../../../ARBasePage";

export default new class ARCourseSettingsResourcesModule extends ARBasePage {

    getAllowSelfEnrollmentRadioBtn() {
        return 'form#selfEnrollmentAvailability [class*="radio-button-module__label"]';
    }
    getDeleteIconWithLabel() {
        return '#resources_section [class*="delete_button"]'
    }
    getCollapseMessageIcon() {
        return '#resources_section [class*="collapse_button"]'
    }
    getAddResourceBtn() {
        return '[data-name="add-resource"]'
    }

    /* set text in resource */
    setResourceTxtName(name) {
        return cy.get('#resources_section').find(this.getResourceNameTxtF()).type(name);
    }
    getResourceNameTxtF() {
      return '[data-name="course-resource"] [data-name="content"] [name="name"]'
    }
    getUrlRadioBtn() {
        return '[class="radio-button-module__radio_button--Wqshh source-select-module__radio--BTH72 radio_button"]';
    }
    getChooseFileBtn() {
        
        return '[data-name="file"] [data-name="select"]'
    }
    clickChooseFileBtn() {
        
        return cy.get('#resources_section').find(this.getChooseFileBtn()).click()
    }

    getResourceEditExpandBtn() {
        return '[data-name="visibility-toggle"]'
    }

    clickResourceEditExpandBtn() {
        return cy.get('#resources_section').find(this.getResourceEditExpandBtn()).click()
    }

    getResourceFileF() {
        return '[data-name="file"] [data-name="text-input"]'
    }
}