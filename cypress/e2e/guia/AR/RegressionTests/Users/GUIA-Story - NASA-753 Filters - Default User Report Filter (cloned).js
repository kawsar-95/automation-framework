import AREquivalentCoursesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/AREquivalentCourses.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARGroupAddEditPage from "../../../../../../helpers/AR/pageObjects/Groups/ARGroupAddEditPage"
import ARCourseEnrollmentReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseEnrollmentReportPage"
import ARUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('AUT-310 C1013 - GUIA-Story - NASA-753 Filters - Default User Report Filter (cloned)', () => {

    it('Default User Report Filter', () => {
        // System Admin login
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        // Navigate to users report page
        ARDashboardPage.getUsersReport()
        // Filter button visibility
        cy.get(ARGroupAddEditPage.getFilterEdit()).should('be.visible')
        cy.get(ARUserPage.getRemovefilterBtn()).should('exist')
        // Default status filter button
        cy.get(ARGroupAddEditPage.getFilterEdit()).eq(1).within(() => {
            cy.get(ARCourseEnrollmentReportPage.getProperty()).should('contain', 'Status ')
            cy.get(ARUserPage.getOperatorValue()).should('contain', 'Equals')
            cy.get(ARCourseEnrollmentReportPage.getValue()).should('contain', 'Active')
        })
        
        // Active status button click
        cy.get(ARGroupAddEditPage.getFilterEdit()).eq(1).click()
        // Status filter model open
        cy.get(ARUserPage.getStatusFilterModel()).should('be.visible')
        // Active status input
        cy.get(AREquivalentCoursesModule.getRefineFilterDDownopt()).contains('Active').click()
        // Status input option available "Active"
        cy.get(ARDashboardPage.getOperatorDDownOpt()).should('contain', 'Active')
        // Status input option available "Inactive"
        cy.get(ARDashboardPage.getOperatorDDownOpt()).should('contain', 'Inactive')
        cy.get(ARDashboardPage.getOperatorDDownOpt()).contains('Inactive').click()
        // Add Filter btn click
        cy.get(ARUserPage.getSubmitBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 20000 }).should('not.exist')
        // Status Inactive selected
        ARCourseEnrollmentReportPage.verifyFilteredPropertyAndValue('Status', 'Inactive')
    })
})