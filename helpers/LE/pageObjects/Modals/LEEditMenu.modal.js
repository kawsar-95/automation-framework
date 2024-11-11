import leBasePage from '../../LEBasePage'

export default new class LEEditMenuModal extends leBasePage {

    

    getUploadMenuImageModuleLabel() {
        return `[class*="edit-menu-item-custom-icon-module__label"]`
    }

    getUploadMenuImageContainer() {
        return `[class*="edit-menu-item-custom-icon-module__label_wrapper"]`
    }

    getSaveBtn() {
        return '[class*="module__save_btn"]'
    }

    getCancelBtn() {
        return `[class*="button-module__cancel"]`
    }
    

}