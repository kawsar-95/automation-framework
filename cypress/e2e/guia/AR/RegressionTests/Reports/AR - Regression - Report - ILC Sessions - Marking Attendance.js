import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARILCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage"
import ARILCMarkUserInActivePage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCMarkUserInActivePage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsCompletionModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import ARUploadFileModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal"
import ARILCSessionReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARILCSessionReportPage"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { ilcDetails, sessions } from "../../../../../../helpers/TestData/Courses/ilc"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C6527 - When Marking Attendance For An ILC Session, Credits Are Not Saving', () => {
    before(() => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0);
        cy.createUser(void 0, userDetails.username2, ["Learner"], void 0);

    })
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })
    after(() => {
        cy.deleteCourse(commonDetails.courseID, "instructor-led-courses-new");
        cy.visit('/admin')
        ARDashboardPage.getLongWait()
        //Click on users
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Users')).click()
        //Click on users
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
        ARDashboardPage.getMediumWait()
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        ARDashboardPage.getMediumWait()
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username2)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        cy.get(ARDashboardPage.getGridTable()).eq(1).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete Users')).click()
        ARDashboardPage.getShortWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        ARDashboardPage.getMediumWait()
    })
    it('Create ILC Course', () => {
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        cy.intercept("/api/rest/v2/admin/reports/courses/operations")
            .as("getCourses")
            .wait("@getCourses")
        cy.createCourse("Instructor Led", ilcDetails.courseName, false)
        cy.get(ARILCAddEditPage.getAddSessionBtn()).click()
        //Set future title
        cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false')
            .clear()
            .type(sessions.futuresessionName)
        ARILCAddEditPage.getStartDatePickerBtnThenClick()
        ARILCAddEditPage.getSelectDate(sessions.date1)
        ARILCAddEditPage.getEndDatePickerBtnThenClick()
        ARILCAddEditPage.getSelectDate(sessions.date1)

        cy.get(ARILCAddEditPage.getEndDateTimeBtn()).click()
        ARILCAddEditPage.SelectTime("03", "00", "PM")
        cy.get(ARILCAddEditPage.getDateTimeLabel())
            .contains("Class End Date and Time")
            .click(); //hide timepicker

        //Set Timezone
        cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneTxtF())
            .first()
            .type("(UTC+06:00) Dhaka")
        cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneDDownOpt())
            .contains("(UTC+06:00) Dhaka")
            .click()
        //Save ILC Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click({ force: true })
        ARILCAddEditPage.getMediumWait()

        //Select Allow Self Enrollment Specific Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn(
            "All Learners"
        );
        //Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
        ARDashboardPage.getLongWait()
    })
    it('Enroll Users to course', () => {
        ARDashboardPage.getMediumWait()
        //Click on Users
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        //Click on Users
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('ILC Sessions'))
        ARDashboardPage.getMediumWait()
        ARDashboardPage.A5AddFilter('Course', 'Starts With', ilcDetails.courseName)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(3)).should('contain', 'Enroll Users')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(3)).click()
        ARDashboardPage.getMediumWait()

        cy.get(AREnrollUsersPage.getUserEnrollDDown()).click()
        ARDashboardPage.getMediumWait()
        cy.get(AREnrollUsersPage.getUserEnrollDDown()).eq(0).within(() => {
            cy.get(AREnrollUsersPage.getEnrollUserTxtF()).type(userDetails.username, { force: true })
            ARDashboardPage.getMediumWait()

        })
        cy.get(AREnrollUsersPage.getUserEnrollListItem()).eq(0).click()
        // cy.get(AREnrollUsersPage.getEnrollUserTxtF()).type(userDetails.username2)
        ARDashboardPage.getMediumWait()
        cy.get(AREnrollUsersPage.getUserEnrollDDown()).eq(0).within(() => {
            cy.get(AREnrollUsersPage.getEnrollUserTxtF()).type(userDetails.username2, { force: true })
            ARDashboardPage.getMediumWait()

        })
        cy.get(AREnrollUsersPage.getUserEnrollListItem()).eq(0).click()
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click()

        ARDashboardPage.getMediumWait()

    })
    it('ILC Session', () => {
        ARDashboardPage.getMediumWait()
        // Click on reports
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        // Click on ILC sessions
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('ILC Sessions'))
        ARDashboardPage.getMediumWait()
        // Select any ILC session which have multiple user enrolled
        ARDashboardPage.A5AddFilter('Course', 'Starts With', ilcDetails.courseName)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).click()
        ARDashboardPage.getMediumWait()
        //Action buttons display
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).should('contain', 'Mark Attendance')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).should('contain', 'Manage Grades & Attendance')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(3)).should('contain', 'View Waitlist')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(4)).should('contain', 'Enroll Users')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(5)).should('contain', 'Message Instructor')

        // Click on Mark Attendance button
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click({ force: true })
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should('contain', 'Mark Attendance')
        // Mark completed for all users and enter Score & Credits.
        cy.get(ARILCMarkUserInActivePage.getCheckBoxForLearner()).click();
        cy.get(ARDashboardPage.getGridTable()).eq(1).within(() => {
            cy.get(ARILCMarkUserInActivePage.getScoreCreditTxtF()).eq(0).clear().type('60')
            cy.get(ARILCMarkUserInActivePage.getScoreCreditTxtF()).eq(1).clear().type('3')
        })
        // Click on save
        cy.get(ARILCSessionReportPage.getA5SaveBtn()).click()
        ARDashboardPage.getLongWait()




    })
})