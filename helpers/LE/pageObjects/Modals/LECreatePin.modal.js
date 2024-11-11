import leBasePage from '../../LEBasePage'

export default new class LECreatePinModal extends leBasePage {

    getModalTitle() {
        return '[class*="pin-module__title"]'
    }

    getVerifyModalDesc() {
        cy.get('[class*="pin-module__text"]').should('contain', 'Please create a PIN that will be used to verify your identity when providing an electronic signature within a course. The PIN must be between 4 and 10 numbers.')
    }

    getPinTxtF() {
        return "pin"; //name attr
    }

    getPinErrorMsg() {
        return '[class*="form-field__error_message"]'
    }

    getOKBtn() {
        return '[class*="pin-module__button"]'
    }
}