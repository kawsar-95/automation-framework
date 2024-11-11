import arBasePage from "../../ARBasePage";


export default new class ARLearnerCompetenciesReportPage extends arBasePage {
      
      getRightActionMenuLabel(){
         cy.get('[class*="sidebar-content"]').children().should(($child)=>{
         expect($child).to.contain('Manage');
         expect($child).to.contain('Message User');
         expect($child).to.contain('Deselect');
      })
    }
}