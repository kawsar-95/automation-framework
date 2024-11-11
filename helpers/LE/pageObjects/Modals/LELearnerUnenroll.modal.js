import leBasePage from '../../LEBasePage'

export default new class LELearnerUnenrollModal extends leBasePage {

    getModalCloseBtn(){
        return '[class*="icon icon-x-thin"]';
    }

    getUnenrollBtn(){
        return '[class*="button-module__warning"]';
    }

    getCancelBtn(){
        return '[class*="button-module__cancel"]';
    }
}