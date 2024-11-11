import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LECourseDetailsILCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsILCModule'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { ilcDetails, sessions } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import LECollaborationsActivityPage from '../../../../../../helpers/LE/pageObjects/Collaborations/LECollaborationsActivityPage'

describe('LE - Course Activity - Select ILC Session Using Calendar and Details View - Admin Side', function(){

    before(function() {
        //Create a new user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
    })

    it('Admin - Create New ILC Course and Add Session', () => { 
        //Create course with session
        cy.createCourse('Instructor Led')

        //Edit created session and set self enrollment = All Learners
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()
        //Save session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.get(arDashboardPage.getModal()).should('not.exist')

        //Create second future session 4 months away
        ARILCAddEditPage.getAddSession(sessions.sessionName_Future, ARILCAddEditPage.getFutureDate(4, 'month'))
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.get(arDashboardPage.getModal()).should('not.exist')

        //Publish course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
    })

    it('Admin - Enroll User in New ILC Course & Session', () => { 
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName], [userDetails.username], ilcDetails.sessionName)
    })
})

describe('LE - Course Activity - Select ILC Session Using Calendar and Details View', function(){

    beforeEach(() => {
        //Login and go to the ILC course before each test
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword) 
        LEDashboardPage.getTileByNameThenClick('My Courses')
        cy.get(LECollaborationsActivityPage.getPageTitle(),{timeout:15000}).should('be.visible').and('contain','My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        LEDashboardPage.getCourseCardBtnThenClick(ilcDetails.courseName)
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
        //Cleanup - Get userID, logout, and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Verify Learner can Cancel Enrolled Session', () => {
        //Verify both change and cancel session buttons are visible and cancel session
        cy.get(LECoursesPage.getElementByAriaLabelAttribute(LECourseDetailsILCModule.getChangeSessionBtn())).should('be.visible')
        cy.get(LECoursesPage.getElementByAriaLabelAttribute(LECourseDetailsILCModule.getCancelSessionBtn())).should('be.visible').click()
        cy.get(LECourseDetailsILCModule.getNoSessionEnrolledYetTitle()).should('be.visible')
    })

    it('Enroll in another Session from the Calendar View', () => { 
        //Switch to calendar view
        cy.get(LECoursesPage.getChooseViewBtn()).click()
        cy.get(LECoursesPage.getCalendarViewBtn()).click()
        //Advance to next month then click 'View Next Available Session' button 
        cy.get(LECoursesPage.getCalendarViewFwdBtn()).click()
        cy.get(LECoursesPage.getNoSessionsTxt()).should('contain', 'No Sessions Available For Month')
        LECoursesPage.getViewNextSessionBtnThenClick()
        //Enroll in the available session
        cy.get(LECourseDetailsILCModule.getSessionName()).contains(sessions.sessionName_Future).should('exist')
        cy.get(LECourseDetailsILCModule.getEnrollBtn()).click()
        cy.get(LEDashboardPage.getToastNotificationMsg()).should('be.visible')
    })

    it('Verify Learner can Change Enrolled Session', () => { 
        //Verify change session button is visible and click it
        cy.get(LECoursesPage.getElementByAriaLabelAttribute(LECourseDetailsILCModule.getChangeSessionBtn())).should('be.visible').click()
        

        //Verify you cannot enroll in the session you were already enrolled in
        cy.get(LECourseDetailsILCModule.getSessionName()).contains(new RegExp("^" + sessions.sessionName_Future + "$", "g")).parents(LECourseDetailsILCModule.getSessionContainer()).within(() => {
            cy.get(LECourseDetailsILCModule.getEnrollBtn()).should('not.contain','Enroll')
        })

        //Enroll in other available session
        cy.get(LECourseDetailsILCModule.getSessionName()).contains(new RegExp("^" + ilcDetails.sessionName + "$", "g")).parents(LECourseDetailsILCModule.getSessionContainer()).within(() => {
            cy.get(LECourseDetailsILCModule.getEnrollBtn()).click({force:true})
        })
        cy.get(LEDashboardPage.getToastNotificationMsg()).should('be.visible')

        //Verify enrollment
        cy.get(LECourseDetailsILCModule.getUpcomingSessionsHeader()).should('contain', 'Upcoming Sessions')
        cy.get(LECourseDetailsILCModule.getSessionName()).should('contain', ilcDetails.sessionName)
    })
})

