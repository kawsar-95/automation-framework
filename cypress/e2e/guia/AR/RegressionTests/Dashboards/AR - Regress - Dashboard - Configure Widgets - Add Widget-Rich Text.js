import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { dashboardDetails } from "../../../../../../helpers/TestData/Dashboard/dashboardDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import actionButtons from '../../../../../fixtures/actionButtons.json'

const widgetNumber = 8;

describe("C6290, C7251, C7252 - AR - Regress - Dashboard - Configure Widgets - Add Widget Rich Text", function () {

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

    it("Add Widget - Rich Text Widget Back Button Pressed", function () {
        //Assert max number of widget
        cy.get(ARDashboardPage.getMaxNumberOfWidgetsTitle(),{timeout:10000}).should('have.text', "A maximum of 10 Widgets can be added to a Dashboard")
        //Add rich text widget at specified index
        ARDashboardPage.addWidgetWithoutConfirmation(dashboardDetails.richText, widgetNumber)
        //Click on Cancel Button
        cy.get(ARDashboardPage.getCancelBtn()).should('have.text', actionButtons.CANCEL).click()
        //Assert Configure Widget Page
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', "Configure Widgets")
        //Add Widget (Rich Text Widget)
        ARDashboardPage.addWidget(dashboardDetails.richText, widgetNumber)
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Title')).clear().type(dashboardDetails.richTextTitle)
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Subtitle')).clear().type(dashboardDetails.subTitle)
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Body')).clear().type(dashboardDetails.bodyText)
        cy.get(ARDashboardPage.getSubmitBtn()).should('have.text', 'Save')
        //Asserting Back and Cancel Button
        cy.get(ARDashboardPage.getModal2()).within(() => {
            cy.get(ARDashboardPage.getBackBtn()).should('exist')
            cy.get(ARDashboardPage.getCancelBtn()).should('exist')
        })
        //Click on Back Button
        cy.get(ARDashboardPage.getModal2()).within(() => {
            cy.get(ARDashboardPage.getBackBtn()).should('be.visible').click()
        })
        cy.get(ARDashboardPage.getModalTitle(),{timeout:10000}).should('be.visible').and("have.text", "Add Widget")
    })

    it("Add Widget - Rich Text Widget Cancel Button Pressed", function () {
        //Clicking cancel Button after filling up data
        ARDashboardPage.addRichTextWidgetWithDataFilled(widgetNumber)
        cy.get(ARDashboardPage.getModal2()).within(() => {
            cy.get(ARDashboardPage.getCancelBtn()).should('be.visible').click()
        })
        cy.get(ARDashboardPage.getPageHeaderTitle(),{timeout:10000}).scrollIntoView().should('be.visible').and("have.text", `${actionButtons.CONFIGURE_WIDGETS}`)
    })

    it("Add Widget - Rich Text Widget Save Button Pressed", function () {
        //Saving a Rich Text Widget
        ARDashboardPage.addRichTextWidgetWithDataFilled(widgetNumber)
        cy.get(ARDashboardPage.getSubmitBtn()).click()
        cy.get(ARDashboardPage.getPageHeaderTitle(),{timeout:10000}).scrollIntoView().should('be.visible').and("have.text", `${actionButtons.CONFIGURE_WIDGETS}`)
        // Verify changes made to the Rich Text Widget
        cy.get(ARDashboardPage.getSanitizedHtml()).eq(0).should('have.text', dashboardDetails.bodyText)
    })

    it('Delete created dashboard', () => {
        // Clean up newly added dashboard
        ARDashboardPage.deleteDashboard(dashboardDetails.dashboardName)
    })

})