import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'
import LECollaborationPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationPage'
import LECreateCollaborationPostModal from '../../../../../../helpers/LE/pageObjects/Modals/LECreateCollaborationPost.modal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { collaborationDetails, collaborationNames, attachments } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'
import { resourcePaths } from '../../../../../../helpers/TestData/resources/resources'

let iconFunctions = ['getPDFIcon', 'getWordIcon', 'getExcelIcon', 'getOtherIcon']; //test specific array of function names from LEBasePage

describe('LE - Collaborations - Attachment Previews', function(){
    try {
        beforeEach(() => {
            //Sign in, navigate to Collaborations 
            cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
            LEDashboardPage.getTileByNameThenClick('Collaborations')
            cy.get(LECollaborationPage.getPageTitle(),{timeout:15000}).should('be.visible').and('contain','Collaborations Activity')
        })
        
        it('Verify Image File Type Attachment Previews', () => {
            //Create a post and add a jpg, png, and gif attachment
            cy.get(LECollaborationPage.getCreatePostBtn()).click()
            cy.get(LECreateCollaborationPostModal.getSummaryTxtF()).type(collaborationDetails.postSummary)

            for (let i = 0; i < attachments.imgAttachments[0].length; i++) {
                cy.get(LEDashboardPage.getFileInput()).attachFile(`${resourcePaths.resource_image_folder}${attachments.imgAttachments[0][i]}`)
                cy.get(LECreateCollaborationPostModal.getBrowseBtn())
            }
            cy.get(LECollaborationPage.getElementByNameAttribute(LECreateCollaborationPostModal.getPostInDDown())).select(collaborationNames.A_COLLABORATION_NAME, {force:true})
            cy.get(LECreateCollaborationPostModal.getAttachmentContainer(),{timeout:15000}).should('be.visible').and('have.length',`${attachments.imgAttachments[0].length}`)//Ensure files have been added
            cy.get(LECreateCollaborationPostModal.getCreatePostBtn()).click()
            cy.get(LECreateCollaborationPostModal.getCreatePostModalSpinner(),{timeout:60000}).should('not.exist')

            //Verify attachments previews are displayed correctly
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).parents(LECollaborationsActivityPage.getPostContainer()).within(() => {
                for (let i = 0; i < attachments.imgAttachments[0].length; i++) {
                    cy.get(LECollaborationsActivityPage.getPostAttachmentLabel()).contains(attachments.imgAttachments[0][i].slice(0, -4)).parents(LECollaborationsActivityPage.getPostAttachmentContainer())
                        .within(() => {
                            cy.get(LECollaborationsActivityPage.getPostAttachmentType()).should('contain', attachments.imgAttachments[1][i]) //Verify file type label
                            cy.get(LECollaborationsActivityPage.getPostAttachmentSource()).should('have.attr', 'src').and('include', attachments.imgAttachments[0][i].slice(0, -4).replace(/\s/g, '%20'))
                        })
                }
            })
        })

        it('Verify Other File Type Attachment Previews', {browser: '!firefox'}, () => {
            //Create a post and add a pdf, docx, xlsx, and mp4 attachment
            cy.get(LECollaborationPage.getCreatePostBtn()).click()
            cy.get(LECreateCollaborationPostModal.getSummaryTxtF()).type(collaborationDetails.postSummary2)

            for (let i = 0; i < attachments.otherAttachments[0].length; i++) {
                cy.get(LEDashboardPage.getFileInput()).attachFile(`${attachments.otherAttachments[2][i]}${attachments.otherAttachments[0][i]}`)
                cy.get(LECreateCollaborationPostModal.getBrowseBtn())
            }
            cy.get(LECollaborationPage.getElementByNameAttribute(LECreateCollaborationPostModal.getPostInDDown())).select(collaborationNames.A_COLLABORATION_NAME)
            cy.get(LECreateCollaborationPostModal.getAttachmentContainer(),{timeout:15000}).should('be.visible').and('have.length',`${attachments.otherAttachments[0].length}`) //Ensure files have been added
            cy.get(LECreateCollaborationPostModal.getCreatePostBtn()).click()
            cy.get(LECreateCollaborationPostModal.getCreatePostModalSpinner(),{timeout:60000}).should('not.exist')

            //Verify attachments previews are displayed correctly
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary2).parents(LECollaborationsActivityPage.getPostContainer()).within(() => {
                for (let i = 0; i < attachments.otherAttachments[0].length; i++) {
                    cy.get(LECollaborationsActivityPage.getPostAttachmentLabel()).contains(attachments.otherAttachments[0][i].slice(0, -5)).parents(LECollaborationsActivityPage.getPostAttachmentContainer())
                        .within(() => {
                            cy.get(LECollaborationsActivityPage.getPostAttachmentType()).should('contain', attachments.otherAttachments[1][i]) //Verify file type label
                            cy.get(LECollaborationsActivityPage[iconFunctions[i]]).should('exist') //Verify file icons
                        })
                }
            })
        })

        it('Verify Mobile Attachment Previews', () => {
            cy.viewport('iphone-xr') //Set viewport to mobile size

            //Verify attachments are collapsed when viewing on mobile
            cy.get(LECollaborationsActivityPage.getPostTitle()).contains(collaborationDetails.postSummary).parents(LECollaborationsActivityPage.getPostContainer()).within(() => {
                cy.get(LECollaborationsActivityPage.getPostAttachmentsCollapsed()).should('exist').click() //Click collapsed attachment link
            })

            //Verify link navigates to post and displays attachments correctly
            cy.url().should('contain', '/posts/')
            cy.get(LECollaborationsActivityPage.getNonLinkPostTitle()).contains(collaborationDetails.postSummary).parents(LECollaborationsActivityPage.getPostContainer()).within(() => {
                for (let i = attachments.imgAttachments[0].length-2; i = 0; i--) {
                    cy.get(LECollaborationsActivityPage.getPostAttachmentLabel()).contains(attachments.imgAttachments[0][i].slice(0, -4)).parents(LECollaborationsActivityPage.getPostAttachmentContainer())
                        .within(() => {
                            cy.get(LECollaborationsActivityPage.getPostAttachmentType()).should('contain', attachments.imgAttachments[1][i]) //Verify file type label
                            cy.get(LECollaborationsActivityPage.getPostImageAttachmentPreview()).children().should('have.attr', 'src').and('include', attachments.imgAttachments[0][i].slice(0, -4).replace(/\s/g, '%20'))
                        })
                }
            })
        })
    }
    finally {
        it('Cleanup - Delete Learner Collaboration Posts', () => {
            LECollaborationsActivityPage.getDeletePostByName(collaborationDetails.postSummary)
            if (Cypress.isBrowser('firefox')) {} else {
                LECollaborationsActivityPage.getDeletePostByName(collaborationDetails.postSummary2)
            }
        })
    }
})