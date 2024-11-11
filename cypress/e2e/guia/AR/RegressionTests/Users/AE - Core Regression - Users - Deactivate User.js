import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import AdminNavationModuleModule from '../../../../../../helpers/AR/modules/AdminNavationModule.module'

describe('C7346 - AUT-711 - AE - Core Regression - Users - Deactivate user', () => {
    before('Create a Learner user for the test', () => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        AdminNavationModuleModule.navigateToUsersPage()
    })

    after('Delete user', () => {
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        ARUserPage.getMediumWait()
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('Delete')).click()
        ARDashboardPage.getShortWait()
        cy.get(ARDeleteModal.getARDeleteBtn()).click()
        ARDashboardPage.getMediumWait()
    })

    it('Select and inactivate the user', () => {
        // Search for Learner 1
        ARUserPage.AddFilter('Username', 'Contains', userDetails.username)
        ARUserPage.getMediumWait()
        cy.get(ARUserPage.getGridTable()).eq(0).click()
        ARUserPage.getMediumWait()
        // Edit User
        cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('Edit User')).click()
        ARUserPage.getLongWait()
        // Make the Learner 1 Inactive
        cy.get(ARUserAddEditPage.getEnableLabelAttributeName()).contains('Active').click()
        cy.get(ARUserAddEditPage.getSubmitDataNameAttribute()).click()
        cy.get(ARUserAddEditPage.getToastNotificationMsg()).should('contain', 'Is Active saved.')
        ARUserPage.getLongWait()
        cy.get(ARUserPage.getRemovefilterBtn()).click()
        ARUserPage.getMediumWait()

        cy.get(ARUserPage.getInactivefilterBtn()).contains('Active').click()
        cy.get(ARUserPage.getStautsBtn()).eq(1).click()
        cy.get(ARUserPage.getInactiveBtn()).contains('Inactive').click()        
        cy.get(ARUserPage.getSubmitBtn()).click()
    })
})