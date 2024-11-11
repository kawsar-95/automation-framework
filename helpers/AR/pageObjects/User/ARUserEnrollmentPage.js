import arBasePage from "../../ARBasePage";

export default new class ARUserEnrollmentPage extends arBasePage {

     getChooseDDownSearchTxtF() {
          return 'input[aria-label="User"]'
     }
     ChooseUserAddFilter(propertyName) {
          cy.get('[data-name="selection"]').click();
          cy.get(this.getChooseDDownSearchTxtF()).type(propertyName)
          cy.get('[class="_select_option_4qguj_1"]').contains(propertyName).click()
          cy.get(this.getSubmitAddFilterBtn()).click();
          cy.get(this.getWaitSpinner() , {timeout:15000}).should("not.exist")
     }
     getPageHeader() {
          return '[class*="_header_content_cz9wn_4"]'
     }
     getReEnrollUserButton() {
          return '[title="Re-enroll User"]'
     }
     getViewHistoricButton() {
          return '[title="View Historic"]'
     }
     
     selectTableCellRecord(rowValue) {
          cy.get('[data-name="table-container"]').within(() =>{
              cy.contains(rowValue).click()
          })
     }
}