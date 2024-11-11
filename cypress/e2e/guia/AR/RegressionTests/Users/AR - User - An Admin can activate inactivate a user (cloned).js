import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import {userDetails}  from '../../../../../../helpers/TestData/users/UserDetails'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'

describe('C1026 AUT-323, AR - User - An Admin can activate inactivate a user (cloned)', () => {
    before(() => {
        //Create a new user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getUsersReport()
    })

    it('Verify Learner Type User Creation Persists, Edit Learner', () => {
        ARUserAddEditPage.getEditUserByUsername(userDetails.username)
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')

        // Verify that the header for the Active/Inactive toggle button is 'Is Active'
        cy.get(ARUserAddEditPage.getIsActiveToggleLabel()).should('contain', 'Is Active')

        // Verify the INACTIVE/ACTIVE toggle button is set to ACTIVE by default
        ARUserAddEditPage.generalToggleSwitch('true', ARUserAddEditPage.getIsActiveToggleContainer())

        // set Toggle inactive
        ARUserAddEditPage.generalToggleSwitch('false', ARUserAddEditPage.getIsActiveToggleContainer())

        // Save user
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', 'Is Active saved.')
    })

    it('Inactive Users can be found by applying filter for Inactive Users.', () => {
        ARUserAddEditPage.AddFilter('Username', 'Contains', userDetails.username)
        arDashboardPage.AddFilter('Status', 'Inactive')
        cy.get(ARUserAddEditPage.getTableCellName(4)).should('contain', userDetails.username)
    })

    it('delete user', () => {
        ARUserAddEditPage.AddFilter('Username', 'Contains', userDetails.username)
        arDashboardPage.AddFilter('Status', 'Inactive')
        cy.get(ARUserAddEditPage.getTableCellName(4)).contains(userDetails.username).click()

        cy.get(arDashboardPage.getAddEditMenuActionsByName('Delete')).should('have.attr', 'aria-disabled', 'false')
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Delete')).click()
        cy.get(ARDeleteModal.getARDeleteBtn()).click()
        cy.get(ARUserAddEditPage.getNoResultMsg()).should('have.text', "No results found.")
    })
})
