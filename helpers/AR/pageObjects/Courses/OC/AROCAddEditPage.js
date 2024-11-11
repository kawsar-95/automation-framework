import arBasePage from "../../../ARBasePage"
import ARUnsavedChangesModal from "../../Modals/ARUnsavedChangesModal"

export default new class AROCAddEditPage extends arBasePage {

    getGeneralSectionErrorMsg() {
        return '[data-name="error"]'
    }

    getGeneralStatusToggleContainer() {
        return '#courseStatus '
    }

    getGeneralTitleTxtF() {
        return 'input[aria-label="Title"]'
    }

    getErrorMsg() {
        return this.getElementByDataNameAttribute("error")
    }
    getRequiredInRedColor() {
        return this.getElementByDataNameAttribute("name") + ' ' + this.getElementByDataNameAttribute("required");
    }
    getRequiredInRedColorForChapter() {
        return this.getElementByDataNameAttribute("chapters") + ' ' + this.getElementByDataNameAttribute("required");
    }
    getSyllabusRadioButtonLabel() {
        return this.getElementByDataNameAttribute("completionType") + ' ' + this.getElementByDataNameAttribute("radio-button");
    }

    getProctorLabelRadioBtns() {
        return '[class="_form_control_o5kxr_1 _form_control_1qq6a_7"] [data-name="label"]'
    }

    getProctorRadioButtonLabelByName(name) {
        cy.get(this.getProctorLabelRadioBtns()).contains(name).click({ force: true })
    }

    getGeneralLabels() {
        return this.getElementByAriaLabelAttribute("General")
    }

    getGeneralTitleErrorMsg() {
        return '[data-name="error"]'
    }

    getGeneralDescriptionErrorMsg() {
        return '[data-name="error"]'
    }

    getGeneralTagsDDown() {
        return '[data-name="courseTagIds"] [class*="select-module__placeholder"]'
    }

    getGeneralTagsSearchF() {
        return 'input[aria-label="Tags"]'
    }

    getGeneralTagsDDownOpt() {
        return '[class*="select-option-module__select_option"]'
    }

    getProctorSelectionDDown() {
        return '[data-name="userIds"] [data-name="field"]'
    }

    getProctorEnterEmail() {
        return '[name*="userIds"]'
    }

    getProctorSelectionDDownOpt() {
        return '[class*="user-select-option-module__user_name_email"]'
    }

    getChapterContainer() {
        return '[data-name="chapter"]'
    }

    getChapterTitle() {
       return `[data-name="chapter"] [data-name="name"]`
    }

    //Use .eq(index) with this if adding more than 1 chapter. (ex. getChapterNameTxtF.eq(0) for first item)
    getChapterNameTxtF() {
        return '[aria-label="Chapter Name"]'
    }

    getChapterNameErrorMsg() {
        return '[data-name="error"]'
    }

    getDeleteChapterBtn() {
        return this.getTrashBtn()
    }

    getAddChapterBtn() {
        return '[data-name="add-chapter"] [class*="icon-plus"]'
    }

    getAddLearningObjectBtn() {
        return '[data-name="add_learning_object"]'
    }

    getDeleteLessonBtn(){
        return '[title="Delete Lesson"]';
    }

    getDeleteLessonConfirm(){
        return '[class*="_content_4zm37_17"]';
    }

    getSharedLearningObjectTxt() {
        return '[class*="lesson-module__shared"]'
    }

    getSyllabusShowTermsAndConditionToggle() {
        return '[data-name="isDisplayedToLearner"] [data-name="disable-label"]'
    }

    getSyllabusMobileDeviceAlertToggle() {
        // return '[data-name="mobileDeviceAlert"] [class*="toggle-module__label"]' //keeping old call in case it's needed
        return '[data-name="mobileDeviceAlert"]'
    }

    getSyllabusProctorToggle() {
        return '[id="form-control-undefined-8"] [data-name="toggle-button"] '
    }

    getNoLearningObjectMsg() {
        return '[data-name="no_lessons"]'
    }

    getLearningObjectName() {
        return '[data-name="lessons"] [data-name="name"]'
    }

    getEditBtnByLessonNameThenClick(name) {
        cy.get('[class="_name_mxruv_7"]').contains(name).parents('[data-name*="list-item"]').within(() => {
            cy.get(this.getPencilBtn()).click()
        })
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getDeleteBtnByLessonNameThenClick(name) {
        cy.get('[data-name="lessons"] [data-name="name"]').contains(name).parent().parent().within(() => {
            cy.get(this.getTrashBtn()).click()
        })
    }

    getSelfEnrollmentSpecificUserDDown() {
        return '[data-name="course-enrollment"] [data-name="userIds"] [data-name="field"]'
    }

    getSelfEnrollmentSpecificUserDDownTxtF() {
        return 'input[name="userIds"]'
    }
    getSelfEnrollmentSpecificListItem() {
        return '[aria-label="Users"] [class*="_select_option_"]'
    }

    getResourceContainer() {
        return `[data-name="name"]`
    }

    getDeleteResourceBtn() {
        return `[class*="icon icon-trash"]`
    }

    getDeleteResourceBtnByNameThenClick(name) {
        cy.get(this.getResourcesModalContainer()).within(()=>{
           cy.get(this.getResourceContainer()).contains(name).parent().within(() => {
              cy.get(this.getDeleteResourceBtn()).click()
           })
        })
    }

    getAddEditSection() {
        return '[class*="edit_context_menu"]'
    }

    // Added for TC # 
    getActionBtnByLabel() {
        return '[class*="_content"]'
    }

    getPlusIcon() {
        return `[class*="icon-plus"]`
    }

    getTitleRequired() {
        return '[data-name="edit-online-course-general"] [data-name="name"] [class*="_label_"]'
    }

    getChapterNameRequired() {
        return '[data-name="chapter"] [data-name="name"] [class*="_label_"]'
    }

    getGeneralStatusText() {
        return '[data-name="description"]'
    }

    getEcommerceDescriptionField() {
        return this.getElementByDataNameAttribute("ecommerce_form")
    }

    // Added for TC# 2070
    getTagValue() {
        return `[data-name="courseTagIds"]`
    }

    getDisabledPublishBtn() {
        //return `button[data-name="submit"]`
        return `button[data-name="submit"][aria-disabled="true"]`
    }

    getDisableQuickPublishBtn() {
        return `button[data-name="quick-save"][aria-disabled="true"]`
    }

    // Added for the TC# C2039
    getDeleteCourseButton() {
        return 'delete-course-context-button'
    }
    getAddMoreSettingsContainer() {
        return '[class*="_settings_1yq4o_1"]'
    }
    getAddMoreSettingsButtonContainer() {
        return '[class*="_button_container_1g00a_1"]'
    }
    getAddMoreSettingsBtn() {
        return `${this.getAddMoreSettingsContainer()} > ${this.getAddMoreSettingsButtonContainer()} > button`
    }
    getAddMoreSettingsBtnEnableStyle() {
        return '_button_1g00a_1 _enabled_1g00a_41'
    }
    getAddMoreSettingsBtnEnableDotStyle() {
        return '_button_1g00a_1 _enabled_1g00a_41 _dot_1g00a_30'
    }
    getAddMoreSettingsBtnDisableDotStyle() {
        return '_button_1g00a_1 _dot_1g00a_30'
    }
    getChapterContainerHeader() {
        return '[class*="_header_dllxz_1 _expanded_dllxz_23"]'
    }
    getChapterContainerDeleteBtn() {
        return `${this.getChapterContainer()} > div > ${this.getChapterContainerHeader()} > button[aria-label="Delete"]`
    }
    getDeleteChapterModalContainer() {
        return '[data-name="delete-chapter-prompt"]'
    }
    getDeleteChapterModalDeleteBtn() {
        return `${this.getDeleteChapterModalContainer()} > div > div[data-name="prompt-footer"] > div > button[data-name="confirm"]`
    }

    getCoursesTagsByDataName() {
        return `[data-name ="courseTagIds"]`
    }

    getTagsDropdownByDataName() {
        return `[data-name="field"]`
    }

    getTagsInputFieldByDataName() {
        return `[data-name="input"]`
    }

    getLearningObjectPreviewBtn() {
        return `[data-name="preview"]`
    }

    getGenaralRadioBtn() {
        return `[class="_label_6rnpz_32"]`
    }

    getResourcesModalContainer() {
        return `[data-name="edit-online-course-resources-section"]`
    }

    getTermsAndConditionBtn() {
        return '[data-name="isDisplayedToLearner"] [data-name="toggle-button"]'
    }

    getClearGeneralLanguageInput() {
        return '[data-name="languageCode"] [data-name="clear"]'
    }

    // Added for the TC# 
    getCourseSettingsAvailabilityBtn() {
        return '[class="_button_container_8vfwm_1"] > button[title="Availability"]'
    }
    
    getCourseSettingsCompletionBtn() {
        return '[class="_button_container_8vfwm_1"] > button[title="Completion"]'
    }
    
    getCourseSettingsByCatalogVisibilityBtn() {
        return '[class="_button_container_8vfwm_1"] > button[title="Catalog Visibility"]'
    }
    
    getAddPosterBtn() {
        return '[data-name="posters"] [data-name="add-poster"]'
    }

    getCourseIsActiveToggle() {
        return 'isActive'
    }

    getEditLessonObjectBtn() {
        return 'button[data-name="edit"]'
    }
    
    getCompletionType() {
        return `[data-name="completionType"]`
    }

    cancelPublish() {
         cy.get(this.getCancelBtn()).click()
         cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
         cy.get(ARUnsavedChangesModal.getOKBtn()).click()
         cy.get(ARUnsavedChangesModal.getOKBtn()).should('not.exist')
         cy.get(this.getToastSuccessMsg(), {timeout: 15000}).should('not.exist')
    }
}

// Added for TC # C4945. However, other test automation scripts may find it useful
// Long and/or re-used messages/warnings to be used in assertions while testing a create/edit course page
export const coursePageMessages = {
    "INACTIVE_COURSE_VISIBILITY_WARNING": "Your course will not be visible to your learners if this is set to 'Inactive'.",
    "AUTO_GENERATED_TAG_MESSAGE": "Automatically generate tags based on course content. These tags are marked with an asterisk (*).",
    "ACCEPT_TEMRS_N_CONDITION_MESSAGE": "User must accept terms & conditions to gain access to the course.",
    "PROCTOR_TOGGLE_STATUS_MESSAGE": "Turning this option 'on' will proctor weighted Absorb assessments.",
    "FAILURE_TOGGLE_WARNNG_MESSAGE": "Enabling this will allow the course to be marked as failed if a learner does not achieve a passing grade.",
    "UPLOAD_INSTRUCTION": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "COURSE_ENROLLMENT_REQUIRES_PREREQUISITES": "Learners will not be able to enroll in this course until all prerequisites are met.",
    "COURSE_INTAKE_REQUIRES_PREREQUISITES": "Learners will be allowed to enroll in the course, but will be unable to take it until all prerequisites are met."
}

export const errorMessage = {
    "syllabus_error_msg":`A course with completion type "Exams Only" must contain at least one weighted assessmen`
}

