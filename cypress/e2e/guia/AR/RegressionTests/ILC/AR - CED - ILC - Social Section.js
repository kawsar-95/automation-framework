import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsSocialModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsSocial.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'


describe('AR - Regress - CED - ILC - Social Section', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Verify Social Section Toggles and Fields, Publish ILC Course', () => {
        cy.createCourse('Instructor Led')

        //Open Social Settings
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Social')).click()
        ARILCAddEditPage.getShortWait()

        //Toggle Allow Comments ON
        cy.get(ARCourseSettingsSocialModule.getAllowCommentsToggle()).click()

        //Toggle Allow Comments Per Session ON
        cy.get(ARCourseSettingsSocialModule.getAllowCommentsPerSessionToggle()).click()

        //Assert Comment Leaderboard Points Field has No Value by Default
        cy.get(ARCourseSettingsSocialModule.getCommentLeaderBoardPointsTxtF()).should('have.value', '')

        //Enter an Invalid Value in the Comment Leaderboard Points Field
        cy.get(ARCourseSettingsSocialModule.getCommentLeaderBoardPointsTxtF()).type('abc123').blur()
        cy.get(ARCourseSettingsSocialModule.getCommentLeaderBoardPointsTxtF()).should('have.value', '') //Field Value Should Reset 
        //Enter Valid Value in the Comment Leaderboard Points Field
        cy.get(ARCourseSettingsSocialModule.getCommentLeaderBoardPointsTxtF()).type('15')

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit ILC Course & Verify Social Section Toggles and Fields Have Been Persisted', () => {
        //Filter for Course & Edit it
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()
        
        //Open Social Settings
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Social')).click()
        ARILCAddEditPage.getShortWait()

        //Assert Allow Comments Toggle is ON
        cy.get(ARCourseSettingsSocialModule.getElementByDataNameAttribute(ARCourseSettingsSocialModule.getAllowCommentsToggleContainer()) + ' ' + ARCourseSettingsSocialModule.getToggleStatus()).should('have.attr', 'aria-checked', 'true')

        //Asset Allow Comments Per Session Toggle is ON
        cy.get(ARCourseSettingsSocialModule.getElementByDataNameAttribute(ARCourseSettingsSocialModule.getAllowCommentsPerSessionToggleContainer()) + ' ' + ARCourseSettingsSocialModule.getToggleStatus()).should('have.attr', 'aria-checked', 'true')
        
        //Assert Comment Leaderboard Points Field Value
        cy.get(ARCourseSettingsSocialModule.getCommentLeaderBoardPointsTxtF()).should('have.value', '15')
    })
})