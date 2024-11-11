import users from '../../../../../fixtures/users.json'
import miscData from '../../../../../fixtures/miscData.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEManageTemplatePrivateDashboardPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplatePrivateDashboardPage'
import LEManageTemplateTiles from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateTiles'
import LEEditTileModal from '../../../../../../helpers/LE/pageObjects/Modals/LEEditTile.modal'
import { dashboardDetails } from '../../../../../../helpers/TestData/Dashboard/dashboardDetails'

describe('LE - Welcome Tile Verify Options', function () {

    beforeEach(() => {
        cy.viewport(1200, 850) //Enlarge viewport so tiles display text within them
        //sign in and navigate to manage template before each test
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        //Open content container
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')
    })
    after(function () {
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        //Open content container
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')

        //Edit Welcome Tile in the Tile container
        cy.get(LEManageTemplateTiles.getContainerByIndex(1)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName(dashboardDetails.body)
        })
        
        //clear the existing data set the height input default to 50 
        cy.get(LEManageTemplateTiles.getWelcomeTileHeightInput()).clear()
        cy.get(LEManageTemplateTiles.getWelcomeTileHeightInput()).type(dashboardDetails.height_default)
        
        //clear the existing data set the URL input to empty
        cy.get(LEManageTemplateTiles.getWelcomeTileURLInput()).clear()
        cy.get(LEManageTemplateTiles.getWelcomeTileDdown()).select('New Window')

        //sets default view to tablet
        cy.get(LEManageTemplateTiles.getWelcomeTileTabletViewIcon()).should('be.visible')
        cy.get(LEManageTemplateTiles.getWelcomeTileSavebutton()).contains('Save').click({force: true})
        cy.get(LEManageTemplateTiles.getWelcomeTileSavemessage()).contains('Changes Saved.').should('be.visible')
        
        //close the welcome tile edit page
        cy.get(LEManageTemplateTiles.getWelcomeTileClosebutton()).click()

      })

    it('Verify all the fields in options tab', () => {
        //Edit Welcome Tile in the Tile container
        cy.get(LEManageTemplateTiles.getContainerByIndex(1)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName(dashboardDetails.body)
        })

        // Welcome Tile Height Slider visibility verification
        cy.get(LEManageTemplateTiles.getWelcomeTileHeightSlider()).should('be.visible')
        
        //Welcome Tile Height Slider input visibility
        cy.get(LEManageTemplateTiles.getWelcomeTileHeightInput()).should('be.visible')
        cy.get(LEManageTemplateTiles.getWelcomeTileHeightInput()).clear().type(dashboardDetails.height_for_test)

        //URL input visibility and type any of the URL
        cy.get(LEManageTemplateTiles.getWelcomeTileURLInput()).should('be.visible')
        cy.get(LEManageTemplateTiles.getWelcomeTileURLInput()).clear().type(dashboardDetails.url_for_test)
                
        //Select pageopens to New Window
        cy.get(LEManageTemplateTiles.getWelcomeTileDdown()).select('New Window')

        // welcome tile mobile view selection and visibility
        cy.get(LEManageTemplateTiles.getWelcomeTileMobileViewIcon()).should('be.visible').click()

        // welcome tile Tablet view selection and visibility
        cy.get(LEManageTemplateTiles.getWelcomeTileTabletViewIcon()).should('be.visible').click()
      
        // welcome tile Desktop view selection and visibility
        cy.get(LEManageTemplateTiles.getWelcomeTileDesktopViewIcon()).should('be.visible').click()

        //Save the changes 
        cy.get(LEManageTemplateTiles.getWelcomeTileSavebutton()).contains('Save').click({force: true})

    })
})