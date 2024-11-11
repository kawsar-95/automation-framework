import arBasePage from "../../ARBasePage";
import miscData from '../../../../cypress/fixtures/miscData.json'
import actionButtons from '../../../../cypress/fixtures/actionButtons.json'

export default new class ARUserPage extends arBasePage {
     getGeneralSectionTxtF(attrValue) {
          return `input[aria-label="${attrValue}"]`
     }

     getDepartmentBtn() {
          return '[class*="department-select-module__select_department_button"]'
     }

     getDuplicateUsernameErrorMsg() {
          let form = this.getElementByDataNameAttribute("edit-user-profile")
          return cy.get(form).find(this.getElementByDataNameAttribute(actionButtons.ERROR_DATA_NAME))
     }
     
     editUser(usernameField, username) {
          cy.wrap(this.AddFilter(usernameField, 'Equals', username))
          cy.wrap(this.selectTableCellRecord(`${username}`))
          this.reportItemAction(actionButtons.EDIT_USER)
     }

     deleteUser(usernameField, username) {
          cy.wrap(this.AddFilter(usernameField, 'Equals', username))
          cy.wrap(this.selectTableCellRecordByIndexAndName(`${username}`,4))
          this.reportItemAction(actionButtons.DELETE)
          this.getConfirmModalBtnByText(actionButtons.DELETE)
          cy.get(this.getNoResultMsg()).contains('No results found.').should('exist')
     }

     verifyTxtF255CharValidation(ariaLabel) {
          cy.get(this.getGeneralSectionTxtF(ariaLabel)).clear().invoke('val', this.getLongString()).type('abc@test.com')
          cy.get(this.getErrorMsg()).should('contain', miscData.CHAR_255_ERROR)
     }

     verifyTxtFDoNotAcceptHTML(ariaLabel, validValue, invalidValue) {
          cy.get(this.getGeneralSectionTxtF(ariaLabel)).clear().type(invalidValue)
          cy.wrap(this.WaitForElementStateToChange(this.getSaveBtn()))
          cy.get(this.getSaveBtn()).click()
          cy.get(this.getErrorMsg()).should('contain', miscData.INVALID_CHARS_ERROR)
          cy.get(this.getGeneralSectionTxtF(ariaLabel)).clear().type(validValue)
     }

     verifyTxtFCannotBeEmpty(ariaLabel) {
          cy.get(this.getElementByAriaLabelAttribute(ariaLabel)).clear()
          cy.get(this.getErrorMsg()).should('contain', miscData.FIELD_REQUIRED_ERROR)
     }

     verifyIfEmailIsValid(emailAddressField, value)
     {
          cy.get(this.getGeneralSectionTxtF(emailAddressField)).clear().type(value)
          cy.get(this.getErrorMsg()).should('contain', miscData.ENTER_VALID_EMAIL)
     }

     verifyPasswordFDoNotAcceptHTML(ariaLabel1, ariaLabel2, validValue, invalidValue) {
          cy.get(this.getGeneralSectionTxtF(ariaLabel1)).clear().type(invalidValue)
          cy.get(this.getGeneralSectionTxtF(ariaLabel2)).clear().type(invalidValue)
          cy.wrap(this.WaitForElementStateToChange(this.getSaveBtn()))
          cy.get(this.getSaveBtn()).click()
          cy.get(this.getErrorMsg()).should('contain', miscData.INVALID_CHARS_ERROR)
          cy.get(this.getGeneralSectionTxtF(ariaLabel1)).clear().type(validValue)
          cy.get(this.getGeneralSectionTxtF(ariaLabel2)).clear().type(validValue)
     }

     verifyPasswordComplexity(ariaLabel1, ariaLabel2, invalidValue) {
          cy.get(this.getElementByAriaLabelAttribute(ariaLabel1)).clear().type(invalidValue)
          cy.get(this.getElementByAriaLabelAttribute(ariaLabel2)).clear().type(invalidValue)
          cy.get(this.getSaveBtn()).should('have.attr', 'aria-disabled', 'true')
          cy.get(this.getErrorMsg()).should('contain', miscData.INVALID_PASSWORD_ERROR)
     }

     verifyPasswordMatch(ariaLabel1, ariaLabel2, validValue, invalidValue) {
          cy.get(this.getElementByAriaLabelAttribute(ariaLabel1)).clear().type(validValue)
          cy.get(this.getElementByAriaLabelAttribute(ariaLabel2)).clear().type(invalidValue)
          cy.get(this.getSaveBtn()).should('have.attr', 'aria-disabled', 'true')
          cy.get(this.getErrorMsg()).should('contain', miscData.PASSWORD_DO_NOT_MATCH)
     }

     verifyDuplicateUsername(emailAddressField, duplicateUsername, validUsername) {
          cy.get(this.getElementByAriaLabelAttribute(emailAddressField)).clear().type(duplicateUsername)
          cy.wrap(this.WaitForElementStateToChange(this.getSaveBtn()))
          cy.get(this.getSaveBtn()).click()
          cy.get(this.getDuplicateUsernameErrorMsg()).should('contain', JSON.stringify(miscData.DUPLICATE_USERNAME).split("{0}").join(duplicateUsername))
          cy.get(this.getElementByAriaLabelAttribute(emailAddressField)).clear().type(validUsername)
     }

     // Added for the TC # C6328
     getCotextMenu() {
          return  '[class*="_context_menu_w33d3_1 _edit_context_menu_b3nl9_1"]'
     }

     getContextMenuButtons() {
          return 'div[class*="_child_w33d3_9"]'
     }

     getHeaderBreadCrumb() {
          return 'ol[class*="_breadcrumb_184og_1"]'
     }

     getUserProfile() {
          return 'div[class*="_form_section_1s6h7_1 _control_1fagk_1"]'
     }

     getTranscriptFieldByName($fieldName) {
          return `span[data-name="${$fieldName}"]`
     }

     getUserAvatar(){
          return 'div[class*="_avatar_gx2yx_10 icon icon-person-round"]';
     }

     getBackButtonFromTranscriptPage() {
          return '[class*="_button_4zm37_1 _cancel_4zm37_86 _control_1fagk_1 _large_8pc2b_1"]' 
     }

     // Added for the TC# C7345
    AddStatusRadioFilter(propertyName, activeStatus) {
        cy.get(this.getAddFilterBtn()).click()
        cy.get(this.getPropertyName() + this.getDDownField()).eq(0).click()
        cy.get(this.getPropertyNameDDownSearchTxtF()).type(propertyName)
        cy.get(this.getPropertyNameDDownOpt()).contains(new RegExp("^" + propertyName + "$", "g")).click()
        cy.get(this.getPropertyNameDDown()).eq(1).click()
        if (activeStatus === true) {
            cy.get(this.getActiveStatusOptionItem()).click()
        } else {
            cy.get(this.getInactiveStatusOptionItem()).click()
        }
        cy.get(this.getSubmitAddFilterBtn()).click()
        cy.get(this.getWaitSpinner(), { timeout: 20000 }).should("not.exist")
    }

    getPropertyNameDDown() {
        return '[class="_select_field_4ffxm_1"]'
    }

    getActiveStatusOptionItem() {
        return 'li[id*="-options-Active""]'
    }

    getInactiveStatusOptionItem() {
        return 'li[id*="-options-Inactive"]'
    }

    // Added for the TC# C7347
    getRemovefilterBtn() {
        return '[data-name="end-icon"]'
    }

    getInactivefilterBtn() {
        return '[class*="_value"]'
    }

    getStautsBtn() {
        return '[class*="_filter_menu_"] [data-name="selection"]'
    }

    getInactiveBtn() {
        return `[data-name="options"] span[class*='_label']`
    }
    
    getSubmitBtn() {
        return '[data-name="submit-filter"]'
    }
    
    getEditUserBtn() {
        return '[title="Edit User"]'
    }

    getMergeUserBtn() {
        return '[title="Merge User"]'
    }

    getDuplicateUserAccountDDown() {
        return '[id="DuplicateUserId"]'
    }

    getDuplicateUserAccountTextF() {
        return '[aria-owns="select2-results-4"]'
    }

    getDuplicateUserAccountDDownOpt() {
        return '[class="select2-result-label"]'
    }

    getLearnerSocialProfileLable() {
     return `label[for="IsLearnerSocialProfileEnabled"]`
    }

    getOperatorValue() {
     return '[data-name="operator"]'
    }

    getStatusFilterModel() {
     return '[data-name="data-filter-menu"]'
    }
}

// Added for the TC # C6328
export const userPageUrl = {
     'transcriptPage': 'https://guiaar.qa.myabsorb.com/admin/learnerActivity/transcript/',
     'userEditPage': 'https://guiaar.qa.myabsorb.com/admin/users/edit/'
}