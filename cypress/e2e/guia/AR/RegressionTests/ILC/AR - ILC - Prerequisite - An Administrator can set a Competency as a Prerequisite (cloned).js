import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import { ilcDetails } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARCourseSettingsCompletionModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'

describe('C819, AR - ILC - Prerequisite - An Administrator can set a Competency as a Prerequisite (cloned)', function(){
    after('Delete Created Course', function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        arDashboardPage.getMediumWait()
    })

    it('Add a Competency prerequisite', () => {
        // Create ILC course
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)
        arDashboardPage.getMediumWait()

        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        arDashboardPage.getMediumWait() //Wait for toggles to become enabled

        // Click Add Competency Button & Add Competency 
        cy.get(ARCourseSettingsCompletionModule.getAddCompetencyBtn()).click()
        cy.get(arDashboardPage.getElementByDataNameAttribute('course-competencies-content')).within(() => {
            ARCourseSettingsCompletionModule.getCompetencyDDownThenClick()
            ARCourseSettingsCompletionModule.getCompetencySearchTxtF(miscData.competency_01)
            arDashboardPage.getMediumWait()
            ARCourseSettingsCompletionModule.getCompetencyOpt(miscData.competency_01)
            //Select a Competency level
            ARCourseSettingsCompletionModule.getCompetencyLevelDDownThenClick()
            ARCourseSettingsCompletionModule.getCompetencyLevelOpt('1')
        })
        
        // add multiple competencies as a prerequisite
        cy.get(ARCourseSettingsCompletionModule.getAddCompetencyBtn()).click()
        cy.get(arDashboardPage.getElementByDataNameAttribute('course-competencies-content')).eq(1).within(() => {
            ARCourseSettingsCompletionModule.getCompetencyDDownThenClick()
            ARCourseSettingsCompletionModule.getCompetencySearchTxtF(miscData.competency_02)
            arDashboardPage.getMediumWait()
            ARCourseSettingsCompletionModule.getCompetencyOpt(miscData.competency_02)
            //Select a Competency level
            ARCourseSettingsCompletionModule.getCompetencyLevelDDownThenClick()
            ARCourseSettingsCompletionModule.getCompetencyLevelOpt('1')
        })

        cy.get(ARCourseSettingsCompletionModule.getAddCompetencyBtn()).click()
        cy.get(arDashboardPage.getElementByDataNameAttribute('course-competencies-content')).eq(2).within(() => {
            ARCourseSettingsCompletionModule.getCompetencyDDownThenClick()
            ARCourseSettingsCompletionModule.getCompetencySearchTxtF(miscData.competency_03)
            arDashboardPage.getMediumWait()
            ARCourseSettingsCompletionModule.getCompetencyOpt(miscData.competency_03)
            //Select a Competency level
            ARCourseSettingsCompletionModule.getCompetencyLevelDDownThenClick()
            ARCourseSettingsCompletionModule.getCompetencyLevelOpt('1')
        })
        
        // Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit/remove Competency prerequisite', () => {
        cy.editCourse(ilcDetails.courseName)
        arDashboardPage.getMediumWait()

        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        arDashboardPage.getMediumWait() //Wait for toggles to become enabled

        // Verify Displays all available competencies
        cy.get(arDashboardPage.getElementByDataNameAttribute('course-competencies-content')).should('have.length', 3)

        // remove Competency
        ARCourseSettingsCompletionModule.getDeleteCompetencyByName(miscData.competency_03)
        arDashboardPage.getShortWait()

        // Edit Competency
        cy.get(arDashboardPage.getElementByDataNameAttribute('course-competencies-content')).eq(1).within(() => {
            ARCourseSettingsCompletionModule.getCompetencyDDownThenClick()
            ARCourseSettingsCompletionModule.getCompetencySearchTxtF(miscData.competency_03)
            arDashboardPage.getMediumWait()
            ARCourseSettingsCompletionModule.getCompetencyOpt(miscData.competency_03)
            //Select a Competency level
            ARCourseSettingsCompletionModule.getCompetencyLevelDDownThenClick()
            ARCourseSettingsCompletionModule.getCompetencyLevelOpt('1')
        })

        // Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Verify Updates are saved', () => {
        cy.editCourse(ilcDetails.courseName)
        arDashboardPage.getMediumWait()

        //Open Completion Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        arDashboardPage.getMediumWait() //Wait for toggles to become enabled

        // Verify Displays all available competencies
        cy.get(arDashboardPage.getElementByDataNameAttribute('course-competencies-content')).should('have.length', 2)
        
        // Assert Competency Option Persisted
        cy.get(arDashboardPage.getElementByDataNameAttribute('course-competencies-content')).eq(1).within(() => {
            ARCourseSettingsCompletionModule.getCompetencyDDown().should('contain.text', miscData.competency_03)
        })

        // Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })
})
