import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEManageTemplatePrivateDashboardPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplatePrivateDashboardPage'
import LEManageTemplateTiles from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateTiles'
import LECollaborationsActivityTile from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityTile'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import LESocialFlyoverModal from '../../../../../../helpers/LE/pageObjects/Modals/LESocialFlyover.modal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { collaborationDetails, collabNames, collaborationNames } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'
import LEManageTemplateLoginPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateLoginPage'

describe('LE - Collaborations - Dashboard Tile', function(){
    try {
        before(function() {
            //Create a post via API, login as sys admin and add dashboard tile
            cy.createCollaborationPost(Cypress.env('A_COLLABORATION_ID'), collaborationDetails.postSummary, collaborationDetails.postDescription, "General")
            //Log into LE as sys Admin
            cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
            cy.get(LEDashboardPage.getNavMenu(),{timeout:10000}).should('be.visible')
            cy.get(LEDashboardPage.getNavMenu()).click()
            LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
            LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')
            cy.get(LEManageTemplateTiles.getAddNewContainerBtn(),{timeout:10000}).should('be.visible')
            // LEManageTemplateLoginPage.getInheritSettingsOfParentDepartmentToggle('false')    
            //Need to find initial number of containers so we know which one to target when adding the tile
            cy.get(LEManageTemplateTiles.getContentModule()).find(LEManageTemplateTiles.getContainer()).its('length').then(($length) => {
                //Add new container
                LEManageTemplateTiles.getAddNewContainer($length+1, 'Tile', collaborationDetails.containerName)
                //Add collaboration activity tile
                LEManageTemplateTiles.getAddNewTile(collaborationDetails.containerName, 'Collaborations Activity')
            })
    
            //Save changes
            cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()
            cy.get(LEManageTemplateTiles.getChangesSavedBanner(),{timeout:10000}).should('be.visible').and('contain','Changes Saved.')
        })
    
        it('Very Collaboration Activity Tile', () => {
            cy.viewport(1280, 720) //Enlarge viewport so Collaborations Tile is large
            cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
            //Go to Private Dashboard
            cy.visit('/#/dashboard')
            cy.get(LECollaborationsActivityTile.getTileHeader(),{timeout:10000}).contains('Collaborations Activity').should('be.visible') //Takes a few second to load activity into the tile
            
            //Verify Header is Clickable and Navigates to All Collaboration Activity
            cy.get(LECollaborationsActivityTile.getTileHeader()).contains('Collaborations Activity').click()
            cy.get(LECollaborationsActivityPage.getPageTitle()).should('contain', 'Collaborations Activity')
            cy.go('back')
            cy.get(LECollaborationsActivityTile.getPostSummary(),{timeout:10000}).should('be.visible')
    
            //Verify View All Collaboration Activity Button Navigates to All Collaboration Activity
            cy.get(LECollaborationsActivityTile.getViewAllBtn()).click()
            cy.get(LECollaborationsActivityPage.getPageTitle()).should('contain', 'Collaborations Activity')
            cy.go('back')
            cy.get(LECollaborationsActivityTile.getPostSummary(),{timeout:10000}).should('be.visible')

            //Verify Collaboration Name is Clickable and Navigates to Collaboration Activity
            cy.get(LECollaborationsActivityTile.getPostSummary()).contains(collaborationDetails.postSummary).parents(LECollaborationsActivityTile.getPostContainer()).within(() => {
                    cy.get(LECollaborationsActivityTile.getCollaborationName()).click()
                })
            cy.get(LECollaborationPage.getPageTitle()).should('contain', collaborationNames.A_COLLABORATION_NAME)
            cy.go('back')
            cy.get(LECollaborationsActivityTile.getPostSummary(),{timeout:10000}).should('be.visible')
    
            // //Verify Learner Name is Clickable and Opens their Social Flyover
            cy.get(LECollaborationsActivityTile.getPostSummary()).contains(collaborationDetails.postSummary).parents(LECollaborationsActivityTile.getPostContainer()).within(() => {
                    cy.get(LECollaborationsActivityTile.getLearnerName()).contains(users.sysAdmin.admin_sys_01_fname.replace('_','')).click()
                })
            cy.get(LESocialFlyoverModal.getViewProfileBtn()).should('be.visible')
    
            //Verify Post Summary is Clickable and Navigates to Post Details
            cy.get(LECollaborationsActivityTile.getPostSummary()).contains(collaborationDetails.postSummary).click({force:true})
            //Cleanup - Delete Collaboration Post
            LECollaborationsActivityPage.getDeletePostByName(collaborationDetails.postSummary)
        })
    }

    finally { 
        it('Cleanup', () => {
            cy.viewport(1280, 720) //Enlarge viewport so Collaborations Tile is large
            cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
            //Cleanup - Delete Collaboration Activity Tile & Container Even if Test Fails
            cy.get(LEDashboardPage.getNavMenu()).click()
            LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
            LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')
            cy.get(LEManageTemplateTiles.getAddNewContainerBtn(),{timeout:10000}).should('be.visible')
            // LEManageTemplateLoginPage.getInheritSettingsOfParentDepartmentToggle('true') 
            //Check each container name
            cy.get(LEManageTemplateTiles.getContentModule()).find(LEManageTemplateTiles.getContainerLabel()).each(($text) => {
                if ($text.text().includes("Collab Activity") === true) { 
                    LEManageTemplateTiles.getDeleteContainerByLabel($text.text())
                    cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()
                    cy.get(LEManageTemplateTiles.getChangesSavedBanner(),{timeout:10000}).should('be.visible').and('contain','Changes Saved.')
                } else {
                    cy.addContext('No Collaboration Containers to Delete')
                }
            })
        })
    } 
})




