import ARILCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage"
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import { competencyDetails } from "../../../../../../helpers/TestData/Competency/competencyDetails"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import {lessonAssessment, lessonVideo, ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import ARSelectLearningObjectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal"
import ARAddObjectLessonModal from "../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal"
import ARQuestionBanksAddEditPage from "../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksAddEditPage"
import { qbDetails } from "../../../../../../helpers/TestData/QuestionBank/questionBanksDetails"
import ARAddVideoLessonModal from "../../../../../../helpers/AR/pageObjects/Modals/ARAddVideoLessonModal"
import {resourcePaths, videos } from "../../../../../../helpers/TestData/resources/resources"
import LECourseLessonPlayerPage from "../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage"
import LECatalogPage from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage"
import ARCompetencyAddEditPage from "../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyAddEditPage"
import ARQuestionBanksPage from "../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksPage"

describe('AUT-390 - T98581 - GUIA-Story - NLE-3849 - Course Player - Overview tab Outcomes - Verify Confirming to Leave Lesson)', () => {

    let competenciesArr = [competencyDetails.competencyName, competencyDetails.competencyName2]

    before('Create competencies, Question Bank and Enable NextGen LE', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin/dashboard')
        ARQuestionBanksAddEditPage.addSampleQuestBank()
        cy.get(ARQuestionBanksPage.getA5PageHeaderTitle(), {timeout: 15000}).contains('Question Banks')
        competenciesArr = ARCompetencyAddEditPage.createSampleCompetencies(competenciesArr)
        ARDashboardPage.getMediumWait()
        cy.visit('/admin', {timeout: 15000})
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 15000}).should('not.exist')
        LECatalogPage.turnOnNextgenToggle()
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    after('Clean up', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i])
        }
        LECatalogPage.turnOffNextgenToggle()
        ARCompetencyAddEditPage.deleteCompetencies(competenciesArr)
    })

    it('Confirming to Leave Lesson while proctored assesment', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.createUser(void 0, userDetails.username2, ["Learner"], void 0)
        ARDashboardPage.getCoursesReport()
        // Create Online course
        cy.createCourse('Online Course', ocDetails.courseName2)

        cy.get(AROCAddEditPage.getSyllabusProctorToggle()).click()
        // Add Video File Object Lesson Desktop Iframe
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        // Add learning object Assessment        
        ARSelectLearningObjectModal.getObjectTypeByName('Assessment')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        cy.get(ARAddObjectLessonModal.getAssesmentName()).should('have.value','Assessment Name')
        ARAddObjectLessonModal.getTxtFByName('Assessment Name', lessonAssessment.ocAssessmentName)
        // Add Assesment Weight
        cy.get(ARAddObjectLessonModal.getAddassessmentweight()).clear().type(10)
        // Add Grade to Pass
        cy.get(ARAddObjectLessonModal.getAddGradetoPass()).clear().type(75)
        // Expand options dropdown under Assessment  
        cy.get(ARAddObjectLessonModal.getAddexpandoptions()).click()
        // Enable Max attempts and set to 3  
        cy.get(ARAddObjectLessonModal.getEnablemaxattempts()).click({force: true})
        cy.get(ARAddObjectLessonModal.getInputmaxattempts()).clear().type(3)
        // Add Question for assessment
        cy.get(ARAddObjectLessonModal.getExpandQuestionsbutton()).click()
        cy.get(ARAddObjectLessonModal.getManageQuestions()).click()
        cy.get(ARQuestionBanksAddEditPage.getUseQuestionBankButton()).click()
        cy.get(ARQuestionBanksAddEditPage.getSelectQuestionBankDropdown()).should('be.visible')
        cy.get(ARQuestionBanksAddEditPage.getSelectQuestionBankDropdown()).click()
        cy.get(ARQuestionBanksAddEditPage.getEnterQuestionBankName()).should('be.visible')
        cy.get(ARQuestionBanksAddEditPage.getEnterQuestionBankName()).type(qbDetails.questionBanksName)
        cy.get(ARQuestionBanksAddEditPage.getSelectQuestionBank(), {timeout: 10000}).should('be.visible')
        cy.get(ARQuestionBanksAddEditPage.getSelectQuestionBank()).click()
        cy.get(ARAddObjectLessonModal.getQuestionSavebutton(), {timeout:10000}).should('be.visible')
        cy.get(ARAddObjectLessonModal.getQuestionSavebutton()).contains("Save").click({ multiple: true })

        cy.get(ARAddObjectLessonModal.getQuestionBankSec(), {timeout:10000}).should('be.visible')
        cy.get(ARAddObjectLessonModal.getandClickApplybutton(), {timeout:10000}).should('be.visible')

        cy.get(ARAddObjectLessonModal.getandClickApplybutton(), {timeout:10000}).should('have.attr','aria-disabled','false')
       
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).eq(1).click({ force: true })        
        cy.get(ARAddObjectLessonModal.getandClickApplybutton(), {timeout:10000}).should('be.visible')
        cy.get(ARAddObjectLessonModal.getandClickApplybutton()).eq(0).click({ force: true })        
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 60000}).should('not.exist')

        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).scrollIntoView()
        // Add Video Lesson Object to the course
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false')
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).click()
        ARSelectLearningObjectModal.getObjectTypeByName('Video')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        // Add Valid Name to Video Lesson
        ARAddVideoLessonModal.getAddCustomVideoLesson(lessonVideo.ocVideoName + '2', 'true', '640', '480', 'URL', null, null, 'File', resourcePaths.resource_video_folder_selectFile, videos.video_small, 'false', 'true')

        // Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()

        cy.get(ARILCAddEditPage.getCompetencyBtn(), {timeout:10000}).should('exist').click()

        cy.get(ARILCAddEditPage.getCompetencyInputChooseBox()).eq(0).within(()=>{
            cy.get(ARILCAddEditPage.getCompetencyInput()).eq(0).click()
        })

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:60000}).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyChooseTypeField()).type(competenciesArr[0])
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:60000}).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyChooseList(), {timeout:15000}).contains(competenciesArr[0]).should('be.visible').click()

        cy.get(ARILCAddEditPage.getCompetencyLevelChoose()).eq(0).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:60000}).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyLevelList()).first().click()

        // Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        // Enroll User
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName2], [userDetails.username2])

        // Vist to the usres report page
        ARDashboardPage.getUsersReport()
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username2)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 60000 }).should('not.exist')

        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        // Impersonate as Learner
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Impersonate'), { timeout: 10000 }).should('have.attr', 'aria-disabled', 'false').click()
        LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getCourseCardBtnThenClick(ocDetails.courseName2)

        // Start the oc
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), {timeout: 10000}).should('not.exist', {timeout: 10000})
        cy.get(LEDashboardPage.getCollapseIcon()).click()
        cy.get(LECourseLessonPlayerPage.getCoursePlayerCard()).should('be.visible')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        cy.get(LEDashboardPage.getStartquizbutton(), {timeout: 15000}).contains("Start Quiz").should('be.visible').click({force: true})
        cy.get(LEDashboardPage.getProctorUsername()).type(users.sysAdmin.admin_sys_01_username)
        cy.get(LEDashboardPage.getProctorPassword()).type(users.sysAdmin.admin_sys_01_password)
        cy.get(LEDashboardPage.getProctorLogingButton()).click()

        cy.get(LEDashboardPage.getChevronIcon(), {timeout: 10000}).should('be.visible').click()

        cy.get(LEDashboardPage.getCompetencyHoverSec()).should('contain','Find Related Courses').click()
    
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 60000}).should('not.exist')
        cy.get(LEDashboardPage.getCatalogTitle()).contains('Catalog').should('be.visible')
    })
})