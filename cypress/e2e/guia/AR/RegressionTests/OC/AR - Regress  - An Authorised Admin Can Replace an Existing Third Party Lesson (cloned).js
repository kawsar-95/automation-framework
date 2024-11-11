import ARCollaborationAddEditPage from '../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARAddObjectLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import ARFileManagerUploadsModal from '../../../../../../helpers/AR/pageObjects/Modals/ARFileManagerUploadsModal'
import ARSelectLearningObjectModal, { ImportCourseData } from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import arUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import AREnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LEResourcesPage from '../../../../../../helpers/LE/pageObjects/Resources/LEResourcesPage'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { lessons, lessonsNameWithoutExtension, resourcePaths } from '../../../../../../helpers/TestData/resources/resources'
import { users } from '../../../../../../helpers/TestData/users/users'



describe('C801 - AUT-223 - An Authorised Admin Can Replace an Existing Third Party Lesson (cloned)', () => {

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
    })


    //Create an online course with SCORM1.2 Lesson
    it("Create Online Course with SCORM1.2 Lesson and asserting modal ", () => {
        //Create Course
        cy.createCourse('Online Course')

        // Clicking on the Syllabus Button 
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Syllabus")).click()

        //Clicking on Add Learning Object
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).click()

        //Selecting Leaning Object as TinCan
        ARSelectLearningObjectModal.getObjectTypeByName(ImportCourseData.Tin_Can)

        //Clicking on Next Button
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        //Asserting 'Replace an existing lesson is present' for Tin Can
        cy.get(ARSelectLearningObjectModal.getReplaceExistingLessonRadioBtn()).should('exist')
        cy.get(ARSelectLearningObjectModal.getReplaceExistingLessonRadioBtn()).parent().should('contain', 'Replace an existing lesson')
        cy.get(ARSelectLearningObjectModal.getBackBtn()).click()

        ARSelectLearningObjectModal.getObjectTypeByName(ImportCourseData.AICC)
        //Clicking on Next Button
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        //Asserting 'Replace an existing lesson is present' for AICC
        cy.get(ARSelectLearningObjectModal.getReplaceExistingLessonRadioBtn()).should('exist')
        cy.get(ARSelectLearningObjectModal.getReplaceExistingLessonRadioBtn()).parent().should('contain', 'Replace an existing lesson')
        cy.get(ARSelectLearningObjectModal.getBackBtn()).click()

        ARSelectLearningObjectModal.getObjectTypeByName(ImportCourseData.SCORM_2004)
        //Clicking on Next Button
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        //Asserting 'Replace an existing lesson is present' for SCORM_2004
        cy.get(ARSelectLearningObjectModal.getReplaceExistingLessonRadioBtn()).should('exist')
        cy.get(ARSelectLearningObjectModal.getReplaceExistingLessonRadioBtn()).parent().should('contain', 'Replace an existing lesson')
        cy.get(ARSelectLearningObjectModal.getBackBtn()).click()

        ARSelectLearningObjectModal.getObjectTypeByName(ImportCourseData['SCORM_1.2'])
        //Clicking on Next Button
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        //Asserting 'Replace an existing lesson is present' for SCORM_1.2
        cy.get(ARSelectLearningObjectModal.getReplaceExistingLessonRadioBtn()).should('exist')
        cy.get(ARSelectLearningObjectModal.getReplaceExistingLessonRadioBtn()).parent().should('contain', 'Replace an existing lesson')

        //Uploading Zip the file in the Upload modal
        cy.get(arUploadFileModal.getChooseFileBtn()).contains('Choose File').click()
        cy.get(arUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_lessons_folder + lessons.turtles_scorm12_filename)
        ARUploadFileModal.getShortWait()
        cy.contains("Continue").click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')

        //type something in the title and description of the page
        cy.get(ARDashboardPage.getModalTitle()).contains('Title').parent().parent().find(ARCollaborationAddEditPage.getResourceNameTxtF()).type(lessonsNameWithoutExtension.turtles_scorm12_filename, { delay: 50 })
        cy.get(ARDashboardPage.getModalTitle()).contains('Title').parent().parent().find(ARCollaborationAddEditPage.getResourceDescriptionTxtF()).type("We are adding SCORM 1.2 type learning object ", { delay: 50 })
        cy.get(ARAddObjectLessonModal.getApplyBtn()).click()

        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')


        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [users.learner01.learner_01_username])

    })

    it("verify Course Lesson in the learner side", () => {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(LEResourcesPage.getCourseCardName()).should('contain', ocDetails.courseName).should('be.visible').click()
        cy.get(LECatalogPage.getCourseDetailsTabConainer()).contains('Lessons').should('exist').and('be.visible').click()
         //Verify Available lesson
         cy.get(LECourseDetailsOCModule.getChapterTitle()).should('contain', ocDetails.defaultChapterName).parents(LECourseDetailsOCModule.getChapterContainer())
         .within(() => {
             cy.get(LECourseDetailsOCModule.getNumLessons()).should('contain', '1')
             cy.get(LECourseDetailsOCModule.getLessonName()).should('contain', lessonsNameWithoutExtension.turtles_scorm12_filename )
         })

    })


    it('edit existing Lesson and replace with another one ', () => {

        //edit the previously created Lesson
        cy.editCourse(ocDetails.courseName)

        // Clicking on the Syllabus Button 
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Syllabus")).click()

        //Clicking on Add Learning Object
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).click()

        //Selecting Leaning Object as TinCan
        ARSelectLearningObjectModal.getObjectTypeByName(ImportCourseData['SCORM_1.2'])

        //Clicking on Next Button
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        //Asserting 'Replace an existing lesson is present' for Scrom 1.2
        cy.get(ARSelectLearningObjectModal.getReplaceExistingLessonRadioBtn()).should('exist')
        cy.get(ARSelectLearningObjectModal.getReplaceExistingLessonRadioBtn()).parent().should('contain', 'Replace an existing lesson').click()

        cy.get(ARSelectLearningObjectModal.getSelectALessonBtn()).should('contain', 'Select a lesson').click()

        //Select a lesson
        cy.get(ARDashboardPage.getModalTitle()).contains('Select a lesson').should('exist')

        cy.get(ARSelectLearningObjectModal.getSelectLessonHierarchyToggleBtnByName('Chapter 1')).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        ARSelectLearningObjectModal.getSelectLessonModalLessonsByName(lessonsNameWithoutExtension.turtles_scorm12_filename).click()
        //Clicking on Choose Button
        cy.get(ARSelectLearningObjectModal.getSaveBtn()).contains('Choose').click()
        //Add learning object modal is present
        cy.get(ARDashboardPage.getModalTitle()).contains('Add Learning Object').should('exist')
        //Adding different learning object 
        cy.get(arUploadFileModal.getChooseFileBtn()).contains('Choose File').click()
        cy.get(arUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_lessons_folder + lessons.aicc_bunnies_filename)
        ARUploadFileModal.getShortWait()
        cy.contains("Continue").click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 50000 }).should('not.exist')

        //Asserting the error message
        cy.get(ARFileManagerUploadsModal.getInputErrorFiled()).should('contain', 'Sorry,')
        // uploading correct 3rd party lesson
        cy.get(arUploadFileModal.getChooseFileBtn()).contains('Choose File').click()
        cy.get(arUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_lessons_folder + lessons.scorm_12_complete_Failed_filename)
        ARUploadFileModal.getShortWait()
        cy.contains("Continue").click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 50000 }).should('not.exist')

        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

    })

    it("verify Course Lesson in the learner side", () => {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(LEResourcesPage.getCourseCardName()).should('contain', ocDetails.courseName).should('be.visible').click()
        cy.get(LECatalogPage.getCourseDetailsTabConainer()).contains('Lessons').should('exist').and('be.visible').click()
         //Verify Available lesson
         cy.get(LECourseDetailsOCModule.getChapterTitle()).should('contain', ocDetails.defaultChapterName).parents(LECourseDetailsOCModule.getChapterContainer())
         .within(() => {
             cy.get(LECourseDetailsOCModule.getNumLessons()).should('contain', '1')
             cy.get(LECourseDetailsOCModule.getLessonName()).should('contain', lessonsNameWithoutExtension.scorm_12_complete_Failed_filename )
         })

    })

    after(function () {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
    })

})
