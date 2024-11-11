import users from '../../../../../fixtures/users.json'
import miscData from '../../../../../fixtures/miscData.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
//import LEManageTemplatePrivateDashboardPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplatePrivateDashboardPage'
import LEManageTemplatePublicDashboardPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplatePublicDashboardPage'
import LEManageTemplateTiles from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateTiles'
import LEManageTemplateMenu from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateMenu'
import LEEditTileModal from '../../../../../../helpers/LE/pageObjects/Modals/LEEditTile.modal'
import { dashboardDetails } from '../../../../../../helpers/TestData/Dashboard/dashboardDetails'

describe('LE - Welcome Tile Private Dashboard Text Options customization', function () {

    beforeEach(() => {
        cy.viewport(1200, 850) //Enlarge viewport so tiles display text within them
        //sign in and navigate to manage template before each test
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, "#/login")
        cy.wait(3000)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        //Open content container
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Public Dashboard').should('be.visible').click()
        LEManageTemplatePublicDashboardPage.getManageTemplatePublicDashContainerByNameThenClick('Content')
        cy.url().should('include', '/#/learner-mgmt/public-dashboard')
    })
    after(function () {
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, "#/login")
        cy.wait(3000)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        
        //Open content container
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Public Dashboard').should('be.visible').click()
        LEManageTemplatePublicDashboardPage.getManageTemplatePublicDashContainerByNameThenClick('Content')
        
        //Edit Welcome Tile in the Tile container
        cy.get(LEManageTemplateTiles.getContainerByIndex(1)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName(dashboardDetails.body)
        })
        
        //Navigate to Welcome Text configuration
        cy.get(LEManageTemplateTiles.getWelcomeTilesidemenu()).contains(' Text').click()
        //Clears the existing text message
        cy.get(LEManageTemplateTiles.getWelcomeTileWelcomeMessageInput()).clear()
        //Save the Welcome Text configuration
        cy.get(LEManageTemplateTiles.getWelcomeTileSavebutton()).contains('Save').click({force: true})   
        cy.get(LEManageTemplateTiles.getWelcomeTileSavemessage()).contains('Changes Saved.').should('be.visible')

        cy.get(LEManageTemplateTiles.getWelcomeTileClosebutton()).click()

      })

    it('Verify Welcome Tile Text Customization', () => {
        //Edit Welcome Tile in the Tile container
        cy.get(LEManageTemplateTiles.getContainerByIndex(1)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName('Welcome')
        })
        
        //Navigate to Welcome Text configuration
        cy.get(LEManageTemplateTiles.getWelcomeTilesidemenu()).contains(' Text').click()
        //Clears the existing text message
        cy.get(LEManageTemplateTiles.getWelcomeTileWelcomeMessageInput()).clear()
        cy.get(LEManageTemplateTiles.getWelcomeTileWelcomeMessageInput()).type(dashboardDetails.welcome_message)
        //Verify options on text tab
        cy.get(LEManageTemplateTiles.getWelcomeTiletextlanguagedownbutton()).click()

        cy.get(LEManageTemplateTiles.getWelcomeTiledepartmentoption()).should('be.visible')
        cy.get(LEManageTemplateTiles.getWelcomeTilelmsnameoption()).should('be.visible')
        cy.get(LEManageTemplateTiles.getWelcomeTilecompanynameoption()).should('be.visible')
        cy.get(LEManageTemplateTiles.getWelcomeTilecompanyphoneoption()).should('be.visible')
        cy.get(LEManageTemplateTiles.getWelcomeTilecompanyemailoption()).should('be.visible')
        // cy.get(LEManageTemplateTiles.getWelcomeTilejobTitleoption()).should('be.visible')

        //Save the Welcome Text configuration
        cy.get(LEManageTemplateTiles.getWelcomeTileSavebutton()).contains('Save').click({force: true})
        //Verify the welcome text message 
        cy.get(LEManageTemplateTiles.getWelcomeTileWelcomepane()).contains(dashboardDetails.welcome_message)       
    })
})