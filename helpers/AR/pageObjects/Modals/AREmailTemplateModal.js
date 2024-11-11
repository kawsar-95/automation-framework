export default new class AREmailTemplateModal {

    getModalErrorMsg() {
        return '[class*="_errors"]'
    }
    
    getSubjectTxtF() {
       
       return 'input[name="subject"]'
    }

    getSubjectErrorMsg() {
        return '[data-name="subject"] [class*="_error"]'
    }

    getSendToLearnerToggleContainer() {
        return "sendToLearner";
    }

    getSendToAdministratorsToggleContainer() {
        return "sendToAdministrators";
    }

    getSendToSupervisorToggleContainer() {
        return "sendToSupervisor";
    }

    getSaveBtn() {
        return '[data-name="content"] [class*="icon icon-disk"]'
    }

    getCancelBtn() {
        return '[data-name="content"] [class*="icon icon-no"]'
    }

}