import ARBasePage from "../../ARBasePage"
import ARDeleteModal from "../Modals/ARDeleteModal"

export default new class ARUserAddEditPage extends ARBasePage {
    getNameTxtF() {
        return '[name="name"]'
    }

    getNameErrorMsg() {
        return '[data-name="name"] [data-name="error"]'
    }

    getDepartmentBtn() {
        return '[data-name="select"]'
    }

    getUsersDDownField() {
        return '[data-name="selection"]'
    }

    getUserProperty() {
        return '[data-name="userIds"]'
    }

    getUsersDDownSearchTxtF() {
        return '[name="userIds"]'
    }

    getUsersDDownOpt() {
        return '[class*="_full_name"]'
    }

    getUserImportChooseFileBtn() {
        return '[data-bind="text: absorb.data.terms.ChooseFile"]'
    }

    getLMSUserName() {
        return '[class="field limit-width"]'
    }

    getA5ClientPageSidebar(name) {
        cy.get('.sidebar-content > a').filter(`:contains(${name})`).click();
    }

    getImportInProgressOkBtn(){
        return '[id="confirm-modal-content"] [class*="icon icon-arrow-forward"]'
    }

    getAssignmentRadioBtn() {
        return '[aria-label="Assignment"] [data-name="label"]'
    }

    verifyAssignmentRadioBtn(BtnName, status) {
        cy.get(this.getAssignmentRadioBtn()).contains(BtnName).parent().within(()=> {
            cy.get('input').should('have.attr', 'aria-checked', status)
        })
    }

    getSelectedUser() {
        return '[data-name="userIds"] [data-name="selection"] [data-name="label"]'
    }

    removeSelectedUserByName(name) {
        cy.get(this.getSelectedUser()).contains(name).parent().within(() => {
            cy.get(this.getXBtn()).click()
        })
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    verifyUserIsSelected(name) {
        cy.get(this.getUsersDDownOpt()).contains(name).parents('li').should('have.attr', 'aria-selected', 'true')
    }

    getAddRuleBtn() {
        return '[data-name="add-rule"]'
    }

    getUserCount() {
        return '[data-name="user-count"]'
    }

    getRuleValueF() {
        return '[aria-label="Value"]'
    }

    verifyUserCount(value) {
        cy.get(this.getUserCount()).should('have.text', `These rules match ${value} users.`)
    }

    getFilterEdit(){
        return '[data-name="filter-edit"]'
    }

    getFilteredValue() {
        return '[class*="_filter_menu"] [class*="_value_4ffxm"]'
    }

    getRulesPlaceholder() {
        return '[data-name="placeholder"]'
    }

    // Added for the JIRA# AUT-487, TC# C1928
    getDeleteGroupBtn() {
        return 'button[title="Delete Group"]'
    }

    getFirstRulesContainer(){
        return '[data-name="automaticGroupFilter"]'
    }

    getRuleDropDownBtn() {
        return '[data-name="selection"]'
    }

    getRuleDropDownOptions() {
        return `[class="_label_11q4a_62"]`
    }
    
    saveGroup() {
        cy.get(this.getSaveBtn()).should('not.have.attr', 'aria-disabled')
        cy.get(this.getSaveBtn()).click()
        cy.get(this.getToastSuccessMsg()).should('be.visible')
        cy.get(this.getWaitSpinner()).should('not.exist')
    }

    deleteGroupByName(groupName) {
        this.AddFilter('Name', 'Contains', groupName)
        cy.get(this.getTableCellRecord()).contains(groupName).click()
        cy.wrap(this.WaitForElementStateToChange(this.getAddEditMenuActionsByName('Delete Group'), 1000))
        cy.get(this.getAddEditMenuActionsByName('Delete Group')).click()
        cy.get(ARDeleteModal.getARDeleteBtn()).should('be.visible').click()
        cy.get(this.getToastSuccessMsg()).should('contain', 'Group has been deleted successfully.')
        cy.get(this.getWaitSpinner()).should('not.exist')
    }
}