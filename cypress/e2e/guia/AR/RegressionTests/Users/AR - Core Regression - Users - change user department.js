import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import ARLearnerProgressReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARLearnerProgressReportPage'
import AdminNavationModuleModule from '../../../../../../helpers/AR/modules/AdminNavationModule.module'

describe('C7343 - AUT-708 - AR - Core Regresssions - Users- change user department', () => {
    before('Create a Learner user for the test', () => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach('Login as an Admin and navigate to Users page', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        AdminNavationModuleModule.navigateToUsersPage()
    })

    after('Delete the new test user as part of clean-up', () => {
        ARUserPage.AddFilter('Username', 'Contains', userDetails.username)
        ARUserPage.getMediumWait()
        
        cy.get(ARUserPage.getGridTable()).eq(0).click()
        ARUserPage.getMediumWait()
        cy.get(ARUserPage.getAddEditMenuActionsByName('Delete')).click()
        ARUserPage.getShortWait()
        cy.get(ARDeleteModal.getARDeleteBtn()).click()
        ARDashboardPage.getMediumWait()
    })

    it('Change User Department (Learner 1)', () => {
        // Search for Learner 1
        ARUserPage.AddFilter('Username', 'Contains', userDetails.username)
        ARUserPage.getMediumWait()
        cy.get(ARUserPage.getGridTable()).eq(0).click()
        ARUserPage.getMediumWait()
        // Edit User
        cy.get(ARUserPage.getAddEditMenuActionsByName('Edit User')).click()
        ARUserPage.getLongWait()
        // Make the Learner 1 Inactive
        // Department should be selected successfully.
        cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.sub_dept_A_name])
        ARLearnerProgressReportPage.getShortWait()
        cy.get(ARUserAddEditPage.getSubmitDataNameAttribute()).click()
        ARUserPage.getLongWait()
        cy.get(ARUserPage.getRemovefilterBtn()).click()
        ARUserPage.getMediumWait()
    })
})