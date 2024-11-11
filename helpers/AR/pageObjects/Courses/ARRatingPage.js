import arBasePage from "../../ARBasePage"

export default new class ARRatingPage extends arBasePage {

    getSectionHeader() {
        return `[class="section-title"]`;
     }

    getItemsPerPageDDown() {
        return '[class*="grid-footer"] select'
    }

    AddCourseFilter(courseName) {
        cy.get('[class=create-filter] [class="icon icon-filter"]').click()
        cy.get('[class="value-select"] input').type(courseName)
        cy.get('[class="filter-dropdown"] [class="icon icon-plus"]').click()
    }

    getMessageUserBtn()
    {
        return '[class*="icon-mail icon"]'
    }

    getSubjectTxtF() {
        return '[aria-label="Subject"]'
    }
    
    getTextArea() {
        return '[aria-label="Body"]'
    }

    getSaveAnchor() {
        return '[data-name="submit"]'
    }
    
    
    
}