export default new class ARAddESignatureLessonModal {

    getNameTxtF() {
        return '[data-name="electronic-signature-lesson-general"]  [name="name"]'
    }

    getDescriptionTxtF() {
        return '[data-name="electronic-signature-lesson-general"] [data-name="description"] [class*="fr-element fr-view"] > p'
    }

    getAgreementTxtF() {
        return '[data-name="agreement"] [class*="fr-element fr-view"] > p'
    }

    getMethodRadioBtn() {
        return '[data-name="method"] [data-name="label"]'
    }

    getMethodDescriptionTxt() {
        return '[data-name="method"] [class*="_description"]'
    }

    //Pass "Authenticate", or "PIN" to verify the description method.
    getVerifyMethodDescription(method) {
        switch (method) {
            case 'Authenticate':
                cy.get(this.getMethodDescriptionTxt()).should('contain', "Learners will be required to electronically sign by re-authenticating with their username and password. Note this cannot be used by learners logging in to the LMS via SSO.")
                break;
            case 'PIN':
                cy.get(this.getMethodDescriptionTxt()).should('contain', "Learners will be required to electronically sign by entering their username and PIN.")
                break;
            default:
                cy.addContext('Incorrect Parameter Passed to switch case')
        }
    }

    getSaveBtn() {
        return '[data-name="save"]'
    }

    // Added For TC# C7316
    getMethodRadioBtn2() {
        return `[aria-label='Method']`
    }

    getESignatureMethodDescription() {
        return '[data-name="description"][id*="form-control-method-"]'
    }
}

export const signatureModalConstants ={
    "AUTHENTICATE_METHOD_DESCRIPTION" : "Learners will be required to electronically sign by re-authenticating with their username and password. Note this cannot be used by learners logging in to the LMS via SSO.",
    "PIN_METHOD_DESCRIPTION" :"Learners will be required to electronically sign by entering their username and PIN."
}