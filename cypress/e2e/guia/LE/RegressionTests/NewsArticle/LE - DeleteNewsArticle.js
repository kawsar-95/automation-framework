import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARNewsArticlesAddEditPage from "../../../../../../helpers/AR/pageObjects/NewsArticles/ARNewsArticlesAddEditPage"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C6298 - LE - Regression - Delete News Article', () => {
    // Login As System Admin, check buttons' position and attempt to delete a selected News Article
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Engage',{timeout:5000}))).click()
        ARDashboardPage.getMenuItemOptionByName('News Articles')

        // Select First Articles
        cy.get(ARNewsArticlesAddEditPage.getNewsArticles()).find('tr').eq(0).click()
        ARDashboardPage.getMediumWait()

        // check Delete News Article button visible
        cy.get(ARNewsArticlesAddEditPage.getSideBar()).contains('Delete News Article').should('be.visible')

        // Stores the total count of buttons present in the sidebar after selecting an article
        cy.get(ARNewsArticlesAddEditPage.getSideBar()).find('a').its('length')
            .then((len) => {}).as('buttonCount')

        // Assert that:
        //  1. 'Deslect' button is the last button
        //  2. 'Delete News Article' comes before the 'Deslect' button
        cy.get('@buttonCount').then(count => {
            cy.get(ARNewsArticlesAddEditPage.getSideBar()).find('a').each((el, index) => {
                if (el.text() === 'Deselect') {
                    cy.wrap(index).should('be.eq', count - 1)
                } else if (el.text() === 'Delete News Article') {
                    cy.wrap(index).should('be.eq', count - 2)
                }
            })
        })

        cy.get(ARNewsArticlesAddEditPage.getSideBar()).contains('Delete News Article').click()
        ARDashboardPage.getMediumWait()

        // verify Modal Open
        cy.get(ARNewsArticlesAddEditPage.getConfirmModal()).should('be.visible')
        cy.get(ARNewsArticlesAddEditPage.getConfirmModal()).find(ARNewsArticlesAddEditPage.getConfirmModalBtnLinks()).should('contain', 'Cancel')
        cy.get(ARNewsArticlesAddEditPage.getConfirmModal()).find(ARNewsArticlesAddEditPage.getConfirmModalBtnLinks()).should('contain', 'OK')
        cy.get(ARNewsArticlesAddEditPage.getNewsArticles()).find('tr').eq(0).find('td').eq(1).invoke('text').then((text)=>{
            cy.get(ARNewsArticlesAddEditPage.getConfirmModal()).find(ARNewsArticlesAddEditPage.getConfirmModalWarningMsg()).should('contain', `Are you sure you want to delete '${text}'?`)
            let articleTitle = text
            cy.wrap(articleTitle).as('articleTitle')
        })
    })

    it("Click 'Cancel' button on the confirmation dialog then verify article not being deleted", () => {
        // click on Cancel Button
        cy.get(ARNewsArticlesAddEditPage.getConfirmModal()).find(ARNewsArticlesAddEditPage.getConfirmModalBtnLinks()).contains('Cancel').click()
        ARDashboardPage.getMediumWait()

        // check Articles remains in the list
        cy.get('@articleTitle').then(articleTitle => {
            cy.get(ARNewsArticlesAddEditPage.getNewsArticles()).find('tr').eq(0).find('td').eq(1).should('have.text', articleTitle)
        })
    })

    it("Click 'Delete' button on the confirmation dialog then verify article no longer exist in article list", () => {
        // click Ok Button
        cy.get(ARNewsArticlesAddEditPage.getConfirmModal()).find(ARNewsArticlesAddEditPage.getConfirmModalBtnLinks()).contains('OK').click()
        ARDashboardPage.getMediumWait()

        // check Articles Delete from the list
        cy.get('@articleTitle').then(articleTitle => {
            cy.get(ARNewsArticlesAddEditPage.getNewsArticles()).find('tr').eq(0).find('td').eq(1).should('not.have.text', articleTitle)
        })
    })
})