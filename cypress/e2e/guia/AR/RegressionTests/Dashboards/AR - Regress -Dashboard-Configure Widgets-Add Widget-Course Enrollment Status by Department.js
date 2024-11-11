import ARDashboardPage, { ManageDashboardArticles } from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDuplicateCourseModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDuplicateCourseModal"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import ARCourseUploadReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseUploadReportPage"
import { courseEnrollmentStatusData, dashboardDetails } from "../../../../../../helpers/TestData/Dashboard/dashboardDetails"
import { departments } from "../../../../../../helpers/TestData/Department/departments"
import { users } from "../../../../../../helpers/TestData/users/users"
import actionButtons from '../../../../../fixtures/actionButtons.json'

const widgetNumber = 3;

describe("C6347, C7255 - AR - Regress - Dashboard - Configure Widgets - Add Widget - Course Enrollment Status by Department", function () {

    before('Login as an Admin and create a Dashboard for the test', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getDashboardsReport()
        ARDashboardPage.addDashboard(dashboardDetails.dashboardName, dashboardDetails.balanced)
    })

    beforeEach("Login as an admin and visit Add Widget", function () {
        //Login as system admin and navigate to Configure Widgets
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Navigate to widget settings
        ARDashboardPage.setUpDesiredDashboardbyName(dashboardDetails.dashboardName)
        ARDashboardPage.navigateWidgetConfiguration()
    })


    it("Add Widget -  Course Enrollment Status by Department Widget Back Button Pressed", function () {
        // Make sure we have at least ten Dashboard Widgets for the next assertion
        cy.get(ARDashboardPage.getWidgetContainer()).its('length').as('totalWidgets')
        cy.get('@totalWidgets').then((total) => {
            if (total < 10) {
                let numberOfWidgetsToadd = 10 - total
                let i = 0
                for (; i < numberOfWidgetsToadd; i++) {
                    cy.get(ARDashboardPage.getAddWidgetBtn()).click()
                }
            }
        })

        //Assert max number of widget
        cy.get(ARDashboardPage.getMaxNumberOfWidgetsTitle()).should('have.text', ManageDashboardArticles.MAX_ALLOWED_DASHBOARD_WIDGETS)
        //Add rich text widget at specified index
        ARDashboardPage.addWidgetWithoutConfirmation(dashboardDetails.widgetDepartment, widgetNumber)
        //Click on Cancel Button
        cy.get(ARDashboardPage.getCancelBtn()).should('have.text', actionButtons.CANCEL).click()
        //Assert Configure Widget Page
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', "Configure Widgets")
        //Add Widget ( Course Enrollment Status by Department Widget)
        ARDashboardPage.addWidget(dashboardDetails.widgetDepartment, widgetNumber)

        // General Section - Enter Title for the Course Enrollment Status by Department widget
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Title')).clear().type(dashboardDetails.widgetDeptTitle)
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Subtitle')).clear().type(dashboardDetails.subTitle)
 
        //Data Section - Select a course , Assert Enrollment Status
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Data")).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute('select-departments')).should('have.text', 'Add Departments').click()
        })
        //Selecting Courses
        ARSelectModal.SearchAndSelectFunction([departments.Dept_F_name])
        //Asserting Enrollment Status
        ARDashboardPage.assertEnrollmentStatusCheckBox()

        //Asserting Unit type
        ARCourseUploadReportPage.getRadioBtnByLable("Count")
        ARCourseUploadReportPage.getRadioBtnByLable("Percentage")

        //Asserting Radio Buttons
        cy.get(ARDashboardPage.getElementByDataNameAttribute("chartType")).within(()=>{
            ARDashboardPage.assertRadioBtnLabelByIndex(courseEnrollmentStatusData.HORIZONTAL_BAR_GRAPH, 0)
            ARDashboardPage.assertRadioBtnLabelByIndex(courseEnrollmentStatusData.HORIZONTAL_STACKED_GRAPH, 1)
            ARDashboardPage.assertRadioBtnLabelByIndex(courseEnrollmentStatusData.VERTICAL_BAR_GRAPH, 2)
            ARDashboardPage.assertRadioBtnLabelByIndex(courseEnrollmentStatusData.VERTICAL_STACKED_BAR_GRAPH, 3)
        })
      

        cy.get(ARDashboardPage.getSubmitBtn()).should('have.text', 'Save')
        //Asserting Back and Cancel Button
        cy.get(ARDashboardPage.getModal2()).within(() => {
            cy.get(ARDashboardPage.getBackBtn()).should('have.text', "Back")
            cy.get(ARDashboardPage.getCancelBtn()).should('have.text', "Cancel")
        })
        //Click on Back Button
        cy.get(ARDashboardPage.getModal2()).within(() => {
            cy.get(ARDashboardPage.getBackBtn()).should('have.text', "Back").click()
        })

        cy.get(ARDuplicateCourseModal.getModalTitle(), {timeout: 1000}).should("have.text", "Add Widget")
    })


    it("Add Widget - Course Enrollment Status by Department Widget Cancel Button Pressed", function () {
        //Clicking cancel Button after filling up data
        ARDashboardPage.addCourseEnrollmentByDeptWidgetWithDataFilled(widgetNumber)
        cy.get(ARDashboardPage.getModal2()).within(() => {
            cy.get(ARDashboardPage.getCancelBtn()).should('have.text', "Cancel").click()
        })
        cy.get(ARDashboardPage.getPageHeaderTitle(), {timeout: 1000}).should('have.text', "Configure Widgets")
    })

    it("Add Widget - Course Enrollment Status by Department Widget Save Button Pressed", function () {
        //Saving a Course Enrollment Status by Department Widget
        ARDashboardPage.addCourseEnrollmentByDeptWidgetWithDataFilled(widgetNumber)
        cy.get(ARDashboardPage.getSubmitBtn()).should('have.attr', 'aria-disabled', 'false').click()
    })

    after("Delete the Modified widget", function () {
        //Login as system admin and navigate to Configure Widgets
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Navigate to widget settings
        ARDashboardPage.setUpDesiredDashboardbyName(dashboardDetails.dashboardName)
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.manageDashboard())).click()
        cy.get(ARDashboardPage.getManageDashboardMenuItems()).contains(actionButtons.CONFIGURE_WIDGETS).click()
        cy.get(ARDashboardPage.getAddWidgetBtn(), {timeout: 5000}).should('have.attr', 'aria-disabled', 'true').and('be.visible')
        ARDashboardPage.clearWidget(widgetNumber)

        // Finally delete the newly created Dashboard
        ARDashboardPage.getDashboardsReport()
        ARDashboardPage.deleteDashboard(dashboardDetails.dashboardName)
    })
})