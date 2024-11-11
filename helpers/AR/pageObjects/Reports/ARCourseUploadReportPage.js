import arBasePage from "../../ARBasePage";


export default new class ARCoureUploadReportPage extends arBasePage {

  getRightActMenu() {
    return '[class*="_child_w33d3_9"]'
  }
  getRightActionMenuLabel() {
    cy.get(this.getRightActMenu()).children().should(($child) => {
      expect($child).to.contain('Manage');
      expect($child).to.contain('Approve');
      expect($child).to.contain('Decline');
      expect($child).to.contain('Delete');
      expect($child).to.contain('Deselect')
    })
  }
  getA5TableColumnLabelAssertion() {
    cy.get('[role*="columnheader"]').children().should(($child) => {
      expect($child).to.contain('Course');
      expect($child).to.contain('Type');
      expect($child).to.contain('First Name');
      expect($child).to.contain('Last Name');
      expect($child).to.contain('Username');
      expect($child).to.contain('Date Added');
      expect($child).to.contain('Status');
    })
  }

  getRadioBtnModuleLableAssertion() {
    cy.get('[class*="radio-button-module__label--MXLHW"]').eq(0).should('have.text', 'Pending Approval')
    cy.get('[class*="radio-button-module__label--MXLHW"]').eq(1).should('have.text', 'Approved')
    cy.get('[class*="radio-button-module__label--MXLHW"]').eq(2).should('have.text', 'Declined')
  }

  getRadioBtnByLable(name) {
    cy.get('[data-name="radio-button"] > span[class*="_label_"]').filter(`:contains(${name})`).click({ force: true })
  }
}