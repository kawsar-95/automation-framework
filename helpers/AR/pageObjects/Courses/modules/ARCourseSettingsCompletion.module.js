import ARBasePage from "../../../ARBasePage";

export default new class ARCourseSettingsCompletionModule extends ARBasePage {

   getCompletionSectionErrorMsg() {
    return '[class*="_errors"] [data-name="error"]'
   }
   
   getDescription(){
    return '[class*="_description"]'
   }

   //Need to use this in some cases (ex. in Online Course as the Proctor and Certificate toggles have the same data-name attr.)
   getToggleByNameThenClick(name) {
    cy.get('[data-name="label"]').contains(name).parent().siblings('[data-name="control_wrapper"]').within(() => {
        cy.get('[data-name="toggle"]').click()
    })
   }

   getCertificateToggle(){
    return '[data-name="course-certificate-and-re-enrollment"] [data-name="isEnabled"] [data-name="toggle"] [data-name="toggle-button"]  [data-name="disable-label"]'
   }

   getCertificateTypeRadioButton(name){
       return cy.get(`[data-name="course-certificate-and-re-enrollment"] [data-name="radio-button"]`).contains(name)
    }

   getToggleByNameAndVerify(name) {
    cy.get(this.getLabelNames()).contains(name).parent('div').parent('div').within(() => {    
        cy.get('[data-name="disable-label"]').should('have.text','Off')
    })
   }

   getLabelNames(){
    return '[data-name="label"]'
   }

   getToggleByNameAndVerifyToggleStatus(name) {
    cy.get('[class*="_label"]').contains(name).parents('[class*="_form_control"]').within(() => {
        cy.get('[class*="_description"]').should('have.text', 'Learners receive certificate upon completion')
    })
   }

   getHelperTextF(){
    return '[class="_description_1qv7e_1 _description_o5kxr_17"]'
   };

   getPostEnrollmntSection(){
    return '[class="_form_control_o5kxr_1 _form_control_1xmvc_8"]';
   }
   
   getverifyHelperTxt(text) {
    cy.get(this.getHelperTextF()).contains(text).parents(this.getPostEnrollmntSection())
    .should('exist')
   };

   getToggleByNameAndVerifyAllowReEnrollment(name) {
    cy.get('[class*="_label"]').contains(name).parents('[class*="_form_control"]').within(() => {
        cy.get('[class*="_description"]').should('have.text', 'Allows the learner to re-enroll or re-certify in this course')
    })
   }
   
    //----- For the Certificate Section -----//

    getCertificateToggleContainer() {
        return "isEnabled";
    }

    getCertificateFileByName(name) {
        return `${name}`
    }

    getCertificateSectionDataName() {
        return "edit-instructor-led-course-completion-section"
    }

    getSelectFileBtnOption() {
        return '[aria-label="Certificate"] [data-name="radio-group"] > [data-name="radio-button"] [data-name="radio-button-File"]'
      }
 
    getCertificateSourceRadioBtn() {
        return '[aria-label="Certificate"]' 
    }

    getCertificateChooseFileBtn() {
        return '[data-name="source"] [class*="icon icon-folder-small"]'
    }

    getCertificateFileF() {
          return '[data-name="source"] [data-name="text-input"]'
    }

    getCertificateFileUrlTxtF() {
        return '[data-name="source"] [class*="_text_input"]'
    }

    getCertificateFileErrorMsg() {
        return '[data-name="source"] [class*="_error"]'
    }

    getCustomTitleToggleContainer() {
        return "allowCustomTitle";
    }

    getCustomTitleTxtF() {
        return '[data-name="customTitle"] [class*="_text_input"]'
    }

    getCustomTitleErrorMsg() {
        return '[data-name="customTitle"] [class*="_error"]'
    }

    getCustomNotesTxtF() {
        return '[data-name="course-certificate-and-re-enrollment"] [name="notes"]'
    }

    getExpiryRadioBtn() {
        return '[data-name="expireType"] [class*="_label"]'
    }

    getExpireYearsTxtF() {
        return '[name="expiryDuration-years"]'
    }

    getExpireMonthsTxtF() {
        return '[name="expiryDuration-months"]'
    }

    getExpireDaysTxtF() {
        return '[name="expiryDuration-days"]'
    }

    getExpiryDatePickerBtn() {
        return '[data-name="expiryDate"] [class*="icon icon-calendar"]'
    }

    getAddCertificateUploadBtn() {
        return 'button[data-name="add-certificate-upload"]'
    }

    getCertificateLabelTxtF() {
        return this.getElementByDataNameAttribute("certificateUploadLabel") + ' ' + this.getTxtF()
    }

    getCertificateApprovalRadioBtn() {
        return this.getElementByDataNameAttribute("certificateApprovalType") + ' ' + this.getElementByDataNameAttribute("radio-button")
    }

    getReviewersNotesTxtF() {
        return this.getElementByDataNameAttribute("certificateReviewersNotes") + ' ' + 'textarea[name="certificateReviewersNotes"]'
    }

    getEditUploadInstructionsBtn() {
        return '[class*="course-certificate-and-re-enrollment-module__edit_upload_instructions"]'
    }


    //----- For the Allow Re-enrollment Section -----//

    getAllowReEnrollmentToggleContainer() {
        return "allowReEnrollment";
    }

    getAllowReEnrollmentRadioBtn() {
        return '[data-name="reEnrollmentType"] [class*="_label"]'
    }

    getDurationYearsTxtF() {
        return '[name="reEnrollmentDuration-years"]'
    }

    getDurationYearsErrorMsg() {
        return '[data-name="reEnrollmentDuration-years"] [class*="_error"]'
    }

    getDurationMonthsTxtF() {
        return '[name="reEnrollmentDuration-months"]'
    }

    getDurationMonthsErrorMsg() {
        return '[data-name="reEnrollmentDuration-months"] [class*="_error"]'
    }

    getDurationDaysTxtF() {
        return '[name="reEnrollmentDuration-days"]'
    }

    getDurationDaysErrorMsg() {
        return '[data-name="reEnrollmentDuration-days"] [class*="_error"]'
    }

    getReEnrollAutomaticallyToggleContainer() {
        return 'allowAutomaticReEnrollment'
    }


    //----- For the Competencies Section -----//

    getAddCompetencyBtn() {
        return '[data-name="add-course-competency"] [class*="icon icon-plus"]'
    }

    getAddCompetencyBtnTxt() {
        return '[data-name="add-course-competency"] [class*="_content"]'
    }

    getNoCourseCompetencyDescription(){
        return this.getElementByDataNameAttribute("course-competencies")
    }
   
    getAddCreditBtn(){
        return '[class*="credit_type"] [class="_content_4zm37_17"]'
    }

    getAddPostEnrollmentButton(){
        return this.getElementByDataNameAttribute("add-post-enrollment")
    }

    getPostEnrollmentsTxtDescription(){
        return this.getElementByDataNameAttribute("post-enrollments")
    }
    getHelperTxtF() {
        return 'div[class*="highlight cell"]'
    }
    
    getCompetencyDDownThenClick() {
        cy.get('[class*="_label"]').contains('Competency').parents('[class*="_select"]').within(() => {
            cy.get('[class*="icon icon-arrows-up-down"]').click()
        })
    }

    getCompetencyDDown() {
        return cy.get('[class*="_label"]').contains('Competency').parents('[class*="_select"]')
    }
    
    getCompetencySearchTxtF(text) {
        cy.get('[class*="_label"]').contains('Competency').parents('[class*="_select"]').within(() => {
                cy.get('[class*="_input"]').clear().type(text)
        })
    }

    getCompetencyOpt(label) {
        cy.get('[aria-label="Competency"] [class*="_label"]').contains(label).click()
    }

    getCompetencyLevelDDownThenClick() {
        cy.get('[class*="_label"]').contains('Level').parents('[class*="_select"]').within(() => {
            cy.get('[class*="icon icon-arrows-up-down"]').click()
        })
    }

    getCompetencyLevelDDown() {
        return cy.get('[class*="_label"]').contains('Level').parents('[class*="_select"]')
    }

    getCompetencyLevelOpt(level) {
       const comName = cy.get('[role="option"] > [class*="_select_option"]').contains(level);
       cy.get('[aria-label="Level"] > [role="option"] > [class*="_select_option"]').contains(level).click()
    }


    //----- These functions are for adding a credit to a course -----//
    
    // getAddCreditBtn() {
    //     return '[class*="course-multi-credits-module__add_credit_type"]'
    // }
    
    getNoCreditCompletionDescription(){
        return this.getElementByDataNameAttribute("course-multi-credits")
    }
    
    getCreditContainer() {
        return '[class*="_credit_item"]'
    }

    getCreditContainerLabel() {
        return '[data-name="course-multi-credits"] [data-name="name"]'
    }

    getCreditTypeDDown() {
        return '[data-name*="credit-type-select"] [data-name="selection"]'
    }

    getCreditTypeSearchF() {
        return 'input[aria-label="Credit Type"]'
    }

    getAllCreditTypeSelections(){
        return '[data-name*="credit-type-select"]'
    }

    //This is the replacement function for getCreditTypeOpt()) used in conjuction with getAllCreditTypeSelections()
    getAllCreditTypeOptions(){
        return '[aria-label="Credit Type"] [class*="_label"]'
    }

    getAllCreditTypeOptionsContainer() {
        return 'ul[aria-label="Credit Type"]'
    }

    getEditCreditBtn() {
        return '[aria-label="Expand"] [class*="icon icon-pencil"]'
    }

    getDeleteCreditBtn() {
        return '[class*="icon icon-trash"]'
    }

    getCreditAmountTxt() {
        return "Amount Awarded";
    }

    getCreditAmountErrorMsg() {
        return '[data-name*="credits-"] [data-name="error"]'
    }

    getAddVariableCreditRuleBtn() {
        return '[data-name="add-rule"] [class*="icon icon-plus"]'
    }

    getVariableCreditFieldDDown() {
        return '[data-name="availability-rule-item"] [data-name="selection"]'
    }

    getVariableCreditFieldOpt() {
        return '[class*="_label"]'
    }

    getVariableCreditTxtF() {
        return '[data-name="availability-rule-item"] [class*="_text_input"]'
    }

    getVariableCreditAmountTxt() {
        return "Amount Awarded";
    }

    getVariableCreditAmountErrorMsg() {
        return '[class*="course-multi-credit-availability-module__form_control"] [class*="_error"]'
    }


    //----- For the Allow Failure Section -----//

    getAllowFailureToggleContainer() {
        return "allowFailure";
    }

    getAllowReEnrollmentOnFailureToggleContainer() {
        return "allowSelfReEnrollAfterFailure";
    }

    getAllowReEnrollmentToggleContainer() {
        return "allowReEnrollment";
    }

    //Allow Re-enrollment on Failure sections
    getAllowReEnrollmentYearsTxtF() {
        return '[name="selfReEnrollmentDuration-years"]'
    }

    getAllowReEnrollmentMonthsTxtF() {
        return '[name="selfReEnrollmentDuration-months"]'
    }

    getAllowReEnrollmentDaysTxtF() {
        return '[name="selfReEnrollmentDuration-days"]'
    }

    //----- For the Leaderboard Points Section -----//

    getLeaderboardPointsTxtF() {
        return '[name="leaderboardPoints"]'
    }

    getLeaderboardPointsSymbol() {
        return this.getElementByDataNameAttribute("leaderboardPoints") + ' ' + this.getElementByDataNameAttribute("symbol")
    }
    getLeaderboardPointsTxtDescription(){
        return this.getElementByDataNameAttribute("leaderboardPoints")+ ' '+this.getDescription()
    }

    //----- For the Post Enrollment Section -----//

    getAddPostEnrollmentBtn() {
        return '[data-name="add-post-enrollment"] [class*="icon icon-plus"]'
    }

    getPostEnrollmentOptionBtn(){
        return '[data-name="field"] [data-name="selection"] > [class*="select-field-module__value"]'
    }

    getCourseSelectionBtn(){
        return '[data-name="field"] [data-name="selection"] > [class*="select-field-module__placeholder"]'
    }

    getPostEnrollmntWhenDDown(){
        return '[data-name="field"] [data-name="selection"]'
    }

    getChooseCoursesBtn(){
        return '[class*="_select_field_4ffxm_1"]'

    }
    getPostEnrollmentOptBtn(){
        return '[data-name="selection"]'
    }

    getCoursesOptions(){
        return '[aria-label="Courses"] [class="_option_1mq8e_10"]'
    }

    getSelectPostEnrollmentCourseByName(name) {
        cy.get(this.getChooseCoursesBtn()).contains('Choose').click()
        this.getShortWait()
        cy.get(this.getPostEnrollmentCoursesDDownByOpt()).type(name)
        this.getMediumWait()
        cy.get(this.getCoursesOptions()).contains(name).eq(0).click()
    };

    // Pass index value if adding more than 1 post enrollment
    getPostEnrollmentWhenDDownByOpt(opt, index=0) {
        cy.get(`[data-name="post-enrollments"] [role="listitem"]`).eq(index)
            .find('[data-name="label"]').contains('When').parents('[class*="_form_control"]').within(() => {
                cy.get('[class*="icon icon-arrows-up-down"]').click()
                cy.get('[aria-label="When"] [class*="_label"]').contains(opt).click()
            })
    }

    getPostEnrollmentCoursesDDownByOpt(opt, index=0) {
        cy.get(`[data-name="post-enrollments"] [role="listitem"]`).eq(index)
            .find('[data-name="label"]').contains('Courses').parents('[class*="_form_control"]').within(() => {
                cy.get('[class*="icon icon-arrows-up-down"]').click({force: true})
                cy.get('[data-name="input"]').clear().type(opt)
                this.getShortWait()

                cy.get('[aria-label="Courses"] [class*="_label"]').contains(opt).click()
            })
    }

    getPostEnrollmentCourse(){
        return '[data-name="options"] > [aria-label="Courses"]'

    }

    //Can be used to verify if a post enrollment with certain course does not exist
    getVerifyPostEnrollment() {
        return '[data-name="post-enrollments"] [class*="_multiselect"]'
    }
    
    //Can be used to verify if a post enrollment with certain course exists
    getVerifyPostEnrollmentByCourseName(name) {
        cy.get('[data-name="post-enrollments"]').within(() => {
            cy.get('[class*="_multiselect"]').contains(name).should('exist')
        })
    }

    getDeletePostEnrollmentByCourseName(name) {
        cy.get('[data-name="post-enrollments"]').within(() => {
            cy.get('[class*="_multiselect"]').contains(name).parents('[class*="_post_enrollment"]').within(() => {
                cy.get('[class*="icon icon-trash"]').click()
            })
        })
    }

    getAddCompetencyBtn() {
        return '[data-name="add-course-competency"]'
    }

    getAddCreditBtnClass() {
        return '[class*="add_credit_type"]'
    }

    getAddCreditButton() {
        return '[class*="_add_credit_type"] [class*="_content"]'
    }

    getNumInputF() {
        return '[class*="_input_19krc_4"]'
    }

    getCertificateNoteText() {
        return 'textarea[aria-label="Notes"]'
    }

    getCertificateToggleCheckbox() {
        return '[aria-label="Certificate"]'
    }
    
    getCourseCompetenciesContent(){
        return '[data-name="course-competencies-content"]'
    }

    getDeleteCompetencyByName(name) {
        cy.get(this.getCourseCompetenciesContent()).contains(name).parents('[class*="_course_competency"]').within(() => {
            cy.get('button[title="Delete Competency"]').click()
        })
    }
    // Added for the TC # C2028
    getCustonCertificateNameBtn(){
        return '[data-name="allowCustomTitle"] [data-name="toggle-button"]'
    }

    getCustomCertificateNameInput(){
        return '[name="customTitle"]'
    }

    // for add competency By serial number, for 1st competency provide 1, for 2nd competency provide 2
    addCompetencyByIndex(index = 1, competencyName, levelName=null) {
        cy.get(this.getCourseCompetenciesContent()).eq(index-1).within(() => {
            // For competency
            this.getCompetencyDDownThenClick()
            this.getCompetencySearchTxtF(competencyName)
            this.getCompetencyOpt(competencyName)

            // For level
            if (levelName){
                this.getCompetencyLevelDDownThenClick()
                this.getCompetencyLevelOpt(levelName)
            }
        })
    }

    editCompetencyByName(currentCompetency, newCompetency) {
        cy.get(this.getCourseCompetenciesContent()).contains(currentCompetency).parents(this.getCourseCompetenciesContent()).then((element) => {
            cy.get(element).within(() => {
                this.getCompetencyDDownThenClick()
            })

            cy.get(element).within(() => {
                this.getCompetencySearchTxtF(newCompetency)
                this.getCompetencyOpt(newCompetency)
            })
        })

    }

    VerifyCompetencyOptionPersisted(competencyName) {
        cy.get('[data-name="course-competencies-content"] [class*="_label_5lf20"]').should('contain.text', competencyName)
    }

    // Added for the JIRA# AUT-578, TC# C2038
    getCertificateToggleBtn() {
        cy.get('[data-name="label"]').contains('Certificate').parent().siblings('[data-name="control_wrapper"]').within(() => {
            cy.get('[data-name="toggle"]').click()
        })
    }
    
    getChaptersRemoveBtn() {
        return `[data-name="chapters"] [data-name="chapters-list"] button[data-name="remove"]`
    }

    getCertificateToggleCheckInput() {
        return '[data-name="course-certificate-and-re-enrollment"] [data-name="isEnabled"] [data-name="toggle"] [data-name="checkbox"]'
    }

    switchCertificateToggle(checkInputValue = 'true') {
        cy.get(this.getCertificateToggleCheckInput(), {timeout: 1000}).invoke('attr','aria-checked', {timeout: 1000}).then((status) =>{
            if(status === checkInputValue){
                cy.get(this.getCertificateToggleCheckInput()).should('have.attr', 'aria-checked', status)
            }
            else {
                cy.get(this.getCertificateToggle(), {timeout: 1000}).click()
            }
        })
    }
}