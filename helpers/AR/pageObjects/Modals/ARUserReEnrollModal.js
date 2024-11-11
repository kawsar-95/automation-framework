import arBasePage from "../../ARBasePage"

export default new class ARUserReEnrollModal extends arBasePage{

    // Use this text as value for data-name attribute to get this element
    getOKBtn() {
        return "confirm";
    }

    getApplyBtn(){
        return "save";

    }

    // Use this text as value for data-name attribute to get this element
    getCancelBtn() {
        return "cancel";
    }

    selectApplyBtn(){
        cy.get('#reEnrollmentUsers').within(() =>{
            cy.contains('OK').click()
        })
    }
}