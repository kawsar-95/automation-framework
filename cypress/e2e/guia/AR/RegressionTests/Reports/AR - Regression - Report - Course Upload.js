import ARAddEditCategoryPage from "../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage";
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage";
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal";
import ARCourseUploadReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseUploadReportPage";
import { users } from "../../../../../../helpers/TestData/users/users";



describe("C6369 - AR - Regression - Report - Course Upload", function () {
    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Course Uploads'))
        cy.intercept('/api/rest/v2/admin/reports/course-uploads').as('getCoursesUploads').wait('@getCoursesUploads')
    })
    it("Course Upload Report", function () {
        ARCourseUploadReportPage.getShortWait()
        //Asserting Title
        cy.get(ARAddEditCategoryPage.getReportPageTitle()).should('contain', 'Course Uploads')
        //Asserting Column Header Names
        ARCourseUploadReportPage.getA5TableColumnLabelAssertion()
        //Clicking a record
        cy.get(ARCourseUploadReportPage.getA5TableCellRecordByColumn(2)).first().click()
        ARCourseUploadReportPage.getShortWait()
        //Asserting Right Side menu actions 
        ARCourseUploadReportPage.getRightActionMenuLabel()
        cy.get(ARAddEditCategoryPage.getReportPageTitle()).should('contain', 'Course Uploads')

        //Asserting Title
        cy.get(ARAddEditCategoryPage.getReportPageTitle()).should('contain', 'Course Uploads')

        //Assert Deselct Button 
        cy.get(ARCoursesPage.getDeselectBtn())

    })

})