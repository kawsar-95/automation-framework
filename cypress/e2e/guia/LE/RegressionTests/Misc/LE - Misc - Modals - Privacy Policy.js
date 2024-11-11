import LELangaugesModal from '../../../../../../helpers/LE/pageObjects/Modals/LELanguages.modal'
import LEPrivacyPolicyModal from '../../../../../../helpers/LE/pageObjects/Modals/LEPrivacyPolicy.modal'
import LEBottomToolBar from '../../../../../../helpers/LE/pageObjects/Nav/LEBottomToolBar'
import users from '../../../../../fixtures/users.json'

describe('LE - Misc - Modals - Privacy Policy - Public Dashboard', function () {

    beforeEach(() => {
        cy.visit("/")
        cy.get(LEBottomToolBar.getPrivacyPolicyBtn()).should('be.visible').click()
    })


    it('Verify English Privacy Policy', () => {
        cy.get(LEPrivacyPolicyModal.getPrivacyPolicy()).should('contain.text', LEPrivacyPolicyModal.getEnglishPrivacyPolicyTxt())
    })

    it('Close Privacy Policy Modal with X Button', () => {
        cy.get(LEPrivacyPolicyModal.getCloseXBtn()).should('be.visible').click()
    })

    it('Close Privacy Policy Modal with Close Button', () => {
        cy.get(LEPrivacyPolicyModal.getCloseXBtn()).should('be.visible').click()
    })
})

describe('LE - Misc - Modals - Privacy Policy - Private Dashboard', function () {
    beforeEach(() => {
        cy.apiLoginWithSession(users.learner01.LEARNER_01_USERNAME, users.learner01.LEARNER_01_PASSWORD, "#/login")
    })

    it('Verify English Privacy Policy', () => {
        cy.get(LEBottomToolBar.getPrivacyPolicyBtn()).click()
        cy.get(LEPrivacyPolicyModal.getPrivacyPolicy()).should('contain.text', LEPrivacyPolicyModal.getEnglishPrivacyPolicyTxt())
    })

    it('Verify French Privacy Policy', () => {
        LELangaugesModal.selectLanguage('Français')
        cy.get(LEBottomToolBar.getPrivacyPolicyBtn()).click()
        cy.get(LEPrivacyPolicyModal.getPrivacyPolicy()).should('contain.text', LEPrivacyPolicyModal.getFrenchPrivacyPolicyTxt())
    })

    it('Verify Italian  Privacy Policy', () => {
        LELangaugesModal.selectLanguage('Italiano')
        cy.get(LEBottomToolBar.getPrivacyPolicyBtn()).click()
        cy.get(LEPrivacyPolicyModal.getPrivacyPolicy()).should('contain.text', LEPrivacyPolicyModal.getItalianPrivacyPolicyTxt())
    })
})