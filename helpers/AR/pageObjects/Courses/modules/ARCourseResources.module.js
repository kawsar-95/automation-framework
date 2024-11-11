import ARBasePage from "../../../ARBasePage";

export default new class ARCourseResourcesModule extends ARBasePage {

    //-------------- Select Course Resource -----------------//


    getNameTxt() {
        return '[data-name="content"] [data-name="name"] [name="name"]';
    }
    getResourceBtn(){
        return '[data-name="add-resource"]';    
    }
    
    getAvailabilitySectionErrorMsg() {
        return '[data-name="edit-instructor-led-course-availability-section"] [data-name="error"]'
    }

    getRadioBtnLabel() {
        return '[class*="radio-button-module__label"]'
    }

    //----- For Radio Section Buttons -----//

    getSelectFileBtnOption() {
        return '[data-name="radio-button"] [data-name="radio-button-File"]'
      }

    getCourseResourcesChooseFileBtn() {
        return '[data-name="source"] [class*="icon icon-folder-small"]'
    }

    getAccessDateRadioBtn() {
        return '[data-name="accessDateType"] [class*="radio-button-module__label"]';
    }
    
    getDefaultAccessDateRadioBtn(noAccessRadioBtn) {
        cy.get(this.getElementByDataNameAttribute("accessDateType")).children().find(this.getRadioBtnLabel()).contains(noAccessRadioBtn).parent().find('input').should('be.checked')
    }

    getDefaultExpirationeRadioBtn(noExpirationRadioBtn) {
        cy.get(this.getElementByDataNameAttribute("expiryType")).children().find(this.getRadioBtnLabel()).contains(noExpirationRadioBtn).parent().find('input').should('be.checked')
    }
    getDefaultDueDateeRadioBtn(noDueDateRadioBtn) {
        cy.get(this.getElementByDataNameAttribute("dueType")).children().find(this.getRadioBtnLabel()).contains(noDueDateRadioBtn).parent().find('input').should('be.checked')
    }
    getExpirationRadioBtn() {
        return '[data-name="expiryType"] [class*="radio-button-module__label"]';
    }
    
    getExpirationRadioBtn() {
        return '[data-name="expiryType"] [class*="radio-button-module__label"]';
    }

    getDueDateRadioBtn() {
        return '[data-name="dueType"] [class*="radio-button-module__label"]';
    }

    getTimezoneTxtByIndex(index=1) {
        return `#onlineCourseEnrollmentAvailability [class*="course-availability-module__form_control"]:nth-of-type(${index}) [class*="date-time-input-module__time_zone_message"]`;
    }







    
   

    // -------------------------------------------------------------//

}