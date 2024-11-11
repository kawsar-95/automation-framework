import leBasePage from '../../LEBasePage'

export default new class LEInactivityTimeoutModal extends leBasePage {

    getCountdown(){
        return '[class*="keep-alive-module__seconds_countdown"] [class*="Component-off_screen_text"]'
    }
    getVerificationNumber(){
        return '[class*="keep-alive-module__verification_number"]'
    }

    getContinueSessionBtn(){
        //return '[class*="continue_session_btn"]'
        //return '[class*="btn keep-alive-module__continue_session_btn___cN61Y keep-alive__continue_btn button-module__btn___svB4M"]'
        return 'button[class*="keep-alive__continue_btn"]'
    }

    getLogoutBtn(){
        return 'button[class*="keep-alive-module__logout_btn"]'
    }

    getInactivityVerificationTxtF(){
        return '[class*="keep-alive-module__verification_container"] [type="text"]'
    }

    //Elements after user has been logged out

    getModalMessage(){
        return 'div[class*="message-modal-module__message___"]'
    }

    getOKBtn(){
      return '[class*="btn message-modal-module__ok_btn"]'  
    }

}