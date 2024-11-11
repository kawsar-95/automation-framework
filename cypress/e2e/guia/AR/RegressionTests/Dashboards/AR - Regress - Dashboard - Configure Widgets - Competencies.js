import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDuplicateCourseModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDuplicateCourseModal"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import { addCompetenciesData, dashboardDetails } from "../../../../../../helpers/TestData/Dashboard/dashboardDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import actionButtons from '../../../../../fixtures/actionButtons.json'

const widgetNumber = 7;

describe("C6344, C7254 - AR - Regress - Dashboard - Configure Widgets - Add Widget - Competencies", function () {

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

    it("Add Widget - Competencies Widget Back Button Pressed", function () {
        //Assert max number of widget
        cy.get(ARDashboardPage.getMaxNumberOfWidgetsTitle()).should('have.text', "A maximum of 10 Widgets can be added to a Dashboard")
        //Add rich text widget at specified index
        ARDashboardPage.addWidgetWithoutConfirmation(dashboardDetails.widgetCompetency, widgetNumber)
        //Click on Cancel Button
        cy.get(ARDashboardPage.getCancelBtn()).should('have.text', actionButtons.CANCEL).click()
        //Assert Configure Widget Page
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', "Configure Widgets")
        //Add Widget ( Competency Widget)
        ARDashboardPage.addWidget(dashboardDetails.widgetCompetency, widgetNumber)

        // General Section - Enter Title for the Competencies widget
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Title')).clear().type(addCompetenciesData.title)

        // Data Section - Select Competencies and Add Filters
        cy.get(ARDashboardPage.getElementByDataName(actionButtons.SELECT_COMPETENCIES_DATA_NAME)).click()
        cy.wrap(ARSelectModal.SearchAndSelectCompetencies([addCompetenciesData.competency1, addCompetenciesData.competency2]))
        cy.get(ARDashboardPage.getElementByDataName(actionButtons.ADD_RULE_DATA_NAME)).click()
        cy.get(ARDashboardPage.getElementByDataName(dashboardDetails.availability_rule_item)).find(ARDashboardPage.getDDownField()).eq(0).click()
        cy.get(ARDashboardPage.getElementByDataName(dashboardDetails.availability_rule_item)).find('li').contains(addCompetenciesData.filterTypeDD1).click()
        cy.get(ARDashboardPage.getElementByDataName(dashboardDetails.availability_rule_item)).find(ARDashboardPage.getDDownField()).eq(1).click()
        cy.get(ARDashboardPage.getElementByDataName(dashboardDetails.availability_rule_item)).find('li').contains(addCompetenciesData.filterTypeDD2).click()

        cy.get(ARDashboardPage.getSubmitBtn()).should('have.text', 'Save')
        //Asserting Back and Cancel Button
        cy.get(ARDashboardPage.getModal()).last().within(() => {
            cy.get(ARDashboardPage.getBackBtn()).should('exist')
            cy.get(ARDashboardPage.getCancelBtn()).should('exist')
        })
        //Click on Back Button
        cy.get(ARDashboardPage.getModal()).last().within(() => {
            cy.get(ARDashboardPage.getBackBtn()).should('have.text', "Back").click()
        })
        cy.get(ARDashboardPage.getModalTitle(),{timeout:10000}).should('be.visible').and("have.text", "Add Widget")

    })

    it("Add Widget - Competencies Widget Cancel Button Pressed", function () {
        //Clicking cancel Button after filling up data
        ARDashboardPage.addCompetenciesWidgetWithDataFilled(widgetNumber)
        cy.get(ARDashboardPage.getModal()).last().within(() => {
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