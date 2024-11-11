/**
 * QAAUT-2675 
 * Tests includes Create, Edit and Delete operations for the Saved Reports Widget Type.
 */

/// <reference types="cypress" />
import actionButtons from '../../../../../fixtures/actionButtons.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { dashboardDetails } from '../../../../../../helpers/TestData/Dashboard/dashboardDetails'


describe('AR - Regress - CED - Dashboards - Saved Reports Widget', () => {   
    beforeEach(() => {
        // (SETUP) Admin can login and navigate to the Dashboards report
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        // Navigate to Dashboards Report
        arDashboardPage.getDashboardsReport()
    })
    
    it(`Save new dashboard - ${dashboardDetails.dashboardName} and add Saved Reports widget`, () => {
        arDashboardPage.addDashboard(dashboardDetails.dashboardName, dashboardDetails.balanced)
        arDashboardPage.addWidget(dashboardDetails.savedReports)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Title')).clear().type(dashboardDetails.savedReportsTitle)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Subtitle')).clear().type(dashboardDetails.savedReportsSubTitle)
        cy.get(arDashboardPage.getElementByDataName(actionButtons.CHECKBOX_GROUP_DATA_NAME)).find('span').contains(dashboardDetails.reportData[0]).click()
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getSubmitBtn()))
        cy.get(arDashboardPage.getSubmitBtn()).click()
        cy.get(arDashboardPage.getWidgetTitle(), {timeout:15000}).scrollIntoView().should('be.visible')
        // Verify Shared Report shows up as a list item
        cy.get(arDashboardPage.getWidgetTitle()).should('be.visible').and('contain', `${dashboardDetails.savedReportsTitle}`)
    })

    it(`Edit newly added dashboard - ${dashboardDetails.dashboardName}`, () => {
        arDashboardPage.filterDashboardsReportByTitle(dashboardDetails.dashboardName)
        arDashboardPage.reportItemAction(actionButtons.CONFIGURE_WIDGETS)

        arDashboardPage.editWidget()
        cy.get(arDashboardPage.getElementByDataName(actionButtons.CHECKBOX_GROUP_DATA_NAME)).find('span').contains(dashboardDetails.reportData[0]).click()
        cy.get(arDashboardPage.getElementByDataName(actionButtons.CHECKBOX_GROUP_DATA_NAME)).find('span').contains(dashboardDetails.reportData[1]).click()
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getSubmitBtn()))
        cy.get(arDashboardPage.getSubmitBtn()).click()
        cy.get(arDashboardPage.getWidgetTitle(), {timeout:15000}).scrollIntoView().should('be.visible')
        // Verify My Saved Report shows up as a list item
        cy.get(arDashboardPage.getElementByDataName('saved-report-list-item')).its('length').should('be.gt', 0)
    })

    it(`Clear all widgets for dashboard - ${dashboardDetails.dashboardName}`, () => {
        arDashboardPage.filterDashboardsReportByTitle(dashboardDetails.dashboardName)
        arDashboardPage.reportItemAction(actionButtons.CONFIGURE_WIDGETS)
        
        arDashboardPage.clearWidget()

        // Verify Saved Reports widget type is cleared
        cy.get(arDashboardPage.getElementByDataName(actionButtons.ADD_WIDGET_DATA_NAME)).should('have.length', 9);
    })

    it(`Delete newly added dashboard - ${dashboardDetails.dashboardName}`, () => {
        arDashboardPage.deleteDashboard(dashboardDetails.dashboardName)
    })
})
