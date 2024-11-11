import { users } from '../../../../../../helpers/TestData/users/users'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEManageTemplateMenu from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateMenu'
import LEManageTemplateLoginPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateLoginPage'


describe('LE - Nav - Login Template Settings', function () {

    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Login').should('be.visible').click()
        cy.url().should('include', '/#/learner-mgmt/login')
        
    })

    it('Turn ON "Hide Sign Up Button" Toggle and Verify the Sign Up button is hidden', () => {
        LEManageTemplateLoginPage.getManageTemplateLoginContainerByNameThenClick('Advanced')
        LEManageTemplateLoginPage.getHideSignupButtonToggle('true')
        cy.get(LEManageTemplateLoginPage.getContainerSaveBtn()).click()
        //Logout Learner and check that the Signout button is hidden
        cy.logoutLearner()
        cy.get(LEDashboardPage.getPublicDashboardSignupBtn()).should('not.exist')
    })

        it('Turn OFF "Hide Sign Up Button" Toggle and Verify Sign Up button is restored', () => {
        LEManageTemplateLoginPage.getManageTemplateLoginContainerByNameThenClick('Advanced')
        LEManageTemplateLoginPage.getHideSignupButtonToggle('false')
        cy.get(LEManageTemplateLoginPage.getContainerSaveBtn()).click()
        //Logout Learner and check that the Signout button is restored
        cy.logoutLearner()
        cy.get(LEDashboardPage.getPublicDashboardSignupBtn()).should('exist')

})

})