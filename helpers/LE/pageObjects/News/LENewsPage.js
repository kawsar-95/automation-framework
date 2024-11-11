import LEBasePage from '../../LEBasePage'

export default new class LENewsPage extends LEBasePage {
   
    getNewsPageTitle() {
        return `[class*="banner-title-module__title"]`;
    }

    getNewsArticleByTitle(name) {
        return cy.get('[class*="news__article_title"]').contains(name)
    }

    //Pass news article title, author first & last name to verify
    getNewsArticleAuthorByTitle(title, fname, lname){
        cy.get('[class*="news__article_title"]').contains(title).parent().within(() => {
            cy.get('[class*="news__article_author"]').should('contain', fname + ' ' + lname )
        })
    }

}