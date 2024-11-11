import { qbDetails } from "../../../TestData/QuestionBank/questionBanksDetails";
import ARBasePage from "../../ARBasePage";
import ARDashboardPage from "../Dashboard/ARDashboardPage";
import ARQuestionBanksPage from "./ARQuestionBanksPage";

export default new (class ARQuestionBanksAddEditPage extends ARBasePage {

  // Question Banks AddEdit Elements
  getA5NameTxtF() {
    return "input#Name";
  }

  getA5QuestionTxtA() {
    return ".short";
  }

  getA5QuestionNameLBL(name) {
    return `span[title="${name}"]`
  }

  getA5OptionAnswerTxtFByIndex(optIndex = 1) {
    return `[data-bind] [class='fields-wrapper no-border margin-bottom-20']:nth-of-type(${optIndex}) [type]`;
  }

  getA5OptionAnswerBtn() {
    return ".grey.list-group-items.question.ui-sortable .btn.full-width";
  }

  getA5CreateQuestionBtn() {
    return "form[method='post'] .btn.full-width";
  }

  getA5EditQuestionBtnByIndex(btnIndex = 1) {
    return `div:nth-of-type(${btnIndex}) > .has-index.list-group-item-top > .btn-wrapper > .border.btn.has-icon-only > .icon.icon-pencil`;
  }

  getA5DeleteQuestionBtnByIndex(btnIndex = 1) {
    return `div:nth-of-type(${btnIndex}) > .has-index.list-group-item-top > .btn-wrapper > .border.btn.delete.has-icon-only`;
  }

  getA5TypeDDown() {
    return "[data-bind] .select2-chosen";
  }

  getA5TypeDDownOpt(optIndex = 1) {
    return `li:nth-of-type(${optIndex}) > div[role='option']`;
  }

  getA5NameErrorMsg() {
    return '.validation-summary-errors'
  }

  getA5QuestionOrAnswerErrorMsg(errorMsgIndex) {
    return this.getA5NameErrorMsg() + ` > ul > li:nth-of-type(${errorMsgIndex})`
  }

  getExpandQuestionsDropdown() {
    return '[aria-label*="Expand Questions"]'
  }

  getManageQuestionsButton() {
    return '[data-name="edit-questions"]'
  }

  getUseQuestionBankButton() {
    return '[data-name="use-question-bank"]'
  }

  getSelectQuestionBankDropdown() {
    return '[data-name="questionBankId"] [data-name="field"]'
  }


  getEnterQuestionBankName() {
    return '[name*="questionBankId"]'

  }


  getSelectQuestionBank() {
    return '[data-name="options"] [aria-label="Select Question Bank"]'
  }

  getSaveButton() {
    return '[class*="_modal_footer"] [type="submit"]'

  }

  getQuestionBankModalContainer() {
    return '[class*="assessment-question-bank-modal-module"]'

  }

  getApplyButton() {
    return '[data-name="assessment-questions"] [data-name="save"]'
  }

  // Added for the TC# C7423
  getQuestionBankActions() {
    return `[class="dropdown-title"]`
  }

  getQuestionBankActionsDropDown(num) {
    return `ul > :nth-child(${num}) > .has-icon`
  }

  getUnsavedModalTitle() {
    return `[class="modal dialog"] [class="section-title"]`
  }

  getUnsavedModalMsg() {
    return `[class="modal dialog"] [class="message"]`
  }

  getUnsavedModalBtn(attr) {
    return `[data-bind="text: ${attr}"]`
  }

  getPageHeadertitleName() {
    return `#edit-content > .header > .section-title`
  }


  addSampleQuestBank() {
    ARDashboardPage.getQuestionBankReport()
    ARQuestionBanksPage.getA5AddEditMenuActionsByNameThenClick('Question Bank')
    ARQuestionBanksPage.A5WaitForElementStateToChange(this.getA5NameTxtF())
    cy.get(this.getA5NameTxtF()).type(qbDetails.questionBanksName)
    cy.get(this.getA5CreateQuestionBtn()).click()
    cy.get(this.getA5QuestionTxtA()).type(qbDetails.qb_question_1_text)
    cy.get(this.getA5OptionAnswerTxtFByIndex(1)).type(qbDetails.qb_q1_answer_1)
    cy.get(this.getA5SaveBtn()).click()
    this.getMediumWait()
  }

  getAddQuestionButton() { 
    return `button[data-name="add-question"]`
  }

  getQuestionTextFiled() {
    return `[aria-label="Question"] > p`
  }

  assertAttatchments(name) {
    cy.get(this.getElementByDataNameAttribute("attatchment")+" "+this.getElementByDataNameAttribute("label")).contains(name).should('exist')
  }

  getRadioButtonForAttachment(name) {
    return cy.get(this.getElementByDataNameAttribute("radio-button")).contains(name)
  }
  getURLTextInput() {
    return `[data-name="attachment"] input[data-name="text-input"]`
  }

  getURLRadioButton() {
    return `[data-name="attachment"] [data-name="radio-button-Url"]`
  }
})();
