/**
 * QAAUT-2692
 * Tests includes Create, Edit and Delete operations for the Course Enrollment Status By Course Widget Type.
 */

/// <reference types="cypress" />
import actionButtons from '../../../../../fixtures/actionButtons.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import {dashboardDetails, courseWidget} from '../../../../../../helpers/TestData/Dashboard/dashboardDetails'


describe('AR - Regress - CED - Dashboards - Course Enrollment Status by Course Widget', () => {   
    beforeEach(() => {
        // (SETUP) Admin can login and navigate to the Dashboards report
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getDashboardsReport()
    })
    
    it(`Save new dashboard - ${dashboardDetails.dashboardName} and add Course Enrollment Status by Course widget`, () => {
        arDashboardPage.addDashboard(dashboardDetails.dashboardName, dashboardDetails.balanced)
      
        // Add horizontal bar graph, horizontal stacked bar graph, vertical bar graph and vertical stacked bar graph graphic types for the widget
        dashboardDetails.graphics.forEach((item, index) => {
            arDashboardPage.addWidget(dashboardDetails.widgetCourse, index)
            arDashboardPage.addCESByCourseWidgetInfoForDashboard(item) 
        });       
    })

    it(`Edit newly added dashboard - ${dashboardDetails.dashboardName}`, () => {
        arDashboardPage.filterDashboardsReportByTitle(dashboardDetails.dashboardName)
        arDashboardPage.reportItemAction(actionButtons.CONFIGURE_WIDGETS)

        // Edit Filters for the widget
        dashboardDetails.graphics.forEach((item, index) => {
            arDashboardPage.editWidget(index)
            arDashboardPage.editCESByCourseWidgetInfoForDashboard(item) 
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
        arDashboardPage.deleteDashboard(dashboardDetails.dashboardName)
    })
})
