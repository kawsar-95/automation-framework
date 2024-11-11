import { users } from '../../../../../../helpers/TestData/users/users'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARBillboardsPage from '../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsPage'
import ARBillboardsAddEditPage from '../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsAddEditPage'
import arUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import { billboardsDetails } from '../../../../../../helpers/TestData/Billboard/billboardsDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'

describe('AR - BillBoards -Create New BillBoard', () => {

  beforeEach(() => {

    // Sign in with System Admin account
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    //Navigate to Billboard Page
    ARDashboardPage.getBillboardsReport()

  })




  it("Create New BillBoard", () => {

    //Go to Add Billboard
    cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Billboard')).click()
    ARDashboardPage.getMediumWait()

    //Check publish is on or off by default is on
    ARBillboardsAddEditPage.getPublishToggleChkbx()

    //Add Title
    cy.get(ARBillboardsAddEditPage.getGeneralTitleTxtF()).clear().type(billboardsDetails.billboardName)
    
    //Add Description
    cy.get(ARBillboardsAddEditPage.getGeneralDescriptionTxtF()).type(billboardsDetails.billboardDescription)


    //Add BillBoard Image
    //Select Image Radio Button
    ARBillboardsAddEditPage.getBillBoardImageRadioBtn("Image")

    //Upload File
    cy.get(ARBillboardsAddEditPage.getChooseFileBtn()).click()

    //Select upload from the media library
    cy.get(arUploadFileModal.getMediaLibraryUploadBtn()).click()
    cy.get(arUploadFileModal.getFilePathTxt()).attachFile(billboardsDetails.uploadPath)
    ARDashboardPage.getShortWait()

    //Now Click On Save
    cy.get(ARBillboardsAddEditPage.getFileBrowserModal()).within(() => {
      cy.get(ARBillboardsAddEditPage.getFileBrowserSaveBtn()).click({ force: true })
    })


    ARDashboardPage.getMediumWait()

    //Add BillBoard Video
    ARBillboardsAddEditPage.getBillBoardVideoRadioBtn("Video")
    ARDashboardPage.getShortWait()

    //Choose Video Sources WebM
    cy.get(ARBillboardsAddEditPage.getWebMChosseBtn()).click()

    //Upload Media
    cy.get(arUploadFileModal.getMediaLibraryUploadBtn()).click()
    cy.get(arUploadFileModal.getFilePathTxt()).attachFile(billboardsDetails.uploadPathW)
    ARDashboardPage.getShortWait()

    //Now Click On Save
    cy.get(ARBillboardsAddEditPage.getFileBrowserModal()).within(() => {
      cy.get(ARBillboardsAddEditPage.getFileBrowserSaveBtn()).click({ force: true })
    })
    ARBillboardsAddEditPage.getHFJobWait()

    //Click on save button
    cy.get(ARBillboardsAddEditPage.getSaveBtn()).click()
    ARDashboardPage.getMediumWait()

  })

  it("Now Update And Change Newly Created BillBoard", () => {
    //Filter and Find the existing billboard
    ARBillboardsPage.AddFilter('Title', 'Contains', billboardsDetails.billboardName)
    ARDashboardPage.getMediumWait()

    //Select Billboard
    cy.get(ARDashboardPage.getGridTable()).eq(0).click()
    ARDashboardPage.getMediumWait()

    //Select Edit BillBoard Button
    cy.get(ARBillboardsPage.getAddEditMenuActionsByName('Edit Billboard')).click()
    ARDashboardPage.getMediumWait()

    cy.get(ARBillboardsAddEditPage.getGeneralTitleTxtF()).clear().type(billboardsDetails.billboardName + commonDetails.appendText)
    cy.get(ARBillboardsAddEditPage.getGeneralDescriptionTxtF()).type(billboardsDetails.billboardDescription + commonDetails.appendText)

    //Select Billboard Video
    ARBillboardsAddEditPage.getBillBoardVideoRadioBtn("Video")
    ARDashboardPage.getShortWait()


    //Add MP4 Vide
    cy.get(ARBillboardsAddEditPage.getMP4ChooseBtn()).click()

    //Upload Media
    cy.get(arUploadFileModal.getMediaLibraryUploadBtn()).click()
    cy.get(arUploadFileModal.getFilePathTxt()).attachFile(billboardsDetails.uploadPathV)
    // ARBillboardsAddEditPage.getHFJobWait()
    ARDashboardPage.getShortWait()

    //Now Click On Save
    cy.get(ARBillboardsAddEditPage.getFileBrowserModal()).within(() => {
      cy.get(ARBillboardsAddEditPage.getFileBrowserSaveBtn()).click({ force: true })
    })

    ARBillboardsAddEditPage.getHFJobWait()

    cy.get(ARBillboardsAddEditPage.getSaveBtn()).click()
    ARDashboardPage.getMediumWait()

  })

  after(function () {
    // Sign in with System Admin account
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    //Navigate to Billboard Page
    ARDashboardPage.getBillboardsReport()   

    //Filter BillBoard
    ARBillboardsPage.AddFilter('Title', 'Contains', billboardsDetails.billboardName + commonDetails.appendText)
    ARDashboardPage.getMediumWait()
    cy.get(ARDashboardPage.getGridTable()).eq(0).click()

    //Delete Billboard
    cy.get(ARBillboardsPage.getDeleteBillboardBtn()).click()
    ARDashboardPage.getMediumWait()

    cy.get(ARDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click()
    // Verify Billboard is deleted
    cy.get(ARDashboardPage.getNoResultMsg()).should('have.text', "No results found.")
  })

})