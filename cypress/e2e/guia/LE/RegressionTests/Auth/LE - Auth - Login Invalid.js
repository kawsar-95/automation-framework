import users from '../../../../../fixtures/users.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'

describe('LE - Auth - Login Invalid', function(){

    it('Login-Invalid', function(){      
        cy
            
            .visit("/")

            .intercept('GET','/api/rest/v2/my-catalog?_sort=name&showCompleted=false').as('publicCatalog').wait('@publicCatalog')
            
            // Asserting and clicking main login button is present
            .get(LEDashboardPage.getPublicDashboardLoginBtn()).should('be.visible').click()

            //Asserting text fields, populating them and logging in with incorrect username
            .get(LEDashboardPage.getUsernameTxtF()).should('be.visible').type(users.adminLogInOut.ADMIN_LOGINOUT_USERNAME+'test')
            .get(LEDashboardPage.getPasswordTxtF()).should('be.visible').type(users.adminLogInOut.ADMIN_LOGINOUT_PASSWORD)
            .get(LEDashboardPage.getLoginBtn()).contains('Login').click()

            .get(LEDashboardPage.getLoginForm()).should('be.visible').contains(LEDashboardPage.getLoginErrorMsg())

            //Populating text fields and logging in with incorrect password
            .get(LEDashboardPage.getUsernameTxtF()).clear().type(users.adminLogInOut.ADMIN_LOGINOUT_USERNAME)
            .get(LEDashboardPage.getPasswordTxtF()).clear().type(users.adminLogInOut.ADMIN_LOGINOUT_PASSWORD+'test')
            .get(LEDashboardPage.getLoginBtn()).contains('Login').click()
          
            .get(LEDashboardPage.getLoginForm()).should('be.visible').contains(LEDashboardPage.getLoginErrorMsg())

            //Verifying that password must be populated
            .get(LEDashboardPage.getUsernameTxtF()).clear().type(users.adminLogInOut.ADMIN_LOGINOUT_USERNAME)
            .get(LEDashboardPage.getPasswordTxtF()).clear()
            
            .get(LEDashboardPage.getLoginForm()).should('be.visible').contains(LEDashboardPage.getUserPassErrorMsg())

            //Verifying that username must be populated
            .get(LEDashboardPage.getUsernameTxtF()).clear()
            .get(LEDashboardPage.getPasswordTxtF()).clear().type(users.adminLogInOut.ADMIN_LOGINOUT_PASSWORD)

            .get(LEDashboardPage.getLoginForm()).should('be.visible').contains(LEDashboardPage.getUserPassErrorMsg())
           
    })      
})