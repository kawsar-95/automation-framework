
import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARFileManagerUploadsModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARFileManagerUploadsModal"
import { users } from "../../../../../../../helpers/TestData/users/users"
import ARUploadFileModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import ARCollaborationAddEditPage from "../../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage"
import { collaborationDetails } from "../../../../../../../helpers/TestData/Collaborations/collaborationDetails"
import { commonDetails } from "../../../../../../../helpers/TestData/Courses/commonDetails"
import { ocDetails } from "../../../../../../../helpers/TestData/Courses/oc"
import { images, resourcePaths } from "../../../../../../../helpers/TestData/resources/resources"
import ARFileManagerReplaceModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARFileManagerReplaceModal"



describe("C7380 - AUT-748 - NASA-7140 - Uploads - Replace", () => {

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
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_image_folder + images.moose_filename)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click
        ARUploadFileModal.getShortWait()
        cy.get(ARFileManagerUploadsModal.getUploadFileModalSaveBtn()).click()
        ARDashboardPage.getVLongWait()

        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    after("Deleting the created course" , ()=>{
         //Delete Course
         cy.deleteCourse(commonDetails.courseID)
    })

    beforeEach("navigate to uploads file manager  ", () => {
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

    it("File Manager Upload modal appears and 'Replace' appears in the flyout menu ", () => {

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
                //Asserting Replace as 6th item in the menu 
                cy.get(ARUploadFileModal.getMenuItem()).eq(5).should('have.text', "Replace")
                ARDashboardPage.getShortWait()
            })

        })

    })

    it("Selecting the 'Replace' option in the fly-out menu opens up the 'Replace File' modal", () => {

        ARFileManagerUploadsModal.clickingOnFlyoutMenuByIndex(5)

        cy.get(ARFileManagerUploadsModal.getDialogues()).within(() => {

            cy.get(ARFileManagerUploadsModal.getDialoguesAsRole()).last().within(() => {

                //Asserting modal header
                cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', "Replace File")
                //Asserting Warning banner is exists 
                cy.get(ARFileManagerUploadsModal.getModalNotification()).should('exist')

                cy.get(ARFileManagerReplaceModal.getUsagesSection()).within(() => {
                    //Asserting Usage Section header
                    cy.get(ARFileManagerUploadsModal.getSelectedFileLable()).first().should('have.text', "Usage")
                    //
                    cy.get(ARFileManagerReplaceModal.getNumberByDataName()).should('have.text', "1")
                    cy.get(ARFileManagerReplaceModal.getUsageTypeByDataName()).contains('Usage Type')
                })

                //Asserting Selected File Header
                cy.get(ARFileManagerUploadsModal.getSelectedFileLable()).eq(1).should('have.text', "Selected File")
                //Assering File Metadata 
                cy.get(ARFileManagerReplaceModal.getSelectedFileWrapper()).within(() => {
                    //Asserting it contains Image Preview 
                    cy.get(ARUploadFileModal.getMediaLibraryImagePreview()).first().invoke('attr', 'style').should('contain', 'url')
                })

                //Asserting New File Header
                cy.get(ARFileManagerUploadsModal.getSelectedFileLable()).eq(2).should('have.text', "New File")
                //Asserting File upload btn is present 
                cy.get(ARFileManagerUploadsModal.getSelectedFileLable()).last().should('have.text', "Browse")

                //Asserting Replace Button is grayed out
                cy.get(ARFileManagerReplaceModal.getReplaceFileBtn()).should('have.attr', 'aria-disabled', "true")
                //Asserting Cancel Button is present 
                cy.get(ARFileManagerReplaceModal.getCancelReplaceFileBtn()).should('exist')
            })

        })
    })

    it("clicking on the cancel button redirects to  file manager modal ", () => {
        //Clicking on the replace button from flyout menu 
        ARFileManagerUploadsModal.clickingOnFlyoutMenuByIndex(5)

        cy.get(ARFileManagerUploadsModal.getDialogues()).within(() => {

            cy.get(ARFileManagerUploadsModal.getDialoguesAsRole()).last().within(() => {

                //Asserting modal header
                cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', "Replace File")
                //Asserting Warning banner is exists 
                cy.get(ARFileManagerUploadsModal.getModalNotification()).should('exist')

                cy.get(ARFileManagerReplaceModal.getUsagesSection()).within(() => {
                    //Asserting Usage Section header
                    cy.get(ARFileManagerUploadsModal.getSelectedFileLable()).first().should('have.text', "Usage")
                    //
                    cy.get(ARFileManagerReplaceModal.getNumberByDataName()).should('have.text', "1")
                    cy.get(ARFileManagerReplaceModal.getUsageTypeByDataName()).contains('Usage Type')
                })

                //Asserting Selected File Header
                cy.get(ARFileManagerUploadsModal.getSelectedFileLable()).eq(1).should('have.text', "Selected File")
                //Assering File Metadata 
                cy.get(ARFileManagerReplaceModal.getSelectedFileWrapper()).within(() => {
                    //Asserting it contains Image Preview 
                    cy.get(ARUploadFileModal.getMediaLibraryImagePreview()).first().invoke('attr', 'style').should('contain', 'url')
                })

                //Asserting New File Header
                cy.get(ARFileManagerUploadsModal.getSelectedFileLable()).eq(2).should('have.text', "New File")
                //Asserting File upload btn is present 
                cy.get(ARFileManagerUploadsModal.getSelectedFileLable()).last().should('have.text', "Browse")

                //Asserting Replace Button is grayed out
                cy.get(ARFileManagerReplaceModal.getReplaceFileBtn()).should('have.attr', 'aria-disabled', "true")
                //Asserting Cancel Button is present 
                cy.get(ARFileManagerReplaceModal.getCancelReplaceFileBtn()).should('exist')

                cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_image_folder + images.absorb_logo_small_filename)
                ARDashboardPage.getMediumWait()
                //Asserting that Delete button is present
                cy.get(ARFileManagerReplaceModal.getDeleteFileBtn()).should('exist')
                //cliking on the cancel button
                cy.get(ARFileManagerReplaceModal.getCancelReplaceFileBtn()).click()

            })


        })

        // Asserting File Manager Upload Modal has been opened
        cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', 'File Manager')

    })

    it("file is uploaded without error", () => {
        //Clicking on the replace button from flyout menu 
        ARFileManagerUploadsModal.clickingOnFlyoutMenuByIndex(5)

        cy.get(ARFileManagerUploadsModal.getDialogues()).within(() => {

            cy.get(ARFileManagerUploadsModal.getDialoguesAsRole()).last().within(() => {

                //Asserting modal header
                cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', "Replace File")
                //Asserting Warning banner is exists 
                cy.get(ARFileManagerUploadsModal.getModalNotification()).should('exist')

                cy.get(ARFileManagerReplaceModal.getUsagesSection()).within(() => {
                    //Asserting Usage Section header
                    cy.get(ARFileManagerUploadsModal.getSelectedFileLable()).first().should('have.text', "Usage")
                    //
                    cy.get(ARFileManagerReplaceModal.getNumberByDataName()).should('have.text', "1")
                    cy.get(ARFileManagerReplaceModal.getUsageTypeByDataName()).contains('Usage Type')
                })

                //Asserting Selected File Header
                cy.get(ARFileManagerUploadsModal.getSelectedFileLable()).eq(1).should('have.text', "Selected File")
                //Assering File Metadata 
                cy.get(ARFileManagerReplaceModal.getSelectedFileWrapper()).within(() => {
                    //Asserting it contains Image Preview 
                    cy.get(ARUploadFileModal.getMediaLibraryImagePreview()).first().invoke('attr', 'style').should('contain', 'url')
                })

                //Asserting New File Header
                cy.get(ARFileManagerUploadsModal.getSelectedFileLable()).eq(2).should('have.text', "New File")
                //Asserting File upload btn is present 
                cy.get(ARFileManagerUploadsModal.getSelectedFileLable()).last().should('have.text', "Browse")

                //Asserting Replace Button is grayed out
                cy.get(ARFileManagerReplaceModal.getReplaceFileBtn()).should('have.attr', 'aria-disabled', "true")
                //Asserting Cancel Button is present 
                cy.get(ARFileManagerReplaceModal.getCancelReplaceFileBtn()).should('exist')

                cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_image_folder + images.absorb_logo_small_filename)
                ARDashboardPage.getMediumWait()
                //Asserting that Delete button is present
                cy.get(ARFileManagerReplaceModal.getDeleteFileBtn()).should('exist')
                               
                cy.get(ARFileManagerReplaceModal.getReplaceFileBtn()).click()
                ARDashboardPage.getMediumWait()

            })


        })

        // Asserting File Manager Upload Modal has been opened
        cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', 'File Manager')

    })


})