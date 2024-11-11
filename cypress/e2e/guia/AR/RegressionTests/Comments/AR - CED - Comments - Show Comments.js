import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C7430 - Comments - Show Comments', () => {
    
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })

    it('Show Comments', () => {
        
        // Navigate to Comments
        ARDashboardPage.getCommentsReport()
        cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('contain', 'Course Comments')
        // Click on Show Comments button from right panel.
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).should('contain', 'Show Comments').click()
        // User should get navigated to "Course Comments" page
        cy.get(ARDashboardPage.getA5PageHeaderTitle()).should('contain', 'Course Comments')
    })

})