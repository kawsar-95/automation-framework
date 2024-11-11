import leBasePage from '../../LEBasePage'

export default new class LETermsAndConditionsModal extends leBasePage {

    getTermsAndConditions(){
        return '[class*="terms-and-conditions__text"]'
    }

    getAgreeBtn() {
        return '[class*="terms-and-conditions__accept_button"]'
    }

    getDisagreeBtn() {
        return '[class*="terms-and-conditions__reject_button"]'
    }

}