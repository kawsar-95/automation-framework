import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCollaborationAddEditPage from '../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import AREnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import AdminNavationModuleModule from '../../../../../../helpers/AR/modules/AdminNavationModule.module'

describe('C7276 - AUT-663 - AE - Reports - Core Regression - Learner activity - Change Department', () => {
    before('Create a Learner user for the test', () => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })
		
    beforeEach('Login as a System Admin', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password,  '/admin')
    })
		
    after('Delete the test user as part of clean-up', () => {
        AdminNavationModuleModule.navigateToUsersPage()
        cy.wrap(ARUserPage.AddFilter('Username', 'Equals', userDetails.username))
        cy.wrap(ARUserPage.selectTableCellRecord(userDetails.username))
        cy.wrap(ARUserPage.WaitForElementStateToChange(AdminNavationModuleModule.getCommonRigthActionMenu('Delete'), AREnrollUsersPage.getShortWait()))
        cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('Delete')).click({ force: true })
        cy.wrap(ARUserPage.WaitForElementStateToChange(ARDeleteModal.getARDeleteBtn(), AREnrollUsersPage.getLShortWait()))
        cy.get(ARDeleteModal.getARDeleteBtn()).click()
        cy.get(ARUserPage.getNoResultMsg()).contains('No results found.').should('exist')
    })

    it('Navigate to Learner Activity report page and change user department', () => {
        // Navigate to Learner Activity
        ARDashboardPage.getMediumWait()
        AdminNavationModuleModule.navigateToLearnerActivityPage()    

        ARDashboardPage.getMediumWait()
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getTableCellRecord(userDetails.username)).click({ force: true })
        // Edit User
        // Action items Should be displayed
        cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('Edit User')).should('exist')
        cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('Message User')).should('exist')
        cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('User Transcript')).should('exist')
        cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('View Enrollments')).should('exist')
        cy.get(ARDashboardPage.getDeselectBtn()).should('exist')
        // Click on Edit user
        ARDashboardPage.getMediumWait()
        cy.get(AdminNavationModuleModule.getCommonRigthActionMenu('Edit User')).click({ force: true })
        ARDashboardPage.getMediumWait()
        cy.get(ARCollaborationAddEditPage.getPageHeaderTitle()).should('contain', 'Edit User')
        cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.sub_dept_A_name])
        ARSelectModal.getLShortWait()
        cy.get(ARDashboardPage.getToggleStatus()).should('have.attr', 'aria-checked', 'true')
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        ARDashboardPage.getMediumWait()
    })
})