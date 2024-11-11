import defaultTestData from '../../../../../fixtures/defaultTestData.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEProfileEditModal from '../../../../../../helpers/LE/pageObjects/Modals/LEProfileEdit.modal'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import {employmentDetailsSectionFields, generalSectionFieldNames}  from '../../../../../../helpers/TestData/users/UserDetails'

let timestamp = LEDashboardPage.getTimeStamp();
let username = "GUIA-Learner-PE - " + timestamp
let userID;

describe('LE - Misc - Modals - Profile Edit', function () {

    before(function () {
        cy.createUser(void 0, username, ["Learner"], void 0)
    })
    
    beforeEach(function () {
        cy.apiLoginWithSession(username, defaultTestData.USER_PASSWORD)
    })

    after(function () {
        cy.deleteUser(userID)
    })

    it('Sign in with Learner and Change Middle Name', () => {
        cy.get(LEDashboardPage.getDashboardPageTitle()).should('contain', "Welcome, " + defaultTestData.USER_LEARNER_FNAME + " " + defaultTestData.USER_LEARNER_LNAME)
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(LEProfilePage.getEditProfileBtn()).click()
        cy.get(LEProfileEditModal.getMiddleNameTxtF()).type(generalSectionFieldNames.middleName)
        cy.get(LEProfileEditModal.getJobTitleTxtF()).type(employmentDetailsSectionFields.jobTitle)
        cy.get(LEProfileEditModal.getSaveProfileBtn()).click()
        cy.get(LEProfileEditModal.getProfileEditSuccessMsg()).should('have.text', LEProfileEditModal.getProfileEditSuccessTxt())
        cy.get(LEProfileEditModal.getCloseDialog()).click()
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentUrl) => {
            userID = currentUrl.slice(48)
        })
    })

    it('Verify Updated Profile', () => {
        cy.get(LEDashboardPage.getDashboardPageTitle()).should('contain', "Welcome, " + defaultTestData.USER_LEARNER_FNAME + " " + defaultTestData.USER_LEARNER_LNAME)
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(LEProfilePage.getEditProfileBtn()).click()
        cy.get(LEProfileEditModal.getMiddleNameTxtF()).should('have.value', generalSectionFieldNames.middleName)
        cy.get(LEProfileEditModal.getCancelBtn()).click()
    });
})
