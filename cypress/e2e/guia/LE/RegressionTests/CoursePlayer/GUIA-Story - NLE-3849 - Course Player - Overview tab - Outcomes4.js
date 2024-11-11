import ARILCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage"
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import { competencyDetails } from "../../../../../../helpers/TestData/Competency/competencyDetails"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import ARSelectLearningObjectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal"
import ARAddObjectLessonModal from "../../../../../../helpers/AR/pageObjects/Modals/ARAddObjectLessonModal"
import {images, pdfs, resourcePaths, videos } from "../../../../../../helpers/TestData/resources/resources"
import { lessonObjects, ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import ARQuestionBanksAddEditPage from "../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksAddEditPage"
import ARQuestionBanksPage from "../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksPage"
import ARCompetencyAddEditPage from "../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyAddEditPage"
import LECatalogPage from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage"

describe('AUT-390 - T98581 - GUIA-Story - NLE-3849 - Course Player - Overview tab Outcomes - Verify Confirming to Leave Lesson while course upload', () => {

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

    it('Confirming to Leave Lesson while Loading the object lesson', () => {
        cy.createUser(void 0, userDetails.username5, ["Learner"], void 0)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        // Create OC course
        cy.createCourse('Online Course', ocDetails.courseName5)
        
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()

        // Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        cy.get(ARILCAddEditPage.getCompetencyBtn(), {timeout:10000}).should('exist').click()
        cy.get(ARILCAddEditPage.getCompetencyInputChooseBox()).eq(0).within(()=>{
            cy.get(ARILCAddEditPage.getCompetencyInput()).eq(0).click()
        })
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:60000}).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyChooseTypeField()).type(competenciesArr[0])
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:60000}).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyChooseList(), {timeout:30000}).contains(competenciesArr[0]).should('be.visible').click()

        cy.get(ARILCAddEditPage.getCompetencyLevelChoose()).eq(0).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:60000}).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyLevelList()).first().click()

        // Add Video File Object Lesson Desktop Iframe
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddCustomObjectLesson(lessonObjects.objectName, 'File', resourcePaths.resource_video_folder_selectFile, videos.video_small)
        // Add Image File Object Lesson Desktop Iframe
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddCustomObjectLesson(lessonObjects.objectName + '2', 'File', resourcePaths.resource_image_folder_selectFile, images.moose_filename)
        // Add PDF Object Lesson Desktop Iframe
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Object')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        ARAddObjectLessonModal.getAddCustomObjectLesson(lessonObjects.objectName + '3', 'File', resourcePaths.resource_pdf_folder_selectFile, pdfs.sample_filename)

        // Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        // Enroll User
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName5], [userDetails.username5])
        // Vist to the usres report page
        ARDashboardPage.getUsersReport()
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username5)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 60000 }).should('not.exist')

        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        // Impersonate as Learner
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Impersonate'), { timeout: 10000 }).should('have.attr', 'aria-disabled', 'false').click()
        LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getCourseCardBtnThenClick(ocDetails.courseName5)
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 60000}).should('not.exist')
        cy.get(LEDashboardPage.getCollapseIcon(), {timeout: 50000}).should('be.visible')
        cy.get(LEDashboardPage.getCollapseIcon(), {timeout: 50000}).click()

        cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 60000}).should('not.exist')

        cy.get(LEDashboardPage.getChevronIcon(), {timeout: 5000}).should('be.visible')
        cy.get(LEDashboardPage.getChevronIcon(), {timeout: 5000}).click()

        cy.get(LEDashboardPage.getCompetencyHoverSec()).should('contain','Find Related Courses').click()
       
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 60000}).should('not.exist')
        cy.get(LEDashboardPage.getCatalogTitle()).contains('Catalog').should('be.visible')
    })

    it('Course Player from the Infuse endpoint', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Click on users
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Users'), { timeout: 10000 }).should('be.visible').click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 60000 }).should('not.exist')
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 60000 }).should('not.exist')
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()

        // Impersonate as Learner
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Impersonate'), { timeout: 10000 }).should('have.attr', 'aria-disabled', 'false').click()
        LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())

        cy.visit(`#/online-course-player/${commonDetails.courseIDs[0]}`)
        LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
        cy.get(LEDashboardPage.getOutcomeComp()).should('not.exist')
    })
})