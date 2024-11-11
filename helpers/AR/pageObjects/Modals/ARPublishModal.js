import arBasePage from "../../ARBasePage"

export default new class ARPublishModal extends arBasePage{
    getPublishModalTileValue(title, value, hoverValue) {
        cy.get('[class*="_message_1nlnq_18"]').contains(title).parent().within(()=> {
            cy.get('[data-name="publish-course-tile-value"]').should('contain', value)
            cy.get('[data-name="publish-course-tile-hover-message"]').should('contain', hoverValue)
        })
    }
    
    getContinueBtn() {
        return `button[data-name="confirm"]`
    }

    getModalTitle() {
        return '[data-name="prompt-header"]'
    }

    getCancelBtn() {
        return `[data-name="publish-course-prompt"] button[data-name="cancel"]`
    }

    getPublishPoursePrompt() {
        return '[data-name="publish-course-prompt"]'
    }

    clickContinueBtnAndReturnId(){
        cy.get(this.getContinueBtn(), { timeout: 30000 }).should('have.attr', 'aria-disabled', 'false').click()
        cy.intercept('POST', '/api/rest/v2/admin/published-course-drafts').as('getPublish')

        return cy.intercept('DELETE', '/api/rest/v2/admin/course-drafts/**').as('getUrl').wait('@getUrl', { timeout: 40000 }).then((request) => { })
    }
}
