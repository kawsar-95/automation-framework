import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARUserUnEnrollModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUserUnEnrollModal"
import ARCourseActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseActivityReportPage"
import ARCourseEnrollmentReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseEnrollmentReportPage"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import ARUserPage from "../../../../../../helpers/AR/pageObjects/User/ARUserPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"


describe("C868 - AUT - 289 - AR - Enrollment - Enrollments by Course Mass Action Un-Enroll (cloned)", () => {

    before("",()=>{
        //create a new user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        //Longin into admin side
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Go to Courses Report Page
        ARDashboardPage.getCoursesReport()
        //Enroll the user to oc_filter_02_name Course
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([courses.oc_filter_02_name], [userDetails.username])
    })

    after('Delete Course and User as part of clean-up', () => {
        // Delete User
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })
    beforeEach("Prerequisite", () => {
        //Login into the admin side 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        //Go to Course Enrollment page
        ARDashboardPage.getCourseEnrollmentReport()
        cy.get(ARCourseEnrollmentReportPage.getPageHeader() , {timeout:15000}).should('have.text', 'Course Enrollments')
    })
    it("Admin can select multiple lines in Course Enrollments Report and The Un-enroll Mass Action tool is Available and clicking Delete Button", () => {
        //Clicking on Course Choose button
        cy.get(ARCourseEnrollmentReportPage.getFilterItem()).click({ force: true })
        //Selecting Course in Choose Course 
        ARCourseActivityReportPage.ChooseAddFilter(courses.oc_filter_02_name)
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout: 15000}).should('not.exist')

        ARCourseEnrollmentReportPage.ChooseAddIsEnrolledFilter()
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout: 15000}).should('not.exist')
        
        //Selecting first row from table
        cy.get(ARDashboardPage.getTableCellContentByIndex(4)).contains(userDetails.username).click()
        
        //waiting for element to appear
        cy.wrap(ARUserPage.WaitForElementStateToChange(ARUserPage.getAddEditMenuActionsByName('Un-enroll User'), AREnrollUsersPage.getShortWait()))
        
        //Asserting Un-enroll User Button
        
        cy.get(ARUserPage.getAddEditMenuActionsByName('Un-enroll User')).should('exist')
        
        //Clicking on Un enroll User button
        cy.get(ARUserPage.getAddEditMenuActionsByName('Un-enroll User')).should('exist').click()
        var leng = 0;
        cy.get(ARDashboardPage.getTableCellContentByIndex()).its('length').then(parseInt).then((n) => {
            leng = n;
            expect(leng).to.be.gt(0)
            //Asserting Modal
            cy.get(ARDeleteModal.getModalHeader()).should('have.text', 'Un-enroll')
            //Clicking on Ok button  
            cy.wrap(ARUserPage.WaitForElementStateToChange(ARUserUnEnrollModal.getOKBtn(), AREnrollUsersPage.getShortWait()))
            cy.get(ARUserUnEnrollModal.getCancelBtn()).click()
            //Asserting Value of Table
            cy.get(ARDashboardPage.getTableCellContentByIndex()).should('have.length', leng)
        })

    })



    it("Admin can select multiple lines in Course Enrollments Report and The Un-enroll Mass Action tool is Available and clicking Ok Button", function () {
        //Clicking on Course Choose button
        cy.get(ARCourseEnrollmentReportPage.getFilterItem()).click({ force: true })
        //Selecting Course in Choose Course 
        ARCourseActivityReportPage.ChooseAddFilter(courses.oc_filter_02_name)
        

        ARCourseEnrollmentReportPage.ChooseAddIsEnrolledFilter()
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout: 15000}).should('not.exist')

        //Selecting first row from table
        cy.get(ARDashboardPage.getTableCellContentByIndex(4)).contains(userDetails.username).click()
        cy.wrap(ARUserPage.WaitForElementStateToChange(ARUserPage.getAddEditMenuActionsByName('Un-enroll User'), AREnrollUsersPage.getShortWait()))
        //Asserting Un-enroll User Button
        cy.get(ARUserPage.getAddEditMenuActionsByName('Un-enroll User')).should('exist')
        //Clicking on Un enroll User button
        cy.get(ARUserPage.getAddEditMenuActionsByName('Un-enroll User')).should('exist').click()
        var leng = 0;
        cy.get(ARDashboardPage.getTableCellContentByIndex()).its('length').then(parseInt).then((n) => {
            leng = n;
            expect(leng).to.be.gt(0)
            //Asserting Modal
            cy.get(ARDeleteModal.getModalHeader()).should('have.text', 'Un-enroll')
            //Clicking on Ok button  
            cy.wrap(ARUserPage.WaitForElementStateToChange(ARUserUnEnrollModal.getOKBtn(), AREnrollUsersPage.getShortWait()))
            cy.get(ARUserUnEnrollModal.getOKBtn()).click()
            //Veryfying Toast Message 
            cy.get(ARDashboardPage.getToastNotificationMsg()).should('contain', 'User has been un-enrolled.')
            //Asserting Value has decreased by 1
            cy.get(ARDashboardPage.getTableCellContentByIndex()).should('have.length', leng - 1)
        })


    })
})