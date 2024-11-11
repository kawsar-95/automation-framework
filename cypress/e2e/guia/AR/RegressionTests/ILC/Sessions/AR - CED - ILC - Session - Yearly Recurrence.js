import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails, sessions,recurrence } from '../../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'

describe('AR - Regress - CED - ILC - Session - Yearly Recurrence', function(){

    let sessionNames = [`${recurrence.recurrenceSessionNames[3]} - Num of Occurences`, `${recurrence.recurrenceSessionNames[3]} - Date`]; //test specific array

    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Create ILC with Yearly Recurring Sessions, Publish Course', () => {
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)

        //Get day number and month name for repeat on selection
        recurrence.day = ARILCAddEditPage.getFormattedDateString(ARILCAddEditPage.getFutureDate(2), 'D');
        recurrence.month = ARILCAddEditPage.getFormattedDateString(ARILCAddEditPage.getFutureDate(2), 'MMM');

        //Add sessions with Yearly occurence
        for (let i = 0; i < sessionNames.length; i++) {
            ARILCAddEditPage.getAddSession(sessionNames[i], ARILCAddEditPage.getFutureDate(2))
            if (i === 0) { //Add recur until Number of Occurences
                ARILCAddEditPage.getAddYearlyRecurringSession(1, recurrence.month, recurrence.day, "Number of Occurrences", 3)
            } else { //Add recur until Date
                ARILCAddEditPage.getAddYearlyRecurringSession(1, recurrence.month, recurrence.day, "Date", ARILCAddEditPage.getFutureDate(2, 'Day', 2, 'year'))
            }
            //Save ILC Session
            cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
            cy.intercept('**/sessions/report').as(`getSession${i}`).wait(`@getSession${i}`)

            //Verify recurring sessions were created with correct dates
            ARILCAddEditPage.getSessionOccurancesByName(sessionNames[i], 3, true)
            cy.get(ARILCAddEditPage.getUpcomingSessionName()).contains(sessionNames[i]).parents(ARILCAddEditPage.getUpcomingSessionContainer()).within(() => {
                cy.get(ARILCAddEditPage.getSessionOccurenceList())
                    .should('contain', ARILCAddEditPage.getFormattedDateString(ARILCAddEditPage.getFutureDate(2), 'dddd, MMMM DD YYYY'))
                    .and('contain', ARILCAddEditPage.getFormattedDateString(ARILCAddEditPage.getFutureDate(2, 'Day', 1, 'Year'), 'dddd, MMMM DD YYYY'))
                    .and('contain', ARILCAddEditPage.getFormattedDateString(ARILCAddEditPage.getFutureDate(2, 'Day', 2, 'Year'), 'dddd, MMMM DD YYYY'))
            })
        }

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit ILC, Verify Yearly Recurring Sessions Persisted', () => {
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        //Verify session recurrence persisted
        for (let i = 0; i < sessionNames.length; i++) {
            ARILCAddEditPage.getSessionOccurancesByName(sessionNames[i], 3, true)
            cy.get(ARILCAddEditPage.getUpcomingSessionName()).contains(sessionNames[i]).parents(ARILCAddEditPage.getUpcomingSessionContainer()).within(() => {
                cy.get(ARILCAddEditPage.getSessionOccurenceList())
                    .should('contain', ARILCAddEditPage.getFormattedDateString(ARILCAddEditPage.getFutureDate(2), 'dddd, MMMM DD YYYY'))
                    .and('contain', ARILCAddEditPage.getFormattedDateString(ARILCAddEditPage.getFutureDate(2, 'Day', 1, 'Year'), 'dddd, MMMM DD YYYY'))
                    .and('contain', ARILCAddEditPage.getFormattedDateString(ARILCAddEditPage.getFutureDate(2, 'Day', 2, 'Year'), 'dddd, MMMM DD YYYY'))
            })
        }
    })
})

