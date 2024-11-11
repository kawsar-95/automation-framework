import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C6526 - AR - User - Activity feed getting stuck on previously searched user', () => {    
    before(() => {
        // Login as an admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Click on users
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
        // Asserting user result
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
    })

    it('After login Activity feed getting', () => {
        // Asserting Actions
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Users')
        //Selecting user
        cy.get(ARDashboardPage.getGridTable()).its('length').then((len) => {}).as('userCountInPage')
        cy.get('@userCountInPage').then(count => {
            // Number of iterations
            const loopCount = Math.min(5, count)
            let i = 0
            for (; i < loopCount; i++) {
                // Uncheck previously selected user, if any
                if (i > 0) {
                    cy.get(ARDashboardPage.getGridTable()).eq(i - 1).click()    
                }
                cy.get(ARDashboardPage.getGridTable()).eq(i).click()
                // Capture the selected user's full name
                cy.get(ARDashboardPage.getGridTable()).eq(i).find('td').eq(1).invoke('text').as('firstName')
                cy.get(ARDashboardPage.getGridTable()).eq(i).find('td').eq(2).invoke('text').as('lastName')
                cy.get('@firstName').then(firstName => {
                    cy.get('@lastName').then(lastName => {
                        cy.wrap({fullName: `${lastName} ${firstName}`}).as('selectedUser')
                    })
                })
                // View the selected user's activity
                cy.get('@selectedUser').then(selectedUser => {
                    // Verifying View Activity Feed
                    cy.get(ARDashboardPage.getAddEditMenuActionsByName('View Activity Feed')).should('exist')
                    ARDashboardPage.getShortWait()
                    //Click to View Activity Feed
                    cy.get(ARDashboardPage.getActionBtnByLevel()).contains('View Activity Feed').click()
                    ARDashboardPage.getMediumWait()
                    // Assert that the user should not be stuck on previously searched user in the Activity Feed page
                    // That is the selecte user's name from the Users page should match with the user search in the 
                    // Activity Feed page
                    cy.get(ARDashboardPage.getElementByDataName('value')).invoke('text').should('contain', selectedUser.fullName)
                    cy.get(ARDashboardPage.getBackIconBtn()).click()
                    ARDashboardPage.getMediumWait()
                })
            }
        })
    })
})
