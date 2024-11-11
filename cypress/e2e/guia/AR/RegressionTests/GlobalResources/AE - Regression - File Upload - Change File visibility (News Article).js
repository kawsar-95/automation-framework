import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import A5GlobalResourceAddEditPage from '../../../../../../helpers/AR/pageObjects/GlobalResources/A5GlobalResourceAddEditPage'
import ARUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { resourcePaths, images } from '../../../../../../helpers/TestData/resources/resources'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARCouponsAddEditPage from '../../../../../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage'
import { newsArticleDetails } from '../../../../../../helpers/TestData/NewsArticle/NewsArticleDetails'
import ARNewsArticlesAddEditPage from '../../../../../../helpers/AR/pageObjects/NewsArticles/ARNewsArticlesAddEditPage'
import ARPollsAddEditPage from '../../../../../../helpers/AR/pageObjects/Polls/ARPollsAddEditPage'
import ARPollsPage from '../../../../../../helpers/AR/pageObjects/Polls/ARPollsPage'
import LENewsPage from '../../../../../../helpers/LE/pageObjects/News/LENewsPage'

describe('C5166 - AE -  Regression - File Upload - Change File visibility (News Article) ', function () {
    beforeEach("Prerequisite", function () {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getNewsArticlesReport()
        cy.get(ARCouponsAddEditPage.getA5PageHeaderTitle()).should('contain', 'News Articles')
    })

    after(function () {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getNewsArticlesReport()
        cy.get(ARCouponsAddEditPage.getA5PageHeaderTitle()).should('contain', 'News Articles')
        A5GlobalResourceAddEditPage.A5AddFilter('Title', 'Contains', newsArticleDetails.newsArticleName)
        cy.get(ARDashboardPage.getA5TableCellRecordByColumn(2)).contains(newsArticleDetails.newsArticleName).click()
        cy.wrap(ARDashboardPage.A5WaitForElementStateToChange(ARDashboardPage.getA5AddEditMenuActionsByIndex(2), 1000))
        ARDashboardPage.getA5AddEditMenuActionsByNameThenClick('Delete News Article')
        cy.get(ARDeleteModal.getA5OKBtn()).click()
        cy.get(ARDashboardPage.getA5NoResultMsg()).should('be.visible')
    })

    it('Verify Admin Can Create a New News Article and Change File Visibility', () => {
        ARPollsPage.getA5AddEditMenuActionsByNameThenClick('News Articles')
        ARNewsArticlesAddEditPage.getAddResourcePage()
        //Enter valid title 
        cy.get(ARNewsArticlesAddEditPage.getNameTxtF()).type(newsArticleDetails.newsArticleName)
        //Enter description
        cy.get(ARNewsArticlesAddEditPage.getDescriptionTxtF()).type(newsArticleDetails.description)
        //Open Upload File Pop up
        cy.get(A5GlobalResourceAddEditPage.getChooseFileBtn()).click()
        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({ force: true })
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_image_folder + images.moose_filename)
        //Check If Public radio button is selected
        A5GlobalResourceAddEditPage.getAvailabilityPublicRadoioBtnSelected()
        cy.get(ARUploadFileModal.getA5SaveBtn()).click()
        cy.get(ARDashboardPage.getA5Modal()).should('not.be.visible')
        cy.get(ARPollsAddEditPage.getA5IsPublishedToggleON()).click()
        cy.get(A5GlobalResourceAddEditPage.getA5SaveBtn()).click()
        cy.get(ARCouponsAddEditPage.getA5PageHeaderTitle()).should('contain', 'News Articles')
    })

    it('Verify Admin can edit Competency and Change File Visibility', () => {
        //Filter for global resource and edit
        A5GlobalResourceAddEditPage.A5AddFilter('Title', 'Contains', newsArticleDetails.newsArticleName)
        cy.get(ARDashboardPage.getA5TableCellRecordByColumn(2)).contains(newsArticleDetails.newsArticleName).click()
        cy.wrap(ARDashboardPage.A5WaitForElementStateToChange(ARDashboardPage.getA5AddEditMenuActionsByIndex(1), 1000))
        ARDashboardPage.getA5AddEditMenuActionsByNameThenClick('Edit')
        //Verify name persisted
        cy.get(ARNewsArticlesAddEditPage.getNameTxtF()).should('have.value', newsArticleDetails.newsArticleName)
        //Verify file upload persisted
        cy.get(ARNewsArticlesAddEditPage.getFileTxtF()).invoke('val').then((val) => {
            expect(val).to.contain(images.moose_filename.slice(0, -4))
        })
        //Open Uploaded File Pop up
        cy.get(A5GlobalResourceAddEditPage.getChooseFileBtn()).click()
        // Check if Upload File pop up is opened
        A5GlobalResourceAddEditPage.getUploadFilePopUpWindow()
        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({ force: true })
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_image_folder + images.moose_filename)
        //Verify file upload persisted in Upload File pop up
        cy.get(ARNewsArticlesAddEditPage.getFileTxtF()).invoke('val').then((val) => {
            expect(val).to.contain(images.moose_filename.slice(0, -4))
        })
        A5GlobalResourceAddEditPage.getAvailabilityPrivateBtn()
        //Verify if Previously selected Permission level Persist
        A5GlobalResourceAddEditPage.getAvailabilityPrivateRadoioBtnSelected()
        cy.get(A5GlobalResourceAddEditPage.getFileUpdateInformationText()).should('exist')
        //Update File
        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({ force: true })
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_image_folder + images.happy_qas_filename)
        //Change Visibiliy to Public
        A5GlobalResourceAddEditPage.getAvailabilityPublicBtn()
        cy.get(ARUploadFileModal.getA5SaveBtn()).click()
        cy.get(ARDashboardPage.getA5Modal()).should('not.be.visible')
        //Save Global Resource
        cy.get(A5GlobalResourceAddEditPage.getA5SaveBtn()).click()
        cy.get(ARCouponsAddEditPage.getA5PageHeaderTitle()).should('contain', 'News Articles')
    })

    it('Verify User can see uploaded File at Learner Side', () => {
        // Login LE
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        //Verify News tile
        LEDashboardPage.getTileByNameThenClick('Latest News')
        cy.get(LENewsPage.getNewsPageTitle()).should('contain', 'Latest News')
        LENewsPage.getNewsArticleByTitle(newsArticleDetails.newsArticleName).should('be.visible')
    })
})

