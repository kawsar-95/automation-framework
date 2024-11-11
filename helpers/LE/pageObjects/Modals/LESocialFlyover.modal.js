import leBasePage from '../../LEBasePage'

export default new class LESocialFlyoverModal extends leBasePage {

    getViewProfileBtn() {
        return '[class*="social-profile-flyover-module__action_button_wrapper"] [class*="icon icon-man"]'
    }

    getSendMessageBtn() {
        return '[class*="social-profile-flyover-module__action_button_wrapper"] [class*="icon icon-paper-plane"]'
    }

    getChatOnTeamsBtn() {
        return '[class*="social-profile-flyover-module__action_button_wrapper"] [class*="icon icon-microsoft-teams"]'
    }

}