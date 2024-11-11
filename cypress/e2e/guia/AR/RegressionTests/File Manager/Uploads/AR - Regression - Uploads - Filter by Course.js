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




describe("C7370 - AUT-738 - NASA-7136 - AR - Regression -Uploads - Filter by Course  ", () => {

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
        cy.get(ARFileManagerUploadsModal.getMediaLibraryApplyBtn()).click()

        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })

        //Saving Second Course Name
        commonDetails.courseNames.push(ilcDetails.courseName)

        
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

    it("Asserting Multiple Courses can be selected by filtering out from Courses", () => {

        // Asserting File Manager Upload Modal has been opened
        cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', 'File Manager')

        cy.get(ARFileManagerUploadsModal.getMediaLibrarySidebar()).within(() => {
            //Asserting Course is present 
            cy.get(ARFileManagerUploadsModal.getCoursesBlockFromSidebar()).find('span').contains('Courses')

        })
        //Clicking on Course Filter Selection 
        cy.get(ARFileManagerUploadsModal.getCoursesBlockFromSidebar()).within(() => {
            cy.get(ARFileManagerUploadsModal.getSelection()).click()
        })
        //Typing the course 
        cy.get(ARFileManagerUploadsModal.getFlyoutMenu()).within(() => {
            cy.get(ARFileManagerUploadsModal.getCourseInputField()).clear().type(commonDetails.courseNames[0])

            cy.get(ARFileManagerUploadsModal.getOptionsList()).within(() => {
                cy.get(ARFileManagerUploadsModal.getSelectionSpanLable()).contains(commonDetails.courseNames[0]).click({ force: true })
                ARDashboardPage.getShortWait()
            })

        })

        //Asserting Course been Selected
        cy.get(ARFileManagerUploadsModal.getCoursesBlockFromSidebar()).within(() => {
            cy.get(ARFileManagerUploadsModal.getSelection()).within(() => {
                cy.get(ARFileManagerUploadsModal.getMaxSelectionLabel()).should('have.text', "1 Courses")
            })
        })
        //Asserting its on the filter options
        cy.get(ARFileManagerUploadsModal.getMediaLibraryFilterItems()).within(() => {
            ARFileManagerUploadsModal.getFilterItemFromValue(commonDetails.courseNames[0]).should('have.text', commonDetails.courseNames[0]).click({ force: true })
        })

        cy.get(ARFileManagerUploadsModal.getModalHeader()).should('have.text', 'File Manager').click()

        
        //Clicking on Course Filter Selection for 2nd  Choice
        cy.get(ARFileManagerUploadsModal.getCoursesBlockFromSidebar()).within(() => {
            cy.get(ARFileManagerUploadsModal.getSelection()).click()
        })

        //typing 2nd course
        cy.get(ARFileManagerUploadsModal.getFlyoutMenu()).within(() => {
            cy.get(ARFileManagerUploadsModal.getCourseInputField()).type(commonDetails.courseNames[1] ,{delay :50})

            cy.get(ARFileManagerUploadsModal.getOptionsList()).within(() => {
                cy.get(ARFileManagerUploadsModal.getSelectionSpanLable()).contains(commonDetails.courseNames[1]).click({ force: true })
                ARDashboardPage.getShortWait()
            })

        })

        //Asserting 2nd Course been Selected
        cy.get(ARFileManagerUploadsModal.getCoursesBlockFromSidebar()).within(() => {
            cy.get(ARFileManagerUploadsModal.getSelection()).within(() => {
                cy.get(ARFileManagerUploadsModal.getMaxSelectionLabel()).should('have.text', "2 Courses")
            })
        })
        //Asserting 2nd Course in the filter modal
        cy.get(ARFileManagerUploadsModal.getMediaLibraryFilterItems()).within(() => {
            ARFileManagerUploadsModal.getFilterItemFromValue(commonDetails.courseNames[1]).should('have.text', commonDetails.courseNames[1]).click({ force: true })
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

    it("Third-party Lesson Object files (Scorm, Tin Can, AICC) do not appear in the results.", () => {

        ARFileManagerUploadsModal.getFilterItemDeselectFromValueAndClickAndAsserting(resource)

        ARFileManagerUploadsModal.FilterByCourseName(courses.oc_lesson_act_ssta_aicc_name)
        ARDashboardPage.getShortWait()

        ARFileManagerUploadsModal.FilterByCourseName(courses.oc_lesson_act_ssta_scorm_1_2_name)
        ARDashboardPage.getShortWait()

        ARFileManagerUploadsModal.FilterByCourseName(courses.oc_lesson_act_ssta_scorm_2004_name)
        ARDashboardPage.getShortWait()

        ARFileManagerUploadsModal.FilterByCourseName(courses.oc_lesson_act_ssta_tin_can_name)
        ARDashboardPage.getShortWait()

        cy.get(ARFileManagerUploadsModal.getMediaLibraryCount()).should('have.text', "Showing 0 of 0 files")

    })



    after('Delete Online Course', () => {
        //Delete Course
        cy.deleteCourse(commonDetails.courseIDs[0])
        //Deleting 2nd Course
        cy.deleteCourse(commonDetails.courseIDs[1], 'instructor-led-courses-new')
    })

})







