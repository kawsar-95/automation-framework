import { users } from '../../../../../../helpers/TestData/users/users'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arBillboardsPage from '../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsPage'
import arBillboardsAddEditPage from '../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsAddEditPage'
import arUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import { billboardsDetails } from '../../../../../../helpers/TestData/Billboard/billboardsDetails'
import arAddEditCategoryPage from '../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage'
import ARUnsavedChangesModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'

describe('C6819,C7351,C7355  AUT-775, AR - BilBoards - Create and Edit Billboard - Billboard Section', () => {
  beforeEach(() => {
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    arDashboardPage.getBillboardsReport()
  })
  
  after(function () {
    arBillboardsPage.deleteBillboards([billboardsDetails.billboardName, billboardsDetails.billboardName2, billboardsDetails.billboardName3])
  })

  it("Click on cancel button, if there are no changes", () => {
    
    cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "Billboards")
    cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Add Billboard'), 1000))
    cy.get(arCoursesPage.getCoursesActionsButtonsByLabel('Add Billboard')).click()
    cy.get(arAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Add Billboard")
    cy.get(arAddEditCategoryPage.getCancelBtn()).click()
    

    // Admin will returns to the Billboards page
    cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "Billboards")
    cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Add Billboard'), 1000))
    cy.get(arCoursesPage.getCoursesActionsButtonsByLabel('Add Billboard')).click()
    cy.get(arAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Add Billboard")

    cy.get(arBillboardsPage.getElementByDataNameAttribute(arBillboardsAddEditPage.getGeneralPublishedToggleContainer()) + ' ' + arBillboardsPage.getGeneralPublishedToggleStatusContainer()).should('have.attr', 'aria-hidden', 'true')
    cy.get(arBillboardsAddEditPage.getGeneralTitleTxtF()).clear().type(billboardsDetails.billboardName)
    cy.get(arBillboardsAddEditPage.getGeneralDescriptionTxtF()).type(billboardsDetails.billboardDescription)

    // Verify Admin will be the default author
    cy.get(arBillboardsAddEditPage.getAuthorDDown()).should('have.text', users.sysAdmin.admin_sys_01_fname + " " + users.sysAdmin.admin_sys_01_lname)
    	
    // Select an Author from the dropdown
    cy.get(arBillboardsAddEditPage.getAuthorDDown()).click()
    cy.get(arBillboardsAddEditPage.getAuthorDDownTxtF()).clear().type(users.blatAdmin.admin_blat_01_lname)
    
    cy.get(arBillboardsAddEditPage.getAuthorDDownOpt()).contains(users.blatAdmin.admin_blat_01_lname).should('be.visible')
    cy.get(arBillboardsAddEditPage.getAuthorDDownOpt()).contains(users.blatAdmin.admin_blat_01_lname).click()

    // Click on Availability option
    cy.get(arBillboardsAddEditPage.getAvailabilityAddRuleBtn()).click()
    cy.get(arBillboardsAddEditPage.getAvailabilityAddRuleBtn()).should('exist')

    // Click on cancel button Again click cancel prom modal
    cy.get(arAddEditCategoryPage.getCancelBtn()).click()
    cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
    cy.get(ARUnsavedChangesModal.getPromptContent()).find('span').should('have.text', ARUnsavedChangesModal.getUnsavedChangesMsg())
    cy.get(ARUnsavedChangesModal.getPromptFooter()).find(arAddEditCategoryPage.getCancelBtn()).click()
    cy.get(ARDeleteModal.getUnsavedChangesPrompt()).should('not.exist')
    
    // Admin will returns to the Add Billboards page
    cy.get(arAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Add Billboard")

    // Click on cancel button Again click OK prom modal
    cy.get(arAddEditCategoryPage.getCancelBtn()).click()
    cy.get(ARDeleteModal.getUnsavedChangesPrompt()).should('be.visible')
    cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
    cy.get(ARUnsavedChangesModal.getPromptContent()).find('span').should('have.text', ARUnsavedChangesModal.getUnsavedChangesMsg())
    cy.get(ARDeleteModal.getARDeleteBtn()).click()
    cy.get(ARDeleteModal.getUnsavedChangesPrompt()).should('not.exist')

    // Admin will returns to the Billboards page
    cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "Billboards")
  })

  it("should be able to create new Billboards with Image", () => {
    cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "Billboards")
    cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Add Billboard'), 1000))
    cy.get(arCoursesPage.getCoursesActionsButtonsByLabel('Add Billboard')).click()
    cy.get(arAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Add Billboard")
    cy.get(arBillboardsPage.getElementByDataNameAttribute(arBillboardsAddEditPage.getGeneralPublishedToggleContainer()) + ' ' + arBillboardsPage.getGeneralPublishedToggleStatusContainer()).should('have.attr', 'aria-hidden', 'true')
    cy.get(arBillboardsAddEditPage.getGeneralTitleTxtF()).clear().type(billboardsDetails.billboardName)
    cy.get(arBillboardsAddEditPage.getGeneralDescriptionTxtF()).type(billboardsDetails.billboardDescription)

    // Verify Admin will be the default author
    cy.get(arBillboardsAddEditPage.getAuthorDDown()).should('have.text', users.sysAdmin.admin_sys_01_fname + " " + users.sysAdmin.admin_sys_01_lname)
      
    // Select an Author from the dropdown
    cy.get(arBillboardsAddEditPage.getAuthorDDown()).click()
    cy.get(arBillboardsAddEditPage.getAuthorDDownTxtF()).clear().type(users.blatAdmin.admin_blat_01_lname)
    cy.get(arBillboardsAddEditPage.getAuthorDDownOpt()).contains(users.blatAdmin.admin_blat_01_lname).should('be.visible')
    cy.get(arBillboardsAddEditPage.getAuthorDDownOpt()).contains(users.blatAdmin.admin_blat_01_lname).click()
    

    // Verify Save button should be disabled
    cy.get(arBillboardsAddEditPage.getSaveBtn()).should('have.attr', 'aria-disabled', 'true')

    // Admin is able to  select one or more tags
    cy.get(arBillboardsAddEditPage.getBillboardTagDDown()).click()
    cy.get(arBillboardsAddEditPage.getBillboardTagDDownTxtF()).should('be.visible')
    cy.get(arBillboardsAddEditPage.getBillboardTagDDownTxtF()).type(commonDetails.tagName)
    cy.get(arBillboardsAddEditPage.getBillboardTagDDownOpt()).contains(commonDetails.tagName).should('be.visible')
    cy.get(arBillboardsAddEditPage.getBillboardTagDDownOpt()).contains(commonDetails.tagName).click()

    arBillboardsAddEditPage.getBillBoardImageRadioBtn("Image")
    cy.get(arBillboardsAddEditPage.getChooseFileBtn()).click()
    //Select upload from the media library
    cy.get(arUploadFileModal.getMediaLibraryUploadBtn()).click()
    cy.get(arUploadFileModal.getFilePathTxt()).attachFile(billboardsDetails.uploadPath)
    // Save the billboard
    cy.get(arBillboardsAddEditPage.getSaveBtn()).eq(0).should('have.attr','aria-disabled','false')
    cy.get(arBillboardsAddEditPage.getSaveBtn()).eq(0).click()
    cy.get(arDashboardPage.getWaitSpinner(),{timeout:60000}).should('not.exist')
    cy.wrap(arDashboardPage.WaitForElementStateToChange(arBillboardsAddEditPage.getSaveBtn(), 1000))
    cy.get(arBillboardsAddEditPage.getSaveBtn()).click()
    cy.get(arDashboardPage.getToastSuccessMsg()).should('be.visible').and('contain','Billboard has been created.')
    
  })

  it("should be able to create new Billboards with Video (Webm)", () => {
    cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "Billboards")
    cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Add Billboard'), 1000))
    cy.get(arCoursesPage.getCoursesActionsButtonsByLabel('Add Billboard')).click()
    cy.get(arAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Add Billboard")
    cy.get(arBillboardsPage.getElementByDataNameAttribute(arBillboardsAddEditPage.getGeneralPublishedToggleContainer()) + ' ' + arBillboardsPage.getGeneralPublishedToggleStatusContainer()).should('have.attr', 'aria-hidden', 'true')
    cy.get(arBillboardsAddEditPage.getGeneralTitleTxtF()).clear().type(billboardsDetails.billboardName2)
    cy.get(arBillboardsAddEditPage.getGeneralDescriptionTxtF()).type(billboardsDetails.billboardDescription)

    // Verify Admin will be the default author
    cy.get(arBillboardsAddEditPage.getAuthorDDown()).should('have.text', users.sysAdmin.admin_sys_01_fname + " " + users.sysAdmin.admin_sys_01_lname)
      
    // Select an Author from the dropdown
    cy.get(arBillboardsAddEditPage.getAuthorDDown()).click()
    cy.get(arBillboardsAddEditPage.getAuthorDDownTxtF()).clear().type(users.blatAdmin.admin_blat_01_lname)
    cy.get(arBillboardsAddEditPage.getAuthorDDownOpt()).contains(users.blatAdmin.admin_blat_01_lname).should('be.visible')
    cy.get(arBillboardsAddEditPage.getAuthorDDownOpt()).contains(users.blatAdmin.admin_blat_01_lname).click()
 

    // Verify Save button should be disabled
    cy.get(arBillboardsAddEditPage.getSaveBtn()).should('have.attr', 'aria-disabled', 'true')

    // Admin is able to  select one or more tags
    cy.get(arBillboardsAddEditPage.getBillboardTagDDown()).click()
    cy.get(arBillboardsAddEditPage.getBillboardTagDDownTxtF()).should('be.visible')
    cy.get(arBillboardsAddEditPage.getBillboardTagDDownTxtF()).type(commonDetails.tagName)
    cy.get(arBillboardsAddEditPage.getBillboardTagDDownOpt()).contains(commonDetails.tagName).should('be.visible')
    cy.get(arBillboardsAddEditPage.getBillboardTagDDownOpt()).contains(commonDetails.tagName).click()
      
    arBillboardsAddEditPage.getBillBoardVideoRadioBtn("Video")
    cy.get(arBillboardsAddEditPage.getWebMChosseBtn()).click()
    cy.get(arUploadFileModal.getMediaLibraryUploadBtn()).click()
    cy.get(arUploadFileModal.getFilePathTxt()).attachFile(billboardsDetails.uploadPathW)

    // Save the billboard
    cy.get(arBillboardsAddEditPage.getSaveBtn()).eq(0).should('have.attr','aria-disabled','false')
    cy.get(arBillboardsAddEditPage.getSaveBtn()).eq(0).click()
    cy.get(arDashboardPage.getWaitSpinner(),{timeout:60000}).should('not.exist')
    cy.wrap(arDashboardPage.WaitForElementStateToChange(arBillboardsAddEditPage.getSaveBtn(), 1000))
    cy.get(arBillboardsAddEditPage.getSaveBtn()).click()
    cy.get(arDashboardPage.getToastSuccessMsg()).should('be.visible').and('contain','Billboard has been created.')
  })

  it("should be able to create new Billboards with Video (MP4)", () => {
    //Verify navigated window
    cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "Billboards")
    cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Add Billboard'), 1000))
    cy.get(arCoursesPage.getCoursesActionsButtonsByLabel('Add Billboard')).click()
    cy.get(arAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Add Billboard")
    cy.get(arBillboardsPage.getElementByDataNameAttribute(arBillboardsAddEditPage.getGeneralPublishedToggleContainer()) + ' ' + arBillboardsPage.getGeneralPublishedToggleStatusContainer()).should('have.attr', 'aria-hidden', 'true')
    cy.get(arBillboardsAddEditPage.getGeneralTitleTxtF()).clear().type(billboardsDetails.billboardName3)
    cy.get(arBillboardsAddEditPage.getGeneralDescriptionTxtF()).type(billboardsDetails.billboardDescription)

    // Verify Admin will be the default author
    cy.get(arBillboardsAddEditPage.getAuthorDDown()).should('have.text', users.sysAdmin.admin_sys_01_fname + " " + users.sysAdmin.admin_sys_01_lname)
      
    // Select an Author from the dropdown
    cy.get(arBillboardsAddEditPage.getAuthorDDown()).click()
    cy.get(arBillboardsAddEditPage.getAuthorDDownTxtF()).clear().type(users.blatAdmin.admin_blat_01_lname)
    cy.get(arBillboardsAddEditPage.getAuthorDDownOpt()).contains(users.blatAdmin.admin_blat_01_lname).should('be.visible')
    cy.get(arBillboardsAddEditPage.getAuthorDDownOpt()).contains(users.blatAdmin.admin_blat_01_lname).click()
    

    // Verify Save button should be disabled
    cy.get(arBillboardsAddEditPage.getSaveBtn()).should('have.attr', 'aria-disabled', 'true')

    // Admin is able to  select one or more tags
    cy.get(arBillboardsAddEditPage.getBillboardTagDDown()).click()
    cy.get(arBillboardsAddEditPage.getBillboardTagDDownTxtF()).should('be.visible')
    cy.get(arBillboardsAddEditPage.getBillboardTagDDownTxtF()).type(commonDetails.tagName)
    cy.get(arBillboardsAddEditPage.getBillboardTagDDownOpt()).contains(commonDetails.tagName).should('be.visible')
    cy.get(arBillboardsAddEditPage.getBillboardTagDDownOpt()).contains(commonDetails.tagName).click()
      
    arBillboardsAddEditPage.getBillBoardVideoRadioBtn("Video")
    cy.get(arBillboardsAddEditPage.getMP4ChooseBtn()).click()
    cy.get(arUploadFileModal.getMediaLibraryUploadBtn()).click()
    cy.get(arUploadFileModal.getFilePathTxt()).attachFile(billboardsDetails.uploadPathV)
    // Save the billboard
    cy.get(arBillboardsAddEditPage.getSaveBtn()).eq(0).should('have.attr','aria-disabled','false')
    cy.get(arBillboardsAddEditPage.getSaveBtn()).eq(0).click()
    cy.get(arDashboardPage.getWaitSpinner(),{timeout:90000}).should('not.exist')
    cy.wrap(arDashboardPage.WaitForElementStateToChange(arBillboardsAddEditPage.getSaveBtn(), 1000))
    cy.get(arBillboardsAddEditPage.getSaveBtn()).click()
    cy.get(arDashboardPage.getToastSuccessMsg()).should('be.visible').and('contain','Billboard has been created.')

  })
})