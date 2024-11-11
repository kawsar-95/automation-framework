import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECalendarPage from '../../../../../../helpers/LE/pageObjects/Courses/LECalendarPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { ilcDetails, sessions } from '../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'

//Test specific object to organize test data
let ILCInfo = [
    {time:"Past", name:ilcDetails.courseNamePast, sessionName:sessions.sessionName_Past, day:'11'},
    {time:"Future", name:ilcDetails.courseNameFuture, sessionName:sessions.sessionName_Future, day:'11'}
];

describe('LE - Course Activity - Calendar View - Admin Side', function(){

    before(function() {
        //Create a new user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
    })

    for (let i = 0; i < ILCInfo.length; i++) {
        it(`Admin - Create New ILC Course and Add Session in the ${ILCInfo[i].time}`, () => { 
            cy.createCourse('Instructor Led', ILCInfo[i].name)
            //Delete created session
            ARILCAddEditPage.getShortWait()
            ARILCAddEditPage.getDeleteSessionByName(ilcDetails.sessionName)
            cy.get(arCoursesPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
            ARILCAddEditPage.getShortWait()

            ARILCAddEditPage.getAddSession(ILCInfo[i].sessionName, commonDetails.timestamp)
            //Set ilc session start and end date (+/- 1 month)
            if (i === 0) { //Set the session in the previous month
                ARILCAddEditPage.getStartDatePickerBtnThenClick()
                cy.get(ARILCAddEditPage.getCalenderMonthBackBtn()).click()
                LEDashboardPage.getVShortWait()
                ARILCAddEditPage.getCalenderSelectSingleDay(ILCInfo[i].day)
                ARILCAddEditPage.getEndDatePickerBtnThenClick()
                cy.get(ARILCAddEditPage.getCalenderMonthBackBtn()).click()
                LEDashboardPage.getVShortWait()
                ARILCAddEditPage.getCalenderSelectSingleDay(ILCInfo[i].day)
            } else { //Set the session in the next month
                ARILCAddEditPage.getStartDatePickerBtnThenClick()
                cy.get(ARILCAddEditPage.getCalenderMonthFwdBtn()).click()
                LEDashboardPage.getVShortWait()
                ARILCAddEditPage.getCalenderSelectSingleDay(ILCInfo[i].day)
            }

            //Set self enrollment = All Learners
            cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
            cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()

            //Save session & publish course
            cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
            ARILCAddEditPage.getLShortWait()

            cy.publishCourseAndReturnId().then((id) => {
                commonDetails.courseIDs.push(id.request.url.slice(-36))
            })
        })
    }

    for (let i = 0; i < ILCInfo.length; i++) {
        it(`Enroll Learner in ${ILCInfo[i].time} ILC`, () => { 
            arEnrollUsersPage.getEnrollUserByCourseAndUsername([ILCInfo[i].name], [userDetails.username], ILCInfo[i].sessionName)
        })
    }

})

describe('LE - Course Activity - Calendar View', function(){

    beforeEach(() => {
        //Sign in, navigate to the calendar
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Calendar')
    })

    after(function() {
        //Delete all courses
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], 'instructor-led-courses-new')
        }
        //Cleanup - Get userID and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Navigate One Month Back and Verify User is Enrolled in Past Course', () => { 
        cy.get(LECalendarPage.getCalendarPrevMonthBtn()).click()
        cy.get(LECalendarPage.getCourseNameInCalendarMonth()).should('contain', ILCInfo[0].name)
    })

    it('Navigate One Month Ahead and Verify User is Enrolled in Future Course', () => { 
        cy.get(LECalendarPage.getCalendarNextMonthBtn()).click()
        cy.get(LECalendarPage.getCourseNameInCalendarMonth()).should('contain', ILCInfo[1].name)
    })
})