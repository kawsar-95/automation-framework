import { users } from '../../../../../../helpers/TestData/users/users'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'


describe('LE - Auth - Login and Logout - Valid - As Admin', function(){

    it('Login-Logout', function(){      
        
            cy.visit("/")
            // Asserting Hamburger and Menu and Login Button are present
            cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
            cy.get(LEDashboardPage.getHamLoginBtn()).should('be.visible')  

            // Asserting and clicking main login button is present
            cy.get(LEDashboardPage.getPublicDashboardLoginBtn()).should('be.visible').click()

            //Asserting page elements, populating them and logging in
            cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
            cy.get(LEDashboardPage.getNavProfile()).should('be.visible')
            cy.get(LEDashboardPage.getNavMessages()).should('be.visible')
            cy.get(LEDashboardPage.getNavSearch()).should('be.visible')
            cy.get(LEDashboardPage.getDashboardPageTitle()).should('be.visible').contains('Welcome')

            //Navigating to the hamburger menu and logging off
            cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
            cy.get(LEDashboardPage.getMenuItems()).find('button').contains('Log Off').click()
            
            cy.get(LEDashboardPage.getPublicDashboardLoginBtn()).should('be.visible')
            
    })      
})