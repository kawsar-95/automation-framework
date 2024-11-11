import arBasePage from "../../ARBasePage";


export default new class ARSessionApprovalReportPage extends arBasePage {
      
      getRightActionMenuLabel(){
         cy.get('[class*="sidebar-content"]').children().should(($child)=>{
         expect($child).to.contain('Approve');
         expect($child).to.contain('Decline');
         expect($child).to.contain('Message User');
         expect($child).to.contain('Edit User');
         expect($child).to.contain('Deselect');
      })
    }
}