import LEBasePage from '../../LEBasePage'

export default new class LEFAQsPage extends LEBasePage {
   
    getFAQsPageTitle() {
        return `[class*="banner-title-module__title"]`;
    }

    getFAQsByTitle(name) {
        return cy.get('[class*="question-answer__question"]').contains(name)
    }

}