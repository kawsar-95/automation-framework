import ARDashboardPage from "../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDashboardAccountMenu from "../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu"
import adminUserMenu from "../../../../../helpers/ML/mlPageObjects/adminUserMenu"
import { users } from "../../../../../helpers/TestData/users/users"

describe('AUT-449 C1858 GUIA-Plan - Acceptance Test - NLE-2147 - Account - Change Password Page (NASA)', () => {
    before('Enable Admin Refresh should on', () => {
        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')
        ARDashboardPage.switchAdminRefreshToggle()
    })
    
    it('Change Passwrod page display', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(adminUserMenu.userAccount()).click()
        // Select Portal Setting option from account menu
        cy.get(ARDashboardAccountMenu.getChangePasswordBtn()).should('contain', 'Change Password').and('be.visible').click({force:true})
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout:60000 }).should('not.exist')
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'Change Password')
    })
})


