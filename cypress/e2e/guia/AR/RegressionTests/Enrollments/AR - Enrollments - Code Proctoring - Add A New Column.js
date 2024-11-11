import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARCourseActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseActivityReportPage"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { miscData } from "../../../../../../helpers/TestData/Misc/misc"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C7306 - AUT-690 - Code Proctoring - Add A New Column', () => {
    beforeEach(() => {
        // Login to the Admin Side
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })

    it('Course Enrollments', () => {
        ARDashboardPage.getMediumWait()
        // Go to The Courses section of the LMS
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        // Select Course Enrollments Report
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Course Enrollments'))
        ARDashboardPage.getMediumWait()

        // Select a course
        ARCoursesPage.EnrollmentPageFilter(courses.oc_filter_01_name)
        ARDashboardPage.getMediumWait()
        // The Proctor Code column does not appear by default
        cy.get(ARDashboardPage.getTableHeader()).should('not.contain', 'Proctor Code')

        cy.get(ARDashboardPage.getTableDisplayColumnBtn()).click()
        // The Proctor Code column appears in the Additional Columns list.
        cy.get(ARDashboardPage.getDisplayColumnItemByName('Proctor Code')).should('exist')
        // The Proctor Code column can be added to the Course Enrollments Report
        cy.get(ARDashboardPage.getDisplayColumnItemByName('Proctor Code')).click()
        cy.get(ARDashboardPage.getTableDisplayColumnBtn()).click({ force: true })
        // The Proctor Code column is added to the existing columns
        // The Column is called Proctor Code
        cy.get(ARDashboardPage.getTableHeader()).should('contain', 'Proctor Code')

        // Go to The filter on proctor column.
        ARDashboardPage.AddFilter('Proctor Code', 'Does Not Contain', '1')
        // Click on generated report.
        cy.get(ARDashboardPage.getGenerateReportFileBtn()).click()
        cy.get(ARCourseActivityReportPage.getGenerateReportFileFormatDDown()).click()
        // Drop down should display Excel
        cy.get(ARCourseActivityReportPage.getGenerateReportFileFormatOption()).eq(0).should('contain', 'Excel')
        // Drop down should display CSV
        cy.get(ARCourseActivityReportPage.getGenerateReportFileFormatOption()).eq(1).should('contain', 'CSV')
        cy.get(ARDashboardPage.getGenerateReportFileBtn()).click({ force: true })

        // create layout
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Report Layouts')).click()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('create-full')).click()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Nickname')).type(miscData.layout_name_1)
        cy.get(ARDashboardPage.getCreateLayoutModalSaveBtn()).click({ force: true })

        ARDashboardPage.getLongWait()

        // Share report
        cy.get(ARDashboardPage.getShareReportBtn()).click()
        cy.get(ARDashboardPage.getShareReportBtn()).click({ force: true })


        // Delete created layout
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Selected Report Layout')).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Delete Layout')).click()

    })
})