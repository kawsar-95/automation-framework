import ARDashboardAccountMenu from "../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu"
import { users } from "../../../../../../helpers/TestData/users/users"
import arDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import AREditClientDefaultsPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientDefaultsPage"

describe("C6815 AUT-761, AR - Portal Settings - Allow a client to hide leaderboard points from course details", function () {
  beforeEach(() => {
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
  })

  it("Allow a client to hide leaderboard points from course details", () => {
    // Select Account Menu
    cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()

    // Select Portal Setting option from account menu
    cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should("exist").click()
    arDashboardPage.getShortWait()

    // Navigate to Defaults and go to the Defaults Leaderboard Point Values
    cy.get(arDashboardPage.getDefaultsTab()).click()
    arDashboardPage.getShortWait()

    // Verify Message Displayed
    cy.get(AREditClientDefaultsPage.getDefaultLeaderboardPointValuesHelpTxt()).should('have.text', AREditClientDefaultsPage.getDefaultLeaderboardPointValuesHelpMsg())

    // Enter the point
    cy.get(AREditClientDefaultsPage.getCompleteOnlineCoursePoints()).clear().type(10)
    cy.get(AREditClientDefaultsPage.getCompleteCurriculumCoursePoints()).clear().type(10)
    cy.get(AREditClientDefaultsPage.getCompleteInstructorLedCoursePoints()).clear().type(10)
    cy.get(AREditClientDefaultsPage.getEarnCompetencyPoints()).clear().type(3)
    cy.get(AREditClientDefaultsPage.getCommentPoints()).clear().type(1)

    //As a System Admin, I want to be able to hide leaderboard points for my portal
    cy.get(arDashboardPage.getShowLeaderboardPointsInCourseDetailsToggleBtn()).find('a').should('have.class', 'on')
    cy.get(arDashboardPage.getShowLeaderboardPointsInCourseDetailsToggleBtn()).find('a').click()
    arDashboardPage.getShortWait()

    cy.get(arDashboardPage.getShowLeaderboardPointsInCourseDetailsToggleBtn()).find('a').should('not.have.class', 'on')

    cy.get(arDashboardPage.getShowLeaderboardPointsInCourseDetailsToggleBtn()).find('a').click();
    arDashboardPage.getShortWait();

    cy.get(arDashboardPage.getShowLeaderboardPointsInCourseDetailsToggleBtn()).find('a').should('have.class', 'on')

    cy.get(arDashboardPage.getShowLeaderboardPointsInCourseDetailsToggleBtn()).parent().siblings('div')
        .should('contain', AREditClientDefaultsPage.getShowLeaderboardPointsInCourseDetailsToggleMsg())

    // Click Save
    cy.get(arDashboardPage.getA5SaveBtn()).click()
  })
})
