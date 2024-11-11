import arBillboardsAddEditPage from "../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsAddEditPage";
import arBillboardsPage from "../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsPage";
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import arDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal";
import ARFileManagerUploadsModal from "../../../../../../helpers/AR/pageObjects/Modals/ARFileManagerUploadsModal";
import arUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal";
import { billboardsDetails } from "../../../../../../helpers/TestData/Billboard/billboardsDetails";
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails";
import { users } from "../../../../../../helpers/TestData/users/users";


let url = 'https://absorblms.com'

describe('C6281 Engage - Duplicate Billboard', function () {

  beforeEach(() => {

    //Login as admin
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    ARDashboardPage.getBillboardsReport()
  })
  after(function () {
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    ARDashboardPage.getBillboardsReport()
    // Search and delete billboard  
    arBillboardsPage.getShortWait()
    arBillboardsPage.AddFilter('Title', 'Starts With', billboardsDetails.billboardName + commonDetails.appendText)
    arBillboardsPage.selectTableCellRecord(billboardsDetails.billboardName + commonDetails.appendText, 2)
    cy.wrap(arBillboardsPage.WaitForElementStateToChange(arBillboardsPage.getAddEditMenuActionsByName('Delete Billboard'), 1000))
    cy.get(arBillboardsPage.getAddEditMenuActionsByName('Delete Billboard')).click()
    cy.get(arDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
    // Verify Billboard is deleted
    cy.get(ARDashboardPage.getToastNotificationMsg()).should('contain', 'Billboard has been deleted successfully')
  })

  it('should allow admin to add a Billboard', () => {

    cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Add Billboard'), 1000))
    //Click on Add Billboard form Right hand panel
    cy.get(arBillboardsPage.getElementByTitleAttribute('Add Billboard')).click()
    //Set the Toggle Published button as Yes
    cy.get(arBillboardsPage.getElementByDataNameAttribute(arBillboardsAddEditPage.getGeneralPublishedToggleContainer()) + ' ' + arBillboardsPage.getGeneralPublishedToggleStatusContainer()).should('have.attr', 'aria-hidden', 'true')
    //Enter the title name (Required field)
    cy.get(arBillboardsAddEditPage.getGeneralTitleTxtF()).clear().type(billboardsDetails.billboardName + commonDetails.appendText)
    //Enter the description
    cy.get(arBillboardsAddEditPage.getGeneralDescriptionTxtF()).type(`This is Billboard automation test`)
    //Select the Billboard Type as  'Image'
    cy.get(arBillboardsAddEditPage.getRadioBtnLabel()).contains('Image').click()
    /*After select Radio Button as image/Video => Two Radio button should be displayed :
                                                      1-File 
                                                      2-Url  */
    cy.get(arBillboardsAddEditPage.getRadioBtnLabel()).contains('File').should('exist')
    cy.get(arBillboardsAddEditPage.getRadioBtnLabel()).contains('Url').should('exist')
    //Select Url
    cy.get(arBillboardsAddEditPage.getRadioBtnLabel()).contains('Url').click()
    //URL should be given Successfully
    cy.get(arBillboardsAddEditPage.getElementByAriaLabelAttribute('Url')).type(url)
    //Select File
    cy.get(arBillboardsAddEditPage.getRadioBtnLabel()).contains('File').click()

    //Choose a file and select a file for billboard
    cy.get(arBillboardsAddEditPage.getChooseFileBtn()).click()
    //Apply any filter (File type, Upload type, Tags and courses) from left hand side like this
    cy.get(arBillboardsAddEditPage.getElementByAriaLabelAttribute('File Type')).contains('Other').click().click()
    cy.get(arBillboardsAddEditPage.getElementByAriaLabelAttribute('Upload Type')).contains('Billboards').click().click()
    cy.get(arBillboardsAddEditPage.getElementByDataNameAttribute('Tags')).click()
    cy.get(ARFileManagerUploadsModal.getFlyoutMenu()).within(() => {
      cy.get(ARFileManagerUploadsModal.getTagsDDownSelectOption()).eq(0).click()
    })
    cy.get(arBillboardsAddEditPage.getElementByDataNameAttribute('Courses')).click()
    cy.get(ARFileManagerUploadsModal.getFlyoutMenu()).within(() => {
      cy.get(ARFileManagerUploadsModal.getTagsDDownSelectOption()).eq(0).click()
    })

    //Search any keyword in search bar (if available)
    cy.get(arBillboardsAddEditPage.getElementByAriaLabelAttribute('Search Files')).click().clear().type('web')
    //Result should be found as per the keyword.
    cy.get(arBillboardsAddEditPage.getSearchResultMsg()).should('not.be', 'Showing 0 of 0 files')
    ////Search any keyword in search bar (if  not available)
    cy.get(arBillboardsAddEditPage.getElementByAriaLabelAttribute('Search Files')).click().clear().type('certificate')
    //Messege should be displayed "Showing 0 of 0 files"
    cy.get(arBillboardsAddEditPage.getSearchResultMsg()).should('contain', 'Showing 0 of 0 files')
    //Click on upload button from right side corner
    cy.get(arUploadFileModal.getMediaLibraryUploadBtn()).click()
    //Select the choose file
    //File should be uploaded.
    cy.get(arUploadFileModal.getFilePathTxt()).attachFile(billboardsDetails.uploadPath)
    //By default Visibility should be set as "Public"
    cy.get(arBillboardsAddEditPage.getElementByDataNameAttribute('label')).should('contain', 'Public')
    // Save the billboard
    arBillboardsAddEditPage.getLShortWait()
    //Click on save button on modal 
    cy.get(arUploadFileModal.getSaveBtn()).click()
    //waiting a little bit
    ARDashboardPage.getMediumWait()
    //clicking on save button on the Add Billboard page
    cy.get(arBillboardsAddEditPage.getSaveBtn()).click()


  })


  it('should allow admin to duplicate a Billboard', () => {

    // Search created billboard  
    arBillboardsPage.getShortWait()
    arBillboardsPage.AddFilter('Title', 'Starts With', billboardsDetails.billboardName + commonDetails.appendText)
    arBillboardsPage.selectTableCellRecord(billboardsDetails.billboardName + commonDetails.appendText, 2)
    arBillboardsPage.getMediumWait()
    cy.get(arBillboardsPage.getAddEditMenuActionsByName('Duplicate Billboard')).click()
    //Set the Toggle Published button as Yes
    cy.get(arBillboardsPage.getElementByDataNameAttribute(arBillboardsAddEditPage.getGeneralPublishedToggleContainer()) + ' ' + arBillboardsPage.getGeneralPublishedToggleStatusContainer()).should('have.attr', 'aria-hidden', 'true')
    //Filled the All the necessary Field
    cy.get(arBillboardsAddEditPage.getGeneralTitleTxtF()).clear().type(billboardsDetails.billboardName + commonDetails.appendText)
    cy.get(arBillboardsAddEditPage.getGeneralDescriptionTxtF()).type(`This is Billboard automation test`)
    cy.get(arBillboardsAddEditPage.getRadioBtnLabel()).contains('Image').click()
    cy.get(arBillboardsAddEditPage.getRadioBtnLabel()).contains('Url').click()
    cy.get(arBillboardsAddEditPage.getElementByAriaLabelAttribute('Url')).type(url)
    cy.get(arBillboardsAddEditPage.getRadioBtnLabel()).contains('File').click()
    cy.get(arBillboardsAddEditPage.getChooseFileBtn()).click()
    cy.get(arBillboardsAddEditPage.getElementByAriaLabelAttribute('File Type')).contains('Other').click().click()
    cy.get(arBillboardsAddEditPage.getElementByAriaLabelAttribute('Upload Type')).contains('Billboards').click().click()
    cy.get(arBillboardsAddEditPage.getElementByDataNameAttribute('Tags')).click()
    cy.get(ARFileManagerUploadsModal.getFlyoutMenu()).within(() => {
      cy.get(ARFileManagerUploadsModal.getTagsDDownSelectOption()).eq(0).click()
    })
    cy.get(arBillboardsAddEditPage.getElementByDataNameAttribute('Courses')).click()
    cy.get(ARFileManagerUploadsModal.getFlyoutMenu()).within(() => {
      cy.get(ARFileManagerUploadsModal.getTagsDDownSelectOption()).eq(0).click()
    })
    cy.get(arUploadFileModal.getMediaLibraryUploadBtn()).click()
    cy.get(arUploadFileModal.getFilePathTxt()).attachFile(billboardsDetails.uploadPath)
    //By default Visibility should be set as "Public"
    cy.get(arBillboardsAddEditPage.getElementByDataNameAttribute('label')).should('contain', 'Public')
    // Save the billboard
    arBillboardsAddEditPage.getLShortWait()
    //Click on save button on modal 
    cy.get(arUploadFileModal.getSaveBtn()).click()
    //waiting a little bit
    ARDashboardPage.getMediumWait()
    //clicking on save button on the Add Billboard page
    cy.get(arBillboardsAddEditPage.getSaveBtn()).click()

  })

})



