import ARCollaborationAddEditPage from "../../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage"
import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARFileManagerUploadsModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARFileManagerUploadsModal"
import ARUploadFileModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import { collaborationDetails } from "../../../../../../../helpers/TestData/Collaborations/collaborationDetails"
import { commonDetails } from "../../../../../../../helpers/TestData/Courses/commonDetails"
import { ocDetails } from "../../../../../../../helpers/TestData/Courses/oc"
import { images, resourcePaths } from "../../../../../../../helpers/TestData/resources/resources"
import { users } from "../../../../../../../helpers/TestData/users/users"



describe("C7374 - AUT-742 - NASA-7143 - Uploads - Delete", () => {

    before("prerequisites", () => {
        // Create a new course with uploaded resources
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        //create first course
        cy.createCourse('Online Course')

        //Create Resource with Url Type Attachment
        cy.get(ARCollaborationAddEditPage.getElementByTitleAttribute('Resources')).eq(0).click()
        cy.get(ARCollaborationAddEditPage.getAddResourcesBtn()).should('contain.text', 'Add Resource').click()
        ARCollaborationAddEditPage.getMediumWait()

        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Resources")).within(() => {
            cy.get(ARFileManagerUploadsModal.getCoursesControlWrapper()).first().clear().type(collaborationDetails.resourceTwo[0])
            cy.get(ARFileManagerUploadsModal.getChooseFileBtn()).click()
            ARDashboardPage.getShortWait()
        })
        // Asserting File Manager Upload Modal has been opened
        cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', 'File Manager')

        //Clicking on the Upload button 
        cy.get(ARFileManagerUploadsModal.getUploadButton()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_image_folder + images.absorb_logo_small_filename)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click
        ARUploadFileModal.getShortWait()
        cy.get(ARFileManagerUploadsModal.getUploadFileModalSaveBtn()).click()
        ARDashboardPage.getVLongWait()

        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    beforeEach("Navigate to File Upload Modal ", () => {
        //login as an admin
        cy.loginAdmin(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        ARDashboardPage.getMediumWait()
        // Navigate to collaboration
        // Click on Engage From Left Panel.
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Engage'))).click()
        // Click on Collaborations
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Collaborations'))
        cy.intercept('/api/rest/v2/admin/reports/collaborations/operations').as('getCollaborations').wait('@getCollaborations')
        ARDashboardPage.getMediumWait()
        // Click on Add Collaboration option from RHS
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Collaboration')).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('title')).should('contain', 'Add Collaboration')
        //Clicking on Add Resource button
        cy.get(ARFileManagerUploadsModal.getAddResourceBtn()).click()
        //Clickig on Choose file button to open the file dialog
        cy.get(ARFileManagerUploadsModal.getChooseFileBtn()).click()
        // Asserting File Manager Upload Modal has been opened
        cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', 'File Manager')

    })

    it("File Manager Upload modal appears and 'Delete' appears in the flyout menu ", () => {

        cy.get(ARFileManagerUploadsModal.getMediaLibraryModal()).within(() => {
            //Asserting the Media Library modal header
            cy.get(ARUploadFileModal.getFileManagerModalTitle()).should('have.text', 'File Manager')

            //hover over the images 
            cy.get(ARUploadFileModal.getMediaLibraryImagePreview()).first().trigger('mouseover').parent().parent().within(() => {
                // asserting preview icon 
                cy.get(ARUploadFileModal.getPreview()).find('span').should('have.class', 'icon icon-eye')
                // asserting ellipse button
                cy.get(ARUploadFileModal.getOption()).find('span').should('have.class', 'icon icon-ellipsis')
                //clicking on the fly out menu 
                cy.get(ARUploadFileModal.getOption()).invoke('show')
                ARDashboardPage.getShortWait()
                cy.get(ARUploadFileModal.getMediaLibraryFileMenuBtn()).invoke('show').click({ force: true })

            })
            //Clicking on the Preview button from flyout menu 
            cy.get(ARUploadFileModal.getMediaLibraryFileMenuBtn()).first().click()

            cy.get(ARFileManagerUploadsModal.getFlyoutMenu()).within(() => {
                //Asserting Delete as 7th item in the menu 
                cy.get(ARUploadFileModal.getMenuItem()).eq(6).should('have.text', "Delete").click()
                ARDashboardPage.getShortWait()
            })

        })

    })

    it("Selecting the 'Delete' option in the fly-out menu opens up the 'Delete File' modal", () => {

        cy.get(ARFileManagerUploadsModal.getMediaLibraryModal()).within(() => {

            // hover over the images 
            cy.get(ARUploadFileModal.getMediaLibraryImagePreview()).first().parent().parent().within(() => {
                // asserting preview icon 
                cy.get(ARUploadFileModal.getPreview()).find('span').should('have.class', 'icon icon-eye')
                cy.get(ARUploadFileModal.getOption()).find('span').should('have.class', 'icon icon-ellipsis')
                cy.get(ARUploadFileModal.getOption()).invoke('show')
                ARDashboardPage.getShortWait()
                cy.get(ARUploadFileModal.getMediaLibraryFileMenuBtn()).invoke('show').click({ force: true })

            })

            //Clicking on the Preview button from flyout menu 
            cy.get(ARUploadFileModal.getMediaLibraryFileMenuBtn()).first().click({ force: true })

            //clicking on the Delete button from flyout menu
            cy.get(ARFileManagerUploadsModal.getFlyoutMenu()).within(() => {
                //Asserting Delete as 7th item in the menu 
                cy.get(ARUploadFileModal.getMenuItem()).eq(6).should('have.text', "Delete").click({ force: true })
                ARDashboardPage.getShortWait()
            })

        })

        //Asserting new dialogue as Delete File modal Appears 
        cy.get(ARFileManagerUploadsModal.getDialogues()).within(() => {

            cy.get(ARFileManagerUploadsModal.getDialoguesAsRole()).last().within(() => {

                //Asserting modal header
                cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', "Delete File")
                //Asserting Warning banner is exists 
                cy.get(ARFileManagerUploadsModal.getModalNotification()).should('exist')
                //Asserting Usage Section header
                cy.get(ARFileManagerUploadsModal.getSelectedFileLable()).first().should('have.text', "Usage")
                //Asserting Selected File Header
                cy.get(ARFileManagerUploadsModal.getSelectedFileLable()).eq(1).should('have.text', "Selected File")


            })

        })


    })


    it("Small Delete File Modal is opened and file is deleted", () => {

        // Delete Course
        cy.deleteCourse(commonDetails.courseID)

        cy.get(ARFileManagerUploadsModal.getMediaLibraryModal()).within(() => {

            // hover over the images 
            cy.get(ARUploadFileModal.getMediaLibraryImagePreview()).first().parent().parent().within(() => {
                // asserting preview icon 
                cy.get(ARUploadFileModal.getPreview()).find('span').should('have.class', 'icon icon-eye')
                cy.get(ARUploadFileModal.getOption()).find('span').should('have.class', 'icon icon-ellipsis')
                cy.get(ARUploadFileModal.getOption()).invoke('show')
                ARDashboardPage.getShortWait()
                cy.get(ARUploadFileModal.getMediaLibraryFileMenuBtn()).invoke('show').click({ force: true })

            })

            //Clicking on the Preview button from flyout menu 
            cy.get(ARUploadFileModal.getMediaLibraryFileMenuBtn()).first().click({ force: true })

            //clicking on the Delete button from flyout menu
            cy.get(ARFileManagerUploadsModal.getFlyoutMenu()).within(() => {
                //Asserting Delete as 7th item in the menu 
                cy.get(ARUploadFileModal.getMenuItem()).eq(6).should('have.text', "Delete").click({ force: true })
                ARDashboardPage.getShortWait()
            })

        })

        //Asserting new dialogue as Rename File modal Appears 
        cy.get(ARFileManagerUploadsModal.getDialogues()).within(() => {

            cy.get(ARFileManagerUploadsModal.getDialoguesAsRole()).last().within(() => {

                //Asserting modal header
                cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', "Delete File")

                //Delete Button should not be greyed out
                cy.get(ARFileManagerUploadsModal.getFileDeleteBtn()).should('have.attr', 'aria-disabled', 'false')

                //Asserting warning message
                cy.get(ARFileManagerUploadsModal.getModalNotification()).should('have.text', "Deleting a file will permanently remove all instances of it across the LMS. This action cannot be undone.")

                //Clicking on the cancel butotn
                cy.get(ARFileManagerUploadsModal.getDeleteModalCancelButton()).should('have.text', "Cancel").click()

            })

        })
        //Asserting that it returns back to File Manager Modal 
        cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', 'File Manager')

        //Again Clicking on the delete button from flyout menu 
        cy.get(ARFileManagerUploadsModal.getMediaLibraryModal()).within(() => {

            // hover over the images 
            cy.get(ARUploadFileModal.getMediaLibraryImagePreview()).first().parent().parent().within(() => {
                // asserting preview icon 
                cy.get(ARUploadFileModal.getPreview()).find('span').should('have.class', 'icon icon-eye')
                cy.get(ARUploadFileModal.getOption()).find('span').should('have.class', 'icon icon-ellipsis')
                cy.get(ARUploadFileModal.getOption()).invoke('show')
                ARDashboardPage.getShortWait()
                cy.get(ARUploadFileModal.getMediaLibraryFileMenuBtn()).invoke('show').click({ force: true })

            })

            //Clicking on the Preview button from flyout menu 
            cy.get(ARUploadFileModal.getMediaLibraryFileMenuBtn()).first().click({ force: true })

            //clicking on the Delete button from flyout menu
            cy.get(ARFileManagerUploadsModal.getFlyoutMenu()).within(() => {
                //Asserting Delete as 7th item in the menu 
                cy.get(ARUploadFileModal.getMenuItem()).eq(6).should('have.text', "Delete").click({ force: true })
                ARDashboardPage.getShortWait()
            })

        })

        cy.get(ARFileManagerUploadsModal.getDialogues()).within(() => {

            cy.get(ARFileManagerUploadsModal.getDialoguesAsRole()).last().within(() => {

                //Asserting modal header
                cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', "Delete File")
                //Clicking on the delete butotn
                cy.get(ARFileManagerUploadsModal.getFileDeleteBtn()).should('have.text', "Delete").click()
                //waiting for some time to delete the file
                ARDashboardPage.getMediumWait()

            })

        })
        //Asserting that Toast message is displayed
        cy.get(ARDashboardPage.getToastNotificationMsg()).should('contain', ' successfully deleted.')

    })



})