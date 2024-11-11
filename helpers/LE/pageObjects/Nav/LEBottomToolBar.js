import leBasePage from '../../LEBasePage'

export default new class LEBottomToolBar extends leBasePage {

    getAboutBtn(){
        return '[class*="icon icon-absorb"]'
    }   

    getLanguageBtn(){
        return '.icon-globe'
    }

    getPrivacyPolicyBtn() {
        return `[class*="footer-module__privacy_policy_btn___"]`;
    }
}