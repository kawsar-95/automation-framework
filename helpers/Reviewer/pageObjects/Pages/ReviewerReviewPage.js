import BasePage from "../../../BasePage";

export default new class ReviewerReviewPage extends BasePage {
  // Reviewer Review Page Elements

  getSectionItem() {
    return '[data-name="review-section-item"]'
  }
  getStepItem() {
    return '[data-name="review-step-item"]'
  }

  getStep(strSectionNumber, strStepNumber) {
    cy.get(this.getSectionItem()).eq(strSectionNumber-1).find(this.getStepItem()).eq(strStepNumber-1).click()
  }

  getAddAttachmentBtn() {
    return '[class*="add_attachment_button"]';
  }

  // Use this text as value for dataname attribute to get this element
  getPassBtn() {
    return "pass-review";
  }

  // Use this text as value for dataname attribute to get this element
  getFailBtn() {
    return "fail-review";
  }

  getCommentsField() {
    return '[aria-describedby*="review_comments"]';
  }

  getPostBtn() {
    cy.get('[data-name="button"]').contains("Post").click();
  }

  getReviewActionsBtn() {
    return '[data-name="review-actions"] button'
  }
  getSubmitOrCloseBtn(label) {
    cy.get(this.getReviewActionsBtn()).filter(`:contains("${label}")`).should('have.attr', 'aria-disabled', 'false')
    cy.get(this.getReviewActionsBtn()).filter(`:contains("${label}")`).click()
    cy.get(this.getReviewActionsBtn()).should('not.exist')
  }
}
