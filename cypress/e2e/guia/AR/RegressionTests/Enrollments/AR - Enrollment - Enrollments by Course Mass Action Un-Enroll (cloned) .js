import ARAddEditCategoryPage from "../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARUserUnEnrollModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUserUnEnrollModal"
import ARCourseActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseActivityReportPage"
import ARCourseEnrollmentReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseEnrollmentReportPage"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import ARUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"




describe("C969 -  AR - Enrollment - Enrollments by Course Mass Action Un-Enroll (cloned)", () => {

    before("",()=>{
        //create a new user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.createUser(void 0, userDetails.username2, ["Learner"], void 0)
        cy.createUser(void 0, userDetails.username3, ["Learner"], void 0)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Create a course to enroll in
        ARDashboardPage.getCoursesReport()
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([courses.oc_filter_02_name], [userDetails.username,userDetails.username2,userDetails.username3])
    })

    after('Delete Course and User as part of clean-up', () => {
        // Delete User
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getUsersReport()
        cy.wrap(ARUserPage.AddFilter('Username', 'Equals', userDetails.username))
        cy.wrap(ARUserPage.selectTableCellRecordByIndexAndName(userDetails.username,4))
        cy.wrap(ARUserPage.WaitForElementStateToChange(ARUserPage.getAddEditMenuActionsByName('Delete'), AREnrollUsersPage.getShortWait()))
        cy.get(ARUserPage.getAddEditMenuActionsByName('Delete')).click()
        cy.wrap(ARUserPage.WaitForElementStateToChange(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn()), AREnrollUsersPage.getLShortWait()))
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        cy.get(ARUserPage.getNoResultMsg()).contains('No results found.').should('exist')
    })
    beforeEach("Prerequisite", () => {
        //Login into the admin side 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        // Goto Course Enrollments menu
        ARDashboardPage.getCourseEnrollmentReport()
    })
    it("Admin can select multiple lines in Course Enrollments Report and The Un-enroll Mass Action tool is Available and clicking Delete Button", () => {
        //Clicking on Course Choose button
        ARCoursesPage.EnrollmentPageFilter(courses.oc_filter_02_name)
        ARCoursesPage.AddFilter('Username','Equals',userDetails.username)
        //Selecting first row from table
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        //waiting for element to appear
        cy.wrap(ARUserPage.WaitForElementStateToChange(ARUserPage.getAddEditMenuActionsByName('Un-enroll User'), AREnrollUsersPage.getShortWait()))
        //Asserting Un-enroll User Button
        cy.get(ARUserPage.getAddEditMenuActionsByName('Un-enroll User')).should('exist')
        //Clicking on Un enroll User button
        cy.get(ARUserPage.getAddEditMenuActionsByName('Un-enroll User')).should('have.attr','aria-disabled','false').click()
        var leng = 0;
        cy.get(ARDashboardPage.getTableCellContentByIndex()).its('length').then(parseInt).then((n) => {
            leng = n;
            expect(leng).to.be.gt(0)
            //Asserting Modal
            cy.get(ARDashboardPage.getElementByDataNameAttribute("prompt-header")).should('have.text', 'Un-enroll')
            //Clicking on Ok button  
            cy.wrap(ARUserPage.WaitForElementStateToChange(ARUserUnEnrollModal.getOKBtn(), AREnrollUsersPage.getShortWait()))
            cy.get(ARUserUnEnrollModal.getCancelBtn()).click()
            //Asserting Value of Table
            cy.get(ARDashboardPage.getTableCellContentByIndex()).should('have.length', leng)
        })

    })



    it("Admin can select multiple lines in Course Enrollments Report and The Un-enroll Mass Action tool is Available and clicking Ok Button", function () {
        //Clicking on Course Choose button
        ARCoursesPage.EnrollmentPageFilter(courses.oc_filter_02_name)
        ARCoursesPage.AddFilter('Username','Equals',userDetails.username2)
        ARCoursesPage.AddFilter('Username','Equals',userDetails.username3)
        //Selecting first row from table
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        cy.get(ARDashboardPage.getGridTable()).eq(1).click()
        cy.wrap(ARUserPage.WaitForElementStateToChange(ARUserPage.getAddEditMenuActionsByName('Un-enroll Users'), AREnrollUsersPage.getShortWait()))
        //Asserting Un-enroll User Button
        cy.get(ARUserPage.getAddEditMenuActionsByName('Un-enroll Users')).should('exist')
        //Clicking on Un enroll User button
        cy.get(ARUserPage.getAddEditMenuActionsByName('Un-enroll Users')).should('have.attr','aria-disabled','false').click()
        var leng = 0;
        cy.get(ARDashboardPage.getTableCellContentByIndex()).its('length').then(parseInt).then((n) => {
            leng = n;
            expect(leng).to.be.gt(0)
            //Asserting Modal
            cy.get(ARDashboardPage.getElementByDataNameAttribute("prompt-header")).should('have.text', 'Un-enroll')
            //Clicking on Ok button  
            cy.wrap(ARUserPage.WaitForElementStateToChange(ARUserUnEnrollModal.getOKBtn(), AREnrollUsersPage.getShortWait()))
            cy.get(ARUserUnEnrollModal.getOKBtn()).click()
            //Veryfying Toast Message 
            cy.get(ARDashboardPage.getToastNotificationMsg()).should('contain', 'Unenroll Successful')
        })


    })
})