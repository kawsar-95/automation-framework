/**
 * QAAUT-2668
 * Tests includes Create, Edit and Delete operations for the Generated Reports Widget Type.
 */

/// <reference types="cypress" />
import actionButtons from '../../../../../fixtures/actionButtons.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { dashboardDetails, } from '../../../../../../helpers/TestData/Dashboard/dashboardDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'


describe('AR - Regress - CED - Dashboards - Generated Reports Widget', () => {   
    beforeEach(() => {
        // (SETUP) Admin can login and navigate to the Dashboards report
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getDashboardsReport()
    })
    
    it(`Save new dashboard - ${dashboardDetails.dashboardName} and add Generated Reports widget`, () => {
        arDashboardPage.addDashboard(dashboardDetails.dashboardName, dashboardDetails.balanced)
        arDashboardPage.addWidget(dashboardDetails.generatedReports)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Title')).clear().type(dashboardDetails.generatedReportsWidgetName)
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getSubmitBtn()))
        cy.get(arDashboardPage.getSubmitBtn()).click()
        cy.get(arDashboardPage.getPageHeaderTitle(),{timeout:10000}).scrollIntoView().should('be.visible').and("have.text", `${actionButtons.CONFIGURE_WIDGETS}`)
    })

    it(`Edit newly added dashboard - ${dashboardDetails.dashboardName}`, () => {
        arDashboardPage.filterDashboardsReportByTitle(dashboardDetails.dashboardName)
        arDashboardPage.reportItemAction(actionButtons.CONFIGURE_WIDGETS)

        arDashboardPage.editWidget()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Title')).clear().type(dashboardDetails.generatedReportsWidgetName + commonDetails.appendText)
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getSubmitBtn()))
        cy.get(arDashboardPage.getSubmitBtn()).click()
        cy.get(arDashboardPage.getElementByDataName(dashboardDetails.widgetTitle)).eq(0).should('have.text', dashboardDetails.generatedReportsWidgetName + commonDetails.appendText)
    })

    it(`Clear all widgets for dashboard - ${dashboardDetails.dashboardName}`, () => {
        arDashboardPage.filterDashboardsReportByTitle(dashboardDetails.dashboardName)
        arDashboardPage.reportItemAction(actionButtons.CONFIGURE_WIDGETS)
        
        arDashboardPage.clearWidget()

        // Verify Generated Reports widget is cleared
        cy.get(arDashboardPage.getElementByDataName(actionButtons.ADD_WIDGET_DATA_NAME)).should('have.length', 9);
    })

    it(`Delete newly added dashboard - ${dashboardDetails.dashboardName}`, () => {
        arDashboardPage.deleteDashboard(dashboardDetails.dashboardName)
    })
})