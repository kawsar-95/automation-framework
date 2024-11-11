import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import LECreateCollaborationPostModal from '../../../../../../helpers/LE/pageObjects/Modals/LECreateCollaborationPost.modal'
import LEDeleteModal from '../../../../../../helpers/LE/pageObjects/Modals/LEDelete.modal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { collaborationDetails, collaborationNames, toastMessages } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'

describe('LE - Collaborations - Create Question Post', function(){
    try {
        beforeEach(() => {
            cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
            //Sign in, navigate to Collaborations 
            cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
            LEDashboardPage.getTileByNameThenClick('Collaborations')
            LEDashboardPage.getShortWait()
        })
    
        it('Verify Creating a Question Post', () => {
            //Verify Create Post button and Create Post panel exist in all activity and collaboration activity
            cy.get(LECollaborationPage.getCreatePostBtn()).should('exist')
            cy.get(LECollaborationPage.getCreateQuestionPostBtn()).should('exist')
            cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.A_COLLABORATION_NAME).click()
            cy.get(LECollaborationPage.getCreatePostBtn()).should('exist')

            //Create question type post
            cy.get(LECollaborationPage.getCreateQuestionPostBtn()).should('exist').click()
    
            //Verify Summary Field Cannot be Blank
            cy.get(LECreateCollaborationPostModal.getSummaryTxtF()).type('a').clear()
            cy.get(LECreateCollaborationPostModal.getSummaryErrorMsg()).should('contain', miscData.char_0_error)
    
            //Verify Summary Field Does not Allow >255 Chars
            cy.get(LECreateCollaborationPostModal.getSummaryTxtF()).clear().invoke('val', LEDashboardPage.getLongString()).type('a')
            cy.get(LECreateCollaborationPostModal.getSummaryErrorMsg()).should('contain', miscData.le_char_255_error)
    
            //Enter Valid Value in Summary Field
            cy.get(LECreateCollaborationPostModal.getSummaryTxtF()).clear().type(collaborationDetails.postSummary)
    
            //Verify Additional Information Field Does not Allow >4000 Chars
            cy.get(LECreateCollaborationPostModal.getDescriptionTxtF()).invoke('text', LEDashboardPage.getLongString(4000)).focus().type('a', {force:true})
            cy.get(LECreateCollaborationPostModal.getDescriptionErrorMsg()).should('contain', miscData.le_char_4000_error)
    
            //Enter Valid Value in Additional Information Field
            cy.get(LECreateCollaborationPostModal.getDescriptionTxtF()).clear({force:true})
            cy.get(LECreateCollaborationPostModal.getDescriptionTxtF()).type(collaborationDetails.postDescription)
    
            //Verify a File can be Attached
            cy.get(LEDashboardPage.getFileInput()).attachFile(`${miscData.resource_image_folder_path}${collaborationDetails.resourceOne[2]}`)
    
            //All attachment verification is done in 'LE - Collaborations - Post Attachments.js'
    
            //Verify Pressing Post Button Scans Files and Creates Post
            LEDashboardPage.getShortWait() //Ensure files have been uploaded
            cy.get(LECreateCollaborationPostModal.getCreatePostBtn()).click()
            LEDashboardPage.getMediumWait() //Wait for post to complete
    
            //Verify Toast Notification
            cy.get(LEDashboardPage.getToastNotificationMsg()).should('contain', toastMessages.questionSuccess)
        })
    
        it('Verify Question Post', () => {
            //Go to Post
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click()
    
            //Verify Additional Information
            cy.get(LECollaborationsActivityPage.getPostContent()).should('contain.text', collaborationDetails.postDescription)
    
            //Verify Attachment was Saved
            cy.get(LECollaborationsActivityPage.getPostAttachmentLabel()).should('contain', collaborationDetails.resourceOne[2].slice(0, -4))

            //Verify Post can be Edited
            LECollaborationsActivityPage.getPostOptionsBtnByTitle(collaborationDetails.postSummary)
            cy.get(LECollaborationsActivityPage.getPostOptionBtn()).contains('Edit Question').click()

            //Verify modal header
            cy.get(LECreateCollaborationPostModal.getModalTitle()).should('contain', 'Edit Question')
        })

    }
    finally {
        it('Cleanup - Delete Collaboration Question Post', () => {
            LECollaborationsActivityPage.getDeletePostByName(collaborationDetails.postSummary, 'Question')
        })
    }
})