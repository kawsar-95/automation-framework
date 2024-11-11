import { users } from '../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEManageTemplateMenu from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateMenu'
import LEManageTemplatePublicDashboardPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplatePublicDashboardPage'
import LEManageTemplateTiles from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateTiles'
import LEEditTileModal from '../../../../../../helpers/LE/pageObjects/Modals/LEEditTile.modal'

describe('LE - Nav - Customize Public Dashboard Tile Background', function () {

    beforeEach(() => {
        cy.viewport(1200, 850) //Enlarge viewport so tiles display text within them
        //sign in and navigate to manage template before each test
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        //Open content container
        
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Public Dashboard').should('be.visible').click()
        LEManageTemplatePublicDashboardPage.getManageTemplatePublicDashContainerByNameThenClick('Content')
        cy.url().should('include', '/#/learner-mgmt/public-dashboard')
    })

    it('Verify Background Image Can Be Customized', () => {
        //Edit Catalog Tile in the Tile container
        cy.get(LEManageTemplateTiles.getContainerByIndex(3)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName('Catalog')
        })
        LEEditTileModal. getTurnOnOffCustomizeTileThemeToggleBtn('true')

        //Verify custom background can be uploaded
        LEEditTileModal.getCustomizeTileBackground(miscData.resource_image_folder_path + miscData.billboard_01_filename)

        //Verify background image display can be set to either full screen or repeat
        cy.get(LEEditTileModal.getTileBackgroundDisplayRadioBtn()).contains('Repeat').click()
        cy.get(LEEditTileModal.getTileBackgroundPreview()).should('have.attr', 'style').should('include','background-size: auto;')
        cy.get(LEEditTileModal.getTileBackgroundDisplayRadioBtn()).contains('Full Screen').click()
        cy.get(LEEditTileModal.getTileBackgroundPreview()).should('have.attr', 'style').should('include','background-size: cover;')

        //Verify all background image alignments can be set
        for (let i = 0; i < miscData.background_image_alignments[0].length; i++ ) {
            let prefix = miscData.background_image_alignments[0][i];
                for (let j = 0; j < miscData.background_image_alignments[0].length; j++) {
                    cy.get(LEEditTileModal.getTileBackgroundAlignmentBtn(`${prefix} ${miscData.background_image_alignments[1][j]}`)).click()
                    cy.get(LEEditTileModal.getTileBackgroundPreview()).should('have.attr', 'style')
                        .should('include',`background-position: ${miscData.background_image_alignments[1][j].toLowerCase()} ${prefix.toLowerCase()};`)
                }
        }

        //Verify background image opacity can be set (ex. 50%)
        LEEditTileModal.getSetTileBackgroundOpacity('50')
        cy.get(LEEditTileModal.getTileBackgroundPreview()).should('have.attr', 'style')
            .should('include','background-image: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5))')

        //Save Changes
        cy.get(LEEditTileModal.getSaveBtn()).click({force:true})
        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()

        //Go to public dashboard and verify only the catalog tile's background has been updated
        cy.logoutLearner()
        cy.get(LEDashboardPage.getHeaderLogoBtn()).click()

        //Verify image name, display, alignment, opacity
        cy.get(LEDashboardPage.getTileName()).contains('Catalog').parents(LEDashboardPage.getTile()).should('have.attr', 'style')
            .should('include','billboard (tasty)').and('include', 'background-image: linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5))')
                .and('include', 'background-size: cover').and('include', 'background-position: right bottom')
      
        cy.get(LEDashboardPage.getTileName()).contains('Enrollment Key').parents(LEDashboardPage.getTile()).should('have.attr', 'style').and('include','background-color: rgb(255, 255, 255);')
    })

    it('Verify Tile Background Returns to Default When Image is Deleted', () => {
        //Edit Catalog Tile in the Tile container
        cy.get(LEManageTemplateTiles.getContainerByIndex(3)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName('Catalog')
        })

        //Delete uploaded background image
        cy.get(LEEditTileModal.getTileThemeModuleLabel()).contains(`Customize Tile Background`).parents(LEEditTileModal.getTileBackgroundContainer()).within(() => {
            cy.get(LEEditTileModal.getDeleteImageBtn()).click()
        })
        
        //Verify preview tile has default background
        cy.get(LEEditTileModal.getTileBackgroundPreview()).should('have.attr', 'style').should('not.include', 'url')

        //Save Changes
        cy.get(LEEditTileModal.getSaveBtn()).click({force:true})
        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()

        //Go to dashboard and verify catalog tile background has been reset to default
        cy.logoutLearner()
        cy.get(LEDashboardPage.getHeaderLogoBtn()).click()
        cy.get(LEDashboardPage.getTileName()).contains('Catalog').parents(LEDashboardPage.getTile()).should('have.attr', 'style').should('not.include', 'url')

        //Re-upload image for next test
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Public Dashboard').should('be.visible').click()
        LEManageTemplatePublicDashboardPage.getManageTemplatePublicDashContainerByNameThenClick('Content')
        cy.url().should('include', '/#/learner-mgmt/public-dashboard')
        cy.get(LEManageTemplateTiles.getContainerByIndex(3)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName('Catalog')
        })
        LEEditTileModal.getCustomizeTileBackground(miscData.resource_image_folder_path + miscData.billboard_01_filename)
        cy.get(LEEditTileModal.getSaveBtn()).click({force:true})
        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()
    })

    it('Verify Tile Background Returns to Default When Customize Toggle is Turned Off', () => {
        //Edit catalog Tile in the Tile container
        cy.get(LEManageTemplateTiles.getContainerByIndex(3)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName('Catalog')
        })

        //Turn Customize Tile Toggle OFF
        LEEditTileModal. getTurnOnOffCustomizeTileThemeToggleBtn('false')
        //Save Changes
        cy.get(LEEditTileModal.getSaveBtn()).click({force:true})
        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()

        //Go to dashboard and verify catalog tile has been reset to default
        cy.logoutLearner()
        cy.get(LEDashboardPage.getHeaderLogoBtn()).click()
        cy.get(LEDashboardPage.getTileName()).contains('Catalog').parents(LEDashboardPage.getTile()).should('have.attr', 'style').and('include','background-color: rgb(255, 255, 255);')
    })

    it('Verify All Applicable Tiles Backgrounds Can Be Customized', () => {
        for (let i = 0; i < miscData.public_tile_names.length; i++) {
            //Open tile edit modal
            cy.get(LEManageTemplateTiles.getContainerByIndex(3)).within(() => {
                LEManageTemplateTiles.getTileEditBtnByTileName(miscData.public_tile_names[i])
            })

            //Turn Customize Tile Toggle ON
            LEEditTileModal. getTurnOnOffCustomizeTileThemeToggleBtn('true')

            //Verify Customize Tile Background Option exists
            cy.get(LEEditTileModal.getTileBackgroundContainer()).contains(`Customize Tile Background`).should('exist')
            
            //Close Edit modal
            cy.get(LEEditTileModal.getModalCloseBtn()).click()
        }
    })
})