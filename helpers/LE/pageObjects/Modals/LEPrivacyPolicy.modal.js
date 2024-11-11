import leBasePage from '../../LEBasePage'

export default new class LELanguageModal extends leBasePage {

    getPrivacyPolicy(){
        return '[class*="prompt-module__body"]'
    }
    
    getCloseXBtn(){
        return '.icon-x-thin'
    }

    getCloseBtn(){
        return '[class*="btn prompt-module__footer_btn"]'
    }

    getEnglishPrivacyPolicyTxt(){
        return 'This is a privacy policy.'
    }

    getFrenchPrivacyPolicyTxt(){
        return 'Ceci est une politique de confidentialité.'
    }

    getItalianPrivacyPolicyTxt(){
        return 'Questa è una politica sulla privacy.'
    }
}