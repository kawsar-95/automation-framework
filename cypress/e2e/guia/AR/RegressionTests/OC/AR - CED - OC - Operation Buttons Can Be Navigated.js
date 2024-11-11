import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARUnsavedChangesModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal"
import ARCourseSummaryReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseSummaryReportPage"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C735 - Operation Buttons can be navigated', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })

    it('Operation Buttons can be navigated', () => {
        ARDashboardPage.getMediumWait()
        // Navigate to Courses report in the Left Panel .
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Courses")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("Courses"))
        cy.intercept("/api/rest/v2/admin/reports/courses/operations")
            .as("getCourses")
            .wait("@getCourses")

        // Menu items appear correctly and in the correct order
        // Online Course, Instructor Led, Course Bundle, Curriculum, Category, Manage categories
        cy.get(ARCourseSummaryReportPage.getRightActionMenuBtn()).eq(0).should('contain', 'Add Online Course')
        cy.get(ARCourseSummaryReportPage.getRightActionMenuBtn()).eq(1).should('contain', 'Import Course')
        cy.get(ARCourseSummaryReportPage.getRightActionMenuBtn()).eq(2).should('contain', 'Add Instructor Led')
        cy.get(ARCourseSummaryReportPage.getRightActionMenuBtn()).eq(3).should('contain', 'Add Course Bundle')
        cy.get(ARCourseSummaryReportPage.getRightActionMenuBtn()).eq(4).should('contain', 'Add Curriculum')
        cy.get(ARCourseSummaryReportPage.getRightActionMenuBtn()).eq(5).should('contain', 'Add New Category')

        ARDashboardPage.AddFilter('Type', 'Online Course')
        ARDashboardPage.getMediumWait()

        // As an Admin I select a course and select the items in the single select right side menu
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        //Click on Edit
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit')).click()
        ARDashboardPage.getLongWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('title')).should('contain', 'Edit')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('cancel')).click()
        cy.get(ARUnsavedChangesModal.getOKBtn()).click()
        ARDashboardPage.getLongWait()
        //Click on Enroll user
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Enroll User')).click()
        ARDashboardPage.getLongWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('header')).should('contain', 'Enroll Users')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('cancel')).click()
        ARDashboardPage.getLongWait()
        //Click on course enrollment
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Course Enrollments')).click()
        ARDashboardPage.getLongWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('title')).should('contain', 'Course Enrollments')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('back')).click()
        ARDashboardPage.getLongWait()
        //Click on View Activity Report
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('View Activity Report')).click()
        ARDashboardPage.getLongWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('title')).should('contain', 'Course Activity')



    })
    it('select multiple courses and select the items', () => {
        ARDashboardPage.getMediumWait()
        // Navigate to Courses report in the Left Panel .
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Courses")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("Courses"))
        cy.intercept("/api/rest/v2/admin/reports/courses/operations")
            .as("getCourses")
            .wait("@getCourses")

        ARDashboardPage.AddFilter('Type', 'Online Course')
        ARDashboardPage.getMediumWait()
        //  Select multiple courses
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        cy.get(ARDashboardPage.getGridTable()).eq(1).click()
        ARDashboardPage.getMediumWait()
        // Menu items appear correctly and in the correct order
        cy.get(ARCourseSummaryReportPage.getRightActionMenuBtn()).eq(0).should('contain', 'Enroll Users')
        cy.get(ARCourseSummaryReportPage.getRightActionMenuBtn()).eq(1).should('contain', 'Deselect')


    })
})