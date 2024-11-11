import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C7408 - Search Existing Leaderboard', () => {
    beforeEach(() => {
        // Enter the username & password then click on Login button
        cy.loginAdmin(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password
        )
    })

    it('Search Existing Leaderboard', () => {
        
        // Navigate to leaderboard
        ARDashboardPage.getLeaderboardsReport()
        cy.get(ARDashboardPage.getTableCellContentByIndex(2)).eq(0).invoke('text').then((text) => {
            cy.wrap(text).as('name')
        })
        cy.get('@name').then((name) => {
            // Select any criteria from filter available
            ARDashboardPage.A5AddFilter('Name', 'Equals', name)
            ARDashboardPage.getMediumWait()
            // Check the result after applying the filter
            cy.get(ARDashboardPage.getGridTable()).its('length').then((length) => {
                expect(length).greaterThan(0)
            })
            cy.get(ARDashboardPage.getTableCellContentByIndex(2)).eq(0).invoke('text').then((text) => {
                expect(text).eq(name)
            })
        })

    })
})