/// <reference types="cypress" />
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arBillboardsPage from '../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsPage'
import arBillboardsAddEditPage from '../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsAddEditPage'
import { billboardsDetails } from '../../../../../../helpers/TestData/Billboard/billboardsDetails'
import arUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'


describe('AR - CED - Billboards', function () {

    beforeEach(function() {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //cy.get(arDashboardPage.getSysAdminDashboardPageTitle()).should('have.text', arDashboardPage.getSysAdminDashboardPageTitleTxt())
        // Click the Engage menu item
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Engage'))).click()
        arDashboardPage.getMenuItemOptionByName('Billboards')
        cy.intercept('**/operations').as('getBillboards').wait('@getBillboards');
    })

    it('should allow admin to create a Billboard', () => {
        // Create billboard
        cy.get(arBillboardsPage.getPageHeaderTitle()).should('have.text', "Billboards")
        cy.get(arBillboardsPage.getAddBillboardBtn()).click()
        cy.get(arBillboardsPage.getElementByDataNameAttribute(arBillboardsAddEditPage.getGeneralPublishedToggleContainer())).should('be.visible')
        cy.get(arBillboardsAddEditPage.getGeneralTitleTxtF()).clear().type(billboardsDetails.billboardName)
        cy.get(arBillboardsAddEditPage.getGeneralDescriptionTxtF()).type(`This is Billboard automation test`)
        cy.get(arBillboardsAddEditPage.getChooseFileBtn()).click()
        cy.get(arUploadFileModal.getUploadbtnandClick()).click()
        cy.get(arUploadFileModal.getChooseFileBtn()).click()
        cy.get(arUploadFileModal.getFilePathTxt()).attachFile(billboardsDetails.uploadPath)
        // Save the billboard
        arBillboardsAddEditPage.getShortWait()
        cy.get(arUploadFileModal.getSaveBtn()).click()
        //cy.intercept('**/reports/files').as('getBillboards1').wait('@getBillboards1')
        arBillboardsAddEditPage.getLongWait()
        cy.get(arBillboardsAddEditPage.getSaveBtn()).click()
        //cy.intercept('**/reports/billboards').as('getBillboards2').wait('@getBillboards2');
        arBillboardsAddEditPage.getLongWait()
    })

    it('should allow admin to edit a Billboard', () => {
        // Search and edit created billboard
        arBillboardsPage.AddFilter('Title', 'Starts With', billboardsDetails.billboardName)
        cy.get(arBillboardsPage.getA5TableCellRecordByColumn(2)).should('contain',billboardsDetails.billboardName).click()
        cy.wrap(arBillboardsPage.WaitForElementStateToChange(arBillboardsPage.getAddEditMenuActionsByName('Edit Billboard'), 1000))
        cy.get(arBillboardsPage.getAddEditMenuActionsByName('Edit Billboard')).click()
        cy.get(arBillboardsAddEditPage.getGeneralTitleTxtF()).clear().type(billboardsDetails.billboardName + commonDetails.appendText)
        // Save the billboard
        arBillboardsPage.WaitForElementStateToChange(arBillboardsAddEditPage.getSaveBtn(), 1000)
        cy.get(arBillboardsAddEditPage.getSaveBtn()).click()
        cy.intercept('**/reports/billboards').as('getBillboards2').wait('@getBillboards2');
    })

    it('should allow admin to delete a Billboard', () => {
        // Search and delete billboard
        arBillboardsPage.AddFilter('Title', 'Starts With', billboardsDetails.billboardName + commonDetails.appendText)
        cy.get(arBillboardsPage.getA5TableCellRecordByColumn(2)).should('contain',billboardsDetails.billboardName + commonDetails.appendText).click()
        cy.wrap(arBillboardsPage.WaitForElementStateToChange(arBillboardsPage.getAddEditMenuActionsByName('Delete Billboard'), 1000))
        cy.get(arBillboardsPage.getAddEditMenuActionsByName('Delete Billboard')).click()
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click()
        // Verify Billboard is deleted
        cy.get(arDashboardPage.getNoResultMsg()).should('have.text', "No results found.")
    })

})