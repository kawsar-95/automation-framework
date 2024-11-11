import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARILCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage"
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsCompletionModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import { competencyDetails } from "../../../../../../helpers/TestData/Competency/competencyDetails"
import { commonDetails, credit } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LECatalogPage from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage"
import ARQuestionBanksAddEditPage from "../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksAddEditPage"
import ARCompetencyAddEditPage from "../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyAddEditPage"
import ARQuestionBanksPage from "../../../../../../helpers/AR/pageObjects/QuestionBanks/ARQuestionBanksPage"

describe('AUT-390 - T98581 - GUIA-Story - NLE-3849 - Course Player - Overview tab Outcomes', () => {

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
        cy.viewport(window.screen.width, window.screen.height)
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i])
        }
        LECatalogPage.turnOffNextgenToggle()
        ARCompetencyAddEditPage.deleteCompetencies(competenciesArr)
    })


    it('Create course with certificate competency credit and enroll user', () => {                
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        // Create ILC course
        cy.createCourse('Online Course', ocDetails.courseName)
        
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()
        // Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()

        //Toggle Certificate to ON
        ARCourseSettingsCompletionModule.getToggleByNameThenClick('Certificate')
        //Select a Certificate File
        cy.get(ARCourseSettingsCompletionModule.getCertificateChooseFileBtn()).click()
        //Opening Media Library 
        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.mooseFileName)
        cy.get(ARUploadFileModal.getChooseFileBtn()).click
        cy.get(ARUploadFileModal.getSaveBtn()).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        cy.get(ARILCAddEditPage.getCompetencyBtn(), {timeout:10000}).should('exist').click()
        cy.get(ARILCAddEditPage.getCompetencyInputChooseBox()).eq(0).within(()=>{
            cy.get(ARILCAddEditPage.getCompetencyInput()).eq(0).click()
        })
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyChooseTypeField()).type(competenciesArr[0])
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyChooseList(), {timeout:10000}).should('be.visible')
        cy.get(ARILCAddEditPage.getCompetencyChooseList(), {timeout:10000}).contains(competenciesArr[0]).should('be.visible').click()

        cy.get(ARILCAddEditPage.getCompetencyLevelChoose()).eq(0).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyLevelList()).first().click()

        cy.get(ARILCAddEditPage.getCompetencyBtn(), {timeout:10000}).should('exist').click()

        cy.get(ARILCAddEditPage.getCompetencyInputChooseBox()).eq(1).within(()=>{
            cy.get(ARILCAddEditPage.getCompetencyInput()).eq(0).click()
        })
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyChooseTypeField()).should('exist')

        cy.get(ARILCAddEditPage.getCompetencyChooseTypeField()).eq(1).type(competenciesArr[1])
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyChooseList(), {timeout:10000}).should('be.visible')
        cy.get(ARILCAddEditPage.getCompetencyChooseList(), {timeout:10000}).contains(competenciesArr[1]).should('be.visible').click()

        cy.get(ARILCAddEditPage.getCompetencyLevelChoose()).eq(1).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARILCAddEditPage.getCompetencyLevelList()).eq(1).first().click()

        cy.get(ARCourseSettingsCompletionModule.getAddCreditBtn()).click()
        cy.get(ARCourseSettingsCompletionModule.getCreditTypeDDown()).click()
        cy.get(ARCourseSettingsCompletionModule.getAllCreditTypeOptions()).contains(credit.credits[0]).click()
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute(ARCourseSettingsCompletionModule.getVariableCreditAmountTxt())).clear().type(credit.credit1)
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')

        // Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })

        // Enroll User
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
        cy.get(ARCoursesPage.getPageHeaderTitle(), {timeout: 30000}).contains('Courses')
    })

    it('Verify uer course player outcomes', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.url().should('contain', '/#/dashboard', {timeout: 30000})
        LEDashboardPage.getTileByNameThenClick('My Courses')
        cy.get(LECatalogPage.getCatalogPageTitle(), {timeout: 30000}).contains('My Courses')
        LEDashboardPage.getCourseCardBtnThenClick(ocDetails.courseName)
        
        cy.get(LEDashboardPage.getOutcomesTitle()).should('contain','Outcomes')
        cy.get(LEDashboardPage.getOutcomesSec()).should('be.visible')
        cy.get(LEDashboardPage.getCoursePlayerCourseTitle()).should('contain', ocDetails.courseName)
        cy.get(LEDashboardPage.getOutcomesBlock()).should('contain', competenciesArr[0])
        cy.get(LEDashboardPage.getOutcomesBlock()).should('contain', competenciesArr[1])

        cy.get(LEDashboardPage.getOutcomesCreditLeaderBrd(), {timeout: 5000}).should('contain', '10 Leaderboard Points')
        cy.get(LEDashboardPage.getOutcomesCreditLeaderBrd()).should('contain', credit.credit1)

        cy.get(LEDashboardPage.getOutcomesImg()).should('exist')
    
        cy.get(LEDashboardPage.getSuccessIcon()).should('exist')
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 5000}).should('not.exist')
        cy.get(LEDashboardPage.getChevronIcon(), {timeout: 5000}).should('be.visible')
        cy.get(LEDashboardPage.getTagSec(), {timeout: 5000}).scrollIntoView()
        cy.get(LEDashboardPage.getTagSec(), {timeout: 5000}).should('be.visible')

        cy.get(LEDashboardPage.getChevronIcon(), {timeout: 5000}).should('be.visible')
        cy.get(LEDashboardPage.getChevronIcon(), {timeout: 5000}).eq(0).click()
        cy.get(LEDashboardPage.getCompetencyFlyoverDetailsMenu()).should('be.visible')
        cy.get(LEDashboardPage.getCompetencyFlyoverDetailsMenu()).within(()=>{
            cy.get(LEDashboardPage.getSuccessIcon()).should('not.exist')
        })
        
        cy.get(LEDashboardPage.getCompetencyHoverSec()).should('contain', 'Find Related Courses')
        cy.get(LEDashboardPage.getCompetencyHoverSec()).contains('Find Related Courses').click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 5000}).should('not.exist')
        cy.get(LEDashboardPage.getCatalogTitle()).contains('Catalog').should('be.visible')
    })

    it('Verify mobile view course player outcomes', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getCourseCardBtnThenClick(ocDetails.courseName)
        
        cy.viewport('iphone-xr')

        cy.get(LEDashboardPage.getCourseDetailsBtn()).should('be.visible')
        cy.get(LEDashboardPage.getCourseDetailsBtn()).click()

        cy.get(LEDashboardPage.getOutcomesTitle()).should('contain', 'Outcomes')
        cy.get(LEDashboardPage.getOutcomesSec()).should('be.visible')
        cy.get(LEDashboardPage.getCoursePlayerCourseTitle()).should('contain', ocDetails.courseName)
        cy.get(LEDashboardPage.getOutcomesBlock()).should('contain', competenciesArr[0])
        cy.get(LEDashboardPage.getOutcomesBlock()).should('contain', competenciesArr[1])

        cy.get(LEDashboardPage.getOutcomesCreditLeaderBrd(), {timeout: 5000}).should('contain', '10 Leaderboard Points')
        cy.get(LEDashboardPage.getOutcomesCreditLeaderBrd()).should('contain', credit.credit1)

        cy.get(LEDashboardPage.getOutcomesImg()).should('exist')    
        cy.get(LEDashboardPage.getSuccessIcon()).should('exist')
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout: 5000}).should('not.exist')
        cy.get(LEDashboardPage.getChevronIcon(), {timeout: 5000}).should('be.visible')

        cy.get(LEDashboardPage.getTagSec(), {timeout: 5000}).scrollIntoView()
        cy.get(LEDashboardPage.getTagSec(), {timeout: 5000}).should('be.visible')
    })
})