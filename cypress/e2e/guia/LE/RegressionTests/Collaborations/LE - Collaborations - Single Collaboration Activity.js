import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import LESocialFlyoverModal from '../../../../../../helpers/LE/pageObjects/Modals/LESocialFlyover.modal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { collaborationDetails, collaborationNames } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'

describe('LE - Collaborations - Single Collaborations Activity', function(){
    try {
        before(function() {
            //Create 11 posts via API - Add long description to last post
            for (let i = 0; i < collaborationDetails.posts.length; i++) {
                if (i === collaborationDetails.posts.length - 1) {
                    cy.createCollaborationPost(Cypress.env('A_COLLABORATION_ID'), `${collaborationDetails.posts[i]} - ${collaborationDetails.postSummary}`, LEDashboardPage.getLongString(1000), "General")
                } else {
                    cy.createCollaborationPost(Cypress.env('A_COLLABORATION_ID'), `${collaborationDetails.posts[i]} - ${collaborationDetails.postSummary}`, collaborationDetails.postDescription, "General")
                }
            }
        })
    
        beforeEach(() => {
            cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
            //Sign in, navigate to Collaboration
            cy.learnerLoginThruDashboardPage(users.learner02.learner_02_username, users.learner02.learner_02_password)
            LEDashboardPage.getTileByNameThenClick('Collaborations')
            cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.A_COLLABORATION_NAME).click()
        })
    
        it('Verify Single Collaborations Activity Page', () => {  
            //Verify Members and Post Count is Visible
            cy.get(LECollaborationPage.getCollaborationCounts()).should('contain', 'Members').and('contain', 'Posts')

            //Verify Posts have a width of 640px
            cy.get(LECollaborationsActivityPage.getPostContainer()).eq(0).invoke('css', 'width').should('eq', '640px')
    
            //Verify 10 Posts are Displayed by Default
            cy.get(LECollaborationsActivityPage.getPostContainer()).find(LECollaborationsActivityPage.getPostTitle()).should('have.length', 10)
    
            //Verify Pressing Load More Loads more Posts (>10 Posts now displayed)
            cy.get(LECollaborationsActivityPage.getLoadMorePostsBtn()).click()
            LEDashboardPage.getShortWait()
            cy.get(LECollaborationsActivityPage.getPostContainer()).find(LECollaborationsActivityPage.getPostTitle()).its('length').should('be.gt', 10)
        })
    
        it('Verify Collaboration Activity Post Information', () => {  
            //Verify Each Post Displays Correct Information & All Elements
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(`${collaborationDetails.posts[5]} - ${collaborationDetails.postSummary}`)
                .parents(LECollaborationsActivityPage.getPostContainer()).within(() => {
                    cy.get(LECollaborationsActivityPage.getPostAvatarContainer()).should('exist')
                    cy.get(LECollaborationsActivityPage.getPosterName()).should('contain', collaborationDetails.l01Name)
                    cy.get(LECollaborationsActivityPage.getPostDate()).should('exist')
                    cy.get(LECollaborationsActivityPage.getPostContent()).should('contain', collaborationDetails.postDescription)
                    cy.get(LECollaborationsActivityPage.getPostOverflowMenuBtn()).should('exist')
                    cy.get(LECollaborationsActivityPage.getPostLikeBtn()).should('exist')
                })
    
            //Verify Posts with Long Descriptions (>4 Lines) have a View Post Link
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(`${collaborationDetails.posts[collaborationDetails.posts.length -1]} - ${collaborationDetails.postSummary}`)
                .parents(LECollaborationsActivityPage.getPostContainer()).within(() => {
                    cy.get(LECollaborationsActivityPage.getViewPostBtn()).should('exist')
                })
    
            //Verify You can Click the Post Summary to go the Post Details Page
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(`${collaborationDetails.posts[5]} - ${collaborationDetails.postSummary}`).click()
            cy.get(LECollaborationPage.getPageHeader()).should('contain', `Post by ${collaborationDetails.l01Name}`)
            cy.get(LECollaborationPage.getBackBtn()).click()
    
            //Verify Clicking the Poster's Name Opens their Social Flyover
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(`${collaborationDetails.posts[5]} - ${collaborationDetails.postSummary}`)
                .parents(LECollaborationsActivityPage.getPostContainer()).within(() => {
                    cy.get(LECollaborationsActivityPage.getPosterName()).contains(collaborationDetails.l01Name).click()   
                })
            cy.get(LESocialFlyoverModal.getViewProfileBtn()).should('exist')
        })
    }
    finally {
        it('Cleanup - Delete all Collaboration Posts', () => {  
            cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
            LEDashboardPage.getTileByNameThenClick('Collaborations')
            cy.get(LECollaborationsActivityPage.getLoadMorePostsBtn()).click()
            LEDashboardPage.getShortWait()
            for (let i = 0; i < collaborationDetails.posts.length; i++) {
                LECollaborationsActivityPage.getDeletePostByName(`${collaborationDetails.posts[i]} - ${collaborationDetails.postSummary}`)
            }
        })
    }
})