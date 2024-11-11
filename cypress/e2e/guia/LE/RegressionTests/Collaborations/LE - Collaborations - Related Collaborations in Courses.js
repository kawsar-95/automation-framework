import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LESocialFlyoverModal from '../../../../../../helpers/LE/pageObjects/Modals/LESocialFlyover.modal'
import LEYourCollaborationModal from '../../../../../../helpers/LE/pageObjects/Modals/LEYourCollaborations.modal'
import LECreateCollaborationPostModal from '../../../../../../helpers/LE/pageObjects/Modals/LECreateCollaborationPost.modal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { collaborationDetails, collaborationNames } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'

describe('LE - Collaborations - Related Collaborations in Courses', function(){

    before(function() {
        //Create 4 posts Via API
        for (let i = 0; i < 4; i++) {
            cy.createCollaborationPost(Cypress.env('A_COLLABORATION_ID'), `${i} - ${collaborationDetails.postSummary}`, collaborationDetails.postDescription, "General")
        }
        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')
        LEDashboardPage.turnOffNextgenToggle()
        cy.logoutAdminA5()
    })
 
    beforeEach(() => {
        //Sign in, navigate to Catalog
        cy.learnerLoginThruDashboardPage(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        cy.get(LECollaborationPage.getPageTitle(),{timeout:15000}).should('be.visible').and('contain','Catalog')
    })

    for (let i = 0; i < collaborationDetails.courseTypes.length - 1; i++) {
        it(`Verify Related Collaborations in ${collaborationDetails.courseTypes[i]}`, () => {         
            LEFilterMenu.SearchForCourseByName(collaborationDetails.courseNames2[i])
            cy.get(LECoursesPage.getCourseCardName()).should('be.visible').and('contain',`${collaborationDetails.courseNames2[i]}`)
            cy.get(LECoursesPage.getCourseCardName()).contains(collaborationDetails.courseNames2[i]).click()

            //Verify Collaborations Section Exists in Side Menu
            cy.get(LECoursesPage.getCollaborationContainer()).should('contain', 'Collaborations Activity')

            //Verify Post Name is Clickable and Navigates to Post Details
            cy.get(LECoursesPage.getPostSummary()).contains(`${i + 1} - ${collaborationDetails.postSummary}`).click()
            cy.get(LECollaborationPage.getPageHeader()).should('contain', `Post by ${collaborationDetails.l01Name}`)
            cy.go('back')

            //Verify Max of 3 Posts are Displayed
            cy.get(LECoursesPage.getAllPostsContainer()).find('li')
                .its('length').should('eq', 3)
            
            //Verify View All Related Collaborations Link Opens the Collaborations Modal
            cy.get(LECoursesPage.getViewAllCollaborationsBtn()).parent().click()
            cy.get(LEYourCollaborationModal.getModal()).should('be.visible')
            cy.get(LEYourCollaborationModal.getModal()).within(() => {
                cy.get(LEYourCollaborationModal.getCollaborationContainer())
                .its('length').should('eq', 10)
                cy.get(LEYourCollaborationModal.getModalCloseBtn()).click()
            })

            //Verify Post Author Name is Clickable and Opens the Social Flyover
            cy.get(LECoursesPage.getPostSummary()).contains(`${i + 1} - ${collaborationDetails.postSummary}`).parents(LECoursesPage.getCollaborationPostContainer())
                .within(() => {
                    cy.get(LECoursesPage.getPostAuthorName()).contains(collaborationDetails.l01Name).click()
                })
            cy.get(LESocialFlyoverModal.getViewProfileBtn()).should('exist')
            
            //Verify Collaboration Name in Post is Clickable and Opens the Collaboration Activity Page
            cy.get(LECoursesPage.getPostSummary()).contains(`${i + 1} - ${collaborationDetails.postSummary}`).parents(LECoursesPage.getCollaborationPostContainer())
                .within(() => {
                    cy.get(LECoursesPage.getPostCollaborationName()).click({force:true})
                })
            cy.get(LECollaborationPage.getPageTitle()).should('contain', collaborationNames.A_COLLABORATION_NAME)

            if(collaborationDetails.courseTypes[i] === 'Curriculum') {
                //Delete Collaboration Posts after final test
                for (let j = 0; j < 4; j++) {
                    LECollaborationsActivityPage.getDeletePostByName(`${j} - ${collaborationDetails.postSummary}`)
                }
            }  
        })
    }

    it(`Verify Empty State Single Related Collaboration in Course`, () => {
        LEFilterMenu.SearchForCourseByName(collaborationDetails.courseNames2[3])
        cy.get(LECoursesPage.getCourseCardName()).should('be.visible').and('contain',`${collaborationDetails.courseNames2[3]}`)
        cy.get(LECoursesPage.getCourseCardName()).contains(collaborationDetails.courseNames2[3]).click()

        //Verify Collaborations Section Exists in Side Menu
        cy.get(LECoursesPage.getCollaborationContainer()).should('contain', 'Collaborations Activity')

        //Verify Single Collaboration is Linked and Clickable
        cy.get(LECoursesPage.getCollaborationLink()).contains(collaborationNames.F_COLLABORATION_NAME).click()
        cy.get(LECollaborationPage.getPageTitle()).should('contain', collaborationNames.F_COLLABORATION_NAME)
        cy.go('back')

        //Verify there is No Activity in the Right Pane
        cy.get(LECoursesPage.getNoActivityTitle()).should('contain', 'Start the Conversation')

        //Verify the Create Post Button
        cy.get(LECoursesPage.getCreatePostBtn()).click()
        cy.get(LECreateCollaborationPostModal.getModalTitle()).should('contain', 'Create Post')
        cy.get(LECreateCollaborationPostModal.getModalCloseBtn()).click()     
    })
})