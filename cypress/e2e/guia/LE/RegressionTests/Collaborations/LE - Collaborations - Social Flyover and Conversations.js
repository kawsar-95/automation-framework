import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LESocialFlyoverModal from '../../../../../../helpers/LE/pageObjects/Modals/LESocialFlyover.modal'
import LEChatOnTeamsModal from '../../../../../../helpers/LE/pageObjects/Modals/LEChatOnTeams.modal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { collaborationDetails, collaborationNames } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'

let functions = [['getNonLinkPostTitle', 'getPostContainer', 'getPosterName'], ['getCommentContent', 'getCommentContainer', 'getCommenterName'],
                    ['getReplyContent', 'getReplyContainer', 'getReplyerName']];
let content = [collaborationDetails.postSummary, collaborationDetails.postComment, collaborationDetails.commentReply];

describe('LE - Collaborations - Social Flyover and Conversations', function(){

    before(function() {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0) //Create Learner
        //Create a post via API with Learner 1
        cy.createCollaborationPost(Cypress.env('B_COLLABORATION_ID'), collaborationDetails.postSummary, collaborationDetails.postDescription, "General")
        cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
        cy.learnerLoginThruDashboardPage(users.learner01.learner_01_username, users.learner01.learner_01_password) 
        LEDashboardPage.getTileByNameThenClick('Collaborations')
        cy.get(LECollaborationsActivityPage.getPageTitle()).should('contain', 'Collaborations Activity')
        //Select the Post and Add a Comment
        cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click()
        LECollaborationPage.getAddComment(collaborationDetails.postComment) 
        cy.get(LECollaborationPage.getCommentReplyBtn(),{timeout:15000}).should('be.visible')
        //Add a Reply to the Comment
        LECollaborationPage.getAddReplyByCommentContent(collaborationDetails.postComment, collaborationDetails.commentReply)
        cy.get(LEDashboardPage.getNavMenu(),{timeout:15000}).should('be.visible')
        cy.logoutLearner()
        cy.url().should('contain','#/public-dashboard') //Wait for Logout to complete
    })

    beforeEach(() => {
        cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
        //Sign in, navigate to Collaboration
        cy.learnerLoginThruDashboardPage(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getTileByNameThenClick('Collaborations')
        cy.get(LECollaborationsActivityPage.getPageTitle()).should('contain', 'Collaborations Activity')
        cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.B_COLLABORATION_NAME).click()
    })

    after(function() {
        //Cleanup - Delete User
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            userDetails.userID = currentURL.slice(-36);
            cy.deleteUser(userDetails.userID)
        })

        //Cleanup - Delete Collaboration Posts
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Collaborations')
        LECollaborationsActivityPage.getDeletePostByName(collaborationDetails.postSummary)
    })

    it('Verify Social Flyover in Collaborations', () => {  
        //Social Flyover is already covered for the dashboard tile, all collaboration activity, and single collaboration activity in other tests
        //Verify Social Flyover Exists for Member Avatars in Side Menu
        cy.get(LECollaborationPage.getMemberAvatar(3)).click()
        cy.get(LESocialFlyoverModal.getViewProfileBtn()).should('exist')
        cy.get(LESocialFlyoverModal.getSendMessageBtn()).should('exist')

        //Go to Post Details
        cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click()

        //Verify Social Flyover Exists for Post Author, Commentor, Learner Replying to Comment
        for (let i = 0; i < functions.length; i++) {
            if (i === 0) {
                cy.get(LECollaborationsActivityPage[functions[i][0]]()).contains(content[i])
                .parents(LECollaborationsActivityPage[functions[i][1]]()).within(() => {
                    cy.get(LECollaborationsActivityPage[functions[i][2]]()).contains(users.learner01.learner_01_fname).click()  
                })
            } else {
                cy.get(LECollaborationPage[functions[i][0]]()).contains(content[i])
                .parents(LECollaborationPage[functions[i][1]]()).within(() => {
                    cy.get(LECollaborationPage[functions[i][2]]()).contains(users.learner01.learner_01_fname).click({force:true})  
                })
            }
            cy.get(LESocialFlyoverModal.getViewProfileBtn()).should('exist')
            cy.get(LESocialFlyoverModal.getSendMessageBtn()).should('exist')
            cy.get(LESocialFlyoverModal.getChatOnTeamsBtn()).should('exist')
        }
    })

    it('Verify Chat in Collaboration', () => {  
        //Verify Clicking Chat on Teams Button Opens the Modal
        cy.get(LECollaborationPage.getChatOnTeamsBtn()).click()
        cy.get(LEChatOnTeamsModal.getModalHeader()).should('contain', 'Chat on Microsoft Teams')

        //Verify a Max of 20 Members can be Selected
        cy.get(LEChatOnTeamsModal.getMembersDDown()).click()
        for (let i = 0; i < 22; i++) {
            //We will not be able to add more than 20 members, so any click after 20 should not do anything
            cy.get(LEChatOnTeamsModal.getMembersList() ).find('li').eq(i+1).click()
        }
        cy.get(LEChatOnTeamsModal.getModalHeader()).contains('Chat on Microsoft Teams').click() //Hide DDown
        //Verify only 20 members were selected
        cy.get(LEChatOnTeamsModal.getSelectedMembersContainer()).find(LEChatOnTeamsModal.getSelectedMemberPill()).its('length').should('eq', 20)

        //Verify Modal Can be Cancelled
        cy.get(LEChatOnTeamsModal.getCancelBtn()).click()
        cy.get(LEChatOnTeamsModal.getModalHeader()).should('not.exist')

        //Verify Members can be Searched for
        cy.get(LECollaborationPage.getChatOnTeamsBtn()).click()
        cy.get(LEChatOnTeamsModal.getMembersDDown()).click()
        cy.get(LEChatOnTeamsModal.getMembersSearchTxtF()).type(users.sysAdmin.admin_sys_01_fname)
        LEChatOnTeamsModal.getMembersOpt(users.sysAdmin.admin_sys_01_fname)
        cy.get(LEChatOnTeamsModal.getSelectedMemberPill()).contains(users.sysAdmin.admin_sys_01_fname).should('exist')

        //Verify a Member can Be Removed by Clicking on their Name in the DDown list
        LEChatOnTeamsModal.getMembersOpt(users.sysAdmin.admin_sys_01_fname)
        cy.get(LEChatOnTeamsModal.getSelectedMemberPill()).should('not.exist')

        //Verify a Member can be Removed by Clicking the x in their Pill
        cy.get(LEChatOnTeamsModal.getMembersSearchTxtF()).clear().type(users.learner02.learner_02_fname)
        LEChatOnTeamsModal.getMembersOpt(users.learner02.learner_02_fname)
        cy.get(LEChatOnTeamsModal.getSelectedMemberPill()).contains(users.learner02.learner_02_fname).should('exist').parent().within(() => {
            cy.get(LEChatOnTeamsModal.getPillClearBtn()).click()
        })
        cy.get(LEChatOnTeamsModal.getSelectedMemberPill()).should('not.exist')
        cy.get(LEChatOnTeamsModal.getCancelBtn()).click()
    })
})