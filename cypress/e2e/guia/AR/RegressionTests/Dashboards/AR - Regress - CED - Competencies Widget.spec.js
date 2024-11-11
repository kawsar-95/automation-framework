/**
 * QAAUT-2666
 * Tests includes Create, Edit and Delete operations for the Competencies Widget Type.
 */

/// <reference types="cypress" />
import actionButtons from '../../../../../fixtures/actionButtons.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { dashboardDetails, addCompetenciesData, editCompetenciesData } from '../../../../../../helpers/TestData/Dashboard/dashboardDetails'
import { users } from '../../../../../../helpers/TestData/users/users'


describe('AR - Regress - CED - Dashboards - Competencies Widget', () => {   
    beforeEach(() => {
        // (SETUP) Admin can login and navigate to the Dashboards report
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getDashboardsReport()
    })
    
    it(`Save new dashboard - ${dashboardDetails.dashboardName} and add Competencies widget`, () => {
        arDashboardPage.addDashboard(dashboardDetails.dashboardName, dashboardDetails.balanced)
        arDashboardPage.addWidget(dashboardDetails.widgetCompetency)
      
        // General Section - Enter Title for the Competencies widget
        cy.get(arDashboardPage.getElementByAriaLabelAttribute('Title')).clear().type(addCompetenciesData.title)

        // Data Section - Select Competencies and Add Filters
        cy.get(arDashboardPage.getElementByDataName(actionButtons.SELECT_COMPETENCIES_DATA_NAME)).click()
        cy.wrap(arSelectModal.SearchAndSelectCompetencies([addCompetenciesData.competency1, addCompetenciesData.competency2]))
        cy.get(arDashboardPage.getElementByDataName(actionButtons.ADD_RULE_DATA_NAME)).click()
        cy.get(arDashboardPage.getElementByDataName(dashboardDetails.availability_rule_item)).find(arDashboardPage.getDDownField()).eq(0).click()
        cy.get(arDashboardPage.getElementByDataName(dashboardDetails.availability_rule_item)).find('li').contains(addCompetenciesData.filterTypeDD1).click()
        cy.get(arDashboardPage.getElementByDataName(dashboardDetails.availability_rule_item)).find(arDashboardPage.getDDownField()).eq(1).click()
        cy.get(arDashboardPage.getElementByDataName(dashboardDetails.availability_rule_item)).find('li').contains(addCompetenciesData.filterTypeDD2).click()

        // Save Changes to Competencies Widget
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getSubmitBtn()))
        cy.get(arDashboardPage.getSubmitBtn()).click()
        cy.get(arDashboardPage.getPageHeaderTitle(),{ timeout:15000 }).scrollIntoView().should('be.visible').and('contain',actionButtons.CONFIGURE_WIDGETS)
    })

    it(`Edit newly added dashboard - ${dashboardDetails.dashboardName}`, () => {
        arDashboardPage.filterDashboardsReportByTitle(dashboardDetails.dashboardName)
        arDashboardPage.reportItemAction(actionButtons.CONFIGURE_WIDGETS)
        arDashboardPage.editWidget()
        // Data Section - Edit Filter and Save Changes
        cy.get(arDashboardPage.getElementByDataName(dashboardDetails.availability_rule_item)).find(arDashboardPage.getDDownField()).eq(0).click()
        cy.get(arDashboardPage.getElementByDataName(dashboardDetails.availability_rule_item)).find('li').contains(editCompetenciesData.filterTypeDD1).click()
        cy.get(arDashboardPage.getElementByDataName(dashboardDetails.availability_rule_item)).find(arDashboardPage.getDDownField()).eq(1).click()
        cy.get(arDashboardPage.getElementByDataName(dashboardDetails.availability_rule_item)).find('li').contains(editCompetenciesData.filterTypeDD2).click()
        cy.get(arDashboardPage.getElementByDataName(dashboardDetails.availability_rule_item)).find(arDashboardPage.getSingleDatePickerInput()).click()
        arDashboardPage.getCalenderSelectSingleDay(10)
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getSubmitBtn()))
        cy.get(arDashboardPage.getSubmitBtn()).click()
        cy.get(arDashboardPage.getPageHeaderTitle(),{ timeout:15000 }).scrollIntoView().should('be.visible').and('contain',actionButtons.CONFIGURE_WIDGETS)
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
