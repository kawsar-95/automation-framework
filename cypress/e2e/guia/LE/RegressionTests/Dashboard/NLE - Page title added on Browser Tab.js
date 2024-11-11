import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('C1757 AUT-405, NLE - Page title added on Browser Tab', () => {
    it('Verify Public dashboard Title', () => {
        cy.visit("/")
        cy.title().should('include', 'GUIA')

        LEDashboardPage.verifyPageNameAndTitle('Catalog', 'Catalog')
        LEDashboardPage.verifyPageNameAndTitle('Enrollment Key', 'Sign Up')
        LEDashboardPage.verifyPageNameAndTitle('FAQs', 'FAQs')
        LEDashboardPage.verifyPageNameAndTitle('Latest News', 'News')
    })

    it('Verify Private dashboard Title', () =>{ 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        LEDashboardPage.getShortWait()
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        cy.title().should('include', 'GUIA')

        LEDashboardPage.verifyPageNameAndTitle('Transcript', 'Transcript')
        LEDashboardPage.verifyPageNameAndTitle('Catalog', 'Catalog')
        LEDashboardPage.verifyPageNameAndTitle('Resources', 'Resources')
        LEDashboardPage.verifyPageNameAndTitle('Dashboard', 'Private Dashboard')
        LEDashboardPage.verifyPageNameAndTitle('FAQs', 'FAQs')
    })
})