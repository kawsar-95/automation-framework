import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { collaborationDetails, collaborationNames } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'

describe('LE - Collaborations - Like and Unlike', function(){
    try {
        before(function() {
            //Create Question Post via API
            cy.createCollaborationPost(Cypress.env('A_COLLABORATION_ID'), collaborationDetails.postSummary, '', "General")
        })

        beforeEach(() => {
            cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
            //Sign in, navigate to Collaborations
            cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
            LEDashboardPage.getTileByNameThenClick('Collaborations')
        })
    
        it('Verify Learner Can Create a Post, Add a Comment, Add a Reply', () => { 
            //Select the Post and Add a Comment
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click()
            LECollaborationPage.getAddComment(collaborationDetails.postComment)
            cy.get(LECollaborationPage.getCommentContent(),{timeout:15000}).should('be.visible')
    
            //Add a Reply to the Comment
            LECollaborationPage.getAddReplyByCommentContent(collaborationDetails.postComment, collaborationDetails.commentReply)
            cy.get(LECollaborationsActivityPage.getNonLinkPostTitle(),{timeout:15000}).should('be.visible')
        })
    
        it('Verify Learner Can Like a Post From the Recent Activity Page', () => {  
            //Like the Post
            LECollaborationsActivityPage.getLikePostByTitle(collaborationDetails.postSummary)
            //Verify the Like Count and Color Updates
            LECollaborationsActivityPage.getVerifyPostLikesAndBtnColor(collaborationDetails.postSummary, '1', miscData.portal_primary_color)
        })
    
        it('Verify Learner Can Unlike a Post From the Recent Activity Page, and Like a Post From the Collaboration Page', () => { 
            //Unlike the Post
            LECollaborationsActivityPage.getLikePostByTitle(collaborationDetails.postSummary)
            //Verify the Like Count and Color Updates
            LECollaborationsActivityPage.getVerifyPostLikesAndBtnColor(collaborationDetails.postSummary, '0', miscData.portal_base_color)
    
            //Go to the Collaboration Page
            cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.A_COLLABORATION_NAME).click()
    
            //Like the Post From the Collaboration Page
            LECollaborationsActivityPage.getLikePostByTitle(collaborationDetails.postSummary)
            //Verify the Like Count and Color Updates
            LECollaborationsActivityPage.getVerifyPostLikesAndBtnColor(collaborationDetails.postSummary, '1', miscData.portal_primary_color)
        })
    
        it('Verify Learner Can Unlike a Post From the Collaboration Page, and Like the Post, Comment and Reply From the Post Details Page', () => {  
            //Go to the Collaboration Page
            cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.A_COLLABORATION_NAME).click()
            //Unlike the Post
            LECollaborationsActivityPage.getLikePostByTitle(collaborationDetails.postSummary)
            //Verify the Like Count and Color Updates
            LECollaborationsActivityPage.getVerifyPostLikesAndBtnColor(collaborationDetails.postSummary, '0', miscData.portal_base_color)
            
            //Go to the Post Details page
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click()
            cy.get(LECollaborationsActivityPage.getNonLinkPostTitle(),{timeout:15000}).should('be.visible') //Wait for Comments to Load
    
            //Like the Post From the Post Details Page
            LECollaborationsActivityPage.getLikePostByTitle(collaborationDetails.postSummary)
            //Verify the Like Count and Color Updates
            LECollaborationsActivityPage.getVerifyPostLikesAndBtnColor(collaborationDetails.postSummary, '1', miscData.portal_primary_color)
    
            //Like a Comment
            LECollaborationPage.getLikeCommentByContent(collaborationDetails.postComment)
            //Verify the Like Count and Color Updates
            LECollaborationPage.getVerifyCommentLikesAndBtnColor(collaborationDetails.postComment, '1', miscData.portal_primary_color)
    
            //Like a Comment Reply
            LECollaborationPage.getLikeReplyByContent(collaborationDetails.commentReply)
            //Verify the Like Count and Color Updates
            LECollaborationPage.getVerifyReplyLikesAndBtnColor(collaborationDetails.commentReply, '1', miscData.portal_primary_color)
        })
    
        it('Verify Learner Can Unlike the Post, Comment and Reply From the Post Details Page', () => {  
            //Go to the Post Details page
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click()
            cy.get(LECollaborationsActivityPage.getNonLinkPostTitle(),{timeout:15000}).should('be.visible') //Wait for Comments to Load
    
            //Unlike the Post
            LECollaborationsActivityPage.getLikePostByTitle(collaborationDetails.postSummary)
            //Verify the Like Count and Color Updates
            LECollaborationsActivityPage.getVerifyPostLikesAndBtnColor(collaborationDetails.postSummary, '0', miscData.portal_base_color)
            
            //Unlike the Comment
            LECollaborationPage.getLikeCommentByContent(collaborationDetails.postComment)
            //Verify the Like Count and Color Updates
            LECollaborationPage.getVerifyCommentLikesAndBtnColor(collaborationDetails.postComment, '0', miscData.portal_base_color)
    
            //Unlike the Reply
            LECollaborationPage.getLikeReplyByContent(collaborationDetails.commentReply)
            //Verify the Like Count and Color Updates
            LECollaborationPage.getVerifyReplyLikesAndBtnColor(collaborationDetails.commentReply, '0', miscData.portal_base_color)
        })
    
        it('Verify Comment and Reply Unlikes Persisted', () => {  
            //Go to the Post Details page
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click()
            cy.get(LECollaborationsActivityPage.getNonLinkPostTitle(),{timeout:15000}).should('be.visible') //Wait for Comments to Load
    
            //Verify the Like Count and Color For the Post Persisted
            LECollaborationsActivityPage.getVerifyPostLikesAndBtnColor(collaborationDetails.postSummary, '0', miscData.portal_base_color)
    
            //Verify the Like Count and Color For the Comment Persisted
            LECollaborationPage.getVerifyCommentLikesAndBtnColor(collaborationDetails.postComment, '0', miscData.portal_base_color)
    
            //Verify the Like Count and Color For the Comment Reply Persisted
            LECollaborationPage.getVerifyReplyLikesAndBtnColor(collaborationDetails.commentReply, '0', miscData.portal_base_color)
        })
    }
    finally {
        it('Cleanup - Delete Collaboration Post', () => {  
            LECollaborationsActivityPage.getDeletePostByName(collaborationDetails.postSummary)
        })
    }
})