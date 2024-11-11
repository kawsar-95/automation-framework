import ARBasePage from "../../../ARBasePage";

export default new class ARCourseSettingsAvailabilityModule extends ARBasePage {

    getAvailabilitySectionTitle() {
        return `[data-name="edit-curriculum-availability-section"] [data-name="header"]`
    }
    
    getAvailabilitySectionErrorMsg() {
        return '[data-name="edit-instructor-led-course-availability-section"] [class*="_errors"]'
    }

    getRadioBtnLabel() {
        return '[class*="_label"]'
    }

    //----- For Availability Section Radio Buttons -----//

    getAccessDateRadioBtn() {
        return '[data-name="accessDateType"] [data-name="label"]';
    }

    getAccessDateRadioButton(){
        return '[data-name="radio-button"][class*="_radio_button_6rnpz_1 _radio_1iwpg_6 radio_button"]';
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
        return '[aria-label="Expiration"] > [data-name="radio-button"]';
    }

    verifyExpirationRadioBtnByLabel(label){
        cy.get(this.getExpirationRadioBtn()).contains(label).siblings('input[type="radio"]').should('have.attr', 'aria-checked', 'true')
    }

    getDueDateRadioBtn() {
        return '[data-name="dueType"] [class="_label_6rnpz_32"]';
    }

    getTimezoneTxtByIndex(index=1) {
        return `[class*="_form_control"]:nth-of-type(${index}) [data-name="time-zone-message"]`;
    }

    //----- For Access Date Section -----//

    getAccessDateDatePickerBtn() {
        return '[data-name="accessDate"] [class*="icon icon-calendar"]';
    }

    getAccessDateTxtF() {
        return '[data-name="accessDate"] [class*="DateInput_input"]';
    }

    getAccessDateTimePickerBtn() {
        return '[data-name="accessDate"] [class*="icon icon-clock"]';
    }

    getAccessDateTimeZoneText() {
        return `[data-name="accessDate"] [data-name="time-zone-message"]`
    }


    //----- For Expiration Section -----//

    getExpireInYearsTxtF() {
        return '[name="expiryDuration-years"]';
    }

    getExpireInMonthsTxtF() {
        return '[name="expiryDuration-months"]';
    }

    getExpireInDaysTxtF() {
        return '[name="expiryDuration-days"]';
    }

    getDateExpiresDatePickerBtn() {
        return '[data-name="expiryDate"] [class*="icon icon-calendar"]';
    }

    getDateExpiresTimePickerBtn() {
        return '[data-name="expiryDate"] [class*="icon icon-clock"]';
    }

    getDateExpiresTxtF() {
        return '[data-name="expiryDate"] [class*="DateInput_input"]';
    }

    getDateExpiresPickerClearBtn() {
        return '[data-name="expiryDate"] [class*="SingleDatePickerInput_clearDate_svg__small"]';
    }

    getDateExpiresPickerErrorMsg() {
        return '[data-name="expiryDate"] [data-name*="error"]';
    }

    getExpirationTimeZoneText() {
        return `[data-name="expiryDate"] [data-name="time-zone-message"]`
    }


    //----- For Due Date Section -----//

    getDueDateDatePickerBtn() {
        return '[data-name="dueDate"] [class*="icon icon-calendar"]';
    }

    getDueDateTimePickerBtn() {
        return '[data-name="dueDate"] [class*="icon icon-clock"]';
    }

    getDueDateTxtF() {
        return '[data-name="dueDate"] [class*="DateInput_input"]';
    }

    getDueDateDatePickerClearBtn() {
        return '[data-name="dueDate"] [class*="SingleDatePickerInput_clearDate_svg__small"]';
    }

    getDueDateDatePickerErrorMsg() {
        return '[data-name="dueDate"] [data-name="error"]'
    }

    getDueInYearsTxtF() {
        // return '[data-name="dueDuration-years"] [class*="number-input-module__input"]';
        return '[class="_input_19krc_4"][aria-label="Years"][name="dueDuration-years"]'
    }

    getDueInMonthsTxtF() {
        // return '[data-name="dueDuration-months"] [class*="number-input-module__input"]';
        return '[class="_input_19krc_4"][aria-label="Months"][name="dueDuration-months"]'
    }

    getDueInDaysTxtF() {
        // return '[data-name="dueDuration-days"] [class="_input_19krc_4"]';
        return '[class="_input_19krc_4"][aria-label="Days"][name="dueDuration-days"]'
    }

    getDueDateTimeZoneText() {
        return `[data-name="dueDate"] [data-name="time-zone-message"]`
    }


    //----- For Availability Section Toggles -----//

    getAllowEnrollmentToggleContainer() {
        return "isLearnerEnrollmentEnabled";
    }

    getAllowEnrollmentToggleDescription() {
        return '[data-name="isLearnerEnrollmentEnabled"] > [data-name="control_wrapper"] > [class*="_description_"][data-name="description"]'
    }

    getAllowCourseContentToggleDescription(){
        return '[data-name="allowCourseContentDownload"] [data-name="description"]'
    }
    
    getAddPrerequisiteBtnTxt(){
        return '[data-name="add-prerequisite"] [class*="_content"]'
    }
    getNoPrerequisitesContainerDescription(){
        return '[data-name="no-prerequisites"]'
    }
    
    getProhibitLearnerToggleContainer() {
        return "isChangeOrCancelSessionsDisabled";
    }

    getAllowContentDownloadToggleContainer() {
        return "allowCourseContentDownload";
    }

    getAllowContentDownloadToggleDescription() {
        return '[data-name="allowCourseContentDownload"] [data-name="description"]'
    }
    
    
    //----- For Prerequisite Section -----//

    getNoPrerequisiteDescription() {
        cy.get('[class*="_no_prerequisites"]').should('contain', 'This course has no prerequisites.')
    }

    getAddPrerequisiteBtn() {
        return '[data-name="add-prerequisite"]'
    }

    getPrerequisiteNameTxt() {
        return this.getElementByDataNameAttribute("course-prerequisite") + ' ' + this.getElementByDataNameAttribute("name") +' ' + this.getTxtF();
    }

    getPrerequisiteNameErrorMsg() {
        return '[data-name="name"] [data-name="error"]'
    }

    getRequirementTypeRadioBtn() {
        return '[data-name="prerequisiteType"] [class*="_label_6rnpz_32"]'
    }

    getPrerequisiteCourseDDown() {
        return '[data-name="courseIds"] [data-name="field"]'
    }

    getPrerequisiteCourseSearchTxtF() {
        return '[data-name="courseIds"] [data-name="list-content"]'
    }

    getPrerequisiteCourseDDownItems() {
        return `[data-name="course-prerequisite"] [class="_label_ledtw_62"]`
    }

    getPrerequisiteCourseOpt(courseName) {
       cy.get(this.getPropertyNameDDownOpt(), { timeout:50000 }).should('be.visible').and('contain',`${courseName}`)
       cy.get(this.getPropertyNameDDownOpt()).contains(courseName).click()
    }

    getValidCertPrerequisiteCourseDDown() {
        return `[data-name="certificateCourseIds"] [data-name="field"]`
    }

    getValidCertPrerequisiteCourseSearchTxtF() {
        // return '[data-name="certificateCourseIds"] [class*="select-module__search"]'
        return '[name="certificateCourseIds"][data-name="input"]'
    }

    getClearAllBtn() {
        // return this.getElementByDataNameAttribute("courseIds") + ' ' + '[class*="deselect-all-button-module__clear"]'
        return '[data-name="courseIds"] [data-name="clear"]'
    }

    getCoursesErrorMsg() {
        return '[data-name="courseIds"] [class*="_error"]'
    }

    getCompletionTypeRadioBtn() {
        return '[data-name="completionType"] [data-name="label"]'
    }

    getRequiredCourseCountTxt() {
        return "Required Course Count";
    }

    getRequiredCourseCountErrorMsg() {
        return '[data-name="requiredCompletionNumber"] [class*="_error"]'
    }

    getDeletePrerequisiteByName(name) {
        cy.get(this.getElementByAriaLabelAttribute("Name")).should('have.value', name).parents('[class*="_prerequisite_outer_container"]').within(() => {
            cy.get('[class*="icon icon-trash"]').click()
        })
    }


    //----- For Competencies Section -----//

    getAddCompetenciesBtn() {
        return '[data-name="add-competency-object"] [class*="icon icon-plus"]'
    }

    getCompetencyName() {
        return "competency-group";
    }

    getDeleteCompetencyByName(name) {
        cy.get('[class*="_competency_label_y83lq_126"]').contains(name).parents('[class*="_competency_header_y83lq_121"]').within(() => {
            cy.get('button[title="Remove Competency"]').click()
        })
    }

    // -------------------------------------------------------------//
    // Added for the TC# C7332
    getTxtFPreOn() {
        return '[class*="_text_input_1c8rc_1"]'
    }
    
    getAddPrerequisiteButton() {
        return '[data-name="add-prerequisite"]'
    }

    getPrerequisiteNameTxtPreqOn() {
        return this.getElementByDataNameAttribute("course-prerequisite") + ' ' + this.getElementByDataNameAttribute("name") +' ' + this.getTxtFPreOn();
    }

    getValidCertPrerequisiteCourseSearchTxtInput() {
        return '[data-name="course-prerequisite"] [class*="_input_7teu8_86"]'
    }

    getValidCertPrerequisiteCourseDDownPreqOn() {
        return '[data-name="course-prerequisite"] [class*="_selection_4ffxm_8"]'
    }

    getAddCompetenciesButton() {
        return '[class*="_button_4zm37_1 _add_btn_y83lq_85"]'
    }

    getDialogTitle(){
        return '[data-name="dialog-title"]'
    }

    getModalFooterChooseBtn() {
        return '[class*="_child_1o8lk_11"] [data-name="submit"]'
    }

    getModalFooterCancelBtn() {
        return '[class="_child_1o8lk_11"] [data-name="cancel"]'
    } 

    getCompetencieSearchSelect() {
        return '[class="_search_input_16edj_27"]'
    }

    getCompetencieSearchSelectIteam() {
        return '[class="_list_tree_item_1jnlq_1"]'
    }

    getRemoveCompetency(){
        return 'button[aria-label="Delete Prerequisite"]'
    }

    getAvailabilityAccessDateRadioBtn() {
        return '[data-name="accessDateType"] [class*="_label_6rnpz_32"]';
    }
    getPerequisiteCourseContainer(){
        return '[class="_courses_container_y83lq_39"]'
    }
    getCertificateCourseIdContainer(){
        return '[data-name="certificateCourseIds"]'
    }
    getSelectDDown(){
        return '[class*="_field_7teu8_9 select_field"]'
    }

    // Added For #TC768
    getAllowEnrollmentContainer() {
        return `div[class='_form_control_o5kxr_1 _form_control_y83lq_5'] span[class='_label_xqxir_36']`
    }
    
    getAllowEnrollmentDescription() {
        return `div[class='_form_control_o5kxr_1 _form_control_y83lq_5'] div[class='_description_1qv7e_1 _description_o5kxr_17']`
    }

    getPrerequisiteContainer() {
        return '[class*="_prerequisite_outer_container_"]'
    }

    getCoursesContainer() {
        return '[class*="_courses_container_"]'
    }
}