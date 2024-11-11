import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails, sessions, enrollment } from '../../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'

describe('AR - CED - ILC - Session - Enrollment Dates', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Create ILC, Add Session And Verify Enrollment Start and End Date Fields', () => {
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)

        //Add a session and open enrollment section
        ARILCAddEditPage.getAddSession(ilcDetails.sessionName)
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()

        //Verify enrollment END date cannot be before the START date
        cy.get(ARILCAddEditPage.getSessionEnrollmentEndDatePickerBtn()).click()
        ARILCAddEditPage.getSelectDate(ARILCAddEditPage.getPastDate('4'))
        cy.get(ARILCAddEditPage.getSessionEnrollmentStartDatePickerBtn()).click()
        ARILCAddEditPage.getSelectDate(ARILCAddEditPage.getFutureDate('4'))
        cy.get(ARILCAddEditPage.getErrorMsg()).should('contain', 'Please set a Start Time and End Time, and ensure the Start Time is before the End Time.')

        //Enter Valid Dates
        cy.get(ARILCAddEditPage.getSessionEnrollmentEndDatePickerBtn()).click()
        ARILCAddEditPage.getSelectDate(ARILCAddEditPage.getFutureDate('5'))

        //Enter valid Times
        cy.get(ARILCAddEditPage.getSessionEnrollmentEndTimePickerBtn()).click()
        ARILCAddEditPage.SelectTime('4', '05', 'PM')
        cy.get(ARILCAddEditPage.getSessionEnrollmentStartTimePickerBtn()).click()
        ARILCAddEditPage.SelectTime('1', '10', 'PM')

        //Save session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.intercept('**/sessions/report').as(`getSession`).wait(`@getSession`)
    
        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
    })

    it('Verify Session Enrollment Start & End Dates Persisted', () => {
        //Edit ILC
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        //Edit session
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()

        //Verify enrollment start/end date and times
        cy.get(ARILCAddEditPage.getSessionDetailsEnrollmentStartDateTxtF()).should('have.value', ARILCAddEditPage.getFutureDate('4'))
        cy.get(ARILCAddEditPage.getSessionDetailsEnrollmentEndDateTxtF()).should('have.value', ARILCAddEditPage.getFutureDate('5'))
        cy.get(ARILCAddEditPage.getSessionDetailsEnrollmentStartTimeTxtF()).should('have.value', '1:10 PM')
        cy.get(ARILCAddEditPage.getSessionDetailsEnrollmentEndTimeTxtF()).should('have.value', '4:05 PM')

        //Edit enrollment start/end dates
        cy.get(ARILCAddEditPage.getSessionEnrollmentStartDatePickerBtn()).click()
        ARILCAddEditPage.getSelectDate(ARILCAddEditPage.getPastDate('4'))
        cy.get(ARILCAddEditPage.getSessionEnrollmentEndDatePickerBtn()).click()
        ARILCAddEditPage.getSelectDate(ARILCAddEditPage.getFutureDate('10'))
    
        //Save session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.intercept('**/sessions/report').as(`getSession`).wait(`@getSession`)
    
        //Publish ILC
        cy.publishCourse()
    })

    it('Verify Session Enrollment Start & End Date Edits Persisted', () => {
        //Edit ILC
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        //Edit session
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        cy.get(ARILCAddEditPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()

        //Verify edited enrollment dates
        cy.get(ARILCAddEditPage.getSessionDetailsEnrollmentStartDateTxtF()).should('have.value', ARILCAddEditPage.getPastDate('4'))
        cy.get(ARILCAddEditPage.getSessionDetailsEnrollmentEndDateTxtF()).should('have.value', ARILCAddEditPage.getFutureDate('10'))
    })
})