import ARBasePage from "../../ARBasePage"
import ARDashboardPage from "../Dashboard/ARDashboardPage"
import ARVenuePage from "./ARVenuePage"

export default new class ARVenueAddEditPage extends ARBasePage {
  
    // Venue Page Elements
    
    getNameTxtF() {
        return this.getElementByAriaLabelAttribute('Name')
    }
  
    getDescriptionTxtF() {
        return '[class*="fr-element fr-view"] > p'
    }

    getMaxClassSizeTxtF() {
        return this.getElementByAriaLabelAttribute("Max Class Size")
    }

    getTypeDDown() {
        return '[data-name="venueType"] [class*="_selection"]'
    }

     // Use cypress contains command to filter by text
    getTypeDDownOpt() {
        return '[aria-label="Venue"] [class*="_label"]'
    }

    getDepartmentTxt() {
        return this.getElementByDataNameAttribute("department-input");
    }
    
    getDepartmentBtn() {
        return '[class*="_select_department_button"] [class*="icon icon-flowchart"]';
    }

    getAddressTxtF() {
        return this.getElementByAriaLabelAttribute("Address");
    }

    getCountryF() {
        return this.getElementByDataNameAttribute("countryCode") + ' ' + '[class*="select-option-value-module__label"]'
    }

    getCountryDDOwn() {
        return '[data-name="countryCode"] [class*="_select_field"]'
    }

    getCountryDDownSearchTxtF() {
        return '[name="countryCode"]'
    }

     // Use cypress contains command to filter by text
    getCountryDDOwnOpt() {
        return '[aria-label="Country"] [class*="_label"]'
    }

    getProvinceF() {
        return this.getElementByDataNameAttribute("provinceCode") + ' ' + '[class*="select-option-value-module__label"]'
    }

    getProvinceDDown() {
        return '[data-name="provinceCode"] [class*="_select_field"]'
    }

    getProvinceDDownSearchTxtF() {
        return '[name="provinceCode"]'
    }

    getProvinceDDOwnOpt() {
        return '[aria-label="Province"] [class*="_label"]'
    }

    getCityTxtF() {
        return this.getElementByAriaLabelAttribute("City");
    }

    getPostalCodeTxtF() {
        return this.getElementByAriaLabelAttribute("Postal Code");
    }

    getPhoneTxtF() {
        return this.getElementByAriaLabelAttribute("Phone Number");
    }

    getUrlTxtF() {
        return this.getElementByAriaLabelAttribute("Url");
    }

    getUsernameTxtF() {
        return this.getElementByAriaLabelAttribute("Username");
    }

    getPasswordTxtF() {
        return this.getElementByAriaLabelAttribute("Password");
    }

    // Added for the JIRA# AUT-585, TC# C2045
    addSampleVenue(venuName) {
        ARDashboardPage.getVenuesReport()
        cy.wrap(ARVenuePage.WaitForElementStateToChange(ARVenuePage.getAddEditMenuActionsByName('Add Venue'), 1000))
        cy.get(ARVenuePage.getAddEditMenuActionsByName('Add Venue')).click()

        // Select venue type`
        cy.get(this.getTypeDDown()).click()
        cy.get(this.getTypeDDownOpt()).contains('Classroom').click()
        // Enter valid name
        cy.get(this.getNameTxtF()).type(venuName)
        // Enter valid max class size
        cy.get(this.getMaxClassSizeTxtF()).clear().type(5)
        // Save Venue
        cy.get(this.getSaveBtn(), {timeout: 3000}).click()
    }
}