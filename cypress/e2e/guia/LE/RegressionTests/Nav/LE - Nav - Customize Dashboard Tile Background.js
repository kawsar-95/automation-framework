import users from '../../../../../fixtures/users.json'
import miscData from '../../../../../fixtures/miscData.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEManageTemplatePrivateDashboardPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplatePrivateDashboardPage'
import LEManageTemplateTiles from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateTiles'
import LEEditTileModal from '../../../../../../helpers/LE/pageObjects/Modals/LEEditTile.modal'

let tileNames = ['My Courses', 'Messages', 'Resources', 'Catalog', 'Polls & Surveys', 'FAQs', 'Latest News', 
'Enrollment Key', 'Facebook', 'Twitter', 'External Training', 'Leaderboards', 'Collaborations Activity'];
let alignments = [['Top', 'Center', 'Bottom'], ['Left', 'Center', 'Right']];
let a = 0

describe('LE - Nav - Customize Dashboard Tile Background', function () {

    beforeEach(() => {
        cy.viewport(1200, 850) // Enlarge viewport so tiles display text within them
        
        // Sign in and navigate to manage template before each test
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')        
        // Open content container
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')
    })

    it('Verify Background Image Can Be Customized', () => {        
        // Edit Resume Tile in the Tile container
        cy.get(LEManageTemplateTiles.getContainerByIndex(2)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName('Resume')
        })
        LEEditTileModal.getTurnOnOffCustomizeTileThemeToggleBtn('true')

        // Verify custom background can be uploaded
        LEEditTileModal.getCustomizeTileBackground(miscData.RESOURCE_IMAGE_FOLDER_PATH + 'billboard (tasty).jpg')

        // Verify background image display can be set to either full screen or repeat
        cy.get(LEEditTileModal.getTileBackgroundDisplayRadioBtn()).contains('Repeat').click()
        
        // Asserting  Full Screen and click
        cy.get(LEEditTileModal.getTileBackgroundDisplayRadioBtn()).contains('Full Screen').click()
        
        // Verify all background image alignments can be set
        for (let i = 0; i < alignments[0].length; i++ ) {
            let prefix = alignments[0][i];
            for (let j = 0; j < alignments[1].length; j++) {
                cy.get(LEEditTileModal.getTileBackgroundAlignmentBtn(`${prefix} ${alignments[1][j]}`)).click()
                cy.get(LEEditTileModal.getBackgroundImageAlignmentSquare(), {timeout: 1000}).eq(a).should('have.attr', 'class')
                .should('include',`icon-arrow-align-${prefix.toLowerCase()}-${alignments[1][j].toLowerCase()} alignment-module__selected_button`)
                a++
            }
        }

        // Verify background image opacity can be set (ex. 60%)
        LEEditTileModal.getSetTileBackgroundOpacity(60)
        cy.get(LEEditTileModal.getBackgroundImagePercentage()).should('contain', '60%')

        // Save Changes
        cy.get(LEEditTileModal.getSaveBtn()).click({force:true})
        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()

        // Go to dashboard and verify only the resume tile's background has been updated
        cy.get(LEDashboardPage.getHeaderLogoBtn(), {timeout: 1000}).click()

        // Takes a second for the styling to update Verify the style
        cy.get(LEDashboardPage.getResumeTile(), {timeout: 10000}).parents(LEDashboardPage.getTile(), {timeout: 10000}).should('have.attr', 'style')
        .should('exist', 'background-size: cover')
       
    })

    it('Verify Tile Background Returns to Default When Image is Deleted', () => {
        
        // Edit Resume Tile in the Tile container
        cy.get(LEManageTemplateTiles.getContainerByIndex(2)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName('Resume')
        })

        // Delete uploaded background image
        cy.get(LEEditTileModal.getTileThemeModuleLabel()).contains(`Customize Tile Background`).parents(LEEditTileModal.getTileBackgroundContainer()).within(() => {
            cy.get(LEEditTileModal.getDeleteImageBtn()).click()
        })
        
        // Verify preview tile has default background
        cy.get(LEEditTileModal.getTileBackgroundUploadAFileContainer()).eq(1).should('have.attr', 'style').should('not.include', 'url')

        // Save Changes
        cy.get(LEEditTileModal.getSaveBtn()).click({force:true})
        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()

        // Go to dashboard and verify resume tile background has been reset to default
        cy.get(LEDashboardPage.getHeaderLogoBtn(), {timeout: 10000}).click()

        cy.get(LEDashboardPage.getResumeTile(), {timeout: 10000}).parents(LEDashboardPage.getTile()).should('have.attr', 'style').should('not.include', 'url')

        // Re-upload image for next test
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')
        cy.get(LEManageTemplateTiles.getContainerByIndex(2)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName('Resume')
        })
        LEEditTileModal.getCustomizeTileBackground(miscData.RESOURCE_IMAGE_FOLDER_PATH + 'billboard (tasty).jpg')
        cy.get(LEEditTileModal.getSaveBtn()).click({force:true})
        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()
    })

    it('Verify Tile Background Returns to Default When Customize Toggle is Turned Off', () => {
        // Edit Resume Tile in the Tile container
        cy.get(LEManageTemplateTiles.getContainerByIndex(2)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName('Resume')
        })

        // Turn Customize Tile Toggle OFF
        LEEditTileModal.getTurnOnOffCustomizeTileThemeToggleBtn('false')
        
        // Save Changes
        cy.get(LEEditTileModal.getSaveBtn()).click({force:true})
        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()

        // Go to dashboard and verify resume tile has been reset to default
        cy.get(LEDashboardPage.getHeaderLogoBtn(), {timeout: 10000}).click()

        cy.get(LEDashboardPage.getResumeTile(), {timeout: 10000}).parents(LEDashboardPage.getTile()).should('have.attr', 'style').should('not.include', 'url')
    })

    it('Verify All Applicable Tiles Backgrounds Can Be Customized', () => {
        for (let i = 0; i < tileNames.length; i++) {
            
            // Open tile edit modal
            cy.get(LEManageTemplateTiles.getContainerByIndex(2)).within(() => {
                LEManageTemplateTiles.getTileEditBtnByTileName(tileNames[i])
            })

            // Turn Customize Tile Toggle ON
            cy.get(LEEditTileModal.getCustomizeTileToggle()).click()

            // Verify Customize Tile Background Option exists
            cy.get(LEEditTileModal.getTileBackgroundContainer()).contains(`Customize Tile Background`).should('exist')
            
            // Close Edit modal
            cy.get(LEEditTileModal.getModalCloseBtn()).click()
        }
    })
})