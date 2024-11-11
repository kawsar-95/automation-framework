import users from '../../../../../fixtures/users.json'
import miscData from '../../../../../fixtures/miscData.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEManageTemplatePrivateDashboardPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplatePrivateDashboardPage'
import LEManageTemplateTiles from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateTiles'
import LEEditTileModal from '../../../../../../helpers/LE/pageObjects/Modals/LEEditTile.modal'

let tileNames = ['My Courses', 'Messages', 'Resources', 'Catalog', 'Polls & Surveys', 'FAQs', 'Latest News', 
'Enrollment Key', 'Facebook', 'Twitter', 'External Training', 'Leaderboards', 'Collaborations Activity'];

describe('LE - Nav - Customize Dashboard Tile Icon', function () {

    beforeEach(() => {
        cy.viewport(1200, 850) //Enlarge viewport so tiles display text within them
        //sign in and navigate to manage template before each test
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        //Open content container
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')
    })

    after(()=>{
        cy.get(LEManageTemplateTiles.getContainerByIndex(2)).within(() => {
            LEManageTemplateTiles.getTileDeleteBtnByTileNam(tileNames[10])
        })
    })

    it('Verify Welcome Tile Icon Cannot Be Customized', () => {
        //Edit Welcome Tile in the Tile container
        cy.get(LEManageTemplateTiles.getContainerByIndex(1)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName('Welcome')
        })

        //Verify Option to upload icon does not exist
        cy.get(LEEditTileModal.getTileThemeModuleLabel()).should('not.exist')
    })

    it('Verify Tile Icon Can Be Customized', () => {
        //Edit Resume Tile in the Tile container
        cy.get(LEManageTemplateTiles.getContainerByIndex(2)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName('Resume')
        })
        LEEditTileModal. getTurnOnOffCustomizeTileThemeToggleBtn('true')

        //Verify custom icon can be uploaded
        LEEditTileModal.getCustomizeTileIcon(miscData.RESOURCE_IMAGE_FOLDER_PATH + 'umbrella icon.png')

        //Verify Preview tile has been updated with uploaded image
        cy.get(LEEditTileModal.getCustomizeTileIconUploadAFileField()).should('have.attr', 'style').should('include','url')

        //Save Changes
        cy.get(LEEditTileModal.getSaveBtn()).click({force:true})
        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()

        //Go to dashboard and verify only the resume tile's icon has been updated
        cy.get(LEDashboardPage.getHeaderLogoBtn()).click()

        cy.get(LEDashboardPage.getResumeTile()).parents(LEDashboardPage.getTile()).within(() => {
            cy.get(LEDashboardPage.getResumeTileProgressBarIcon()).find('img').should('have.attr', 'src').should('include','umbrella icon')
        })
        cy.get(LEDashboardPage.getTileName()).contains('Inbox').parents(LEDashboardPage.getTile()).within(() => {
            cy.get(LEDashboardPage.getTileIcon()).should('not.have.html', 'img')
        })
    })

    it('Verify Tile Icon Returns to Default When Image is Deleted', () => {
        //Edit Resume Tile in the Tile container
        cy.get(LEManageTemplateTiles.getContainerByIndex(2)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName('Resume')
        })

        //Delete uploaded icon
        cy.get(LEEditTileModal.getTileThemeModuleLabel()).contains(`Customize Tile Icon`).parents(LEEditTileModal.getTileIconContainer()).within(() => {
            cy.get(LEEditTileModal.getDeleteImageBtn()).click()
        })
        
        //Verify preview tile has default icon
        cy.get(LEEditTileModal.getTileBackgroundUploadAFileContainer()).eq(0).should('have.attr', 'style').should('not.include','url')

        //Save Changes
        cy.get(LEEditTileModal.getSaveBtn()).click({force:true})
        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()

        //Go to dashboard and verify resume tile icon has been reset to default
        cy.get(LEDashboardPage.getHeaderLogoBtn()).click()
        cy.get(LEDashboardPage.getResumeTile()).parents(LEDashboardPage.getTile()).within(() => {
            cy.get(LEDashboardPage.getResumeTileIcon()).should('not.have.html', 'img')
        })

        //Re-upload image for next test
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')
        cy.get(LEManageTemplateTiles.getContainerByIndex(2)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName('Resume')
        })
        LEEditTileModal.getCustomizeTileIcon(miscData.RESOURCE_IMAGE_FOLDER_PATH + 'umbrella icon.png')
        cy.get(LEEditTileModal.getSaveBtn()).click({force:true})
        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()
    })

    it('Verify Tile Icon Returns to Default When Customize Toggle is Turned Off', () => {
        //Edit Resume Tile in the Tile container
        cy.get(LEManageTemplateTiles.getContainerByIndex(2)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName('Resume')
        })

        //Turn Customize Tile Toggle OFF
        LEEditTileModal.getTurnOnOffCustomizeTileThemeToggleBtn('false')
        //Save Changes
        cy.get(LEEditTileModal.getSaveBtn()).click({force:true})
        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()

        //Go to dashboard and verify resume tile has been reset to default
        cy.get(LEDashboardPage.getHeaderLogoBtn()).click()
        cy.get(LEDashboardPage.getResumeTile()).parents(LEDashboardPage.getTile()).within(() => {
            cy.get(LEDashboardPage.getResumeTileIcon()).should('not.have.html', 'img')
        })
    })

    it('Verify All Applicable Tiles Icons Can Be Customized', () => {

        cy.get(LEManageTemplateTiles.getContainerByIndex(2)).within(() => {
            cy.get(LEManageTemplateTiles.getAddTileButton()).eq(0).click()
                    cy.get(LEManageTemplateTiles.getAddTileName()).contains(tileNames[10]).click()
                    cy.get(LEManageTemplateTiles.getSaveBtn()).click()
        })


        for (let i = 0; i < tileNames.length; i++) {
            //Open tile edit modal
            cy.get(LEManageTemplateTiles.getContainerByIndex(2)).within(() => {
                LEManageTemplateTiles.getTileEditBtnByTileName(tileNames[i])
            })

            //Turn Customize Tile Toggle ON
            cy.get(LEEditTileModal.getCustomizeTileToggle()).click()

            //Verify Customize Tile Icon Option exists
            cy.get(LEEditTileModal.getTileIconContainer()).contains(`Customize Tile Icon`).should('exist')
            
            //Close Edit modal
            cy.get(LEEditTileModal.getModalCloseBtn()).click()
        }
    })
})