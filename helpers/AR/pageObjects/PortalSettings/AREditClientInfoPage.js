import arBasePage from "../../ARBasePage";
import ARDashboardPage from "../Dashboard/ARDashboardPage";
import ARDashboardAccountMenu from "../Menu/ARDashboardAccount.menu";
import AREditClientUserPage from "./AREditClientUserPage";

export default new class AREditClientInfoPage extends arBasePage {
  getGoogleTagManagerBtn() {
    return '[id="GoogleTagManagerEnabled"]'
  }

  getGoogleTagManagerLabel() {
    return 'label[for="GoogleTagManagerId"]'
  }

  getSaveBtn() {
    return '[id="sidebar-content"]'
  }
  getTabsMenu() {
    return `[class="katana-tab-menu"]`;
  }
  getTableContent() {
    return `[class="katana-tab-content"]`;
  }
  getTableContentToggleBtn() {
    return `[class*="katana-toggle"]`;
  }
  getSearchCloseBtn() {
    return `'#s2id_autogen63 > .select2-choice > .select2-search-choice-close'`
  }
  getOnLoginCourseEnableToggle() {
    return `[id="ForceNewLearnerCourse"]`
  }
  getOnLoginCourseChooseDdown() {
    return `[id="ForceNewLearnerCourseId"]`
  }
  getOnLoginCourseInputfield() {
    return `[id="s2id_autogen60_search"]`
  }
  getOnLoginDdownSearchResult() {
    return `li[class*="select2-result select2-result-selectable"]`
  }

  getIsLearnerEnrollEnabled() {
    return `[id="IsLearnerUnEnrollEnabled"]`
  }

  getLearnerIdleTimeoutSettingsFlag(){
    return `[id="IsLearnerIdleTimeoutEnabled"]`
  }

  getEnableLearnerIdleTimeoutSettingsBtn(){
    return `[id="IsLearnerIdleTimeoutEnabled"]>a`
  }

  getTurnOnEnableLearnerIdleTimeoutSettingsToggleBtn(){
    cy.wait(2000)
    cy.get(this.getEnableLearnerIdleTimeoutSettingsBtn()).then(($btn) => {
      if ($btn.attr('class') === 'toggle on'){
        cy.get(this.getEnableLearnerIdleTimeoutSettingsBtn()).should('have.class','toggle on')
      }
      else{
        cy.get(this.getLearnerIdleTimeoutSettingsFlag()).click()
        cy.get(this.getEnableLearnerIdleTimeoutSettingsBtn()).should('have.class','toggle on')
      }
    })
  }

  getTurnOffEnableLearnerIdleTimeoutSettingsToggleBtn(){
    cy.wait(2000)
    cy.get(this.getEnableLearnerIdleTimeoutSettingsBtn()).then(($btn) => {
      if ($btn.attr('class') === 'toggle'){
        cy.get(this.getEnableLearnerIdleTimeoutSettingsBtn()).should('have.class','toggle')
      }
      else{
        cy.get(this.getLearnerIdleTimeoutSettingsFlag()).click()
        cy.get(this.getEnableLearnerIdleTimeoutSettingsBtn()).should('have.class','toggle')
      }
    })
  }

  getLearnerIdleTimeoutCodeFlag() {
    return '[id="IsIdleTimeoutVerificationEnabled"]'
  }

  getLearnerIdleTimeoutCodetoggleBtn() {
    return '[id="IsIdleTimeoutVerificationEnabled"]>a'
  }

  getTurnOnEnableMandatoryVerificationCodeforTimeoutExtensionToggleBtn(){
    
    cy.get(this.getLearnerIdleTimeoutCodetoggleBtn()).then(($btn) => {
      if ($btn.hasClass('toggle on')){
        cy.get(this.getLearnerIdleTimeoutCodetoggleBtn()).should('have.class','toggle on')
      }
      else{
        cy.get(this.getLearnerIdleTimeoutCodeFlag()).click()
      }
   })
  }

  getTurnOffEnableLearnerIdleTimeoutSettingsToggleBtn(){
    cy.wait(2000)
    cy.get(this.getLearnerIdleTimeoutCodetoggleBtn()).then(($btn) => {  
      if ($btn.hasClass('toggle on') === false ){
        cy.get(this.getLearnerIdleTimeoutCodeFlag()).click()
        cy.get(this.getLearnerIdleTimeoutCodetoggleBtn()).should('have.class','toggle')
      }
      else{
        cy.get(this.getLearnerIdleTimeoutCodetoggleBtn()).should('have.class','toggle')
      }
    })
  }

  getCssClassToggle() {
    return `[class*="toggle"]`
  }

  getLanguageListItem() {
    return 'span[data-bind="text: LanguageName"]'
  }

  getDefaultCurrency() {
    return '[id="DefaultCurrencyDropdown"] [class="select2-chosen"]'
  }

  // added for TC #C6813
  getEditClientHeader() {
    return '[id="edit-content"] [class="header"] [class="section-title"]';
  }

  getPaymentGatewaysTabMenu() {
    return '[data-tab-menu="PaymentGateways"]'
  }

  getECommerceBtn() {
    return 'div[class="katana-toggle"][id="ClientServices.IsEcommerceEnabled"] > a'
  }

  turnOnECommerceToggle() {
    // Select Account Menu
    cy.get(this.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn()), {timeout: 30000}).click()
    // Select Portal Setting option from account menu
    cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
    // Assert that the Info tab is opened by default
    cy.get(this.getTabsMenu(), {timeout: 30000}).should('be.visible')
    // Turn on e-commerce toggle button
    this.getTurnOnECommerceToggle()
    cy.get(AREditClientUserPage.getSaveBtn()).click()
    // Navigate to dashboard page
    this.getShortWait()
  }

  turnOffECommerceToggle() {
    // Select Account Menu
    cy.get(this.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn()), {timeout: 30000}).click({ force: true })
    // Select Portal Setting option from account menu
    cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click({ force: true })
    // Assert that the Info tab is opened by default
    cy.get(this.getTabsMenu(), {timeout: 30000}).should('be.visible')
    // Turn off e-commerce toggle button
    this.getTurnOffECommerceToggle()
    cy.get(AREditClientUserPage.getSaveBtn()).click()
    // Navigate to dashboard page
    this.getShortWait()
 }

  getTurnOnECommerceToggle() {
    cy.get(this.getECommerceBtn()).then(($btn) => {
        if ($btn.hasClass('toggle on')) {
            cy.get(this.getECommerceBtn()).should('have.class', 'toggle on')
        }
        else {
            cy.get(this.getECommerceFlag(false)).click()
        }
    })
  }

  getTurnOffECommerceToggle() {
    let value = 'toggle'
    cy.get(this.getECommerceBtn()).invoke('attr', 'class').then((status) => {
        if (status === value) {
            cy.get(this.getECommerceBtn()).should('have.attr', 'class', value)
        }
        else {
            cy.get(this.getECommerceFlag()).click()
            this.getShortWait()
            cy.get(this.getECommerceBtn()).should('have.attr', 'class', value)
        }
    })
  }

  getECommerceFlag(turnedOn = true) {
    if (turnedOn === true) {
        return '[id*="IsEcommerceEnabled"] > a[class="toggle on"]'
    }
    return '[id*="IsEcommerceEnabled"] > a[class="toggle"]'
  }
}
