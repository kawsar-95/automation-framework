import arBasePage from "../../ARBasePage"

export default new class ARUploadFileModal extends arBasePage {

    getUploadFileContainer() {
        return `[class*="dialog-module__focus_area"]`
    }

    //----- For new Course Thumbnail Upload -----//

    getUploadFileBtn() {
        return this.getElementByDataNameAttribute("media-library-file-upload")
    }

    getAddUrlBtn() {
        return this.getElementByDataNameAttribute("add-url-button")
    }

    getUrlTxtF() {
        return '[class*="url-module__url_form"] ' + this.getTxtF()
    }

    getUrlApplyBtn() {
        return '[class*="url-module__url_form"] [class*="button-module__success"]'
    }

    getThumbnailUrlFilePAthTxtF() {
        return `[data-name="control_wrapper"] [aria-label="Url"]`;
    }

    //--------------------------------------------//


    getFilePathTxt() {
        return 'input[type="file"]';
    }

    getMediaLibraryUploadBtn() {
        return `[data-name="media-library-file-upload"]`
    }

    getChooseFileBtn(){
        return `[data-name="file"] [class="_choose_8f6xu_27"]`
    }

    getUploadChooseFileBtn() {
        return 'label[class*="_choose_"]'
    }

    getUploadbtnandClick() {
        return `[title="Upload File"]`
    }

    getVisibilityRadioBtn(visibilityIndex) {
        return `[class*="file-browser-modal-module__container"] [data-name="radio-button"]:nth-of-type(${visibilityIndex})`
    }

    getSaveBtn() {
        //return `[class*="modal-footer-module__child"]`
        // return `[class*="dialog-module__focus_area"] [data-name="submit"] [class*="icon icon-save"]`
        return '[data-name="file-browser"] [data-name="submit"]'
    }

    getContinueBtn() {
        return `[class*="_dialog_"]:nth-of-type(2) [data-name="submit"]`
    }

    getSaveurlBtn() {
        return `[class*="button-module__button--Gh4nT button-module__success--jRW9P"]`
    }

    getCancelBtn() {
        return '[data-name="file-browser"] [data-name="cancel"]'
    }

    // A5 Elements (Temporary)
    getA5FilePathTxtF() {
        return `input#file-input`
    }

    getA5ChooseFileBtn() {
        return '.choose-files > .input-group > .input-group-btn > .btn'
    }

    getA5SaveBtn() {
        return `.upload-file .success`
    }

    getA5CancelBtn() {
        return `.upload-file .cancel`
    }
    getMediaGridView() {
        return 'div[class*="_file_preview_container_"]'
    }
    getHelperTxt() {
        return 'div[class*="highlight cell"]'
    }
    getPublicText() {
        return 'These files are accessible and visible for non-LMS users through the Public Dashboard and Course Catalog.'
    }
    getPrivateText() {
        return 'These files can only be accessed by authenticated LMS users and enrolled learners.'
    }
    getPublicPrivateRadioBtn() {
        return '[data-name="radio-button"]'
    }

    getScormAddFileContinueBtn() {
        return '[data-name="submit"][class="_button_4zm37_1 _success_4zm37_44"]'
    }

    getScormApplyBtn() {
        return '[data-name="save"] [class="_content_4zm37_17"]'
    }
    /**
     * Added for the TC# C7367
     * @param {string} btnName Visibility Button Name. i.e. Public, Private
     * @returns Public Radio Button in Visibility section. 
     */
    getVisibilityBtnByName(btnName) {
        return `[data-name="radio-button-${btnName}"]`
    }

    getSubmitBtn() {
        return super.getElementByDataNameAttribute("submit")
    }

    getCancelModalBtn() {
        return super.getElementByDataNameAttribute("cancel")
    }

    getImagePreviewBtn() {
        return super.getElementByDataName("image-preview")
    }

    getApplyBtn() {
        return super.getElementByDataNameAttribute('media-library-apply')
    }

    //========== Added for TC C7368 - AUT-736  =======//
    /**
     * Use this method with getElementByRoleAttribute to get Flyout menu
     */
    getFlyOutTabIndex() {
        return `[tabindex="-1"]`
    }

    getFlyOutModal() {
        return ` div[id="fallbackFocus"]`
    }

    getMenuItem() {
        return `[role="menuitem"]`
    }

    getMediaLibraryFileMenuBtn() {
        return `[data-name="media-library-file-menu-button"]`
    }

    getMediaLibraryImagePreview() {
        return `[data-name="image-preview"]`
    }

    /**
     * use this method within presentation 
     */
    getPreview() {
        return `[aria-label="Preview"]`
    }

    /**
     * use this method within presentation 
     */
    getOption() {
        return `[aria-label="Option"]`
    }

    getFileManagerModalTitle() {
        return `[data-name="dialog-title"]`
    }


    getOcLoFileUploadDiv() {
        return '[data-name="file"]'
    }

    getListRoleOptions() {
        return `li[role="option"]`
    }

    getPublicPrivateHelperText() {
       return '[data-name="file-browser"] [data-name="description"]'
    }

    getFileUploadError() {
        return '[role="dialog"] [data-name="error"]'
    }

    getFileUploadErrorMsg() {
        return 'Sorry, something went wrong. If this problem persists, please contact your system administrator.'
    }

    getLastModifiedSpan() {
        return `[data-name="file-browser"] [class*="_last_modified_"]`
    }
}
