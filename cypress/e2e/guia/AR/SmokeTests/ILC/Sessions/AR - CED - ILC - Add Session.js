import venues from '../../../../../../fixtures/venues.json'
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import ARDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { ilcDetails, sessions } from '../../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'


describe('AR - Regress - CED - ILC - Add Session - Create Course', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Admin - When Creating New ILC Verify No Sessions Exist, Verify Session Modal Fields & Error Msgs', () => {
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)
        
        //Verify no total/past/future sessions exist
        cy.get(ARILCAddEditPage.getNoSessionsAddedTxt()).should('contain', 'No sessions have been added.')

        //Add Session
        cy.get(ARILCAddEditPage.getAddSessionBtn()).click()

        //Verify Error Message if Title Field is Empty
        cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false').clear()
        cy.get(ARILCAddEditPage.getSessionDetailsTitleErrorMsg()).should('contain', 'Field is required.')

        //Verify Title Field Does Not Allow More Than 450 Chars
        cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).invoke('val', ARILCAddEditPage.getLongString(451)).type('a')
        cy.get(ARILCAddEditPage.getSessionDetailsTitleErrorMsg()).should('contain', 'Field cannot be more than 450 characters.')
        //Verify Title Field Does Not Accept HTML
        cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).clear() //Need to clear & blur before attempting a save
        cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).type(commonDetails.textWithHtmlTag)
        ARILCAddEditPage.getVShortWait()
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.get(ARILCAddEditPage.getElementByDataNameAttribute(ARILCAddEditPage.getSessionModalErrorMsg()))
            .should('contain', 'Field contains invalid characters.')
        //Set Valid Title
        cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).clear().type(sessions.sessionName_1)

        //Verify Description Field Does Not Allow More Than 4000 Chars
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).invoke('text', ARILCAddEditPage.getLongString(4001)).type('a', { force: true })
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionErrorMsg()).should('contain', 'Field cannot be more than 4000 characters.')

        //Set Valid Description
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).clear()
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).type('GUIA Session Description')

        //Select an Instructor
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsTxtF()).type(users.instructorLogInOut.instructor_loginout_fname + ' ' + users.instructorLogInOut.instructor_loginout_lname)
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDownOpt(), {timeout: 6000}).contains(users.instructorLogInOut.instructor_loginout_fname).click()
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).click()

        //Select a Venue
        cy.get(ARILCAddEditPage.getSessionDetailsVenuesDDown()).click({force:true})
        cy.get(ARILCAddEditPage.getSessionDetailsVenuesTxtF()).type(venues.VENUE_01_NAME)
        cy.get(ARILCAddEditPage.getSessionDetailsVenuesDDownOpt()).contains(venues.VENUE_01_NAME).click()

        //Verify Class Start/End Date and Time Cannot be Empty
        ARILCAddEditPage.getStartDatePickerBtnThenClick()
        ARILCAddEditPage.getSelectDate(sessions.date1) //Need to select a date before the clear btn will work
        cy.get(ARILCAddEditPage.getStartDatePickerClearBtn()).click()
        cy.get(ARILCAddEditPage.getStartDatePickerErrorMsg()).should('contain', 'Field is required.')

        ARILCAddEditPage.getEndDatePickerBtnThenClick()
        ARILCAddEditPage.getSelectDate(sessions.date1)
        cy.get(ARILCAddEditPage.getEndDatePickerClearBtn()).click()
        cy.get(ARILCAddEditPage.getEndDatePickerErrorMsg()).should('contain', 'Field is required.')

        //Verify That the Session End Time Cannot Be Before the Start Time
        ARILCAddEditPage.getStartDatePickerBtnThenClick()
        ARILCAddEditPage.getSelectDate(sessions.date1)
        ARILCAddEditPage.getEndDatePickerBtnThenClick()
        ARILCAddEditPage.getSelectDate(sessions.date1)
        cy.get(ARILCAddEditPage.getEndDatePickerErrorMsg()).should('contain', 'Please set a Start Time and End Time, and ensure the Start Time is before the End Time.')
  
        //Set Valid End Time
        cy.get(ARILCAddEditPage.getEndDateTimeBtn()).click()
        ARILCAddEditPage.SelectTime('01', '00', 'PM')
        cy.get(ARILCAddEditPage.getStartDateTimeBtn()).click()
        ARILCAddEditPage.SelectTime('11', '00', 'AM')
        cy.get(ARILCAddEditPage.getStartDateTimeBtn()).click()
        cy.get(ARILCAddEditPage.getDateTimeLabel()).contains('Class End Date and Time').click() //hide timepicker

        //Set Timezone
        cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneTxtF()).type('(UTC-06:00) Central America')
        cy.get(ARILCAddEditPage.getSessionDetailsTimeZoneDDownOpt()).contains('(UTC-06:00) Central America').click()
        
        //Set Recurring Classes
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDownOpt()).contains('day(s)').click()
        cy.get(ARILCAddEditPage.getSessionDetailsRepeatEveryTxtF()).clear().type('2')

        //Expand Self Enrollment and Add Self Enrollment Rule
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getSessionDetailsReccuringClassesRepeatTxt()))
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()

        //Verify Minimum Class Size Cannot Be Empty
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getMinimumClassSizeTxt())).clear()
        cy.get(ARILCAddEditPage.getMinimumClassSizeErrorMsg()).should('contain', 'Field is required.')
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getMinimumClassSizeTxt())).type('5') //Set min class size

        //Turn WaitList Toggle On
        cy.get(ARILCAddEditPage.getEnableWaitlistToggle()).click()

        //Expand Attributes
        cy.get(ARILCAddEditPage.getAttributesBtn()).click()
        //Verify External ID Field Does Not Allow More Than 255 Chars
        cy.get(ARILCAddEditPage.getExternalIDTxt()).invoke('val', ARILCAddEditPage.getLongString()).type('a')
        cy.get(ARILCAddEditPage.getExternalIDErrorMsg()).should('contain', 'Field cannot be more than 255 characters.')
        cy.get(ARILCAddEditPage.getExternalIDTxt()).clear().type('F221144G') //Add Valid External Id
        ARILCAddEditPage.getVShortWait()

        //Save ILC Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getLShortWait()

        //Verify Number of Total/Future/Past Sessions
        ARILCAddEditPage.getSessionCountByTimeLabel('Total', '1')
        ARILCAddEditPage.getSessionCountByTimeLabel('Future', '1')
        ARILCAddEditPage.getSessionCountByTimeLabel('Past', '0')

        //Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
    })
})

