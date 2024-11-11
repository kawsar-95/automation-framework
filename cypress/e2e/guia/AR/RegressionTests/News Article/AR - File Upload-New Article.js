import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import A5GlobalResourceAddEditPage from '../../../../../../helpers/AR/pageObjects/GlobalResources/A5GlobalResourceAddEditPage'
import ARNewsArticlesAddEditPage from '../../../../../../helpers/AR/pageObjects/NewsArticles/ARNewsArticlesAddEditPage'
import ARUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import { users } from '../../../../../../helpers/TestData/users/users'
import arPollsPage from '../../../../../../helpers/AR/pageObjects/Polls/ARPollsPage'
import { newsArticleDetails } from '../../../../../../helpers/TestData/NewsArticle/NewsArticleDetails'
import { resourcePaths, images } from '../../../../../../helpers/TestData/resources/resources'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LENewsPage from '../../../../../../helpers/LE/pageObjects/News/LENewsPage'
import arPollAddEditPage from '../../../../../../helpers/AR/pageObjects/Polls/ARPollsAddEditPage'

describe('AR - File Upload -News Articles', function () {

    beforeEach(function() {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Engage'))).click()
        arDashboardPage.getMenuItemOptionByName('News Articles')
    })

    it('Verify user is able to create a News Article and upload File in it', () => {

       arPollsPage.getA5AddEditMenuActionsByNameThenClick('News Articles')
       arDashboardPage.getShortWait()
    //Check if User is navigated to Add reosurce page
    ARNewsArticlesAddEditPage.getAddResourcePage()

    //Enter valid resource name
    cy.get(ARNewsArticlesAddEditPage.getNameTxtF()).type(newsArticleDetails.newsArticleName)

     // Add Description
     cy.get(ARNewsArticlesAddEditPage.getDescriptionTxtF()).type(newsArticleDetails.description)
    
     //Open Upload File Pop up
     cy.get(A5GlobalResourceAddEditPage.getChooseFileBtn()).click()
     // Check if Upload File pop up is opened
    A5GlobalResourceAddEditPage.getUploadFilePopUpWindow()
     cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({force:true})
     cy.get('input[type="file"]').attachFile(resourcePaths.resource_image_folder + images.moose_filename)
     arDashboardPage.getShortWait()
     //Check If Public radio button is selected
    A5GlobalResourceAddEditPage.getAvailabilityPublicRadoioBtnSelected()
     //Change Visibiliy to Private
     A5GlobalResourceAddEditPage.getAvailabilityPrivateBtn()
    cy.get(ARUploadFileModal.getA5SaveBtn()).click()
    cy.get(arPollAddEditPage.getA5IsPublishedToggleON()).click()

     //Save News Article
     cy.get(A5GlobalResourceAddEditPage.getA5SaveBtn()).click()
     arDashboardPage.getShortWait()
      //Filter for global resource and edit
      A5GlobalResourceAddEditPage.A5AddFilter('Title', 'Contains', newsArticleDetails.newsArticleName)
      arDashboardPage.getShortWait()
      cy.get(arDashboardPage.getA5TableCellRecordByColumn(2)).contains( newsArticleDetails.newsArticleName).click()
      cy.wrap(arDashboardPage.A5WaitForElementStateToChange(arDashboardPage.getA5AddEditMenuActionsByIndex(1), 1000))
      arDashboardPage.getA5AddEditMenuActionsByNameThenClick('Edit')
      arDashboardPage.getShortWait()
      //Verify name persisted
      cy.get(ARNewsArticlesAddEditPage.getNameTxtF()).should('have.value',  newsArticleDetails.newsArticleName)
    //Verify file upload persisted
        cy.get(ARNewsArticlesAddEditPage.getFileTxtF()).invoke('val').then((val) => {
        expect(val).to.contain(images.moose_filename.slice(0, -4))
    })

    //Open Uploaded File Pop up
        cy.get(A5GlobalResourceAddEditPage.getChooseFileBtn()).click()
        // Check if Upload File pop up is opened
        A5GlobalResourceAddEditPage.getUploadFilePopUpWindow()
        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({force:true})
        cy.get('input[type="file"]').attachFile(resourcePaths.resource_image_folder + images.moose_filename)
        arDashboardPage.getShortWait()

        //Verify file upload persisted in Upload File pop up
        cy.get(ARNewsArticlesAddEditPage.getFileTxtF()).invoke('val').then((val) => {
        expect(val).to.contain(images.moose_filename.slice(0, -4))
    })
        //Verify if Previously selected Permission level Persist
        A5GlobalResourceAddEditPage.getAvailabilityPrivateRadoioBtnSelected()
        cy.get(A5GlobalResourceAddEditPage.getFileUpdateInformationText()).invoke('text').should('contain', users.sysAdmin.admin_sys_01_lname) 
        //Update File
        cy.get(ARUploadFileModal.getA5ChooseFileBtn()).click({force:true})
        cy.get('input[type="file"]').attachFile(resourcePaths.resource_image_folder + images.bluetooth_filename) 
       
        //Change Visibiliy to Public
        A5GlobalResourceAddEditPage.getAvailabilityPublicBtn()
        arDashboardPage.getShortWait()
        cy.get(ARUploadFileModal.getA5SaveBtn()).click()
        arDashboardPage.getShortWait()
        //Save Global Resource
        cy.get(A5GlobalResourceAddEditPage.getA5SaveBtn()).click()
})

it('Verify User can see Created Data at Learner Side', () => {
    // Login LE
    cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password) 
    //Verify News tile
    LEDashboardPage.getTileByNameThenClick('Latest News')
    cy.get(LENewsPage.getNewsPageTitle()).should('contain', 'Latest News')
    LENewsPage.getNewsArticleByTitle(newsArticleDetails.newsArticleName).should('be.visible')
  
})  

})  

  
