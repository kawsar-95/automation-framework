import LEAboutModal from '../../../../../../helpers/LE/pageObjects/Modals/LEAbout.modal'
import LEBottomToolBar from '../../../../../../helpers/LE/pageObjects/Nav/LEBottomToolBar'

describe('LE - Misc - Modals - About', function () {

    beforeEach(() => {
        cy.visit("/")
        cy.get(LEBottomToolBar.getAboutBtn()).should('be.visible').click()
    })

    it('Open About Modal & Verify Version is Displayed', () => {
        cy.get(LEAboutModal.getAboutBody()).should('be.visible')
        cy.get(LEAboutModal.getVersion()).should('contain.text', LEAboutModal.getVersionTxt())
    })

    it('Verify About Modal closes with X button click', () => {
        cy.get(LEAboutModal.getCloseXBtn()).should('be.visible').click()
    })

    it('Verfiy About Modal closes with close button click', () => {
        cy.get(LEAboutModal.getCloseBtn()).contains('Close').should('be.visible').click()
    })

    it('Verify About Modal closes with backdrop click', () => {
        cy.get(LEAboutModal.getBackdrop()).click('topRight')
    })


})