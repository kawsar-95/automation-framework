import users from '../../../../../fixtures/users.json'
import miscData from '../../../../../fixtures/miscData.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEManageTemplatePrivateDashboardPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplatePrivateDashboardPage'
import LEManageTemplateTiles from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateTiles'
import LEEditTileModal from '../../../../../../helpers/LE/pageObjects/Modals/LEEditTile.modal'
import { collaborationDetails, collaborationNames, attachments } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'
import { resourcePaths, images } from '../../../../../../helpers/TestData/resources/resources'
import { dashboardDetails } from '../../../../../../helpers/TestData/Dashboard/dashboardDetails'


describe('LE - Welcome Tile Customization Foreground Image Configuration', function () {

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
         //Navigate to Foreground Image edit options
        cy.get(LEManageTemplateTiles.getWelcomeTilesidemenu()).contains('Foreground Image').click()
        //removes the background image
        cy.get(LEManageTemplateTiles.getWelcomeTileDeleteImage()).click() 
        //resets the show image 
        cy.get(LEManageTemplateTiles.getWelcomeTileShowImageCheckbox()).should('have.attr', 'aria-checked', 'true')
        cy.get(LEManageTemplateTiles.getWelcomeTileShowImage()).click({force: true})
        //save the changes
        cy.get(LEManageTemplateTiles.getWelcomeTileSavebutton()).contains('Save').click({force: true})
        //verify the changes saved using changes saved label
        cy.get(LEManageTemplateTiles.getWelcomeTileSavemessage()).contains('Changes Saved.').should('be.visible')
        //close the welcome Tile edit mode
        cy.get(LEManageTemplateTiles.getWelcomeTileClosebutton()).click()

      })

    it('Welcome Tile - Foreground Image customization', () => {
        //Edit Welcome Tile in the Tile container
        cy.get(LEManageTemplateTiles.getContainerByIndex(1)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName(dashboardDetails.body)
        })

        //Navigate to Foreground Image edit options
        cy.get(LEManageTemplateTiles.getWelcomeTilesidemenu()).contains('Foreground Image').click()
        //Show image will be enabled 
        if(cy.get(LEManageTemplateTiles.getWelcomeTileShowImageCheckbox()).should('have.attr', 'aria-checked', 'false')){
        
        cy.get(LEManageTemplateTiles.getWelcomeTileShowImage()).click({force: true})
        }
        //upload the image using browse
        cy.get(LEManageTemplateTiles.getFileInput()).attachFile(resourcePaths.resource_image_folder + images.moose_filename)
         //verify the upload status
        cy.get(LEManageTemplateTiles.getWelcomeTileImgUploadverifiedstatus()).should('have.text',"Upload verified")
         //save the changes
        cy.get(LEManageTemplateTiles.getWelcomeTileSavebutton()).contains('Save').click({force: true})
        //verify the changes saved using changes saved label
        cy.get(LEManageTemplateTiles.getWelcomeTileSavemessage()).contains('Changes Saved.').should('be.visible')
        
    })


})