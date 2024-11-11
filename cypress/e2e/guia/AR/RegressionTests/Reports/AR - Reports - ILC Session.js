import venues from '../../../../../fixtures/venues.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails, sessions } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { reports } from '../../../../../../helpers/TestData/Reports/reports'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import arILCSessionReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARILCSessionReportPage'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import { credit } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import defaultTestData from '../../../../../fixtures/defaultTestData.json'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARILCActivityReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARILCActivityReportPage'
import ARAddEditCategoryPage from '../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage'



describe('AR - ILC - Create Course ,Add Session & publish Course and filter the saved data in ILC Session Report', function () {

    var i = 0;
    let SearchData = [`${ilcDetails.courseName}`, `${sessions.sessionName_1}`, `${users.instructorLogInOut.instructor_loginout_fname}`, `${venues.VENUE_01_NAME}`, `${reports.time_Zone_Name}`]; //test specific array
    let SearchDetails = [`Course`, `Session`, `Instructor`, `Venue`, `Time Zone Name`];

    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })
    after(function () {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')

        //Delete user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser');
        cy.wrap(arUserPage.AddFilter('Username', 'Equals', userDetails.username))
        cy.wrap(arUserPage.selectTableCellRecord(userDetails.username))
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Delete'), arEnrollUsersPage.getShortWait()))
        cy.get(arUserPage.getAddEditMenuActionsByName('Delete')).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn()), arEnrollUsersPage.getLShortWait()))
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click().wait('@getUser')
        cy.get(arUserPage.getNoResultMsg()).contains('No results found.').should('exist')
    })
    it('Create new ILC course with Add session', () => {

        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        

        cy.createCourse('Instructor Led', ilcDetails.courseName, false)

        //Open Enrollment Rules
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()

        //Select Allow Self Enrollment Specific Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Add Session
        cy.get(ARILCAddEditPage.getAddSessionBtn()).click({ timeout: 5000 })
        //Set Valid Title
        ARILCAddEditPage.getMediumWait()
        cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false').clear().type(sessions.sessionName_1)

        //Select an Instructor
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDown()).click()

        cy.get(arCoursesPage.getInstructorfromlist())
            .type(users.instructorLogInOut.instructor_loginout_fname + ' ' + users.instructorLogInOut.instructor_loginout_lname)
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDownOpt()).contains(users.instructorLogInOut.instructor_loginout_fname).click()
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).click()

        //Select a Venue
        cy.get(ARILCAddEditPage.getSessionDetailsVenuesDDown()).click({ force: true })
        cy.get(arCoursesPage.getVenuefromlist())
            .type(venues.VENUE_01_NAME)
        cy.get(ARILCAddEditPage.getSessionDetailsVenuesDDownOpt()).contains(venues.VENUE_01_NAME).click()
        ARILCAddEditPage.getFutureDate(2)

        //Expand Self Enrollment and Add Self Enrollment Rule
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()

        //Save ILC Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getLShortWait()

        //Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
        //Enroll Leaner in already created course
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName], [userDetails.username], sessions.sessionName_1)
    })
    it("Filter the saved course data in ILC Session Report ", () => {
        //Select Session Report from Reports 
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        cy.wait(3000)
        cy.wrap(arDashboardPage.getMenuItemOptionByName('ILC Sessions'))

        for (i = 0; i < SearchDetails.length; i++) {
            if (i < SearchDetails.length - 1) {
                //Filter and validate data for Course Name,Session,Instrutor  ,Venue
                arILCSessionReportPage.A5AddFilter(SearchDetails[i], 'Contains', SearchData[i])
                arCoursesPage.getLShortWait()
                cy.get(arILCSessionReportPage.getA5TableCellRecordByColumn(2 + parseInt([i]))).contains(SearchData[i]).should('be.visible')
                cy.get(arILCSessionReportPage.getElementByTitleAttribute(arILCSessionReportPage.getRemoveBtn())).scrollIntoView()
                cy.get(arILCSessionReportPage.getElementByTitleAttribute(arILCSessionReportPage.getRemoveBtn())).should('be.visible').click()
            } else if (i == SearchDetails.length - 1) {
                //Filter and validate data timezone
                arILCSessionReportPage.A5AddFilter(SearchDetails[i], 'Equals', SearchData[i])
                arCoursesPage.getLShortWait()
                cy.get(arILCSessionReportPage.getA5TableCellRecordByColumn(4 + parseInt([i]))).should('contain', SearchData[i])
                cy.get(arILCSessionReportPage.getElementByTitleAttribute(arILCSessionReportPage.getRemoveBtn())).scrollIntoView()
                cy.get(arILCSessionReportPage.getElementByTitleAttribute(arILCSessionReportPage.getRemoveBtn())).should('be.visible').click()
            }
        }
        arILCSessionReportPage.A5AddFilter(SearchDetails[0], 'Contains', SearchData[0])
        arCoursesPage.getShortWait()
        cy.get(arILCSessionReportPage.getA5TableCellRecordByColumn(2 + parseInt([0]))).contains(SearchData[0]).click()
        //Validate Action Button available with levels
        arILCSessionReportPage.getRightActionMenuLabel()

        //Select Deselect Button for uncheck check box 
        arILCSessionReportPage.getA5AddEditMenuActionsByNameThenClick('Deselect')

        //Select check box for selecting Manage Grades & Attendance Button
        cy.get(arILCSessionReportPage.getA5TableCellRecordByColumn(2 + parseInt([0]))).contains(SearchData[0]).click()
        arILCSessionReportPage.getA5AddEditMenuActionsByNameThenClick('Manage Grades & Attendance')
        arILCSessionReportPage.getLShortWait()

        //Select Mark Attendance Button
        arILCSessionReportPage.getA5AddEditMenuActionsByNameThenClick('Mark Attendance')
        arILCSessionReportPage.getLShortWait()
        //validate first name 
        cy.get(arILCSessionReportPage.getLearnerNameTxtF()).should(`contain`, defaultTestData.USER_LEARNER_FNAME)
        //Select leaner course completion check box 
        cy.get(arILCSessionReportPage.selectLearnerCompleteCheckBox()).eq(0).click()
        //Enter Credit against learner course completion section
        cy.get(arILCSessionReportPage.getCreditTxtF()).type(credit.credit2)

        //Save Mark Attendance Details
        cy.get(ARAddEditCategoryPage.getCoursesRightActionMenuContainer()).contains('Save').click()
        arILCSessionReportPage.getLShortWait()

        //Filter and select user filter data 
        arILCSessionReportPage.A5AddFilter(`Username`, 'Contains', userDetails.username)
        arILCSessionReportPage.getLShortWait()
        cy.get(arILCSessionReportPage.getA5TableCellRecordByColumn(4)).contains(userDetails.username).click()
        arILCSessionReportPage.getShortWait()

        //Select User Transcript btn
        arILCSessionReportPage.getA5AddEditMenuActionsByNameThenClick('User Transcript')
        cy.intercept('/api/rest/v2/admin/reports/user-enrollments').as('getUserEnrollment').wait('@getUserEnrollment')
        //Validate Updated Credit and Score value
        cy.get(arILCSessionReportPage.getGridTable()).should(`contain`, ilcDetails.courseName).and(`contain`, reports.score)
        cy.get(arILCSessionReportPage.getBackIconBtn()).click()
        arILCSessionReportPage.getLShortWait()

        //Select the deselect button for Mark attendance btn selection
        arILCSessionReportPage.getA5AddEditMenuActionsByNameThenClick('Deselect')
        arILCSessionReportPage.getA5AddEditMenuActionsByNameThenClick('Mark Attendance')
    })
})