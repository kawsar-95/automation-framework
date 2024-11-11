import LELanguagesModal from '../../../../../../helpers/LE/pageObjects/Modals/LELanguages.modal'
import LEBottomToolBar from '../../../../../../helpers/LE/pageObjects/Nav/LEBottomToolBar'
import users from '../../../../../../cypress/fixtures/users.json'

describe('LE - Misc - Modals - Languages - Verify Modal', function () {

    beforeEach(() => {
        cy.visit("/")
        cy.get(LEBottomToolBar.getLanguageBtn()).should('be.visible').click()
    })

    it('Open Languages Modal, Verify Number of Languages', () => {
        cy.get(LELanguagesModal.getAllLanguageBtns()).should('have.length', LELanguagesModal.getTotalLanguages())
    })

    it('Verifying Some Contents of the Modal', () => {
        cy.get(LELanguagesModal.getLanguagesModalHeader()).should('be.visible')
        cy.get(LELanguagesModal.getAllLanguagesBtn()).contains('English').should('be.visible').should('contain.text', 'English')
        cy.get(LELanguagesModal.getAllLanguagesBtn()).contains('Français').should('be.visible').should('contain.text', 'Français')
        cy.get(LELanguagesModal.getAllLanguagesBtn()).contains('Italiano').should('be.visible').should('contain.text', 'Italiano')
        cy.get(LELanguagesModal.getAllLanguagesBtn()).contains('Bahasa Melayu').should('be.visible').should('contain.text', 'Bahasa Melayu')
    })

    it('Close Language Modal with X Button', () => {
        cy.get(LELanguagesModal.getXCloseBtn()).should('be.visible').click()
    })
})

describe('LE - Misc - Modals - Languages - Check Language on Public Dashboard', function () {
    beforeEach(() => {
        cy.reload()
        cy.visit("/")
    })

    it('Verifying French Translation', () => {
        LELanguagesModal.verifyLanguageTranslations('Français', 'Catalogue', 'Choisissez une langue')
    })

    it('Verifying Italian Translation', () => {
        LELanguagesModal.verifyLanguageTranslations('Italiano', 'Catalogo', 'Scegli la tua lingua')
    })

    it('Verifying Bahasa Melayu Translation', () => {
        LELanguagesModal.verifyLanguageTranslations('Bahasa Melayu', 'Katalog', 'Pilih bahasa anda')
    })
})

describe('LE - Misc - Modals - Languages - Check Language on Private Dashboard', function () {

    beforeEach(() => {
        cy.apiLoginWithSession(users.learner01.LEARNER_01_USERNAME, users.learner01.LEARNER_01_PASSWORD, "#/login")
    })

    it('Verifying French Translation', () => {
        LELanguagesModal.verifyLanguageTranslations('Français', 'Catalogue', 'Choisissez une langue')
    })

    it('Verifying Italian Translation', () => {
        LELanguagesModal.verifyLanguageTranslations('Italiano', 'Catalogo', 'Scegli la tua lingua')
    })

    it('Verifying Bahasa Melayu Translation', () => {
        LELanguagesModal.verifyLanguageTranslations('Bahasa Melayu', 'Katalog', 'Pilih bahasa anda')
    })
})