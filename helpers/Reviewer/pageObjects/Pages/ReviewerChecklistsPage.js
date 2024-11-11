import BasePage from "../../../BasePage";

export default new class ReviewerChecklistPage extends BasePage {
  // Reviewer Checklist Page Elements

  getLearnerName() {
    return '[class*="learner-review-enrollments-module__name"]';
  }

  getLessonLinkByName(label) {
    cy.get('[class*="learner-review-enrollment-module__lesson_label"]')
      .contains(label)
      .click();
  }
}
