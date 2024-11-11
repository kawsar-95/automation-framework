import arBasePage from "../../ARBasePage";


export default new class ARAssesstmentsReportPage extends arBasePage {


   getA5ValueDDown() {
      return `[class="value-select"] > select`
   }

   getRightActionMenuLabel() {
      cy.get('[class*="sidebar-content"]').children().should(($child) => {
         expect($child).to.contain('Summary Report');
         expect($child).to.contain('Assessment Activity');
         expect($child).to.contain('Answers Report');
         expect($child).to.contain('Deselect');
      })
   }
   TypeAddFilter(propertyName, Operator = null) {
      cy.get(this.getA5AddFilterBtn()).click();
      cy.get(this.getA5PropertyNameDDown()).select(propertyName);
      cy.get(this.getA5ValueDDown()).select(Operator);
      cy.get(this.getA5SubmitAddFilterBtn()).click();
   }

   getA5TableColumnLabelAssertion() {
      cy.get('[class*="column-label"]').children().should(($child) => {
         expect($child).to.contain('Course Name');
         expect($child).to.contain('Assessment Name');
         expect($child).to.contain('Type');
         expect($child).to.contain('Attempts');
         expect($child).to.contain('Passes');
         expect($child).to.contain('Fails');
         expect($child).to.contain('Average Score');
         expect($child).to.contain('Average Time');
      })
   }

}