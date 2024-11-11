import leBasePage from '../../LEBasePage'

export default new class LECourseEvaluationModal extends leBasePage {

    getQuestionContainer() {
        return '[class*="course-evaluation-module__question"]'
    }

    getQuestionName() {
        return '[class*="course-evaluation-module__question_title"]'
    }

    getRatingStarBtn() {
        return '[class*="rating-module__star"]'
    }

    getTxtF() {
        return '[class*="course-evaluation__text_question_textarea"]'
    }

    getSubmitBtn() {
        return '[class*="course-evaluation-module__submit_button"]'
    }

    getFeedbackMsg() {
        cy.get('[class*="course-evaluation-module__close_text"]').should('contain', "Thank you for your feedback on this course.")
    }

    getCloseBtn() {
        return '[class*="course-evaluation-module__close_button"]'
    }

    //Pass question name and rating (1-5) for question
    getRateQuestionByName(name, stars) {
        cy.get(this.getQuestionName()).contains(name).parents(this.getQuestionContainer()).within(() => {
            cy.get(this.getRatingStarBtn()).eq(stars-1).click()
        })
    }

    //Pass question name and answer for question
    getAnswerQuestionByName(name, answer) {
        cy.get(this.getQuestionName()).contains(name).parents(this.getQuestionContainer()).within(() => {
            cy.get(this.getTxtF()).type(answer, {force:true})
        })
    }

}