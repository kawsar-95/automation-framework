import ARCollaborationAddEditPage from '../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARAddObjectLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import ARPublishModal from '../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import arUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { lessons, resourcePaths } from '../../../../../../helpers/TestData/resources/resources'
import { users } from '../../../../../../helpers/TestData/users/users'




describe("AR - OC - FileUpload for SCORM 1.2 ", function () {

    beforeEach(function () {
        // Admin logins and visits to Courses page
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after(() => {
        //Deleteing course at the end of test 
        cy.deleteCourse(commonDetails.courseID);
    })

    // creating an online course
    it("Create Course", () => {
        cy.createCourse("Online Course")
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn("All Learners")
        //Set enrollment rule - Allow self enrollment for all learners
           cy.publishCourseAndReturnId().then((id) => {
               commonDetails.courseID = id.request.url.slice(-36)
           })
        ARDashboardPage.getMediumWait()
    })

    it("File Upload For SCORM 1.2 ", function () {
        //filtering out the course created in previous block
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', ocDetails.courseName))
        arCoursesPage.getShortWait()
        cy.get(arCoursesPage.getTableCellName(2)).click()
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Edit'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Edit')).click()
        cy.intercept('/api/rest/v2/admin/reports/courses/operations').as('getCourseEdit').wait('@getCourseEdit')
        //Asserting More 
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBannerBtn('More')).should('exist')
        arCoursesPage.getMediumWait()
        // User has been navigated to edit page 
        // Clicking on the Syllabus Button 
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Syllabus")).click()
        //Clicking on Add Learning Object
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).click()
        //Selecting Leaning Object as SCORM 1.2
        ARSelectLearningObjectModal.getObjectTypeByName('SCORM 1.2')
        //Clicking on Next Button
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARDashboardPage.getMediumWait()

        //Uploading Zip the file in the Upload modal
        cy.get(arUploadFileModal.getChooseFileBtn()).contains('Choose File').click()
        cy.get(arUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_lessons_folder + lessons.scorm_12_complete_Failed_filename)
        cy.contains("Continue").click()

        //type something in the title and description of the page
        cy.get("#modal-content-2").find(ARCollaborationAddEditPage.getResourceNameTxtF()).type(lessons.scorm_12_complete_Failed_filename, { delay: 50 })
        cy.get("#modal-content-2").find(ARCollaborationAddEditPage.getResourceDescriptionTxtF()).type("We are adding SCORM 1.2 type learning object ", { delay: 50 })
        cy.get(ARAddObjectLessonModal.getApplyBtn()).click()
        ARDashboardPage.getMediumWait()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
        ARDashboardPage.getMediumWait()
    })

})