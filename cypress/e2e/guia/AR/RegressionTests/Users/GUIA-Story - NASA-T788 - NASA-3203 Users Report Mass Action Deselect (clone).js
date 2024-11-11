import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C1031 - GUIA-Story - NASA-T788 - NASA-3203 Users Report Mass Action Deselect (clone)', () => {
    before('Create the users', () => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.createUser(void 0, userDetails.username2, ["Learner"], void 0)
    })

    after('Delete the users', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")
        ARDashboardPage.deleteUsers([userDetails.username, userDetails.username2])
    })

    it('Mass action user select and deselect', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getUsersReport()
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username2)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
        cy.get(ARCoursesPage.getGridTable()).its('length').then(selectedUserCount => {}).as('userCount')
        cy.get('@userCount').then(userCount => {
            const maxCount = Math.min(userCount, 3)
            let i = 0
            for (; i < maxCount; i++) {
                cy.get(ARCoursesPage.getGridTable()).eq(i).click()        
            }            
        })
        
        // Asserting Deselect menu and click it
        ARCoursesPage.getContextMenuByName('Deselect', { timeout: 10000 }).should('exist').and('be.visible').scrollIntoView().click()

        // Assert that no users are now selected
        cy.get(ARCoursesPage.getUnCheckedItemsInReportGrid()).its('length').then(len => {
            cy.wrap(len).should('equal', 2)
        })
    })
})