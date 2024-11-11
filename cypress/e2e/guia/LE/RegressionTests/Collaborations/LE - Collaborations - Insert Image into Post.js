import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import LECreateCollaborationPostModal from '../../../../../../helpers/LE/pageObjects/Modals/LECreateCollaborationPost.modal'
import LEUploadFileModal from '../../../../../../helpers/LE/pageObjects/Modals/LEUploadFileModal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { collaborationDetails, collaborationNames, attachments } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'

describe('LE - Collaborations - Insert Image into Post', function(){
    try {
        beforeEach(() => {
            cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
            //Sign in, navigate to Collaborations
            cy.learnerLoginThruDashboardPage(users.learner01.learner_01_username, users.learner01.learner_01_password) 
            LEDashboardPage.getTileByNameThenClick('Collaborations')
            LEDashboardPage.getShortWait()
        })
    
        it('Verify Learner Can Insert Image into Post Via Rich Text Editor', () => {
            //Navigate to Collaboration and Create Post
            cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.A_COLLABORATION_NAME).click()
            cy.get(LECollaborationPage.getCreatePostBtn()).click()
            cy.get(LECreateCollaborationPostModal.getSummaryTxtF()).type(collaborationDetails.postSummary)
            cy.get(LECreateCollaborationPostModal.getDescriptionTxtF()).clear() //Clear first so line break does not happen when typing
            cy.get(LECreateCollaborationPostModal.getDescriptionTxtF()).type(collaborationDetails.postDescription)
    
            //Verify Only Image Type Files Can be Uploaded
            LEDashboardPage.getInsertImageViaFile()
            cy.get(LEDashboardPage.getElementByDataNameAttribute(LEUploadFileModal.getUploadContainer()) + ' ' + LEDashboardPage.getFileInput())
                .attachFile(miscData.resource_pdf_folder_path + attachments.fileNames2[0])
            cy.get(LEUploadFileModal.getUploadedFileErrorMsg()).should('contain', 'Invalid file type selected.')
            cy.get(LEUploadFileModal.getFooterBtn()).contains('Confirm').should('have.attr', 'aria-disabled', 'true')
            LEUploadFileModal.getDeleteUploadedFileByName('Security Training')
    
            //Verify Only 1 Image Can be Uploaded at a Time
            cy.get(LEDashboardPage.getElementByDataNameAttribute(LEUploadFileModal.getUploadContainer()) + ' ' + LEDashboardPage.getFileInput())
                .attachFile(miscData.resource_image_folder_path + attachments.fileNames2[1])
            cy.get(LEDashboardPage.getElementByDataNameAttribute(LEUploadFileModal.getUploadContainer()) + ' ' + LEDashboardPage.getFileInput())
                .attachFile(miscData.resource_image_folder_path + attachments.fileNames2[2])
            cy.get(LEUploadFileModal.getFooterBtn()).contains('Confirm').should('have.attr', 'aria-disabled', 'true')
    
            //Remove 1 Image and Upload Remaining
            LEUploadFileModal.getDeleteUploadedFileByName(attachments.fileNames2[2].slice(0, -4))
            cy.get(LEUploadFileModal.getFooterBtn()).contains('Confirm').should('have.attr', 'aria-disabled', 'false')
            cy.get(LEUploadFileModal.getFooterBtn()).contains('Confirm').click()
            cy.intercept('/api/rest/v2/learner-uploads').as('imageUpload').wait('@imageUpload') //Wait for upload to complete
    
            //Save Post
            LEDashboardPage.getVShortWait()
            cy.get(LECreateCollaborationPostModal.getCreatePostBtn()).click()
            cy.get(LEDashboardPage.getToastNotificationCloseBtn()).click()
        })
        //This it block is commentted out due to environmental issues. 
        // it('Verify Inserted Image in Post Persisted', () => {
        //     //Navigate to Post Detail Page
        //     cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click()
    
        //     //Verify Image Src is Within the Post Content
        //     cy.get(LECollaborationsActivityPage.getPostContent()).contains(collaborationDetails.postDescription).children()
        //         .should('have.attr', 'src').and('include', attachments.fileNames2[1].slice(0, -4))
            
        //     //Verify image is aligned to the left by default
        //     cy.get(LECollaborationsActivityPage.getPostContent()).contains(collaborationDetails.postDescription).children()
        //         .should('have.attr', 'style').and('include', "text-align: left")
        // })
    }
    finally {
        it('Cleanup - Delete Collaboration Post', () => {
            LECollaborationsActivityPage.getDeletePostByName(collaborationDetails.postSummary)
        })
    }
})