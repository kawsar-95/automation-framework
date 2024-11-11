import arBasePage from "../../ARBasePage";
import ARAddObjectLessonModal from "./ARAddObjectLessonModal";
import arQuestionBanksAddEditPage from "../QuestionBanks/ARQuestionBanksAddEditPage";
import AROCAddEditPage from "../Courses/OC/AROCAddEditPage";
import { lessonAssessment} from "../../../TestData/Courses/oc";
import { qbDetails } from "../../../TestData/QuestionBank/questionBanksDetails";
import ARUploadInstructionsModal from './ARUploadInstructionsModal'

export default new class ARSelectLearningObjectModal extends arBasePage {


    getNameTxt() {
        return "Name";
    }

    getModalTitle() {
        return '[data-name="dialog-title"]'
    }

    getObjectRadioBtn() {
        return `[data-name="radio-button"]`
    }
    
    getObjectTypeByName(name) {
        this.getShortWait()
        cy.get(this.getObjectRadioBtn()).contains(name).click()
    }

    getNextBtn() {
        return '[data-name="content"] [class*="icon-arrow-forward"]'
    }

    getCancelBtn() {
        return '[data-name="content"] [class*="icon icon-no"]'
    }

    getSelectFileBtnOption() {
       return '[id="radio-button-41_label"]'
    }

    getChooseFileBtn(){
        return `[data-name="select"]`
    }

    getSelectLessonBtn(){
        return '[class*="_dialog_"]:nth-of-type(2) [data-name="select"]';
    }

    getHierarchySecondOpt(){
        return '[class*="_node_1jnlq_1 _hierarchy_node_ghc15_1 _selectable"]'
    }

    getReplaceExistingLessonRadioBtn() {
        return `input[data-name="radio-button-Replace"]`
    }
    getBackBtn() {
        return `button[data-name="back"]`
    }

    getSelectALessonBtn() {
        return `[class*="_chapter_lesson_picker_"] button[data-name="select"]`
    }

    getModalByName(name='') {
        return cy.get(this.getModalTitle()).contains(name).parent().parent()
    }
    

    addSimpleAssesment(){
        this.getObjectTypeByName('Assessment')
        cy.get(this.getNextBtn()).click()
        ARAddObjectLessonModal.getTxtFByName('Assessment Name', lessonAssessment.ocAssessmentName)
        cy.get(arQuestionBanksAddEditPage.getExpandQuestionsDropdown()).click()   
        cy.get(arQuestionBanksAddEditPage.getManageQuestionsButton()).click()    
        cy.get(arQuestionBanksAddEditPage.getUseQuestionBankButton()).click()
        cy.get(arQuestionBanksAddEditPage.getSelectQuestionBankDropdown()).click()
        cy.get(arQuestionBanksAddEditPage.getEnterQuestionBankName()).type(qbDetails.questionBanksName)
        cy.get(arQuestionBanksAddEditPage.getSelectQuestionBank()).first().click()
        cy.get(arQuestionBanksAddEditPage.getSaveButton()).should('have.attr','aria-disabled','false').click() 
        cy.get(arQuestionBanksAddEditPage.getApplyButton()).should('have.attr','aria-disabled','false').click()
        cy.get(ARUploadInstructionsModal.getApplyBtn()).should('have.attr','aria-disabled','false').click()
        cy.get(AROCAddEditPage.getLearningObjectName()).last().should('contain',lessonAssessment.ocAssessmentName)
    }
    /**
     * Here Chapter names needed to be passed as arguments
     * @param {string} name 
     * @returns 
     */
    getSelectLessonHierarchyToggleBtnByName(name='') { 
        return `li[data-name="hierarchy-tree-item"][aria-label="${name}"] [data-name="toggle"]`
    }
    /**
     * Pass the name of the lesson want to be selected
     * @param {string} name 
     * @returns 
     */
    getSelectLessonModalLessonsByName(name) {
        return cy.get(`li[data-name="hierarchy-tree-item"] [data-name="label"]`).contains(name)
    }

    // Added for the TC# T98581
    getSaveBtn(){
        return 'button[data-name="save"]'
    }
}

export const ImportCourseData = {
    "SCORM_1.2": "SCORM 1.2",
    "SCORM_2004": "SCORM 2004",
    "Tin_Can": "Tin Can",
    "AICC": "AICC"
}