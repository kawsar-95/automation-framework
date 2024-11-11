import users from '../../../../../fixtures/users.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'

describe('LE - Auth - Login and Logout - Valid - As SysAdmin', function(){

    it('Login-Logout', function(){      
        cy
            
            .visit("/")

            .intercept('GET','/api/rest/v2/my-catalog?_sort=name&showCompleted=false').as('publicCatalog').wait('@publicCatalog')
            
            // Asserting Hamburger and Menu and Login Button are present
            .get(LEDashboardPage.getNavMenu()).should('be.visible').click()
            .get(LEDashboardPage.getHamLoginBtn()).should('be.visible')  

            // Asserting and clicking main login button is present
            .get(LEDashboardPage.getPublicDashboardLoginBtn()).should('be.visible').click()

            //Asserting page elements, populating them and logging in
            .get(LEDashboardPage.getUsernameTxtF()).should('be.visible').type(users.sysAdminLogInOut.ADMIN_SYS_LOGINOUT_USERNAME)
            .get(LEDashboardPage.getPasswordTxtF()).should('be.visible').type(users.sysAdminLogInOut.ADMIN_SYS_LOGINOUT_PASSWORD)
            .get(LEDashboardPage.getLoginBtn()).contains('Login').click()

            .get(LEDashboardPage.getNavProfile()).should('be.visible')
            .get(LEDashboardPage.getNavMessages()).should('be.visible')
            .get(LEDashboardPage.getNavSearch()).should('be.visible')
            .intercept('GET', '/api/rest/v2/my-catalog?_sort=name&showCompleted=true').as('trueCatalog').wait('@trueCatalog')
            .get(LEDashboardPage.getDashboardPageTitle()).should('be.visible').contains('Welcome')

            //Navigating to the hamburger menu and logging off
            .get(LEDashboardPage.getNavMenu()).should('be.visible').click()
            .get(LEDashboardPage.getMenuItems()).find('button').contains('Log Off').click()
            
            .get(LEDashboardPage.getPublicDashboardLoginBtn()).should('be.visible')
            .wait('@trueCatalog')
    })      
})