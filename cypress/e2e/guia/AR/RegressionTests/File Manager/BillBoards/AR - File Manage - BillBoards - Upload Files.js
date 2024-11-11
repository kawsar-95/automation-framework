import { users } from '../../../../../../../helpers/TestData/users/users'
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arBillboardsPage from '../../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsPage'
import arBillboardsAddEditPage from '../../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsAddEditPage'
import arUploadFileModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import { billboardsDetails } from '../../../../../../../helpers/TestData/Billboard/billboardsDetails'
import arAddEditCategoryPage from '../../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage'
//import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import arDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'

let j = 0;  //Global variable to count the number of times a billboard is created 

describe('AR-Billboard-Adding and Update the Category',()=>{
    let  i=0;
    beforeEach(()=>{
      cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
      cy.url().should('include','myabsorb')
      cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Engage',{timeout:5000}))).click()
      arDashboardPage.getMenuItemOptionByName('Billboards')
      cy.intercept('/api/rest/v2/admin/reports/billboards/operations').as('getBillBoard').wait('@getBillBoard');
    })

    after(function () {
      let i = 3;
      cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
      cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Engage',{timeout:5000}))).click()
      arDashboardPage.getMenuItemOptionByName('Billboards')
      cy.intercept('/api/rest/v2/admin/reports/billboards/operations').as('getBillBoard').wait('@getBillBoard');
       
    // Search and delete billboard 
      for (j; j>0; j--){
     //   if (i>0){
      arBillboardsPage.getShortWait()
      arBillboardsPage.AddFilter('Title', 'Starts With', billboardsDetails.billboardFileManagerName)
      arBillboardsPage.selectTableCellRecord(billboardsDetails.billboardFileManagerName, 2)
      cy.wrap(arBillboardsPage.WaitForElementStateToChange(arBillboardsPage.getAddEditMenuActionsByName('Delete Billboard'), 1000))
      cy.get(arBillboardsPage.getAddEditMenuActionsByName('Delete Billboard')).click()
      cy.get(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click()
       }
    // else if(i==0){
          // Verify Billboards are deleted
          cy.get(arDashboardPage.getNoResultMsg()).should('have.text', "No results found.")
      //  }
    })

   it("Create new Billboards and upload Image and Video files",()=>{
   
    //Verify navigated window
    cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "Billboards")
    cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Add Billboard'), 1000))

    for (let i = 0; i < 3; i++) {
    
      cy.get(arCoursesPage.getCoursesActionsButtonsByLabel('Add Billboard')).click()
      cy.get(arAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Add Billboard")
      cy.get(arBillboardsPage.getElementByDataNameAttribute(arBillboardsAddEditPage.getGeneralPublishedToggleContainer())+ ' ' +arBillboardsPage.getGeneralPublishedToggleStatusContainer()).should('have.attr', 'aria-hidden', 'true')
      cy.get(arBillboardsAddEditPage.getGeneralTitleTxtF()).clear().type(billboardsDetails.billboardFileManagerName)
      cy.get(arBillboardsAddEditPage.getGeneralDescriptionTxtF()).type(billboardsDetails.billboardDescriptionForFileManager)
      
      switch(i){
          case 0:
            cy.addContext('Uploading an Image file')
                arBillboardsAddEditPage.getBillBoardImageRadioBtn("Image")  
                cy.get(arBillboardsAddEditPage.getChooseFileBtn()).click()
        
        //Select upload from the media library
        cy.get(arUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(arUploadFileModal.getFilePathTxt()).attachFile(billboardsDetails.uploadPathU)
        
        // Save the billboard
        arBillboardsAddEditPage.getLShortWait()
        cy.get(arUploadFileModal.getSaveBtn()).click()
        arBillboardsAddEditPage.getLongWait()
        cy.intercept('**/reports/files').as('getBillboards1')
        arBillboardsAddEditPage.getLongWait()
        cy.get(arBillboardsAddEditPage.getSaveBtn()).click()
        cy.intercept('**/reports/billboards').as('getBillboards2')
        break;

        case 1:
          cy.addContext('Uploading an WebM Video file')
        arBillboardsAddEditPage.getBillBoardVideoRadioBtn("Video")
        cy.get(arBillboardsAddEditPage.getWebMChosseBtn()).click()
        cy.get(arUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(arUploadFileModal.getFilePathTxt()).attachFile(billboardsDetails.uploadPathWU)
         // Save the billboard
         arBillboardsAddEditPage.getVShortWait()
         cy.get(arUploadFileModal.getSaveBtn()).click()
         arBillboardsAddEditPage.getHFJobWait()
         cy.get(arBillboardsAddEditPage.getSaveBtn()).click()
         cy.intercept('**/reports/billboards').as('getBillboards2').wait('@getBillboards2');
        break;

        case 2:
          cy.addContext('Uploading an MP4 video file')
          arBillboardsAddEditPage.getBillBoardVideoRadioBtn("Video")
          cy.get(arBillboardsAddEditPage.getMP4ChooseBtn()).click()
          cy.get(arUploadFileModal.getMediaLibraryUploadBtn()).click()
          cy.get(arUploadFileModal.getFilePathTxt()).attachFile(billboardsDetails.uploadPathVU)
           // Save the billboard
           arBillboardsAddEditPage.getVShortWait()
           cy.get(arUploadFileModal.getSaveBtn()).click()
           arBillboardsAddEditPage.getHFJobWait()
           cy.get(arBillboardsAddEditPage.getSaveBtn()).click()
           cy.intercept('**/reports/billboards').as('getBillboards3').wait('@getBillboards3');
           break;

      default:
        cy.addContext(`Invalid file type selection`)
       break;
      }
      j++;
    }
      arBillboardsPage.AddFilter('Title', 'Starts With', `${billboardsDetails.billboardFileManagerName}`)
  })
})