import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import A5GlobalResourceAddEditPage from "../../../../../../helpers/AR/pageObjects/GlobalResources/A5GlobalResourceAddEditPage"
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import ARNewsArticlesAddEditPage from "../../../../../../helpers/AR/pageObjects/NewsArticles/ARNewsArticlesAddEditPage"
import { newsArticleDetails } from "../../../../../../helpers/TestData/NewsArticle/NewsArticleDetails"
import { images, resourcePaths } from "../../../../../../helpers/TestData/resources/resources"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C5170 - File Upload - File Visibility - Helper Text', () => {
    beforeEach(() => {
        // Login as admin/ Blatant admin.
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            '/admin'
        )
    })
    it('File Upload - File Visibility - Helper Text', () => {
        ARDashboardPage.getMediumWait()
        //Navigate to News Article
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Engage")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("News Article"))
        ARDashboardPage.getMediumWait()
        // Click on Add New Resource or edit existing News Article
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click({ force: true })
        ARDashboardPage.getLongWait()
        //Add title and description 
        cy.get(ARNewsArticlesAddEditPage.getNameTxtF()).type(newsArticleDetails.newsArticleName)
        cy.get(ARNewsArticlesAddEditPage.getDescriptionTxtF()).type(newsArticleDetails.description)
        
        // Click on Choose File button in File (or URL) field
        cy.get(A5GlobalResourceAddEditPage.getChooseFileBtn()).click()
        // Select any file from File manager
        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({ force: true })
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_image_folder + images.moose_filename)

        // Text when Public visbility is selected
        cy.get(ARUploadFileModal.getHelperTxt()).should('contain', ARUploadFileModal.getPublicText())
        //Select Private visibility
        cy.get('div.radio-options').should('exist')
        cy.get(ARUploadFileModal.getPublicPrivateRadioBtn()).contains('Private').should('exist').click({ force: true })
        //Text when Private visibility is selected.
        cy.get(ARUploadFileModal.getHelperTxt()).should('contain', ARUploadFileModal.getPrivateText())
    })
})