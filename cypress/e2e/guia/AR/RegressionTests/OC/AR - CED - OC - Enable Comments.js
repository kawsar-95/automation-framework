import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsSocialModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsSocial.module"
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import { users } from '../../../../../../helpers/TestData/users/users'
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"


describe('C778 AR - CED - OC - Enable Comments', function () {

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        ARDashboardPage.getMediumWait()

    })

    it('Create Online Course and Enable or Disable Comments', () => {
        //Create Online Course
        cy.createCourse('Online Course')

        //Open Social Section where allow comments toggle belongs
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Social')).click()
        //Wait for toggles to become enabled
        AROCAddEditPage.getShortWait()

        //Verify toggle can be enabled and disabled
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsSocialModule.getAllowCommentsToggleContainer()) + ' ' + AROCAddEditPage.getToggleEnabled()).click().should('have.text', 'On')
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsSocialModule.getAllowCommentsToggleContainer()) + ' ' + AROCAddEditPage.getToggleDisabled()).click().should('have.text', 'Off')

        //Verify when allow comment toggle is disabled Comment on Leaderboard Points is hidden
        cy.get(ARCourseSettingsSocialModule.getCommentLeaderBoardPointsTxtF()).should('not.exist')

        //Verify when allow comment toggle is enabled Comment on Leaderboard Points is shown and point can be added
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsSocialModule.getAllowCommentsToggleContainer()) + ' ' + AROCAddEditPage.getToggleEnabled()).click()
        cy.get(ARCourseSettingsSocialModule.getCommentLeaderBoardPointsTxtF()).type('10').should('have.value', '10')

        //Publish the Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

    })

    after(function () {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
    })


})