import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEEnrollmentKeyModal from '../../../../../../../helpers/LE/pageObjects/Modals/LEEnrollmentKeyModal'
import defaultTestData from '../../../../../../fixtures/defaultTestData.json'

describe('LE - E-Comm - Signup - EKey Form - Invalid', function(){

    beforeEach(() => {
        cy.visit("/#/public-dashboard")
        cy.get(LEDashboardPage.getPublicDashboardSignupBtn()).click()
    })

    it('Enter Non-Existent E-Key, Verify Error Message', () => {     
        cy.get(LEEnrollmentKeyModal.getKeyNameTxtF()).type('NON-EXISTENT-E-KEY')
        //VShort wait is required here as bot protection will detect submissions <900ms
        //and will return an incorrect error message (Invalid Key)
        LEDashboardPage.getVShortWait()
        cy.get(LEEnrollmentKeyModal.getSignupBtn()).click()
        .get(LEEnrollmentKeyModal.getErrorMsg()).should('contain.text', 'Enrollment key not found.')
    }) 

    it('Enter Expired E-Key, Verify Error Message', () => {     
        cy.get(LEEnrollmentKeyModal.getKeyNameTxtF()).type(defaultTestData.E_KEY_EXPIRED)
        LEDashboardPage.getVShortWait()
        cy.get(LEEnrollmentKeyModal.getSignupBtn()).click()
        cy.get(LEEnrollmentKeyModal.getErrorMsg()).should('contain.text', 'Enrollment key has expired.')
    })

    it('Enter Depleted E-Key, Verify Error Message', () => {     
        cy.get(LEEnrollmentKeyModal.getKeyNameTxtF()).type(defaultTestData.E_KEY_DEPLETED)
        LEDashboardPage.getVShortWait()
        cy.get(LEEnrollmentKeyModal.getSignupBtn()).click()
        cy.get(LEEnrollmentKeyModal.getErrorMsg()).should('contain.text', 'Enrollment key used up.')
    })
})