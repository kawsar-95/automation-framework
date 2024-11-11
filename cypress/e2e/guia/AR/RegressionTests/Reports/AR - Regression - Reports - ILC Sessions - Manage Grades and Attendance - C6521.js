


import ARManageCategoryPage from "../../../../../../helpers/AR/pageObjects/Category/ARManageCategoryPage";
import ARILCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage";
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module";
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module";
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import AREditActivityPage from "../../../../../../helpers/AR/pageObjects/Enrollment/AREditActivityPage";
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal";
import ARCourseEvaluationReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARCourseEvaluationReportPage";
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage";
import ARUserEnrollmentPage from "../../../../../../helpers/AR/pageObjects/User/ARUserEnrollmentPage";
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails";
import { ilcDetails, sessions } from "../../../../../../helpers/TestData/Courses/ilc";
import { reports } from "../../../../../../helpers/TestData/Reports/reports";
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails";
import { users } from "../../../../../../helpers/TestData/users/users";

describe('C6521 - ILC Session - Manage Grades and Attendance - Enrollment', () => {
    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })

    after(function () {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')

        //Delete user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getVLongWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser');
        cy.wrap(ARDashboardPage.AddFilter('Username', 'Equals', userDetails.username))
        cy.wrap(ARDashboardPage.selectTableCellRecord(userDetails.username))
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Delete'), ARDashboardPage.getShortWait()))
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete')).click()
        cy.wrap(ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn()), ARDashboardPage.getLShortWait()))
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click().wait('@getUser')
        cy.get(ARDashboardPage.getNoResultMsg()).contains('No results found.').should('exist')
    })

    it('Create ILC Course ,Add session & Publish Course ', () => {

        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        

        cy.createCourse('Instructor Led', ilcDetails.courseName, false)

        //Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARDashboardPage.getMediumWait()

        //Select Allow Self Enrollment Specific Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Add Session
        cy.get(ARILCAddEditPage.getAddSessionBtn()).click({ timeout: 5000 })
        //Set Valid Title
        cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false').clear().type(sessions.sessionName_1)
        ARILCAddEditPage.getFutureDate(2)

        //Expand Self Enrollment and Add Self Enrollment Rule
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()

        //Save ILC Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARDashboardPage.getLShortWait()

        //Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
    })
    it('should enroll a learner to an ILC Course', function () {

        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        

        //Enroll Leaner in already created course
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName], [userDetails.username], sessions.sessionName_1)
        ARDashboardPage.getVLongWait()

    })
    it('ILC Session - Manage Grades and Attendance', () => {
        //Navigate to ILC Session
        ARDashboardPage.getLongWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Reports')).click()
        // Click on ILC Sessions button
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('ILC Sessions'))
        ARDashboardPage.getLongWait()
        ARDashboardPage.A5AddFilter('Course', 'Contains', ilcDetails.courseName)
        ARDashboardPage.getLongWait()
        // Select any Existing  Session 
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        // Verify that [Manage Grades and Attendance"] button has been added to ILC Sessions page
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).should('contain', 'Manage Grades & Attendance')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).click()
        ARDashboardPage.getLongWait()
        // Select Any exciting  User 
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        // Verify that [Enrollments] button has been added to ILC Session - Grades page
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(5)).should('contain', 'Enrollments')
        // Verify that on Clicking "Enrollments" button User Enrollments page will open
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(5)).click()
        ARDashboardPage.getLongWait()
        cy.get(ARUserEnrollmentPage.getPageHeader()).should('contain', 'User Enrollments')
        ARDashboardPage.getShortWait()
        //Now again Navigate  to the left panel and click on the Reports Icon
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Reports')).click()
        ARDashboardPage.getShortWait()
        // Click on ILC Activity  button
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('ILC Activity'))
        ARDashboardPage.getLongWait()
        // Select a ILC and a session that has users enrolled 
        ARCourseEvaluationReportPage.AddFilter(ilcDetails.courseName)
        ARDashboardPage.getLongWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        // verify that ‘View Enrollments’  button has been added on ILC Activity Page
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(6)).should('contain', 'View Enrollments')
        // Verify that on Clicking "View Enrollments" button User Enrollments page will open
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(6)).click()
        ARDashboardPage.getLongWait()
        cy.get(ARUserEnrollmentPage.getPageHeader()).should('contain', 'User Enrollments')


    })
})