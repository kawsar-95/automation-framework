import leBasePage from '../../LEBasePage'

export default new class NLEChangePasswordPage extends leBasePage {

    getCurrentPasswordTxtF() {
        return `input[name='currentPassword']`;
    }
    getNewPasswordTxtF() {
        return `input[name='newPassword']`;
    }
    getConfirmPasswordTxtF() {
        return `input[name='confirmPassword']`;
    }
    getChangePasswordTxtBox(){
        cy.get('[data-name*="change-password-form"]').children().within(()=>{
        cy.get(`input[type="password"]`).should(`have.attr`,`aria-required`,`true`) 
     })
    }
    getChangePasswordTxtBLevel(){
        cy.get('[data-name*="change-password-form"]').children().should(($child)=>{
        expect($child).to.contain('Current Password')
        expect($child).to.contain('New Password')
        expect($child).to.contain('Confirm Password')
        })
    }
    getSubmitBtn(){
        return `button[data-name="submit"]`
    }
    getCancelBtn(){
        return `button[data-name="cancel"]`
    }
    getCurrentPasswordTxtErrorMsg() {
        return '[data-name="currentPassword"] [data-name="error"]'
    }
    getConfirmPasswordTxtErrorMsg() {
        return '[data-name="confirmPassword"] [data-name="error"]'
    }
    getNewPasswordTxtErrorMsg() {
        return '[data-name="newPassword"] [data-name="error"]'
    }

    
}