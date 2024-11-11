import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import LECreateCollaborationPostModal from '../../../../../../helpers/LE/pageObjects/Modals/LECreateCollaborationPost.modal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { collaborationDetails, collaborationNames, attachments } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'

let attachmentNames = [];

describe('LE - Collaborations - Post Attachments', function(){
    try {
        beforeEach(() => {
            cy.viewport(1280, 720) //Enlarge viewport so Collaborations side menu is visible
            //Sign in, navigate to Collaborations 
            cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
            LEDashboardPage.getTileByNameThenClick('Collaborations')
            cy.get(LECollaborationPage.getPageTitle(),{timeout:15000}).should('be.visible').and('contain','Collaborations Activity')
            cy.get(LECollaborationsActivityPage.getCollaborationsList()).contains(collaborationNames.A_COLLABORATION_NAME).click()
        })
    
        it('Verify Adding Post Attachments', () => {
            //Create a Post
            cy.get(LECollaborationPage.getCreatePostBtn()).click()
            cy.get(LECreateCollaborationPostModal.getSummaryTxtF()).type(collaborationDetails.postSummary)
            
            //Verify a File can be Attached and 5 Files Max can be Uploaded
            for (let i = 0; i < attachments.fileNames3.length; i++){
                cy.get(LEDashboardPage.getFileInput()).attachFile(`${miscData.resource_image_folder_path}${attachments.fileNames3[i]}`)
                cy.get(LECreateCollaborationPostModal.getBrowseBtn())
            }
            cy.get(LECreateCollaborationPostModal.getCreatePostBtn()).should('have.attr', 'aria-disabled', 'true')
    
            //Verify Post can be Cancelled
            cy.get(LECreateCollaborationPostModal.getCancelBtn()).click()
            cy.get(LECollaborationPage.getPageTitle()).should('be.visible')
    
            //Verify Attachments With the Same Name can be Added
            cy.get(LECollaborationPage.getCreatePostBtn()).click()
            cy.get(LECreateCollaborationPostModal.getSummaryTxtF()).should('be.visible')
            cy.get(LECreateCollaborationPostModal.getSummaryTxtF()).type(collaborationDetails.postSummary)
            for (let i = 0; i < attachments.fileNames3.length- 3; i++){
                cy.get(LEDashboardPage.getFileInput()).attachFile(`${miscData.resource_image_folder_path}${attachments.fileNames3[1]}`)
                cy.get(LECreateCollaborationPostModal.getBrowseBtn())
            }
            //Verify Pressing Post Button Scans Files and Creates Post
            cy.get(LECreateCollaborationPostModal.getAttachmentContainer(),{timeout:15000}).should('be.visible').and('have.length',`${attachments.fileNames3.length- 3}`) //Ensure files have been uploaded
            cy.get(LECreateCollaborationPostModal.getCreatePostBtn()).click()
            cy.get(LECreateCollaborationPostModal.getCreatePostModalSpinner(),{timeout:150000}).should('not.exist')
        })
    
        it('Verify Post Attachments', () => {
            cy.get(LECollaborationsActivityPage.getNonLinkPostTitle()).contains(collaborationDetails.postSummary).parents(LECollaborationsActivityPage.getPostContainer()).within(() => {

                //Verify Duplicate Attachments were Saved with Unique Name
                cy.get(LECollaborationsActivityPage.getPostAttachmentLabel()).each(($label) => {
                    attachmentNames.push($label.text())
                })
                cy.get(attachmentNames).each(($label, i) => {
                    if (i != attachmentNames.length - 1) {
                        expect($label).to.not.equal(attachmentNames[i+1])
                    }
                    else {
                        expect($label).to.not.equal(attachmentNames[0])
                    }
                })

                //Verify attachments display a preview
                cy.get(LECollaborationsActivityPage.getPostAttachmentContainer()).each(() => {
                    cy.get(LECollaborationsActivityPage.getPostAttachmentSource()).should('have.attr', 'src').and('include', attachments.fileNames3[1].slice(0, -4))
                })

                //Unable to test clicking attachments as they open in a new tab and have no target or href attribute. 
            })
        })
    }
    finally {
        it('Cleanup - Delete Learner Collaboration Post', () => {
            LECollaborationsActivityPage.getDeletePostByName(collaborationDetails.postSummary)
        })
    }
})