import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import LECreateCollaborationPostModal from '../../../../../../helpers/LE/pageObjects/Modals/LECreateCollaborationPost.modal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { collaborationDetails, collabNames } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'

let Collabs = collabNames.splice(0,11) //Array of All Collaboration Names minus the last

describe('LE - Collaborations - Select Collaboration to Post In', function(){
    try {
        beforeEach(() => {
            cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
            //Sign in, navigate to Collaborations 
            cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
            LEDashboardPage.getTileByNameThenClick('Collaborations')
        })
    
        it('Verify Post Can Be Created From All Collaborations Activity Page', () => {
            //Create Post from All Collaborations Activity Page
            cy.get(LECollaborationPage.getCreatePostBtn()).click()
            cy.get(LECreateCollaborationPostModal.getSummaryTxtF()).type(`0 - ${collaborationDetails.postSummary}`)

            //Verify Post In Dropdown has Default Blank Value
            cy.get(LECollaborationPage.getElementByNameAttribute(LECreateCollaborationPostModal.getPostInDDown()))
                .should('contain', 'Select a collaboration')
            
            //Verify Create Button is disabled until collaboration has been selected
            cy.get(LECreateCollaborationPostModal.getCreatePostBtn()).should('have.attr', 'aria-disabled', 'true')

            //Verify Post In Dropdown contains all collaborations Learner has access to
            cy.get(LECollaborationPage.getElementByNameAttribute(LECreateCollaborationPostModal.getPostInDDown())).invoke('text').then(($list)=> {
                cy.wrap($list.slice(22)).as(`list`) //Store list text values
                    cy.get(`@list`).should('eq', Collabs.join('')) //Compare against collaborations array
            })

            //Select Collaboration and create post
            cy.get(LECollaborationPage.getElementByNameAttribute(LECreateCollaborationPostModal.getPostInDDown())).select(Collabs[0])
            cy.get(LECreateCollaborationPostModal.getCreatePostBtn()).click()
            LEDashboardPage.getShortWait()

            //Verify Post was Created in Correct Collaboration
            cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(Collabs[0]).click()
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(`0 - ${collaborationDetails.postSummary}`).should('exist')
        })
    
        it('Verify Post Can Be Created in Different Collaboration', () => {
            //Navigate to Single Collaboration
            cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(Collabs[0]).click()

            //Create Post from Single Collaboration Activity Page
            cy.get(LECollaborationPage.getCreatePostBtn()).click()
            cy.get(LECreateCollaborationPostModal.getSummaryTxtF()).type(`1 - ${collaborationDetails.postSummary}`)

            //Verify Post In Dropdown has Default Collaboration value
            cy.get(LECollaborationPage.getElementByNameAttribute(LECreateCollaborationPostModal.getPostInDDown()))
                .should('contain', Collabs[0])

            //Select Different Collaboration to Create Post In
            cy.get(LECollaborationPage.getElementByNameAttribute(LECreateCollaborationPostModal.getPostInDDown())).select(Collabs[1])
            cy.get(LECreateCollaborationPostModal.getCreatePostBtn()).click()
            LEDashboardPage.getShortWait()
            cy.get(LECollaborationPage.getBackBtn()).click() //Go back to all collaboration activity page

            //Verify Post was Created in Correct Collaboration
            cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(Collabs[1]).click()
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(`1 - ${collaborationDetails.postSummary}`).should('exist')
        })

        it('Verify Post In Selection is Hidden When Editing Post', () => {
            //Edit Post
            LECollaborationsActivityPage.getPostOptionsBtnByTitle(`1 - ${collaborationDetails.postSummary}`)
            cy.get(LECollaborationsActivityPage.getPostOptionBtn()).contains('Edit Post').click()

            //Verify Post in Dropdown is not displayed
            cy.get(LECollaborationPage.getElementByNameAttribute(LECreateCollaborationPostModal.getPostInDDown())).should('not.exist')
        })
    }
    finally {
        it('Cleanup - Delete Collaboration Posts', () => {
            for (let i = 0; i < 2; i++) {
                LECollaborationsActivityPage.getDeletePostByName(`${i} - ${collaborationDetails.postSummary}`)
            }
        })
    }
})