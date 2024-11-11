/**
 * QAAUT-2667 
 * Tests includes Create, Edit and Delete operations for the Rich Text Widget Type.
 */

/// <reference types="cypress" />
import actionButtons from '../../../../../fixtures/actionButtons.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { dashboardDetails } from '../../../../../../helpers/TestData/Dashboard/dashboardDetails'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('AR - Regress - CED - Dashboards - Rich Text Widget', () => {   
    beforeEach(() => {
        // (SETUP) Admin can login and navigate to the Dashboards report
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getDashboardsReport()
    })
    
    it(`Save new dashboard - ${dashboardDetails.dashboardName} and add Rich Text widget`, () => {
        arDashboardPage.addDashboard(dashboardDetails.dashboardName, dashboardDetails.balanced)
        arDashboardPage.addWidget(dashboardDetails.richText)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Title')).clear().type(dashboardDetails.richTextTitle)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Subtitle')).clear().type(dashboardDetails.subTitle)
        cy.get(arDashboardPage.getSubmitBtn()).click()
        cy.get(arDashboardPage.getPageHeaderTitle(),{timeout:10000}).scrollIntoView().should('be.visible').and("have.text", `${actionButtons.CONFIGURE_WIDGETS}`)
        // Verify changes made to the Rich Text Widget
        cy.get(arDashboardPage.getSanitizedHtml()).eq(0).should('have.text', 'Welcome to Your Dashboard')
    })

    it(`Edit newly added dashboard - ${dashboardDetails.dashboardName}`, () => {
        arDashboardPage.filterDashboardsReportByTitle(dashboardDetails.dashboardName)
        arDashboardPage.reportItemAction(actionButtons.CONFIGURE_WIDGETS)
        arDashboardPage.editWidget()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Body')).clear().type(`{selectall}${dashboardDetails.body}{selectall}`)
        cy.get(arDashboardPage.getBoldBtn()).click()
        cy.get(arDashboardPage.getSubmitBtn()).click()
        // Verify changes made to the Rich Text Widget
        cy.get(arDashboardPage.getSanitizedHtml()).eq(0).should('have.text', 'Welcome to Your Dashboard')
    })

    it(`Clear all widgets for dashboard - ${dashboardDetails.dashboardName}`, () => {
        arDashboardPage.filterDashboardsReportByTitle(dashboardDetails.dashboardName)
        arDashboardPage.reportItemAction(actionButtons.CONFIGURE_WIDGETS)      
        arDashboardPage.clearWidget()
        cy.get(arDashboardPage.getElementByDataName(actionButtons.ADD_WIDGET_DATA_NAME)).should('have.length', 9);
    })

    it(`Delete newly added dashboard - ${dashboardDetails.dashboardName}`, () => {
        arDashboardPage.deleteDashboard(dashboardDetails.dashboardName)
    })
})
