import leBasePage from '../../LEBasePage'

export default new class LEAboutCollaborationModal extends leBasePage {

    getDescriptionTxt() {
        return '[class*="sanitized-html-module__sanitized_container"]'
    }  

    getModalCloseBtn() {
        return '[class*="icon icon-x-thin"]'
    }

    getAboutModalContainer(){
        return '[class*="inline-modal-container-module__modal_container"]'
    }

}