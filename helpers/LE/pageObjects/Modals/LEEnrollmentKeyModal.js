import leBasePage from '../../LEBasePage'

export default new class LEEnrollmentKeyModal extends leBasePage {

//----------Enrollment Key Modal for New User Signup----------//

    getModalTitle(){
        return '[class*="enrollment-key-entry__title"]'
    }

    getModalBodyTxt(){
        return '[class*="enrollment-key-entry-module__description"]'
    }

    getModalCloseBtn(){
        return '[class*="modal__close_btn"]'
    }

    getKeyNameTxtF() {
        return `[name="enrollmentkey"]`
    }

    getSignupBtn() {
        return '[class*="enrollment-key-module__btn"]'
    }

    getErrorMsg() {
        return '[class*="form__error_message"]'
    }

    //Verifies the success message after entering a valid enrollment key
    getSuccessMsg(eKey) {
        cy.get('[class*="profile-form__subtitle"]').should('contain.text', 'To use the key ' + eKey + ', please sign up for a new account or login to an existing one.')
    }

//----------Enrollment Key Modal from Deeplink .../?keyname=enrollmentkeyname----------//

    //Only available when logged in and directed from a valid enrollment key deeplink (ex. /?keyname=enrollmentkeyname)
    getEnrollBtn() {
        return '[class*="enrollment-key-entry__enroll_btn"]'
    }
    
    //Only available after the getEnrollBtn() has been clicked
    getMyCoursesBtn() {
        return '[class*="enrollment-key-entry__my_courses_btn"]'
    }


}