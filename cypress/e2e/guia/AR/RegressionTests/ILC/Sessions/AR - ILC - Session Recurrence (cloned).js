import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import { ilcDetails, recurrence } from '../../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'

describe('C807, AR - ILC - Session Recurrence (cloned)', function(){
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

        // Cancel the session changes
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        cy.intercept('PUT', 'api/rest/v2/admin/instructor-led-courses-new/**').as('getSessionId')

        // Verify drop down default value is none
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDown()).should('have.text', 'None')

        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDownOpt()).contains('day(s)').click()

        // enter incorrect values into the Repeat Every # box
        cy.get(ARILCAddEditPage.getSessionDetailsRepeatEveryTxtF()).clear().type(1.564)
        cy.get(ARILCAddEditPage.getSessionDetailsRepeatEveryTxtF()).siblings('div').click()

        // Verify rounded up
        cy.get(ARILCAddEditPage.getSessionDetailsRepeatEveryTxtF()).should('have.value', 2)

        // enter correct values into the Repeat Every # box
        cy.get(ARILCAddEditPage.getSessionDetailsRepeatEveryTxtF()).clear().type(1)

        cy.get(ARILCAddEditPage.getSessionDetailsRecurUntilOpt()).contains('Number of Occurrences').click()
        ARILCAddEditPage.getShortWait()

        // enter incorrect values into the"Number of Occurrences" # box
        cy.get(ARILCAddEditPage.getSessionDetailsNumOfOccurrences()).clear().type(4.123)
        cy.get(ARILCAddEditPage.getSessionDetailsNumOfOccurrences()).siblings('div').click()

        // Verify rounded down
        cy.get(ARILCAddEditPage.getSessionDetailsNumOfOccurrences()).should('have.value', 4)

        // enter correct values into the"Number of Occurrences" # box
        cy.get(ARILCAddEditPage.getSessionDetailsNumOfOccurrences()).clear().type(4)
    
        cy.get(ARILCAddEditPage.getAddEditSessionCancelBtn()).click()
        ARILCAddEditPage.getShortWait()

        // Save the session changes
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)

        // Verify drop down default value is none
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDown()).should('have.text', 'None')

        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDownOpt()).contains('day(s)').click()
        ARILCAddEditPage.getShortWait()

        // enter correct values into the Repeat Every # box
        cy.get(ARILCAddEditPage.getSessionDetailsRepeatEveryTxtF()).clear().type(1)

        cy.get(ARILCAddEditPage.getSessionDetailsRecurUntilOpt()).contains('Number of Occurrences').click()
        ARILCAddEditPage.getShortWait()

        // enter correct values into the"Number of Occurrences" # box
        cy.get(ARILCAddEditPage.getSessionDetailsNumOfOccurrences()).clear().type(4)

        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.intercept('**/sessions/report').as(`getSession2`).wait(`@getSession2`)
    })
})

