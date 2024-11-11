import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails, sessions } from '../../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'

describe('C938, AR - ILC - An Administrator can view the recurring sessions via the Session View report (cloned)', function(){
    before('Create ILC with Daily Recurring Sessions, Publish Course', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        ARILCAddEditPage.getMediumWait()

        // Create ILC course
        cy.createCourse('Instructor Led', ilcDetails.courseName, true)

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    after('Delete Created Course', function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })


    it('Edit ILC, Verify Daily Recurring Sessions', () => {
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        // Add Session to ILC with start date 2 days into the future
        ARILCAddEditPage.getAddSession(sessions.sessionName_1, ARILCAddEditPage.getFutureDate(2))
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).type(`${ilcDetails.sessionDescription}`)

        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDownOpt()).contains('day(s)').click()

        // enter correct values into the Repeat Every # box
        cy.get(ARILCAddEditPage.getSessionDetailsRepeatEveryTxtF()).clear().type(2)

        cy.get(ARILCAddEditPage.getSessionDetailsRecurUntilOpt()).contains('Number of Occurrences').click()
        ARILCAddEditPage.getShortWait()

        // enter correct values into the"Number of Occurrences" # box
        cy.get(ARILCAddEditPage.getSessionDetailsNumOfOccurrences()).clear().type(4)

        // Save Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.intercept('**/sessions/report').as(`getSession`).wait(`@getSession`)
        ARILCAddEditPage.getShortWait()

        // Verify Single sessions have different icons than recurring sessions.
        cy.get(ARILCAddEditPage.getUpcomingSessionName()).contains(new RegExp(`^(${ilcDetails.sessionName})$`, "g")).parents(ARILCAddEditPage.getUpcomingSessionContainer()).within(() => {
            cy.get(ARILCAddEditPage.getElementByDataNameAttribute('date')).invoke('text').should(text => {
                expect(Number.isInteger(+text), 'text should be an integer').to.eq(true)
              })
        })

        // There is a button that displays the number of classes in a session.
        cy.get(ARILCAddEditPage.getUpcomingSessionName()).contains(new RegExp(`^(${sessions.sessionName_1})$`, "g")).parents(ARILCAddEditPage.getUpcomingSessionContainer()).within(() => {
            cy.get(ARILCAddEditPage.getElementByDataNameAttribute('name')).should('have.text', sessions.sessionName_1)
            cy.get(ARILCAddEditPage.getElementByDataNameAttribute('show-ocurrences')).find('div').should('have.text', '4 Occurrences')

            // The recurrence type of a recurring session is identified on the icon
            cy.get(ARILCAddEditPage.getElementByDataNameAttribute('recurring-session')).should('contain', 'Daily')
            cy.get(ARILCAddEditPage.getElementByDataNameAttribute('recurring-session')).find('div').eq(1).should('have.class', 'icon')

            // When the button is clicked, it displays all the classes in that session,
            cy.get(ARILCAddEditPage.getElementByDataNameAttribute('show-ocurrences')).click()
            ARILCAddEditPage.getShortWait()
            cy.get(ARILCAddEditPage.getElementByDataNameAttribute('session-occurrences')).children().should('have.length', 4)

            // including the day, date, class start time, time zone, and class length.
            cy.get(ARILCAddEditPage.getElementByDataNameAttribute('session-occurrences')).find('li').should('exist')
        })

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit ILC Sessions and Verify Weekly Recurring Sessions', () => {
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        // When the session is updated, the changes are reflected on the session modal/session preview.
        ARILCAddEditPage.getEditSessionByName(sessions.sessionName_1)
        cy.intercept('PUT', 'api/rest/v2/admin/instructor-led-courses-new/**').as('getSessionId')

        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDownOpt()).contains('week(s)').click()

        // enter correct values into the Repeat Every # box
        cy.get(ARILCAddEditPage.getSessionDetailsRepeatEveryTxtF()).clear().type(3)

        cy.get(ARILCAddEditPage.getSessionDetailsRecurUntilOpt()).contains('Number of Occurrences').click()
        ARILCAddEditPage.getShortWait()

        // enter correct values into the"Number of Occurrences" # box
        cy.get(ARILCAddEditPage.getSessionDetailsNumOfOccurrences()).clear().type(2)

        // Save Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.intercept('**/sessions/report').as(`getSession`).wait(`@getSession`)
        ARILCAddEditPage.getShortWait()

        // There is a button that displays the number of classes in a session.
        cy.get(ARILCAddEditPage.getUpcomingSessionName()).contains(new RegExp(`^(${sessions.sessionName_1})$`, "g")).parents(ARILCAddEditPage.getUpcomingSessionContainer()).within(() => {
            cy.get(ARILCAddEditPage.getElementByDataNameAttribute('name')).should('have.text', sessions.sessionName_1)
            cy.get(ARILCAddEditPage.getElementByDataNameAttribute('show-ocurrences')).find('div').should('have.text', '2 Occurrences')

            // The recurrence type of a recurring session is identified on the icon
            cy.get(ARILCAddEditPage.getElementByDataNameAttribute('recurring-session')).should('contain', 'Weekly')
            cy.get(ARILCAddEditPage.getElementByDataNameAttribute('recurring-session')).find('div').eq(1).should('have.class', 'icon')

            // When the button is clicked, it displays all the classes in that session,
            cy.get(ARILCAddEditPage.getElementByDataNameAttribute('show-ocurrences')).click()
            ARILCAddEditPage.getShortWait()
            cy.get(ARILCAddEditPage.getElementByDataNameAttribute('session-occurrences')).children().should('have.length', 2)

            // including the day, date, class start time, time zone, and class length.
            cy.get(ARILCAddEditPage.getElementByDataNameAttribute('session-occurrences')).find('li').should('exist')
        })
    })

})

