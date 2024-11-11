import { lessonTask } from "../../../TestData/Courses/oc"
import arBasePage from "../../ARBasePage";

export default new class ARAddTaskLessonModal extends arBasePage {

    getDetailsErrorMsg() {
        return `[data-name="details"] [data-name="error"]`;
    }
    
    getNameTxt() {
        return "Name";
    }

    getNameErrorMsg() {
        return `[data-name="name"] [data-name="error"]`;
    }

    getDescriptionTxtF() {
        return `form#taskLessonGeneral > div:nth-of-type(2) .fr-element.fr-view`;
    }

    getTaskIsScoredToggle() {
        return `[data-name="isScored"] [class*="_toggle_button"]`;
    }

    getGradeToPassTxt() {
        return "Grade To Pass";
    }

    getWeightTxt() {
        return "Weight";
    }

    getExpandMessagesBtn() {
        return this.getModal() + ' ' + this.getElementByAriaLabelAttribute("Expand Messages")
    }

    getAllowNotificationToggle() {
        return `[data-name="task-lesson-notification"] [data-name="disable-label"]`;
    }

    getNotificationInstructionTxt() {
        return "Notification Instructions";
    }

    getNotificationInstructionErrorMsg() {
        return `[data-name="instructions"] [data-name="error"]`;
    }

    getSendTaskNotificationChkBox() {
        return `[data-name="task-lesson-notification"] [data-name="email-notification"]`;
    }

    getSaveBtn() {
        return '[data-name="save"]'
    }

    getBackBtn() {
        return `[class*="icon icon-arrow-back"]`;
    }

    getCancelBtn() {
        return '[data-name="content"] [class*="icon icon-no"]'
    }

    getCreateTask() {
        cy.get(arOCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        cy.wrap(arSelectLearningObjectModal.getObjectTypeByName('Task'))
        cy.get(arSelectLearningObjectModal.getNextBtn()).click()
        cy.get(this.getNameTxt()).clear().type(lessonTask.ocTaskName)
        cy.get(this.getDescriptionTxtF()).type(lessonTask.ocTaskDescription)
    }

    getEnableTaskIsScored(intGradeToPass = 0, intWeight = 10) {
        cy.get(this.getTaskIsScoredToggle()).click()
        cy.get(this.getGradeToPassTxt()).clear().type(intGradeToPass)
        cy.get(this.getWeightTxt()).clear().type(intWeight)
    }

    getEnableAllowNotification(txtNotificationInstruction = lessonTask.ocInstructions) {
        cy.get(this.getAllowNotificationToggle()).click()
        cy.get(this.getNotificationInstructionTxt()).type(txtNotificationInstruction)
    }

    getGradeToPassTxtForDataName(){
        return `passingScore`
    }

    getWeightTxtForDataName(){
        return `weight`
    }
    getLableText() {
        return `label`
    }

    getTaskIsScoredToggleContainer() {
        return 'isScored'
    }

    getPassingScoreError() {
        return '[data-name="passingScore"] [data-name="error"]'
    }

    getWeightError() {
        return '[data-name="weight"] [data-name="error"]'
    }
	
}