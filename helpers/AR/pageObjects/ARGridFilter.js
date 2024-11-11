import arBasePage from "../ARBasePage";

export default new class ARGridFilter extends arBasePage {

    /**
     * This method wil remove the selected filter above the grid.
     * There could be more than one filter selected
     * @param {number} index 
     */
    removeFilterByIndex(index) {
       cy.get(this.getElementByDataNameAttribute('filter-end')).eq(index).should('exist').click()
    }

}