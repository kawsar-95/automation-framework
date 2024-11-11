import leBasePage from '../../LEBasePage'

export default new class LECourseDetailsModal extends leBasePage {
    // -------- Modal Container -------------//
    //This is for the rare occasion that common elements exist out of focus and in focus of the modal being displayed
    getModal() {
        return '[class*="modal_inner_container"]';
    }
    getCourseName() {
        return '[class="course-detail-header-module__name___MIyc2 course-detail-header__name"]';
    }

    getModalCloseBtn() {
        return '[class*="icon icon-x-thin"]';
    }

    getCourseContentChapterLockedIcon() {
        return this.getModal() + ' ' + '[class*="icon-lock-closed chapter__icon"]'
    }

    getCourseModuleHiddenContent() {
        return `[class*="icon-lock-closed"]`
    }


    getPrerequisiteHeader() {
        return this.getModal() + ' ' + '[class*="prerequisite_header"]'
    }

    getCoursePinBtnThenClick() {
        cy.get('[class*="course-detail-header-module__container"]').within(() => {
            cy.get('[class*="icon icon-pin"]').click()
        })
    }

    getCourseCredits() {
        return '[class*="course-credits__credits"]'
    }

    getTabByName(name) {
        return `[data-name="horizontal-tab-list"] [type="button"]:contains(${name})`
    }
    getRatingStar() {
        return 'div[class*="rating-module__stars___taajG"]>div[class*="rating-module__star___NvVsQ"]'
    }
    getEnrollSessionBtn(sessionName=''){
        return `[aria-label*="Enroll ${sessionName}"]`
    }


    getFileScannerStatus() {
        return '[class*="redux-form-file-upload-module__scanning_container___"]'
    }

    
    getCourseFileSaveBtn() {
        return '[aria-label="Submit Course Upload"]'
    }

    
    getCourseFileCancleBtn() {
        return '[aria-label="Cancel Course Upload"]'
    }

    
    getCourseFileUploadModal() {
        return '[class*="course-upload-modal-module__container___"]'
    }

    
    getCourseUploadBtn() {
        return '[class*="redux-form-image-upload__upload_image_wrapper"]'
    }

    getPrerequisiteCourseActionBtn() {
        return `[class*="course-prerequisites"] [data-name="action-button"] [type="button"]`
    }

}