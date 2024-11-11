/**
 * QAAUT-2662 
 * Tests includes Create, Edit and Delete operations for the Logins Widget Type.
 */

/// <reference types="cypress" />
import actionButtons from '../../../../../fixtures/actionButtons.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { dashboardDetails } from '../../../../../../helpers/TestData/Dashboard/dashboardDetails'
import { users } from '../../../../../../helpers/TestData/users/users'


describe('AR - Regress - CED - Dashboards - Logins Widgets', () => {   
    beforeEach(() => {
        // (SETUP) Admin can login and navigate to the Dashboards report
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        // Navigate to Dashboards Report
        arDashboardPage.getDashboardsReport()
    })
    
    it(`Save new dashboard - ${dashboardDetails.dashboardName} and add Logins widget`, () => {
        arDashboardPage.addDashboard(dashboardDetails.dashboardName, dashboardDetails.balanced)
      
        // Add line graph, summary and vertical bar graphs login widgets
        dashboardDetails.loginWidgetTypes.forEach((item, index) => {
            arDashboardPage.addWidget(dashboardDetails.logins, index)
            arDashboardPage.addLoginWidgetInfoForDashboard(item) 
        });       
    })

    it(`Edit newly added dashboard - ${dashboardDetails.dashboardName}`, () => {
        arDashboardPage.filterDashboardsReportByTitle(dashboardDetails.dashboardName)
        arDashboardPage.reportItemAction(actionButtons.CONFIGURE_WIDGETS)

        // Edit frequency and range values for all 3 login widget types
        dashboardDetails.loginWidgetTypes.forEach((item, index) => {
            arDashboardPage.editWidget(index)
            arDashboardPage.editLoginWidgetInfoForDashboard(item) 
        });
    })

    it(`Clear all widgets for dashboard - ${dashboardDetails.dashboardName}`, () => {
        arDashboardPage.filterDashboardsReportByTitle(dashboardDetails.dashboardName)
        arDashboardPage.reportItemAction(actionButtons.CONFIGURE_WIDGETS)
        
        // Clear all 3 login widget types
        dashboardDetails.loginWidgetTypes.forEach((item, index) => {
            arDashboardPage.clearWidget(index)
        });

        // Verify all 3 login widget types are cleared
        cy.get(arDashboardPage.getElementByDataName(actionButtons.ADD_WIDGET_DATA_NAME)).should('have.length', 9);
    })

    it(`Delete newly added dashboard - ${dashboardDetails.dashboardName}`, () => {
        arDashboardPage.deleteDashboard(dashboardDetails.dashboardName)
    })
})
