import users from '../../../../../fixtures/users.json'
import miscData from '../../../../../fixtures/miscData.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEManageTemplatePrivateDashboardPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplatePrivateDashboardPage'
import LEManageTemplateTiles from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateTiles'
import LEEditTileModal from '../../../../../../helpers/LE/pageObjects/Modals/LEEditTile.modal'
import { dashboardDetails } from '../../../../../../helpers/TestData/Dashboard/dashboardDetails'

describe('LE - Welcome Tile Welcome message customization', function () {

    beforeEach(() => {
        cy.viewport(1200, 850) //Enlarge viewport so tiles display text within them
        //sign in and navigate to manage template before each test
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, "#/login")
        cy.wait(3000)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        //Open content container
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')
    })
    after(function () {
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, "#/login")
        cy.wait(3000)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        //Open content container
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')

        //Edit Welcome Tile in the Tile container
        cy.get(LEManageTemplateTiles.getContainerByIndex(1)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName(dashboardDetails.body)
        })
        //Navigate to Welcome Text configuration
        cy.get(LEManageTemplateTiles.getWelcomeTilesidemenu()).contains(' Text').click()
        //Clears the existing text message
        cy.get(LEManageTemplateTiles.getWelcomeTileWelcomeMessageInput()).clear()
        //Reverting back to original status
        cy.get(LEManageTemplateTiles.getWelcomeTileWelcomeMessageInput()).type("Welcome, ")
        cy.get(LEManageTemplateTiles.getWelcomeTileWelcomeMessageoptions()).click()
        cy.get(LEManageTemplateTiles.getWelcomeTileFirstnameoption()).click()
        cy.get(LEManageTemplateTiles.getWelcomeTileWelcomeMessageInput()).type(' ')
        cy.get(LEManageTemplateTiles.getWelcomeTileLastnameoption()).click()

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
        cy.get(LEManageTemplateTiles.getWelcomeTileFirstnameoption()).should('be.visible')
        cy.get(LEManageTemplateTiles.getWelcomeTileLastnameoption()).should('be.visible')
        
        //Save the Welcome Text configuration
        cy.get(LEManageTemplateTiles.getWelcomeTileSavebutton()).contains('Save').click({force: true})
        //Verify the welcome text message 
        cy.get(LEManageTemplateTiles.getWelcomeTileWelcomepane()).contains(dashboardDetails.welcome_message)       
    })
})