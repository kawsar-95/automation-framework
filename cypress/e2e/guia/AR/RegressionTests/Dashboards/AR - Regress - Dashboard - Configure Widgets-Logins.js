import ARDashboardPage  from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { dashboardDetails, LoginsWidgetData } from "../../../../../../helpers/TestData/Dashboard/dashboardDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import actionButtons from '../../../../../fixtures/actionButtons.json'

const widgetNumber = 5;

describe("C6349 - AR - Regress - Dashboard - Configure Widgets - Add Widget - Logins", function () {

    before('Add a dashboard as an prerequest', ()=>{
        //Login as admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username,users.sysAdmin.admin_sys_01_password,'/admin')
        //Navigate to Dashboard report page
        ARDashboardPage.getDashboardsReport()
        // Add a new dashboard
        ARDashboardPage.addDashboard(dashboardDetails.dashboardName, dashboardDetails.balanced)
        // Add three more widget's container to have the max number of widget's container
        for(let i =0 ; i<2; i++){
            cy.get(ARDashboardPage.getAddWidgetBtn()).click()
            ARDashboardPage.getVShortWait()
        }
        cy.get(ARDashboardPage.getAddWidgetBtn()).should('have.attr', 'aria-disabled', 'true')
    })
    
    beforeEach("Login as an admin and visit Add Widget", function () {
        //Login as system admin and navigate to Configure Widgets
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Navigate to widget settings
        ARDashboardPage.setUpDesiredDashboardbyName(dashboardDetails.dashboardName)
        ARDashboardPage.navigateWidgetConfiguration()
    })

    it("Add Widget - Logins Widget Back Button Pressed", function () {
        //Assert max number of widget
        cy.get(ARDashboardPage.getMaxNumberOfWidgetsTitle()).should('have.text', "A maximum of 10 Widgets can be added to a Dashboard")
        //Add rich text widget at specified index
        ARDashboardPage.addWidgetWithoutConfirmation(dashboardDetails.logins, widgetNumber)
        //Click on Cancel Button
        cy.get(ARDashboardPage.getCancelBtn()).should('have.text', actionButtons.CANCEL).click()
        //Assert Configure Widget Page
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', "Configure Widgets")
        //Add Widget ( Login Widget)
        ARDashboardPage.addWidget(dashboardDetails.logins, widgetNumber)
        // General Section - Enter Title for the Logins widget
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Title')).clear().type(LoginsWidgetData.TITLE)
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Subtitle')).clear().type(LoginsWidgetData.SUB_TITLE)
        //Navigate to Data Section
        //Selecting Frequency Dropdown
        cy.get(ARDashboardPage.getLoginWidgetFrequencyDdown()).click()
        cy.get(ARDashboardPage.getDDownOpt()).contains('Daily').click()
        cy.get(ARDashboardPage.getLoginWidgetFrequencyDdownLabel(),{timeout:10000}).scrollIntoView().should('be.visible').and('contain', 'Daily')
        //Selecting Range Dropdown
        cy.get(ARDashboardPage.getLoginWidgetRangeDdown()).click()
        cy.get(ARDashboardPage.getDDownOpt()).contains('Last 14 Days').click()
        cy.get(ARDashboardPage.getLoginWidgetRangeDdownLabel(),{timeout:10000}).scrollIntoView().should('be.visible').and('contain', 'Last 14 Days')
        //VeryFying the Radio Buttons 
        ARDashboardPage.assertRadioBtnLabelByIndex(LoginsWidgetData.Line_Graph, 0)
        ARDashboardPage.assertRadioBtnLabelByIndex(LoginsWidgetData.Summary, 1)
        ARDashboardPage.assertRadioBtnLabelByIndex(LoginsWidgetData.Vertical_Bar_Graph, 2)
        cy.get(ARDashboardPage.getSubmitBtn()).should('have.text', 'Save')
        //Asserting Back and Cancel Button
        cy.get(ARDashboardPage.getModal2()).within(() => {
            cy.get(ARDashboardPage.getBackBtn()).should('exist')
            cy.get(ARDashboardPage.getCancelBtn()).should('exist')
        })
        //Click on Back Button
        cy.get(ARDashboardPage.getModal2()).within(() => {
            cy.get(ARDashboardPage.getBackBtn()).should('have.text', "Back").click()
        })
        cy.get(ARDashboardPage.getModalTitle(),{timeout:10000}).should('be.visible').and("have.text", "Add Widget")
    })

    it("Add Widget - Competencies Widget Cancel Button Pressed", function () {
        //Clicking cancel Button after filling up data
        ARDashboardPage.addCompetenciesWidgetWithDataFilled(widgetNumber)
        cy.get(ARDashboardPage.getModal2()).within(() => {
            cy.get(ARDashboardPage.getCancelBtn()).should('be.visible').click()
        })
        cy.get(ARDashboardPage.getPageHeaderTitle(),{timeout:10000}).scrollIntoView().should('be.visible').and("have.text", `${actionButtons.CONFIGURE_WIDGETS}`)
    })

    it("Add Widget - Competencies Widget Save Button Pressed", function () {
        //Saving a Competencies Widget
        ARDashboardPage.addCompetenciesWidgetWithDataFilled(widgetNumber)
        cy.get(ARDashboardPage.getSubmitBtn()).click()
        cy.get(ARDashboardPage.getPageHeaderTitle(),{timeout:10000}).scrollIntoView().should('be.visible').and("have.text", `${actionButtons.CONFIGURE_WIDGETS}`)
    })

    after("Delete the Modified widget", function () {
        //Login as system admin and navigate to Configure Widgets
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Clean up newly added dashboard
        ARDashboardPage.deleteDashboard(dashboardDetails.dashboardName)
    })
})