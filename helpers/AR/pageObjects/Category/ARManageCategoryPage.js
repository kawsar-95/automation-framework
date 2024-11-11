import arBasePage from "../../ARBasePage";

export default new (class ARManageCategoryPage extends arBasePage {
 
  SelectManageCategoryRecord() {
    cy.get(`tr:nth-of-type(1) > td:nth-of-type(1)`).click();
  }
  SelectManageCategoryRecordWithOutClick() {
    cy.get(`tr:nth-of-type(1) > td:nth-of-type(1)`).children().find('input').should('have.attr', 'aria-label', 'false')
  }

})();
