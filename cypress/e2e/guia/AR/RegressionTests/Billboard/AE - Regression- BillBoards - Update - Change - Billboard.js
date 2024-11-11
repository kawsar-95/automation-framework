import { users } from '../../../../../../helpers/TestData/users/users'
import { billboardsDetails } from '../../../../../../helpers/TestData/Billboard/billboardsDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARBillboardsAddEditPage from '../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsAddEditPage'
import ARBillboardsPage from '../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsPage'
import ARUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'

describe('C4987 AE - Regression- BillBoards - Update - Change - Billboard', () => {

    beforeEach(() => {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getBillboardsReport()
    })

    it('Create a New BillBoard', () => {
        //Go to Add Billboard
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Billboard')).click()
        ARDashboardPage.getMediumWait()

        //Set billboard title
        cy.get(ARBillboardsAddEditPage.getGeneralTitleTxtF()).clear().type(billboardsDetails.billboardName)
        ARDashboardPage.getMediumWait()

        //Set billboard Description
        cy.get(ARBillboardsAddEditPage.getGeneralDescriptionTxtF()).type('Test Automation Description for billboard details')

        //Set billboard image
        ARBillboardsAddEditPage.getBillBoardImageRadioBtn('Image')
        cy.get(ARBillboardsAddEditPage.getChooseFileBtn()).click()
        ARDashboardPage.getMediumWait()

        //Pick a media
        cy.get(ARUploadFileModal.getMediaGridView()).eq(0).click()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('media-library-apply')).click()

        //Save billboard
        ARDashboardPage.getMediumWait()
        cy.get(ARBillboardsAddEditPage.getSaveBtn()).click()
        ARDashboardPage.getMediumWait()
    })



    it('Update and Change Newly Created Existing Billboard', () => {
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

        // Save the changes publish  the Billboard
        cy.get(ARBillboardsAddEditPage.getSaveBtn()).click({ force: true })
        ARDashboardPage.getMediumWait()


    })

    after('Delete Created Billboard', () => {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        //Navigate to Billboard Page
        ARDashboardPage.getBillboardsReport()

        //Filter and Find the existing billboard
        ARBillboardsPage.AddFilter('Title', 'Contains', billboardsDetails.billboardName + commonDetails.appendText)
        ARDashboardPage.getMediumWait()

        //Select Billboard
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()

        cy.get(ARBillboardsPage.getDeleteBillboardBtn()).click()
        ARDashboardPage.getMediumWait()

        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        
        // Verify Billboard is deleted
        cy.get(ARDashboardPage.getNoResultMsg()).should('have.text', "No results found.")

        ARDashboardPage.getMediumWait()
        
    })
})