import { miscData } from "../../../TestData/Misc/misc";
import arBasePage from "../../ARBasePage";
import ARDashboardPage from "../Dashboard/ARDashboardPage";
import ARBillboardsAddEditPage from "./ARBillboardsAddEditPage";

export default new class ARBillboardsPage extends arBasePage {

    // Add Billboard Actions menu
    getAddBillboardBtn() {
        return '[title="Add Billboard"]'
    }


    // Edit Billboard Actions menu
    getEditBillboardBtn() {
        return 'button[title="Edit Billboard"]'
    }

    getDuplicateBillboardBtn() {
        return 'button[data-name="duplicate-billboard-context-button"]'
    }

    getGeneralPublishedToggleStatusContainer(){
        return "[data-name='toggle-button']"
    }

    getDeleteBillboardBtn() {
        return 'button[data-name="delete-billboard-context-button"]'
    }

    getDeleletAllSelectedBillboardBtn() {
        return 'button[data-name="delete-billboards-context-button"]'
    }

    // Added on the 23rd November 2022
    getContextMenu() {
        return 'div[class*="_context_menu_"]'
    }

    getUnselectedCheckInput() {
        return '[aria-checked="false"]'
    }

    deleteBillboards(billboardNames = []) {

        if (billboardNames === null || billboardNames.length === 0) {
            return
        }

        let i = 0;
        for (i = 0; i < billboardNames.length; i++) {
            this.AddFilter('Title', 'Contains', billboardNames[i])
        }

        cy.get(this.getRowSelectOptionsBtn()).click({ force: true })
        cy.get(this.getSelectThisPageOptionBtn()).click({force: true})

        if (billboardNames.length === 1) {
            cy.get(this.getDeleteBillboardBtn(), {timeout: 3000}).click()
        } else {
            cy.get(this.getDeleletAllSelectedBillboardBtn(), {timeout: 3000}).click()
        }
        this.getConfirmModalBtnByText('Delete')

        // Verify Billboard is deleted
        cy.get(this.getNoResultMsg()).should('have.text', "No results found.")
    }

    // Added for the JIRA# AUT-550, TC# C2000
    addSampleBillboard(name, imgUrl = miscData.switching_to_absorb_img_url, save = true) {
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Add Billboard'), 1000))
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Billboard')).click()
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Add Billboard')
        ARDashboardPage.generalToggleSwitch('true' , ARBillboardsAddEditPage.getGeneralPublishedToggleContainer())
        cy.get(ARBillboardsAddEditPage.getGeneralTitleTxtF()).clear().type(name)

        ARBillboardsAddEditPage.getBillBoardImageRadioBtn('Image')
        cy.get(ARBillboardsAddEditPage.getgetBillBoardImageSourceTypeRadioBtn()).contains('Url').click().click()
        cy.get(ARBillboardsAddEditPage.getBillboardImageTxtF()).type(imgUrl)

        if(save == true) {
            // Save the billboard
            cy.get(ARBillboardsAddEditPage.getSaveBtn()).should('not.have.attr','aria-disabled')
            cy.get(ARBillboardsAddEditPage.getSaveBtn()).click()
            cy.get(ARDashboardPage.getToastSuccessMsg()).should('be.visible').and('contain','Billboard has been created.')
            cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Billboards')
        }
    }

    getDeleteBillboard() {
        return 'button[title="Delete Billboard"]'
    }

    getReportLayouts() {
        return '[aria-label="Report Layouts"]'
    }

    getCreateFull() {
        return '[data-name="create-full"]'
    }

    getNickName() {
        return '[aria-label="Nickname"]'
    }

    getResetLayout() {
        return '[aria-label="Reset Layout"]'
    }

    getRowSelection() {
        return '[aria-label="Row Select Options"]'
    }

    getDeselectBtn() {
        return '[class*="deselect_button"]'
    }

    getGridFooter() {
        return '[class*="_grid_footer_muoau"]'
    }

    getSelectedItemCount() {
        return '[class*="_items_selected_"]'
    }
}
