import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEProfilePage from '../../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LESideMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import { users } from '../../../../../../../helpers/TestData/users/users'

describe('AR - RP - Impersonate learner - Admin', function () {

    it('Verify Admin Cannot Impersonate an Inactive Learner', () => {
        //Login as sys admin and filter for inactive learner
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
        cy.wrap(arDashboardPage.AddFilter('Username', 'Contains', users.learner09Inactive.learner_09_username))
        arDashboardPage.getMediumWait()
        cy.get(arDashboardPage.getTableCellName(4)).contains(users.learner09Inactive.learner_09_username).click()
        //Wait for applicable button to become enabled
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Edit User'), 1000))
        //Verify Impersonate button is disabled
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Impersonate')).should('have.attr', 'aria-disabled', 'false')
    })

    it('Verify Admin Without Permission Cannot Impersonate an Active Learner', () => {
        //Login as dept admin without impersonate permission and filter for active learner
        cy.apiLoginWithSession(users.depAdminLogInOut.admin_dep_loginout_username, users.depAdminLogInOut.admin_dep_loginout_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
        cy.wrap(arDashboardPage.AddFilter('Username', 'Contains', users.learner01.learner_01_username))
        arDashboardPage.getMediumWait()
        cy.get(arDashboardPage.getTableCellName(4)).contains(users.learner01.learner_01_username).click()
        
        //Wait for applicable button to become enabled
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Edit User'), 1000))
        //Verify Impersonate button is disabled
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Impersonate')).should('have.attr', 'aria-disabled', 'true')
    })

    it('Verify Admin With Permission Can Impersonate an Active Learner', () => {
        //Login as sys admin and filter for active learner
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
        cy.wrap(arDashboardPage.AddFilter('Username', 'Contains', users.learner01.learner_01_username))
        arDashboardPage.getMediumWait()
        cy.get(arDashboardPage.getTableCellName(4)).contains(users.learner01.learner_01_username).click()
        
        //Verify learner can be impersonated
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Impersonate'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Impersonate')).click()

        //Verify admin is directed to LE and is impersonating learner
        cy.url().should('not.contain', '/Admin')
        cy.get(LEDashboardPage.getDashboardPageTitle()).should('contain', `Welcome, ${users.learner01.learner_01_fname} ${users.learner01.learner_01_lname}`)

        //Check learner profile and verify details
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(LEProfilePage.getLearnerFName()).should('contain', users.learner01.learner_01_fname)
        cy.get(LEProfilePage.getLearnerLName()).should('contain', users.learner01.learner_01_lname)
        cy.get(LEProfilePage.getLearnerUName()).should('contain', users.learner01.learner_01_username)
        cy.get(LEProfilePage.getLearnerEmail()).should('contain', users.learner01.learner_01_email)

        //Verify admin can stop impersonating user and is directed back to user report
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Stop Impersonating')
        cy.url().should('contain', '/Admin/Users')
    })

    it('Verify Admin is Directed to LE When Impersonating User Who has Admin and Learner Access', () => {
        //Login as sys admin and filter for active user with admin and learner access
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
        cy.wrap(arDashboardPage.AddFilter('Username', 'Contains', users.depAdminLogInOut.admin_dep_loginout_username))
        cy.get(arDashboardPage.getTableCellName(4)).contains(users.depAdminLogInOut.admin_dep_loginout_username).click()
        
        //Impersonate the admin/learner
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Impersonate'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Impersonate')).click()

        //Verify admin is directed to the Admin side
        cy.intercept('**/client-sync-settings').as('getImpersonationDashboard').wait('@getImpersonationDashboard', {timeout: 15000})
        arDashboardPage.getLShortWait()
        //Verify Impersonation banner message
        cy.get(arDashboardPage.getImpersonationBannerMessage()).should('have.text', 'Impersonating' + ' ' + "'" + users.depAdminLogInOut.admin_dep_loginout_fname + ' ' + users.depAdminLogInOut.admin_dep_loginout_lname + "'Stop Impersonating")
        //Verify Stop Impersonation Button directs back to original Administrator login and banner no longer exists
        cy.get(arDashboardPage.getStopImpersonationBtn()).click()
        cy.intercept('**/client-sync-settings').as('getDashboard').wait('@getDashboard', {timeout: 15000})
        cy.get(arDashboardPage.getImpersonationBannerMessage()).should('not.exist')
        cy.get(arDashboardPage.getCurrentUserLabel()).contains(`${users.sysAdmin.admin_sys_01_fname} ${users.sysAdmin.admin_sys_01_lname}`)
    })
})