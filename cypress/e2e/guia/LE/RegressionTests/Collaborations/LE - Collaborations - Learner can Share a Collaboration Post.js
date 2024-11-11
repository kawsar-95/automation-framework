import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import { collaborationDetails, collaborationNames } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import LECreateCollaborationPostModal from '../../../../../../helpers/LE/pageObjects/Modals/LECreateCollaborationPost.modal'


describe('LE - Collaborations - Learner can Share a Collaboration Post', function(){
    try{
        beforeEach(() => {
            //Sign in, navigate to Collaborations 
            cy.viewport(1200, 850)
            cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
            LEDashboardPage.getTileByNameThenClick('Collaborations')
            LEDashboardPage.getShortWait()
        })

        // Share a Collaboration Post

        it('Verify Learner Can Share a Post From the Collaboration Activity Page', () => {

            //Navigate to Collaboration and Create Post
            cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.A_COLLABORATION_NAME).click()
            cy.get(LECollaborationPage.getCreatePostBtn()).click()
            cy.get(LECreateCollaborationPostModal.getSummaryTxtF()).type(collaborationDetails.postSummary)
            cy.get(LECreateCollaborationPostModal.getDescriptionTxtF()).clear() //Clear first so line break does not happen when typing
            cy.get(LECreateCollaborationPostModal.getDescriptionTxtF()).type(collaborationDetails.postDescription)

            //Save Post
            LEDashboardPage.getShortWait()
            cy.get(LECollaborationPage.getCreatePostModalBtn()).click()
            
            
            //Share the Post
            LEDashboardPage.getShortWait()
            LECollaborationsActivityPage.getSharePostByTitle(collaborationDetails.postSummary)
            
            //Verify Link copied to clipboard
            cy.get(LECollaborationsActivityPage.getClipboardVerifyMssg()).should('be.visible')
        })

    }
    finally {
        it('Cleanup - Delete Collaboration Post', () => {
            LECollaborationsActivityPage.getDeletePostByName(collaborationDetails.postSummary)
        })
    }
})




        

    
            
            
     