import actionButtons from '../../../../../fixtures/actionButtons.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import arReportsPage from '../../../../../../helpers/AR/pageObjects/ARReportsPage'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { reports } from '../../../../../../helpers/TestData/Reports/reports'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'



describe('AR - User - Timezone Verification', function () {

   
    before(function () {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //cy.get(arDashboardPage.getSysAdminDashboardPageTitle()).should('have.text', arDashboardPage.getSysAdminDashboardPageTitleTxt())
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        ARDashboardPage.getVShortWait()
        cy.get(arDashboardAccountMenu.getElementByDataName(arDashboardAccountMenu.getTimezoneContainer())).within(()=>{
        cy.get(arDashboardAccountMenu.getDDown()).scrollIntoView().click()
        ARDashboardPage.getVShortWait()
        cy.get(arDashboardAccountMenu.getDDownSearchTxtF()).click()
        cy.get(arDashboardAccountMenu.getDDownSearchTxtF()).type('Alaska')
        cy.get(arDashboardAccountMenu.getDDownOpt()).contains('Alaska').click()
        })
    })

   
    beforeEach(function () {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //cy.get(arDashboardPage.getSysAdminDashboardPageTitle()).should('have.text', arDashboardPage.getSysAdminDashboardPageTitleTxt())
    })

    after(function () {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        cy.get(arDashboardAccountMenu.getElementByDataName(arDashboardAccountMenu.getTimezoneContainer())).within(()=>{
        cy.get(arDashboardAccountMenu.getDDown()).scrollIntoView().click()
        ARDashboardPage.getVShortWait()
        cy.get(arDashboardAccountMenu.getDDownSearchTxtF()).click()
        cy.get(arDashboardAccountMenu.getDDownSearchTxtF()).type('Mountain')
        cy.get(arDashboardAccountMenu.getDDownOpt()).contains('Mountain').click()
        })
    })


    it('should show correct timezone on the User report page', () => {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/api/rest/v2/admin/report-filter-suggestions').as('getUsers').wait('@getUsers')

        // Verify that the correct Timezone is displayed
        cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getReportPageTimezone())).should('contain.text', reports.timezoneName)
    })
    
    it('should show correct timezone on the roles report page', () => {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Roles'))
        cy.intercept('**/api/rest/v2/admin/reports/roles/operations').as('getRoles').wait('@getRoles')
        
        // Verify that the correct Timezone is displayed
        cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getReportPageTimezone())).should('contain.text', reports.timezoneName)
    })

    it('should show correct timezone on the departments report page', () => {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Departments'))
        cy.intercept('**/api/rest/v2/admin/reports/departments/operations').as('getDept').wait('@getDept')

        // Verify that the correct Timezone is displayed
        cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getReportPageTimezone())).should('contain.text', reports.timezoneName)
    })

    it('should show correct timezone on the groups report page', () => {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Groups'))

        // Verify that the correct Timezone is displayed
        cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getReportPageTimezone())).should('contain.text', reports.timezoneName)
    })

    it('should show correct timezone on the enrollment keys report page', () => {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Enrollment Keys'))
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')

        // Verify that the correct Timezone is displayed
        cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getReportPageTimezone())).should('contain.text', reports.timezoneName)
    })

    it('should show correct timezone under custom Date and Time text field when creating a user', () => {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/api/rest/v2/admin/report-filter-suggestions').as('getUsers').wait('@getUsers')
        cy.get(arUserPage.getActionBtnByTitle(actionButtons.ADD_USER)).should('have.text', actionButtons.ADD_USER).click()
        //cy.intercept('**/api/rest/v2/admin/reports/users/schema').as('getCreateUser').wait('@getCreateUser')

        // Verify that the correct Timezone is displayed
        cy.get(arUserAddEditPage.getElementByDataNameAttribute(arUserAddEditPage.getTimeZoneMsg())).should('contain.text', reports.timezoneName)
    })

})
