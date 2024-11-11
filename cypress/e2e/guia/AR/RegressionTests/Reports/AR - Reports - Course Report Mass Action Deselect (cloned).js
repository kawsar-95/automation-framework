import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARCourseActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseActivityReportPage"
import ARCourseEnrollmentReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseEnrollmentReportPage"
import ARUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { users } from "../../../../../../helpers/TestData/users/users"


describe("C867 - AUT-288 - Enrollments By Course Report Mass Action Deselect (cloned)", () => {

    it("Verify Deselect Mass Action tool becomes available on Selecting Multiple Lines", () => {
        //Login into the admin side 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        //Moving to courses Enrollment page
        ARDashboardPage.getCourseEnrollmentsReport()
        //Clicking on Course Choose button
        cy.get(ARCourseEnrollmentReportPage.getFilterItem()).click({ force: true })
        //Selecting Course in Choose Course 
        ARCourseActivityReportPage.ChooseAddFilter(courses.oc_filter_01_name)
        //Selecting the first course from the Table of Contents
        cy.get(ARCourseActivityReportPage.getTableCellContentByIndex(1)).first().find('input').should('have.attr','aria-checked' , 'false')
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout : 15000}).should('not.exist')
        //Selecting first row from table
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        //Asserting that first row is selected 
        cy.get(ARCourseActivityReportPage.getTableCellContentByIndex(1) ,{timeout:15000}).first().find('input').should('have.attr','aria-checked' , 'true')
        cy.wrap(ARUserPage.WaitForElementStateToChange(ARUserPage.getAddEditMenuActionsByName('Message User'), ARDashboardPage.getShortWait()))
        //Asserting Deselect Button
        cy.get(ARDashboardPage.getDeselectBtn()).should('exist')
        //Clicking on Deselect Button
        cy.get(ARDashboardPage.getDeselectBtn()).should('exist').click()
        //Asserting that first row is deselected
        cy.get(ARCourseActivityReportPage.getTableCellContentByIndex(1) ,{timeout:15000}).first().find('input').should('have.attr','aria-checked' , 'false')
        //Asserting Deselect Button Does not Appear 
        cy.get(ARDashboardPage.getDeselectBtn()).should('not.exist')
        
    })

})