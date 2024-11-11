import users from '../../../../../fixtures/users.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEForgotPasswordPage from '../../../../../../helpers/LE/pageObjects/Auth/LEForgotPasswordPage'

describe('LE - Auth - Forgot Password - Invalid', function(){

    it('Forgot Password - Invalid', function(){      
        cy
            
            .visit("/")

            .intercept('GET','/api/rest/v2/my-catalog?_sort=name&showCompleted=false').as('publicCatalog').wait('@publicCatalog')
            // Asserting and clicking main login button is present
            .get(LEDashboardPage.getPublicDashboardLoginBtn()).should('be.visible').click()
            //Enter a valid Username AND Email, then verify error messages
            .get(LEDashboardPage.getForgotPasswordLink()).should('be.visible').click()
            .get(LEForgotPasswordPage.getUsernameTxtF()).should('be.visible').type(users.learner04.LEARNER_04_USERNAME)
            .get(LEForgotPasswordPage.getEmailAddressTxtF()).should('be.visible').type(users.learner04.LEARNER_04_EMAIL)
            .get(LEForgotPasswordPage.getResetPasswordBtn()).should('be.visible').click()
            .get(LEForgotPasswordPage.getTxtFErrorMsg(1)).contains(LEForgotPasswordPage.getCannotProvideBothErrorTxt())
            .get(LEForgotPasswordPage.getTxtFErrorMsg(3)).contains(LEForgotPasswordPage.getCannotProvideBothErrorTxt())
            //Enter email with invalid format (no top-level domain) and verify errors
            .get(LEForgotPasswordPage.getUsernameTxtF()).clear()
            .get(LEForgotPasswordPage.getEmailAddressTxtF()).clear().type('NO_TOP_LVL_DOMAIN@2ND_LVL_DOMAIN.')
            .get(LEForgotPasswordPage.getResetPasswordBtn()).click()
            .get(LEForgotPasswordPage.getTxtFErrorMsg(3)).contains(LEForgotPasswordPage.getValidEmailErrorTxt())
            //Enter email with invalid format (no 2nd-level domain) and verify errors
            .get(LEForgotPasswordPage.getEmailAddressTxtF()).clear().type('NO_2ND_LVL_DOMAIN@.TOP_LVL_DOMAIN')
            .get(LEForgotPasswordPage.getResetPasswordBtn()).click()
            .get(LEForgotPasswordPage.getTxtFErrorMsg(3)).contains(LEForgotPasswordPage.getValidEmailErrorTxt())
            //Enter email with invalid format (no local part) and verify errors
            .get(LEForgotPasswordPage.getEmailAddressTxtF()).clear().type('@2ND_LVL_DOMAIN.TOP_LVL_DOMAIN')
            .get(LEForgotPasswordPage.getResetPasswordBtn()).click()
            .get(LEForgotPasswordPage.getTxtFErrorMsg(3)).contains(LEForgotPasswordPage.getValidEmailErrorTxt())
            //Enter email with invalid format (no dot in domain) and verify errors
            .get(LEForgotPasswordPage.getEmailAddressTxtF()).clear().type('LOCAL_PARTN@NO_DOT_DOMAIN')
            .get(LEForgotPasswordPage.getResetPasswordBtn()).click()
            .get(LEForgotPasswordPage.getTxtFErrorMsg(3)).contains(LEForgotPasswordPage.getValidEmailErrorTxt())
            //Enter email with invalid format (no at symbol) and verify errors
            .get(LEForgotPasswordPage.getEmailAddressTxtF()).clear().type('NO_AT_SYMBOL.TOP_LVL_DOMAIN')
            .get(LEForgotPasswordPage.getResetPasswordBtn()).click()
            .get(LEForgotPasswordPage.getTxtFErrorMsg(3)).contains(LEForgotPasswordPage.getValidEmailErrorTxt())
            //Enter a fake username with various valid characters, verify reset sent messages and return to Dashboard
            .get(LEForgotPasswordPage.getEmailAddressTxtF()).clear()
            .get(LEForgotPasswordPage.getUsernameTxtF()).type('aZ10`~!@#$%^&*()-_=+[{]}\\|;:\'",<.>/?')
            .get(LEForgotPasswordPage.getResetPasswordBtn()).should('be.visible').click()
            .get(LEForgotPasswordPage.getForgotPasswordModuleform()).should('be.visible').contains(LEForgotPasswordPage.getCheckYourEmailInboxTitleTxt())
            .get(LEForgotPasswordPage.getForgotPasswordModuleform()).should('be.visible').contains(LEForgotPasswordPage.getPasswordResetLinkSentMsgTxt())
            .get(LEForgotPasswordPage.getReturnToMyDashboardLink()).should('be.visible').click()
            .get(LEDashboardPage.getPublicDashboardLoginBtn()).should('be.visible')





    })      
})