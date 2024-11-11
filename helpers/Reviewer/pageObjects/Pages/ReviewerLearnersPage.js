import BasePage from "../../../BasePage";

export default new class ReviewerLearnersPage extends BasePage {
  // Reviewer Learners Page Elements

  // Accepts 'Not Ready', 'Ready', 'In Progress'
  getStateBtn(name) {
    cy.get('[data-name="button"]').contains(`${name}`).click();
  }

  getLearnerReviewLinkByName(label) {
    cy.get('[class*="learner-review-module__name"]').contains(label).click();
  }
}
