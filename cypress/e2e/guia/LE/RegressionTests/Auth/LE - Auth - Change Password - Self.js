import defaultTestData from '../../../../../fixtures/defaultTestData.json'
import leChangePasswordModal from '../../../../../../helpers/LE/pageObjects/Modals/LEChangePassword.modal'
import leDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import leProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'

let timestamp = leDashboardPage.getTimeStamp();
let username = "GUIA-Learner-CPWD - " + timestamp
let newPass = 'testing2'
let userID;

describe('LE - Auth - Change Password - Self', function () {

    before(function () {
        cy.createUser(void 0, username, ["Learner"], void 0)
    })

    after(function () {
        cy.deleteUser(userID)
    })

    it('Sign in with Learner and Change Password', () => {
        cy.apiLoginWithSession(username, defaultTestData.USER_PASSWORD)
        cy.get(leDashboardPage.getNavProfile()).click()
        cy.get(leProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentUrl) => {
            userID = currentUrl.slice(-36)
            cy.log(userID)
        })
        cy.go('back')
        cy.get(leProfilePage.getChangePasswordBtn()).click()
        cy.get(leChangePasswordModal.getCurrentPasswordTxtF()).type(defaultTestData.USER_PASSWORD)
        cy.get(leChangePasswordModal.getNewPasswordTxtF()).type(newPass)
        cy.get(leChangePasswordModal.getReEnterPasswordTxtF()).type(newPass)
        cy.get(leChangePasswordModal.getSavePasswordBtn()).click()
        leChangePasswordModal.getShortWait()
        cy.get(leChangePasswordModal.getPasswordSuccessMsg()).should('contain', leChangePasswordModal.getPasswordSuccessTxt())
    })

    it('Verify that User cannot sign in with Original password', () => {
        cy.visit("/")
        cy.get(leDashboardPage.getPublicDashboardLoginBtn()).click()
        //cy.contains('Login').click()
        cy.get(leDashboardPage.getUsernameTxtF()).type(username)
        cy.get(leDashboardPage.getPasswordTxtF()).type(defaultTestData.USER_PASSWORD)
        cy.get(leDashboardPage.getLoginBtn()).click();
        cy.get(leDashboardPage.getLoginForm()).should('contain.text', leDashboardPage.getLoginErrorMsg())
    })

    it('Verify that User can sign in with New password', () => {
        cy.learnerLoginThruDashboardPage(username, newPass)
        cy.get(leDashboardPage.getDashboardPageTitle()).should('have.text', "Welcome, " + defaultTestData.USER_LEARNER_FNAME + " " + defaultTestData.USER_LEARNER_LNAME)
    })
})
