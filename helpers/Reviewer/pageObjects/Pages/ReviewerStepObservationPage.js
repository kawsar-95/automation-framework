import BasePage from "../../../BasePage";

export default new class ReviewerStepObservationPage extends BasePage {
  // Reviewer Step Observation Page Elements

  getObservationTextArea() {
    return '[id="step-answer"]';
  }

  getObservationPostBtn() {
    return '[class*="review-text-step-module__main"] [type="submit"]';
  }

  getNABtn() {
    return '[aria-label="Not Applicable"]';
  }

  getCommentsField() {
    return '[data-name="review-step-page"] textarea[name="text"]'
  }

  getCommentsPostBtn() {
    return '[class*="review-text-step-module__secondary"] [type="submit"]';
  }
}
