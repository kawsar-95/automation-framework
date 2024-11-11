/**
 * QAAUT-2689
 * Tests includes Create, Edit and Delete operations for the Course Enrollment Status By Department Widget Type.
 */

/// <reference types="cypress" />
// import users from '../../../../../fixtures/users.json'
import actionButtons from '../../../../../fixtures/actionButtons.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arBasePage from '../../../../../../helpers/AR/ARBasePage'
import { dashboardDetails } from '../../../../../../helpers/TestData/Dashboard/dashboardDetails'
import { users } from '../../../../../../helpers/TestData/users/users'

// const DASHBOARD_NAME = 'Dashboard_' + new arBasePage().getTimeStamp()
// const BALANCED = 'Balanced'
// const WIDGET = 'Course Enrollment Status by Department'
// const GRAPHICS = ['horizontalBarGraph', 'horizontalStackedBarGraph', 'verticalBarGraph', 'verticalStackedBarGraph']

describe('AR - Regress - CED - Dashboards - Course Enrollment Status by Department Widget', () => {   
    beforeEach(() => {
        // (SETUP) Admin can login and navigate to the Dashboards report
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getDashboardsReport()
    })
    
    it(`Save new dashboard - ${dashboardDetails.dashboardName} and add Course Enrollment Status by Department widget`, () => {
        arDashboardPage.addDashboard(dashboardDetails.dashboardName, dashboardDetails.balanced)
      
        // Add horizontal bar graph, horizontal stacked bar graph, vertical bar graph and vertical stacked bar graph graphic types for the widget
        dashboardDetails.graphics.forEach((item, index) => {
            arDashboardPage.addWidget(dashboardDetails.widgetDepartment, index)
            arDashboardPage.addCESByDepartmentWidgetInfoForDashboard(item) 
        });       
    })

    it(`Edit newly added dashboard - ${dashboardDetails.dashboardName}`, () => {
        arDashboardPage.filterDashboardsReportByTitle(dashboardDetails.dashboardName)
        arDashboardPage.reportItemAction(actionButtons.CONFIGURE_WIDGETS)

        // Edit Enrollment Status for the widget
        dashboardDetails.graphics.forEach((item, index) => {
            arDashboardPage.editWidget(index)
            arDashboardPage.editCESByDepartmentWidgetInfoForDashboard(item) 
        });
    })

    it(`Clear all widgets for dashboard - ${dashboardDetails.dashboardName}`, () => {
        arDashboardPage.filterDashboardsReportByTitle(dashboardDetails.dashboardName)
        arDashboardPage.reportItemAction(actionButtons.CONFIGURE_WIDGETS)
        dashboardDetails.graphics.forEach((item, index) => {
            arDashboardPage.clearWidget(index)
        });
        cy.get(arDashboardPage.getElementByDataName(actionButtons.ADD_WIDGET_DATA_NAME)).should('have.length', 9);
    })

    it(`Delete newly added dashboard - ${dashboardDetails.dashboardName}`, () => {
        arDashboardPage.filterDashboardsReportByTitle(dashboardDetails.dashboardName)
        arDashboardPage.reportItemAction(actionButtons.DELETE_DASHBOARD)
        arDashboardPage.getConfirmModalBtnByText(actionButtons.DELETE)
        cy.get(arDashboardPage.getNoResultMsg()).should('have.text', "No results found.")
    })
})
