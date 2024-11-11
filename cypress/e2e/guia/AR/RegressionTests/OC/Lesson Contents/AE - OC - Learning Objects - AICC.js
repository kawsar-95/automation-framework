import ARCollaborationAddEditPage from "../../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage";
import ARAddMoreCourseSettingsModule from "../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module";
import AROCAddEditPage from "../../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage";
import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARSelectLearningObjectModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal";
import ARSelectModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal";
import ARUploadFileModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal";
import LEDashboardPage from "../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage";
import LESideMenu from "../../../../../../../helpers/LE/pageObjects/Menu/LESideMenu";
import { commonDetails } from "../../../../../../../helpers/TestData/Courses/commonDetails";
import { ocDetails } from "../../../../../../../helpers/TestData/Courses/oc";
import { lessons, resourcePaths } from "../../../../../../../helpers/TestData/resources/resources";
import { userDetails } from "../../../../../../../helpers/TestData/users/UserDetails";
import { users } from "../../../../../../../helpers/TestData/users/users";
import ARComposeMessagePage from '../../../../../../../helpers/AR/pageObjects/Messages/ARComposeMessagePage';
import AREnrollUsersPage from "../../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage";
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module";
import ARPublishModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal";
import LEResourcesPage from "../../../../../../../helpers/LE/pageObjects/Resources/LEResourcesPage";
import LECourseLessonPlayerPage from "../../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage";
import ARAddObjectLessonModal from "../../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal";


describe('AUT-682 C7301 AE Regression - Online Course - Learning Objects - AICC (cloned) T832321', function () {
    
    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0);
        //Signin as admin then turn on Next Gen toggle
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
       LEDashboardPage.turnOnNextgenToggle()
    })

    beforeEach('Login', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
    })
    
    after('Cleanup', () => {
        //Signin as an admin then turn off Next Gen toggle and clean up the created data
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LEDashboardPage.turnOffNextgenToggle()
        //Delete the course 
        cy.deleteCourse(commonDetails.courseID)
        //Delete user via API
        cy.deleteUser(userDetails.userID)
    })

    it("Create Online Course and Add AICC Lesson", () => {
        //Create Course
        cy.createCourse('Online Course', ocDetails.courseName)
        //Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        // Clicking on the Syllabus Button 
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Syllabus")).click() //Clicking on Add Learning Object
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).click() //Selecting Leaning Object as AICC
        ARSelectLearningObjectModal.getObjectTypeByName('AICC')//Clicking on Next Button
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        cy.get(ARSelectLearningObjectModal.getModal2()).should('be.visible')
        //Uploading Zip the file in the Upload modal
        cy.get(ARUploadFileModal.getChooseFileBtn()).contains('Choose File').click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_lessons_folder + lessons.aicc_bunnies_filename)
        cy.get(ARUploadFileModal.getContinueBtn()).should('have.attr','aria-disabled','false').click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:60000}).should('not.exist')
        //type something in the title and description of the page
        cy.get(ARAddObjectLessonModal.getAddLessonObjectModule()).find(ARCollaborationAddEditPage.getResourceNameTxtF()).type(lessons.aicc_bunnies_filename, { delay: 50 })
        cy.get(ARAddObjectLessonModal.getAddLessonObjectModule()).find(ARCollaborationAddEditPage.getResourceDescriptionTxtF()).type("We are adding AICC type learning object ", { delay: 50 })
        cy.get(ARAddObjectLessonModal.getApplyBtn()).click()
        cy.get(AROCAddEditPage.getLearningObjectName()).scrollIntoView().should('be.visible').and('contain',`${lessons.aicc_bunnies_filename}`)
        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('contain', 'Course successfully published')
        //Enroll User
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
    })

    it("Edit Online Course and Add AICC Lesson then upload third party lesson", () => {
        //Edit Course
        cy.editCourse(ocDetails.courseName)
        // Clicking on the Syllabus Button 
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Syllabus")).click()
        // Clicking on Add Learning Object
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).click()
        //Selecting Leaning Object as AICC
        ARSelectLearningObjectModal.getObjectTypeByName('AICC')
        //Clicking on Next Button
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        cy.get(ARSelectLearningObjectModal.getModal2()).should('be.visible')
        //Uploading Zip the file in the Upload modal
        cy.get(ARUploadFileModal.getChooseFileBtn()).contains('Choose File').click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_lessons_folder + lessons.scorm_12_complete_Failed_filename)
        cy.get(ARUploadFileModal.getContinueBtn()).should('have.attr','aria-disabled','false').click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:60000}).should('not.exist')
        cy.get(ARComposeMessagePage.getErrorMessage()).should('contain','Sorry, something went wrong. If this problem persists, please contact your system administrator.')
    })


    it("Edit Online Course and replace AICC Lesson with the same or different third party lesson", () => {
        //Edit Course
        cy.editCourse(ocDetails.courseName)
        // Clicking on the Syllabus Button 
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Syllabus")).click()
        //Clicking on Add Learning Object
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).click()
        //Selecting Leaning Object as AICC
        ARSelectLearningObjectModal.getObjectTypeByName('AICC')
        //Clicking on Next Button
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        cy.get(ARSelectLearningObjectModal.getModal2()).should('be.visible')
        //Uploading Zip the file in the Upload modal
        cy.get(ARUploadFileModal.getChooseFileBtn()).contains('Choose File').click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_lessons_folder + lessons.aicc_bunnies_filename)
        // Replace the lesson
        ARSelectLearningObjectModal.getObjectTypeByName('Replace an existing lesson')
        cy.get(ARSelectLearningObjectModal.getSelectLessonBtn()).should('be.visible').click()
        cy.get(ARSelectModal.getSelecDepartmentDropDownBtn()).click()
       cy.get(ARSelectModal.getSelectOpt()).eq(1).click() 
        cy.get(ARSelectModal.getHierarchySelectModal() + " " + ARSelectModal.getChooseBtn()).click()
        cy.get(ARUploadFileModal.getContinueBtn()).should('have.attr','aria-disabled','false').click()
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:60000}).should('not.exist')
        cy.get(AROCAddEditPage.getLearningObjectName()).scrollIntoView().should('be.visible')
    })

    it('Delete the AICC Learning Object from the course', () => {
        //Edit Course
        cy.editCourse(ocDetails.courseName)
        // Clicking on the Syllabus Button 
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Syllabus")).click()
        //Delete AICC Lesson
        cy.get(AROCAddEditPage.getDeleteLessonBtn()).each(($el, index, $list) => {
            cy.wrap($el).click()
            cy.get(AROCAddEditPage.getDeleteLessonConfirm()).contains('Delete').click()
        })
        cy.get(AROCAddEditPage.getNoLearningObjectMsg()).should('be.visible').and('contain','No learning objects have been added.')

        //Publish Course
         cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

        //Login to LE, go to course
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), { timeout: 15000 }).should('not.exist', { timeout: 15000 })
        cy.get(LEResourcesPage.getCourseCardForOnlineCourse(ocDetails.courseName)).should('contain', ocDetails.courseName).click()
        //Verify AICC Lesson object is no longer exists
        LECourseLessonPlayerPage.getTabMenuItemsByName('Lesson')
        cy.get(LECourseLessonPlayerPage.getLessonContentContainer()).contains(lessons.aicc_bunnies_filename).should('not.exist')
    })

})