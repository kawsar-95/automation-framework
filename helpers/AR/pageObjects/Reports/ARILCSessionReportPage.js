import arBasePage from "../../ARBasePage";


export default new class ARLearnerCompetenciesReportPage extends arBasePage {
      
   selectLearnerCompleteCheckBox(){
      return 'th [class*="_control_wrapper_o5kxr_9 _column_o5kxr_28 column"]'
   }

   getCreditTxtF(){
      return `[aria-label="All Learners Credits"]`
   }

   getLearnerNameTxtF(){
      return `tbody >tr:nth-child(1) td:nth-child(1)`
   }

   getRightActionMenuLabel(){
      cy.get('[class*="sidebar-content"]').children().should(($child)=>{
         expect($child).to.contain('Manage Grades & Attendance');
         expect($child).to.contain('View Waitlist');
         expect($child).to.contain('Enroll Users');
         expect($child).to.contain('Message Instructor');
         expect($child).to.contain('Deselect');
      })
   }

   getSectionHeader () {
      return `[class="section-title"]`;
   }

   getLayoutMenuItems(){
      return '[data-bind="term: Title"]'
   }
        
   //this method verify layout items' name and index at the same time
   getVerifyLayoutMenuItemByNameAndIndex(index,name){
      cy.get(this.getLayoutMenuItems()).eq(index).should('contain',name)
   }
      
   getRightActionMenuContainer(){
      return '[class="sidebar-content"]'
   }
    
   //this method verify action menu items' name and index at the same time
   getActionMenuItemsInOrder(index,name){
      cy.get(this.getRightActionMenuContainer()).children(index).should(($child) =>{
          expect($child).to.contain(name);
      })
   }

    // Added for TC# C944 (for enrolling a user from Activity -> ILC Session page)
    getEnrollUserIdInput() {
        return 'div[class="input-group-btn"] a[title="Add"]'
    }

    getUserIdContainer() {
        return 'div[id="UserIds"]'
    }

    getUserNameInput() {
        return 'input[class*="default"]'
    }

    getSelectedUserLabel() {
        return 'div[class*="result-label"]'
    }

    getEnrollUserBtn() {
        return 'a[class*="submit-edit-content "]'
    }

    getSessionWaitlistPageHeader() {
      return '[id="content"] div[class*="section-title"]'
    }

   getDisplayColumnItems() {
      return '[class*="label"]'
   }

   getDisplayColumnsToggle() {
      return '[data-name="columns-select-button"]'
   }

   // Added for the TC# C7327
   getMarkAttendanceClassBtn() {
        return '[data-name="mark-attendance-toggle"]'
    }

    getMarkAttendanceInput() {
        return '[class*="_input_"]'
    }

    getILCSessionReportGridRow(index) {
        return `tbody > tr > :nth-child(${index})`
    }

    getEditActivityScore() {
        return '[class="_input_19krc_4"]'
    }

    getEditActivityCredit() {
        return '[data-name="multiple-credits"] [class*="_number_input"] [class*="_input"]'
    }

    getEditActivityStatus() {
        return '[data-name="session-enrollment-attendances"] [data-name="status"]'
    }

    getEditActivityDateCompleted() {
        return '[data-name="dateCompleted"]'
    }

    getMarkGradeAttendanceReportRow(index1, index2) {
        return `tbody > :nth-child(${index1}) > :nth-child(${index2})`
    }

    getMarkAttendanceScoreParentInput() {
        return '[aria-label="All Learners Score"]'
    }

    // Added for the JIRA# AUT-578, TC# C2038
    getCancelBtn() {
        return '[class*="_modal_footer_"] [data-name="cancel"]'
    }

}