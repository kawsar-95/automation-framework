import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"
import actionButtons from '../../../../../fixtures/actionButtons.json'
import { dashboardDetails } from "../../../../../../helpers/TestData/Dashboard/dashboardDetails"


describe("C6326 AR - Regress - Delete Dashboard", function () {

    before('Add a dashboard as an prerequest', ()=>{
        //Login as admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username,users.sysAdmin.admin_sys_01_password,'/admin')
        //Navigate to Dashboard report page
        ARDashboardPage.getDashboardsReport()
        // Add a new dashboard
        ARDashboardPage.addDashboard(dashboardDetails.dashboardName, dashboardDetails.balanced)
    })
    
    beforeEach("Login as an admin and visit Add Widget", function () {
        //Login as system admin and navigate to Configure Widgets
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.setUpDesiredDashboardbyName(dashboardDetails.dashboardName)
        //Navigate to widget settings
        cy.get(ARDashboardPage.getManageDashboardBtn(),{timeout:10000}).should('be.visible')
        cy.get(ARDashboardPage.getManageDashboardBtn()).click()
        cy.get(ARDashboardPage.getManageDashboardMenuItems()).contains(actionButtons.DELETE_DASHBOARD).click()
    })

    it("User press cancel button ", function () {
        cy.get(ARDashboardPage.getElementByDataName("cancel")).click()
    })

    it("User press delete button ", function () {
        cy.get(ARDashboardPage.getElementByDataName("confirm")).click()
    })

})