import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESocialProfilePage from '../../../../../../helpers/LE/pageObjects/User/LESocialProfilePage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import defaultTestData from '../../../../../fixtures/defaultTestData.json'
import ARTemplatesReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARTemplatesReportPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import LEManageTemplateMenu from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateMenu'
import menuItems from '../../../../../../cypress/fixtures/menuItems.json'


describe('C1818 AUT-440, LE - Social Profile - Display a message when no content is displayed in the main area of the profile', function(){
    it('learner has hidden all 3 sections ( badges, certificates and courses)', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        LESideMenu.getLEMenuItemsByNameThenClick(menuItems.MANAGE_TEMPLATE)
        LEDashboardPage.getMediumWait()

        // Navigate to the Settings tab
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Settings').should('be.visible').click()
        LEDashboardPage.getMediumWait()

        // Expand Porfile
        cy.get(ARTemplatesReportPage.getExpandableContentToggleBtn()).contains('Profile').click()

        //  keeps badges, certificates and courses off
        ARTemplatesReportPage.setCheckboxValue('false', ARTemplatesReportPage.getShowBadgesAndCompetenciesCheckbox())
        ARTemplatesReportPage.setCheckboxValue('false', ARTemplatesReportPage.getShowCertificatesCheckbox())
        ARTemplatesReportPage.setCheckboxValue('false', ARTemplatesReportPage.getShowCoursesCheckbox())

        // Save Changes
        ARTemplatesReportPage.saveProfile()

        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            userDetails.userID2 = currentURL.slice(-36)
        })
    })

    it("verify no information could be found, when the learner has hidden all 3 sections ( badges, certificates and courses)", () => {
        cy.apiLoginWithSession(users.learner02.learner_02_username, users.learner02.learner_02_password, `/#/social-profile/${userDetails.userID2}`)
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')

        cy.get(LESocialProfilePage.getSocialProfileHeaderName()).should('be.visible').and('have.text', users.learner01.learner_01_fname + " " + users.learner01.learner_01_lname)
        cy.get(LESocialProfilePage.getSocialProfileNoInformationDiv()).should('contain', LESocialProfilePage.socialProfileNoInformationMsg())
    })

    it('Create Learner', function() {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            userDetails.userID = currentURL.slice(-36)
        })
    })

    it("when one or more areas are enabled but the learner hasn't completed anything in that area yet", () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        LESideMenu.getLEMenuItemsByNameThenClick(menuItems.MANAGE_TEMPLATE)
        LEDashboardPage.getMediumWait()

        // Navigate to the Settings tab
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Settings').should('be.visible').click()
        LEDashboardPage.getMediumWait()
        
        // Expand Porfile
        cy.get(ARTemplatesReportPage.getExpandableContentToggleBtn()).contains('Profile').click()

        //  keeps badges, certificates on and courses off
        ARTemplatesReportPage.setCheckboxValue('true', ARTemplatesReportPage.getShowBadgesAndCompetenciesCheckbox())
        ARTemplatesReportPage.setCheckboxValue('true', ARTemplatesReportPage.getShowCertificatesCheckbox())
        ARTemplatesReportPage.setCheckboxValue('false', ARTemplatesReportPage.getShowCoursesCheckbox())

        // Save Changes
        ARTemplatesReportPage.saveProfile()

        cy.apiLoginWithSession(users.learner02.learner_02_username, users.learner02.learner_02_password, `/#/social-profile/${userDetails.userID}`)
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')

        cy.get(LESocialProfilePage.getSocialProfileHeaderName()).should('be.visible').and('have.text', defaultTestData.USER_LEARNER_FNAME + " " + defaultTestData.USER_LEARNER_LNAME)
        cy.get(LESocialProfilePage.getSocialProfileNoInformationDiv()).should('contain', LESocialProfilePage.socialProfileNoInformationMsg())
    })

    it('admin keeps badges, certificates and courses off or hidden', () => { 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, `/admin`)
        ARDashboardPage.getTemplatesReport()

        ARTemplatesReportPage.A5AddFilter('Department', 'Is Only', departments.dept_top_name)
        cy.get(ARDashboardPage.getA5TableCellRecord()).contains(departments.dept_top_name).click()
        cy.get(ARTemplatesReportPage.getTemplateEditIcon()).click()
        ARDashboardPage.getMediumWait()

        // Navigate to the Settings tab
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Settings').should('be.visible').click()
        ARDashboardPage.getShortWait()

        // Expand Porfile
        cy.get(ARTemplatesReportPage.getExpandableContentToggleBtn()).contains('Profile').click()
        ARDashboardPage.getShortWait()

        //  keeps badges, certificates and courses off
        ARTemplatesReportPage.setCheckboxValue('false', ARTemplatesReportPage.getShowBadgesAndCompetenciesCheckbox())
        ARTemplatesReportPage.setCheckboxValue('false', ARTemplatesReportPage.getShowCertificatesCheckbox())
        ARTemplatesReportPage.setCheckboxValue('false', ARTemplatesReportPage.getShowCoursesCheckbox())

        // Save Changes
        ARTemplatesReportPage.saveProfile()

        cy.apiLoginWithSession(users.learner02.learner_02_username, users.learner02.learner_02_password)
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            userDetails.userID2 = currentURL.slice(-36)
        })
    })

    it("verify no information could be found, when an admin keeps badges, certificates and courses off or hidden", () => {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password, `/#/social-profile/${userDetails.userID2}`)
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')

        cy.get(LESocialProfilePage.getSocialProfileHeaderName()).should('be.visible').and('have.text', users.learner02.learner_02_fname + " " + users.learner02.learner_02_lname)
        cy.get(LESocialProfilePage.getSocialProfileNoInformationDiv()).should('contain', LESocialProfilePage.socialProfileNoInformationMsg())
    })

    after(function() {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        LESideMenu.getLEMenuItemsByNameThenClick(menuItems.MANAGE_TEMPLATE)
        LEDashboardPage.getMediumWait()

        // Navigate to the Settings tab
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Settings').should('be.visible').click()
        LEDashboardPage.getMediumWait()

        // Expand Porfile
        cy.get(ARTemplatesReportPage.getExpandableContentToggleBtn()).contains('Profile').click()

        //  keeps badges, certificates and courses off
        ARTemplatesReportPage.setCheckboxValue('true', ARTemplatesReportPage.getShowBadgesAndCompetenciesCheckbox())
        ARTemplatesReportPage.setCheckboxValue('true', ARTemplatesReportPage.getShowCertificatesCheckbox())
        ARTemplatesReportPage.setCheckboxValue('true', ARTemplatesReportPage.getShowCoursesCheckbox())

        // Save Changes
        ARTemplatesReportPage.saveProfile()

        cy.deleteUser(userDetails.userID)
    })
})
