import users from '../../../../../fixtures/users.json'
import miscData from '../../../../../fixtures/miscData.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEManageTemplatePrivateDashboardPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplatePrivateDashboardPage'
import LEManageTemplateTiles from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateTiles'
import LEEditTileModal from '../../../../../../helpers/LE/pageObjects/Modals/LEEditTile.modal'
import { dashboardDetails } from '../../../../../../helpers/TestData/Dashboard/dashboardDetails'


describe('LE - Welcome Tile Customization Welcome message language configuration', function () {

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
        
        cy.get(LEManageTemplateTiles.getWelcomeTileLanguageddown()).click({force: true})
        cy.get(LEManageTemplateTiles.getWelcomeTileLangselectlang()).contains(dashboardDetails.lang_english).click()
        cy.get(LEManageTemplateTiles.getWelcomeTileWelcomepane()).contains(dashboardDetails.body) 
        
        // cy.get(LEManageTemplateTiles.getWelcomeTileSavebutton()).contains('Save').click({force: true})   
        // cy.get(LEManageTemplateTiles.getWelcomeTileSavemessage()).contains('Changes Saved.').should('be.visible')

        cy.get(LEManageTemplateTiles.getWelcomeTileClosebutton()).click()
      })
    it('Verify Welcome Tile Text Language Customization', () => {
        //Edit Welcome Tile in the Tile container
        cy.get(LEManageTemplateTiles.getContainerByIndex(1)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName(dashboardDetails.body)
        })
           
        cy.get(LEManageTemplateTiles.getWelcomeTileLanguageddown()).click({force: true})
        cy.get(LEManageTemplateTiles.getWelcomeTileLangselectlang()).contains(dashboardDetails.lang_french).click()
        cy.get(LEManageTemplateTiles.getWelcomeTileWelcomepane()).contains(dashboardDetails.welcome_fr)  
        cy.get(LEManageTemplateTiles.getWelcomeTileSavebutton()).contains('Save').click({force: true})         
    })

})