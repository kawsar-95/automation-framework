import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import { users } from "../../../../../../helpers/TestData/users/users";

/**
 * Testrail URL:
 * https://absorblms.testrail.io/index.php?/cases/view/6284
 */
describe('Deselect Billboard - C6284, C7354', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        );
    })

    it('Deselect Billboard', () => {
        ARDashboardPage.getBillboardsReport()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()

        //Deselect Billboard
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getDeselectBtn()).should('be.visible')
        cy.get(ARDashboardPage.getDeselectBtn()).click()
        cy.get(ARDashboardPage.getDeselectBtn()).should('not.exist')
    })
})