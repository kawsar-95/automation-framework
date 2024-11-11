import LEBottomToolBar from '../../../../../../helpers/LE/pageObjects/Nav/LEBottomToolBar'
import LEAboutModal from '../../../../../../helpers/LE/pageObjects/Modals/LEAbout.modal'

describe('LE - Misc - Get App Version', function () {
    it('Getting App Version from the About Icon', () => {
        cy 
            .visit("/")

            .get(LEBottomToolBar.getAboutBtn(), {timeout: 25000}).should('be.visible').click()
            .get(LEAboutModal.getVersion(), {timeout: 25000}).then(($p) => {cy.addContext(`App Version: ${$p.text()}`)})
    })
})