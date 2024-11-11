import arBasePage from "../../ARBasePage";

export default new class AROJTUserChecklistSummaryPage extends arBasePage {
  // Reviewer User Checklist Summary Page Elements

  // Can accept Learner username or Reviewer Username // cy.get('[data-name="field-value"]').filter(`:contains(${name})`)
  getNameField() {
  return '[data-name="field-value"]'
  }

  getChecklistSection() {
    return 'div[role="list"]';
  }

  // Can accept comment text // cy.get('[data-name="comments"]').filter(`:contains(${comment})`);
  getOverallComments() {
     return '[data-name="comments"]';
  }

  // Can accept (Final Result of Review: Pass) or (Final Result of Review: Fail) // cy.get('[data-name="grade"]').filter(`:contains(${result})`);
  getReviewResult() { 
   return '[data-name="grade"]';
  }


  getAttachmentsBtn() {
    return '[class*="summary-button-module__title"]';
}

}
