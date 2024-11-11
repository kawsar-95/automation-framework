import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import A5GlobalResourceAddEditPage from '../../../../../../helpers/AR/pageObjects/GlobalResources/A5GlobalResourceAddEditPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARCouponsAddEditPage from '../../../../../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage'
import { newsArticleDetails } from '../../../../../../helpers/TestData/NewsArticle/NewsArticleDetails'
import ARNewsArticlesAddEditPage from '../../../../../../helpers/AR/pageObjects/NewsArticles/ARNewsArticlesAddEditPage'
import ARPollsAddEditPage from '../../../../../../helpers/AR/pageObjects/Polls/ARPollsAddEditPage'
import ARPollsPage from '../../../../../../helpers/AR/pageObjects/Polls/ARPollsPage'

describe('C7416 - AUT-717 - AE Regression - News Articles - Delete a News Article', function () {

    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

    })

    it('Create News Article', () => {
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Engage'))).click()
        // Asserting News Article list page should open.
        ARDashboardPage.getMenuItemOptionByName('News Articles')
        ARDashboardPage.getShortWait()
        cy.get(ARCouponsAddEditPage.getA5PageHeaderTitle()).should('contain', 'News Articles')
        ARDashboardPage.getShortWait()
        // Create new News Article 
        ARPollsPage.getA5AddEditMenuActionsByNameThenClick('News Articles')
        ARPollsPage.getMediumWait()
        //Enter valid title 
        cy.get(ARNewsArticlesAddEditPage.getNameTxtF()).type(newsArticleDetails.newsArticleName)
        //Enter description
        cy.get(ARNewsArticlesAddEditPage.getDescriptionTxtF()).type(newsArticleDetails.description)
        ARDashboardPage.getMediumWait()
        cy.get(ARPollsAddEditPage.getA5IsPublishedToggleON()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getA5SaveBtn()).click()
        ARDashboardPage.getLongWait()
    })

    it('Verify Admin Can User should have permission to delete a News Article', () => {
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Engage'))).click()
        // Asserting News Article list page should open.
        ARDashboardPage.getMenuItemOptionByName('News Articles')
        ARDashboardPage.getShortWait()
        cy.get(ARCouponsAddEditPage.getA5PageHeaderTitle()).should('contain', 'News Articles')
        ARDashboardPage.getShortWait()
        // Assert News Article list page should open.
        A5GlobalResourceAddEditPage.A5AddFilter('Title', 'Contains', newsArticleDetails.newsArticleName)
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getShortWait()
        ARDashboardPage.getA5AddEditMenuActionsByNameThenClick('Delete News Article')
        ARDashboardPage.getShortWait()
        // Assert Are you sure you want to delete 'News Article name'?
        ARDashboardPage.getMediumWait()
        cy.get(ARDeleteModal.getA5OKBtn()).click()
        ARDashboardPage.getShortWait()
        // Asserting Message News Article should be deleted successfully
        cy.get(ARDashboardPage.getA5NoResultMsg()).should('be.visible')
    })

})

