import leBasePage from '../../LEBasePage'

export default new class LESelectILCSession extends leBasePage {

    getModalTitle(){
        return '[class*="enrollment-key-entry__title"]'
    }

    getModalBodyTxt(){
        return '[class*="enrollment-key-entry-module__description"]'
    }

    getModalCloseBtn(){
        return '[class*="modal__close_btn"]'
    }

    getAddToCartBtn() {
        cy.get('[class*="course-detail-header__container"]').parent().within(() => {
            cy.get('[class*="icon-shopping-cart"]').click()
        })
    }

    getModalSessionsContainer() {
        return '[class*="session-module__session_wrapper"]'
    }

    getSessionName() {
        return '[class*="session__name"]'
    }
    
    //Pass the session name to add it to your cart
    getSessionByNameAndAddToCart(name) {
        cy.get('[class*="session-module__session_header"]').contains(name).parents('[class*="session-module__session_wrapper"]').within(() => {
            cy.get('[class*="action-button-module__title"]').click()
        })
    }

    getILCCourseModal(){
        return'[class="instructor-led-course-module__container___LYpnT"]'
    }

    getAddILCCartBtn(){
        return '[class="action-button-module__title___Vtjlw"]'
    }

    getILCSessionModalContainer() {
        return `[class*="instructor-led-course-module__content_left__"]`
    }
}