/// <reference types="cypress" />
import actionButtons from '../../../../../fixtures/actionButtons.json'
import { dashboardDetails } from '../../../../../../helpers/TestData/Dashboard/dashboardDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import departments from '../../../../../../cypress/fixtures/departments.json'


describe('C6327, C7253 - AR - Regress - Dashboards - View Dashboard Report', () => {
    beforeEach(() => {
        // (SETUP) Admin can login and navigate to the Dashboards report
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getDashboardsReport()
    })

    // Add new dashboard
    it(`Save new dashboard - ${dashboardDetails.dashboardName}`, () => {
        // Add New Dashboard
        cy.get(ARDashboardPage.getActionBtnByTitle(actionButtons.ADD_DASHBOARD), {timeout: 3000}).should('have.text', actionButtons.ADD_DASHBOARD).should('have.attr', 'aria-disabled', 'false').click()

        // Select Dashboard Layout
        cy.get(ARDashboardPage.getRadioBtn()).find('span').contains(dashboardDetails.balanced).click()
        cy.get(ARDashboardPage.getSaveBtn()).should('have.text', actionButtons.NEXT).click()

        // Activate New Dashboard
        cy.get(ARDashboardPage.getToggleBtn()).first().click()

        // Enter Dashboard Name
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Name')).type(dashboardDetails.dashboardName)

        // Access Rules Section - Add Dashboard Assignment
        cy.get(ARDashboardPage.getElementByDataName(actionButtons.SELECT_DEPARTMENTS_DATA_NAME)).click()
        ARSelectModal.SelectFunction(departments.DEPT_TOP_NAME)

        // Access Rules Section - Add Dashboard Editor
        cy.get(ARDashboardPage.getElementByDataName(actionButtons.ADD_RULE_DATA_NAME)).click()
        cy.get(ARDashboardPage.getPickerBtn()).click()
        ARSelectModal.SelectFunction(departments.DEPT_TOP_NAME)

        // Save Changes to Dashboard
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getSubmitBtn()))
        cy.get(ARDashboardPage.getSubmitBtn()).click()

        // Wait so that the page can be redirected to the Dashboards Landing Page
        cy.get(ARDashboardPage.getDialogueTitle()).should('not.exist', {timeout: 5000})
    })

    // Click on Manage Dashboard Settings
    it(`Manage Dashboard Settings - ${dashboardDetails.dashboardName}`, () => {
        cy.get(ARDashboardPage.getGridFilterResultLoader(), {timeout: 3000}).should('not.exist')
        cy.wrap(ARDashboardPage.AddFilter('Title', 'Starts With', dashboardDetails.dashboardName))
        cy.get(ARDashboardPage.getTableCellName()).contains(`${dashboardDetails.dashboardName}`).click()

        // Click on Manage Dashboard Settings.
        ARDashboardPage.reportItemAction('Manage Dashboard Settings')
        cy.get(ARDashboardPage.getDialogueTitle(), {timeout: 5000}).should("have.text", "Manage Dashboard")

        // verify navigate to the Manage dashboard page
        cy.get(ARDashboardPage.getElementByDataName('dialog-title')).should('have.text', 'Manage Dashboard')
    })

    // Click on Configure Widget
    it(`Configure Widget - ${dashboardDetails.dashboardName}`, () => {
        cy.get(ARDashboardPage.getGridFilterResultLoader(), {timeout: 3000}).should('not.exist')
        cy.wrap(ARDashboardPage.AddFilter('Title', 'Starts With', dashboardDetails.dashboardName))
        cy.get(ARDashboardPage.getTableCellName()).contains(`${dashboardDetails.dashboardName}`).click()

        // Click on Manage Dashboard Settings.
        ARDashboardPage.reportItemAction('Configure Widgets')
        cy.get(ARDashboardPage.getPageHeaderTitle(), {timeout: 50000}).should('have.text', "Configure Widgets")

        // Verify Navigated to configure Widget page
        cy.url().should('include', '/edit')
        cy.get(ARDashboardPage.getConfigureWidgetsTitle()).should('have.text', 'Configure Widgets')
    })

    // Duplicate Dashboard
    it(`Duplicate Dashboard - ${dashboardDetails.dashboardName}`, () => {
        cy.get(ARDashboardPage.getGridFilterResultLoader(), {timeout: 3000}).should('not.exist')
        cy.wrap(ARDashboardPage.AddFilter('Title', 'Starts With', dashboardDetails.dashboardName))
        cy.get(ARDashboardPage.getTableCellName()).contains(`${dashboardDetails.dashboardName}`).click()

        // Click on Manage Dashboard Settings.
        ARDashboardPage.reportItemAction('Duplicate Dashboard')
        cy.get(ARDashboardPage.getDialogueTitle(), {timeout: 5000}).should("have.text", "Manage Dashboard")

        // verify navigate to the Manage dashboard page
        cy.get(ARDashboardPage.getElementByDataName('dialog-title')).should('have.text', 'Manage Dashboard')

        // Toggle As Active
        cy.get(ARDashboardPage.getToggleEnabled()).click()

        // Update the name 
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Name')).click().type('Bak')

        // Update Departments can be Added
        cy.get(ARDashboardPage.getAddDepartmentsBtn(), {timeout: 1000}).click()
        cy.get(ARSelectModal.getSelectOpt()).contains(departments.DEPT_TOP_NAME).click()
        cy.get(ARSelectModal.getChooseBtn()).click()

        // Add Rules and Department
        cy.get(ARDashboardPage.getElementByDataName(actionButtons.ADD_RULE_DATA_NAME), {timeout: 1000}).click()
        cy.get(ARDashboardPage.getSelectDepartmentBtn()).click()
        cy.get(ARSelectModal.getSelectOpt()).contains(departments.DEPT_TOP_NAME).click()
        cy.get(ARSelectModal.getChooseBtn()).click()

        // Save Changes to Dashboard
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getSubmitBtn()), {timeout: 1000})
        cy.get(ARDashboardPage.getSubmitBtn()).click()
        cy.get(ARDashboardPage.getModalTitle()).should('not.exist')
    })

    // Select existing And Deselect
    it(`Select existing And Deselect`, () => {
        cy.get(ARDashboardPage.getGridFilterResultLoader(), {timeout: 3000}).should('not.exist')
        cy.wrap(ARDashboardPage.AddFilter('Title', 'Starts With', dashboardDetails.dashboardName))
        cy.get(ARDashboardPage.getTableCellName()).contains(`${dashboardDetails.dashboardName}`).click()

        // Click on Deselect Button
        cy.get(ARDashboardPage.getDeselectBtn(), {timeout: 1000}).click()
    })

    // Delete newly added dashboard
    it(`Delete newly added dashboard - ${dashboardDetails.dashboardName}`, () => {
        cy.get(ARDashboardPage.getGridFilterResultLoader(), {timeout: 3000}).should('not.exist')
        // Delete newly added dashboard
        cy.wrap(ARDashboardPage.AddFilter('Title', 'Starts With', dashboardDetails.dashboardName))
        cy.get(ARDashboardPage.getTableCellName()).contains(`${dashboardDetails.dashboardName}`).click()
        ARDashboardPage.reportItemAction(actionButtons.DELETE_DASHBOARD)
        ARDashboardPage.getConfirmModalBtnByText(actionButtons.DELETE)

        // Delete Duplicate Dashboard
        cy.wrap(ARDashboardPage.AddFilter('Title', 'Starts With', dashboardDetails.dashboardName))
        cy.get(ARDashboardPage.getTableCellName()).contains(`${dashboardDetails.dashboardName}`).click()
        ARDashboardPage.reportItemAction(actionButtons.DELETE_DASHBOARD)
        ARDashboardPage.getConfirmModalBtnByText(actionButtons.DELETE)

        cy.get(ARDashboardPage.getNoResultMsg()).should('have.text', "No results found.")
    })
})