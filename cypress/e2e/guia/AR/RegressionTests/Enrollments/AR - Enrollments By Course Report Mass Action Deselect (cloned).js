import ARAddEditCategoryPage from "../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARCourseActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseActivityReportPage"
import ARCourseEnrollmentReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseEnrollmentReportPage"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import ARUserEnrollmentPage from "../../../../../../helpers/AR/pageObjects/User/ARUserEnrollmentPage"
import ARUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { users } from "../../../../../../helpers/TestData/users/users"



describe("C968 - Enrollments By Course Report Mass Action Deselect (cloned)", () => {

    it("Verify Deselect Mass Action tool becomes available on Selecting Multiple Lines", () => {
        //Login into the admin side 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        //Click on Courses from left panel
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.get(ARDashboardPage.getElementByDataName(ARDashboardPage.getMenuHeaderTitleDataName())).should('contain', 'Courses')
        // Goto Course Enrollments menu
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Course Enrollments'))
        ARDashboardPage.getShortWait()
        cy.get(ARCourseEnrollmentReportPage.getPageHeader()).should('contain', 'Course Enrollments')
        //Clicking on Course Choose button
        cy.get(ARDashboardPage.getElementByDataNameAttribute("data-filter-item")).click({ force: true })
        //Selecting Course in Choose Course 
        ARCourseActivityReportPage.ChooseAddFilter(courses.oc_filter_01_name)
        ARDashboardPage.getMediumWait()
        //Selecting first row from table
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()

        cy.wrap(ARUserPage.WaitForElementStateToChange(ARUserPage.getAddEditMenuActionsByName('Message User'), AREnrollUsersPage.getShortWait()))
        //Asserting Deselect Button
        cy.get(ARDashboardPage.getDeselectBtn()).should('exist')
        //Clicking on Deselect Button
        cy.get(ARDashboardPage.getDeselectBtn()).should('exist').click()
        //Waiting
        ARDashboardPage.getShortWait()
        //Asserting Deselect Button Does not Appear 
        cy.get(ARDashboardPage.getDeselectBtn()).should('not.exist')


    })

})