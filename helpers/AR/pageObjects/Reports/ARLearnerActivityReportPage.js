import arBasePage from "../../ARBasePage";


export default new class ARLearnerActivityReportPage extends arBasePage {
    
  getRightMenuItems(){
    return '[class*="_child_w33d3_9"]'
  }
  getRightActionMenuLabel(){
    cy.get(this.getRightMenuItems()).children().should(($child)=>{
       expect($child).to.contain('Edit User');
       expect($child).to.contain('Message User');
       expect($child).to.contain('User Transcript');
       expect($child).to.contain('View Enrollments');
       expect($child).to.contain('Deselect')
    })
  }

  getLayoutMenuItems(){
    return '[class*="_grid_column_esh3t_1"]'
 }
      
  //this method verify layout items' name and index at the same time
  getVerifyLayoutMenuItemByNameAndIndex(index,name){
    cy.get(this.getLayoutMenuItems()).eq(index).should('contain',name)
  }
    
  getRightActionMenuContainer(){
    return '[class*="_content_4zm37_17"]'
  }
  
  //this method verify action menu items' name and index at the same time
  getActionMenuItemsInOrder(index,name){
    cy.get(this.getRightActionMenuContainer()).eq(index).should('contain',name)
  }

  // Added for the TC# C7277
  getAddCoursesBtn2Enroll() {
    return 'button[data-name="add-course"]'
  }

  getEditUserContextMenu() {
    return '[class*="_edit_context_menu_"]'
  }

}