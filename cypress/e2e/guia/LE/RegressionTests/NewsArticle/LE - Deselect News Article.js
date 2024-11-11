import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARNewsArticlesAddEditPage from "../../../../../../helpers/AR/pageObjects/NewsArticles/ARNewsArticlesAddEditPage"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C6298 - LE - Regression - Delete News Article', () => {
    // Login as an Sys Admin and visit the News Article page
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Engage', {timeout:2000}))).click()
        ARDashboardPage.getMenuItemOptionByName('News Articles')
    })

    it("Test News Article Select/Deselect and verify that the buttons at the right position", () => {
        // Select First Articles
        cy.get(ARNewsArticlesAddEditPage.getNewsArticles()).find('tr').eq(0).click()
        ARDashboardPage.getMediumWait()

        // Stores the total count of buttons present in the sidebar after selecting an article
        cy.get(ARNewsArticlesAddEditPage.getSideBar()).find('a').its('length')
            .then((len) => {}).as('buttonCount')

        // Assert that:
        //  1. 'Deslect' button is the last button by position
        //  2. 'Delete News Article' comes before the 'Deslect' button position
        cy.get('@buttonCount').then(count => {
            cy.get(ARNewsArticlesAddEditPage.getSideBar()).find('a').each((el, index) => {
                if (el.text() === 'Deselect') {
                    cy.wrap(index).should('be.eq', count - 1)
                } else if (el.text() === 'Delete News Article') {
                    cy.wrap(index).should('be.eq', count - 2)
                }
            })
        })

        // Click on the 'Delete News Article' button
        cy.get(ARNewsArticlesAddEditPage.getSideBar()).find('a').contains('Deselect').click()
        
        // Assert that the selected news article is now unselected
        cy.get(ARNewsArticlesAddEditPage.getNewsArticles()).find('tr').eq(0).within(() => {
            cy.get(ARNewsArticlesAddEditPage.getUnselectedArticleCell()).should('be.visible')
        })    
    })

})