import users from '../../../../../fixtures/users.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEForgotPasswordPage from '../../../../../../helpers/LE/pageObjects/Auth/LEForgotPasswordPage'

describe('LE - Auth - Forgot Password - Valid', function(){

    it('Forgot Password - Valid', function(){      
        cy
            
            .visit("/")

            .intercept('GET','/api/rest/v2/my-catalog?_sort=name&showCompleted=false').as('publicCatalog').wait('@publicCatalog')
            // Asserting and clicking main login button is present
            .get(LEDashboardPage.getPublicDashboardLoginBtn()).should('be.visible').click()
            //Asserting page elements, populating valid username to field and clicking Reset Password
            .get(LEDashboardPage.getForgotPasswordLink()).should('be.visible').click()
            .get(LEForgotPasswordPage.getEmailAddressTxtF()).should('be.visible')
            .get(LEForgotPasswordPage.getUsernameTxtF()).should('be.visible').type(users.learner04.LEARNER_04_USERNAME)
            .get(LEForgotPasswordPage.getResetPasswordBtn()).should('be.visible').click()
            //Verify Password Reset Form Sent Messages Success, navigate back to Dashboard Page
            .get(LEForgotPasswordPage.getForgotPasswordModuleform()).should('be.visible').contains(LEForgotPasswordPage.getCheckYourEmailInboxTitleTxt())
            .get(LEForgotPasswordPage.getForgotPasswordModuleform()).should('be.visible').contains(LEForgotPasswordPage.getPasswordResetLinkSentMsgTxt())
            .get(LEForgotPasswordPage.getReturnToMyDashboardLink()).should('be.visible').click()
            //Populating valid Email Address to field and clicking Reset Password
            .get(LEDashboardPage.getPublicDashboardLoginBtn()).should('be.visible').click()
            .get(LEDashboardPage.getForgotPasswordLink()).should('be.visible').click()
            cy.reload()
            .get(LEForgotPasswordPage.getEmailAddressTxtF()).should('be.visible').type(users.learner04.LEARNER_04_EMAIL)
            .get(LEForgotPasswordPage.getResetPasswordBtn()).should('be.visible').click()
             //Verify Password Reset Form Sent Messages Success
            .get(LEForgotPasswordPage.getForgotPasswordModuleform()).should('be.visible').contains(LEForgotPasswordPage.getCheckYourEmailInboxTitleTxt())
            .get(LEForgotPasswordPage.getForgotPasswordModuleform()).should('be.visible').contains(LEForgotPasswordPage.getPasswordResetLinkSentMsgTxt())
    })      
})