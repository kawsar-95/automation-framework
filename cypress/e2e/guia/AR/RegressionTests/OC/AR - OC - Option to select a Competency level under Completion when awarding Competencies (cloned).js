import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'

describe('C799 AUT-231, AR - OC - Option to select a Competency level under Completion when awarding Competencies (cloned)', function(){
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
    })

    after(function() {        
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Create OC Course & add multiple Competency', () => {
        cy.createCourse('Online Course')
        
        // Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()

        // Choose Competency For Completion
        cy.get(ARCourseSettingsCompletionModule.getAddCompetencyBtn()).click()

        // Verify Save button is disabled
        cy.get(arDashboardPage.getPublishBtn()).should('have.attr', 'aria-disabled', 'true')

        // Add Competency
        ARCourseSettingsCompletionModule.addCompetencyByIndex(1, miscData.competency_01, miscData.competency_level)

        // Add another Competency
        cy.get(ARCourseSettingsCompletionModule.getAddCompetencyBtn()).click()
        ARCourseSettingsCompletionModule.addCompetencyByIndex(2, miscData.competency_02, miscData.competency_level)

        // Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
    })

    it('Edit OC Course and Competency', () => {
        cy.editCourse(ocDetails.courseName)

        // Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()

        // Assert Competency Option Persisted
        ARCourseSettingsCompletionModule.VerifyCompetencyOptionPersisted(miscData.competency_01)
        ARCourseSettingsCompletionModule.VerifyCompetencyOptionPersisted(miscData.competency_02)

        // edit competency By serial number
        ARCourseSettingsCompletionModule.editCompetencyByName(miscData.competency_02, miscData.competency_03)

        // Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit OC Course and Delete Competency', () => {
        cy.editCourse(ocDetails.courseName)
        
        // Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()

        // Assert Competency Option Persisted
        ARCourseSettingsCompletionModule.VerifyCompetencyOptionPersisted(miscData.competency_01)
        ARCourseSettingsCompletionModule.VerifyCompetencyOptionPersisted(miscData.competency_03)

        // remove Competency
        ARCourseSettingsCompletionModule.getDeleteCompetencyByName(miscData.competency_01)
        ARCourseSettingsCompletionModule.getDeleteCompetencyByName(miscData.competency_03)

        // Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })
})

