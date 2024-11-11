import arBasePage from "../../ARBasePage"

export default new class ARPermissionsModal extends arBasePage{

    getModalHeader() {
        return   '[class*="dialog-module__title"]'
    }

    getModuleHeader() {
        return '[class*="form-section-module__header"]'
    }

    getModalCloseBtn() {
        return '[class*="_child_1"] [class*="_button_"]'
    }

    getModelHeader(){
        return  '[class*="_focus_area_ixjmy"]' 
    }

    getModalTitle(){
        return '[data-name="dialog-title"]'
    }
   
    // Added TC-FOR C2080
    getPromptHeader(){
        return  '[class*="_prompt_header_1oqe4_1"]'
    }

    getConfirmDeleteBtn(){
        return '[class*="_button_4zm37_1 _danger_4zm37_72"]';
    }
}