import users from '../../../../../fixtures/users.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'

describe('LE - Nav - Resize Dashboard Tiles on Mobile Device', function () {

    beforeEach(() => {
        //sign in with learner before each test
        cy.apiLoginWithSession(users.learner01.LEARNER_01_USERNAME, users.learner01.LEARNER_01_PASSWORD)
    })

    it('Verify Smallest Tile Size', () => {
        //Set viewport size and wait for tiles to resize
        cy.viewport(341, 700) // < 341px width will resize tiles to medium ones in a single column

        //Verify smallest tile size is 132x92 px
        cy.get(LEDashboardPage.getTileName()).contains('Resume').parents(LEDashboardPage.getTile()).invoke('css', 'width').should('eq', '132px')
        cy.get(LEDashboardPage.getTileName()).contains('Resume').parents(LEDashboardPage.getTile()).invoke('css', 'height').should('eq', '92px')

        //Verify description text is hidden when tile is small
        cy.get(LEDashboardPage.getTileName()).contains('Resume').parents(LEDashboardPage.getTile()).within(() => {
            cy.get(LEDashboardPage.getTileDescriptionTxt()).should('not.exist')
        })

        //Verify tile title appears below the tile
        cy.get(LEDashboardPage.getSmallTileName()).contains('Resume').should('be.visible')
    })

    it('Verify Small Tiles on Mobile Device When Tiles are in >1 Column', () => {
        //Set viewport size and wait for tiles to resize
        cy.viewport('iphone-x')

        //Verify description text is hidden when tile is small
        cy.get(LEDashboardPage.getTileName()).contains('Resume').parents(LEDashboardPage.getTile()).within(() => {
            cy.get(LEDashboardPage.getTileDescriptionTxt()).should('not.exist')
        })

        //Verify tile title appears below the tile
        cy.get(LEDashboardPage.getSmallTileName()).contains('Resume').should('be.visible')

        //Verify the title uses the DashboardContainerTitle theme color
        cy.get(LEDashboardPage.getSmallTileName()).contains('Resume').invoke('css', 'color').should('eq', 'rgb(69, 73, 76)')
    })

    it('Verify Medium Tiles on Mobile Device When Tiles are in Single Column', () => {
        //Set viewport size and wait for tiles to resize
        cy.viewport('iphone-5')

        //Verify description text is visible when tile is medium or larger
        cy.get(LEDashboardPage.getTileNameResume()).contains('Resume').parents(LEDashboardPage.getTile()).within(() => {
            cy.get(LEDashboardPage.getTileDescriptionTxt()).should('not.exist')
        })

        //Verify title appears within the tile when the tile is medium or larger
        cy.get(LEDashboardPage.getSmallTileName()).should('not.exist')
        cy.get(LEDashboardPage.getTileNameResume()).contains('Resume').should('be.visible')
    })
})