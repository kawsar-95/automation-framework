import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARComposeMessage from "../../../../../../helpers/AR/pageObjects/Departments/ARComposeMessage"
import ARMessageTemplatesPage from "../../../../../../helpers/AR/pageObjects/Setup/ARMessageTemplatesPage"
import ARRolesAddEditPage from "../../../../../../helpers/AR/pageObjects/Roles/ARRolesAddEditPage"
import { users } from "../../../../../../helpers/TestData/users/users"
import { rolesDetails } from "../../../../../../helpers/TestData/Roles/rolesDetails"

describe('AUT-363 - C1066 - GUIA-Plan - NASA-1260 - An Authorized Admin Can Edit Message Template(s) (cloned)', () => {

    beforeEach('Login as an Admin user', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    it('Verify Admin user is authorized to view and modify existing message template', () => {
        ARDashboardPage.getRolesReport()
        ARRolesAddEditPage.AddFilter('Name', 'Equals', rolesDetails.Admin)
        ARRolesAddEditPage.selectTableCellRecord(rolesDetails.Admin)
        cy.get(ARRolesAddEditPage.getAddEditMenuActionsByName('View Role'), {timeout: 3000}).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARRolesAddEditPage.getPageHeaderTitle(), {timeout: 3000}).contains('View Role')
        ARRolesAddEditPage.assertChildPermission('Message Templates', 'View', 'true')
        ARRolesAddEditPage.assertChildPermission('Message Templates', 'Modify', 'true')
    })

    it('Edit a message template and cancel instead of saving', () => {        
        // Navigate to Message Templates
        ARDashboardPage.getMessageTemplateReport()
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Message Templates')
        // Select a template 
        cy.get(ARDashboardPage.getA5TableCellRecord()).eq(0).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
        cy.get(ARMessageTemplatesPage.getEditTemplateBtn(), { timeout: 10000 }).should('be.visible').click()

        // modify the template
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Edit Message Template')

        cy.get(ARComposeMessage.getSubjectTxtF()).clear().type('Hello')
        cy.get(ARComposeMessage.getMessageBodyText()).clear().type('body')
        // Cancel instead of saving
        cy.get(ARDashboardPage.getCancelBtn()).click()
        cy.get(ARMessageTemplatesPage.getCancelEditBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
        // Verify that that the Message Templates page appears after cancelling
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Message Templates')
    })

    it('Edit a message template and save', () => {        
        // Navigate to Message Templates
        ARDashboardPage.getMessageTemplateReport()
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Message Templates')
        // Select a template 
        cy.get(ARDashboardPage.getA5TableCellRecord()).eq(0).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
        cy.get(ARMessageTemplatesPage.getEditTemplateBtn(), { timeout: 10000 }).should('be.visible').click()

        // modify the template
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Edit Message Template')

        cy.get(ARComposeMessage.getSubjectTxtF()).clear().type('Hello')
        cy.get(ARComposeMessage.getMessageBodyText()).clear().type('body')

        // Save the template
        cy.get(ARDashboardPage.getSaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
        // Verify that that the Message Templates page appears after saving
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Message Templates')
    })
})