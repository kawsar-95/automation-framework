import arBasePage from "../../ARBasePage";


export default new class ARILCActivityReportPage extends arBasePage {
    
      
   getRightActionMenuLabel(){
      cy.get(this.getRightMenuParentILCActivitypage()).children().should(($child) => {
        expect($child).to.contain('Mark Attendance');
        expect($child).to.contain('Edit Activity');
        expect($child).to.contain('User Transcript');
        expect($child).to.contain('Edit User');
        expect($child).to.contain('Message User');
        expect($child).to.contain('View Enrollments');
        expect($child).to.contain('Un-enroll');
        expect($child).to.contain('Deselect');
     })
   }

   getSectionHeader () {
      return `[class="section-title"]`;
   }

   getLayoutMenuItems(){
      return '[class*="_grid_column_esh3t_1"]'
      }
        
   //this method verify layout items' name and index at the same time
   getVerifyLayoutMenuItemByNameAndIndex(index,name){
      cy.get(this.getLayoutMenuItems()).eq(index).should('contain',name)
   }
   
   getFilterCancelBtn(){
      return '[class*="_button_4zm37_1 _cancel"]'
   }

   getCourseNameDDownSearchTxtF(){
      return '[class*="_search"] [aria-label="Course"]'
   }
  
   getDropDownField(){
      return '[data-name="field"] [data-name="selection"]'
   }

   getPropertyNameDDownOpt(){
      return '[class*="_select_option"]'
   }

   getSubmitAddFilterBtn(){
      return '[data-name="submit-filter"]'
   }

   courseFilter(courseName) {
      cy.get(this.getDropDownField()).click();
      cy.get(this.getCourseNameDDownSearchTxtF()).type(courseName)
      cy.get(this.getPropertyNameDDownOpt()).contains(courseName).click()
      cy.get(this.getSubmitAddFilterBtn()).click();
   }

   getMassActionsToggleBtn() {
      return '[data-bind="click: ToggleChecked"]'
   }

   getRightMenuH2(){
      return 'instructorLedCourseActivities-actions'
   }

   getViewEnrollmentsBtn() {
      return 'view-user-enrollments-for-user-single-context-button'
   }

   getUserUpdateSuccessText()
   {
      return 'User has been updated successfully.'
   }

   getUserUnenrollText()
   {
      return 'User has been un-enrolled.'
   }

   getUnrollUser()
   {
      return 'Un-enroll User'
   }

   getUnrollUserPrompt() 
   {
      return 'unenroll-user-prompt'
   }

   // Added for the TC# C7267
   getRightMenuParentILCActivitypage() {
       return '[class*=_context_menu_]'
   }

   getUserTranscriptBtn() {
       return '[data-name="user-transcript-single-context-button"]'
   }

   getBackBtn() {
       return '[data-name="back"]'
   }

   getPrintTranscriptBtn() {
       return '[data-name="print-transcript-context-button"]'
   }

   getViewCompetenciesBtn() {
       return '[data-name="view-transcript-competencies-context-button"]'
   }

   getViewCertificateBtn() {
        return '[data-name="view-transcript-certificates-context-button"]'
   }

   getViewCreditsBtn() {
       return '[data-name="view-transcript-credits-context-button"]'
   }

   getViewEnrollmentsBtn() {
       return '[data-name="view-transcript-enrollments-context-button"]'
   }

   getILCActivityTitle() {
       return '[class="section-title"]'
   }

   // Added for the TC# C7327
   getGridDisplayBtn() {
        return 'button[data-name="columns-select-button"]'
    }

    getGridTableDisplayColumnSelect() {
        return '[class="_checkbox_1yld4_47 _checkbox_5cmdv_31 checkbox"]'
    }

    getILCReportStatus() {
        return '[data-name="enrollmentStatus"]'
    }

    getILCReportProgress() {
        return '[data-name="enrollmentProgress"]'
    }

    getILCActivityReportScore() {
        return '[data-name="sessionEnrollmentScore"]'
    }

    getILCActivityReportCredit() {
        return '[data-name="courseCredits"]'
    }

    getILCActivityReportClassAttended() {
        return '[data-name="classesAttendedCount"]'
    }

    getEditActivityRadioBtn() {
        return '[data-name="radio-button"]'
    }

    getEditActivitySession() {
        return '[aria-label="Sessions"]'
    }

    getUserTranscriptRadioBtn(){
        return '[data-name="markAs"] [data-name="radio-button"]'
    }

    assertEnrollmentStatusAndProgress(rowNumber, status, progress) {
        cy.get(this.getILCReportStatus()).eq(rowNumber).should('contain', status)
        cy.get(this.getILCReportProgress()).eq(rowNumber).should('contain', progress)
    }
}