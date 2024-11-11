import arBasePage from "../../ARBasePage";
import ARVenuePage from "../Venue/ARVenuePage";


export default new class ARLearnerProgressReportPage extends arBasePage {
    
    getActionMenu(){
        return '[class*="_child_w33d3_9"]';
    }
     getRightActionMenuLabel(){
       cy.get(this.getActionMenu()).children().should(($child)=>{
        expect($child).to.contain('Edit User');
       expect($child).to.contain('Message User');
       expect($child).to.contain('View Enrollments');
       expect($child).to.contain('Deselect');
    })
   }

   getCancelEditBtn(){
    return '[class*="_button_4zm37_1 _cancel"]';
   }

    // TC- for the TC# C7278
    getGeneralStatusToggleLprogress() {
        return '[id="userStatus"] '
    }

    getActionContextMenu() {
        return '[class*="_context_menu_"]'
    }
}