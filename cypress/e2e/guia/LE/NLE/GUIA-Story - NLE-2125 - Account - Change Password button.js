import ARDashboardPage from "../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARDashboardAccountMenu from "../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu";
import ARUnsavedChangesModal from "../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal";
import NLEChangePasswordPage from "../../../../../helpers/LE/pageObjects/NLE/NLEChangePasswordPage";
import adminUserMenu from "../../../../../helpers/ML/mlPageObjects/adminUserMenu";
import { users } from "../../../../../helpers/TestData/users/users";
import defaultTestData from '../../../../fixtures/defaultTestData.json'
import { adminRoles, userDetails, userManagementTypes } from "../../../../../helpers/TestData/users/UserDetails"
import ARUserAddEditPage from "../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage";

describe('AUT-447 - C1849 - GUIA-Story - NLE-2125 - Account - Change Password button', () => {
    before('Create an Admin User', () => {
        cy.createUser(void 0, userDetails.username, ["Admin", "Learner"], userManagementTypes.ALL)
    })

    after('Delete new Admin user', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        ARDashboardPage.deleteUsers([userDetails.username])
    })

    it('Edit new Admin user and set Admin Role', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin') 
        ARDashboardPage.getUsersReport()
         // Select any existing User and click on it
         ARDashboardPage.AddFilter('Username', 'Equals', userDetails.username)
         cy.get(ARDashboardPage.getGridTable(), {timeout: 3000}).eq(0).click()
         cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit User'), {timeout: 3000}).click()
 
         cy.get(ARDashboardPage.getPageHeaderTitle(), {timeout: 7500}).should('contain', 'Edit User')

        // Setup user management and select all admin roles
        cy.get(ARUserAddEditPage.getUserManagementRadioBtn()).contains('All').click()
        cy.get(ARUserAddEditPage.getRolesDDown()).click()

        cy.get(ARUserAddEditPage.getRolesDDownSearchTxtF(), {timeout: 3000}).type(adminRoles.admin) 
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 3000}).should('not.exist')
        cy.get(ARUserAddEditPage.getRolesDDownOpt()).contains(new RegExp(`^(${adminRoles.admin})$`, "g"), {timeout: 3000}).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 3000}).should('not.exist')

        // Save user
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(ARDashboardPage.getPageHeaderTitle(), { timeout: 15000 }).should('contain', 'Users')
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 3000}).should('not.exist')
    })

    it('Account - Attempt to Change Password and Cancel', () => {
        cy.apiLoginWithSession(userDetails.username, defaultTestData.USER_PASSWORD, '/admin') 
        // Select Account Menu 
        cy.get(ARDashboardPage.getUserAccountBtn()).click()
        
        adminUserMenu.assertAdminAccountMenus()
        
        // Select Change password option from account menu
        cy.get(ARDashboardAccountMenu.getChangePasswordBtn()).click({ force: true })
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Change Password')
        cy.url('/admin/account/changePassword').should('exist')
        cy.get(NLEChangePasswordPage.getCurrentPasswordTxtF()).type(users.adminLogInOut.admin_loginout_password)
        cy.get(NLEChangePasswordPage.getNewPasswordTxtF()).type(defaultTestData.CHANGE_USER_PASSWORD)
        cy.get(NLEChangePasswordPage.getConfirmPasswordTxtF()).type(defaultTestData.CHANGE_USER_PASSWORD)
        cy.get(NLEChangePasswordPage.getCancelBtn()).click()
        cy.get(ARUnsavedChangesModal.getUnsavedChangesTxt()).should('contain', ARUnsavedChangesModal.getUnsavedChangesMsg())
        cy.get(ARUnsavedChangesModal.getOKBtn()).contains('OK').click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')
        cy.url('/admin/dashboard').should('exist')
    })

    it('Account - Change Password and Save', () => {
        cy.apiLoginWithSession(userDetails.username, defaultTestData.USER_PASSWORD, '/admin') 
        // Select Account Menu 
        cy.get(ARDashboardPage.getUserAccountBtn()).click()
        
        // Select Change password option from account menu
        cy.get(ARDashboardAccountMenu.getChangePasswordBtn()).click({ force: true })
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Change Password')
        cy.get(NLEChangePasswordPage.getCurrentPasswordTxtF()).type(users.adminLogInOut.admin_loginout_password)
        cy.get(NLEChangePasswordPage.getNewPasswordTxtF()).type(defaultTestData.CHANGE_USER_PASSWORD)
        cy.get(NLEChangePasswordPage.getConfirmPasswordTxtF()).type(defaultTestData.CHANGE_USER_PASSWORD)
        cy.get(NLEChangePasswordPage.getSubmitBtn()).click().click({force:true})
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')
    })

    it('Account - Login with changed password to verify password has been changed successfully', () => {
        cy.apiLoginWithSession(userDetails.username, defaultTestData.CHANGE_USER_PASSWORD, '/admin') 
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:10000 }).should('not.exist')
        cy.url('/admin/dashboard').should('exist')
    })
})