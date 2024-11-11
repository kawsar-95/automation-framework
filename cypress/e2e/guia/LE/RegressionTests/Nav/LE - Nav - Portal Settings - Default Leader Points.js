import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARDashboardAccountMenu from "../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu";
import { users } from "../../../../../../helpers/TestData/users/users";

const message = "Points are awarded to learners upon completing a course (of the specified type), submitting a comment, or earning a competency. Changes to values do not affect points that have already been awarded."

/**
 * Testrail URL:
 * https://absorblms.testrail.io/index.php?/cases/view/6243
 */
describe('Portal Setting-Default Leader points - C6243', () => {
    beforeEach(() => {
        //Login as Admin
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        );
    })
    it('Portal Settings', () => {
        //Click on portal settings from right hand side
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn())).click();
        cy.get(ARDashboardAccountMenu.getPortalSettingsBtn())
            .should("exist")
            .click();
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should(
            "have.text",
            "Edit Client"
        );
        //Navigate to Defaults and go to the Defaults Leaderboard Point Values
        cy.get(ARDashboardPage.getDefaultsTab()).click();
        cy.get('div').should('contain', message);
        //Enter the point
        cy.get(ARDashboardPage
            .getElementByNameAttribute('UserActivityPointAllocations.CompleteOnlineCoursePoints')
        ).clear().type(10);
        cy.get(ARDashboardPage
            .getElementByNameAttribute('UserActivityPointAllocations.CompleteInstructorLedCoursePoints')
        ).clear().type(10);
        cy.get(ARDashboardPage
            .getElementByNameAttribute('UserActivityPointAllocations.CompleteCurriculumCoursePoints')
        ).clear().type(10);

        //As a System Admin, I want to be able to hide leaderboard points for my portal.
        cy.get(ARDashboardPage.getShowLeaderboardPointsInCourseDetailsToggleBtn()).click();
        cy.get(ARDashboardPage.getShowLeaderboardPointsInCourseDetailsToggleBtn()).click();
        cy.get(ARDashboardPage.getShowLeaderboardPointsInCourseDetailsToggleBtn()).should('contain', 'On');
        cy.get(ARDashboardPage.getA5SaveBtn()).click();


    })
})