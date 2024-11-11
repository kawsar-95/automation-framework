import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsSocialModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsSocial.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARDepartmentsAddEditPage from '../../../../../../helpers/AR/pageObjects/Departments/ARDepartmentsAddEditPage'

describe('C818, AR - ILC - Social - An Administrator can set the Leaderboard points awarded for commenting on an ILC (cloned)', function(){
    before('Create ILC, Publish Course', () => {
        //Sign into admin side as sys admin 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        arDashboardPage.getMediumWait()

        // Create ILC course
        cy.createCourse('Instructor Led')

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    after('Delete Created Course', function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Add Leaderboard Points, Allow Comments Per Session toggle ON', () => {
        //Filter for Course & Edit it
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()
        
        //Open Social Settings
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBannerBtn('Social')).click()
        ARILCAddEditPage.getShortWait()

        //Toggle Allow Comments ON
        cy.get(ARCourseSettingsSocialModule.getElementByAriaLabelAttribute('Allow Comments')).should('have.attr', 'aria-checked', 'false')
        cy.get(ARCourseSettingsSocialModule.getAllowCommentsToggle()).click()
        cy.get(ARCourseSettingsSocialModule.getElementByAriaLabelAttribute('Allow Comments')).should('have.attr', 'aria-checked', 'true')

        //Toggle Allow Comments Per Session ON
        cy.get(ARCourseSettingsSocialModule.getElementByAriaLabelAttribute('Allow Comments Per Session')).should('have.attr', 'aria-checked', 'false')
        cy.get(ARCourseSettingsSocialModule.getAllowCommentsPerSessionToggle()).click()
        cy.get(ARCourseSettingsSocialModule.getElementByAriaLabelAttribute('Allow Comments Per Session')).should('have.attr', 'aria-checked', 'true')

        //Assert Comment Leaderboard Points Field has No Value by Default
        cy.get(ARCourseSettingsSocialModule.getCommentLeaderBoardPointsTxtF()).should('have.value', '')
        //Enter Valid Value in the Comment Leaderboard Points Field
        cy.get(ARCourseSettingsSocialModule.getCommentLeaderBoardPointsTxtF()).type('15')

         //Publish ILC
         cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })
    
    it('Add Leaderboard Points, Allow Comments Per Session toggle OFF', () => {
        //Filter for Course & Edit it
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()
        
        //Open Social Settings
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBannerBtn('Social')).click()
        ARILCAddEditPage.getShortWait()

        //Toggle Allow Comments Per Session ON
        cy.get(ARCourseSettingsSocialModule.getElementByAriaLabelAttribute('Allow Comments Per Session')).should('have.attr', 'aria-checked', 'true')
        cy.get(ARCourseSettingsSocialModule.getAllowCommentsPerSessionToggle()).click()
        cy.get(ARCourseSettingsSocialModule.getElementByAriaLabelAttribute('Allow Comments Per Session')).should('have.attr', 'aria-checked', 'false')

        //Enter Valid Value in the Comment Leaderboard Points Field
        cy.get(ARCourseSettingsSocialModule.getCommentLeaderBoardPointsTxtF()).clear().type('25')

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
        commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit Leaderboard points, and/or Allow Comments Per Session ON', () => {
        //Filter for Course & Edit it
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()
        
        //Open Social Settings
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBannerBtn('Social')).click()
        ARILCAddEditPage.getShortWait()

        //Toggle Allow Comments Per Session ON
        cy.get(ARCourseSettingsSocialModule.getElementByAriaLabelAttribute('Allow Comments Per Session')).should('have.attr', 'aria-checked', 'false')
        cy.get(ARCourseSettingsSocialModule.getAllowCommentsPerSessionToggle()).click()
        cy.get(ARCourseSettingsSocialModule.getElementByAriaLabelAttribute('Allow Comments Per Session')).should('have.attr', 'aria-checked', 'true')

        //Enter Valid Value in the Comment Leaderboard Points Field
        cy.get(ARCourseSettingsSocialModule.getCommentLeaderBoardPointsTxtF()).clear().type('12')

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
        commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Remove Leaderboard points and ILC is saved ', () => {
        //Filter for Course & Edit it
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()
        
        //Open Social Settings
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBannerBtn('Social')).click()
        ARILCAddEditPage.getShortWait()

        //Enter Valid Value in the Comment Leaderboard Points Field
        cy.get(ARCourseSettingsSocialModule.getCommentLeaderBoardPointsTxtF()).clear()
        cy.get(ARCourseSettingsSocialModule.getCommentLeaderBoardPointsTxtF()).should('have.value', '')

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
        commonDetails.courseID = id.request.url.slice(-36);
        })
    })
    
    it('Leaderboard Points field validation', () => {
        // Filter for Course & Edit it
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()
        
        //Open Social Settings
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBannerBtn('Social')).click()
        ARILCAddEditPage.getShortWait()

        //Enter an Invalid Value in the Comment Leaderboard Points Field
        cy.get(ARCourseSettingsSocialModule.getCommentLeaderBoardPointsTxtF()).clear().type('abc123').blur()
        cy.get(ARCourseSettingsSocialModule.getCommentLeaderBoardPointsTxtF()).should('have.value', '') //Field Value Should Reset 

        // Verify numbers > 100 in the Leaderboard field show error
        cy.get(ARCourseSettingsSocialModule.getCommentLeaderBoardPointsTxtF()).clear().type('945618').blur()
        cy.get(ARDepartmentsAddEditPage.getTxtFErrorMsgBySectionDataName('awardPoints'))
            .should('have.text', 'Field must be less than or equal to 100.')

        // Verify negetive numbers in the Leaderboard field show error
        cy.get(ARCourseSettingsSocialModule.getCommentLeaderBoardPointsTxtF()).clear().type('-1623').blur()
        cy.get(ARDepartmentsAddEditPage.getTxtFErrorMsgBySectionDataName('awardPoints'))
            .should('have.text', 'Field must be greater than or equal to 0.')

        //Enter Valid Value in the Comment Leaderboard Points Field
        cy.get(ARCourseSettingsSocialModule.getCommentLeaderBoardPointsTxtF()).clear().type('15')

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
        commonDetails.courseID = id.request.url.slice(-36);
        })
    })
})

