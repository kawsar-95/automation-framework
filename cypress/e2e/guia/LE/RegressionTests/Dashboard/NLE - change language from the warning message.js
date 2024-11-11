import LELangaugesModal from '../../../../../../helpers/LE/pageObjects/Modals/LELanguages.modal'
import LEPrivacyPolicyModal from '../../../../../../helpers/LE/pageObjects/Modals/LEPrivacyPolicy.modal'
import LEBottomToolBar from '../../../../../../helpers/LE/pageObjects/Nav/LEBottomToolBar'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from "../../../../../../helpers/TestData/users/users"
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEAboutModal from '../../../../../../helpers/LE/pageObjects/Modals/LEAbout.modal'

describe('C7540 - AUT-778 - NLE - Change the language from the warning message area', function(){

    before(function () {
        cy.createUser(void 0, userDetails.username5, ["Learner"], void 0)
    })

    it('Change the language', function(){     
        cy.apiLoginWithSession(userDetails.username5, userDetails.validPassword)
        LELangaugesModal.selectLanguage('Français')
        cy.get(LEBottomToolBar.getPrivacyPolicyBtn()).click()
        cy.get(LEPrivacyPolicyModal.getPrivacyPolicy()).should('contain.text', LEPrivacyPolicyModal.getFrenchPrivacyPolicyTxt())
        cy.get(LEAboutModal.getCloseBtn()).click()
        LELangaugesModal.selectLanguage('English')
    })    
    
    after(function () {
        // Delete User
        cy.apiLoginWithSession(userDetails.username5, users.sysAdmin.admin_sys_01_password)
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })
})