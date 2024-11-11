import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { dashboardDetails } from "../../../../../../helpers/TestData/Dashboard/dashboardDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C6289,C7250 - Add Dashboard', () => {
    
    beforeEach(() => {
        //Login as admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username,users.sysAdmin.admin_sys_01_password,'/admin')
    })

    it('Add Dashboard', () => {
        //Navigate to Dashboard report page
        ARDashboardPage.getDashboardsReport()
    
        // Add a new dashboard
        ARDashboardPage.addDashboard(dashboardDetails.dashboardName, dashboardDetails.balanced)

    })
    
    it('Delete created dashboard', () => {
        // Clean up newly added dashboard
        ARDashboardPage.deleteDashboard(dashboardDetails.dashboardName)
    })

})