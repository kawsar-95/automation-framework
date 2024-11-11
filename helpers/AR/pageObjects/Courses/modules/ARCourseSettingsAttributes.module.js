import ARBasePage from "../../../ARBasePage";

export default new class ARCourseSettingsAttributesModule extends ARBasePage {
   
    getExpandAttributesBtn() {
        return this.getElementByAriaLabelAttribute("Expand Attributes")
    }
    getCollapseAttributeBtn(){
        return this.getElementByAriaLabelAttribute("Collapse Attributes")
    }
    getHideAttributesBtn(){
        return this.getElementByAriaLabelAttribute("Hide Attributes")
    }
    getEnableCourseEvalToggleContainer() {
        return "course-evaluation-settings";
    }

    getEnableCourseEvaluationlToggle() {
        return '[data-name="enableEvaluation"]'
    }

    getEvaluationRequiredToggle() {
        return '[data-name="requireEvaluation"]'
    }

    getAllowEvaluationAnyTimeToggle() {
        return '[data-name="allowEvaluationAnyTime"]'
    }
    
    getEnableCourseRatingToggleContainer(){
        return this.getElementByDataNameAttribute("courseRatingsEnabled")
    }

    getAttributeOptionLabels(){
        return '[data-name*="curriculum-attributes"] [class*="_label"]'
    }
    
    getEvalRequiredToggleContainer() {
        return "requireEvaluation";
    }

    getEvalAnyTimeToggleContainer() {
        return "allowEvaluationAnyTime";
    }

    getNoQuestionsMsg() {
        cy.get('[class*="course-evaluation-settings-module__message"]').should('contain', "No evaluation questions.")
    }

    getQuestionsContainer() { //All questions
        return '[data-name="course-evaluation-questions"]'
    }

    getQuestionContainer() {
        return '[class*="_drag_item"]'
    }

    getQuestionNumber() {
        return '[data-name="indicator"]'
    }

    getQuestionName() {
        return '[data-name="course-evaluation-question"] [class*="_name"]'
    }

    getQuestionTxtF() {
        return '[class*="_text_area"]'
    }

    getQuestionTypeDDown() {
        return '[data-name="selection"]'
    }

    getQuestionTypeDDownOpt() {
        return '[class*="_label"]'
    }

    getDeleteQuestionByName(name) {
        cy.get(this.getQuestionName()).contains(name).parents(this.getQuestionContainer()).within(() => {
            cy.get(this.getTrashBtn()).click()
        })
    }

    getAddEvalQuestionsBtn() {
        return this.getElementByDataNameAttribute("add-question") + ' ' + this.getPlusBtn()
    }
    
    getUseDefaultQuestionsBtn() {
        return this.getElementByDataNameAttribute("use-default-questions") + ' ' + this.getDblCheckBtn()
    }
    
    getAudienceTxtF() {
        return '[name="audience"]'
    }

    getGoalsTxtF() {
        return '[name="goals"]'
    }

    getExternalIdTxtF() {
        return '[name="externalId"]'
    }

    getVendorTxtF() {
        return '[name="vendor"]'
    }

    getCompanyCostTxtF() {
        return '[name="companyCost"]'
    }

    getLearnerCostTxtF() {
        return '[name="learnerCost"]'
    }

    getCompanyTimeTxtF() {
        return '[name="companyTime"]'
    }

    getlearnerTimeTxtF() {
        return '[name="learnerTime"]'
    }

    getErrorMsgByFieldDataName(name) {
        return `[data-name="${name}"] [data-name="error"]`
    }

    getEnableCourseEvaluationToggle(){
        return '[data-name="enableEvaluation"] [data-name="disable-label"]'
    }

    getEnableEvaluationRequiredToggle(){
        return '[data-name="requireEvaluation"] [data-name="disable-label"]'
    }

    getEvaluationCanbeTakenatAnyTimeToggle(){
        return '[data-name="allowEvaluationAnyTime"] [data-name="disable-label"]'
    }

    getDisableCourseRatingToggle() {
        return this.getEnableCourseRatingToggleContainer() + " " + this.getToggleDisabled()
    }

    // Added for the TC# C98583
    getCourseRatingsEnabledContainer() {
        return 'courseRatingsEnabled'
    }

    enableCourseRating() {
        cy.get(this.getEnableCourseRatingToggleContainer() + ' ' + this.getToggleDisabled()).invoke('text').then((onOrOff) => {
            if (onOrOff === 'Off') {
                cy.get(this.getEnableCourseRatingToggleContainer() + " " + this.getToggleDisabled()).click()
            }
        }) 
    }

    getMatchedCoursesWithTagMessageContainer() {
        return '[class*="_notification_bbc1v"] div[aria-label="Notification"]'
    }
}