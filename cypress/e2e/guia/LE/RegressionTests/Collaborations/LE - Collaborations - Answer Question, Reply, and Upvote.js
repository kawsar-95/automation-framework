import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { collaborationDetails } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'

describe('LE - Collaborations - Answer Question, Reply, and Upvote', function(){
    try {
        before(function() {
            //Create Question Post via API
            cy.createCollaborationPost(Cypress.env('A_COLLABORATION_ID'), collaborationDetails.postSummary, '', "Question")
        })

        beforeEach(() => {
            cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
            //Sign in, navigate to Collaborations
            cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
            LEDashboardPage.getTileByNameThenClick('Collaborations')
        })
    
        it('Verify Answer Can be Added to Question', () => {  
            //Verify Answer can be added by selecting the Question's footer 'Answers' btn
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).parents(LECollaborationsActivityPage.getPostContainer()).within(() => {
                cy.get(LECollaborationsActivityPage.getAnswersBtn()).click()
            })

            //Verify answer cannot be > 4000 chars
            cy.get(LECollaborationPage.getCommentTxtF()).invoke('text', LECollaborationPage.getLongString(4001)).type('a', {force:true})
            cy.get(LECollaborationPage.getPostCommentBtn()).contains('Post Answer').should('have.attr', 'aria-disabled', 'true')
            cy.get(LECollaborationPage.getCommentTxtF()).clear()

            //Verify toast message when answer is posted
            cy.get(LECollaborationPage.getCommentTxtF()).type(collaborationDetails.postAnswer)
            cy.get(LECollaborationPage.getPostCommentBtn()).contains('Post Answer').click()
            LECollaborationPage.getVShortWait()
            //cy.get(LECollaborationPage.getToastNotificationMsg()) //Toast notification currently not working

        })
    
        it('Verify Question Post Answer Count and Reply to Answer', () => {  
            //Verify Question's footer 'Answers' count has been updated
            cy.get(LECollaborationsActivityPage.getAnswersBtn()).should('contain', '1 Answers')

            //Verify reply cannot be > 4000 chars
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click()
            LECollaborationPage.getShortWait()
            cy.get(LECollaborationPage.getCommentContent()).contains(collaborationDetails.postAnswer).parents(LECollaborationPage.getCommentContainer()).within(() => {
                //Verify author pill is displayed
                cy.get(LECollaborationPage.getAuthorPill()).should('exist')
                cy.get(LECollaborationPage.getCommentReplyBtn()).click()
                cy.get(LECollaborationPage.getReplyTxtF()).invoke('text', LECollaborationPage.getLongString(4000)).type('a')
                cy.get(LECollaborationPage.getPostCommentBtn()).contains('Post Reply').should('have.attr', 'aria-disabled', 'true')
                //Verify Answer can be replied to
                cy.get(LECollaborationPage.getReplyTxtF()).clear().type(collaborationDetails.answerReply)
                cy.get(LECollaborationPage.getPostCommentBtn()).contains('Post Reply').click()
                LECollaborationPage.getShortWait()
            })
        })
    
        it('Verify Answer Can Be Upvoted', () => { 
            //Go to Answers
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click()
            LECollaborationPage.getShortWait()

            //Verify reply to answer displays author pill
            cy.get(LECollaborationPage.getCommentContent()).contains(collaborationDetails.postAnswer).parents(LECollaborationPage.getCommentContainer()).within(() => {
                cy.get(LECollaborationPage.getReplyContainer()).within(() => {
                    cy.get(LECollaborationPage.getAuthorPill()).should('exist')
                })
            })

            //Upvote answer
            LECollaborationPage.getUpvoteAnswerByContent(collaborationDetails.postAnswer)

            //Verify upvote count and color is updated
            LECollaborationPage.getVerifyAnswerUpvotesAndBtnColor(collaborationDetails.postAnswer, 1, miscData.portal_primary_color)

            //Verify upvote can be removed, and count and color is updated
            LECollaborationPage.getUpvoteAnswerByContent(collaborationDetails.postAnswer)
            LECollaborationPage.getVerifyAnswerUpvotesAndBtnColor(collaborationDetails.postAnswer, 0, miscData.portal_base_color)
        })
    }
    finally {
        it('Cleanup - Delete Collaboration Post', () => {  
            LECollaborationsActivityPage.getDeletePostByName(collaborationDetails.postSummary, 'Question')
        })
    }
})