import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import ARCollaborationAddEditPage from '../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage'
import { collaborationDetails, collaborationNames } from '../../../../../../helpers/TestData/Collaborations/collaborationDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { users } from '../../../../../../helpers/TestData/users/users'

//This test could be updated later to create/delete a collaboration once NLE-3136 has been completed
describe('AR - Collaborations - Resources', function () {

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Collaborations
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Engage'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Collaborations'))
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should("not.exist")
        //Filter for Collaboration and Edit it
        cy.wrap(arDashboardPage.AddFilter('Name', 'Contains', collaborationNames.E_COLLABORATION_NAME))
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should("not.exist")
        cy.get(arDashboardPage.getTableCellName(2)).contains(collaborationNames.E_COLLABORATION_NAME).click()
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit Collaboration')).should('have.attr', 'aria-disabled', 'false')
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit Collaboration')).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should("not.exist")
    })

    it('Verify Adding Resources to Collaboration', () => {
        //Verify Resource Can be Added to Collaboration
        cy.get(ARCollaborationAddEditPage.getAddResourceBtn()).click()
        cy.get(ARCollaborationAddEditPage.getCollaborationResource() + ` ` + arDashboardPage.getElementByAriaLabelAttribute(ARCollaborationAddEditPage.getResourceByIndex('1', '1'))).within(() => {

            //Verify Name Field is Required
            cy.get(ARCollaborationAddEditPage.getResourceNameTxtF()).type('a').clear()
            cy.get(ARCollaborationAddEditPage.getResourceNameErrorMsg()).should('contain', miscData.field_required_error)

            //Verify Name Field does not Allow >255 Chars
            cy.get(ARCollaborationAddEditPage.getResourceNameTxtF()).clear().invoke('val', arDashboardPage.getLongString()).type('a')
            cy.get(ARCollaborationAddEditPage.getResourceNameErrorMsg()).should('contain', miscData.char_255_error)

            //Enter Valid Value into Name Field
            cy.get(ARCollaborationAddEditPage.getResourceNameTxtF()).clear().type(collaborationDetails.resourceOne[0])

            //Verify Description Field does not Allow >4000 Chars
            cy.get(ARCollaborationAddEditPage.getResourceDescriptionTxtF()).clear()
            cy.get(ARCollaborationAddEditPage.getResourceDescriptionTxtF()).invoke('text', arDashboardPage.getLongString(4000)).type('a')
            cy.get(ARCollaborationAddEditPage.getResourceDescriptionErrorMsg()).should('contain', miscData.char_4000_error)

            //Enter Valid Value into Description Field
            cy.get(ARCollaborationAddEditPage.getResourceDescriptionTxtF()).clear()
            cy.get(ARCollaborationAddEditPage.getResourceDescriptionTxtF()).type(collaborationDetails.resourceOne[1])

            //Upload File Type Attachment
            cy.get(ARCollaborationAddEditPage.getAttachmentRadioBtn()).contains('File').click()
            cy.get(ARCollaborationAddEditPage.getChooseFileBtn()).click()
        })
        //Media Library upload button selection
        cy.get(arUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(arUploadFileModal.getFileInput()).attachFile(`${commonDetails.filePath}${collaborationDetails.resourceOne[2]}`)
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 25000 }).should("not.exist")
        cy.get(arUploadFileModal.getSaveBtn(), { timeout: 15000 }).should('have.attr', 'aria-disabled', 'false')
        cy.get(arUploadFileModal.getSaveBtn()).click({ force: true })
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should("not.exist")

        //Create 2nd Resource with Url Type Attachment
        cy.get(ARCollaborationAddEditPage.getAddResourceBtn()).click()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(ARCollaborationAddEditPage.getResourceByIndex('2', '2'))).within(() => {
            cy.get(ARCollaborationAddEditPage.getResourceNameTxtF()).clear().type(collaborationDetails.resourceTwo[0])
            cy.get(ARCollaborationAddEditPage.getResourceDescriptionTxtF()).type(collaborationDetails.resourceTwo[1])
            //Add Url Type Attachment
            cy.get(ARCollaborationAddEditPage.getAttachmentRadioBtn()).contains('Url').click()
            cy.get(ARCollaborationAddEditPage.getUrlTxtF()).type(collaborationDetails.resourceTwo[2])
            cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should("not.exist")
        })

        //Save the Changes
        //and this wait is needed
        //Wait for Save Btn to become enabled
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getSaveBtn()).click({ force: true })
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should("not.exist")
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', 'Collaborations')
    })

    it('Verify Resources Persisted, Delete Resources from Collaboration', () => {
        cy.get(ARCollaborationAddEditPage.getCollaborationResourceSection(), { timeout: 15000 }).should('exist')
        //Assert Values for Both Resources
        for (let i = 0; i < collaborationDetails.temp.length; i++) {
            //Edit Resource
            cy.get(ARCollaborationAddEditPage.getCollaborationResourceSection() + ` ` + ARCollaborationAddEditPage.getResourceContainer()).contains(collaborationDetails.temp[i][0]).parent().within(() => {
                cy.get(ARCollaborationAddEditPage.getEditResourceBtn()).click()
            })
            cy.get(ARCollaborationAddEditPage.getCollaborationResourceSection() + ` ` + ARCollaborationAddEditPage.getResourceContainer()).contains(collaborationDetails.temp[i][0]).parent().parent().within(() => {
                //Assert Name Field
                cy.get(ARCollaborationAddEditPage.getResourceNameTxtF()).should('have.value', collaborationDetails.temp[i][0])

                //Assert Description Field
                cy.get(ARCollaborationAddEditPage.getResourceDescriptionTxtF()).should('contain.text', collaborationDetails.temp[i][1])

                //Assert File Type Attachment
                if (i === 0) {
                    cy.get(ARCollaborationAddEditPage.getFileInputF()).should('contain.value', collaborationDetails.temp[i][2].slice(0, 17))
                }
                else {
                    cy.get(ARCollaborationAddEditPage.getUrlTxtF()).should('have.value', collaborationDetails.temp[i][2])
                }
            })
            cy.get(ARCollaborationAddEditPage.getCollapseBtn()).click()
            //Delete Resource
            ARCollaborationAddEditPage.getDeleteResourceBtnByNameThenClick(collaborationDetails.temp[i][0])
            cy.get(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click()
            cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should("not.exist")

        }

        //Save the Changes
        //Wait for Save Btn to become enabled
        //and this wait is needed
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should("not.exist")
    })

    it('Verify Resource Deletion Persisted', () => {
        //Assert Resources no Longer Exist
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 15000 }).should("not.exist")
        cy.get(ARCollaborationAddEditPage.getCollaborationResourceSection() + ` ` + ARCollaborationAddEditPage.getResourceContainer(), { timeout: 15000 }).should('not.exist')
    })
})