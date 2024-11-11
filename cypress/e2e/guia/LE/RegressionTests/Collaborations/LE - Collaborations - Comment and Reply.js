import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { collaborationDetails } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'

//Create Arrays of Comments and Replies for posting and sorting comparism
let comments = [], replies = [];
for (let i = 0; i < collaborationDetails.numComments; i++){
    comments.push(`Comment - ${i}`)
}
for (let i = 0; i < collaborationDetails.numReplies; i++){
    replies.push(`Reply - ${i}`)
}

describe('LE - Collaborations - Comment and Reply', function(){
    try {
        before(function() {
            //Create General Post via API
            cy.createCollaborationPost(Cypress.env('A_COLLABORATION_ID'), collaborationDetails.postSummary, '', "General")
        })

        beforeEach(() => {
            //Sign in, navigate to Collaborations
            cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
            LEDashboardPage.getTileByNameThenClick('Collaborations')
        })
    
        it('Verify Comments Can be Added to Post', () => {  
            //Go to Post
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click()
            cy.get(LECollaborationPage.getCommentTxtF(),{timeout:10000}).should('be.visible')

            //Verify comment cannot be > 4000 chars
            cy.get(LECollaborationPage.getCommentTxtF()).invoke('text', LECollaborationPage.getLongString(4001)).type('a', {force:true})
            cy.get(LECollaborationPage.getPostCommentBtn()).contains('Post Comment').should('have.attr', 'aria-disabled', 'true')
            cy.get(LECollaborationPage.getCommentTxtF()).clear()

            //Add 12 Comments
            for (let i = 0; i < collaborationDetails.numComments; i++) {
                cy.get(LECollaborationPage.getCommentTxtF()).should('have.text', '')
                cy.get(LECollaborationPage.getCommentTxtF()).type(comments[i])
                cy.get(LECollaborationPage.getPostCommentBtn()).contains('Post Comment').click()
                LECollaborationPage.getVShortWait()
            }
        })
    
        it('Verify General Post Comment Count and Add Replies to Comment', () => {  
            //Verify Post's footer 'Comments' count has been updated
            cy.get(LECollaborationsActivityPage.getAnswersBtn()).should('contain', `${collaborationDetails.numComments} Comments`)
            
            //Verify Comments can be viewed by selecting the Post's footer 'Comments' btn
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).parents(LECollaborationsActivityPage.getPostContainer()).within(() => {
                cy.get(LECollaborationsActivityPage.getAnswersBtn()).click()
            })

            //Verify reply to comment cannot be > 4000 chars
            cy.get(LECollaborationsActivityPage.getNonLinkPostTitle()).contains(collaborationDetails.postSummary).click()
            cy.get(LECollaborationPage.getCommentContent(),{timeout:10000}).should('be.visible')
            cy.get(LECollaborationPage.getCommentContent()).contains(comments[0]).parents(LECollaborationPage.getCommentContainer()).within(() => {
                //Verify author pill is displayed
                cy.get(LECollaborationPage.getAuthorPill()).should('exist')
                cy.get(LECollaborationPage.getCommentReplyBtn()).click()
                cy.get(LECollaborationPage.getReplyTxtF()).invoke('text', LECollaborationPage.getLongString(4000)).type('a')
                cy.get(LECollaborationPage.getPostCommentBtn()).contains('Post Reply').should('have.attr', 'aria-disabled', 'true')
                cy.get(LECollaborationPage.getReplyTxtF()).clear()
                
                //Add 6 Replies
                for (let i = 0; i < collaborationDetails.numReplies; i++) {
                    cy.get(LECollaborationPage.getReplyTxtF()).should('have.text', '')
                    cy.get(LECollaborationPage.getReplyTxtF()).type(replies[i])
                    cy.get(LECollaborationPage.getPostCommentBtn()).contains('Post Reply').click()
                    LECollaborationPage.getVShortWait()
                }
            })
        })
    
        it('Verify Comments and Replies Can be Loaded and are Sorted Correctly', () => { 
            //Go to Comments
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click()
            cy.get(LECollaborationPage.getCoursesLoader(),{timeout:10000}).should('exist')
            cy.get(LECollaborationPage.getCoursesLoader(),{timeout:10000}).should('not.exist')

            //Verify 10 Comments are Displayed Initially (check for 11 as post container is included in count)
            cy.get(LECollaborationPage.getCommentContainer()).its('length').should('eq', 11)

            //Verify Additional Comments can be loaded
            cy.get(LECollaborationsActivityPage.getLoadMorePostsBtn()).click()
            cy.get(LECollaborationPage.getCoursesLoader(),{timeout:10000}).should('exist')
            cy.get(LECollaborationPage.getCoursesLoader(),{timeout:10000}).should('not.exist')
            cy.get(LECollaborationPage.getCommentContainer()).its('length').should('eq', collaborationDetails.numComments+1)

            //Verify Comments are Sorted Correctly (Oldest to Newest) - compare against sorted array
            cy.get(LECollaborationPage.getCommentContent()).invoke('text')
                .should('eq', comments.join(''));

            //Verify the most recent 3 replies are displayed initially
            cy.get(LECollaborationPage.getCommentContent()).contains(comments[0]).parents(LECollaborationPage.getCommentContainer()).within(() => {
                cy.get(LECollaborationPage.getReplyContainer()).its('length').should('eq', 3)
                //Verify author pill is displayed in reply
                cy.get(LECollaborationPage.getReplyContainer()).eq(0).within(() => {
                    cy.get(LECollaborationPage.getAuthorPill()).should('exist')
                })

                //Verify correct number of additional replies can be loaded
                cy.get(LECollaborationPage.getLoadMoreRepliesBtn()).should('contain', `Load ${collaborationDetails.numReplies - 3} previous replies`)
                    .click({multiple:true})
                LEDashboardPage.getShortWait()

                //Verify replies are sorted correctly (Oldest to newest) - compare against sorted array
                cy.get(LECollaborationPage.getReplyContent()).invoke('text')
                    .should('eq', replies.join(''));
            })
        })
    }
    finally {
        it('Cleanup - Delete Collaboration Post', () => {  
            LECollaborationsActivityPage.getDeletePostByName(collaborationDetails.postSummary)
        })
    }
})