import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import arReportsPage from '../../../../../../helpers/AR/pageObjects/ARReportsPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { reports } from '../../../../../../helpers/TestData/Reports/reports'



describe('AR - Reports - Timezone Verification', function () {

   
    before(function () {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //cy.get(arDashboardPage.getSysAdminDashboardPageTitle()).should('have.text', arDashboardPage.getSysAdminDashboardPageTitleTxt())
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        arDashboardPage.getVShortWait()
        cy.get(arDashboardAccountMenu.getElementByDataName(arDashboardAccountMenu.getTimezoneContainer())).within(()=>{
        cy.get(arDashboardAccountMenu.getDDown()).scrollIntoView().click()
        arDashboardPage.getVShortWait()
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
        arDashboardPage.getVShortWait()
        cy.get(arDashboardAccountMenu.getDDownSearchTxtF()).click()
        cy.get(arDashboardAccountMenu.getDDownSearchTxtF()).type('Mountain')
        cy.get(arDashboardAccountMenu.getDDownOpt()).contains('Mountain').click()
        })
    })

    it('should show correct timezone on the learner activity report page', () => {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Learner Activity'))
        cy.intercept('**/api/rest/v2/admin/report-filter-suggestions').as('getLearnerA').wait('@getLearnerA')

        // Verify that the correct Timezone is displayed
        cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getReportPageTimezone())).should('contain', reports.timezoneName)
    })

    it('should show correct timezone on the learner progress report page', () => {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Learner Progress'))
        cy.intercept('**/api/rest/v2/admin/report-filter-suggestions').as('getLearnerP').wait('@getLearnerP')

        // Verify that the correct Timezone is displayed
        cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getReportPageTimezone())).should('contain', reports.timezoneName)
    })

    it('should show correct timezone on the Course Upload page', () => {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Course Uploads'))
        cy.intercept('**/api/rest/v2/admin/reports/course-uploads/operations').as('getUpload').wait('@getUpload')
        cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getReportPageTimezone())).should('contain', reports.timezoneName)
    })

    it('should show correct timezone on the credits report page', () => {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Credits'))
        cy.intercept('**/api/rest/v2/admin/reports/credits/operations').as('getCredits').wait('@getCredits')

        // Verify that the correct Timezone is displayed
        cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getReportPageTimezone())).should('contain.text', reports.timezoneName)
    })

    it('should show correct timezone on the curricula activity report page', () => {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Curricula Activity'))
        cy.intercept('**/api/rest/v2/admin/reports/report-definitions').as('getCurricula').wait('@getCurricula')

        // Verify that the correct Timezone is displayed
        cy.get(arReportsPage.getElementByDataNameAttribute(arReportsPage.getReportPageTimezone())).should('contain.text', reports.timezoneName)
    })
})
