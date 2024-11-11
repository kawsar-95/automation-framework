import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import LEAboutCollaborationModal from '../../../../../../helpers/LE/pageObjects/Modals/LEAboutCollaboration.modal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { collaborationDetails, collaborationNames } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'

describe('LE - Collaborations - Collaboration About', function(){

    beforeEach(() => {
        cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
        //Sign in, navigate to Collaborations
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Collaborations')
    })

    it('Verify About Section in Right Pane & About Modal', () => {  
        //Click on a Collaboration in the Right Pane
        cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.A_COLLABORATION_NAME).click()
        cy.get(LECollaborationPage.getPageTitle()).should('contain', collaborationNames.A_COLLABORATION_NAME) //Verify Collaboration Name

        //Verify Description is Visible in the Right Pane
        cy.get(LECollaborationPage.getAboutTxt()).should('contain', collaborationDetails.A_COLLABORATION_DESCRIPTION)

        //Verify 'View' Link Opens About Modal
        cy.get(LECollaborationPage.getViewAboutBtn()).click()

        //Verify Full Description Appears in Modal
        cy.get(LEAboutCollaborationModal.getDescriptionTxt()).should('contain', collaborationDetails.A_COLLABORATION_DESCRIPTION)

        //Verify Modal Can Be Closed
        cy.get(LEAboutCollaborationModal.getAboutModalContainer()).within(()=>{
            cy.get(LEAboutCollaborationModal.getModalCloseBtn()).click()
        })
        cy.get(LECollaborationPage.getAboutTxt()).should('be.visible') //Right pane should be visible again

        //Verify About header can also be clicked to open the modal
        cy.get(LECollaborationPage.getRightPaneModuleHeader()).contains('About').click()
        cy.get(LEAboutCollaborationModal.getDescriptionTxt()).should('contain', collaborationDetails.A_COLLABORATION_DESCRIPTION)
    })
})