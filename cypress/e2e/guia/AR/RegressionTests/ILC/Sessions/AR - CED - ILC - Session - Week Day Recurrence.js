import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails, sessions,recurrence } from '../../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'

describe('AR - Regress - CED - ILC - Session - Week Day Recurrence', function(){

    let sessionNames = [`${recurrence.weekdayRecurrenceSessionName} - Num of Occurences`, `${recurrence.weekdayRecurrenceSessionName} - Date`]; //test specific array

    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Create ILC with Weekly Weekday Recurring Sessions, Publish Course', () => {
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)

        //Get day name for day picker
        recurrence.day = ARILCAddEditPage.getFormattedDateString(ARILCAddEditPage.getFutureDate(2), 'dddd');

        //Add sessions with weekly occurence
        for (let i = 0; i < sessionNames.length; i++) {
            ARILCAddEditPage.getAddSession(sessionNames[i], '2040-10-11')
            if (i === 0) { //Add recur until Number of Occurences
                ARILCAddEditPage.getAddWeekdayRecurringSession(1, "Number of Occurrences", 7)
            } else { //Add recur until Date
                ARILCAddEditPage.getAddWeekdayRecurringSession(1, "Date", '2040-10-19')

            }
            //Verify only weekdays are selected by default
            cy.get(ARILCAddEditPage.getOnDayDDown()).should('contain', 'Monday').and('contain', 'Tuesday').and('contain', 'Wednesday')
                .and('contain', 'Thursday').and('contain', 'Friday')
    
            //Save ILC Session
            cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
            cy.intercept('**/sessions/report').as(`getSession${i}`).wait(`@getSession${i}`)

            //Verify recurring sessions were not created on weekend days
            ARILCAddEditPage.getSessionOccurancesByName(sessionNames[i], 7, true)
            cy.get(ARILCAddEditPage.getUpcomingSessionName()).contains(sessionNames[i]).parents(ARILCAddEditPage.getUpcomingSessionContainer()).within(() => {
                cy.get(ARILCAddEditPage.getSessionOccurenceList())
                    .should('not.contain', 'Saturday').and('not.contain', 'Sunday')
            })
        }

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit ILC, Verify Weekly Weekday Recurring Sessions Persisted', () => {
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        //Verify session recurrence persisted and sessions were not created on weekend days
        for (let i = 0; i < sessionNames.length; i++) {
            ARILCAddEditPage.getSessionOccurancesByName(sessionNames[i], 7, true)
            cy.get(ARILCAddEditPage.getUpcomingSessionName()).contains(sessionNames[i]).parents(ARILCAddEditPage.getUpcomingSessionContainer()).within(() => {
                cy.get(ARILCAddEditPage.getSessionOccurenceList())
                    .should('not.contain', 'Saturday').and('not.contain', 'Sunday')
            })
        }
    })
})

