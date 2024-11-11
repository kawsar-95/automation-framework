import actionButtons from '../../../../../fixtures/actionButtons.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import {userDetails, generalSectionFieldNames}  from '../../../../../../helpers/TestData/users/UserDetails'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('AR - CED - User - General and Password Section', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arUserPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel(actionButtons.USER_MENU))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName(actionButtons.USER_MENU))
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
    })

    it('Add data to the User General Section and Save the new user record', () => {
        cy.get(arUserPage.getActionBtnByTitle(actionButtons.ADD_USER)).should('have.text', actionButtons.ADD_USER).click()
        arUserPage.getLShortWait()
        cy.get(arUserPage.getElementByAriaLabelAttribute(generalSectionFieldNames.firstName)).type(userDetails.firstName)
        cy.get(arUserPage.getElementByAriaLabelAttribute(generalSectionFieldNames.middleName)).type(userDetails.middleName)
        cy.get(arUserPage.getElementByAriaLabelAttribute(generalSectionFieldNames.lastName)).type(userDetails.lastName)
        cy.get(arUserPage.getGeneralSectionTxtF(generalSectionFieldNames.emailAddress)).type(userDetails.emailAddress)
        cy.get(arUserPage.getElementByAriaLabelAttribute(generalSectionFieldNames.username)).type(userDetails.username)
        cy.get(arUserPage.getDepartmentBtn()).click()
        arSelectModal.SelectFunction(userDetails.topLevelDept)

        // Verify if password and confirm password are different then error is displayed and save button is disabled
        arUserPage.verifyPasswordMatch(generalSectionFieldNames.password, generalSectionFieldNames.confirmPassword, userDetails.validPassword, userDetails.invalidPassword1)
        
        // Verify if password field doesn't meet the requirements then error is displayed and save button is disabled
        arUserPage.verifyPasswordComplexity(generalSectionFieldNames.password, generalSectionFieldNames.confirmPassword, userDetails.invalidPassword2)
        
        // Verify password field does not accept HTML
        arUserPage.verifyPasswordFDoNotAcceptHTML(generalSectionFieldNames.password, generalSectionFieldNames.confirmPassword, userDetails.validPassword, userDetails.invalidTextInput)

        // Save new user record with all valid details
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getSaveBtn(), 1000))
        cy.get(arUserPage.getSaveBtn()).click()
        cy.get(arUserPage.getSaveBtn()).should("not.exist").wait('@getUsers');
    })

    it('Verify whether the user exists and if all data was saved successfully', () => {
        arUserPage.editUser(generalSectionFieldNames.username, userDetails.username)
        arUserPage.getLShortWait()
        cy.get(arUserPage.getElementByAriaLabelAttribute(generalSectionFieldNames.firstName)).should('have.value', userDetails.firstName)
        cy.get(arUserPage.getElementByAriaLabelAttribute(generalSectionFieldNames.middleName)).should('have.value', userDetails.middleName)
        cy.get(arUserPage.getElementByAriaLabelAttribute(generalSectionFieldNames.lastName)).should('have.value', userDetails.lastName)
        cy.get(arUserPage.getGeneralSectionTxtF(generalSectionFieldNames.emailAddress)).should('have.value', userDetails.emailAddress)
        cy.get(arUserPage.getElementByAriaLabelAttribute(generalSectionFieldNames.username)).should('have.value', userDetails.username)
        cy.get(arUserPage.getElementByAriaLabelAttribute(generalSectionFieldNames.department)).should('have.value', userDetails.topLevelDept)
    })

    it('Perform validations for the fields in the general and password section', () => {
        arUserPage.editUser(generalSectionFieldNames.username, userDetails.username)
        arUserPage.getLShortWait()

        const tobeValidated = [generalSectionFieldNames.firstName,  generalSectionFieldNames.middleName,
            generalSectionFieldNames.lastName, generalSectionFieldNames.username, generalSectionFieldNames.emailAddress]

        // Perform validations : Field cannot be empty and Field cannot exceed 255 characters
        tobeValidated.forEach(el => {
            arUserPage.verifyTxtF255CharValidation(el)
            if (el != generalSectionFieldNames.emailAddress) {
                arUserPage.verifyTxtFCannotBeEmpty(el)
            }    
        })
        cy.get(arUserPage.getCancelBtn()).click()
        cy.get(arUserPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click()
        arUserPage.reportItemAction(actionButtons.EDIT_USER)

        // Perform validation : Field do not accept HTML i.e. invalid characters
        Object.values(tobeValidated).forEach(el => {
            switch (el) {
                case generalSectionFieldNames.firstName : 
                arUserPage.verifyTxtFDoNotAcceptHTML(el, userDetails.firstName, userDetails.invalidTextInput)
                break
                case generalSectionFieldNames.middleName : 
                arUserPage.verifyTxtFDoNotAcceptHTML(el, userDetails.middleName, userDetails.invalidTextInput)
                break
                case generalSectionFieldNames.lastName :  
                arUserPage.verifyTxtFDoNotAcceptHTML(el, userDetails.lastName, userDetails.invalidTextInput)
                break
                case generalSectionFieldNames.username : 
                arUserPage.verifyTxtFDoNotAcceptHTML(el, userDetails.username, userDetails.invalidTextInput)
                break
                default :
                break
            }              
        })

        // Perform validation : Field do not accept HTML and invalid email
        arUserPage.verifyIfEmailIsValid(generalSectionFieldNames.emailAddress, userDetails.invalidEmail, userDetails.emailAddress)
        arUserPage.verifyIfEmailIsValid(generalSectionFieldNames.emailAddress, userDetails.invalidTextInput + userDetails.emailAddress, userDetails.emailAddress)
        cy.get(arUserPage.getGeneralSectionTxtF(generalSectionFieldNames.emailAddress)).clear().type(userDetails.emailAddress)

        // Verify if new temp password and confirm temp password are different then error is displayed and save button is disabled
        arUserPage.verifyPasswordMatch(generalSectionFieldNames.newTemporaryPassword, generalSectionFieldNames.confirmTemporaryPassword, userDetails.validPassword, userDetails.invalidPassword1)
        
        // Verify if new temp password field doesn't meet the requirements then error is displayed and save button is disabled
        arUserPage.verifyPasswordComplexity(generalSectionFieldNames.newTemporaryPassword, generalSectionFieldNames.confirmTemporaryPassword, userDetails.invalidPassword2)
        
        // Verify password fields does not accept HTML
        arUserPage.verifyPasswordFDoNotAcceptHTML(generalSectionFieldNames.newTemporaryPassword, generalSectionFieldNames.confirmTemporaryPassword, userDetails.validPassword, userDetails.invalidTextInput)
    })

    it('Modify data in the User General Section and Update the edited user record', () => {
        arUserPage.editUser(generalSectionFieldNames.username, userDetails.username)
        arUserPage.getLShortWait()
        cy.get(arUserPage.getElementByAriaLabelAttribute(generalSectionFieldNames.firstName)).clear().type(userDetails.firstNameEdited)
        cy.get(arUserPage.getElementByAriaLabelAttribute(generalSectionFieldNames.lastName)).clear().type(userDetails.lastNameEdited)
        cy.get(arUserPage.getGeneralSectionTxtF(generalSectionFieldNames.emailAddress)).clear().type(userDetails.emailAddressEdited)
        cy.get(arUserPage.getElementByAriaLabelAttribute(generalSectionFieldNames.username)).clear().type(userDetails.usernameEdited)
        cy.get(arUserPage.getDepartmentBtn()).click()
        arSelectModal.SearchAndSelectFunction([userDetails.deptEdited])
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getSaveBtn(), 1000))
        cy.get(arUserPage.getSaveBtn()).click()
        cy.get(arUserPage.getSaveBtn()).should("not.exist").wait('@getUsers');
    })

    it('Verify whether the user data was updated successfully', () => {
        arUserPage.editUser(generalSectionFieldNames.username, userDetails.usernameEdited)
        arUserPage.getLShortWait()
        cy.get(arUserPage.getElementByAriaLabelAttribute(generalSectionFieldNames.firstName)).should('have.value', userDetails.firstNameEdited)
        cy.get(arUserPage.getElementByAriaLabelAttribute(generalSectionFieldNames.lastName)).should('have.value', userDetails.lastNameEdited)
        cy.get(arUserPage.getGeneralSectionTxtF(generalSectionFieldNames.emailAddress)).should('have.value', userDetails.emailAddressEdited)
        cy.get(arUserPage.getElementByAriaLabelAttribute(generalSectionFieldNames.username)).should('have.value', userDetails.usernameEdited)
        cy.get(arUserPage.getElementByAriaLabelAttribute(generalSectionFieldNames.department)).should('contain.value', userDetails.deptEdited)
    })

    it('Delete the user and verify if the user was deleted', () => {
        arUserPage.deleteUser(generalSectionFieldNames.username, userDetails.usernameEdited)       
        cy.get(arUserPage.getNoResultMsg()).should('have.text', "No results found.")
    })
})
