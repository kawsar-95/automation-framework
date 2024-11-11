import { ilcDetails } from "../../../TestData/Courses/ilc";
import { users } from "../../../TestData/users/users";
import arBasePage from "../../ARBasePage";


export default new class ARCourseApprovalReportPage extends arBasePage {
      
   getRightActionMenuLabel(){
         cy.get('[class*="sidebar-content"]').children().should(($child)=>{
         expect($child).to.contain('Approve');
         expect($child).to.contain('Decline');
         expect($child).to.contain('Message User');
         expect($child).to.contain('Edit User');
         expect($child).to.contain('Deselect');
      })
   }
    
   getLayoutMenuItems(){
      return '[data-bind="term: Title"]'
   }

   //this method verify layout items' name and index at the same time
   getVerifyLayoutMenuItemByNameAndIndex(index,name){
      cy.get(this.getLayoutMenuItems()).eq(index).should('contain',name)
   }

   getSuccessText() {
      return '[class*="highlight success"]'
   }

   // Added for the TC# C7297
   getDataMenuAttribute(attr) {
       return `[data-menu=${attr}]`
   }

   getSelectedItemChkBox() {
       return 'span[class="checkbox selected"]'
   }
}

export const getSuccessMsg = `You have approved ${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname} for enrollment in ${ilcDetails.courseName}.`
export const getDeclineMsg = `You have denied the enrollment request for ${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname} in ${ilcDetails.courseName}.`