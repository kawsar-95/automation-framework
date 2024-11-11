import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import LECreateCollaborationPostModal from '../../../../../../helpers/LE/pageObjects/Modals/LECreateCollaborationPost.modal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { collaborationDetails, collaborationNames, attachments } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'

describe('LE - Collaborations - Edit Post', function(){
    try {
        before(function() {
            //Create a post via API
            cy.createCollaborationPost(Cypress.env('A_COLLABORATION_ID'), collaborationDetails.postSummary, collaborationDetails.postDescription, "General")
        })
    
        beforeEach(() => {
            cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
            //Sign in, navigate to Collaborations
            cy.learnerLoginThruDashboardPage(users.learner02.learner_02_username, users.learner02.learner_02_password) 
            LEDashboardPage.getTileByNameThenClick('Collaborations')
            LEDashboardPage.getShortWait()
        })
    
        it('Verify Learner Cannot Edit Other Learners Posts', () => {
            //Assert Learner Can only Edit Their Own Post on the All Collaborations Recent Activity Page
            LECollaborationsActivityPage.getPostOptionsBtnByTitle(collaborationDetails.postSummary)
            cy.get(LECollaborationsActivityPage.getPostOptionBtn()).contains('Edit Post').should('not.exist')
            
            //Assert Learner Can only Edit Their Own Post on the Collaboration Recent Activity Page
            cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.A_COLLABORATION_NAME).click({force:true})
            LECollaborationsActivityPage.getPostOptionsBtnByTitle(collaborationDetails.postSummary)
            cy.get(LECollaborationsActivityPage.getPostOptionBtn()).contains('Edit Post').should('not.exist')
    
            //Assert Learner Can only Edit Their Own Post on the Collaboration Post Details Page
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).click({force:true})
            LECollaborationsActivityPage.getPostOptionsBtnByTitle(collaborationDetails.postSummary)
            cy.get(LECollaborationsActivityPage.getPostOptionBtn()).contains('Edit Post').should('not.exist')
        })
    
        it('Create Post, Verify Learner Can Edit Post From All Collaborations Activity Page', () => {
            //Create a post with Learner 2
            cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.A_COLLABORATION_NAME).click()
            cy.get(LECollaborationPage.getCreatePostBtn()).click()
            cy.get(LECreateCollaborationPostModal.getSummaryTxtF()).type(collaborationDetails.postSummary2)
            cy.get(LECreateCollaborationPostModal.getDescriptionTxtF()).type(collaborationDetails.postDescription)
            cy.get(LEDashboardPage.getFileInput()).attachFile(attachments.attachment1)
            cy.get(LECreateCollaborationPostModal.getBrowseBtn())
            LEDashboardPage.getShortWait() //Ensure file has been uploaded
            cy.get(LECreateCollaborationPostModal.getCreatePostBtn()).click()
            cy.intercept('/api/rest/v2/learner-uploads').as('learnerUploads').wait('@learnerUploads',{timeout: 60000}) //Wait for upload to complete
            LEDashboardPage.getShortWait()
            //Edit Post
            LECollaborationsActivityPage.getPostOptionsBtnByTitle(collaborationDetails.postSummary2)
            cy.get(LECollaborationsActivityPage.getPostOptionBtn()).contains('Edit Post').click()

            //Verify modal header
            cy.get(LECreateCollaborationPostModal.getModalTitle()).should('contain', 'Edit Post')
    
            //Assert All Values Persisted
            LEDashboardPage.getShortWait()
            // cy.get(LECreateCollaborationPostModal.getEditPostSummaryTxtF()).should('have.value', collaborationDetails.postSummary2)
            cy.get(LECreateCollaborationPostModal.getDescriptionTxtF()).should('contain.text', collaborationDetails.postDescription)
            cy.get(LECreateCollaborationPostModal.getAttachmentName()).contains('moose').should('exist')
    
            //Edit Post and Apply Changes
            cy.get(LECreateCollaborationPostModal.getEditPostSummaryTxtF()).type(collaborationDetails.appendedText)
            cy.get(LECreateCollaborationPostModal.getDescriptionTxtF()).type(collaborationDetails.appendedText)
            LECreateCollaborationPostModal.getDeleteAttachmentByName('moose')
            cy.get(LEDashboardPage.getFileInput()).attachFile(attachments.attachment2)
            cy.get(LECreateCollaborationPostModal.getBrowseBtn())
            LEDashboardPage.getShortWait() //Ensure file has been uploaded
            cy.get(LECreateCollaborationPostModal.getCreatePostBtn()).click() 
            cy.intercept('/api/rest/v2/learner-uploads').as('learnerUploads2').wait('@learnerUploads2') //Wait for upload to complete
            LEDashboardPage.getLongWait()
        })
    
        it('Verify Post Edits and Verify Learner Can Edit Post From Collaboration Activity Page', () => {
            //Go to Collaboration
            cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.A_COLLABORATION_NAME).click()
    
            //Assert Post Shows Edited Tag
            LECollaborationsActivityPage.getVerifyPostDateByTitle(collaborationDetails.postSummary2+collaborationDetails.appendedText, '(Edited)')
    
            //Edit Post From Collaboration Activity Page
            LECollaborationsActivityPage.getPostOptionsBtnByTitle(collaborationDetails.postSummary2+collaborationDetails.appendedText)
            cy.get(LECollaborationsActivityPage.getPostOptionBtn()).contains('Edit Post').click()
    
            //Assert All Values Persisted
            cy.get(LECreateCollaborationPostModal.getSummaryTxtF()).should('have.value', collaborationDetails.postSummary2+collaborationDetails.appendedText)
            cy.get(LECreateCollaborationPostModal.getDescriptionTxtF()).should('contain.text', collaborationDetails.postDescription+collaborationDetails.appendedText)
            cy.get(LECreateCollaborationPostModal.getAttachmentName()).contains('Absorb logo small').should('exist')
            cy.get(LECreateCollaborationPostModal.getAttachmentName()).contains('moose').should('not.exist')
    
            //Edit Post and Apply Changes
            cy.get(LECreateCollaborationPostModal.getSummaryTxtF()).clear().type(collaborationDetails.postSummary2)
            cy.get(LECreateCollaborationPostModal.getDescriptionTxtF()).clear()
            cy.get(LECreateCollaborationPostModal.getDescriptionTxtF()).type(collaborationDetails.postDescription)
            LECreateCollaborationPostModal.getDeleteAttachmentByName('Absorb logo small')
            cy.get(LEDashboardPage.getFileInput()).attachFile(attachments.attachment1)
            cy.get(LECreateCollaborationPostModal.getBrowseBtn())
            LEDashboardPage.getShortWait() //Ensure file has been uploaded
            cy.get(LECreateCollaborationPostModal.getCreatePostBtn()).click() 
            cy.intercept('/api/rest/v2/learner-uploads').as('learnerUploads').wait('@learnerUploads',{timeout: 60000}) //Wait for upload to complete
            LEDashboardPage.getLongWait()
        })
    
        it('Verify Post Edits and Verify Learner Can Edit Post From Post Details Page', () => {
            //Go to Collaboration
            cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.A_COLLABORATION_NAME).click()
    
            //Go to Post Details
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary2).click()
    
            //Assert Post Shows Edited Tag
            LECollaborationsActivityPage.getVerifyPostDateByTitle(collaborationDetails.postSummary2, '(Edited)')
    
            //Edit Post From Collaboration Post Details Page
            LECollaborationsActivityPage.getPostOptionsBtnByTitle(collaborationDetails.postSummary2)
            cy.get(LECollaborationsActivityPage.getPostOptionBtn()).contains('Edit Post').click()
    
            //Assert All Values Persisted
            cy.get(LECreateCollaborationPostModal.getSummaryTxtF()).should('have.value', collaborationDetails.postSummary2)
            cy.get(LECreateCollaborationPostModal.getDescriptionTxtF()).should('contain.text', collaborationDetails.postDescription)
            cy.get(LECreateCollaborationPostModal.getAttachmentName()).contains('moose').should('exist')
            cy.get(LECreateCollaborationPostModal.getAttachmentName()).contains('Absorb logo small').should('not.exist')
    
            //Edit Post and Apply Changes
            cy.get(LECreateCollaborationPostModal.getSummaryTxtF()).type(collaborationDetails.appendedText)
            cy.get(LECreateCollaborationPostModal.getDescriptionTxtF()).type(collaborationDetails.appendedText)
            LECreateCollaborationPostModal.getDeleteAttachmentByName('moose')
            cy.get(LEDashboardPage.getFileInput()).attachFile(attachments.attachment2)
            cy.get(LECreateCollaborationPostModal.getBrowseBtn())
            LEDashboardPage.getShortWait() //Ensure file has been uploaded
            cy.get(LECreateCollaborationPostModal.getCreatePostBtn()).click()
            cy.intercept('/api/rest/v2/learner-uploads').as('learnerUploads').wait('@learnerUploads',{timeout: 60000}) //Wait for upload to complete
            LEDashboardPage.getLongWait()
        })
    
        it('Verify Post Edits and Maximum Attachments', () => {
            //Assert Post Shows Edited Tag
            LECollaborationsActivityPage.getVerifyPostDateByTitle(collaborationDetails.postSummary2+collaborationDetails.appendedText, '(Edited)')
    
            //Edit Post From All Collaboration Activity Page
            LECollaborationsActivityPage.getPostOptionsBtnByTitle(collaborationDetails.postSummary2+collaborationDetails.appendedText)
            cy.get(LECollaborationsActivityPage.getPostOptionBtn()).contains('Edit Post').click()
    
            //Assert All Values Persisted
            cy.get(LECreateCollaborationPostModal.getSummaryTxtF()).should('have.value', collaborationDetails.postSummary2+collaborationDetails.appendedText)
            cy.get(LECreateCollaborationPostModal.getDescriptionTxtF()).should('contain.text', collaborationDetails.postDescription+collaborationDetails.appendedText)
            cy.get(LECreateCollaborationPostModal.getAttachmentName()).contains('Absorb logo small').should('exist')
            cy.get(LECreateCollaborationPostModal.getAttachmentName()).contains('moose').should('not.exist')
    
            //Verify a Max of 5 Attachments Can be Added (Add 5 More)
            for (let i = 0; i < attachments.fileNames.length; i++){
                cy.get(LEDashboardPage.getFileInput()).attachFile(miscData.resource_image_folder_path + attachments.fileNames[i])
                cy.get(LECreateCollaborationPostModal.getBrowseBtn())
            }
            //Verify Disabled Update Button State
            cy.get(LECreateCollaborationPostModal.getCreatePostBtn()).should('have.attr', 'aria-disabled', 'true')
    
            //Close the Modal
            cy.get(LECreateCollaborationPostModal.getInnerModal()).within(()=>{
                cy.get(LECreateCollaborationPostModal.getModalCloseBtn()).click()
            })   
            
        })
    }
    finally {
        it('Cleanup - Delete Learner 1 and 2 Collaboration Post', () => {
            LECollaborationsActivityPage.getDeletePostByName(collaborationDetails.postSummary2+collaborationDetails.appendedText)
            cy.logoutLearner()
            LEDashboardPage.getMediumWait() //Wait for Logout to complete
            //Delete Learner 1 Collaboration Post
            cy.learnerLoginThruDashboardPage(users.learner01.learner_01_username, users.learner01.learner_01_password) 
            LEDashboardPage.getTileByNameThenClick('Collaborations')
            LECollaborationsActivityPage.getDeletePostByName(collaborationDetails.postSummary)
        })
    }
})
