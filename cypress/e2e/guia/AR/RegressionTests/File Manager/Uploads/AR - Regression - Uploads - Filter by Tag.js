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




describe("C7375 - AUT-743 - NASA-7137 - Uploads - Filter by Tags  ", () => {

    let billboard = "Billboards";
    let posters = "Posters";
    let resource = "Resources";

    before("create course with resource", () => {

        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        //create first course
        cy.createCourse('Online Course')

        //Asserting that Automatic Tagging is enabled
        // Automatic tagging is ON by default
        cy.get(ARCBAddEditPage.getAutomaticTaggingToggle() + ' ' + ARCoursesPage.getEnableToggleStatus()).should('have.text', 'On')
        // General Automatic Tagging text field
        cy.get(ARCBAddEditPage.getAutomaticTaggingToggle() + ' ' + ARCBAddEditPage.getStatusFieldText()).should('have.text', coursePageMessages.AUTO_GENERATED_TAG_MESSAGE)

        ARDashboardPage.getShortWait()
        //Add Recommended Course Tags
        cy.get(AROCAddEditPage.getCoursesTagsByDataName()).within(() => {

            cy.get(ARCBAddEditPage.getTagsDropdownByDataName()).click()
            cy.get(ARCBAddEditPage.getTagsInputFieldByDataName()).type(miscData.auto_tag1)
            ARDashboardPage.getShortWait()
            cy.get(ARFileManagerUploadsModal.getSelectionSpanLable()).contains(miscData.auto_tag1).click()

        })


        //Create Multiple Resource with Url Type Attachment
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
        //selecting the first preview file
        cy.get(ARUploadFileModal.getMediaLibraryImagePreview()).first().click()
        //clikcing on apply button
        cy.get(ARFileManagerUploadsModal.getMediaLibraryApplyBtn()).contains('Apply').click()

        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
        //Saving Course Name
        commonDetails.courseNames.push(ocDetails.courseName)

        //Create Second Course 
        cy.createCourse('Instructor Led')

        ARDashboardPage.getShortWait()
        cy.get(AROCAddEditPage.getCoursesTagsByDataName()).within(() => {

            cy.get(ARCBAddEditPage.getTagsDropdownByDataName()).click()
            cy.get(ARCBAddEditPage.getTagsInputFieldByDataName()).type(miscData.auto_tag2)
            ARDashboardPage.getShortWait()
            cy.get(ARFileManagerUploadsModal.getSelectionSpanLable()).contains(miscData.auto_tag2).click()

        })

        // Automatic tagging is ON by default
        cy.get(ARCBAddEditPage.getAutomaticTaggingToggle() + ' ' + ARCoursesPage.getEnableToggleStatus()).should('have.text', 'On')
        // General Automatic Tagging text field
        cy.get(ARCBAddEditPage.getAutomaticTaggingToggle() + ' ' + ARCBAddEditPage.getStatusFieldText()).should('have.text', coursePageMessages.AUTO_GENERATED_TAG_MESSAGE)


        //Create Multiple Resource with Url Type Attachment
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
        //selecting the first preview file
        cy.get(ARUploadFileModal.getMediaLibraryImagePreview()).first().click()
        //clikcing on apply button
        cy.get(ARFileManagerUploadsModal.getMediaLibraryApplyBtn()).contains('Apply').click()



        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })

        //Saving Second Course Name
        commonDetails.courseNames.push(ilcDetails.courseName)

        commonDetails.tagNames.push(miscData.auto_tag1)
        commonDetails.tagNames.push(miscData.auto_tag2)


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

    it("Asserting Multiple Tags can be selected by filtering out from Tags", () => {

        // Asserting File Manager Upload Modal has been opened
        cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', 'File Manager')

        cy.get(ARFileManagerUploadsModal.getMediaLibrarySidebar()).within(() => {
            //Asserting Course is present 
            cy.get(ARFileManagerUploadsModal.getTagsBlockFromSidebar()).find('span').contains('Tags')

        })
        //Clicking on Course Filter Selection 
        cy.get(ARFileManagerUploadsModal.getTagsBlockFromSidebar()).within(() => {
            cy.get(ARFileManagerUploadsModal.getSelection()).click()
        })
        //Typing the course 
        cy.get(ARFileManagerUploadsModal.getFlyoutMenu()).within(() => {
            cy.get(ARFileManagerUploadsModal.getCourseInputField()).clear().type(commonDetails.tagNames[0])

            cy.get(ARFileManagerUploadsModal.getOptionsList()).within(() => {
                cy.get(ARFileManagerUploadsModal.getSelectionSpanLable()).contains(commonDetails.tagNames[0]).click({ force: true })
                ARDashboardPage.getShortWait()
            })

        })

        //Asserting Course been Selected
        cy.get(ARFileManagerUploadsModal.getTagsBlockFromSidebar()).within(() => {
            cy.get(ARFileManagerUploadsModal.getSelection()).within(() => {
                cy.get(ARFileManagerUploadsModal.getMaxSelectionLabel()).should('have.text', "1 Tags")
            })
        })
        //Asserting its on the filter options
        cy.get(ARFileManagerUploadsModal.getMediaLibraryFilterItems()).within(() => {
            ARFileManagerUploadsModal.getFilterItemFromValue(commonDetails.tagNames[0]).should('have.text', commonDetails.tagNames[0]).click({ force: true })
        })

        cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', 'File Manager').click()


        //Clicking on Course Filter Selection for 2nd  Choice
        cy.get(ARFileManagerUploadsModal.getTagsBlockFromSidebar()).within(() => {
            cy.get(ARFileManagerUploadsModal.getSelection()).click()
        })

        //typing 2nd course
        cy.get(ARFileManagerUploadsModal.getFlyoutMenu()).within(() => {
            cy.get(ARFileManagerUploadsModal.getCourseInputField()).type(commonDetails.tagNames[1], { delay: 50 })

            cy.get(ARFileManagerUploadsModal.getOptionsList()).within(() => {
                cy.get(ARFileManagerUploadsModal.getSelectionSpanLable()).contains(commonDetails.tagNames[1]).click({ force: true })
                ARDashboardPage.getShortWait()
            })

        })

        //Asserting 2nd Course been Selected
        cy.get(ARFileManagerUploadsModal.getTagsBlockFromSidebar()).within(() => {
            cy.get(ARFileManagerUploadsModal.getSelection()).within(() => {
                cy.get(ARFileManagerUploadsModal.getMaxSelectionLabel()).should('have.text', "2 Tags")
            })
        })
        //Asserting 2nd Course in the filter modal
        cy.get(ARFileManagerUploadsModal.getMediaLibraryFilterItems()).within(() => {
            ARFileManagerUploadsModal.getFilterItemFromValue(commonDetails.tagNames[1]).should('have.text', commonDetails.tagNames[1]).click({ force: true })
        })

    })


    it("UnChecking filters from sidebar reflects in the upload section ", () => {
        //Asserting Billboards
        ARFileManagerUploadsModal.ClickSideBarMenuItemAndAssertingInFilterItems(billboard)
        //Asserting Posters
        ARFileManagerUploadsModal.ClickSideBarMenuItemAndAssertingInFilterItems(posters)
        //Asserting billboards removed from upload section also unchecked in sidebar
        ARFileManagerUploadsModal.getFilterItemDeselectFromValueAndClickAndAsserting(billboard)
        //Asserting posters removed from upload section also unchecked in sidebar
        ARFileManagerUploadsModal.getFilterItemDeselectFromValueAndClickAndAsserting(posters)

    })
    
    after('Delete Online Course', () => {
        //Delete Course
        cy.deleteCourse(commonDetails.courseIDs[0])
        //Deleting 2nd Course
        cy.deleteCourse(commonDetails.courseIDs[1])
    })

})
