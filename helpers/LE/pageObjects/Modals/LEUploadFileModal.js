import leBasePage from '../../LEBasePage'

export default new class LEUploadFileModal extends leBasePage {

    getUploadLabel() {
        return '[class*="course-upload-modal__title"]'
    }

    getBrowseBtn() {
        return '[class*="icon-resource-image"]'
    }

    //Need to use this before attaching file when the upload modal is 
    //ontop of the create collaboration post modal
    getUploadContainer() {
        return 'images'
    }

    getUploadFile(){
        return '[class*="redux-form-image-upload__upload_image_text"]' 
    }

    getUploadContentBtn(){
        return '[class*="action-button-module__title___Vtjlw"]';
    }
    
    getDropZone() {
        return '[class*="drop-zone-module__drop_zone"]'
    }

    getUploadedFileTxtF() {
        return '[class*="redux-form-image-upload__upload_image_text"]'
    }

    getUploadedFileErrorMsg() {
        return '[class*="file-chip-module__error"]'
    }

    getUploadedFileMsg() {
        return '[class*="upload__processing_file"]'
    }

    getUploadNotesTxtF() {
        return '[class*="redux-form-textarea-module__text_area"]'
    }
    getUploadFooterBtn(){
        return 'button[type="submit"]'
    }

    getDeleteUploadedFileByName(name) {
        cy.get('[class*="file-chip-module__name"]').contains(name).parents('[class*="file-chip-module__container"]').within(() => {
            cy.get('[class*="icon icon-trashcan"]').click()
        })
    }

    getModalErrorMsg() {
        return '[class*="field-error-module__field_error"]'
    }

    getSaveBtn() {
        return '[class*="course-upload-modal__submit_btn"]'
    }

    //Can use .contains(<btn label>) to get either footer button
    getFooterBtn() {
        return '[class*="button-module__btn"]'
    }



    //----- Specific Selectors for Certificate Uploads -----//

    getDateFContainer() {
        return '[class*="redux-form-date-picker-module__field"]'
    }

    getDateFHeader() {
        return '[class*="redux-form-date-picker__label"]'
    }

    getDateTxtF() {
        return '[class*="form-control"]'
    }

    //Pass date in MM/DD/YYY format
    getDateIssuedTxtF(date) {
        cy.get(this.getDateFHeader()).contains('Date Issued').parents(this.getDateFContainer()).within(() => {
            cy.get(this.getDateTxtF()).type(date)
        })
        cy.get(this.getUploadLabel()).click({force:true}) //close the calendar
    }

    getHasExpiryDateToggle() {
        return '[class*="toggle__slider"]'
    }
    
    //Pass date in MM/DD/YYY format
    getExpiryDateTxtF(date) {
        cy.get(this.getDateFHeader()).contains('Expiry Date').parents(this.getDateFContainer()).within(() => {
            cy.get(this.getDateTxtF()).type(date).blur()
        })
        cy.get(this.getUploadLabel()).click({force:true}) //close the calendar
    }

    getIssuerTxtF() {
        return '[name="issuer"]'
    }

}