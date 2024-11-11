import ARCollaborationAddEditPage from '../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARAddObjectLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import ARUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import arUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { lessons, resourcePaths } from '../../../../../../helpers/TestData/resources/resources'
import { users } from '../../../../../../helpers/TestData/users/users'




describe("C762, C874 AR - OC -  With Lessons - Scorm1.2 - Scorm2004 - Tin Can - AICC T832321", function () {

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        ARDashboardPage.getMediumWait()
    })


    //Create an online course with SCORM1.2 Lesson
    it("Create Online Course with SCORM1.2 Lesson", () => {
        //Create Course
        cy.createCourse('Online Course')

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
        cy.get(arUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_lessons_folder + lessons.turtles_scorm12_filename)
        ARUploadFileModal.getLongWait()
        cy.contains("Continue").click()
        cy.intercept('/api/rest/v2/admin-uploads').as('getUploadFiles').wait('@getUploadFiles')

        //type something in the title and description of the page
        cy.get("#modal-content-2").find(ARCollaborationAddEditPage.getResourceNameTxtF()).type(lessons.turtles_scorm12_filename, { delay: 50 })
        cy.get("#modal-content-2").find(ARCollaborationAddEditPage.getResourceDescriptionTxtF()).type("We are adding SCORM 1.2 type learning object ", { delay: 50 })
        cy.get(ARAddObjectLessonModal.getApplyBtn()).click()

        ARDashboardPage.getMediumWait()


        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

    })

    //Edit and Create an online course with SCORM2004 Lesson
    it("Edit Online Course and Add SCORM 2004 Lesson", () => {
        //Edit Course
        cy.editCourse(ocDetails.courseName)

        // Clicking on the Syllabus Button 
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Syllabus")).click()

        //Clicking on Add Learning Object
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).click()

        //Selecting Leaning Object as SCORM 2004
        ARSelectLearningObjectModal.getObjectTypeByName('SCORM 2004')

        //Clicking on Next Button
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARDashboardPage.getMediumWait()

        //Uploading Zip the file in the Upload modal
        cy.get(arUploadFileModal.getChooseFileBtn()).contains('Choose File').click()
        cy.get(arUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_lessons_folder + lessons.sample_mc_scorm2004_filename)
        ARUploadFileModal.getLongWait()
        cy.contains("Continue").click()
        cy.intercept('/api/rest/v2/admin-uploads').as('getUploadFiles').wait('@getUploadFiles')

        //type something in the title and description of the page
        cy.get("#modal-content-2").find(ARCollaborationAddEditPage.getResourceNameTxtF()).type(lessons.sample_mc_scorm2004_filename, { delay: 50 })
        cy.get("#modal-content-2").find(ARCollaborationAddEditPage.getResourceDescriptionTxtF()).type("We are adding SCORM 2004 type learning object ", { delay: 50 })
        cy.get(ARAddObjectLessonModal.getApplyBtn()).click()

        ARDashboardPage.getMediumWait()


        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

    })

    //Edit and Create an online course with TIN CAN, Lesson
    it("Edit Online Course and Add TIN CAN Lesson", () => {
        //Edit Course
        cy.editCourse(ocDetails.courseName)

        // Clicking on the Syllabus Button 
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Syllabus")).click()

        //Clicking on Add Learning Object
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).click()

        //Selecting Leaning Object as Tin Can
        ARSelectLearningObjectModal.getObjectTypeByName('Tin Can')

        //Clicking on Next Button
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARDashboardPage.getMediumWait()

        //Uploading Zip the file in the Upload modal
        cy.get(arUploadFileModal.getChooseFileBtn()).contains('Choose File').click()
        cy.get(arUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_lessons_folder + lessons.tincan_quiz_filename)
        ARUploadFileModal.getLongWait()
        cy.contains("Continue").click()
        cy.intercept('/api/rest/v2/admin-uploads').as('getUploadFiles').wait('@getUploadFiles')

        //type something in the title and description of the page
        cy.get("#modal-content-2").find(ARCollaborationAddEditPage.getResourceNameTxtF()).type(lessons.tincan_quiz_filename, { delay: 50 })
        cy.get("#modal-content-2").find(ARCollaborationAddEditPage.getResourceDescriptionTxtF()).type("We are adding TIN CAN type learning object ", { delay: 50 })
        cy.get(ARAddObjectLessonModal.getApplyBtn()).click()

        ARDashboardPage.getMediumWait()


        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

    })

    //Edit and Create an online course with AICC Lesson
    it("Edit Online Course and Add AICC Lesson", () => {
        //Edit Course
        cy.editCourse(ocDetails.courseName)

        // Clicking on the Syllabus Button 
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Syllabus")).click()

        //Clicking on Add Learning Object
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).click()

        //Selecting Leaning Object as AICC
        ARSelectLearningObjectModal.getObjectTypeByName('AICC')

        //Clicking on Next Button
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARDashboardPage.getMediumWait()

        //Uploading Zip the file in the Upload modal
        cy.get(arUploadFileModal.getChooseFileBtn()).contains('Choose File').click()
        cy.get(arUploadFileModal.getFilePathTxt()).attachFile(resourcePaths.resource_lessons_folder + lessons.aicc_bunnies_filename)
        ARUploadFileModal.getLongWait()
        cy.contains("Continue").click()
        cy.intercept('/api/rest/v2/admin-uploads').as('getUploadFiles').wait('@getUploadFiles')

        //type something in the title and description of the page
        cy.get("#modal-content-2").find(ARCollaborationAddEditPage.getResourceNameTxtF()).type(lessons.aicc_bunnies_filename, { delay: 50 })
        cy.get("#modal-content-2").find(ARCollaborationAddEditPage.getResourceDescriptionTxtF()).type("We are adding AICC type learning object ", { delay: 50 })
        cy.get(ARAddObjectLessonModal.getApplyBtn()).click()

        ARDashboardPage.getMediumWait()


        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

    })


    after(function () {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
    })

})