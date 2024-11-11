import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESocialProfilePage from '../../../../../../helpers/LE/pageObjects/User/LESocialProfilePage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { userProfileURLs } from '../../../../../../helpers/LE/pageObjects/User/LESocialProfilePage'

describe('C7561 - AUT777 - View Social profile using deeplink', function(){
    
    it('Verify that a learner’s social profile can be viewed by another learner using via deeplink',function () {

        cy.learnerLoginThruDashboardPageWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        LEDashboardPage.getShortWait()
        cy.get(LEDashboardPage.getNavMenu()).click()
        LEDashboardPage.getVShortWait()
        cy.visit(userProfileURLs.blatantAdminProfileURL)
        LEDashboardPage.getLongWait()
        cy.get(LESocialProfilePage.getSocialProfileHeaderName()).should('contain','GUI_Auto Blat_Admin_01')
        //Verify that the top banner section has been laid out
        cy.get(LESocialProfilePage.getSocialProfileModuleType()).contains('Badges').should('be.visible')
        cy.get(LESocialProfilePage.getSocialProfileModuleType()).contains('Competencies').should('be.visible')
        cy.get(LESocialProfilePage.getSocialProfileModuleType()).contains('Courses').should('be.visible')
        //Sections should be laid out
        cy.get(LESocialProfilePage.getSocialProfileBadgesModuleTitle()).should('be.visible')
        cy.get(LESocialProfilePage.getSocialProfileCompetenciesModuleTitle()).should('be.visible')
        cy.get(LESocialProfilePage.getSocialProfileCoursesModuleTitle()).should('be.visible')
    }) 

})
