import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage"
import LESocialProfilePage from "../../../../../../helpers/LE/pageObjects/User/LESocialProfilePage"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"



describe('C1808 - AUT-403 - GUAI-Story - NLE-1868 - A learner has a social profile view - badges and total', () => {
    it("Verify that the badges section is displayed in a learner's social profile", () => {
        //Admin login in the learner side 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        //Click on nav profile button
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        //Clicking on the Social Profile button
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(LESocialProfilePage.getSocialProfileHeaderName()).should('contain', 'GUI_Auto Sys_Admin_01')


        //Verify that the top banner section has been laid out
        cy.get(LESocialProfilePage.getSocialProfileModuleType()).contains('Badges').should('be.visible')

        cy.get(LESocialProfilePage.getSocialProfileModuleType()).contains('Competencies').should('be.visible')
        cy.get(LESocialProfilePage.getSocialProfileModuleType()).contains('Courses').should('be.visible')
        //Sections should be laid out
        cy.get(LESocialProfilePage.getSocialProfileBadgesModuleTitle()).should('be.visible')
        cy.get(LESocialProfilePage.getSocialProfileCompetenciesModuleTitle()).should('be.visible')
        cy.get(LESocialProfilePage.getSocialProfileCoursesModuleTitle()).should('be.visible')

        //get first badge and assert its image and title
        cy.get(LESocialProfilePage.getBadgeBtn()).first().find('img').should('be.visible')
        cy.get(LESocialProfilePage.getBadgeBtn()).first().find('span').should('be.visible')

        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 60000 }).should('not.exist')
        //Asserting Courses Count 

        //Clicking on the first badge
        cy.get(LESocialProfilePage.getBadgeBtn()).first().click()

        cy.get(LESocialProfilePage.getCompetencyDialogueModal()).should('have.attr', 'aria-modal', 'true')
        cy.get(LESocialProfilePage.getCompetencyModalDate()).should('exist')

    })

   


})





