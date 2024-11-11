import arBasePage from "../../ARBasePage";

export default new class ARReviewerLearnersPage extends arBasePage {

    // Reviewer Learner Page Elements

    getReviewerPageTitle() {
        return "header-title";
    }

    getHeaderMenuBtn() {
        return '[title="Menu"]';
    }

    getThemedToggleBtn(name) {
        cy.get('[data-name="button"]').filter(`:contains(${name})`).click()
    }

    getLearnerSearchTxtF() {
        return '[data-name="learner-search-box"]'
    }

    getReviewerNameList() {
        return '[data-name="learner-review"] [class*="_name"]';
    }

    getReviewerName(reviewerName) {
        return cy.get(this.getElementByPartialAriaLabelAttribute(reviewerName))
    }

};