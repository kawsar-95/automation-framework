import arBasePage from "../../ARBasePage";
import ARDashboardPage from "../Dashboard/ARDashboardPage";
import ARDeleteModal from "../Modals/ARDeleteModal";

export default new class ARVenuePage extends arBasePage {

    // Inherits elements from ARBasePage
    getActionBtnContainer() {
        return '[class*="_child_w33d3_9"]'
    }

    getContextMenuBtn() {
        return '[class*="_button_4zm37_1"]'
    }
    

    deleteVenues(venuNames = []) {
        // Navigate to Venues and delete venue
        ARDashboardPage.getVenuesReport()

        let i = 0
        for (; i < venuNames.length; i++) {
            this.AddFilter('Name', 'Equals', venuNames[i])
            cy.get(this.getGridFilterResultLoader(), {timeout: 5000}).should('not.exist')
            this.selectTableCellRecord(venuNames[i], 2)
            cy.wrap(this.WaitForElementStateToChange(this.getAddEditMenuActionsByName('Delete Venue')), 1000)
            cy.get(this.getAddEditMenuActionsByName('Delete Venue')).click()
            cy.get(ARDeleteModal.getARDeleteBtn(), {timeout: 3000}).click()
            cy.get(this.getNoResultMsg(), {timeout: 5000}).should('be.visible')
        }
    }
}