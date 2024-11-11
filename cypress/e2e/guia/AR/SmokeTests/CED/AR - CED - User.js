/// <reference types="cypress" />
import departments from '../../../../../fixtures/departments.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import CreateCoursePage from '../../../../../../helpers/AR/pageObjects/SmokeObjects/CreateCoursePage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'

describe('AR - CED - User', function () {

    beforeEach(function() {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Click the Users menu item
        ARDashboardPage.getUsersReport() 
    })

    it('should allow admin to create User', () => {
        // Create User
        cy.get(arUserPage.getPageHeaderTitle()).should('have.text', "Users")
        cy.get(arUserPage.getAddEditMenuActionsByName('Add User')).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(arUserAddEditPage.getFirstNameTxtF()).clear().type(userDetails.firstName)
        cy.get(arUserAddEditPage.getLastNameTxtF()).clear().type(userDetails.lastName)
        cy.get(arUserAddEditPage.getEmailAddressTxtF()).type(userDetails.emailAddress)
        cy.get(arUserAddEditPage.getUsernameTxtF()).clear().type(userDetails.username)
        cy.get(arUserAddEditPage.getPasswordTxtF()).clear().type(userDetails.validPassword)
        cy.get(arUserAddEditPage.getConfirmPasswordTxtF()).clear().type(userDetails.validPassword)
        cy.get(arUserAddEditPage.getDepartmentTxtF()).click()
        ARSelectModal.SearchAndSelectFunction([departments.DEPT_TOP_NAME])
        // Save User
        arUserPage.WaitForElementStateToChange(arUserAddEditPage.getSaveBtn(), 1000)
        cy.get(arUserAddEditPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('be.visible')
    })

    it('should allow admin to edit a User', () => {
        // Search and Edit User
        CreateCoursePage.AddFilter('Username', 'Starts With', userDetails.username)
        arUserPage.selectTableCellRecordUsers(userDetails.username)
        arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Edit User'), 1000)
        cy.get(arUserPage.getAddEditMenuActionsByName('Edit User')).should('have.attr', 'aria-disabled', 'false').click()
        arUserPage.WaitForElementStateToChange(arUserAddEditPage.getUsernameTxtF())
        cy.get(arUserAddEditPage.getUsernameTxtF()).should('not.have.attr', 'readonly')
        cy.get(arUserAddEditPage.getUsernameTxtF()).clear().type(userDetails.usernameEdited)
        // Save User
        arUserPage.WaitForElementStateToChange(arUserAddEditPage.getSaveBtn(), 1000)
        cy.get(arUserAddEditPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('be.visible')
    })
  
    it('should allow admin to delete a User', () => {
        // Search and Delete User
        CreateCoursePage.AddFilter('Username', 'Starts With', userDetails.usernameEdited)
        arUserPage.selectTableCellRecordUsers(userDetails.usernameEdited)
        arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Delete'), 1000)
        cy.get(arUserPage.getAddEditMenuActionsByName('Delete')).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(arUserPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click()
        // Verify that User is deleted
        cy.get(arUserPage.getNoResultMsg()).should('have.text', 'No results found.')
    })
})