import arDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import { users } from "../../../../../../helpers/TestData/users/users";

describe('C7407 AR - Engage - LeaderBoards - Deselect existing LeaderBoard', function () {
  beforeEach(()=>{
    //Login as admin
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
  })

  it('View LeaderBoard', () => {
    //Click on Engage form left hand panel
    cy.get(arDashboardPage.getElementByAriaLabelAttribute('Engage'),{timeout:5000}).click()

    //Click on Leaderboards
    arDashboardPage.getMenuItemOptionByName('Leaderboards')

    // Select any existing LeaderBoard from the list of LeaderBoards
    cy.get(arDashboardPage.getTableCellContentByIndex(2)).eq(0).click()

    // Verify User Selected the LeaderBoard successfully
    cy.get(arDashboardPage.getTableCellContentByIndex(1)).eq(0).should('have.class', 'selected')

    // Click on Deselect button from RHS Panel
    cy.get(arDashboardPage.getA5AddEditMenuActionsByIndex(3)).should('contain', 'Deselect')
    cy.get(arDashboardPage.getA5AddEditMenuActionsByIndex(3)).click()

    // Verify User Deselected the LeaderBoard successfully
    cy.get(arDashboardPage.getTableCellContentByIndex(1)).eq(0).should('not.have.class', 'selected')
  })
})



