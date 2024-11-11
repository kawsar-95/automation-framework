import ARCollaborationAddEditPage from "../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsCatalogVisibilityModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module"
import ARCourseSettingsCourseUploadsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseUploads.module"
import ARCourseSettingsAttributesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAttributes.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import ARCourseSettingsResourcesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsResources.module"
import AROCAddEditPage, { coursePageMessages } from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARAddObjectLessonModal from "../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal"
import ARSelectLearningObjectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal"
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import ARUploadInstructionsModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadInstructionsModal"
import { lessonObjects, ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import {
    pdfs,
    resourcePaths,
} from "../../../../../../helpers/TestData/resources/resources"
import { users } from "../../../../../../helpers/TestData/users/users"
import ARCourseSettingsSocialModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsSocial.module"
import ARDashboardAccountMenu from "../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import LEFilterMenu from "../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu"
import LECourseLessonPlayerPage from "../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage"
import LECoursesPage from "../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage"
import AREditClientUserPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import LECatalogPage from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage"

/**
 * Testrail URL:
 * https://absorblms.testrail.io/index.php?/cases/view/6309
 */
describe("Course Player - Verify the default view of Course Player UI after enrolling into an Online Course", () => {
    
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
    })

    after(() => {
        cy.deleteCourse(commonDetails.courseID)
    })

    it("NextGenLearnerExperience On", () => {
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 5000}).should('not.exist')
        // Select Account Menu 
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn())).click()
        // Select Portal Setting option from account menu
        cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        // Validate portal setting page header
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should('have.text', 'Edit Client')
        cy.get(ARDashboardPage.getUsersTab()).click()
        // Turn on next gen toggle button
        AREditClientUserPage.getTurnOnNextgenToggle()
        cy.get(AREditClientUserPage.getSaveBtn()).click()
    })

    it("Add online course with multiple learning object", () => {
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Courses")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("Courses"))
        cy.get(ARCoursesPage.getWaitSpinner(), {timeout: 15_000}).should('not.exist')
        cy.createCourse('Online Course')

        //Add first object to chapter
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).click()
        ARSelectLearningObjectModal.getObjectTypeByName("Object")
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddBasicObjectLesson(lessonObjects.objectName, 'File')

        //Add second object to chapter
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).click()
        ARSelectLearningObjectModal.getObjectTypeByName("Object")
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddBasicObjectLesson(lessonObjects.objectName, 'File')
        

        //Allow self enrollment - all learners
        cy.get(ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentForm()).within(() => {
            cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnLabel()).contains("All Learners").click()
        })

        //Set Recommended Course
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Catalog Visibility")).click()
        ARCourseSettingsCatalogVisibilityModule.generalToggleSwitch('true', ARCourseSettingsCatalogVisibilityModule.getRecommendedCoursesToggleContainer())

        //Add resourses
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Resources")).click()
        cy.get(ARCollaborationAddEditPage.getAddResourceBtn()).click()
        ARCourseSettingsResourcesModule.setResourceTxtName("Resource 1")
        ARCourseSettingsResourcesModule.clickChooseFileBtn()
        cy.get(ARUploadFileModal.getUploadbtnandClick()).click()

        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_pdf_folder + pdfs.sample_filename)
        cy.get(ARUploadFileModal.getSaveBtn()).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARAddObjectLessonModal.getWaitSpinner(), { timeout: 30000 }).should('not.exist')
        
        //Course Upload
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Course Uploads")).click()
        cy.get(ARCourseSettingsCourseUploadsModule.getAddUploadBtn()).click()
        cy.get(ARCourseSettingsCourseUploadsModule.getEditUploadInstructionsBtn()).click()
        cy.get(ARCourseSettingsCourseUploadsModule.getElementByAriaLabelAttribute("Upload Instructions")).type(coursePageMessages.UPLOAD_INSTRUCTION)

        cy.get(ARCourseSettingsCourseUploadsModule.getElementByAriaLabelAttribute("Upload Instructions")).type("{selectall}")
        cy.get(ARUploadInstructionsModal.getModalContainer()).find(ARUploadInstructionsModal.getBoldBtn()).click()
        cy.get(ARUploadInstructionsModal.getModalContainer()).find(ARUploadInstructionsModal.getItalicBtn()).click()
        cy.get(ARUploadInstructionsModal.getApplyBtn()).click()

        //Add attributes
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Attributes")).click()
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Attributes")).click()
        ARCourseSettingsAttributesModule.generalToggleSwitch('true', ARCourseSettingsAttributesModule.getEnableCourseEvalToggleContainer())

        cy.get(ARCourseSettingsAttributesModule.getDisableCourseRatingToggle()).click()
        cy.get(ARCourseSettingsAttributesModule.getUseDefaultQuestionsBtn()).click()

        //Set Social
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Social")).click()
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Social")).click()
        cy.get(ARCourseSettingsSocialModule.getAllowCommentsToggle()).click()

        //publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
    })
    it("Start Learner Experience", () => {        
        cy.visit('/#/catalog')
        LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
        cy.waitUntil(() => cy.get(LECatalogPage.getCourseLoader()))
        cy.get(LECoursesPage.getEnrollBtn()).click()        
        LECoursesPage.getAndClickStartBtn()        
        cy.waitUntil(() => cy.get(LECatalogPage.getCourseLoader()))

        //Assertions
        //Course Name
        cy.get(LECourseLessonPlayerPage.getCourseTitle()).should('contain', ocDetails.courseName)
        //Close Button
        cy.get(LECourseLessonPlayerPage.getCloseBtn()).should('be.visible')
        //Previous button
        cy.get(LECourseLessonPlayerPage.getPreviousBtn()).should('be.visible')
        //Next button
        cy.get(LECourseLessonPlayerPage.getNextBtn()).should('be.visible')
        //Get overview
        cy.get(LECourseLessonPlayerPage.getOverviewTabBtn()).should('be.visible')
        //Get resource
        cy.contains(LECourseLessonPlayerPage.getTabBtn(), 'Resources').should('be.visible')
        //Get reviews
        cy.contains(LECourseLessonPlayerPage.getTabBtn(), 'Reviews').should('be.visible')
    })
})
