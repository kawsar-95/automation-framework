import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { collaborationDetails, collaborationNames } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'

describe('LE - Collaborations - Mark Best Answer', function(){
    try {
        before(function() {
            //Create Question Post via API, Login as Learner 2, and Add Answer
            cy.createCollaborationPost(Cypress.env('A_COLLABORATION_ID'), collaborationDetails.postSummary, '', "Question")
            cy.learnerLoginThruDashboardPage(users.learner02.learner_02_username, users.learner02.learner_02_password)
            LEDashboardPage.getTileByNameThenClick('Collaborations')
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click()
            LECollaborationPage.getAddAnswer(collaborationDetails.postAnswer2)
            cy.get(LEDashboardPage.getNavMenu(),{timeout:10000}).should('be.visible')
            cy.logoutLearner()
        })

        beforeEach(() => {
            cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
            //Sign in, navigate to Collaborations
            cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
            LEDashboardPage.getTileByNameThenClick('Collaborations')
        })
    
        it('Verify Learner Can Mark Best Answer', () => {  
            //Go to Post and Add new Answer
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click()
            LECollaborationPage.getAddAnswer(collaborationDetails.postAnswer)
            cy.get(LECollaborationPage.getCommentContent(),{timeout:10000}).should('be.visible')
            //Mark Answer from Learner 02 as Best
            LECollaborationPage.getLikeCommentByContent(collaborationDetails.postAnswer2)

            //Verify Button and Answer Styling has Been Updated
            LECollaborationPage.getVerifyBestAnswerBtn(collaborationDetails.postAnswer2, miscData.portal_success_color)

            //Verify Other Answer Cannot be Selected as Best Answer
            cy.get(LECollaborationPage.getCommentContent()).contains(collaborationDetails.postAnswer).parents(LECollaborationPage.getCommentContainer()).within(() => {
                cy.get(LECollaborationPage.getCommentContainerFooter()).should('not.contain','Best Answer')
            })

        })
    
        it('Verify Question Post Now Displays Answered Badge and Answer is at Top of List', () => {  
            //Verify in All Collaboration Activity, Collaboration Activity, and Question Post Details
            for (let i = 0; i < 2; i++){
                cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).parents(LECollaborationsActivityPage.getPostContainer())
                .within(() => {
                    cy.get(LECollaborationsActivityPage.getPostPill()).should('contain', 'Answered')
                })
                if (i === 1){
                    cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.A_COLLABORATION_NAME).click()
                }
            }

            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click() // Go to post
            cy.get(LECollaborationPage.getCommentContainer(),{timeout:10000}).should('be.visible') //Wait for comments to load
             cy.get(LECollaborationPage.getCoursesLoader(),{timeout:10000}).should('not.exist')
            //Verify Marked Answer is at Top of List
            cy.get(LECollaborationPage.getCommentContainer()).eq(1).should('contain', collaborationDetails.postAnswer2)
        })
    
        it('Verify Learner Can Remove Best Answer Selection', () => { 
            //Go to Post and Remove Best Answer Selection
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click()
            LECollaborationPage.getLikeCommentByContent(collaborationDetails.postAnswer2)
            //Verify Button and Answer Styling has Been Updated
            LECollaborationPage.getVerifyBestAnswerBtn(collaborationDetails.postAnswer2, miscData.portal_base_color)

            //Verify Other Answer Can now Be Marked as Best
            cy.get(LECollaborationPage.getCommentContent()).contains(collaborationDetails.postAnswer).parents(LECollaborationPage.getCommentContainer()).within(() => {
                cy.get(LECollaborationPage.getCommentContainerFooter()).should('contain', 'Best Answer')
                })
        })

        it('Verify Question Post No Longer Displays Answered Badge', () => {  
            //Verify in All Collaboration Activity, Collaboration Activity, and Question Post Details
            for (let i = 0; i < 2; i++){
                cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).parents(LECollaborationsActivityPage.getPostContainer())
                .within(() => {
                    cy.get(LECollaborationsActivityPage.getPostPill()).should('not.exist')
                })
                if (i === 1){
                    cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.A_COLLABORATION_NAME).click()
                }
            }
        })
    }
    finally {
        it('Cleanup - Delete Collaboration Post', () => {  
            LECollaborationsActivityPage.getDeletePostByName(collaborationDetails.postSummary, 'Question')
        })
    }
})