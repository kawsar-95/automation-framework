import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsCompletionModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { miscData } from "../../../../../../helpers/TestData/Misc/misc"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C911 - Option to select competency', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })
    after(function () {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
    })
    it('Add competency', () => {
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Online Course')

        //Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARDashboardPage.getShortWait()

        cy.get(ARCourseSettingsCompletionModule.getAddCompetencyBtn()).click()
        // Competency is a required field - Publish button is disabled if none selected
        cy.get(ARDashboardPage.getElementByDataNameAttribute('submit')).should('have.attr', 'aria-disabled', 'true')

        ARCourseSettingsCompletionModule.getCompetencyDDownThenClick()
        ARCourseSettingsCompletionModule.getCompetencySearchTxtF(miscData.competency_01)
        ARDashboardPage.getMediumWait()
        ARCourseSettingsCompletionModule.getCompetencyOpt(miscData.competency_01)

        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

    })
    it('Edit Competency', () => {
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.editCourse(ocDetails.courseName)

        //Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARDashboardPage.getShortWait()

        ARCourseSettingsCompletionModule.getCompetencyDDownThenClick()
        ARCourseSettingsCompletionModule.getCompetencySearchTxtF(miscData.competency_02)
        ARDashboardPage.getMediumWait()
        ARCourseSettingsCompletionModule.getCompetencyOpt(miscData.competency_02)

        cy.publishCourse()

    })
    it('Delete Competency', () => {
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.editCourse(ocDetails.courseName)

        //Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARDashboardPage.getShortWait()

        //Delete Competency
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Delete Competency')).click({ force: true })
        cy.publishCourse()

    })
})