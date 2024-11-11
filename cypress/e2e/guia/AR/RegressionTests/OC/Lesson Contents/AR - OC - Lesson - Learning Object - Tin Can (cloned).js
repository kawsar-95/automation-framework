import ARCollaborationAddEditPage from '../../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage'
import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import AROCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARAddObjectLessonModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import ARAddThirdPartyLessonModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARAddThirdPartyLessonModal'
import ARDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARSelectLearningObjectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARUploadFileModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import AREnrollUsersPage from '../../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import LECourseDetailsOCModule from '../../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEProfilePage from '../../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { ocDetails } from '../../../../../../../helpers/TestData/Courses/oc'
import { lessons, resourcePaths } from '../../../../../../../helpers/TestData/resources/resources'
import { userDetails } from '../../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import LECourseLessonPlayerPage from '../../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'


describe("C7300 AUT-681, AR - OC - Lesson - Learning Object - Tin Can (cloned)", function () {
    before(function() {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)

        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LEDashboardPage.turnOffNextgenToggle()
    })

    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
    })

    after(function () {
        // Delete course and user
        cy.deleteCourse(commonDetails.courseID)

        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36))
        })
    })

    it("Create Online Course and Add TIN CAN Lesson", () => {
        cy.createCourse('Online Course')

        // Clicking on the Syllabus Button 
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Syllabus")).click()

        //Clicking on Add Learning Object
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).click()

        // admin is unable to add the third party lesson.
        ARSelectLearningObjectModal.getObjectTypeByName('SCORM 2004')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        cy.get(ARUploadFileModal.getChooseFileBtn()).contains('Choose File').click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_lessons_folder + lessons.tincan_quiz_filename)
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.contains("Continue").click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(ARUploadFileModal.getFileUploadError()).should('contain', ARUploadFileModal.getFileUploadErrorMsg())

        //Clicking on Back Button
        cy.get(ARSelectLearningObjectModal.getBackBtn()).click()
        
        //Selecting Leaning Object as Tin Can
        ARSelectLearningObjectModal.getObjectTypeByName('Tin Can')

        //Clicking on Next Button
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()

        //Uploading Zip the file in the Upload modal
        cy.get(ARUploadFileModal.getChooseFileBtn()).contains('Choose File').click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_lessons_folder + lessons.tincan_quiz_filename)
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.contains("Continue").click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        //type something in the title and description of the page
        cy.get(ARAddThirdPartyLessonModal.getNameTxtF()).type(lessons.tincan_quiz_filename, { delay: 50 })
        cy.get(ARAddThirdPartyLessonModal.getDescription()).type("We are adding TIN CAN type learning object.")
        cy.get(ARAddThirdPartyLessonModal.getApplyBtn()).click()

        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
    })

    it("Verify Lesson in LE", () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getCourseCardBtnThenClick(ocDetails.courseName)
        LEDashboardPage.getLShortWait()

        //Verify Tin Can lesson exists
        cy.get(LECourseDetailsOCModule.getLessonName()).contains(lessons.tincan_quiz_filename).should('be.visible')
        
        LECourseDetailsOCModule.getCourseLessonActionBtn(lessons.tincan_quiz_filename, 'Start', true)
        LEDashboardPage.getLShortWait() 
        cy.get(LECourseLessonPlayerPage.getCloseBtn()).click()
        LEDashboardPage.getMediumWait() //There is a 2s pause when closing a lesson
    })

    it("Edit TIN CAN Lesson", () => {
        cy.editCourse(ocDetails.courseName)

        AROCAddEditPage.getEditBtnByLessonNameThenClick(lessons.tincan_quiz_filename)

        cy.get(ARAddThirdPartyLessonModal.getNameTxtF()).clear().type(`${lessons.tincan_quiz_filename}${commonDetails.appendText}`)
        cy.get(ARAddThirdPartyLessonModal.getDescription()).clear().type(`We are adding TIN CAN type learning object. ${commonDetails.appendText}`)

        //Save lesson
        cy.get(ARAddThirdPartyLessonModal.getApplyBtn()).click()

        //publish course
        cy.publishCourse()
    })

    it("Verify Updated Lesson in LE", () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getCourseCardBtnThenClick(ocDetails.courseName)
        LEDashboardPage.getLShortWait()

        //Verify Tin Can lesson exists
        cy.get(LECourseDetailsOCModule.getLessonName()).contains(`${lessons.tincan_quiz_filename}${commonDetails.appendText}`).should('be.visible')
        
        LECourseDetailsOCModule.getCourseLessonActionBtn(`${lessons.tincan_quiz_filename}${commonDetails.appendText}`, 'Resume', true)
        LEDashboardPage.getLShortWait() 
        cy.get(LECourseLessonPlayerPage.getCloseBtn()).click()
        LEDashboardPage.getMediumWait() //There is a 2s pause when closing a lesson
    })

    it('TIN CAN Lesson Object can be Deleted, Publish Course', () => { 
        cy.editCourse(ocDetails.courseName)

        //Delete Tin Can Lesson
        AROCAddEditPage.getDeleteBtnByLessonNameThenClick(`${lessons.tincan_quiz_filename}${commonDetails.appendText}`)
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()

        //publish course
        cy.publishCourse()
    })

    it('Verify Lesson Does not Exist in LE', () => { 
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getCourseCardBtnThenClick(ocDetails.courseName)
        LEDashboardPage.getLShortWait()

        //Verify Tin Can lesson no longer exists
        cy.get(LECourseDetailsOCModule.getLessonName()).should('not.exist')
    })
})