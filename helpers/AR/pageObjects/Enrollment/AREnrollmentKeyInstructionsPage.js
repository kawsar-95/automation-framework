import arBasePage from "../../ARBasePage";

export default new class AREnrollmentKeyInstructionsPage extends arBasePage {

    //----- General Email Template Fields -----//

    getSubjectTxtF() {
        return 'input[name="subject"]'
    }

    getBodyTxtF() {
        return '[data-name="body"] [class*="fr-element fr-view"]'
    }

    getSnippet() {
       // return '[class*="rich-text-editor-snippet-module__snippet"]'
       return '[data-name="draggable-snippet"]'
    }

    getAddEmailBtn() {
        return '[data-name="recipientEmailAddresses"] ' + this.getPlusBtn()
    }

    getEmailInputContainer() {
        return '[class*="text-input-module__input_container"]'
    }

    getEmailTxtF() {
       // return '[data-name="recipientEmailAddresses"] [class*="text-input-module__text_input"]'
      // return `input[aria-label="To email addresses"]`
      return `[data-name="recipientEmailAddresses"] input[aria-label="To email addresses"]`
    }
 
    getReceipientCount() {
       // return '[class*="compose-message-form-module__recipient_count"]'
       return `[data-name="recipient-count"]`
    }

    getSendToRadioBtn() {
        return '[data-name="recipientType"] [data-name="radio-button"]'
    }

    getUserSelectedOption() {
        return '[data-name="recipientIndividualUserIds"] [data-name="label"]'  
    }

    getSelectedOpt() {
       // return '[class*="select-option-value-module__label"]'
       return '[class*="_select_value_"]'
    }


    //----- Send to Individuals Only Fields -----//

    getIndividualsDDown() {
        return '[data-name="recipientIndividualUserIds"] ' + this.getDDownField()
    }

    getIndividualsTxtF() {
        return '[data-name="recipientIndividualUserIds"] input[name="recipientIndividualUserIds"]'  
    }


    //----- Send to Departments Fields -----//

    getAddDepartmentsBtn() {
        return '[data-name="select-departments"] ' + this.getPlusBtn()
    }

    getDepartmentRadioBtn() {
        return '[data-name="recipientDepartmentType"] '+ this.getRadioBtnByDataName()
    }

    getRadioBtnByDataName() {
        return '[data-name="radio-button"]'
    }

    getDepartmentContainer() {
        return '[data-name="department-list"] [class*="list-item-module__group"]'
    }

    getDepartmentName() {
        return '[data-name="department-list"] [data-name="name"]'
    }

    getDeleteDepartmentByName(name) {
        cy.get(this.getDepartmentName()).contains(name).parent().within(() => {
            cy.get(this.getTrashBtn()).click()
        })
    }


    //----- Send to Groups Fields -----//

    getGroupsDDown() {
        return '[data-name="recipientGroupIds"] ' + this.getDDownField()
    }

    getGroupsTxtF() {
        return '[data-name="recipientGroupIds"] input[name="recipientGroupIds"]'
    }

}