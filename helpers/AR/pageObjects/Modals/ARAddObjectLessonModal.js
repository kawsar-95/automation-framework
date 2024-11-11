import { commonDetails } from "../../../TestData/Courses/commonDetails";
import { lessonObjects } from "../../../TestData/Courses/oc";
import { miscData } from "../../../TestData/Misc/misc";
import arBasePage from "../../ARBasePage";
import ARDeleteModal from "./ARDeleteModal";
import ARUploadFileModal from './ARUploadFileModal';

export default new class ARAddObjectLessonModal extends arBasePage {

    getModalErrorMsg() {
        return "error";
    }

    getTxtFByName(name, txt) {
        cy.get('[data-name="assessment-lesson-general"] [data-name="name"]').within(() => {
            this.getMediumWait()
            cy.get(`[value="${name}"]`).clear().type(txt)
        })
    }

    getAddassessmentModal() {
        return `[class*="assessment_modal"]`
    }

    getNameTxt() {
        return "Name";
    }

    getNameErrorMsg() {
        return '[data-name="name"] [data-name*="error"]';
    }

    getSourceRadioBtn() {
        return '[data-name="radio-button"]';
    }

    getYouMayNeedPopupWarningMsg() {
        return '[data-name="you-may-need-a-popup-msg"]';
    }

    getChooseFileBtn() {
        return '[data-name="source"] [class*="_choose"]'
    }

    getURLSourceRadioBtn() {
        cy.get('[class*="radio-button-module__radio_button"]').contains('Url').click()
    }

    getURLTxtF() {
        return '[name="source"]'
    }

    getFileTxtF() {
        return '[class*="file_input"] [data-name="text-input"]'
    }

    getObjectDescriptionTxtF() {
        return this.getModal() + ' ' + this.getDescriptionTxtF()
    }

    getDesktopRadioBtn() {
        return '[aria-label="Desktop"] [data-name="radio-button"]'
    }

    getMobileRadioBtn() {
        return '[data-name="launchMobile"] [class*="radio-button-module__label"]';
    }

    getNotesTxtF() {
        return '[class*="_modal_content"] [aria-label="Notes"]'
    }

    getApplyBtn() {
        return '[class*="_button_4zm37_1 _success_4zm37_44"]' + ' ' + this.getSaveDiskBtn()
    }

    getCancelBtn() {
        return '[data-name="content"] [class*="icon icon-no"]'
    }

    getBackBtn() {
        return '[class*="icon icon-arrow-back"]';
    }
    getandclearAssessmentname() {
        return '[value="Assessment Name"]'
    }
    getAddassessmentweight() {
        return '[aria-label="Assessment Weight"]'
    }
    getProctorloginEnabled() {
        return '[aria-label="Proctor"]'
    }
    getAddGradetoPass() {
        return '[aria-label="Grade To Pass"]'
    }
    getAddexpandoptions() {
        return '[aria-label="Expand Options"]'
    }
    getEnablemaxattempts() {
        return '[aria-label="Allow Multiple Attempts"]'
    }
    getInputmaxattempts() {
        return '[aria-label="Maximum Number of Attempts"]'
    }
    getInputallowfailures() {
        return '[aria-label="Allow Failure"]'
    }
    getExpandQuestionsbutton() {
        return '[aria-label="Expand Questions"]'
    }
    getManageQuestions() {
        return '[data-name="edit-questions"]'
    }
    getAddQuestions() {
        return '[data-name="add-question"]'
    }
    getQuestionNameTextBox() {
        return '[data-name="name"] [class*="fr-element fr-view"] p'
    }
    getQuestionNameErrorMsg() {
        return '[class*="_assessment_question_modal"] [data-name="name"] [data-name="error"]'
    }
    getQuestionOptionByIndex(index="0") {
        return `[aria-label="Option"][name=${index}]`
    }
    getQuestionOptionErrorMsgByIndex(index="0"){
        return `[data-name=${index}] [data-name="error"]`
    }
    getQuestionTypeDDown() {
        return '[data-name="questionType"] [data-name="field"]'
    }
    getQuestionTypeDDownOpt() {
        return 'ul[aria-label="Question Type"] [class*="_label"]'
    }
    getQuestionTypeSelectedLabel() {
        return '[data-name="questionType"] [data-name="field"] [class*="_label"]'
    }
    getAddOption() {
        return '[data-name="add-option"]'
    }
    deleteOptionByName(name) {
        cy.get('input[aria-label="Option"]').filter((k, el) => el.value === name).parents('[data-name*="list-item"]').within(() => {
            cy.get(this.getTrashBtn()).click({force:true})
        })
    }
    getWeightPerQuestion() {
        return '[aria-label="Weight Per Question"]'
    }
    getWeightPerQuestionErrorMsg() {
        return '[class*="_assessment_question_modal"] [data-name="weight"] [data-name="error"]'
    }
    getQuestionSavebutton() {
        return '[data-name="save"]'
    }
    getQuestionsName() {
        return'[data-name="assessment-questions"] [class*="_name"]'
    }
    editQuestionByName(name) {
        cy.get(this.getQuestionsName()).contains(name).parents('[data-name*="list-item"]').within(() => {
            cy.get(this.getPencilBtn()).click()
        })
    }
    deleteQuestionByName(name) {
        cy.get(this.getQuestionsName()).contains(name).parents('[data-name*="list-item"]').within(() => {
            cy.get(this.getTrashBtn()).click()
        })
        cy.get(ARDeleteModal.getARDeleteBtn()).click()
        cy.get(ARDeleteModal.getARDeleteBtn()).should('not.exist')
        cy.get(this.getWaitSpinner()).should('not.exist')
    }
    getNoQuestionsMessage() {
        return '[data-name="no-questions-message"]'
    }

    getOptionAnswersToggleContainerByIndex(index="0") {
        return `${index}`
    }

    getOptionAnswersError() {
        return '[aria-live="polite"] [data-name="error"]'
    }

    getandClickApplybutton() {
        //return '[class="modal-footer-module__modal_footer--B5A8p"]'
        return '[data-name="save"]'
    }
    // getandClickApplybutton(){
    //     return '[class="modal-footer-module__modal_footer--B5A8p"]'
    // }

    getQuestiontypedropdown() {
        return '[class="select-module__select--JYWj7 select-module__below--S8q0T select-module__focused--BgkKx select_focused"]'
        //return '[data-name="field"][class="select-module__field--gCrbN select_field"]'
    }

    getFailureTypeRadioButtons (){
        return `[data-name="failureType"] [data-name="label"]`
    }

    getSelectFailureTypeRadioButtonsByName (name){
        cy.get(this.getFailureTypeRadioButtons()).contains(name).click()
    }

    getAllowRetakeAfterTextF() {
        return `[name="retakeFailedLessonAfterDays"]`
    }

    //Adds a basic URL image or file image object lesson - pass object name and type of object (Url or file)
    getAddBasicObjectLesson(name, type = 'Url') {
        cy.get(this.getElementByAriaLabelAttribute(this.getNameTxt())).type(name)
        switch (type) {
            case 'Url':
                cy.get(this.getSourceRadioBtn()).contains('Url').click()
                cy.get(this.getURLTxtF()).type(miscData.switching_to_absorb_img_url)
                this.getShortWait()
                break;
            case 'File':
                cy.get(this.getSourceRadioBtn()).contains('File').click()
                cy.get(this.getChooseFileBtn()).click()
                cy.get(this.getUploadFileBtn()).click()
                cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.posterImgName)
                cy.get(ARUploadFileModal.getChooseFileBtn()).click
                ARUploadFileModal.getVShortWait()
                cy.get(ARUploadFileModal.getSaveBtn()).click()
                cy.get(this.getWaitSpinner(), { timeout: 20000 }).should('not.exist')
                ARUploadFileModal.getLShortWait()
                break;
            default:
                cy.addContext(`Sorry, ${type} type does not exist.`);
        }
        cy.get(this.getApplyBtn()).click()
        this.getLShortWait()
    }

    //Adds a custom object lesson - pass object name and type of object (Url or file), file path, file name, Mobile or Desktop radio button group
    getAddCustomObjectLesson(name, type = 'Url', filePath, fileName, radioBtnGroup = this.getDesktopRadioBtn(), radioBtnTitle = 'Launch in a modal (iFrame)') {
        cy.get(this.getElementByAriaLabelAttribute(this.getNameTxt())).type(name)
        switch (type) {
            case 'Url':
                cy.get(this.getSourceRadioBtn()).contains('Url').click()
                cy.get(this.getURLTxtF()).type(miscData.switching_to_absorb_img_url)
                this.getShortWait()
                break;
            case 'File':
                cy.get(this.getSourceRadioBtn()).contains('File').click()
                cy.get(this.getChooseFileBtn()).click()
                cy.get(ARUploadFileModal.getUploadbtnandClick()).click()
                cy.get(ARUploadFileModal.getFilePathTxt()).selectFile(`${filePath}` + `${fileName}`, { force: true })
                cy.get(ARUploadFileModal.getChooseFileBtn()).click()
                ARUploadFileModal.getShortWait()
                cy.get(ARUploadFileModal.getSaveBtn()).click()
                cy.get(this.getWaitSpinner(), { timeout: 20000 }).should('not.exist')
                ARUploadFileModal.getShortWait()
                cy.get(`${radioBtnGroup}`).contains(`${radioBtnTitle}`).click().click()
                break;
            default:
                cy.addContext(`Sorry, ${type} type does not exist.`);
        }
        cy.get(this.getObjectDescriptionTxtF()).type(lessonObjects.ocObjectDescription)
        cy.get(this.getNotesTxtF()).type(lessonObjects.objectNotes)
        cy.get(this.getApplyBtn()).click()
        this.getShortWait()
    }
    getManageStepsBtn() {
        return '[class="_button_4zm37_1 _edit_steps_5ywsy_4"]:contains(Manage Steps)'
    }
    getAddStepSaveBtn() {
        return '[aria-labelledby="dialog-3-title"] [data-name="save"]'
    }
    getContinueBtn() {
        return `[data-name="submit"] [class="_content_4zm37_17"]`
    }
    getSkipBtn() {
        return `[data-name="skip"]`
    }

    getAddLessonObjectModule() {
        return `#modal-content-2`
    }

    getTitleTextF() {
        return `[data-name="name"] [class*="_text_input_1c8rc_1"]`
    }

    getSourceRadioBtn() {
        return `[data-name="source"] [class="_label_6rnpz_32"]`
    }

    getDisplayColumnsBtn() {
        return `[title="Display Columns"]`
    }

    getDisplayListItems(name) {
        return `[value="${name}"]`
    }

    getCourseChooseFilterBtn() {
        return `[data-name="filter-edit"]`
    }

    getChooseDDownBtn() {
        return `[data-name="selection"]`
    }

    getCourseNameTextF() {
        return `[data-name="input"]`
    }

    getChooseCourseNameDDownList() {
        return `[class="_label_ledtw_62"]`
    }

    getTableGridCell() {
        return `[role="gridcell"]`
    }

    getCoruseChooseAddFilterBtn(){
        return `[data-name="submit-filter"]`
    }
    
    getDisplayItemsDDown() {
        return `[role="group"]`
    }
    
    getDisplayListItemsByName(name) {
        cy.get(this.getDisplayColumnsBtn()).click()
        cy.get(this.getDisplayListItems(name)).invoke('attr','aria-checked').then((state)=>{
            if(state == 'false'){
                cy.get(this.getDisplayListItems(name)).click({force:true})
            }
            else{cy.get(this.getDisplayListItems(name)).should('have.attr', 'aria-checked', 'true')}
        })
    }

    getProctorCode(userName,courseName) {
      this.getMediumWait()
      cy.get(this.getChooseDDownBtn()).click()
      cy.get(this.getCourseNameTextF()).type(courseName)
      cy.get(this.getChooseCourseNameDDownList()).contains(courseName).click()
      cy.get(this.getCoruseChooseAddFilterBtn()).click()
      this.getVShortWait()
      this.AddFilter('Username','Equals',userName)
      this.getVShortWait()
      this.getDisplayListItemsByName('Proctor Code')
      this.getVShortWait()
    }

    getUploadFileBtn() {
        return '[title="Upload File"]'
    }

    // Added for the TC# T98581
    getAssesmentName(){
        return 'input[name="name"]'
    }

    getQuestionBankSec(){
        return '[data-name="question-banks"]'
    }
    
    getAllowFailureToggleContainer() {
        return "allowFailure"
    }

    getRandomizeQuestionOrderToggleContainer() {
        return "randomizeQuestionOrder"
    }

    getRandomizeAnswerOrderToggleContainer() {
        return "randomizeAnswerOrder"
    }

    getShowCorrectAnswerToUserToggleContainer() {
        return "showCorrectAnswerToUser"
    }

    getShowFeedbackToggleContainer() {
        return "showFeedback"
    }

    getIsExamTimedToggleContainer() {
        return "isExamTimed"
    }

    getMaximumTimeAllowed() {
        return '[name="maximumTimeAllowed"]'
    }

    getMaximumTimeAllowedSymbol() {
        return '[data-name="maximumTimeAllowed"] [data-name="symbol"]'
    }

    getMaximumTimeAllowedErrorMsg() {
        return '[data-name="maximumTimeAllowed"] [data-name="error"]'
    }

    getShowFeedbackToggleMsg() {
        return "Show responses for each question after it has been answered"
    }

    getIsExamTimedToggleMsg() {
        return "Assessment is timed and will expire after the specified duration"
    }

    getSinglePageLayoutToggleMsg() {
        return "Turning this option on will change the layout to be a single page"
    }

    getShowNavigationToggleMsg() {
        return "Shows the navigation bar"
    }

    getAllowNavigationToggleMsg() {
        return "Allows the user to navigate between questions"
    }

    getExpandMessageToggleBtn() {
        return 'div[data-name="dialogs"] button[aria-label="Expand Messages"]'
    }

    // WYSIWYG messages
    getIntroMessageContainer() {
        return this.getElementByDataName('introductionMessage')
    }

    getPostMessageContainer() {
        return this.getElementByDataName('postCompletionMessage')
    }

    getFailMessgeContainer() {
        return this.getElementByDataName('failureMessage')
    }
    
    getWeightedToggleBtn(){
        return `[data-name="isWeighted"] [data-name="toggle"]`
    }

}