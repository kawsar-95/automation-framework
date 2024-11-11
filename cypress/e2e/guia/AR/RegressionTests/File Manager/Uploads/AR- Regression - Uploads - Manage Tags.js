
import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARFileManagerUploadsModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARFileManagerUploadsModal"
import { users } from "../../../../../../../helpers/TestData/users/users"
import { courses } from "../../../../../../../helpers/TestData/Courses/courses"
import ARCollaborationAddEditPage from "../../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage"
import { collaborationDetails } from "../../../../../../../helpers/TestData/Collaborations/collaborationDetails"
import ARUploadFileModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import { commonDetails } from "../../../../../../../helpers/TestData/Courses/commonDetails"
import { ocDetails } from "../../../../../../../helpers/TestData/Courses/oc"
import { currDetails } from "../../../../../../../helpers/TestData/Courses/curr"
import { ilcDetails } from "../../../../../../../helpers/TestData/Courses/ilc"
import ARCBAddEditPage from "../../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage"
import ARCoursesPage from "../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import AROCAddEditPage, { coursePageMessages } from "../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARCourseSettingsCatalogVisibilityModule from "../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module"
import { miscData } from "../../../../../../../helpers/TestData/Misc/misc"
import ARFileManagerManageTagModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARFileManagerManageTagModal"
import ARUnsavedChangesModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal"
import ARDeleteModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"



describe("C7378 - AUT-746 - NASA-7161 - Uploads - Manage Tags ", () => {

    const tagNameToCreate = commonDetails.tagName;

    beforeEach("navigate to uploads file manager ", () => {
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

    it("File Manager Upload modal appears and 'Manage Tags' appears in the flyout menu ", () => {

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
                //Asserting Manage Tags as 3rd item in the menu 
                cy.get(ARUploadFileModal.getMenuItem()).eq(2).should('have.text', "Manage Tags")
                ARDashboardPage.getShortWait()
            })

        })

    })

    it("Selecting the 'Manage Tags' option in the fly-out menu opens up the 'Manage Tags' modal", () => {

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

            //clicking on the Rename button from flyout menu
            cy.get(ARFileManagerUploadsModal.getFlyoutMenu()).within(() => {
                //Asserting Manage Tags as 3rd item in the menu 
                cy.get(ARUploadFileModal.getMenuItem()).eq(2).should('have.text', "Manage Tags").click({ force: true })
                ARDashboardPage.getShortWait()
            })

        })

        //Asserting new dialogue as Rename File modal Appears 
        cy.get(ARFileManagerUploadsModal.getDialogues()).within(() => {

            cy.get(ARFileManagerUploadsModal.getDialoguesAsRole()).last().within(() => {

                //Asserting modal header
                cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', "Manage Tags")
                //Asserting Apply btn as active button
                cy.get(ARFileManagerManageTagModal.getApplyBtn()).should('have.attr', 'aria-disabled', 'false')
                //Asserting Apply btn is present
                cy.get(ARFileManagerManageTagModal.getApplyBtn()).should('have.text', "Apply")
                //Asserting Cancel btn is present
                cy.get(ARFileManagerManageTagModal.getCancelBtn()).should('have.text', "Cancel")
                //Asserting Tag section is present
                cy.get(ARFileManagerManageTagModal.getTagsSection()).find('span').first().should('have.text', 'Tags')
                //Clicking Cancel button
                cy.get(ARFileManagerManageTagModal.getCancelBtn()).should('have.text', "Cancel").click()

            })

        })
        // Asserting File Manager Upload Modal has been opened
        cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', 'File Manager')

    })


    it("working with dropdown", () => {
        //Clickin on the Manage Tags button 
        ARFileManagerUploadsModal.clickingOnFlyoutMenuByIndex(2)
        //Asserting new dialogue as Rename File modal Appears 
        ARFileManagerManageTagModal.clickinOnTheTagsField()
        //Filtering out the tag name 
        ARFileManagerManageTagModal.FilterByTagName(miscData.auto_tag1)
        //Asserting Filtered out Tag Name is Selected
        ARFileManagerManageTagModal.AssertingFilteredOutTagSelectedInDropDown(miscData.auto_tag1)


        //Asserting new dialogue as Rename File modal Appears 
        ARFileManagerManageTagModal.clickinOnTheTagsField()
        //Clicking again to make it work
        ARFileManagerManageTagModal.clickinOnTheTagsField()
        //Filtering out the tag name 
        ARFileManagerManageTagModal.FilterByTagName(miscData.auto_tag2)
        //Asserting Filtered out Tag Name is Selected
        ARFileManagerManageTagModal.AssertingFilteredOutTagSelectedInDropDown(miscData.auto_tag2)

        ARFileManagerManageTagModal.AssertingTagChicletIsPresent(miscData.auto_tag1)
        ARFileManagerManageTagModal.AssertingTagChicletIsPresent(miscData.auto_tag2)
        ARFileManagerManageTagModal.ClickingOnChicletDeselectTagBtn(miscData.auto_tag1)
        ARFileManagerManageTagModal.ClickingOnChicletDeselectTagBtn(miscData.auto_tag2)

    })


    it("create a new tag if tag name is not found", () => {

        ARFileManagerUploadsModal.clickingOnFlyoutMenuByIndex(2)
        //Asserting new dialogue as Rename File modal Appears 
        ARFileManagerManageTagModal.clickinOnTheTagsField()
        //Filtering out the tag name 
        ARFileManagerManageTagModal.TypingInTagInputFieldToCreate(tagNameToCreate)
        //Asserting tag create alert 
        //cy.get(ARDashboardPage.getToastNotificationMsg()).should('have.text' , ARFileManagerManageTagModal.getCreateTagMessage() )

        //login as an admin
        cy.visit('admin/dashboard')
        ARDashboardPage.getMediumWait()
        // Navigate to collaboration
        // Click on Engage From Left Panel.
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        // Click on Collaborations
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Tags'))
        //
        ARDashboardPage.getShortWait()
        cy.wrap(ARCollaborationAddEditPage.AddFilter('Name', 'Contains', tagNameToCreate))
        ARCollaborationAddEditPage.getLShortWait()
        //Clicking the first row 
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        //cliking on the delete button in the report page 
        cy.get(ARFileManagerManageTagModal.getTagDeleteBtnInReportPage()).click()
        // Delete  newly created tag
        cy.get(ARFileManagerManageTagModal.getDeleteTagModalInReportPage()).within(() => {
            cy.get(ARUnsavedChangesModal.getPromptFooter()).within(() => {
                cy.get(ARFileManagerManageTagModal.getDeleteBtn()).click()
            })
        })
    })


})