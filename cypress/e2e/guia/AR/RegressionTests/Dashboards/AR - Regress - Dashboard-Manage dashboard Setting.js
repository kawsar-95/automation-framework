
import ARDashboardPage, { ManageDashboardArticles } from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import { dashboardDetails } from "../../../../../../helpers/TestData/Dashboard/dashboardDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import actionButtons from '../../../../../fixtures/actionButtons.json'
import departments from "../../../../../fixtures/departments.json"

describe("C6324 - AR - Regress - DashBoard - Manage dashboard settings ", function () {

    beforeEach('Login as an Adnin', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    after('Delete created Dashboard for the test', () => {
        ARDashboardPage.getDashboardsReport()
        ARDashboardPage.deleteDashboard(dashboardDetails.dashboardName)
    })

    it(" Manage Dashboard ", function () {
        // Create a Dashboard for the test first
        ARDashboardPage.getDashboardsReport()
        ARDashboardPage.addDashboard(dashboardDetails.dashboardName, dashboardDetails.balanced)
        cy.get(ARDashboardPage.getDialogueTitle()).should('not.exist', {timeout: 5000})

        cy.get(ARDashboardPage.getDashboardLink(), {timeout: 1000}).click()
        ARDashboardPage.setUpDesiredDashboardbyName(dashboardDetails.dashboardName)
        //Navigate to widget settings
        cy.get(ARDashboardPage.getManageDashboardBtn(),{timeout:10000}).should('be.visible')
        cy.get(ARDashboardPage.getManageDashboardBtn()).click()
        cy.get(ARDashboardPage.getManageDashboardMenuItems()).contains(actionButtons.MANAGE_DASHBOARD_SETTINGS).click()

        //Verify the header
        cy.get(ARDashboardPage.getDialogueTitle(), {timeout: 3000}).should("have.text", "Manage Dashboard")
        //Get Into Modal
        cy.get(ARDashboardPage.getAddWidgetModal()).within(function () {
            // Click the Status toggle to 'Active'
            cy.get(ARDashboardPage.getToggleBtn()).first().click()
            cy.get(ARDashboardPage.getToggleBtn()).first().click()
            
            // Go to General Section
            cy.get(ARDashboardPage.getGeneralSection()).within(function () {
                cy.get(ARDashboardPage.getModalDescription()).should('have.text', ManageDashboardArticles.Inactive_description)
                cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Name")).invoke("val").should('eq', dashboardDetails.dashboardName)
                cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Name")).clear().type(dashboardDetails.dashboardName);
            })

            //Navigate to Dashboard Assaignments
            cy.get(ARDashboardPage.getAssaignmentSection()).within(function () {
                cy.get(ARDashboardPage.getAssaignmentDescription()).should('have.text',ManageDashboardArticles.Availability_description)
            })

            //Navigate to Dashboard Editors 
            cy.get(ARDashboardPage.getDashboardEditorsSection()).within(function () {
                cy.get(ARDashboardPage.getModalDescription()).should('have.text', ManageDashboardArticles.Edit_description)
            })
        })

        // Select Department 
        cy.get(ARDashboardPage.getElementByDataName('select-departments')).click()
        ARSelectModal.SearchAndSelectFunction([departments.DEPT_TOP_NAME])
        cy.get(ARDashboardPage.getElementByDataNameAttribute('dashboardAssignmentGroupIds'), {timeout: 2000}).within(() => {
            cy.get(ARDashboardPage.getDDown()).click()
            cy.get(ARDashboardPage.getElementByNameAttribute('dashboardAssignmentGroupIds')).type('AutomaticGroup')
            cy.get(ARDashboardPage.getListItem()).eq(0).click()
        })
        // Save the Dashboard
        cy.get(ARDashboardPage.getElementByDataNameAttribute('save')).click()
        cy.get(ARDashboardPage.getDialogueTitle()).should('not.exist', {timeout: 5000})
    })
})