describe('AR - Regress - CED - ILC - Add Session', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses, filter for and edit course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Edit Course, Add Session in the Past, Verify Total Sessions', () => {
        //Add Session
        cy.get(ARILCAddEditPage.getAddSessionBtn()).click()

        //Set Valid Title
        //cy.intercept('/api/rest/v2/admin/reports/users').as('getSessionName').wait('@getSessionName')
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false').clear().type(sessions.sessionName_2)

        //Set Session Date in the Past
        ARILCAddEditPage.getStartDatePickerBtnThenClick()
        ARILCAddEditPage.getSelectDate(sessions.date2)
        ARILCAddEditPage.getEndDatePickerBtnThenClick()
        ARILCAddEditPage.getSelectDate(sessions.date2)

        //Save ILC Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getLShortWait()

        //Verify Number of Total/Future/Past Sessions
        ARILCAddEditPage.getSessionCountByTimeLabel('Total', '2')
        ARILCAddEditPage.getSessionCountByTimeLabel('Future', '1')
        ARILCAddEditPage.getSessionCountByTimeLabel('Past', '1')

        //Publish Course
        cy.publishCourse()
    })

    it('Edit Course, Verify Total Sessions and Occurences, Delete a Session, Edit a Session', () => {
        //Verify Total Number of Sessions
        ARILCAddEditPage.getSessionCountByTimeLabel('Total', '2')

        //Verify First Session Number of Occurences
        ARILCAddEditPage.getSessionOccurancesByName(sessions.sessionName_1, '2')

        //Delete The 2nd (Past) Session
        cy.get(ARILCAddEditPage.getViewAllSessionsBtn()).click()
        ARILCAddEditPage.getShortWait()
        ARILCAddEditPage.getDeleteSessionByName(sessions.sessionName_2)
        cy.get(arCoursesPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        ARILCAddEditPage.getLShortWait()

        //Edit and Save the 1st Session
        ARILCAddEditPage.getEditSessionByName(sessions.sessionName_1)
        cy.get(ARILCAddEditPage.getSessionDetailsTitleTxtF()).should('have.attr', 'aria-invalid', 'false').clear().type(sessions.sessionName_1 + commonDetails.appendText)
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getLShortWait()
        cy.get(ARILCAddEditPage.getCloseBtn()).click()

        //Publish Course
        ARILCAddEditPage.getShortWait()
        cy.publishCourse()
    })

    it('Edit Course, Verify Session Delete and Edit Persists', () => {
        //Verify Number of Total/Future/Past Sessions
        ARILCAddEditPage.getSessionCountByTimeLabel('Total', '1')
        ARILCAddEditPage.getSessionCountByTimeLabel('Future', '1')
        ARILCAddEditPage.getSessionCountByTimeLabel('Past', '0')

        //Verify That First Session's Title Has Been Updated
        cy.get(ARILCAddEditPage.getVerifySessionExists()).should('contain', sessions.sessionName_1 + commonDetails.appendText)
    })
})