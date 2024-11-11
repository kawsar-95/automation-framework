import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import { users } from "../../../../../../helpers/TestData/users/users";
import arBillboardsPage from '../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsPage'

describe('C6302 - AR - Billboards - Select and Deselect Billboard', () => {
    beforeEach(() => {
        // Login as sys admmin and visit to the Billboards page
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin");
        ARDashboardPage.getBillboardsReport()
    })

    it('Select and Deselect Existing Billboard', () => {
        // Selelct a Billboard from existing Billboards    
        cy.get(arBillboardsPage.getGridTable()).eq(0).click()
        ARDashboardPage.getShortWait()

        // Assert that the 'Deselect' button exists and is visible
        cy.get(arBillboardsPage.getDeselectBtn()).should('exist').and('be.visible')

        // Stores the total count of buttons present in the sidebar after selecting a Billboard
        cy.get(arBillboardsPage.getContextMenu()).find('button').its('length')
            .then((len) => { }).as('buttonCount')

        // Assert that:
        //  1. 'Deslect' button is the last button by position
        //  2. 'Delete Billboard' comes before the 'Deslect' button position
        cy.get('@buttonCount').then(count => {
            cy.get(arBillboardsPage.getContextMenu()).find('button').each((el, index) => {
                if (el.children().get()[0].innerText === 'Deselect') {
                    cy.wrap(index).should('be.eq', count - 1)
                } else if (el.children().get()[0].innerText === 'Delete Billboard') {
                    cy.wrap(index).should('be.eq', count - 2)
                }
            })
        })

        // Click the 'Deselect button, assert that it's no loger visible and the selected Billboard is not visible anymore
        cy.get(arBillboardsPage.getDeselectBtn()).click()

        // Assert that the selected Billboard is now unselected
        cy.get(arBillboardsPage.getGridTable()).eq(0).within(() => {
            cy.get(arBillboardsPage.getUnselectedCheckInput()).should('exist')
        })
        // Assert that the 'Deslect' button does no longer exist
        cy.get(arBillboardsPage.getDeselectBtn()).should('not.exist')
    })
})