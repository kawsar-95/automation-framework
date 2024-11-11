import arBasePage from "../../ARBasePage";


export default new class ARCreditsReportPage extends arBasePage {
    // Added for the TC# C2078
    /**
     * This function shall filter items which are under radio button
     */
    addRadioFilter(propertyName, value) {
        cy.get(this.getAddFilterBtn()).click();
        cy.get(this.getPropertyName() + this.getDDownField()).click();
        cy.get(this.getPropertyNameDDownSearchTxtF()).type(propertyName)
        cy.get(this.getSelectedPropertyNameOpt()).eq(0).contains(new RegExp("^" + propertyName + "$", "g")).click()
        cy.get(this.getOperator() + this.getDDownField()).click();
        cy.get(this.getValueDDownField()).contains(value).click();
        cy.get(this.getSubmitAddFilterBtn()).click();
    }

    // Added for TC# C2076
    getSelectedUserInFilter() {
        return '[data-name="value"]'
    }

    getValueDDownField(){
        return '[class*="_select_list_m6elk_1"][aria-label="Value"]'
    }

    // Added for TC# C7399
    getSelectedTagInFilter() {
        return '[class*="_value_7pei1_65"]'
    }
}
