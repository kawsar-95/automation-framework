import BasePage from "../../../BasePage";

export default new class ReviewerStepRatingPage extends BasePage {
  // Reviewer Step Rating Page Elements

  getRatingDDown() {
    return '[class*="review-numeric-step-module__select"]';
  }

  getRatingDDownOpt(number) {
    return `ul[role="listbox"] li:nth-of-type(${number})`;
  }

  getNABtn() {
    return '[class*="review-numeric-step-module__na"]';
  }

  getCommentsField() {
    return '[class*="review-numeric-step-module__secondary_content"] [class*="text-area-form-module__text_area"] [class*="text-area-form-module__text_area"]';
  }

  getCommentsPostBtn() {
    return '[class*="review-numeric-step-module__secondary_content"] [class*="text-area-form-module__post"]';
  }
}
