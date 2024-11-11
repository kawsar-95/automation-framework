import arDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import { users } from "../../../../../../helpers/TestData/users/users";

describe('C7406 AR - Engage - LeaderBoards - View LeaderBoard', function () {
  beforeEach(()=>{
    //Login as admin
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
  })

  it('View LeaderBoard', () => {
    //Click on Engage form left hand panel
    arDashboardPage.getLeaderboardsReport()

    // Select any existing LeaderBoard from the list of LeaderBoards
    cy.get(arDashboardPage.getTableCellContentByIndex(2)).eq(0).click()

    // Click on View Leaderboard button
    cy.get(arDashboardPage.getA5AddEditMenuActionsByIndex(2)).should('contain', 'View Leaderboard').click()
    cy.get(arDashboardPage.getA5PageHeaderTitle()).should('contain', 'Leaderboard Activity')

    // Click on Back
    cy.get(arDashboardPage.getA5AddEditMenuActionsByIndex(1)).should('contain', 'Back').click()
    cy.get(arDashboardPage.getA5PageHeaderTitle()).should('contain', 'Leaderboards')
  })
})



