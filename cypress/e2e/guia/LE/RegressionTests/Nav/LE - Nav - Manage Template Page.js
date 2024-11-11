import users from '../../../../../fixtures/users.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEManageTemplatePrivateDashboardPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplatePrivateDashboardPage'
import LEManageTemplatePublicDashboardPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplatePublicDashboardPage'
import LEManageTemplateMenu from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateMenu'
import LEManageTemplateCoursesPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateCoursesPage'
import LEManageTemplateLoginPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateLoginPage'
import LEManageTemplateSettingsPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateSettingsPage'
import LEManageTemplateThemePage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateThemePage'

describe('LE - Nav - Manage Template Page', function () {

    before('Disable NextGen Learner Experience', () => {
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, '/admin')
        LEDashboardPage.turnOffNextgenToggle()
    })

    beforeEach(() => {
        //sign in and navigate to manage template before each test
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        //Need to scroll to bottom of side menu to see template button
        cy.get(LESideMenu.getSideMenu()).should('be.visible').scrollTo('bottom')
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
    })

    it('Manage Template - Private Dashboard tab - Verify URL & Contents', () => {
        cy.url().should('include', '/#/learner-mgmt/private-dashboard')
        cy.get(LEManageTemplateMenu.getDepartmentName()).should('contain', 'Top Level Dept')
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Advanced')
    })

    it('Manage Template - Public Dashboard tab - Verify URL & Contents', () => {
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Public Dashboard').should('be.visible').click()
        cy.url().should('include', '/#/learner-mgmt/public-dashboard')
        LEManageTemplatePublicDashboardPage.getManageTemplatePublicDashContainerByNameThenClick('Content').should('be.visible').click()
        LEManageTemplatePublicDashboardPage.getManageTemplatePublicDashContainerByNameThenClick('Advanced').should('be.visible').click()
        cy.get(LEManageTemplatePublicDashboardPage.getEnablePublicDashboardToggle()).should('be.visible')
    })

    it('Manage Template - Courses tab - Verify URL & Contents', () => {
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Courses').should('be.visible').click()
        cy.url().should('include', '/#/learner-mgmt/courses')
        LEManageTemplateCoursesPage.getManageTemplateCoursesContainerByNameThenClick('Course Details').should('be.visible').click()
        LEManageTemplateCoursesPage.getManageTemplateCoursesContainerByNameThenClick('Catalog').should('be.visible').click()
        LEManageTemplateCoursesPage.getManageTemplateCoursesContainerByNameThenClick('My Courses').should('be.visible').click()
        LEManageTemplateCoursesPage.getManageTemplateCoursesContainerByNameThenClick('My Courses and Catalog').should('be.visible').click()
    })

    it('Manage Template - Login tab - Verify URL & Contents', () => {
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Login').should('be.visible').click()
        cy.url().should('include', '/#/learner-mgmt/login')
        LEManageTemplateLoginPage.getManageTemplateLoginContainerByNameThenClick('Login Page').should('be.visible').click()
        LEManageTemplateLoginPage.getManageTemplateLoginContainerByNameThenClick('Advanced').should('be.visible').click()
    })

    it('Manage Template - Settings tab - Verify URL & Contents', () => {
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Settings').should('be.visible').click()
        cy.url().should('include', '/#/learner-mgmt/settings')
        LEManageTemplateSettingsPage.getManageTemplateSettingsContainerByNameThenClick('Logo').should('be.visible').click()
        LEManageTemplateSettingsPage.getManageTemplateSettingsContainerByNameThenClick('Public Menu').should('be.visible').click()
        LEManageTemplateSettingsPage.getManageTemplateSettingsContainerByNameThenClick('Private Menu').should('be.visible').click()
        LEManageTemplateSettingsPage.getManageTemplateSettingsContainerByNameThenClick('Privacy Policy').should('be.visible').click()
        LEManageTemplateSettingsPage.getManageTemplateSettingsContainerByNameThenClick('Terms & Conditions').should('be.visible').click()
        LEManageTemplateSettingsPage.getManageTemplateSettingsContainerByNameThenClick('Footer').should('be.visible').click()
        LEManageTemplateSettingsPage.getManageTemplateSettingsContainerByNameThenClick('Profile').should('be.visible').click()
    })

    it('Manage Template - Theme tab - Verify URL & Contents', () => {
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Theme').should('be.visible').click()
        cy.url().should('include', '#/learner-mgmt/theme')
        LEManageTemplateThemePage.getManageTemplateThemeContainerByNameThenClick('Colors').should('be.visible').click()
        LEManageTemplateThemePage.getManageTemplateThemeContainerByNameThenClick('Fonts').should('be.visible').click()
    })

})