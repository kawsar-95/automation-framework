import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LELearnerManagementPage from "../../../../../../helpers/LE/pageObjects/LearnerManagement/LELearnerManagementPage"
import LESideMenu from "../../../../../../helpers/LE/pageObjects/Menu/LESideMenu"
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage"
import LESocialProfilePage from "../../../../../../helpers/LE/pageObjects/User/LESocialProfilePage"
import { users } from "../../../../../../helpers/TestData/users/users"



describe('C1803 - AUT-426 - GUIA-Story - NLE-1877 - A learner has a social profile view - fields and total points', () => {
    it("Verifying in the admin side , competencies , certificates and badges are present in the learner management ", () => {
        // login as an admmin in the learner side 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        //Go to manage template
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        //Need to scroll to bottom of side menu to see template button
        cy.get(LESideMenu.getSideMenu()).should('be.visible').scrollTo('bottom')
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        //Go to Settings 
        LELearnerManagementPage.getNavbarMenuItemByNameAndClick("Settings")
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        //Click on profile 
        cy.get(LELearnerManagementPage.getExpandableContainer()).contains('Profile').click()
        //Assert Social Profile Learner Activity
        cy.get(LELearnerManagementPage.getSocialProfileCheckbox()).contains('Competencies and Badges').should('be.visible')
        cy.get(LELearnerManagementPage.getSocialProfileCheckbox()).contains('Competencies and Badges').find('input').should('have.attr', 'value', 'true')
        cy.get(LELearnerManagementPage.getSocialProfileCheckbox()).contains('Certificates').should('be.visible')
        cy.get(LELearnerManagementPage.getSocialProfileCheckbox()).contains('Certificates').find('input').should('have.attr', 'value', 'true')
        cy.get(LELearnerManagementPage.getSocialProfileCheckbox()).contains('Courses').should('be.visible')
        cy.get(LELearnerManagementPage.getSocialProfileCheckbox()).contains('Courses').find('input').should('have.attr', 'value', 'true')

    })

    it("Verifying in the Social Profile", () => {
        // login as an admmin in the learner side 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)

        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')

        cy.get(LEProfilePage.getProfilePageTitle()).should('contain.text', 'Overview')
        cy.get(LEProfilePage.getEditProfileBtn()).should('be.visible')
        cy.get(LEProfilePage.getChangePasswordBtn()).should('be.visible')
        cy.get(LEProfilePage.getViewSocialProfileBtn()).should('be.visible')
        cy.get(LEProfilePage.getProfileFullName()).should('contain.text', users.sysAdmin.admin_sys_01_full_name)
        //Clickin on the Info Tab
        LELearnerManagementPage.getNavbarMenuItemByNameAndClick("Info")
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(LEProfilePage.getProfilePageTitle()).should('contain.text', 'Info')
        //Asserting admin names in info
        cy.get(LEProfilePage.getLearnerFName()).should('contain.text', users.sysAdmin.admin_sys_01_fname)
        cy.get(LEProfilePage.getLearnerLName()).should('contain.text', users.sysAdmin.admin_sys_01_lname)
        cy.get(LEProfilePage.getLearnerUName()).should('contain.text', users.sysAdmin.admin_sys_01_username)


        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')

        cy.get(LESocialProfilePage.getSocialProfileModuleType()).contains('Badges').should('be.visible')
        cy.get(LESocialProfilePage.getSocialProfileModuleType()).contains('Competencies').should('be.visible')
        cy.get(LESocialProfilePage.getSocialProfileModuleType()).contains('Courses').should('be.visible')
        //Sections should be laid out
        cy.get(LESocialProfilePage.getSocialProfileBadgesModuleTitle()).should('be.visible')
        cy.get(LESocialProfilePage.getSocialProfileCompetenciesModuleTitle()).should('be.visible')
        cy.get(LESocialProfilePage.getSocialProfileCoursesModuleTitle()).should('be.visible')
    })
})