import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"


describe('C1983 - AUT-535 - Acceptance Test - NLE-2467 - Edit User - Add Side Bar buttons ', () => {
    it('Verify that Message User, User Transcript, Reset Password, Delete and Enroll Users buttons has been added to Add Edit user side bar', () => {
        //Login as an Admin user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Go to Users Report
        ARDashboardPage.getUsersReport()
        //Filter out a user
        ARDashboardPage.AddFilter('Username', 'Contains', users.learner01.learner_01_username)
        cy.get(ARDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        cy.get(ARDashboardPage.getTableCellName(4)).contains(users.learner01.learner_01_username).click()
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('View Enrollments')))
        //Asserting View EnrollmentsBtn
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('View Enrollments')).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('View Enrollments')).should('have.text' , 'View Enrollments')
        //Asserting Message User
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Message User')).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Message User')).should('have.text' , 'Message User')
        //Asserting User Transcript
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('User Transcript')).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('User Transcript')).should('have.text' , 'User Transcript')
        //Asserting Reset Password
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Reset Password')).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Reset Password')).should('have.text' , 'Reset Password')
        //Asserting Enroll User
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Enroll User')).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Enroll User')).should('have.text' , 'Enroll User')
        //Asseting Delete btn
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete')).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete')).should('have.text' , 'Delete')
        //Asserting Reset Password
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Reset Password')).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Reset Password')).should('have.text' , 'Reset Password')


    })
})