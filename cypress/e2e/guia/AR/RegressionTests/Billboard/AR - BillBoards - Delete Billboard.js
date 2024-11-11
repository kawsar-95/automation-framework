import ARBillboardsAddEditPage from "../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import { billboardsDetails } from "../../../../../../helpers/TestData/Billboard/billboardsDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import ARBillboardsPage from '../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsPage'


describe('C6283, C6301,C7353 AR - BillBoards - Delete Billboard', () => {
    beforeEach(() => {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        //Navigate to Billboard Page
        ARDashboardPage.getBillboardsReport()
    })

    it('Create A Billboard', () => {
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
        ARDashboardPage.getShortWait()

        //Pick a media
        cy.get(ARUploadFileModal.getMediaGridView()).eq(0).click()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('media-library-apply')).click()

        //Save billboard
        ARDashboardPage.getShortWait()
        cy.get(ARBillboardsAddEditPage.getSaveBtn()).click()
        ARDashboardPage.getShortWait()

    })

    after('Delete Created Billboard', () => {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        //Navigate to Billboard Page
        ARDashboardPage.getBillboardsReport() 

        //Filter and Find the existing billboard
        ARBillboardsPage.AddFilter('Title', 'Contains', billboardsDetails.billboardName)
        ARDashboardPage.getMediumWait()

        //Select Billboard
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()

        //Select Delete BillBoard Button From Right Side Menu
        cy.get(ARBillboardsPage.getDeleteBillboardBtn()).click()
        ARDashboardPage.getMediumWait()

        //Click on cancel button
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getCancelBtn())).click()
        ARDashboardPage.getMediumWait()

        //Select Delete BillBoard Button From Right Side Menu Again
        cy.get(ARBillboardsPage.getDeleteBillboardBtn()).click()
        ARDashboardPage.getMediumWait()

        //Confirm Delete
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        ARDashboardPage.getMediumWait()

        // Verify Billboard is deleted
        cy.get(ARDashboardPage.getNoResultMsg()).should('have.text', "No results found.")

        ARDashboardPage.getMediumWait()

    })

})