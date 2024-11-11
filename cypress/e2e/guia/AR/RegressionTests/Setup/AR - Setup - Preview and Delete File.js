import { newsArticleDetails } from '../../../../../../helpers/TestData/NewsArticle/NewsArticleDetails'
import {images, resourcePaths} from "../../../../../../helpers/TestData/resources/resources"
import ARNewsArticlesAddEditPage from "../../../../../../helpers/AR/pageObjects/NewsArticles/ARNewsArticlesAddEditPage"
import ARPollsPage from "../../../../../../helpers/AR/pageObjects/Polls/ARPollsPage"
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"
import ARFilesPage from "../../../../../../helpers/AR/pageObjects/Setup/ARFilesPage"

const FILE_EXTENSIONS = ['jpg', 'png', 'gif']
let uploadedImageFileName = null;

describe('C6317 - AR - Setup - Preview and Delete File', function () {
    before(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getLongWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel("Engage", { timeout: 5000 }))).click({force: true})
        ARDashboardPage.getMenuItemOptionByName("News Articles", {timeout: 5000})

        // Create a new News Article
        ARPollsPage.getA5AddEditMenuActionsByNameThenClick("News Articles")
        ARDashboardPage.getShortWait()
        cy.get(ARNewsArticlesAddEditPage.getNameTxtF()).type(newsArticleDetails.newsArticleName)
        cy.get(ARNewsArticlesAddEditPage.getDescriptionTxtF()).type(newsArticleDetails.description)

        // Add article image
        cy.get(ARNewsArticlesAddEditPage.getChooseFileBtn()).click()
        // Upload image
        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({ force: true })
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_image_folder + images.absorb_logo_small_filename)
        cy.get(ARUploadFileModal.getA5SaveBtn()).click()    
        
        // Mark the new articles as 'Published'
        cy.get(ARNewsArticlesAddEditPage.getPublishedBtn()).click()
        ARDashboardPage.getLongWait()
        // Save the News Article
        cy.get(ARNewsArticlesAddEditPage.getSideBar()).contains("Save").click()
        ARNewsArticlesAddEditPage.getVLongWait()
       

        // Search and select newly created News Article
        cy.get(ARNewsArticlesAddEditPage.getArticleFilterBtn()).click()
        cy.get(ARNewsArticlesAddEditPage.getFilterPropertyContainer()).within(() => {
            cy.get('select').select('Title')
        })

        cy.get(ARNewsArticlesAddEditPage.getFilterOperatorContainer()).within(() => {
            cy.get('select').select('Equals')
        })
        cy.get(ARNewsArticlesAddEditPage.getFilterValueContainer()).within(() => {
            cy.get('input').type(newsArticleDetails.newsArticleName)
        })
        cy.get(ARNewsArticlesAddEditPage.getDropDownContainer()).within(() => {
            cy.get(ARNewsArticlesAddEditPage.getArticleFilterSubmitBtn()).click()
        })
        cy.get(ARNewsArticlesAddEditPage.getNewsArticlesFirstSearchResultItem()).click()
        ARNewsArticlesAddEditPage.getMediumWait()
        cy.get(ARNewsArticlesAddEditPage.getSideBar()).within(() => {
            cy.get(ARNewsArticlesAddEditPage.getEditMenuItem()).contains('Edit').click()
        })
        ARNewsArticlesAddEditPage.getMediumWait();
        cy.get(ARNewsArticlesAddEditPage.getArticleImageNameInput()).invoke('val').then(imageName => {
            let lastPathSeparatorIndex = imageName.lastIndexOf('/')
            uploadedImageFileName = imageName.substring(lastPathSeparatorIndex + 1)   
        })
    })

    after(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getVLongWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel("Engage", { timeout: 10000 }))).click()
        ARDashboardPage.getMenuItemOptionByName("News Articles")
        ARDashboardPage.getShortWait()
        cy.get(ARNewsArticlesAddEditPage.getArticleFilterBtn()).click()

        cy.get(ARNewsArticlesAddEditPage.getFilterPropertyContainer()).within(() => {
            cy.get('select').select('Title')
        })

        // Search and select newly created News Article
        cy.get(ARNewsArticlesAddEditPage.getArticleFilterBtn()).click()
        cy.get(ARNewsArticlesAddEditPage.getFilterPropertyContainer()).within(() => {
            cy.get('select').select('Title')
        })

        cy.get(ARNewsArticlesAddEditPage.getFilterOperatorContainer()).within(() => {
            cy.get('select').select('Equals')
        })
        cy.get(ARNewsArticlesAddEditPage.getFilterValueContainer()).within(() => {
            cy.get('input').type(newsArticleDetails.newsArticleName)
        })
        cy.get(ARNewsArticlesAddEditPage.getDropDownContainer()).within(() => {
            cy.get(ARNewsArticlesAddEditPage.getArticleFilterSubmitBtn()).click()
        })
        cy.get(ARNewsArticlesAddEditPage.getNewsArticlesFirstSearchResultItem()).click()
        ARNewsArticlesAddEditPage.getVShortWait()
        
        ARPollsPage.getA5AddEditMenuActionsByNameThenClick("Delete News Article")
        cy.get(ARNewsArticlesAddEditPage.getDeleteConfirmModal()).within(() => {
            cy.get('span').contains('OK').invoke('show').click({force: true})
        })
        ARNewsArticlesAddEditPage.getMediumWait()        
    })

    it('Open File Manager, Open a Sub-Folder and Validate Files are Displayed', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Click on Setup
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        // Click on files options
        ARDashboardPage.getMenuItemOptionByName('Files')
        ARDashboardPage.getMediumWait()

        cy.get(ARFilesPage.getSubFolder('Public')).eq(1).click({force: true})
        ARFilesPage.getMediumWait()
        cy.get(ARFilesPage.getSubFolder('NewsArticles')).eq(1).scrollIntoView().click({force: true})
        ARFilesPage.getMediumWait()
        cy.get(ARFilesPage.getFilFolderSearchContainer()).eq(0).within(() => {
            cy.get('input').invoke('show').type(uploadedImageFileName, {force: true})
        })
        ARFilesPage.getMediumWait()

        // Select a file other than image file types that a browser can display
        cy.get(ARFilesPage.getFileList()).then($els => {
            return $els.filter((i, el) => {
                return FILE_EXTENSIONS.filter(str => Cypress.$(el).text().includes(str)).length
            })
        }).as('viewableFiles')
        cy.get('@viewableFiles').then(files => files[0].click())
        ARFilesPage.getMediumWait()
        
        // Assert that there is a file delete option
        cy.get(ARFilesPage.getFileBrowserToolBar()).within(() => {
            cy.get(ARFilesPage.getFielDeleteIcon()).eq(0).find('span').should('exist')
        })
        // Assert that there is a file download option
        cy.get(ARFilesPage.getFileDownloadBtn()).should('exist')
        // Assert that there is a file preview option, and click to preview
        cy.get(ARFilesPage.getFileBrowserToolBar()).within(() => {
            cy.get(ARFilesPage.getFielPreviewIcon()).eq(1).invoke('show').click({force: true})
        })
        
        // Binding window:confirm event to mimic clicking 'OK' in browser confirm dialog
        cy.on('window:confirm', (str) => {
            expect(str).to.eq('Are you sure you want to delete this file?')
            return true
        })
        // Delete the selected file
        cy.get(ARFilesPage.getFileDeleteBtn()).eq(0).invoke('show').click({force: true})
        
    })    
})