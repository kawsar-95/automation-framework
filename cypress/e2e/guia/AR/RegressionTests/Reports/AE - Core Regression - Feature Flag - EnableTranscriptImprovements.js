import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import A5FeatureFlagsPage, { featureFlagDetails } from "../../../../../../helpers/AR/pageObjects/FeatureFlags/A5FeatureFlagsPage";
import ARDashboardAccountMenu from "../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu";
import AREditClientUserPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage";
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage";
import LESideMenu from "../../../../../../helpers/LE/pageObjects/Menu/LESideMenu";
import LEManageTemplateMenu from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateMenu";
import LEManageTemplateSettingsPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateSettingsPage'
import LETranscriptPage from "../../../../../../helpers/LE/pageObjects/User/LETranscriptPage";
import { users } from "../../../../../../helpers/TestData/users/users";




describe('AUT-793 C7517 Feature Flag - EnableTranscriptionImprovements', function () {


    before(function () {
    // Login as admin/ Blatant admin.
    cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')
    // Go to feature flags and turn off the EnableTranscriptImprovements feature flag 
    A5FeatureFlagsPage.turnOnOffFeatureFlagbyName(featureFlagDetails.EnableTranscriptImprovements, 'false')
})

it('When the feature flag is OFF,Course titles are not clickable, and no action buttons to launch the course will appear', () => {
    //login as a learner
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    LEDashboardPage.getMediumWait()
    cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn())).click()
    ARDashboardAccountMenu.getLearnerOrReviewerExperienceBtnByName('Learner Experience')
    ARDashboardPage.getMediumWait()
    cy.get(LEDashboardPage.getNavMenu()).click()
    ARDashboardPage.getMediumWait()
    LESideMenu.getLEMenuItemsByNameThenClick('Transcript') 
    ARDashboardPage.getMediumWait()
    cy.get(LETranscriptPage.getCourseTitleCol()).each(($el) => {
        ARDashboardPage.getMediumWait()
        cy.wrap($el).should('exist').should('not.be.enabled')
    })
    cy.get(LETranscriptPage.getViewBtn()).should('not.exist')

})

it('//Turn the EnableTranscriptImprovements feature flag On', () => {
    // Login as admin/ Blatant admin.
    cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')
    // Go to feature flags and turn on the EnableTranscriptImprovements feature flag 
    A5FeatureFlagsPage.turnOnOffFeatureFlagbyName(featureFlagDetails.EnableTranscriptImprovements, 'true')
})

it('When the feature flag is ON, Active courses can be launched from the Learner Transcript', () => {
    //login as a learner
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    LEDashboardPage.getMediumWait()
    cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn())).click()
    ARDashboardAccountMenu.getLearnerOrReviewerExperienceBtnByName('Learner Experience')
    ARDashboardPage.getMediumWait()
    cy.get(LEDashboardPage.getNavMenu()).click()
    ARDashboardPage.getMediumWait()
    LESideMenu.getLEMenuItemsByNameThenClick('Transcript') 
    ARDashboardPage.getMediumWait()
    cy.get(LETranscriptPage.getCourseTitleCol()).each(($el) => {
        ARDashboardPage.getMediumWait()
        cy.wrap($el).should('exist').should(($el)  => {
            expect($el).to.not.have.attr('disabled')
            expect($el).to.not.have.attr('aria-disabled', 'true')
        })
    })
    cy.get(LETranscriptPage.getViewBtn()).contains('View').should('exist')

})

it('When the feature flag is ON,  System Admin will be able to see the toggle to enable inactive courses', () => {  
//login as a learner
cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
LEDashboardPage.getMediumWait()
cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn())).click()
ARDashboardAccountMenu.getLearnerOrReviewerExperienceBtnByName('Learner Experience')
ARDashboardPage.getMediumWait()
cy.get(LEDashboardPage.getNavMenu()).click()
ARDashboardPage.getMediumWait()
LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
LEManageTemplateMenu.getManageTemplateMenuItemsByName('Settings').should('be.visible').click()
LEDashboardPage.getMediumWait()
LEManageTemplateSettingsPage.getManageTemplateSettingsContainerByNameThenClick('Profile') 
cy.get(LEManageTemplateSettingsPage.getShowInactiveCoursesBtn()).should('exist')
 })
})