import ARBasePage from "../../ARBasePage";

export default new (class A5ClientsPage extends ARBasePage {

  getA5ClientPageSidebar(name) {
    cy.get('.sidebar-content > a').filter(`:contains(${name})`).click();
  }

  getA5ClientPageAbsorbSupportModalCancel() {
    cy.get('#confirm-modal-content a[class="btn cancel has-icon"]').click(); 
  }

  getA5ClientPageAbsorbSupportModalOK() {
    cy.get('#confirm-modal-content a[class="btn has-icon warning"]').click(); 
  }

  getCompanyNameInput() {
    return 'input[id="CompanyName"]'
  }


})();