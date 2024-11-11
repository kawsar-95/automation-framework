import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { ilcDetails, sessions } from '../../../../../../../helpers/TestData/Courses/ilc'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'

describe('C937 AUT-141, AR - ILC - Session - A Session Preview is shown in an ILC (cloned)', function(){
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
    })

    after(function() {        
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Create Instructor Led Course', () => {
        cy.createCourse('Instructor Led', ilcDetails.courseName, true)

        for (let j = 0; j < sessions.sessionNames2.length; j++) {
            ARILCAddEditPage.getAddSession(sessions.sessionNames2[j], arDashboardPage.getFutureDate(j+3))
            cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).type(ilcDetails.sessionDescription)
            cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
            cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).should('not.exist')
            cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        }

        // add past session
        ARILCAddEditPage.getAddSession(sessions.pastsessionName, arDashboardPage.getPastDate(3))
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).type(ilcDetails.sessionDescription)
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).should('not.exist')
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')

        // Ensure sessions that occurred in the past don't display on the session preview section
        cy.get(ARILCAddEditPage.getUpcomingSessionContainer() + ' ' + ARILCAddEditPage.getUpcomingSessionName()).should('not.contain', sessions.pastsessionName)
        
        // Ensure that sessions occurring in the future from the current date display on the session preview section
        // Ensure that sessions are displayed in descending order, based on session start time and time zone
        ARILCAddEditPage.verifySessionOrder([ilcDetails.sessionName, sessions.sessionName_1, sessions.sessionName_2, sessions.sessionName_3, sessions.sessionName_4])

        // Ensure that a maximum of 5 sessions are displayed
        // add another future session
        ARILCAddEditPage.getAddSession(sessions.futuresessionName, arDashboardPage.getFutureDate(7))
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).type(ilcDetails.sessionDescription)
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).should('not.exist')
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(ARILCAddEditPage.getUpcomingSessionContainer()).should('have.length', 5)
        cy.get(ARILCAddEditPage.getUpcomingSessionContainer() + ' ' + ARILCAddEditPage.getUpcomingSessionName()).should('not.contain', sessions.futuresessionName)

        // Ensure that when a session is deleted, or moves to the past, the next
        // session in order gets displayed
        ARILCAddEditPage.getEditSessionByName(sessions.sessionName_2)
        ARILCAddEditPage.getStartDatePickerBtnThenClick()
        ARILCAddEditPage.getSelectDate(arDashboardPage.getPastDate(9))
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).should('not.exist')
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')

        ARILCAddEditPage.verifySessionOrder([ilcDetails.sessionName, sessions.sessionName_1, sessions.sessionName_3, sessions.sessionName_4, sessions.futuresessionName])
        cy.get(ARILCAddEditPage.getUpcomingSessionContainer() + ' ' + ARILCAddEditPage.getUpcomingSessionName()).should('not.contain', sessions.sessionName_2)

        // Ensure that sessions can be edited from the session preview section
        // Ensure that when the session start date and/or time zone are updated, the
        // sessions are re-ordered correctly
        ARILCAddEditPage.getEditSessionByName(sessions.sessionName_1)
        ARILCAddEditPage.getStartDatePickerBtnThenClick()
        ARILCAddEditPage.getSelectDate(arDashboardPage.getFutureDate(12))
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).should('not.exist')
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')

        ARILCAddEditPage.verifySessionOrder([ilcDetails.sessionName, sessions.sessionName_3, sessions.sessionName_4, sessions.futuresessionName,  sessions.sessionName_1])

        // Ensure that sessions can be deleted from the session preview section
        ARILCAddEditPage.getDeleteSessionByName(ilcDetails.sessionName)
        cy.get(arDashboardPage.getConfirmBtn()).click()
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')

        ARILCAddEditPage.verifySessionOrder([sessions.sessionName_3, sessions.sessionName_4, sessions.futuresessionName,  sessions.sessionName_1])
        
        // Ensure that all sessions can be viewed from the session preview section
        cy.get(ARILCAddEditPage.getViewAllSessionsBtn()).should('be.visible').click()
        cy.get(arDashboardPage.getModalTitle(),{timeout:10000}).should('be.visible').and("have.text", "Sessions")
        cy.get(ARILCAddEditPage.getUpcomingSessionContainer()).should('have.length', 6)
        cy.get(ARILCAddEditPage.getCloseBtn()).click({force:true})

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('contain', 'Course successfully published')
    })
})