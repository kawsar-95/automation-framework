import ARBillboardsAddEditPage from "../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsAddEditPage"
import ARBillboardsPage from "../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsPage"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARGlobalResourcePage from "../../../../../../helpers/AR/pageObjects/GlobalResources/ARGlobalResourcePage"
import ARRolesAddEditPage from "../../../../../../helpers/AR/pageObjects/Roles/ARRolesAddEditPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import { billboardsDetails } from "../../../../../../helpers/TestData/Billboard/billboardsDetails"
import { rolesDetails } from "../../../../../../helpers/TestData/Roles/rolesDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('AUT-550 - C2000 - GUIA-Story - Acceptance Tests -NLE-2499-Billboards Report - Delete Billboard Action', () => {
    before('Create Billboard', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getBillboardsReport()
        ARBillboardsPage.addSampleBillboard(billboardsDetails.billboardName)
    })

    after('Delete user', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")        
    })

    it('Verify that the Admin user with appropriate permissions can delete a Billboard', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        ARDashboardPage.getRolesReport()
        ARRolesAddEditPage.AddFilter('Name', 'Equals', rolesDetails.Admin)
        ARRolesAddEditPage.selectTableCellRecord(rolesDetails.Admin)
        cy.get(ARRolesAddEditPage.getAddEditMenuActionsByName('View Role'), {timeout: 3000}).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARRolesAddEditPage.getPageHeaderTitle(), {timeout: 3000}).contains('View Role')
        ARRolesAddEditPage.assertChildPermission('Billboards', 'View', 'true')
        ARRolesAddEditPage.assertChildPermission('Billboards', 'Modify', 'true')
    })

    it('Delete Billboard', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getBillboardsReport()
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', 'Billboards')
        ARBillboardsAddEditPage.AddFilter('Title', 'Contains', billboardsDetails.billboardName)
        cy.get(ARDashboardPage.getTableCellName()).contains(billboardsDetails.billboardName).click()
        cy.get(ARBillboardsPage.getDeleteBillboard()).click()
        cy.get(ARGlobalResourcePage.getModalCancelBtn()).should('be.visible').click()

        cy.get(ARBillboardsPage.getDeleteBillboard()).click()
        cy.get(ARGlobalResourcePage.getModalOkBtn()).should('be.visible').click()
    })

    it("LE side billboard doesn't appear", () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        LEDashboardPage.getTileByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getCourseCrdName()).contains(billboardsDetails.billboardName).should('not.exist')
    })
})