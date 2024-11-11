import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { rolesDetails } from "../../../../../../helpers/TestData/Roles/rolesDetails"
import { users } from "../../../../../../helpers/TestData/users/users"


describe('C1930 - AUT-489 - GUIA-Story - Acceptance Test - NLE-2299 - Roles Report - View Users in Role', () => {
    it("Role should be visible in filter criteria list", () => {
        //Log in as administrator
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Go to Users Report page
        ARDashboardPage.getUsersReport()
        //Filtering out users according to Role criteria
        ARDashboardPage.AddFilter('Role', 'Role' ,rolesDetails.Admin)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        //Asserting that System Admin is available
        cy.get(ARDashboardPage.getTableCellName(4)).contains(users.sysAdmin.admin_sys_01_username).invoke('text').then((text)=>{
            expect(text).to.equal(users.sysAdmin.admin_sys_01_username)
        })
    })
})