
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LELearnerManagementPage, { SocialProfileOptions } from "../../../../../../helpers/LE/pageObjects/LearnerManagement/LELearnerManagementPage"
import LESideMenu from "../../../../../../helpers/LE/pageObjects/Menu/LESideMenu"
import LEManageTemplateCoursesPage from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateCoursesPage"
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage"
import LESocialProfilePage from "../../../../../../helpers/LE/pageObjects/User/LESocialProfilePage"
import { users } from "../../../../../../helpers/TestData/users/users"



describe('C1812 - AUT-434 -NLE-1891 - A learner can choose which content appears on their social profile', () => {

    it("Setting up All the Checkbox to true", () => {

        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)

        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        //Clickin on the Settings Tab
        LELearnerManagementPage.getNavbarMenuItemByNameAndClick("Settings")
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(LEProfilePage.getProfilePageTitle()).should('contain.text', 'Settings')

        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.Certificates).should('have.text', SocialProfileOptions.Certificates)
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.CompetenciesAndBadges).should('have.text', SocialProfileOptions.CompetenciesAndBadges)
        LELearnerManagementPage.getCoursesCheckboxByName(SocialProfileOptions.Courses).should('have.text', SocialProfileOptions.Courses)

        LELearnerManagementPage.getSettingsToggleByName(SocialProfileOptions.Certificates , 'true')
        LELearnerManagementPage.getSettingsToggleByName(SocialProfileOptions.CompetenciesAndBadges , 'true')
        LELearnerManagementPage.getSettingsToggleByName(SocialProfileOptions.Courses , 'true')

        LELearnerManagementPage.saveIfSettingsChanged()

    })
    it("Verifying in the Social Profile", () => {

        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)

        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')

        cy.get(LEProfilePage.getProfilePageTitle()).should('contain.text', 'Overview')
        cy.get(LEProfilePage.getEditProfileBtn()).should('be.visible')
        cy.get(LEProfilePage.getChangePasswordBtn()).should('be.visible')
        cy.get(LEProfilePage.getViewSocialProfileBtn()).should('be.visible')

        //Clickin on the Settings Tab
        LELearnerManagementPage.getNavbarMenuItemByNameAndClick("Settings")
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(LEProfilePage.getProfilePageTitle()).should('contain.text', 'Settings')
        //Asserting Social Profile
        //Here first has been used to select the first header
        cy.get(LELearnerManagementPage.getSocialProfileHeader()).first().should('have.text', 'Social Profile')
        //Asserting Options 
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.Certificates).should('have.text', SocialProfileOptions.Certificates)
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.CompetenciesAndBadges).should('have.text', SocialProfileOptions.CompetenciesAndBadges)
        LELearnerManagementPage.getCoursesCheckboxByName(SocialProfileOptions.Courses).should('have.text', SocialProfileOptions.Courses)

        //Asserting that checkboxes are checked
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.Certificates).find('input').should('have.attr', 'value', 'true')
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.CompetenciesAndBadges).find('input').should('have.attr', 'value', 'true')
        LELearnerManagementPage.getCoursesCheckboxByName(SocialProfileOptions.Courses).find('input').should('have.attr', 'value', 'true')

        //Going back to Social Profile and assert that all these shows 
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


    it('Changing the Settings and Asserting in Social Profile That Certificates dont show', () => {

        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)

        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')

        cy.get(LEProfilePage.getProfilePageTitle()).should('contain.text', 'Overview')
        cy.get(LEProfilePage.getEditProfileBtn()).should('be.visible')
        cy.get(LEProfilePage.getChangePasswordBtn()).should('be.visible')
        cy.get(LEProfilePage.getViewSocialProfileBtn()).should('be.visible')

        //Clickin on the Settings Tab
        LELearnerManagementPage.getNavbarMenuItemByNameAndClick("Settings")
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(LEProfilePage.getProfilePageTitle()).should('contain.text', 'Settings')
        //Asserting Social Profile
        //Here first has been used to select the first header
        cy.get(LELearnerManagementPage.getSocialProfileHeader()).first().should('have.text', 'Social Profile')
        //Asserting Options 
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.Certificates).should('have.text', SocialProfileOptions.Certificates)
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.CompetenciesAndBadges).should('have.text', SocialProfileOptions.CompetenciesAndBadges)
        LELearnerManagementPage.getCoursesCheckboxByName(SocialProfileOptions.Courses).should('have.text', SocialProfileOptions.Courses)

        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.Certificates).find('input').should('have.attr', 'value', 'true')
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.Certificates).find('input').click({ force: true })
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.Certificates).find('input').should('have.attr', 'value', 'false')

        cy.get(LELearnerManagementPage.getSaveBtn()).should('have.attr', 'aria-disabled', 'false').click()

        cy.get(LEManageTemplateCoursesPage.getManageTemplateSuccessMessage(), { timeout: 1500000 }).should('be.visible').and('contain', 'Changes Saved.')

        //Going back to Social Profile and assert that Courses dont show 
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')

        cy.get(LESocialProfilePage.getSocialProfileModuleType()).contains('Certificates').should('not.exist')
        cy.get(LESocialProfilePage.getSocialProfileCertificcatesModuleTitle()).should('not.exist')

    })


    it('Changing the Settings and Asserting in Social Profile That Courses dont show', () => {

        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)

        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')

        cy.get(LEProfilePage.getProfilePageTitle()).should('contain.text', 'Overview')
        cy.get(LEProfilePage.getEditProfileBtn()).should('be.visible')
        cy.get(LEProfilePage.getChangePasswordBtn()).should('be.visible')
        cy.get(LEProfilePage.getViewSocialProfileBtn()).should('be.visible')

        //Clickin on the Settings Tab
        LELearnerManagementPage.getNavbarMenuItemByNameAndClick("Settings")
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(LEProfilePage.getProfilePageTitle()).should('contain.text', 'Settings')
        //Asserting Social Profile
        //Here first has been used to select the first header
        cy.get(LELearnerManagementPage.getSocialProfileHeader()).first().should('have.text', 'Social Profile')
        //Asserting Options 
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.Certificates).should('have.text', SocialProfileOptions.Certificates)
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.CompetenciesAndBadges).should('have.text', SocialProfileOptions.CompetenciesAndBadges)
        LELearnerManagementPage.getCoursesCheckboxByName(SocialProfileOptions.Courses).should('have.text', SocialProfileOptions.Courses)

        LELearnerManagementPage.getCoursesCheckboxByName(SocialProfileOptions.Courses).find('input').should('have.attr', 'value', 'true')
        LELearnerManagementPage.getCoursesCheckboxByName(SocialProfileOptions.Courses).find('input').click({ force: true })
        LELearnerManagementPage.getCoursesCheckboxByName(SocialProfileOptions.Courses).find('input').should('have.attr', 'value', 'false')

        cy.get(LELearnerManagementPage.getSaveBtn()).should('have.attr', 'aria-disabled', 'false').click()

        cy.get(LEManageTemplateCoursesPage.getManageTemplateSuccessMessage(), { timeout: 1500000 }).should('be.visible').and('contain', 'Changes Saved.')

        //Going back to Social Profile and assert that Courses dont show 
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')

        cy.get(LESocialProfilePage.getSocialProfileModuleType()).contains('Courses').should('not.exist')
        cy.get(LESocialProfilePage.getSocialProfileCoursesModuleTitle()).should('not.exist')

    })

    it('Changing the Settings and Asserting in Social Profile That Competencies and Badges dont show', () => {

        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)

        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')

        cy.get(LEProfilePage.getProfilePageTitle()).should('contain.text', 'Overview')
        cy.get(LEProfilePage.getEditProfileBtn()).should('be.visible')
        cy.get(LEProfilePage.getChangePasswordBtn()).should('be.visible')
        cy.get(LEProfilePage.getViewSocialProfileBtn()).should('be.visible')

        //Clickin on the Settings Tab
        LELearnerManagementPage.getNavbarMenuItemByNameAndClick("Settings")
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(LEProfilePage.getProfilePageTitle()).should('contain.text', 'Settings')
        //Asserting Social Profile
        //Here first has been used to select the first header
        cy.get(LELearnerManagementPage.getSocialProfileHeader()).first().should('have.text', 'Social Profile')
        //Asserting Options 
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.Certificates).should('have.text', SocialProfileOptions.Certificates)
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.CompetenciesAndBadges).should('have.text', SocialProfileOptions.CompetenciesAndBadges)
        LELearnerManagementPage.getCoursesCheckboxByName(SocialProfileOptions.Courses).should('have.text', SocialProfileOptions.Courses)

        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.CompetenciesAndBadges).find('input').should('have.attr', 'value', 'true')
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.CompetenciesAndBadges).find('input').click({ force: true })
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.CompetenciesAndBadges).find('input').should('have.attr', 'value', 'false')
        //Turning on certificate so that something exists to assert
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.Certificates).find('input').should('have.attr', 'value', 'false')
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.Certificates).find('input').click({ force: true })
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.Certificates).find('input').should('have.attr', 'value', 'true')

        cy.get(LELearnerManagementPage.getSaveBtn()).should('have.attr', 'aria-disabled', 'false').click()

        cy.get(LEManageTemplateCoursesPage.getManageTemplateSuccessMessage(), { timeout: 1500000 }).should('be.visible').and('contain', 'Changes Saved.')

        //Going back to Social Profile and assert that Competencies and Badges dont show 
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')

        cy.get(LESocialProfilePage.getSocialProfileModuleType()).contains('Competencies').should('not.exist')
        cy.get(LESocialProfilePage.getSocialProfileModuleType()).contains('Badges').should('not.exist')
        cy.get(LESocialProfilePage.getSocialProfileBadgesModuleTitle()).should('not.exist')
        cy.get(LESocialProfilePage.getSocialProfileCompetenciesModuleTitle()).should('not.exist')

    })

    it("Allowing all the Settings to Checked State", () => {

        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)

        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')

        cy.get(LEProfilePage.getProfilePageTitle()).should('contain.text', 'Overview')
        cy.get(LEProfilePage.getEditProfileBtn()).should('be.visible')
        cy.get(LEProfilePage.getChangePasswordBtn()).should('be.visible')
        cy.get(LEProfilePage.getViewSocialProfileBtn()).should('be.visible')

        //Clickin on the Settings Tab
        LELearnerManagementPage.getNavbarMenuItemByNameAndClick("Settings")
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(LEProfilePage.getProfilePageTitle()).should('contain.text', 'Settings')
        //Asserting Social Profile
        //Here first has been used to select the first header
        cy.get(LELearnerManagementPage.getSocialProfileHeader()).first().should('have.text', 'Social Profile')
        //Asserting Options 
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.Certificates).should('have.text', SocialProfileOptions.Certificates)
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.CompetenciesAndBadges).should('have.text', SocialProfileOptions.CompetenciesAndBadges)
        LELearnerManagementPage.getCoursesCheckboxByName(SocialProfileOptions.Courses).should('have.text', SocialProfileOptions.Courses)

        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.CompetenciesAndBadges).find('input').should('have.attr', 'value', 'false')
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.CompetenciesAndBadges).find('input').click({ force: true })
        LELearnerManagementPage.getSettingsCheckBoxByname(SocialProfileOptions.CompetenciesAndBadges).find('input').should('have.attr', 'value', 'true')

        LELearnerManagementPage.getCoursesCheckboxByName(SocialProfileOptions.Courses).find('input').should('have.attr', 'value', 'false')
        LELearnerManagementPage.getCoursesCheckboxByName(SocialProfileOptions.Courses).find('input').click({ force: true })
        LELearnerManagementPage.getCoursesCheckboxByName(SocialProfileOptions.Courses).find('input').should('have.attr', 'value', 'true')

        cy.get(LELearnerManagementPage.getSaveBtn()).should('have.attr', 'aria-disabled', 'false').click()

        cy.get(LEManageTemplateCoursesPage.getManageTemplateSuccessMessage(), { timeout: 1500000 }).should('be.visible').and('contain', 'Changes Saved.')


        //Going back to Social Profile and assert that all these shows 
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