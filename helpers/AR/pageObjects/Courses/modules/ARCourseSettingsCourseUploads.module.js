import ARBasePage from "../../../ARBasePage";

export default new class ARCourseSettingsCourseUploadsModule extends ARBasePage {
    getCourseUploadContainer() {
        return '[class*="course-upload-definition-module__course_upload_definition"]'
    }

    getCourseUploadHeader() {
        return '[class*="expandable-list-item-header-module__name"]'
    }

    getEditUploadInstructionsBtn() {
        return '[data-name="edit-upload-instructions"]'
    }

    getExpandUploadByNameThenClick(name) {
        cy.get('[data-name="course-upload-definitions"] [data-name="name"]').contains(name)
            .parents('[data-name="course-upload-definitions"][role="listitem"]').within(() => {
                cy.get('[class*="icon icon-pencil"]').click()
            })
    }

    geDeleteUploadByNameThenClick(name) {
        cy.get('[data-name="course-upload-definitions"] [data-name="name"]').contains(name)
            .parents('[data-name="course-upload-definitions"][role="listitem"]').within(() => {
                cy.get(this.getTrashBtn()).click()
            })
    }

    getDeleteCourseUpload(){
        return '[title="Delete"][class="_icon_button_1qn04_1 _remove_61anq_1"]'
    }

    getConfirmDeleteBtn(){
        return '[data-name="confirm"]'
    }

    getHideCourseUploadBtn(){
        return '[aria-label="Hide Course Uploads"]'
    }

    getDeleteCourseUploads(){
        cy.get(this.getDeleteCourseUpload()).click()
        cy.get(this.getConfirmDeleteBtn()).click()

    }

    getLabelTxt() {
        return "Label";
    }

    getLabelErrorMsg() {
        return '[data-name="course-upload-definitions"] [class*="_error"]'
    }

    getApprovalRadioBtn() {
        return '[data-name="course-upload-definitions"] [data-name="radio-button"]'
    }

    getApprovalBanner() {
        return '[data-name="approvalType"] [data-name="description"]'
    }

    getApprovalUserDDown() {
        return '[data-name="approvalUserIds"] [data-name="selection"]'
    }

    getApprovalUserSearchTxtF() {
        return '[name="approvalUserIds"]'
    }

    getApprovalUserOpt(approvalUser) {
        cy.get('[class*="_user_name_email"]').contains(approvalUser).click({force:true})
    }

    getReviewersNotesTxtF() {
        return '[name="reviewersNotes"]'
    }

    getNoCourseUploadsBanner() {
        return '[data-name="course-upload-definitions"] [aria-label="Notification"]'
    }

    //Can be used to check if an upload label exists (needed if multiple uploads are present)- NASA-5756
    getVerifyUploadExists() {
        return '[data-name="course-upload-definitions"]'
    }
    getLabelTxtF() {
        return 'input[aria-label="Label"]'
    }

    getAddCourseUploadDefinition() {
        return '[data-name="add-course-upload-definition"]'
    }

    getEditUploadInstructions() {
        return '[data-name="edit-upload-instructions"]'
    }

    getUploadInstructions() {
        return '[aria-label="Upload Instructions"]'
    }

   
     getAddUploadBtn(){
         return '[data-name="add-course-upload-definition"]'
     }
 
       
     getUploadInstructionsbtn(){
         return '[data-name="edit-upload-instructions"]'
     }
 
       
     getUploadInstructionTxt(){
         return '[aria-label="Upload Instructions"]'
     }
 
       
     getApplyBtn(){
         return '[data-name="save"]'
     }
 
       
     getCourseUploadArea(){
         return '[aria-label="Course Uploads"][role="list"]'
     }
 
       
     getCourseCollapseBtn(){
         return '[title="Collapse"]'
     }

}