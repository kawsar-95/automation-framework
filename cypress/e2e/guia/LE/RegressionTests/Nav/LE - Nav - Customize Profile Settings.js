import { users } from '../../../../../../helpers/TestData/users/users'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEManageTemplateMenu from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateMenu'
import LEManageTemplateSettingsPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateSettingsPage'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'


describe('LE - Nav - Customize Profile settings', function () {

    it('Change Profile Permissions to not allow Password Change and Profile Edit', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Settings').should('be.visible').click()
        cy.url().should('include', '/#/learner-mgmt/settings')
        LEManageTemplateSettingsPage.getManageTemplateSettingsContainerByNameThenClick('Profile')
        cy.get(LEManageTemplateSettingsPage.getChkBox()).contains('Allow Password Change').click().find('input').should('have.attr', 'value', 'false')
        cy.get(LEManageTemplateSettingsPage.getChkBox()).contains('Allow Profile Edit').click().find('input').should('have.attr', 'value', 'false')
        cy.get(LEManageTemplateSettingsPage.getContainerSaveBtn()).click()
        cy.get(LEManageTemplateSettingsPage.getSuccessMessage()).should('have.text', 'Changes Saved.')
    })

    it('Verify Change Password and Edit Profile Buttons are hidden on the Profile Page', () => {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password, "#/login")
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(LEProfilePage.getViewSocialProfileBtn()).should('be.visible')
        cy.get(LEProfilePage.getChangePasswordBtn()).should('not.exist')
        cy.get(LEProfilePage.getEditProfileBtn()).should('not.exist')

    })

    it('Change Profile Permissions to allow Password Change and Profile Edit', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Settings').should('be.visible').click()
        cy.url().should('include', '/#/learner-mgmt/settings')
        LEManageTemplateSettingsPage.getManageTemplateSettingsContainerByNameThenClick('Profile')
        cy.get(LEManageTemplateSettingsPage.getChkBox()).contains('Allow Password Change').click().find('input').should('have.attr', 'value', 'true')
        cy.get(LEManageTemplateSettingsPage.getChkBox()).contains('Allow Profile Edit').click().find('input').should('have.attr', 'value', 'true')
        cy.get(LEManageTemplateSettingsPage.getContainerSaveBtn()).click()
        cy.get(LEManageTemplateSettingsPage.getSuccessMessage()).should('have.text', 'Changes Saved.')
    })

        it('Verify Change Password and Edit Profile Buttons are restored on the Profile Page', () => {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password, "#/login")
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(LEProfilePage.getViewSocialProfileBtn()).should('be.visible')
        cy.get(LEProfilePage.getChangePasswordBtn()).should('exist').should('be.visible')
        cy.get(LEProfilePage.getEditProfileBtn()).should('exist').should('be.visible')

    })
})