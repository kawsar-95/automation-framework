import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import DefaultTestData from '../../../../../fixtures/defaultTestData.json'
import LEInactivityTimeoutModal from '../../../../../../helpers/LE/pageObjects/Modals/LEInactivityTimeout.modal'

describe('LE - Auth - Inactivity Timeout', function () {
    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0);
    })



    after(function () {
        //Cleanup - delete learner

        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })

    })

    beforeEach(() => {
        cy.apiLoginWithSession(userDetails.username, DefaultTestData.USER_PASSWORD)
        cy.get(LEDashboardPage.getDashboardPageTitle()).should('have.text', "Welcome, " + DefaultTestData.USER_LEARNER_FNAME + " " + DefaultTestData.USER_LEARNER_LNAME)
    })



    it('Verify Logout Deeplink logs a user out successfully', () => {
        cy.visit("/#/logout")
        cy.get(LEDashboardPage.getPublicDashboardLoginBtn()).should('be.visible')
        cy.apiLoginWithSession(userDetails.username, DefaultTestData.USER_PASSWORD)

    })

})