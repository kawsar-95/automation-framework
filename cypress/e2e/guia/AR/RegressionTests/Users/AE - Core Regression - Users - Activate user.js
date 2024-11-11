import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arLoginPage from '../../../../../../helpers/AR/pageObjects/Auth/ARLoginPage'

const LEARNER_USER_NAME = userDetails.username

describe('C7345 - AUT-710 - AE - Core Regression - Users - Activate user', () => {
    before('Create a Learner user for the test', () => {
        cy.createUser(void 0, LEARNER_USER_NAME, ["Learner"], void 0)        
    })

    beforeEach('Login as an Admin directly from the Login page and navigate to the User\'s report page', () => {
        // Visit to the login page
        cy.visit('/admin/login')
        // Fill out required information to log in
        cy.get(arLoginPage.getUsernameTxtF()).type(users.sysAdmin.admin_sys_01_username)
        cy.get(arLoginPage.getPasswordTxtF()).type(users.sysAdmin.admin_sys_01_password)
        // Click Login button to log the Admin use in
        cy.wrap(arLoginPage.WaitForElementStateToChange(arLoginPage.getLoginBtn()))
        cy.get(arLoginPage.getLoginBtn()).click()
        ARDashboardPage.getVLongWait()

        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
    })

    after('Delete the new User as part of clean-up', () => {
        cy.get(ARUserPage.getRemoveFilterBtn()).click()
        ARUserPage.AddFilter('Username', 'Contains', LEARNER_USER_NAME)
        ARUserPage.getShortWait()
        cy.get(ARUserPage.getGridTable()).eq(0).click()
        ARUserPage.getMediumWait()
        cy.get(ARUserPage.getAddEditMenuActionsByName('Delete')).click()
        ARUserPage.getShortWait()
        cy.get(ARUserPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        ARUserPage.getMediumWait()
    })    

    it('Inactivate the new User to test activation later', () => {        
        // Search for Learner 1
        ARUserPage.AddFilter('Username', 'Contains', LEARNER_USER_NAME)
        ARUserPage.getMediumWait()
        cy.get(ARUserPage.getGridTable()).eq(0).click()
        ARUserPage.getMediumWait()
        // Edit User
        cy.get(ARUserPage.getAddEditMenuActionsByName('Edit User')).click()
        ARUserPage.getLongWait()
        // Assert that the user is active
        cy.get(ARUserAddEditPage.getIsActiveAriaLabel()).should('have.attr', ARUserAddEditPage.getAriaCheckedAttribute(), 'true')
        // Inactivate the user
        cy.get(ARUserAddEditPage.getEnableLabelAttributeName()).contains('Active').click()
        // Assert the the user is now inactive
        cy.get(ARUserAddEditPage.getIsActiveAriaLabel()).should('have.attr', ARUserAddEditPage.getAriaCheckedAttribute(), 'false')

        // Save the user after inactivation
        cy.get(ARUserAddEditPage.getSubmitDataNameAttribute()).click()
        ARUserPage.getLongWait()
    })

    it('Activate the inactive User ', () => {        
        // Search the Learner by Inactive status to make sure result contains at least one records
        ARUserPage.AddStatusRadioFilter('Status', false)
        ARUserPage.getMediumWait()

        // Search the Learner by Username
        ARUserPage.AddFilter('Username', 'Contains', LEARNER_USER_NAME)
        ARUserPage.getMediumWait()

        cy.get(ARUserPage.getGridTable()).eq(0).click()
        ARUserPage.getMediumWait()

        // Edit User to activate him/her
        cy.get(ARUserPage.getAddEditMenuActionsByName('Edit User')).click()
        ARUserPage.getLongWait()
        // Assert that the user is inactive
        cy.get(ARUserAddEditPage.getIsActiveAriaLabel()).should('have.attr', ARUserAddEditPage.getAriaCheckedAttribute(), 'false')
        // Activate the user
        cy.get(ARUserAddEditPage.getEnableLabelAttributeName()).contains('Active').click()
        // Assert the the user is now active
        cy.get(ARUserAddEditPage.getIsActiveAriaLabel()).should('have.attr', ARUserAddEditPage.getAriaCheckedAttribute(), 'true')

        cy.get(ARUserAddEditPage.getSubmitDataNameAttribute()).click()
        ARUserPage.getLongWait()
        // cy.get(ARUserPage.getRemovefilterBtn()).click()
    })
})