import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import actionButtons from "../../../../../fixtures/actionButtons.json"

describe('C1005 - NASA-1269: An Authorized Admin Can Access the User Enrollments Report', () => {

    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    after(function () {
        //Delete user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getUsersReport()
        arUserPage.deleteUser('Username', userDetails.username)
        
        //logout
        cy.logoutAdmin()
    })

    beforeEach(() => {
        //Sign into admin side as admin, navigate to Courses
        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')
    })

    it('Verify Admin Can Access the User Enrollments Print button', () => {
        arDashboardPage.getUserEnrollmentsReport()
        cy.wrap(arEnrollUsersPage.EnrollmentPageFilter(userDetails.username))
        cy.get(arEnrollUsersPage.getNoResultMsg()).contains('No results found.').should('exist')

        // app calls window.print
        const stub = cy.stub(cy.state('window'), 'print')
        cy.get(arDashboardPage.getElementByTitleAttribute(actionButtons.PRINT_REPORT)).click()  
            .should(() => expect(stub).to.be.called)
    })

    it('Verify Admin Can Access the User Enrollments Layout buttons', () => {
        arDashboardPage.getUserEnrollmentsReport()
        cy.wrap(arEnrollUsersPage.MandatoryReportFilter(userDetails.username))
        cy.get(arEnrollUsersPage.getNoResultMsg()).contains('No results found.').should('exist')

        cy.wrap(arEnrollUsersPage.AddFilter('Course Language', 'English'))

        cy.get(arEnrollUsersPage.getSavedReportLayout()).click()
        // Click on Create New button.
        arEnrollUsersPage.createNewReportLayout('English Language Report')
    })
})