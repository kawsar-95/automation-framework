import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import LEUploadFileModal from '../../../../../../helpers/LE/pageObjects/Modals/LEUploadFileModal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { collaborationDetails, attachments } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'
import LECreateCollaborationPostModal from '../../../../../../helpers/LE/pageObjects/Modals/LECreateCollaborationPost.modal'

describe('LE - Collaborations - Insert Image into Comment', function(){
    try {
        before(function() {
            //Create a post via API
            cy.createCollaborationPost(Cypress.env('A_COLLABORATION_ID'), collaborationDetails.postSummary, collaborationDetails.postDescription, "General")
        })
    
        beforeEach(() => {
            cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
            //Sign in, navigate to Collaborations
            cy.learnerLoginThruDashboardPage(users.learner01.learner_01_username, users.learner01.learner_01_password) 
            LEDashboardPage.getTileByNameThenClick('Collaborations')
            LEDashboardPage.getShortWait()
        })
    
        it('Verify Learner Can Insert Image into Comment Via Rich Text Editor', () => {
            //Navigate to Post Detail Page
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click()
    
            //Add Comment
            cy.get(LECollaborationPage.getCommentTxtF()).type(collaborationDetails.postComment)
    
            //Verify Only Image Type Files Can be Uploaded
            LEDashboardPage.getInsertImageViaFile()
            cy.get(LEDashboardPage.getFileInput()).attachFile(miscData.resource_pdf_folder_path + attachments.fileNames2[0])
            cy.get(LEUploadFileModal.getUploadedFileErrorMsg()).should('contain', 'Invalid file type selected.')
            cy.get(LEUploadFileModal.getFooterBtn()).contains('Confirm').should('have.attr', 'aria-disabled', 'true')
            LEUploadFileModal.getDeleteUploadedFileByName(attachments.fileNames2[0].slice(0, -4))
    
            //Verify Only 1 Image Can be Uploaded at a Time
            cy.get(LEDashboardPage.getFileInput()).attachFile(miscData.resource_image_folder_path + attachments.fileNames2[1])
            cy.get(LEDashboardPage.getFileInput()).attachFile(miscData.resource_image_folder_path + attachments.fileNames2[2])
            cy.get(LEUploadFileModal.getFooterBtn()).contains('Confirm').should('have.attr', 'aria-disabled', 'true')
    
            //Remove 1 Image and Upload Remaining
            LEUploadFileModal.getDeleteUploadedFileByName(attachments.fileNames2[2].slice(0, -4))
            cy.get(LEUploadFileModal.getFooterBtn()).contains('Confirm').should('have.attr', 'aria-disabled', 'false')
            cy.get(LEUploadFileModal.getFooterBtn()).contains('Confirm').click()
            cy.get(LECreateCollaborationPostModal.getCreatePostModalSpinner(),{timeout:15000}).should('not.exist')
            //Post Comment
            cy.get(LECollaborationPage.getPostCommentBtn()).contains('Post Comment').click()
            LEDashboardPage.getLShortWait()
        })
        //  //this it block is skipped due to environmental issues. 
        // it.skip('Verify Inserted Image in Comment Persisted', () => {
        //     //Navigate to Post Detail Page
        //     cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click()
        //     LEDashboardPage.getShortWait()
    
        //     //Verify Image Src is Within the Comment Content
        //     cy.get(LECollaborationPage.getCommentContent()).contains(collaborationDetails.postDescription).children()
        //         .should('have.attr', 'src').and('include', attachments.fileNames2[1].slice(0, -4))

        //     //Verify image is aligned to the left by default
        //     cy.get(LECollaborationPage.getCommentContent()).contains(collaborationDetails.postDescription).children()
        //         .should('have.attr', 'style').and('include', "text-align: left")
        // })
    }
    finally {
        it('Cleanup - Delete Collaboration Post', () => {
            LECollaborationsActivityPage.getDeletePostByName(collaborationDetails.postSummary)
        })
    }
})