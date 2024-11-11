import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import LEDeleteModal from '../../../../../../helpers/LE/pageObjects/Modals/LEDelete.modal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { collaborationDetails, collaborationNames } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'

let content = [collaborationDetails.commentReply, collaborationDetails.postComment, collaborationDetails.postSummary];
let functions = ['getReplyOptionsBtnByContent', 'getCommentOptionsBtnByContent', 'getPostOptionsBtnByTitle'];

describe('LE - Collaborations - Delete Post, Comment and Reply', function(){

    before(function() {
        //Setup - Create 2 Posts and add a Comment & Reply with Learner 01 to one of them
        cy.createCollaborationPost(Cypress.env('B_COLLABORATION_ID'), collaborationDetails.postSummary, collaborationDetails.postDescription, "General")
        cy.createCollaborationPost(Cypress.env('B_COLLABORATION_ID'), collaborationDetails.postSummary2, collaborationDetails.postDescription, "General")
        cy.learnerLoginThruDashboardPage(users.learner01.learner_01_username, users.learner01.learner_01_password) 
        LEDashboardPage.getTileByNameThenClick('Collaborations')
        LEDashboardPage.getShortWait()
        //Add a Comment
        cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click()
        LECollaborationPage.getAddComment(collaborationDetails.postComment)
        LEDashboardPage.getShortWait()
        //Add a Reply
        LECollaborationPage.getAddReplyByCommentContent(collaborationDetails.postComment, collaborationDetails.commentReply)
        LEDashboardPage.getShortWait()
        cy.logoutLearner()
    })

    it('Verify Learner Cannot Delete Another Learners Post, Comment, or Reply', () => {
        cy.learnerLoginThruDashboardPage(users.learner02.learner_02_username, users.learner02.learner_02_password) 
        LEDashboardPage.getTileByNameThenClick('Collaborations')
        LEDashboardPage.getShortWait()

        //Assert Learner Cannot Delete Another Learners Post
        LECollaborationsActivityPage.getPostOptionsBtnByTitle(collaborationDetails.postSummary)
        cy.get(LECollaborationsActivityPage.getPostOptionBtn()).contains('Delete Post').should('not.exist')

        //Assert Learner Cannot Delete Another Learners Comment
        cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click({force:true})
        LEDashboardPage.getShortWait()
        LECollaborationPage.getCommentOptionsBtnByContent(collaborationDetails.postComment)
        cy.get(LECollaborationsActivityPage.getPostOptionBtn()).contains('Delete Comment').should('not.exist')

        //Assert Learner Cannot Delete Another Learners Reply
        LECollaborationPage.getReplyOptionsBtnByContent(collaborationDetails.commentReply)
        cy.get(LECollaborationsActivityPage.getPostOptionBtn()).contains('Delete Post').should('not.exist')
    })

    it('Verify Learner Can Delete Their Own Post, Comment, and Reply', () => {
        //Login and go to Post Details
        cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
        cy.learnerLoginThruDashboardPage(users.learner01.learner_01_username, users.learner01.learner_01_password) 
        LEDashboardPage.getTileByNameThenClick('Collaborations')
        LEDashboardPage.getShortWait()        
        cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.B_COLLABORATION_NAME).click()
        LEDashboardPage.getShortWait()
        cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click()


        //Verify Deletion for Post, Comment, Reply
        for (let i = 0; i < collaborationDetails.types.length; i++) {
            for (let j = 0; j < 2; j++) {
                if (i === collaborationDetails.types.length-1) {
                    LECollaborationsActivityPage[functions[i]](content[i])
                }
                else {
                    LECollaborationPage[functions[i]](content[i])
                }
                //cy.get(LECollaborationsActivityPage.getPostOptionBtn()).contains(`Delete ${collaborationDetails.types[i]}`).click()

                if (j === 0) {
                    //Verify Delete Can be Cancelled
                    cy.get(LECollaborationsActivityPage.getPostOptionBtn()).contains(`Delete ${collaborationDetails.types[i]}`).click()
                    cy.contains('Cancel').click()
                    //cy.get(LEDeleteModal.getCancelBtn()).click()
                } else {
                    //Verify Modal Content and Delete
                    cy.get(LECollaborationsActivityPage.getPostOptionBtn()).contains(`Delete ${collaborationDetails.types[i]}`).click()
                    cy.get(LEDeleteModal.getModalContainer()).should('contain', `Delete ${collaborationDetails.types[i]}`)
                    if (collaborationDetails.types[i] === 'Post') {
                        cy.get(LEDeleteModal.getConfirmationMsg()).should('contain', `Are you sure you want to delete your ${collaborationDetails.types[i]}?`)
                    } else {
                        cy.get(LEDeleteModal.getConfirmationMsg()).should('contain', `Are you sure you want to delete your ${collaborationDetails.types[i].toLowerCase()}?`)
                    }
                    cy.get(LEDeleteModal.getDeleteBtn()).click()
                    LEDashboardPage.getVShortWait() //Wait for Toast Notification
                    cy.get(LEDashboardPage.getToastNotificationMsg()).should('contain', `${collaborationDetails.types[i]} deleted successfully.`)
                    cy.get(LEDashboardPage.getToastNotificationCloseBtn()).click()
                }
            }
        }
    })

    it('Verify Learner is Redirected After Deleting Post', () => {
        cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
        //Login and go to 2nd Post Details
        cy.learnerLoginThruDashboardPage(users.learner01.learner_01_username, users.learner01.learner_01_password) 
        LEDashboardPage.getTileByNameThenClick('Collaborations')
        LEDashboardPage.getShortWait()

        //Get Number of Posts in Collaboration Details
        cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.B_COLLABORATION_NAME).click()
        cy.get(LECollaborationPage.getCollaborationCounts()).contains('Posts').then(($posts) => {
            cy.wrap($posts.text().substr(0,$posts.text().indexOf(' '))).as(`numPosts`)
        })

        //Delete Post
        cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary2).click()
        LEDashboardPage.getVShortWait()
        LECollaborationsActivityPage.getDeletePostByName(collaborationDetails.postSummary2)

        //Verify Redirect
        cy.url().should('not.contain', '/posts')

        //Verify Number of Posts in Collaboration Details Decrements by 1
        cy.get(`@numPosts`).then((posts) => {
            cy.get(LECollaborationPage.getCollaborationCounts()).should('contain', `${posts-1} Posts`)
        })
    })
})