/**
 * QAAUT-2667 
 * Tests includes Create, Edit and Delete operations for the My Activity Widget Type.
 */

/// <reference types="cypress" />
import actionButtons from '../../../../../fixtures/actionButtons.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { dashboardDetails } from '../../../../../../helpers/TestData/Dashboard/dashboardDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'

describe('AR - Regress - CED - Dashboards - My Activity Widget', () => {   
    beforeEach(() => {
        // (SETUP) Admin can login and navigate to the Dashboards report
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        // Navigate to Dashboards Report
        arDashboardPage.getDashboardsReport()
    })
    
    it(`Save new dashboard - ${dashboardDetails.dashboardName} and add My Activity widget`, () => {
        arDashboardPage.addDashboard(dashboardDetails.dashboardName, dashboardDetails.balanced)
        arDashboardPage.addWidget(dashboardDetails.myActivity)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Title')).clear().type(dashboardDetails.myActivityWidgetName)
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getSubmitBtn()))
        cy.get(arDashboardPage.getSubmitBtn()).click()
        cy.get(arDashboardPage.getPageHeaderTitle(),{timeout:10000}).scrollIntoView().should('be.visible').and("have.text", `${actionButtons.CONFIGURE_WIDGETS}`)
    })

    it(`Edit newly added dashboard - ${dashboardDetails.dashboardName}`, () => {
        arDashboardPage.filterDashboardsReportByTitle(dashboardDetails.dashboardName)
        arDashboardPage.reportItemAction(actionButtons.CONFIGURE_WIDGETS)

        arDashboardPage.editWidget()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Title')).clear().type(dashboardDetails.myActivityWidgetName + commonDetails.appendText)
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getSubmitBtn()))
        cy.get(arDashboardPage.getSubmitBtn()).click()
        cy.get(arDashboardPage.getElementByDataName(dashboardDetails.widgetTitle)).eq(0).should('have.text', dashboardDetails.myActivityWidgetName + commonDetails.appendText)
    })

    it(`Clear all widgets for dashboard - ${dashboardDetails.dashboardName}`, () => {
        arDashboardPage.filterDashboardsReportByTitle(dashboardDetails.dashboardName)
        arDashboardPage.reportItemAction(actionButtons.CONFIGURE_WIDGETS)
        
        arDashboardPage.clearWidget()

        // Verify My Activity widget type is cleared
        cy.get(arDashboardPage.getElementByDataName(actionButtons.ADD_WIDGET_DATA_NAME)).should('have.length', 9);
    })

    it(`Delete newly added dashboard - ${dashboardDetails.dashboardName}`, () => {
        arDashboardPage.deleteDashboard(dashboardDetails.dashboardName)
    })
})
