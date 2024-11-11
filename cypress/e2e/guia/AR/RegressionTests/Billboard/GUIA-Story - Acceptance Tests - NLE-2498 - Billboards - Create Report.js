import ARBillboardsAddEditPage from "../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsAddEditPage"
import ARBillboardsPage from "../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { billboardsDetails } from "../../../../../../helpers/TestData/Billboard/billboardsDetails"
import { miscData } from "../../../../../../helpers/TestData/Misc/misc"
import { users } from "../../../../../../helpers/TestData/users/users"

let names = [billboardsDetails.billboardName, billboardsDetails.billboardName2, billboardsDetails.billboardName3]

describe('AUT-547 C1995 GUIA-Story - Acceptance Tests - NLE-2498 - Billboards - Create Report', () => {
    after('Delete Billboards', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getBillboardsReport()
        ARBillboardsPage.deleteBillboards(names)
    })

    it('Create Billboards', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getBillboardsReport()
        for (let i = 0; i < names.length; i++) {
            ARBillboardsAddEditPage.addSampleBillboard(names[i])
        }
    })

    it('Billboard reports selected course assertion', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getBillboardsReport()

        // Filter and Find the existing billboard
        ARBillboardsAddEditPage.AddFilter('Title', 'Contains', names[0])
        ARBillboardsAddEditPage.AddFilter('Title', 'Contains', names[1])

        // Filtering results works as expected on columns and Sorting works as expected on all grid columns
        cy.get(ARDashboardPage.getTableCellName()).eq(0).should('contain', names[0])
        cy.get(ARDashboardPage.getTableCellName()).eq(1).should('contain', names[1])   

        // Collections return only data requested by the UI
        cy.get(ARDashboardPage.getTableRow()).its('length').then(($length) => {
            expect(2).to.eq($length)
        })
 
        cy.get(ARDashboardPage.getTableRow()).eq(0).find('input').should('have.attr', 'aria-checked', 'false')
        cy.get(ARDashboardPage.getTableCellName()).contains(names[0]).click()
        cy.get(ARDashboardPage.getTableRow()).eq(0).find('input').should('have.attr', 'aria-checked', 'true')
        // Selecting an item updates the items selected counter
        cy.get(ARBillboardsPage.getSelectedItemCount()).should('contain', '1 item(s) selected')
        cy.get(ARDashboardPage.getTableCellName()).contains(names[0]).click()

        // Create layout and the report supports saved layouts
        cy.get(ARBillboardsPage.getReportLayouts()).click()
        cy.get(ARBillboardsPage.getCreateFull()).click()
        cy.get(ARBillboardsPage.getNickName()).type(miscData.layout_name_1)
        cy.get(ARDashboardPage.getCreateLayoutModalSaveBtn()).click({ force: true })

        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')

        cy.get(ARBillboardsPage.getReportLayouts()).click()
        cy.get(ARBillboardsPage.getResetLayout()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 1500000 }).should('not.exist')
        // The default Saved Layout is displayed when the Report is loaded
        cy.get(ARDashboardPage.getTableRow()).its('length').then(($length) => {
            expect($length).to.gte(2)
        })

        // All displayed items can be bulk selected or unselected using the UI control
        cy.get(ARBillboardsPage.getRowSelection()).click()
        cy.get(ARDashboardPage.getSelectThisPageOptionBtn()).click()

        cy.get(ARDashboardPage.getTableRow()).find('input').should('have.attr', 'aria-checked', 'true')

        cy.get(ARBillboardsPage.getDeselectBtn()).click()

        cy.get(ARDashboardPage.getTableRow()).find('input').should('have.attr', 'aria-checked', 'false')

        cy.get(ARBillboardsPage.getGridFooter()).should('be.visible')
    })
})