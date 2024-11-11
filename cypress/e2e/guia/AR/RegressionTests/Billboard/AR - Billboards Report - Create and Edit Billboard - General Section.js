import { users } from '../../../../../../helpers/TestData/users/users'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arBillboardsAddEditPage from '../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsAddEditPage'
import { billboardsDetails } from '../../../../../../helpers/TestData/Billboard/billboardsDetails'
import ARUnsavedChangesModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'

describe('C1997,C7351,C7355  AUT-549, AR - Billboards Report - Create and Edit Billboard - General Section', () => {
  before(() => {
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    arDashboardPage.getUsersReport()
    arDashboardPage.AddFilter('Is Admin', 'Yes')
    cy.get(arDashboardPage.getTableRow()).its('length').as('adminUserNumber')
  })
  
  beforeEach(() => {
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    arDashboardPage.getBillboardsReport()
  })

  it("Click on cancel button, if there are no changes", () => {
    cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Add Billboard'), 1000))
    cy.get(arDashboardPage.getAddEditMenuActionsByName('Add Billboard')).click()
    cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Add Billboard")
    cy.get(arBillboardsAddEditPage.getCancelBtn()).click()

    // Admin will returns to the Billboards page
    cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Billboards")

    cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Add Billboard'), 1000))
    cy.get(arDashboardPage.getAddEditMenuActionsByName('Add Billboard')).click()
    cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Add Billboard")
    
    // 5. Verify that the default value is "Active" when creating a new billboard
    arDashboardPage.generalToggleSwitch('true' , arBillboardsAddEditPage.getGeneralPublishedToggleContainer())

    // 3. Verify that the status can be set to INACTIVE or ACTIVE
    arDashboardPage.generalToggleSwitch('false' , arBillboardsAddEditPage.getGeneralPublishedToggleContainer())
    arDashboardPage.generalToggleSwitch('true' , arBillboardsAddEditPage.getGeneralPublishedToggleContainer())

    // 4. Verify that the description for the toggle
    arDashboardPage.AssertToggleDescriptionMessage(arBillboardsAddEditPage.getGeneralPublishedToggleContainer(), arBillboardsAddEditPage.getGeneralPublishedToggleMsg())

    //6. Verify that the Title field is text based
    cy.get(arBillboardsAddEditPage.getGeneralTitleTxtF()).should('have.attr', 'type', 'text')

    // 7. Verify that the Title field takes a MAXIMUM character length of 450
    cy.get(arBillboardsAddEditPage.getGeneralTitleTxtF()).invoke('val', arDashboardPage.getLongString(450)).type('a')

    // 8. Verify an error message is displayed if MAXIMUM character is exceeded
    cy.get(arBillboardsAddEditPage.getGeneralTitleErrorMsg()).should('contain', miscData.char_450_error)

    // 9. Verify that Title field is a required field
    cy.get(arBillboardsAddEditPage.getGeneralTitleTxtF()).clear()
    cy.get(arBillboardsAddEditPage.getGeneralTitleErrorMsg()).should('contain', miscData.field_required_error)

    // enter valid title
    cy.get(arBillboardsAddEditPage.getGeneralTitleTxtF()).clear().type(billboardsDetails.billboardName)

    // 11. Description field should allow MAXIMUM 4000 characters
    cy.get(arBillboardsAddEditPage.getGeneralDescriptionTxtF()).invoke('text', arDashboardPage.getLongString(4000)).type('a', {force:true})

    // 12. Verify an error message is displayed if MAXIMUM character for the Description field is exceeded
    cy.get(arBillboardsAddEditPage.getGeneralDescriptionErrorMsg()).should('contain', miscData.char_4000_error)

    // enter valid description
    cy.get(arBillboardsAddEditPage.getGeneralDescriptionTxtF()).clear()
    cy.get(arBillboardsAddEditPage.getGeneralDescriptionTxtF()).type(billboardsDetails.billboardDescription)

    // Verify Admin will be the default author
    cy.get(arBillboardsAddEditPage.getAuthorDDown()).should('have.text', users.sysAdmin.admin_sys_01_fname + " " + users.sysAdmin.admin_sys_01_lname)
      
    // 13. Author dropdown should contain list of all admins
    cy.get(arBillboardsAddEditPage.getAuthorDDown()).click()
    cy.get(arBillboardsAddEditPage.getAuthorList()).find('li').its('length').then(function($length) {
      expect(this.adminUserNumber).to.eq($length)
    })

    // Verify Save button should be disabled
    cy.get(arBillboardsAddEditPage.getSaveBtn()).should('have.attr', 'aria-disabled', 'true')

    arBillboardsAddEditPage.getBillBoardImageRadioBtn("Image")
    cy.get(arBillboardsAddEditPage.getgetBillBoardImageSourceTypeRadioBtn()).contains('Url').click().click()
    cy.get(arBillboardsAddEditPage.getBillboardImageTxtF()).type(miscData.switching_to_absorb_img_url)

    // 14. Save the billboard
    cy.get(arBillboardsAddEditPage.getSaveBtn()).should('not.have.attr','aria-disabled')
    cy.get(arBillboardsAddEditPage.getSaveBtn()).click()

    // New billboard should be created
    cy.get(arDashboardPage.getToastSuccessMsg()).should('be.visible').and('contain','Billboard has been created.')

    // admin should be returned to billboard report page
    cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Billboards")
  })

  it("Click on cancel button, if there are changes", () => {
    cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Add Billboard'), 1000))
    cy.get(arDashboardPage.getAddEditMenuActionsByName('Add Billboard')).click()
    cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Add Billboard")
    cy.get(arBillboardsAddEditPage.getCancelBtn()).click()

    // Admin will returns to the Billboards page
    cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Billboards")

    cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Add Billboard'), 1000))
    cy.get(arDashboardPage.getAddEditMenuActionsByName('Add Billboard')).click()
    cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Add Billboard")
    
    // 5. Verify that the default value is "Active" when creating a new billboard
    arDashboardPage.generalToggleSwitch('true' , arBillboardsAddEditPage.getGeneralPublishedToggleContainer())

    // 3. Verify that the status can be set to INACTIVE or ACTIVE
    arDashboardPage.generalToggleSwitch('false' , arBillboardsAddEditPage.getGeneralPublishedToggleContainer())
    arDashboardPage.generalToggleSwitch('true' , arBillboardsAddEditPage.getGeneralPublishedToggleContainer())

    // 4. Verify that the description for the toggle
    arDashboardPage.AssertToggleDescriptionMessage(arBillboardsAddEditPage.getGeneralPublishedToggleContainer(), arBillboardsAddEditPage.getGeneralPublishedToggleMsg())

    //6. Verify that the Title field is text based
    cy.get(arBillboardsAddEditPage.getGeneralTitleTxtF()).should('have.attr', 'type', 'text')

    // 7. Verify that the Title field takes a MAXIMUM character length of 450
    cy.get(arBillboardsAddEditPage.getGeneralTitleTxtF()).invoke('val', arDashboardPage.getLongString(450)).type('a')

    // 8. Verify an error message is displayed if MAXIMUM character is exceeded
    cy.get(arBillboardsAddEditPage.getGeneralTitleErrorMsg()).should('contain', miscData.char_450_error)

    // 9. Verify that Title field is a required field
    cy.get(arBillboardsAddEditPage.getGeneralTitleTxtF()).clear()
    cy.get(arBillboardsAddEditPage.getGeneralTitleErrorMsg()).should('contain', miscData.field_required_error)

    // enter valid title
    cy.get(arBillboardsAddEditPage.getGeneralTitleTxtF()).clear().type(billboardsDetails.billboardName2)

    // 11. Description field should allow MAXIMUM 4000 characters
    cy.get(arBillboardsAddEditPage.getGeneralDescriptionTxtF()).invoke('text', arDashboardPage.getLongString(4000)).type('a', {force:true})

    // 12. Verify an error message is displayed if MAXIMUM character for the Description field is exceeded
    cy.get(arBillboardsAddEditPage.getGeneralDescriptionErrorMsg()).should('contain', miscData.char_4000_error)

    // enter valid description
    cy.get(arBillboardsAddEditPage.getGeneralDescriptionTxtF()).clear()
    cy.get(arBillboardsAddEditPage.getGeneralDescriptionTxtF()).type(billboardsDetails.billboardDescription)

    // Verify Admin will be the default author
    cy.get(arBillboardsAddEditPage.getAuthorDDown()).should('have.text', users.sysAdmin.admin_sys_01_fname + " " + users.sysAdmin.admin_sys_01_lname)
      
    // 13. Author dropdown should contain list of all admins
    cy.get(arBillboardsAddEditPage.getAuthorDDown()).click()
    cy.get(arBillboardsAddEditPage.getAuthorList()).find('li').its('length').then(function($length) {
      expect(this.adminUserNumber).to.eq($length)
    })
    
    // Verify Save button should be disabled
    cy.get(arBillboardsAddEditPage.getSaveBtn()).should('have.attr', 'aria-disabled', 'true')

    arBillboardsAddEditPage.getBillBoardImageRadioBtn("Image")
    cy.get(arBillboardsAddEditPage.getgetBillBoardImageSourceTypeRadioBtn()).contains('Url').click().click()
    cy.get(arBillboardsAddEditPage.getBillboardImageTxtF()).type(miscData.switching_to_absorb_img_url)

    // 16. Click on cancel button Again click cancel prom modal
    cy.get(arBillboardsAddEditPage.getCancelBtn()).click()
    cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
    cy.get(ARUnsavedChangesModal.getPromptContent()).find('span').should('have.text', ARUnsavedChangesModal.getUnsavedChangesMsg())
    
    // two button options "OK", and "Cancel" is displayed
    cy.get(ARUnsavedChangesModal.getPromptFooter()).find(ARDeleteModal.getARDeleteBtn()).should('be.visible')
    cy.get(ARUnsavedChangesModal.getPromptFooter()).find(ARDeleteModal.getARCancelBtn()).should('be.visible').click()    
    cy.get(ARDeleteModal.getUnsavedChangesPrompt()).should('not.exist')
    
    // 19. Admin will returns to the Add Billboards page
    cy.get(arBillboardsAddEditPage.getPageHeaderTitle()).should('have.text', "Add Billboard")

    // Click on cancel button Again click OK prom modal
    cy.get(arBillboardsAddEditPage.getCancelBtn()).click()
    cy.get(ARDeleteModal.getUnsavedChangesPrompt()).should('be.visible')
    cy.get(ARUnsavedChangesModal.getPromptHeader()).should('have.text', 'Unsaved Changes')
    cy.get(ARUnsavedChangesModal.getPromptContent()).find('span').should('have.text', ARUnsavedChangesModal.getUnsavedChangesMsg())
    
    // two button options "OK", and "Cancel" is displayed
    cy.get(ARUnsavedChangesModal.getPromptFooter()).find(ARDeleteModal.getARCancelBtn()).should('be.visible')
    cy.get(ARUnsavedChangesModal.getPromptFooter()).find(ARDeleteModal.getARDeleteBtn()).should('be.visible').click()
    cy.get(ARDeleteModal.getUnsavedChangesPrompt()).should('not.exist')

    // Admin will returns to the Billboards page
    cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Billboards")
  })

  it('Delete Billboard', () => {
    arDashboardPage.AddFilter('Title', 'Contains', billboardsDetails.billboardName)
    arDashboardPage.selectTableCellRecord(billboardsDetails.billboardName, 2)
    arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Delete Billboard'))
    cy.get(arDashboardPage.getAddEditMenuActionsByName('Delete Billboard')).click()
    arDashboardPage.getConfirmModalBtnByText('Delete')
    cy.get(arDashboardPage.getNoResultMsg()).should('have.text', "No results found.")
  })
})