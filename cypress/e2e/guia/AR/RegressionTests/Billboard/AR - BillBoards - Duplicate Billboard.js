import ARBillboardsAddEditPage from "../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsAddEditPage";
import ARBillboardsPage from "../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsPage";
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal";
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal";
import { billboardsDetails } from "../../../../../../helpers/TestData/Billboard/billboardsDetails";
import { users } from "../../../../../../helpers/TestData/users/users";


describe('C6300,C7352 AR - BillBoards - Duplicate Billboard', () => {
    
    beforeEach(() => {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        //Navigate to Billboard Page
        ARDashboardPage.getBillboardsReport() 
    })

    it('Create a  Billboard', () => {
        //Click on Add Billboard
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Billboard')).should('have.attr','aria-disabled','false').click()

        //Add Billboard Name
        cy.get(ARBillboardsAddEditPage.getGeneralTitleTxtF()).should('be.visible')
        cy.get(ARBillboardsAddEditPage.getGeneralTitleTxtF()).type(billboardsDetails.billboardName)

        //Add Billboard Description
        cy.get(ARBillboardsAddEditPage.getGeneralDescriptionTxtF()).type(billboardsDetails.billboardDescription)

        //Pick Media
        ARBillboardsAddEditPage.getBillBoardImageRadioBtn('Image')
        cy.get(ARBillboardsAddEditPage.getChooseFileBtn()).click()
        cy.get(ARUploadFileModal.getMediaGridView()).eq(0).click()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('media-library-apply')).click()
        cy.get(ARBillboardsAddEditPage.getSaveBtn()).click()
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('be.visible').and('contain','Billboard has been created.')
    })

    it('Create Duplicate Billboard From Existing Billboard', () => {
        //Filter Billboard
        ARDashboardPage.AddFilter('Title', 'Contains', billboardsDetails.billboardName)
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        //Select Found Billboard
        cy.get(ARDashboardPage.getGridTable()).should('contain', billboardsDetails.billboardName).click()

        //Select any existing Billboard and Verify that [Duplicate] button has been added to Billboard page
        cy.get(ARBillboardsPage.getDuplicateBillboardBtn()).should('exist')

        //Verify that if there are no changes the Admin will be returned to the Billboard page
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('not.contain', 'Add Billboard')

        //Click on Duplicate Billboard Button
        cy.get(ARBillboardsPage.getDuplicateBillboardBtn()).should('have.attr','aria-disabled','false').click()
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Add Billboard')

        //Click on cancel without any changes - Click Cancel

        cy.get(ARBillboardsAddEditPage.getCancelBtn()).click()
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Billboards')

        //As there is no changes it will return directly to main billboard page
        //Return to Main Billboard Page no duplicate billboard will be created
        //Filter Same Billbaord Again and Click on Duplicate Billboard
        //Filter Billboard
        cy.get(ARDashboardPage.getRemoveFilterBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        //Filter Billboard
        ARDashboardPage.AddFilter('Title', 'Contains', billboardsDetails.billboardName)
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(ARDashboardPage.getGridTable()).should('contain', billboardsDetails.billboardName).click()
        cy.get(ARBillboardsPage.getDuplicateBillboardBtn()).should('be.visible')
        cy.get(ARBillboardsPage.getDuplicateBillboardBtn()).should('have.attr','aria-disabled','false').click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        //This time add some changes to dubplicate billoard
        //Add Title
        cy.get(ARBillboardsAddEditPage.getGeneralTitleTxtF()).clear().type(billboardsDetails.billboardName)
        cy.get(ARBillboardsAddEditPage.getCancelBtn()).click()

        //Verify that If there are changes the Admin will be shown the Unsaved Changes
        cy.get(ARDashboardPage.getElementByDataNameAttribute('prompt-content')).should('exist')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('cancel')).eq(0).click()
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Add Billboard')

        //Set the Published  toggle  button as Yes, by default it will be NO        
        cy.get(ARBillboardsPage.getElementByDataNameAttribute(ARBillboardsAddEditPage.getGeneralPublishedToggleContainer()) + ' ' + ARBillboardsPage.getGeneralPublishedToggleStatusContainer()).should('have.attr', 'aria-hidden', 'true')

        //Add Billboard Description
        cy.get(ARBillboardsAddEditPage.getGeneralDescriptionTxtF()).type(billboardsDetails.billboardDescription)

        //Click on save button
        cy.get(ARBillboardsAddEditPage.getSaveBtn()).click()
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('be.visible').and('contain','Billboard has been created.')
    })

    it('Delete All the  Duplicated Billboards', () => {
        ARDashboardPage.AddFilter('Title', 'Contains', billboardsDetails.billboardName)
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        //Select Found Billboards
        cy.get(ARDashboardPage.getGridTable()).first().should('contain', billboardsDetails.billboardName).click()
        cy.get(ARDashboardPage.getGridTable()).last().should('contain', billboardsDetails.billboardName).click()
        cy.get(ARBillboardsPage.getDeleletAllSelectedBillboardBtn()).should('have.attr','aria-disabled','false').click()
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('be.visible').and('contain','Billboards have been deleted.')
    })
})