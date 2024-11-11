import ARILCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage";
import ARILCMarkUserInActivePage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCMarkUserInActivePage";
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal";
import ARILCActivityReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARILCActivityReportPage";
import ARILCSessionReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARILCSessionReportPage";
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage";
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails";
import { ilcDetails, sessions } from "../../../../../../helpers/TestData/Courses/ilc";
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails";
import { users } from "../../../../../../helpers/TestData/users/users";

describe('C6528 - Clients Not Taken Back While Marking Attendance', () => {
    let userNames = [
        userDetails.username,
        userDetails.username2,
        userDetails.username3,
        userDetails.username4,
        userDetails.username5,
    ] //test specific array

    before(() => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.createUser(void 0, userDetails.username2, ["Learner"], void 0)
        cy.createUser(void 0, userDetails.username3, ["Learner"], void 0)
        cy.createUser(void 0, userDetails.username4, ["Learner"], void 0)
        cy.createUser(void 0, userDetails.username5, ["Learner"], void 0)
    })

    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
    })

    after(() => {
        cy.deleteCourse(commonDetails.courseID, "instructor-led-courses-new")
    })

    it('Add Sessions to ILC course', () => {
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel("Courses"))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("Courses"))
        cy.intercept("/api/rest/v2/admin/reports/courses/operations").as("getCourses").wait("@getCourses")
        cy.createCourse("Instructor Led", ilcDetails.courseName, false)

        //Add Session for the future
        ARILCAddEditPage.addSessionForThePast()
        ARILCAddEditPage.addSessionForTheFuture()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })

        ARDashboardPage.getMediumWait()
        // Enroll User 
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName], userNames,  sessions.pastsessionName)
    })

    it('Mark Completion for one learner', () => {
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("ILC Sessions"))
        ARDashboardPage.getShortWait()

        ARILCSessionReportPage.A5AddFilter('Course', 'Starts With', ilcDetails.courseName)
        ARDashboardPage.getShortWait()
        ARILCSessionReportPage.A5AddFilter('Session', 'Starts With', sessions.pastsessionName)
        ARDashboardPage.getShortWait()

        ARILCSessionReportPage.selectA5TableCellRecord(sessions.pastsessionName)
        //Select Mark Attendance Button for Course Completion 
        ARILCSessionReportPage.getA5AddEditMenuActionsByNameThenClick('Mark Attendance')
        ARILCSessionReportPage.getMediumWait()

        ARILCMarkUserInActivePage.setOneLearnerPresentAbsentStatus('Present')
        ARILCMarkUserInActivePage.setOneLearnerOverallGradeStatus('Complete')
        ARDashboardPage.getShortWait()

        cy.get(ARDashboardPage.getSaveBtn()).click()
        ARDashboardPage.getMediumWait()
    })

    it('Mark Attendance for all learner then dont save', () => {
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("ILC Sessions"))
        ARDashboardPage.getShortWait()

        ARILCSessionReportPage.A5AddFilter('Course', 'Starts With', ilcDetails.courseName)
        ARDashboardPage.getShortWait()
        ARILCSessionReportPage.A5AddFilter('Session', 'Starts With', sessions.pastsessionName)
        ARDashboardPage.getShortWait()

        ARILCSessionReportPage.selectA5TableCellRecord(sessions.pastsessionName)
        //Select Mark Attendance Button for Course Completion 
        ARILCSessionReportPage.getA5AddEditMenuActionsByNameThenClick('Mark Attendance')
        ARILCSessionReportPage.getMediumWait()

        cy.get(ARILCMarkUserInActivePage.getOverallGradeStatusToggle()).click()
        ARDashboardPage.getShortWait()

        ARILCMarkUserInActivePage.setLearnerPresentAbsentStatus('Present')
        ARDashboardPage.getShortWait()

        cy.get(ARDashboardPage.getCancelBtn()).click()
        ARDashboardPage.getShortWait()

        cy.get(ARDeleteModal.getARDeleteBtn()).click()
        ARDashboardPage.getMediumWait()
    })

    it('Mark Attendance for all learner then Cancel then Save', () => {
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("ILC Sessions"))
        ARDashboardPage.getShortWait()

        ARILCSessionReportPage.A5AddFilter('Course', 'Starts With', ilcDetails.courseName)
        ARDashboardPage.getShortWait()
        ARILCSessionReportPage.A5AddFilter('Session', 'Starts With', sessions.pastsessionName)
        ARDashboardPage.getShortWait()

        ARILCSessionReportPage.selectA5TableCellRecord(sessions.pastsessionName)
        //Select Mark Attendance Button for Course Completion 
        ARILCSessionReportPage.getA5AddEditMenuActionsByNameThenClick('Mark Attendance')
        ARILCSessionReportPage.getMediumWait()

        cy.get(ARILCMarkUserInActivePage.getOverallGradeStatusToggle()).click()
        ARDashboardPage.getShortWait()

        ARILCMarkUserInActivePage.setLearnerPresentAbsentStatus('Present')
        ARDashboardPage.getShortWait()

        cy.get(ARDashboardPage.getCancelBtn()).click()
        ARDashboardPage.getShortWait()

        cy.get(ARDeleteModal.getPromptFooter()).find(ARDashboardPage.getCancelBtn()).click()
        ARDashboardPage.getShortWait()

        cy.get(ARDashboardPage.getSaveBtn()).click()
        ARDashboardPage.getMediumWait()        
    })

    it('ILC Activity - Mark and save the attendance of a single learner', () => {
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('ILC Activity'))
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'ILC Activity')

        //Choose Course In ILC Activity 
        ARILCActivityReportPage.courseFilter(ilcDetails.courseName)
        ARDashboardPage.getShortWait()

        // Filter User name 
        ARDashboardPage.AddFilter('Username', 'Starts With', userDetails.username)
        ARDashboardPage.getShortWait()
        
        // Select Session
        ARDashboardPage.selectA5TableCellRecord(sessions.pastsessionName)
        ARDashboardPage.getMediumWait()

        // Navigate to Mark Attendence
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Mark Attendance')).click()
        ARDashboardPage.getMediumWait()

        ARILCMarkUserInActivePage.setOneLearnerPresentAbsentStatus('Absent', 2)
        ARILCMarkUserInActivePage.setOneLearnerOverallGradeStatus('Absent', 3) // for same learner 1 difference
        ARDashboardPage.getShortWait()

        cy.get(ARDashboardPage.getSaveBtn()).click()
        ARDashboardPage.getMediumWait()
    })

    it('Mark the attendance of multiple learners and click on cancel=>dont save', () => {
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('ILC Activity'))
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'ILC Activity')

        //Choose Course In ILC Activity 
        ARILCActivityReportPage.courseFilter(ilcDetails.courseName)
        ARDashboardPage.getShortWait()

        // Filter User name 
        ARDashboardPage.AddFilter('Username', 'Starts With', userDetails.username)
        ARDashboardPage.getShortWait()
        
        // Select Session
        ARDashboardPage.selectA5TableCellRecord(sessions.pastsessionName)
        ARDashboardPage.getMediumWait()

        // Navigate to Mark Attendence
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Mark Attendance')).click()
        ARDashboardPage.getMediumWait()

        cy.get(ARILCMarkUserInActivePage.getOverallGradeStatusToggle()).click()
        ARDashboardPage.getShortWait()

        ARILCMarkUserInActivePage.setLearnerPresentAbsentStatus('Present')
        ARDashboardPage.getShortWait()

        cy.get(ARDashboardPage.getCancelBtn()).click()
        ARDashboardPage.getShortWait()

        cy.get(ARDeleteModal.getARDeleteBtn()).click()
        ARDashboardPage.getMediumWait()
    })

    it('Mark the attendance of multiple learners and click on cancel=>save', () => {
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('ILC Activity'))
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', 'ILC Activity')

        //Choose Course In ILC Activity 
        ARILCActivityReportPage.courseFilter(ilcDetails.courseName)
        ARDashboardPage.getShortWait()

        // Filter User name 
        ARDashboardPage.AddFilter('Username', 'Starts With', userDetails.username)
        ARDashboardPage.getShortWait()
        
        // Select Session
        ARDashboardPage.selectA5TableCellRecord(sessions.pastsessionName)
        ARDashboardPage.getMediumWait()

        // Navigate to Mark Attendence
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Mark Attendance')).click()
        ARDashboardPage.getMediumWait()
        
        cy.get(ARILCMarkUserInActivePage.getOverallGradeStatusToggle()).click()
        ARDashboardPage.getShortWait()

        ARILCMarkUserInActivePage.setLearnerPresentAbsentStatus('Present')
        ARDashboardPage.getShortWait()

        cy.get(ARDashboardPage.getCancelBtn()).click()
        ARDashboardPage.getShortWait()

        cy.get(ARDeleteModal.getPromptFooter()).find(ARDashboardPage.getCancelBtn()).click()
        ARDashboardPage.getShortWait()

        cy.get(ARDashboardPage.getSaveBtn()).click()
        ARDashboardPage.getMediumWait()    
    })

    it('Delete Users', () => {
        ARDashboardPage.deleteUsers(userNames)
    })
})