import arBasePage from "../../../../helpers/AR/ARBasePage";

export default new class ReviewerStepResultPage extends arBasePage {
  // Reviewer Step Result Page Elements

  getResultLabelBtn() {
    return '[aria-labelledby="result-label"] button'
  }

  // Accepts 'Yes', 'No', 'N/A'
  getReviewListBtn(name) {
    cy.get(this.getResultLabelBtn()).contains(name).click()
  }

  getCommentsField() {
return ':nth-of-type(3) [name="text"]';   

}

  getPostBtn() {
    return '[data-name="review-step-page"] button[type="submit"]';
  }
}
