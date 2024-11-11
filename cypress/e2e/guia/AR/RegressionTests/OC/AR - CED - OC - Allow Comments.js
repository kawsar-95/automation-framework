import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsAttributesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAttributes.module"
import ARCourseSettingsSocialModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsSocial.module"
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import { users } from '../../../../../../helpers/TestData/users/users'
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"

describe('AR - CED - OC - Allow Comments', function() {

    beforeEach(() => {
        //Sign into admin side as sys admin and navigate to online course edits
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARCoursesPage.getAddOnlineCourse()
        cy.createCourse('Online Course', ocDetails.courseName)
        //Open Social Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Social')).click()
        AROCAddEditPage.getShortWait() //Wait for toggles to become enabled
    })

    it('The Allow Comments toggle is available for an online course and can be enabled and disabled', () => {
        //Verify toggle can be enabled and disabled
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsSocialModule.getAllowCommentsToggleContainer()) + ' ' + AROCAddEditPage.getToggleEnabled()).click().should('have.text', 'On')
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsSocialModule.getAllowCommentsToggleContainer()) + ' ' + AROCAddEditPage.getToggleDisabled()).click().should('have.text', 'Off')
    })

    it('When the Allow Comments toggle is enabled, leader board points can be set to be awarded', () => {
        //Verify toggle can be enabled and disabled
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsSocialModule.getAllowCommentsToggleContainer()) + ' ' + AROCAddEditPage.getToggleEnabled()).click()
        cy.get(ARCourseSettingsSocialModule.getCommentLeaderBoardPointsTxtF()).type('10').should('have.value', '10')
        cy.get(AROCAddEditPage.getElementByDataNameAttribute(ARCourseSettingsSocialModule.getAllowCommentsToggleContainer()) + ' ' + AROCAddEditPage.getToggleDisabled()).click()
        cy.get(ARCourseSettingsSocialModule.getCommentLeaderBoardPointsTxtF()).should('not.exist')

    })
})