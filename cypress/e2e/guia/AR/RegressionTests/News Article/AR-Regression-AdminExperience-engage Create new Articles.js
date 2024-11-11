import { users } from "../../../../../../helpers/TestData/users/users"
import arDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARPollsPage from "../../../../../../helpers/AR/pageObjects/Polls/ARPollsPage"
import ARNewsArticlesAddEditPage from "../../../../../../helpers/AR/pageObjects/NewsArticles/ARNewsArticlesAddEditPage"
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import { newsArticleDetails } from '../../../../../../helpers/TestData/NewsArticle/NewsArticleDetails'
import {
  images,
  resourcePaths,
} from "../../../../../../helpers/TestData/resources/resources"

let currentArticle = null

describe("C6296 - AR - Regression - Create News Articles", function () {
  beforeEach(() => {
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
    cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel("Engage", { timeout: 5000 }))).click()
    arDashboardPage.getMenuItemOptionByName("News Articles")
    ARPollsPage.getA5AddEditMenuActionsByNameThenClick("News Articles")
    arDashboardPage.getShortWait()
    cy.get(ARNewsArticlesAddEditPage.getNameTxtF()).type(newsArticleDetails.newsArticleName)
    cy.get(ARNewsArticlesAddEditPage.getDescriptionTxtF()).type("News Descriptions")

    // Add article image
    cy.get(ARNewsArticlesAddEditPage.getChooseFileBtn()).click()
    // Upload image
    cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({ force: true })
    cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_image_folder + images.moose_filename)
    cy.get(ARUploadFileModal.getA5SaveBtn()).click()
  
    // Choose other author other than logged-in admin
    cy.get(ARNewsArticlesAddEditPage.getDropDown()).click()
    arDashboardPage.getShortWait()
    cy.get(ARNewsArticlesAddEditPage.getDropDownSearchTxtF()).type(users.adminLogInOut.admin_loginout_username)
    arDashboardPage.getShortWait()
    cy.get(ARNewsArticlesAddEditPage.getDropDownOpt()).eq(0).click()  
    // Mark the new articles as 'Published'
    cy.get(ARNewsArticlesAddEditPage.getPublishedBtn()).click()
    // Set availabilit rules
    cy.get(ARNewsArticlesAddEditPage.getAvailabilityTab()).click()
    cy.get(ARNewsArticlesAddEditPage.getAddRuleContainer()).within(() => {
      cy.contains("Add Rule").click()
    })        
    // Add an avialabilit rules
    ARNewsArticlesAddEditPage.getPropertyAndSelect()
    ARNewsArticlesAddEditPage.getOperatorAndSelect()
    cy.get(ARNewsArticlesAddEditPage.getRuleTxtInput()).find("input").type("This is Rule")
    currentArticle = newsArticleDetails.newsArticleName
  })

  afterEach(function () {    
    if (currentArticle != null) {
      cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
      cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel("Engage", { timeout: 5000 }))).click()
      arDashboardPage.getMenuItemOptionByName("News Articles")
      arDashboardPage.getShortWait()
      cy.get(ARNewsArticlesAddEditPage.getArticleFilterBtn()).click()
      
      cy.get(ARNewsArticlesAddEditPage.getFilterPropertyContainer()).within(() => {
        cy.get('select').select('Title')
      })

      cy.get(ARNewsArticlesAddEditPage.getFilterOperatorContainer()).within(() => {
        cy.get('select').select('Equals')
      })

      cy.get(ARNewsArticlesAddEditPage.getFilterValueContainer()).within(() => {
        cy.get('input').type(currentArticle)
      })

      cy.get(ARNewsArticlesAddEditPage.getDropDownContainer()).within(() => {
        cy.get(ARNewsArticlesAddEditPage.getArticleFilterSubmitBtn()).click()
      })

      // Search for the created News Article.
      cy.get(ARNewsArticlesAddEditPage.getNewsArticlesFirstSearchResultItem()).click()
      ARNewsArticlesAddEditPage.getShortWait()
      ARPollsPage.getA5AddEditMenuActionsByNameThenClick("Delete News Article")
      ARNewsArticlesAddEditPage.getLShortWait()
      cy.get(ARNewsArticlesAddEditPage.getFooter()).within(() => {
        cy.get(ARNewsArticlesAddEditPage.getDeleteConfirmDialogOkBtn()).eq(0).contains('OK').click()
      })
    }
  })

  it("Save a news article ", function () {
    cy.get(ARNewsArticlesAddEditPage.getSideBar()).contains("Save").click()
    ARNewsArticlesAddEditPage.getShortWait()
  })

  it("Cancel and don't save news article when prompted", () => {
    cy.get(ARNewsArticlesAddEditPage.getSideBar()).contains("Cancel").click()
    ARNewsArticlesAddEditPage.getShortWait()
    cy.get(ARNewsArticlesAddEditPage.getFooter()).contains("Don't Save").click()
    ARNewsArticlesAddEditPage.getShortWait()
    currentArticle = null
  })

  it("Cancel and cancel saving news article when prompted", () => {
    cy.get(ARNewsArticlesAddEditPage.getSideBar()).contains("Cancel").click()
    ARNewsArticlesAddEditPage.getShortWait()
    cy.get(ARNewsArticlesAddEditPage.getFooter()).contains("Cancel").click()
    ARNewsArticlesAddEditPage.getShortWait()
    currentArticle = null
  })

  it("Cancel and save the news article when prompted", () => {
    cy.get(ARNewsArticlesAddEditPage.getSideBar()).contains("Cancel").click()
    ARNewsArticlesAddEditPage.getShortWait()
    cy.get(ARNewsArticlesAddEditPage.getFooter()).within(() => {
      cy.get(ARNewsArticlesAddEditPage.getCancelDialogOkBtn()).eq(0).click()
    })
  })
})
