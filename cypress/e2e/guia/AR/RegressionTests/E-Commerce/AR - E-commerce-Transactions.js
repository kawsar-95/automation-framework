import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCouponsAddEditPage from '../../../../../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage'
import { users } from '../../../../../../helpers/TestData/users/users'

describe("C7360 - AR - E-commerce-Transactions", function () {
    beforeEach(() => {
        //Login into the admin side 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
    })

    it("E-commerce-Transactions", () => {
        //Go to transactions menu
        ARDashboardPage.getTransactionsReport()

        // Filter Status = Pending Approval
        ARCouponsAddEditPage.A5AddFilter("Status", null, "Pending Approval")

        // Select first Row
        cy.get(ARDashboardPage.getA5TableCellRecord(), {timeout:10000}).should('contain', "Pending Approval")
        cy.get(ARDashboardPage.getTableCellContentByIndex(3)).first().click()
        cy.get(ARDashboardPage.getTableCellContentByIndex(1)).first().should('have.class', 'selected')

        // Verify Sub Action Items should be displayed
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(1)).should('have.text', 'Details')
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(2)).should('have.text', 'Receipt')
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(3)).should('have.text', 'Mark Refunded')
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(4)).should('have.text', 'Approve')
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(5)).should('have.text', 'Decline')
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(6)).should('have.text', 'Deselect')

        // Click on Details
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(1)).click()
        cy.get(ARCouponsAddEditPage.getA5PageHeaderTitle(), {timeout:10000}).should('contain', 'Transaction Details')

        // Apply filter on Course Name
        cy.get(ARDashboardPage.getTableCellContentByIndex(3), {timeout:10000}).should('be.visible')
        cy.get(ARDashboardPage.getTableCellContentByIndex(3)).first().invoke('text').then((text) => {
            ARCouponsAddEditPage.A5AddFilter("Course Name", "Contains", text)
            // Result should be found as per the filter correctly
            cy.get(ARDashboardPage.getTableCellContentByIndex(3), {timeout:10000}).should('contain', text).and('be.visible')
        })
        
        cy.go('back')
        cy.get(ARCouponsAddEditPage.getA5PageHeaderTitle(), {timeout:10000}).should('have.text', 'Transactions')

        //Click on Receipt
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(2)).should('have.attr', 'target', '_blank')
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(2)).click()
        ARCouponsAddEditPage.getMediumWait()

        // Verify Next browser should be opened with receipt detail correctly

        // Click on Mark refund
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(3)).click()

        // Undo refund option should be displayed in Action Items
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(3), {timeout:10000}).should('have.text', 'Undo Refund')

        // Click on Undo refund
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(3)).click()
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(3), {timeout:10000}).should('have.text', 'Mark Refunded')

        // Click on Deselect
        cy.get(ARCouponsAddEditPage.getA5AddEditMenuActionsByIndex(6)).click()

        // Selected transaction should  be deselected.
        cy.get(ARDashboardPage.getTableCellContentByIndex(1)).first().should('not.have.class', 'selected')
    })
})