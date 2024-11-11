import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import LECollaborationPage from "../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage";
import LECollaborationsActivityPage from "../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LESocialFlyoverModal from "../../../../../../helpers/LE/pageObjects/Modals/LESocialFlyover.modal";
import LESocialProfilePage from "../../../../../../helpers/LE/pageObjects/User/LESocialProfilePage";
import { collaborationDetails, collaborationNames } from "../../../../../../helpers/TestData/Collaborations/collaborationDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

let i = 2;
describe('C1802 - AUT-425 - NLE-1877 - A learner has a social profile view - fields and total points  ', function () {

    before(function () {
        //Create 1 posts via API 
        cy.createCollaborationPost(Cypress.env('A_COLLABORATION_ID'), `${collaborationDetails.posts[i]} - ${collaborationDetails.postSummary}`, LEDashboardPage.getLongString(1000), "General")

    })

    beforeEach(() => {
       
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

    it('Verify that a learner can view another learners social profile ', () => {
        //Verify Each Post Displays Correct Information & All Elements
        cy.get(LECollaborationsActivityPage.getPostTitle()).contains(`${collaborationDetails.posts[i]} - ${collaborationDetails.postSummary}`)
            .parents(LECollaborationsActivityPage.getPostContainer()).within(() => {
                cy.get(LECollaborationsActivityPage.getPostAvatarContainer()).should('exist')
                cy.get(LECollaborationsActivityPage.getPosterName()).should('contain', collaborationDetails.l01Name)
                cy.get(LECollaborationsActivityPage.getPostDate()).should('exist')
                cy.get(LECollaborationsActivityPage.getPostOverflowMenuBtn()).should('exist')
                cy.get(LECollaborationsActivityPage.getPostLikeBtn()).should('exist')
            })


        //Verify You can Click the Post Summary to go the Post Details Page
        cy.get(LECollaborationsActivityPage.getPostTitle()).contains(`${collaborationDetails.posts[i]} - ${collaborationDetails.postSummary}`).click()
        cy.get(LECollaborationPage.getPageHeader()).should('contain', `Post by ${collaborationDetails.l01Name}`)
        cy.get(LECollaborationPage.getBackBtn()).click()

        //Verify Clicking the Poster's Name Opens their Social Flyover
        cy.get(LECollaborationsActivityPage.getPostTitle()).contains(`${collaborationDetails.posts[i]} - ${collaborationDetails.postSummary}`)
            .parents(LECollaborationsActivityPage.getPostContainer()).within(() => {
                cy.get(LECollaborationsActivityPage.getPosterName()).contains(collaborationDetails.l01Name).click()
            })
        //Asserting Profile Btn    
        cy.get(LESocialFlyoverModal.getViewProfileBtn()).should('exist')
        cy.get(LESocialFlyoverModal.getSendMessageBtn()).should('exist')
        //Clicking on profile button
        cy.get(LESocialFlyoverModal.getViewProfileBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
        //Asserting Social profile Page 
        cy.url().should('contain', '/social-profile/')
        //Asserting Social profile Name is present 
        cy.get(LESocialProfilePage.getSocialProfileHeaderName()).should('be.visible')


    })


    it('Cleanup - Delete created Collaboration Posts', () => {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Collaborations')
        cy.get(LECollaborationsActivityPage.getLoadMorePostsBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
        LECollaborationsActivityPage.getDeletePostByName(`${collaborationDetails.posts[i]} - ${collaborationDetails.postSummary}`)

    })
})