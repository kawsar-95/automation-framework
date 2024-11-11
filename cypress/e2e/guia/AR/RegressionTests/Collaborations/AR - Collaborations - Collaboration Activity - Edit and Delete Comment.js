import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARCollaborationActivityEditPage from '../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationActivityEditPage'
import { collaborationDetails, collaborationNames } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { users } from '../../../../../../helpers/TestData/users/users'


describe('AR - Collaborations - Collaboration Activity - Edit and Delete Comment', function(){

    before(function() {
        //Create a post with Learner 1
        cy.createCollaborationPost(Cypress.env('B_COLLABORATION_ID'), collaborationDetails.postSummary, collaborationDetails.postDescription, "General")
        cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Collaborations')
        LEDashboardPage.getLShortWait()
        //Select the Post and Add a Comment
        cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click()
        LECollaborationPage.getAddComment(collaborationDetails.postComment)
        LEDashboardPage.getVShortWait()
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Collaboration Activity
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Engage'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Collaboration Activity'))
        cy.intercept('/api/rest/v2/admin/reports/collaboration-activity/operations').as('getCollabActivity').wait('@getCollabActivity')
        //Filter for Collaboration Activity and Edit it
        cy.wrap(arDashboardPage.AddFilter('Activity Type', 'Comment'))
        cy.wrap(arDashboardPage.AddFilter('Date Added', 'After', commonDetails.timestamp.slice(0,10)))
        cy.get(arDashboardPage.getTableCellName(2)).contains(collaborationNames.B_COLLABORATION_NAME).click()
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Edit Activity'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit Activity')).click()
        cy.intercept('/api/rest/v2/admin/reports/collaboration-activity/operations').as('EditCollabActivity').wait('@EditCollabActivity')
    })

    after(function() {
        cy.go('back')
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Delete Activity'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Delete Activity')).click()
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click()
        arDashboardPage.getShortWait()
    })

    it('Verify Collaboration Activity Fields, Edit Activity and Save', () => {
        //Verify Comment Field Does Not Allow >255 Chars
        cy.get(ARCollaborationActivityEditPage.getDescriptionTxtF()).clear()
        cy.get(ARCollaborationActivityEditPage.getDescriptionTxtF()).invoke('text', arDashboardPage.getLongString(4000)).type('a')
        cy.get(ARCollaborationActivityEditPage.getDescriptionErrorMsg()).should('contain', miscData.char_4000_error)
        //Enter Valid Value in Comment Field
        cy.get(ARCollaborationActivityEditPage.getDescriptionTxtF()).clear()
        cy.get(ARCollaborationActivityEditPage.getDescriptionTxtF()).type(`${collaborationDetails.postComment}${commonDetails.appendText}`)

        //Verify Read Only Fields
        cy.get(arDashboardPage.getElementByDataNameAttribute(ARCollaborationActivityEditPage.getPostedBy()))
            .should('contain', collaborationDetails.l01Name)
        cy.get(arDashboardPage.getElementByDataNameAttribute(ARCollaborationActivityEditPage.getPostedOn()))
            .should('contain', commonDetails.timestamp.slice(0,10))
        cy.get(arDashboardPage.getElementByDataNameAttribute(ARCollaborationActivityEditPage.getPostedIn()))
            .should('contain', collaborationNames.B_COLLABORATION_NAME)
        cy.get(arDashboardPage.getElementByDataNameAttribute(ARCollaborationActivityEditPage.getPostType()))
            .should('contain', 'Comment')
        arDashboardPage.getShortWait()
        
        //Notes Field Verification is Covered in 'AR - Collaborations - Collaboration Activity - Add Notes.js'

        //Save the Changes
        /cy.get(arDashboardPage.getSaveBtn()).click()
        arDashboardPage.getShortWait()
    })

    it('Verify Edits Persisted', () => {
        //Verify Additional Information Field Edits Persisted
        cy.get(ARCollaborationActivityEditPage.getDescriptionTxtF()).should('contain.text', `${collaborationDetails.postComment}${commonDetails.appendText}`)
    })
})