import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCollaborationActivityEditPage from '../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationActivityEditPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { collaborationDetails, collaborationNames, attachments } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'

describe('LE - Collaborations - Edited By Admin', function(){
    try {
        before(function() {
            //Create a post via API
            cy.createCollaborationPost(Cypress.env('A_COLLABORATION_ID'), collaborationDetails.postSummary, collaborationDetails.postDescription, "General")
        })
    
        beforeEach(() => {
            cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
        })
    
        it('Verify Admin Can Edit Collaboration Activity', () => {
            //Sign into admin side as sys admin, navigate to Collaboration Activity
            cy.loginAdmin(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
            cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
            cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Engage'))).click()
            cy.wrap(arDashboardPage.getMenuItemOptionByName('Collaboration Activity'))
            //Filter for Collaboration Activity & Edit it
            cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
            arDashboardPage.AddFilter('Summary', 'Contains', collaborationDetails.postSummary)
            cy.get(arDashboardPage.getTableCellName(8)).contains(collaborationDetails.postSummary).click()
            cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Edit Activity'), 1000))
            cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit Activity')).click()
    
            //Edit the Post Summary and Description
            cy.get(ARCollaborationActivityEditPage.getSummaryTxtF()).type(collaborationDetails.appendedText)
            cy.get(ARCollaborationActivityEditPage.getDescriptionTxtF()).type(collaborationDetails.appendedText)
    
            //Save the Changes
            cy.get(arDashboardPage.getSaveBtn()).click()
            cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('exist')
        })
    
        it('Verify Collaboration Activity Displays Edited By Admin on LE Side', () => {
            //Sign in, navigate to Collaborations 
            cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
            LEDashboardPage.getTileByNameThenClick('Collaborations')
            cy.get(LECollaborationsActivityPage.getPageTitle(),{timeout:15000}).should('be.visible').and('contain','Collaborations Activity')
    
            //Verify Post Displays Edited By Admin in All Collaborations Recent Activity Page
            LECollaborationsActivityPage.getVerifyPostDateByTitle(collaborationDetails.postSummary+collaborationDetails.appendedText, '(Edited by Admin)')
    
            //Verify Post Displays Edited By Admin in Collaboration Recent Activity Page
            cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.A_COLLABORATION_NAME).click()
            LECollaborationsActivityPage.getVerifyPostDateByTitle(collaborationDetails.postSummary+collaborationDetails.appendedText, '(Edited by Admin)')
    
            //Verify Post Displays Edited By Admin in Collaboration Post Details Page
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary+collaborationDetails.appendedText).click()
            LECollaborationsActivityPage.getVerifyPostDateByTitle(collaborationDetails.postSummary+collaborationDetails.appendedText, '(Edited by Admin)')
        })
    }
    finally {
        it('Cleanup - Delete Collaboration Post', () => {
            //Sign in, navigate to Collaborations 
            cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
            LEDashboardPage.getTileByNameThenClick('Collaborations')
            cy.get(LECollaborationsActivityPage.getPageTitle(),{timeout:15000}).should('be.visible').and('contain','Collaborations Activity')
            LECollaborationsActivityPage.getDeletePostByName(collaborationDetails.postSummary+collaborationDetails.appendedText)
        })
    }
})