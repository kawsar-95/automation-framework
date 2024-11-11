import ARBasePage from "../../../ARBasePage";

export default new class A5ECommerceSettingPage extends ARBasePage {
    visitECommertSettings() {
        cy.visit(`Admin/Ecommerce/Edit/${Cypress.env('client_ID')}`)
    }

    clickSettingsTab(tabName) {
        cy.get(`a[data-tab-menu="${tabName}"]`).should('be.visible').click()
    }

    saveSettings() {
        cy.intercept('POST', '**/Admin/Ecommerce/Edit/**').as('post')
        cy.get('.submit-edit-content').click()
        cy.wait('@post', { timeout: 90000 })
    }

    removeAddiontalCurrencies() {
        cy.get('body').then($body => {
            const legnth = $body.find('a[title="Remove additional currency"]').length
            for (var i = 0; i < legnth; i++) {
                cy.get('a[title="Remove additional currency"]').first().then($button => {
                    cy.wrap($button).click()
                    cy.get('#confirm-modal-content a[data-bind*="SubmitModal"]').click({force: true})  
                })
            }
        })
    }

    // Payment Gateways Page
    getAllowMultiCurrencyToggleContainer() {
        return '[id="AllowMultipleCurrencies"] a'
    }

    getDefaultCurrency() {
        return '[id="DefaultCurrencyDropdown"] [class="select2-chosen"]'
    }

    getDefaultCurrencyDropdownOpt(){
        return '[class="select2-result-label"]'
    }

    /* 
    This method is used to toggle the Allow Multiple Currencies, pass the Allow Multiple Currencies status and   
    to turn on the toggle pass the value as 'true', to turn off the toggle button pass the value as 'false'
    */
    getTurnOnOffAllowMultipleCurrencies(value) {
        value = (value === 'true') ? 'toggle on' : 'toggle'
        cy.get(this.getAllowMultiCurrencyToggleContainer(), {timeout:10000}).should('exist')
        cy.get(this.getAllowMultiCurrencyToggleContainer()).invoke('attr', 'class').then((status) => {
            if (status === value) {
                cy.get(this.getAllowMultiCurrencyToggleContainer()).should('have.attr', 'class', value)
            }
            else {
                cy.get(this.getAllowMultiCurrencyToggleContainer()).click({force:true})
                cy.get(this.getAllowMultiCurrencyToggleContainer(), {timeout:1000}).should('have.attr', 'class', value)
            }
        })
    }

    /* 
    This method is used to Set Default Currency, pass the Currency value like 'CAD'
    */
    setDefaultCurrency(value) {
        cy.get(this.getDefaultCurrency(), {timeout:10000}).should('exist')
        cy.get(this.getDefaultCurrency()).invoke('text').then((text) => {
            if (text === value) {
                cy.get(this.getDefaultCurrency()).should('have.text', value)
            }
            else {
                cy.get(this.getDefaultCurrency()).click({force:true})
                cy.get(this.getDefaultCurrencyDropdownOpt(), {timeout:10000}).should('contain' , value)
                cy.get(this.getDefaultCurrencyDropdownOpt()).contains(value).click({force:true})
                cy.get(this.getDefaultCurrency(), {timeout:1000}).should('have.text', value)
            }
        })
    }

    getPaymentGatewayDropdown() {
        return cy.get(`label:contains("Available Payment Gateways")`).parent().find('div.katana-dropdown')
    }

    getSelect2Dropdown() {
        return cy.get('ul.select2-results > li[class*="select2-result-selectable"]')
    }

    getDefaultCurrencyDropdown() {
        return cy.get('#DefaultCurrencyDropdown')
    }

    getAddCurrencyBtn() {
        return cy.get('a:contains("Add Currency")')
    }

    getAllowMultiCurrencyToggle() {
        return cy.get('#AllowMultipleCurrencies')
    }

    getCourseEnableEcommerceToggle() {
        return cy.get('div[data-name="enableEcommerce"] div[data-name="toggle-button"]')
    }

    getCourseDefaultPriceTxt() {
        return cy.get('input[aria-label="Default Price"]')
    }

    getConvertedCurrency(currency) {
        return cy.get('span').contains(currency)
    }

    getConvertedCurrencyTxt(currency) {
        return cy.get('span').contains(currency).parent().parent().find('input')
    }

    getVariablePricesDisabled() {
        return cy.get('div[data-name="variable-prices-disabled"]')
    }

    getExtensionMessage() {
        return cy.get('div[data-name="extensions-message"]')
    }

    getSecretKeyTxt() {
        return cy.get('input[data-bind*="PremiumEcommerce.PaymentGateway.TestAccountId"]')
    }

    clickSelect2Item(idx) {
        return cy.get('li[class*="select2-result-selectable"]').eq(idx).click()
    }

    getCurrencySelector() {
        return cy.get('ul[data-bind*="foreach: AdditionalCurrencies"] div.katana-dropdown')
    }

    getAdditionalCurrencyAbbreviation() {
        return cy.get('ul[data-bind*="foreach: AdditionalCurrencies"] div.list-group-name-text')
    }

    getConversionRateTxt(idx) {
        return cy.get(`ul[data-bind*="foreach: AdditionalCurrencies"] div.list-group-main:eq(${idx}) div.field:eq(1) input`)
    }

    getRoundingToggle(idx) {
        return cy.get(`ul[data-bind*="foreach: AdditionalCurrencies"] div.list-group-main:eq(${idx}) div.field:eq(2) div.katana-toggle`)
    }

    getExpandAvailableCurrency() {
        return cy.get('a[title="Expand available currency"]')
    }

    scrollToTop() {
        cy.get('#edit-content').scrollTo('top')
    }

    getVariablePriceGroupWarning() {
        return cy.get('span:contains("Enabling MultiCurrency will disable the ability to use Variable Pricing.")')
    }

    getNoAdditionalCurrencyWarning() {
        return cy.get('div:contains("No additional currencies have been set. Only the default currency will be available to users.")')
    }

    getDefaultCurrencyChangeWarning() {
        return cy.get('span:contains("The default currency cannot be changed when multi currency is on and additional currencies are selected.")')
    }

    getEnableSingleSeatEnrollmentKeyPurchase(){
        return cy.get('[id="EnableSingleSeatEnrollmentKeyPurchase"]')        
    }

    getMultiSeatToggle(){
        return cy.get('[id="EnableMultiSeat"]')        
    }

    turnOnMultiSeatToggle() {
        this.getMultiSeatToggle().then($toggle => {
            if (!$toggle.find('a').hasClass('on')) {
                this.getMultiSeatToggle().click()
            }
        })
    }

    turnOffMultiSeatToggle() {
        this.getMultiSeatToggle().then($toggle => {
            if ($toggle.find('a').hasClass('on')) {
                this.getMultiSeatToggle().click()
            }
        })
    }

    turnOnSingleSeatEnrollmentKeyPurchase() {
        this.getEnableSingleSeatEnrollmentKeyPurchase().then($toggle => {
            if (!$toggle.find('a').hasClass('on')) {
                this.getEnableSingleSeatEnrollmentKeyPurchase().click()
            }
        })   
    }

}