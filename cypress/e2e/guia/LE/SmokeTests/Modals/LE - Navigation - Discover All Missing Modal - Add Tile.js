import users from '../../../../../fixtures/users.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEManageTemplatePrivateDashboardPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplatePrivateDashboardPage'
import LEManageTemplateTiles from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateTiles'

describe('LE - Navigation - Discover All Missing Modal - Add Tile',function(){

    beforeEach(() =>{
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        //Open content container
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')
    })

    it('LE - Navigation - Discover All Missing Modal-Add Billboard Tile', function(){

        cy.get(LEManageTemplateTiles.getContentModule()).find(LEManageTemplateTiles.getContainer()).its('length').then(($length) => {
            //Add new Billboard container and edit it
            LEManageTemplateTiles.getAddNewContainer($length+1, 'Billboard', 'Add Billboard')
            LEManageTemplateTiles.getTileEditBtnByLabelandTileName('Add Billboard','Billboard')
            
            // Select a tag
            cy.get(LEManageTemplateTiles.getBillboardTagsBtn()).click()
            cy.get(LEManageTemplateTiles.getBillboardTagsDDown()).contains('Video').click()
            LEDashboardPage.getShortWait()
            cy.get(LEManageTemplateTiles.getBillboardEditSaveBtn()).click()


            //Add collaboration activity tile
            cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()
            LEDashboardPage.getLongWait()

            //Delete added Billboard
            cy.get(LEManageTemplateTiles.getSuccessSaveMessage()).should('be.visible')
            LEManageTemplateTiles.getDeleteContainerByLabel('Add Billboard')

            //Save changes
            cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()
            LEDashboardPage.getShortWait()
        })
    })

    it('LE - Navigation - Discover All Missing Modal-Add My Course Tile',function(){
         
        cy.get(LEManageTemplateTiles.getContentModule()).find(LEManageTemplateTiles.getContainer()).its('length').then(($length) => {
         
           LEManageTemplateTiles.getAddNewContainer($length+1, 'Tile', 'My Courses62')
           
           cy.get(LEManageTemplateTiles.getContainerByIndex($length+1)).within(()=>{
               cy.get(LEManageTemplateTiles.getAddTileBtn()).click()
            })
            
            LEDashboardPage.getShortWait()
            LEManageTemplateTiles.getAddNewTileModal('My Courses',$length+1)

            cy.get(LEManageTemplateTiles.getContainerByIndex($length+1)).within(()=>{
                LEManageTemplateTiles.getTileEditBtnByTileName('My Courses')
            })

            LEManageTemplateTiles.getEditInnerTileForSmoke()
            
            LEDashboardPage.getShortWait()
            cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()

            LEDashboardPage.getLongWait()
            cy.get(LEManageTemplateTiles.getSuccessSaveMessage()).should('be.visible')
            LEManageTemplateTiles.getDeleteContainerByLabel('My Courses62')

            cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()
            LEDashboardPage.getShortWait()
        })
    })

    it('LE - Navigation - Discover All Missing Modal-Add Resources Tile',function(){
         
        cy.get(LEManageTemplateTiles.getContentModule()).find(LEManageTemplateTiles.getContainer()).its('length').then(($length) => {
         
           LEManageTemplateTiles.getAddNewContainer($length+1, 'Tile', 'My Courses62')
           
           cy.get(LEManageTemplateTiles.getContainerByIndex($length+1)).within(()=>{
               cy.get(LEManageTemplateTiles.getAddTileBtn()).click()
            })
            
            LEDashboardPage.getShortWait()
            LEManageTemplateTiles.getAddNewTileModal('Resources',$length+1)

            cy.get(LEManageTemplateTiles.getContainerByIndex($length+1)).within(()=>{
                LEManageTemplateTiles.getTileEditBtnByTileName('Resources')
            })

            LEManageTemplateTiles.getEditInnerTileResources()
            
            LEDashboardPage.getShortWait()
            cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()

            LEDashboardPage.getLongWait()
            cy.get(LEManageTemplateTiles.getSuccessSaveMessage()).should('be.visible')
            LEManageTemplateTiles.getDeleteContainerByLabel('My Courses62')

            cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()
            LEDashboardPage.getShortWait()
        })
    })

    it('LE - Navigation - Discover All Missing Modal-Add Catalog Tile',function(){
         
        cy.get(LEManageTemplateTiles.getContentModule()).find(LEManageTemplateTiles.getContainer()).its('length').then(($length) => {
         
           LEManageTemplateTiles.getAddNewContainer($length+1, 'Tile', 'My Courses62')
           
           cy.get(LEManageTemplateTiles.getContainerByIndex($length+1)).within(()=>{
               cy.get(LEManageTemplateTiles.getAddTileBtn()).click()
            })
            
            LEDashboardPage.getShortWait()
            LEManageTemplateTiles.getAddNewTileModal('Catalog',$length+1)

            cy.get(LEManageTemplateTiles.getContainerByIndex($length+1)).within(()=>{
                LEManageTemplateTiles.getTileEditBtnByTileName('Catalog')
            })

            LEManageTemplateTiles.getEditInnerTileForSmoke()
            
            LEDashboardPage.getShortWait()
            cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()

            LEDashboardPage.getLongWait()
            cy.get(LEManageTemplateTiles.getSuccessSaveMessage()).should('be.visible')
            LEManageTemplateTiles.getDeleteContainerByLabel('My Courses62')

            cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()
            LEDashboardPage.getShortWait()
        })
    })
    

})
