import ARBasePage from "../../ARBasePage";

export default new class ARUserImportPage extends ARBasePage {
    getActiveStatusToggle() {
        return '[data-bind="toggleButton:IsActiveStatus"] a'
    }

    getActiveStatusOnTxt() {
        return '[data-bind="visible:IsActiveStatus"]'
    }

    getActiveStatusOffTxt() {
        return '[data-bind="hidden:IsActiveStatus"]'
    }

    activeStatusOnMsg() {
        return 'All users will be marked as active'
    }

    activeStatusOffMsg() {
        return 'All users will be marked as inactive'
    }

    verifyToggleIsCalledActiveStatus() {
        cy.get('[data-bind="toggleButton:IsActiveStatus"]').parents('[class="field"]').find('label').should('have.text', 'Active Status')
    }

    getUpdateExistingUsersToggle() {
        return '[data-bind="toggleButton:IsUpdateAllowed"] a'
    }

    verifyToggleIsCalledUpdateExistingUsers() {
        cy.get('[data-bind="toggleButton:IsUpdateAllowed"]').parents('[class="field"]').find('label').contains('Update Existing Users').should('exist')
    }

    getUniqueLMSField() {
        return '[data-bind="value:UniqueLMSField"]'
    }

    getLinkSpreadsheetField() {
        return '[data-bind*="options: SourceFieldList"]'
    }

    getSuccessHighlightMsg() {
        return '[class="highlight success"]'
    }
}