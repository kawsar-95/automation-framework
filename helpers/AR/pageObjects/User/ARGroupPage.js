import arBasePage from "../../ARBasePage";
import ARDashboardPage from "../Dashboard/ARDashboardPage";
import ARDeleteModal from "../Modals/ARDeleteModal";

/**
 * Returns selectors for the Group page (Users -> Groups)
 * 
 * Added for the TC# C1904
 * However, other test cases may find it helpful
 */
export default new class ARGroupPage extends arBasePage {

    getGroupNameTxtInput() {
        return '[class*="_text_input_"][name="name"]'
    }
    
    getDDownSearchTxtUser() {
        return '[class="_search_7teu8_76"] input';
    }

    /**
     * Returns the assignment radio button
     * 
     * @param {any} isManual(Optional) Whether the assignment is Manual or Automatic. 
     * Manual is the defalt. So without passing the param will select the Automatic
     * @returns Selector of the assignment radio button
     */
    getAssignmentRadioBtn(isManual = false) {
        return isManual
            ? '[data-name="radio-button-Manual"]'
            : '[data-name="radio-button-Automatic"]'
    }

    getAddRuleBtn() {
        return '[data-name="add-rule"]'
    }

    getRuleTxtInput() {
        return '[class*="_text_input_"][aria-label="Value"]'
    }

    getDuplicateGroupBtn() {
        return '[title="Duplicate Group"]'
    }

    deleteGroups(groupNames = []) {
        let i = 0;
        ARDashboardPage.getGroupsReport()
        for (i = 0; i < groupNames.length; i++) {
            this.AddFilter('Name', 'Contains', groupNames[i])
        }
        cy.get(this.getElementByAriaLabelAttribute('Row Select Options')).click({ force: true })
        cy.get(this.getElementByDataNameAttribute('select-page')).click()
        cy.wrap(this.WaitForElementStateToChange(this.getAddEditMenuActionsByName('Delete Groups'), 1000))
        cy.get(this.getAddEditMenuActionsByName('Delete Groups')).click()
        cy.get(ARDeleteModal.getARDeleteBtn()).should('be.visible').click()
        cy.get(ARDeleteModal.getARDeleteBtn()).should('not.exist')
    }
}