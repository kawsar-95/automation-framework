import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECreateCollaborationPostModal from '../../../../../../helpers/LE/pageObjects/Modals/LECreateCollaborationPost.modal'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARCollaborationActivityEditPage from '../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationActivityEditPage'
import { collaborationDetails } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('AR - Collaborations - Collaboration Activity - Edit and Delete Post', function () {

    before(function () {
        cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
        //Create a post via API
        cy.createCollaborationPost(Cypress.env('A_COLLABORATION_ID'), collaborationDetails.postSummary, collaborationDetails.postDescription, "General")
        //Add attachment to post
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Collaborations')
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        LECollaborationsActivityPage.getPostOptionsBtnByTitle(collaborationDetails.postSummary)
        cy.get(LECollaborationsActivityPage.getPostOptionBtn()).contains('Edit Post').click()
        cy.get(LEDashboardPage.getFileInput()).attachFile(`${commonDetails.filePath}${commonDetails.posterImgName}`)
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.get(LECreateCollaborationPostModal.getCreatePostBtn()).click()
        cy.intercept('/api/rest/v2/learner-uploads').as('Uploads').wait('@Uploads')
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
         //Wait for uploads to complete
        
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Collaboration Activity
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Engage')) , {timeout:15000}).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Collaboration Activity'))
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.wrap(arDashboardPage.AddFilter('Summary', 'Contains', collaborationDetails.postSummary))
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.get(arDashboardPage.getTableCellName(8), { timeout: 15000 }).contains(collaborationDetails.postSummary).click()
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Edit Activity'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit Activity')).click()
        cy.get(arDashboardPage.getPageHeaderTitle(),{timeout:15000}).should('contain','Edit Activity')
        
    })

    after(function () {
        //Delete Collaboration Activity'
        cy.go('back')
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Delete Activity'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Delete Activity')).click()
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn()),{timeout:15000}).should('exist')
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click()
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
    })

    it('Verify Collaboration Activity Fields, Edit Activity and Save', () => {
        //Verify Summary Field Does Not Allow >255 Chars
        cy.get(ARCollaborationActivityEditPage.getSummaryTxtF(),{timeout:15000}).should('be.visible').and('exist')
        cy.get(ARCollaborationActivityEditPage.getSummaryTxtF()).clear().invoke('val', arDashboardPage.getLongString()).type('a')
        cy.get(ARCollaborationActivityEditPage.getSummaryErrorMsg()).should('contain', miscData.char_255_error)
        //Enter Valid Value in Summary Field
        cy.get(ARCollaborationActivityEditPage.getSummaryTxtF()).clear().type(collaborationDetails.postSummary + commonDetails.appendText)

        //Verify Additional Information Field Does Not Allow >255 Chars
        cy.get(ARCollaborationActivityEditPage.getDescriptionTxtF()).clear()
        cy.get(ARCollaborationActivityEditPage.getDescriptionTxtF()).invoke('text', arDashboardPage.getLongString(4000)).type('a')
        cy.get(ARCollaborationActivityEditPage.getDescriptionErrorMsg()).should('contain', miscData.char_4000_error)
        //Enter Valid Value in Additional Information Field
        cy.get(ARCollaborationActivityEditPage.getDescriptionTxtF()).clear()
        cy.get(ARCollaborationActivityEditPage.getDescriptionTxtF()).type(collaborationDetails.postDescription + commonDetails.appendText)

        //Verify Attachment
        cy.get(ARCollaborationActivityEditPage.getAttachmentFilePreview()).parent().parent().within(() => {
            cy.get(ARCollaborationActivityEditPage.getAttachmentFileImage())
            .should('have.attr', 'aria-label').and('include', commonDetails.posterImgName.slice(0, -4))
        })

        //Delete Attachment
        cy.get(ARCollaborationActivityEditPage.getDeleteAttachmentBtn()).click()
        
        //Verify Read Only Fields
        cy.get(arDashboardPage.getElementByDataNameAttribute(ARCollaborationActivityEditPage.getPostedBy()))
            .should('contain', collaborationDetails.l01Name)
        cy.get(arDashboardPage.getElementByDataNameAttribute(ARCollaborationActivityEditPage.getPostedOn()))
             .should('contain', commonDetails.timestamp.slice(0, 10))
        cy.get(arDashboardPage.getElementByDataNameAttribute(ARCollaborationActivityEditPage.getPostedIn()))
            .should('contain', miscData.a_collaboration_name)
        cy.get(arDashboardPage.getElementByDataNameAttribute(ARCollaborationActivityEditPage.getPostType()))
            .should('contain', 'General')

        //Notes Field Verification is Covered in 'AR - Collaborations - Collaboration Activity - Add Notes.js'

        //Save the Changes
        cy.get(arDashboardPage.getSaveBtn()).should('have.text' , 'Save').click()
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should('not.exist')
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('contain', 'Collaboration activity has been updated.')
        cy.get(arDashboardPage.getToastCloseBtn()).click()
       
    })

    it('Verify Edits Persisted', () => {
        //Verify Summary Field Edits Persisted
        cy.get(ARCollaborationActivityEditPage.getSummaryTxtF()).should('have.value', collaborationDetails.postSummary + commonDetails.appendText)

        //Verify Additional Information Field Edits Persisted
        cy.get(ARCollaborationActivityEditPage.getDescriptionTxtF()).should('contain.text', collaborationDetails.postDescription + commonDetails.appendText)

        //Verify Attachment Delete Persisted
        //Commented out due to bug https://absorblms.atlassian.net/browse/NLE-4002. Once this bug is resolved then piece of code will be re-enabled
        //cy.get(ARCollaborationActivityEditPage.getAttachmentsSectionLabel()).should('not.exist')
    })
})