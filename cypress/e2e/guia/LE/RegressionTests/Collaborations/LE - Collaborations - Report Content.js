import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import LEReportCollaborationActivityModal from '../../../../../../helpers/LE/pageObjects/Modals/LEReportCollaborationActivity.modal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { collaborationDetails, collaborationNames } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'

let types = collaborationDetails.types.reverse();
let content = [collaborationDetails.postSummary, collaborationDetails.postComment, collaborationDetails.commentReply];
let functions = ['getPostOptionsBtnByTitle', 'getCommentOptionsBtnByContent', 'getReplyOptionsBtnByContent'];

describe('LE - Collaborations - Report Content', function(){
    try {
        before(function() {
            //Create a post with Learner 1
            cy.createCollaborationPost(Cypress.env('A_COLLABORATION_ID'), collaborationDetails.postSummary, collaborationDetails.postDescription, "General")
            cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
            cy.learnerLoginThruDashboardPage(users.learner01.learner_01_username, users.learner01.learner_01_password) 
            LEDashboardPage.getTileByNameThenClick('Collaborations')
            cy.get(LECollaborationPage.getPageTitle(),{timeout:15000}).should('be.visible').and('contain','Collaborations Activity')
            //Select the Post and Add a Comment
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click()
            LECollaborationPage.getAddComment(collaborationDetails.postComment)
            cy.get(LECollaborationPage.getCommentContent()).should('be.visible').and('contain',`${collaborationDetails.postComment}`)
            //Add a Reply to the Comment
            LECollaborationPage.getAddReplyByCommentContent(collaborationDetails.postComment, collaborationDetails.commentReply)
            cy.get(LEDashboardPage.getNavMenu(),{timeout:10000}).should('be.visible')
            cy.logoutLearner()
        })
    
        beforeEach(() => {
            cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
            //Sign in, navigate to Collaborations
            cy.learnerLoginThruDashboardPage(users.learner02.learner_02_username, users.learner02.learner_02_password)
            LEDashboardPage.getTileByNameThenClick('Collaborations')
            cy.get(LECollaborationPage.getPageTitle(),{timeout:15000}).should('be.visible').and('contain','Collaborations Activity')
        })
    
        it('Verify Learner Can See the Report Button in All Pages, & Can Cancel the Report Modal', () => {
            //Assert Learner Can See the Report Post Option on the All Collaborations Recent Activity Page
            LECollaborationsActivityPage.getPostOptionsBtnByTitle(collaborationDetails.postSummary)
            cy.get(LECollaborationsActivityPage.getPostOptionBtn()).contains('Report Post').should('exist')
            
            //Assert Learner Can See the Report Post Option on the Collaboration Recent Activity Page
            cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.A_COLLABORATION_NAME).click({force:true})
            LECollaborationsActivityPage.getPostOptionsBtnByTitle(collaborationDetails.postSummary)
            cy.get(LECollaborationsActivityPage.getPostOptionBtn()).contains('Report Post').should('exist')
    
            //Assert Learner Can See the Report Post Option on the Collaboration Post Details Page
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click({force:true})
            LECollaborationsActivityPage.getPostOptionsBtnByTitle(collaborationDetails.postSummary)
            cy.get(LECollaborationsActivityPage.getPostOptionBtn()).contains('Report Post').click()
            
            //Verify Modal Can be Cancelled
            cy.get(LEReportCollaborationActivityModal.getCancelBtn()).click()
            cy.get(LECollaborationPage.getPageTitle()).should('be.visible')
        })
    
        for (let i = 0; i < types.length; i++) {
            it(`Verify Learner Can Report ${types[i]} From Post Details`, () => {
                //Go to the Collaboration Post
                cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.A_COLLABORATION_NAME).click()
                cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click()
                LEDashboardPage.getShortWait()
    
                for (let j = 0; j < collaborationDetails.reportType.length; j++) {
    
                    if (i===0) {
                        LECollaborationsActivityPage[functions[i]](content[i])
                    }
                    else {
                        LECollaborationPage[functions[i]](content[i])
                    }
                    cy.get(LECollaborationsActivityPage.getPostOptionBtn()).contains(`Report ${types[i]}`).click()
                    cy.get(LEReportCollaborationActivityModal.getReasonRadioBtn()).contains(collaborationDetails.reportType[j]).click()
    
                    if (collaborationDetails.reportType[j]==='Other') {
                        //Verify Explanation Field Does Not Allow > 255 Chars
                        cy.get(LEReportCollaborationActivityModal.getOtherTxtF()).invoke('text', LEDashboardPage.getLongString(300))
                        cy.get(LEReportCollaborationActivityModal.getReportBtn()).should('have.attr', 'aria-disabled', 'true')
                        cy.get(LEReportCollaborationActivityModal.getOtherTxtF()).clear().type(collaborationDetails.otherReason)
                    }
                    cy.get(LEReportCollaborationActivityModal.getReportBtn()).click()
                    cy.get(LEDashboardPage.getToastNotificationCloseBtn()).should('be.visible')//Wait for Toast Notification
                    cy.get(LEDashboardPage.getToastNotificationCloseBtn()).click()
                    LEDashboardPage.getVShortWait() //Wait for Toast Notification to clear
                }
            })
        } 
    }
    finally {
        it('Cleanup - Delete Learner 1 Collaboration Post', () => {
            cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password) 
            LEDashboardPage.getTileByNameThenClick('Collaborations')
            cy.get(LECollaborationPage.getPageTitle(),{timeout:15000}).should('be.visible').and('contain','Collaborations Activity')
            LECollaborationsActivityPage.getDeletePostByName(collaborationDetails.postSummary)
        })
    }  
})