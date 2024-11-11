import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails, recurrence } from '../../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'

describe('AR - Regress - CED - ILC - Session - Daily Recurrence', function(){

    let sessionNames = [`${recurrence.recurrenceSessionNames[0]} - Num of Occurences`, `${recurrence.recurrenceSessionNames[0]} - Date`]; //test specific array

    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Create ILC with Daily Recurring Sessions, Publish Course', () => {
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)

        //Add sessioms with daily recurrence
        for (let i = 0; i < sessionNames.length; i++) {
            ARILCAddEditPage.getAddSession(sessionNames[i], ARILCAddEditPage.getFutureDate(2))
            if (i === 0) { //Add recur until Number of Occurences
                ARILCAddEditPage.getAddDailyRecurringSession(1, "Number of Occurrences", 4)
            } else { //Add recur until Date
                ARILCAddEditPage.getAddDailyRecurringSession(1, "Date", ARILCAddEditPage.getFutureDate(5))
            }
            //Save ILC Session
            cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
            cy.intercept('**/sessions/report').as(`getSession${i}`).wait(`@getSession${i}`)

            //Verify recurring sessions were created with correct dates
            ARILCAddEditPage.getSessionOccurancesByName(sessionNames[i], 4, true)
            cy.get(ARILCAddEditPage.getUpcomingSessionName()).contains(sessionNames[i]).parents(ARILCAddEditPage.getUpcomingSessionContainer()).within(() => {
                cy.get(ARILCAddEditPage.getSessionOccurenceList())
                    .should('contain', ARILCAddEditPage.getFormattedDateString(ARILCAddEditPage.getFutureDate(2), 'dddd, MMMM DD'))
                    .and('contain', ARILCAddEditPage.getFormattedDateString(ARILCAddEditPage.getFutureDate(3), 'dddd, MMMM DD'))
                    .and('contain', ARILCAddEditPage.getFormattedDateString(ARILCAddEditPage.getFutureDate(4), 'dddd, MMMM DD'))
                    .and('contain', ARILCAddEditPage.getFormattedDateString(ARILCAddEditPage.getFutureDate(5), 'dddd, MMMM DD'))
            })
        }

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit ILC, Verify Daily Recurring Sessions Persisted', () => {
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        for (let i = 0; i < sessionNames.length; i++) {
            ARILCAddEditPage.getSessionOccurancesByName(sessionNames[i], 4, true)
            cy.get(ARILCAddEditPage.getUpcomingSessionName()).contains(sessionNames[i]).parents(ARILCAddEditPage.getUpcomingSessionContainer()).within(() => {
                cy.get(ARILCAddEditPage.getSessionOccurenceList())
                    .should('contain', ARILCAddEditPage.getFormattedDateString(ARILCAddEditPage.getFutureDate(2), 'dddd, MMMM DD'))
                    .and('contain', ARILCAddEditPage.getFormattedDateString(ARILCAddEditPage.getFutureDate(3), 'dddd, MMMM DD'))
                    .and('contain', ARILCAddEditPage.getFormattedDateString(ARILCAddEditPage.getFutureDate(4), 'dddd, MMMM DD'))
                    .and('contain', ARILCAddEditPage.getFormattedDateString(ARILCAddEditPage.getFutureDate(5), 'dddd, MMMM DD'))
            })
        }
    })
})

