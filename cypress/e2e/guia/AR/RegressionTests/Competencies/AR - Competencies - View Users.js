import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C7384 - View Users', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })
    it('View Users', () => {
       
        // Navigate to Competencies
        ARDashboardPage.getCompetenciesReport()
        //Selecting the first entry in the list
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        // Following action items should display in right panel.
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).should('contain', 'Edit Competency')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).should('contain', 'Assign to User')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(3)).should('contain', 'View Users')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(4)).should('contain', 'Delete')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(5)).should('contain', 'Deselect')

        cy.get(ARDashboardPage.getTableCellContentByIndex(2)).eq(0).invoke('text').then((text) => {
            cy.wrap(text).as('name')
        })
        // Click on View users button from right panel.
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(3)).should('contain', 'View Users').click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        // User should get navigated to Learner competencies page with applied filter of selected competency by default.
        cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('contain', 'Learner Competencies')

        cy.get(ARDashboardPage.getA5FilterItem()).eq(0).click()
        cy.get('@name').then((name) => {

            cy.get(ARDashboardPage.getListItem()).should('contain', name.substr(0, 40))
        })

    })
})
