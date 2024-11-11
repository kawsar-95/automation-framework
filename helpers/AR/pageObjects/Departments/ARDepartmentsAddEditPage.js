import arBasePage from "../../ARBasePage";

export default new class ARDepartmentsAddEditPage extends arBasePage {

    // Department selectors

    getNameSectionDataName() {
        return 'name'
    }

    getNameTxtF(dataName) {
        return `input[name=${dataName}]`
    }

    getParentIDSectionDataName() {
        return 'parentId'
    }

    getParentDepartmentTxtF(dataName) {
        return `input[name=${dataName}]`
    }

    getSelectDepartmentBtn() {
        return '[class*="_select_department_button_"]' 
    }

    getExternalIDTxtF() {
        return '[name="externalId"]'
    }

    getDepartmentContactDetailsContainer() {
        return "useDepartmentContactDetails"
    }

    getCompanyNameTxtF() {
        return '[name="companyName"]'
    }

    getEmailAddressTxtF() {
        return '[name="emailAddress"]'
    }

    getPhoneNumberTxtF() {
        return '[name="phoneNumber"]'
    }

    getJobTitleSectionDataName() {
        return 'jobTitles'
    }

    getAddJobTitleBtn() {
        return '[aria-label="Job Title"] [data-name="add-text-input"]'
    }

    getLocationSectionDataName() {
        return 'locations'
    }

    getTxtFErrorMsgBySectionDataName(dataName) {
        return `[data-name=${dataName}] [data-name="error"]`
    }

    getLocationBtn() {
        return '[aria-label="Location"] [data-name="add-text-input"]'
    }

    getJobTitleTxtF(dataName, txtFIndex = 0) {
        return `[data-name=${dataName}] [name='${txtFIndex}']`
    }

    getDeleteBtnByDataNameAndIndex(dataName, buttonIndex = 1) {
        return `[data-name=${dataName}] [role="listitem"]:nth-of-type(${buttonIndex}) [class*='icon-trash']`
    }

    getLocationTxtF(dataName, txtFLocationIndex = 0) {
        return `[data-name=${dataName}] [name='${txtFLocationIndex}']`
    }
    
    getBillingSection() {
        return '[aria-label="Billing"]'
    }

    getBillingTypeLabel() {
        return '[data-name="billingType"] [data-name="label"]'
    }

    verifyBillingTypeByLabel(label) {
        cy.get(this.getBillingTypeLabel()).contains(label).siblings('input').should('have.attr', 'aria-checked', 'true')
    }

    getApplyToSubdepartmentsCheckbox() {
        return '[name="applyToSubdepartments"]'
    }

    getApplyToSubdepartmentsDescription() {
        return '[class*="_apply_to_subdepartments"] [class*="_description"]'
    }

    getApplyToSubdepartmentsDescriptionMsg() {
        return 'When enabled, applies the Department Billing Type of this department to all sub-departments (even if the Department Billing Type has not been changed).'
    }

    getDepartmentContactDetailsToggleMsg() {
        return 'Information entered here will be used when sending messages to learners in this department.'
    }

    getCompanyNameErrorMsg() {
        return '[data-name="companyName"] [data-name="error"]'
    }

    getEmailAddressErrorMsg() {
        return '[data-name="emailAddress"] [data-name="error"]'
    }

    getPhoneNumberErrorMsg() {
        return '[data-name="phoneNumber"] [data-name="error"]'
    }
    
    getJobTitlesLabel() {
        return '[data-name="jobTitles"] [data-name="label"]'
    }

    getLocationsLabel() {
        return '[data-name="locations"] [data-name="label"]'
    }
}
