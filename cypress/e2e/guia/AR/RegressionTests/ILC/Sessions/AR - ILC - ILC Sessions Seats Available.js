import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import { ilcDetails, sessions } from '../../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import AREnrollUsersPage from '../../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import ARILCSessionReportPage from '../../../../../../../helpers/AR/pageObjects/Reports/ARILCSessionReportPage'

describe('C7325 AUT-701, AR - ILC - ILC Sessions Seats Available T832333', function(){
    beforeEach(function() {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Create ILC with Sessions', () => {
        arDashboardPage.getCoursesReport()
        cy.createCourse('Instructor Led')

        // Set self enrollment = all learners
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        // Edit session Max Class Size 3
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)

        // Set self enrollment = all learners
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()

        //Enter valid max class size
        cy.get(ARILCAddEditPage.getMaximumClassSizeTxtF()).clear().type('3')

        // Save session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.intercept('**/sessions/report').as(`getSession`).wait(`@getSession`)

        // add another session Class Size 1
        ARILCAddEditPage.getAddSession(sessions.sessionName_1, ARILCAddEditPage.getFutureDate(2))
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).type(`${ilcDetails.sessionDescription}`)

        // Set self enrollment = all learners
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()

        //Enter valid max class
        cy.get(ARILCAddEditPage.getMaximumClassSizeTxtF()).clear().type('1')

        // Save Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()

        // add another session Class Size blank
        ARILCAddEditPage.getAddSession(sessions.sessionName_2, ARILCAddEditPage.getFutureDate(2))
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).type(`${ilcDetails.sessionDescription}`)

        // Set self enrollment = all learners
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()

        // Save Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()

        // add another session Class Size 0
        ARILCAddEditPage.getAddSession(sessions.sessionName_3, ARILCAddEditPage.getFutureDate(2))
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).type(`${ilcDetails.sessionDescription}`)

        // Set self enrollment = all learners
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()

        // Enter valid max class
        cy.get(ARILCAddEditPage.getMaximumClassSizeTxtF()).clear().type('0')

        // Save Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()

        // Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
    })

    it('Enroll user on ILC and Sessions also Verify available seats', () => {
        arDashboardPage.getCoursesReport()
        cy.wrap(arDashboardPage.AddFilter('Name', 'Contains', ilcDetails.courseName))
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(arDashboardPage.getTableCellName(2)).contains(ilcDetails.courseName).click()
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Enroll User'), 2000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Enroll User')).click()
        cy.get(AREnrollUsersPage.getEnrollUsersDDown()).click()
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF()).type(users.learner01.learner_01_username)
        AREnrollUsersPage.getEnrollUsersOpt(users.learner01.learner_01_username)
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF()).clear()
        cy.get(AREnrollUsersPage.getUsersHeader()).contains('Users').click() // hide users ddown

        // Verify how many sits are available
        // verify available sits don't exceed max class size
        AREnrollUsersPage.checkSessionsAvailableSeats(ilcDetails.courseName, ilcDetails.sessionName, 3)
        AREnrollUsersPage.checkSessionsAvailableSeats(ilcDetails.courseName, sessions.sessionName_1, 1)

        // Verify unlimited seats message if the max size is blank or 0
        AREnrollUsersPage.checkSessionsAvailableSeats(ilcDetails.courseName, sessions.sessionName_2)
        AREnrollUsersPage.checkSessionsAvailableSeats(ilcDetails.courseName, sessions.sessionName_3)

        // Select Session
        AREnrollUsersPage.getSelectILCSessionWithinCourse(ilcDetails.courseName, ilcDetails.sessionName)

        //Save enrollment
        cy.wrap(AREnrollUsersPage.WaitForElementStateToChange(AREnrollUsersPage.getSaveBtn(), AREnrollUsersPage.getShortWait()))
        cy.get(AREnrollUsersPage.getSaveBtn()).click()
        cy.get(AREnrollUsersPage.getToastSuccessMsg(), { timeout: 20000 }).should('be.visible')
    })

    it('Verify number of enrollments is deducted from the Max Class Size', () => {
        arDashboardPage.getCoursesReport()
        cy.wrap(arDashboardPage.AddFilter('Name', 'Contains', ilcDetails.courseName))
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(arDashboardPage.getTableCellName(2)).contains(ilcDetails.courseName).click()
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Enroll User'), 2000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Enroll User')).click()
        cy.get(AREnrollUsersPage.getEnrollUsersDDown()).click()
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF()).type(users.learner01.learner_01_username)
        AREnrollUsersPage.getEnrollUsersOpt(users.learner01.learner_01_username)
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF()).clear()
        cy.get(AREnrollUsersPage.getUsersHeader()).contains('Users').click() // hide users ddown

        // Verify how many sits are available
        // verify available sits don't exceed max class size
        AREnrollUsersPage.checkSessionsAvailableSeats(ilcDetails.courseName, ilcDetails.sessionName, 2)

        // Verify warning that they are exceeding the number of seats available 
        cy.get(AREnrollUsersPage.getEnrollUsersDDown()).click()
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF()).type(users.learner02.learner_02_username)
        AREnrollUsersPage.getEnrollUsersOpt(users.learner02.learner_02_username)
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF()).clear()
        cy.get(AREnrollUsersPage.getUsersHeader()).contains('Users').click() // hide users ddown

        // Select Session
        AREnrollUsersPage.getSelectILCSessionWithinCourse(ilcDetails.courseName, sessions.sessionName_1)

        // Verify message
        cy.get(AREnrollUsersPage.getExceedAvailableSeatsWarningTxt()).should('have.text', AREnrollUsersPage.getExceedAvailableSeatsWarningMsg())

        // Verify ability for the Admin to override this warning and continue with the enrollment still apply        cy.wrap(AREnrollUsersPage.WaitForElementStateToChange(AREnrollUsersPage.getSaveBtn(), AREnrollUsersPage.getShortWait()))
        cy.get(AREnrollUsersPage.getSaveBtn()).click()
        cy.get(AREnrollUsersPage.getToastSuccessMsg(), { timeout: 20000 }).should('be.visible')
    })

    it('Verify Admin display an updated number of seats available', () => {
        arDashboardPage.getCoursesReport()
        cy.wrap(arDashboardPage.AddFilter('Name', 'Contains', ilcDetails.courseName))
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(arDashboardPage.getTableCellName(2)).contains(ilcDetails.courseName).click()
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Enroll User'), 2000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Enroll User')).click()
        cy.get(AREnrollUsersPage.getEnrollUsersDDown()).click()
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF()).type(users.learner01.learner_01_username)
        AREnrollUsersPage.getEnrollUsersOpt(users.learner01.learner_01_username)
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF()).clear()
        cy.get(AREnrollUsersPage.getUsersHeader()).contains('Users').click() // hide users ddown
        AREnrollUsersPage.checkSessionsAvailableSeats(ilcDetails.courseName, ilcDetails.sessionName, 2)
        AREnrollUsersPage.checkSessionsAvailableSeats(ilcDetails.courseName, sessions.sessionName_1, 0)
    })

    it('ILC Sessions report display the number of seats still available in Spaces left column', () => {
        //navigate to Reprots then Certificate page
        arDashboardPage.getILCSessionsReport()

        //Click on Display column
        cy.get(ARILCSessionReportPage.getDisplayColumnsToggle()).click()

        // Click Spaces Left
        cy.get(ARILCSessionReportPage.getDisplayColumnItems()).contains('Spaces Left').click()

        cy.get(ARILCSessionReportPage.getDisplayColumnsToggle()).click()

        // filter Course
        arDashboardPage.A5AddFilter('Course', 'Starts With', ilcDetails.courseName)
        cy.get(arDashboardPage.getA5WaitSpinner()).should('not.exist')

        // filter Session
        arDashboardPage.A5AddFilter('Session', 'Equals', ilcDetails.sessionName)
        cy.get(arDashboardPage.getA5WaitSpinner()).should('not.exist')
        cy.get(arDashboardPage.getA5TableCellRecord()).find('td').last().should('have.text', 3)
    })
})