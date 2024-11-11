import arBasePage from "../../ARBasePage";

export default new class ARComposeMessagePage extends arBasePage {

    // Selectors

    // Pass this value to getElementByDataNameAttribute() to get the To text field dropdown DOM Element
    getToTextFieldDDown() {
        return `selection`
    }

    getToTextFieldDDownSearchTxtF() {
        return '[name="recipientIndividualUserIds"]'
    }

    getToTextFieldDDownOpt(optLabel) {
        return cy.get('[class*="full_name"]').contains(optLabel)
    }

    getToTextFieldDDownUserNameOpt(optLabel) {
        return cy.get('[class*="_user_name_email"]').contains(optLabel)
    }

    

    // Pass this value to getElementByDataNameAttribute() to get the Add Department DOM Element
    getAddDepartmentBtn() {
        return 'select-departments'
    }

    getSubjectTxtF() {
        return '[name="subject"]'
    }

    getRecipientTagBtn(){
        return `deselect`;
    }

    getSubjectDataNameText(){
        return `subject` 
    }

    getBodyDataNameText(){
        return `body`
    }

    // Pass this value to getElementByAriaLabelAttribute() to get the Text Area DOm Element
    getTextArea() {
        return `Body`
    }

    getComposeSentToRadioBtn() {
        return `[data-name="recipientType"] [class*="_label_6rnpz_32"]`

    }

    getRecipientCountTxtField() {
        return '[data-name="recipient-count"]';
    }

    getSendToRadioBtn() {
        return '[data-name="recipientType"] [data-name="radio-button"]'
    }

    // Added for TC# C1079
    getSelectedRecipientElement($name) {
        return `span[title="${$name}"]`
    }

    getNonLearnersMessageContainer() {
        return 'div[data-name="non-learners"]'
    }

    getUserSelectionDDown() {
        return '[data-name="selection"]'
    }

    getMessageBodyText() {
        return '[aria-label="Body"]'
    }

    getSendButton() {
        return '[data-name="submit"]'
    }

    // Added for the TC# C7349
    getListOptions() {
        return '[data-name="options"] ul li'
    }

    getSendToRadioBtn() {
        return '[aria-label="Send to"] [data-name="label"]'
    }

    verifySendToRadioBtn(BtnName, status) {
        cy.get(this.getSendToRadioBtn()).contains(BtnName).parent().within(()=> {
            cy.get('input').should('have.attr', 'aria-checked', status)
        })
    }

    getSelectedDepartment() {
        return '[data-name="departments"] [data-name="name"]'
    }

    removeSelectedDepartmentByName(name) {
        cy.get(this.getSelectedDepartment()).contains(name).parent().within(() => {
            cy.get(this.getTrashBtn()).click()
        })
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    getRecipientDepartmentTypeRadioBtn() {
        return '[data-name="recipientDepartmentType"] [data-name="label"]'
    }

    verifyRecipientDepartmentTypeRadioBtn(BtnName, status) {
        cy.get(this.getRecipientDepartmentTypeRadioBtn()).contains(BtnName).parent().within(()=> {
            cy.get('input').should('have.attr', 'aria-checked', status)
        })
    }

    getRecipientCount() {
        return '[data-name="recipient-count"]'
    }

    getInactiveLearnersMsg() {
        return '[data-name="inactive-learners"]'
    }

    getNonlearnersMsg() {
        return '[data-name="non-learners"]'
    }

    getRecipientGroupIds() {
        return '[data-name="recipientGroupIds"] [data-name="selection"]'
    }

    getRecipientIndividualUserIds() {
        return '[data-name="recipientIndividualUserIds"] [data-name="selection"]'
    }

    getRecipientGroupIdsSearchTxtF() {
        return '[name="recipientGroupIds"]'
    }

    addRecipientGroup(groupNameame) {
        cy.get(this.getRecipientGroupIds()).click()
        cy.get(this.getRecipientGroupIdsSearchTxtF()).type(groupNameame)
        cy.get(this.getListOptions(), {timeout:10000}).should('contain', groupNameame)
        cy.get(this.getListOptions()).contains(groupNameame).click()
        cy.get(this.getWaitSpinner(), { timeout: 15000 }).should("not.exist")
        cy.get(this.getRecipientGroupIds()).click()
        cy.get(this.getRecipientGroupIds()).should('contain', groupNameame)
    }
    
    addRecipientIndividualUser(firstName, lastName) {
        cy.get(this.getRecipientIndividualUserIds()).click()
        cy.get(this.getToTextFieldDDownSearchTxtF()).type(firstName + ' ' + lastName)
        cy.get(this.getListOptions(), {timeout:15000}).should('contain', firstName + ' ' + lastName)
        cy.get(this.getListOptions()).contains(firstName + ' ' + lastName).click()
        cy.get(this.getWaitSpinner(), { timeout: 15000 }).should("not.exist")
        cy.get(this.getRecipientIndividualUserIds()).click()
    }

    removeRecipientGroupByName(name) {
        cy.get(this.getRecipientGroupIds()).contains(name).parent().within(() => {
            cy.get(this.getXBtn()).click()
        })
        cy.get(this.getWaitSpinner()).should('not.exist')
    }
}
