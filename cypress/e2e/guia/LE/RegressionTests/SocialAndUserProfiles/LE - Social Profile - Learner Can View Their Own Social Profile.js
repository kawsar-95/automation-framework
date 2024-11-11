import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESocialProfilePage from '../../../../../../helpers/LE/pageObjects/User/LESocialProfilePage'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('LE - Social Profile - Learner Can View Their Own Social Profile', function(){

    before(function () {
        cy.apiLoginWithSession(users.learnerTransCert.learner_transcert_username, users.learnerTransCert.learner_transcert_password)})

    it('Verify learner can view their social profile', () => {      
        cy
            .get(LEDashboardPage.getDashboardPageTitle()).should('have.text', "Welcome, " + users.learnerTransCert.learner_transcert_fname + " " + users.learnerTransCert.learner_transcert_lname)
            .get(LEDashboardPage.getNavProfile()).click()
            .get(LEProfilePage.getViewSocialProfileBtn()).should('be.visible').click().wait(2000)
            .get(LESocialProfilePage.getSocialProfilePreviewBarDescriptionMsg()).should('have.text', LESocialProfilePage.getSocialProfilePreviewBarDescriptionTxt())
            .get(LESocialProfilePage.getSocialProfilePreviewBackBtn()).should('be.visible')
            .get(LESocialProfilePage.getSocialProfileHeaderName()).should('have.text', users.learnerTransCert.learner_transcert_fname + " " + users.learnerTransCert.learner_transcert_lname)
            .get(LESocialProfilePage.getSocialProfileBadgesModuleTitle())
            //Verifying the Number of Each Module Displayed is the Amount on the Page
            LESocialProfilePage.verifySocialProfileItemsInTable('Certificate Title', 'Certificates')
            
            LESocialProfilePage.verifySocialProfileCourses('Courses')
    })
})