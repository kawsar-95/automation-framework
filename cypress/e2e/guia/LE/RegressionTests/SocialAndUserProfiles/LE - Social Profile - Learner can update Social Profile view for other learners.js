import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import LECollaborationPage from "../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage";
import LECollaborationsActivityPage from "../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LESocialFlyoverModal from "../../../../../../helpers/LE/pageObjects/Modals/LESocialFlyover.modal";
import LESocialProfilePage from "../../../../../../helpers/LE/pageObjects/User/LESocialProfilePage";
import { collaborationDetails, collaborationNames } from "../../../../../../helpers/TestData/Collaborations/collaborationDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import LELearnerManagementPage, { SocialProfileOptions } from "../../../../../../helpers/LE/pageObjects/LearnerManagement/LELearnerManagementPage"
import LESideMenu from "../../../../../../helpers/LE/pageObjects/Menu/LESideMenu"
import LEManageTemplateCoursesPage from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateCoursesPage"
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage"


let i = 2;
describe('C1811 - AUT-433 - GUIA-Story - Acceptance Test: NLE-1891 - A learner can choose which content appears on their social profile', function () {

    before(function () {
        //Create 1 posts via API 
        cy.createCollaborationPost(Cypress.env('A_COLLABORATION_ID'), `${collaborationDetails.posts[i]} - ${collaborationDetails.postSummary}`, LEDashboardPage.getLongString(1000), "General")

        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)

        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        //Clickin on the Settings Tab
        LELearnerManagementPage.getNavbarMenuItemByNameAndClick("Settings")
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(LEProfilePage.getProfilePageTitle()).should('contain.text', 'Settings')

        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.Certificates).should('have.text', SocialProfileOptions.Certificates)
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.CompetenciesAndBadges).should('have.text', SocialProfileOptions.CompetenciesAndBadges)
        LELearnerManagementPage.getCoursesCheckboxByName(SocialProfileOptions.Courses).should('have.text', SocialProfileOptions.Courses)

        LELearnerManagementPage.getSettingsToggleByName(SocialProfileOptions.Certificates , 'true')
        LELearnerManagementPage.getSettingsToggleByName(SocialProfileOptions.CompetenciesAndBadges , 'true')
        LELearnerManagementPage.getSettingsToggleByName(SocialProfileOptions.Courses , 'true')

        LELearnerManagementPage.saveIfSettingsChanged()

    })

   
    it('Verify Single Collaborations Activity Page', () => {
      
        //Sign in, navigate to Collaboration
        cy.learnerLoginThruDashboardPage(users.learner02.learner_02_username, users.learner02.learner_02_password)
        LEDashboardPage.getTileByNameThenClick('Collaborations')
        cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.A_COLLABORATION_NAME).click()
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
      
        //Sign in, navigate to Collaboration
        cy.learnerLoginThruDashboardPage(users.learner02.learner_02_username, users.learner02.learner_02_password)
        LEDashboardPage.getTileByNameThenClick('Collaborations')
        cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.A_COLLABORATION_NAME).click()
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

        cy.get(LESocialProfilePage.getSocialProfileModuleType()).contains('Badges').should('be.visible')
        cy.get(LESocialProfilePage.getSocialProfileModuleType()).contains('Competencies').should('be.visible')
        cy.get(LESocialProfilePage.getSocialProfileModuleType()).contains('Courses').should('be.visible')
        //Sections should be laid out
        cy.get(LESocialProfilePage.getSocialProfileBadgesModuleTitle()).should('be.visible')
        cy.get(LESocialProfilePage.getSocialProfileCompetenciesModuleTitle()).should('be.visible')
        cy.get(LESocialProfilePage.getSocialProfileCoursesModuleTitle()).should('be.visible')

    })

    it(`Update the settings from ${users.learner01.learner_01_fname} so that ${users.learner02.learner_02_fname} can view it ` , ()=>{
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)

        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')

        cy.get(LEProfilePage.getProfilePageTitle()).should('contain.text', 'Overview')
        cy.get(LEProfilePage.getEditProfileBtn()).should('be.visible')
        cy.get(LEProfilePage.getChangePasswordBtn()).should('be.visible')
        cy.get(LEProfilePage.getViewSocialProfileBtn()).should('be.visible')

        //Clickin on the Settings Tab
        LELearnerManagementPage.getNavbarMenuItemByNameAndClick("Settings")
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(LEProfilePage.getProfilePageTitle()).should('contain.text', 'Settings')
        //Asserting Social Profile
        //Here first has been used to select the first header
        cy.get(LELearnerManagementPage.getSocialProfileHeader()).first().should('have.text', 'Social Profile')
        //Asserting Options 
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.Certificates).should('have.text', SocialProfileOptions.Certificates)
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.CompetenciesAndBadges).should('have.text', SocialProfileOptions.CompetenciesAndBadges)
        LELearnerManagementPage.getCoursesCheckboxByName(SocialProfileOptions.Courses).should('have.text', SocialProfileOptions.Courses)

        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.Certificates).find('input').should('have.attr', 'value', 'true')
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.Certificates).find('input').click({force:true})
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.Certificates).find('input').should('have.attr', 'value', 'false')

        cy.get(LELearnerManagementPage.getSaveBtn()).should('have.attr', 'aria-disabled', 'false').click()

        cy.get(LEManageTemplateCoursesPage.getManageTemplateSuccessMessage(), { timeout: 1500000 }).should('be.visible').and('contain', 'Changes Saved.')

        //Going back to Social Profile and assert that Courses dont show 
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')

        cy.get(LESocialProfilePage.getSocialProfileModuleType()).contains('Certificates').should('not.exist')
        cy.get(LESocialProfilePage.getSocialProfileCertificcatesModuleTitle()).should('not.exist')
    })

    it('Verify that a learner can view another learners Updated social profile ', () => {
       
        //Sign in, navigate to Collaboration
        cy.learnerLoginThruDashboardPage(users.learner02.learner_02_username, users.learner02.learner_02_password)
        LEDashboardPage.getTileByNameThenClick('Collaborations')
        cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.A_COLLABORATION_NAME).click()
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
        cy.get(LESocialProfilePage.getSocialProfileHeaderName()).should('be.visible').and('contain.text', users.learner01.learner01_full_name)

        cy.get(LESocialProfilePage.getSocialProfileModuleType()).contains('Badges').should('be.visible')
        cy.get(LESocialProfilePage.getSocialProfileModuleType()).contains('Competencies').should('be.visible')
        cy.get(LESocialProfilePage.getSocialProfileModuleType()).contains('Courses').should('not.exist')
        //Sections should be laid out
        cy.get(LESocialProfilePage.getSocialProfileBadgesModuleTitle()).should('be.visible')
        cy.get(LESocialProfilePage.getSocialProfileCompetenciesModuleTitle()).should('be.visible')
        cy.get(LESocialProfilePage.getSocialProfileCoursesModuleTitle()).should('not.exist')

    })


    after('Cleanup - Delete created Collaboration Posts', () => {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Collaborations')
        cy.get(LECollaborationsActivityPage.getLoadMorePostsBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 150000 }).should('not.exist')
        LECollaborationsActivityPage.getDeletePostByName(`${collaborationDetails.posts[i]} - ${collaborationDetails.postSummary}`)

    })
})