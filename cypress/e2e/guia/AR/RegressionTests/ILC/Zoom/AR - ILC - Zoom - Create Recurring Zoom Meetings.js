/**
 * This test requires the Zoom Virtual Classroom Integration to be enabled on the portal
 */

 import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
 import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
 import ARCourseSettingsEnrollmentRulesModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
 import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
 import ARDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
 import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
 import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
 import LEFilterMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
 import LECourseDetailsILCModule from '../../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsILCModule'
 import { ilcDetails, recurrence } from '../../../../../../../helpers/TestData/Courses/ilc'
 import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
 import { users } from '../../../../../../../helpers/TestData/users/users'
 import { venues, venueLinks } from '../../../../../../../helpers/TestData/Venue/venueDetails'

 describe('AR - ILC - Zoom - Create Recurring Zoom Meetings', function(){

    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Admin Side - Create Zoom Meeting Sessions With Recurrence', () => {
        //Create ILC & add session with Tzoom venue
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)
        //Set enrollment rule
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Create zoom sessions with daily, weekly, monthly, and yearly occurences
        for (let i = 0; i < recurrence.recurrenceFuncNames.length; i++) {
            ARILCAddEditPage.getAddSession(recurrence.recurrenceSessionNames[i], ARILCAddEditPage.getFutureDate(i+2), null, null, null, 'Zoom')

            switch (recurrence.recurrenceFuncNames[i]) {
                case 'getAddDailyRecurringSession':
                    ARILCAddEditPage[recurrence.recurrenceFuncNames[i]](recurrence.repeatEvery, 'Number of Occurrences', recurrence.numOcurrences)
                    break;
                case 'getAddWeeklyRecurringSession':
                    ARILCAddEditPage[recurrence.recurrenceFuncNames[i]](recurrence.repeatEvery, recurrence.onDay, 'Number of Occurrences', recurrence.numOcurrences)
                    break;
                case 'getAddMonthlyRecurringSession':
                    ARILCAddEditPage[recurrence.recurrenceFuncNames[i]](recurrence.repeatEvery, recurrence.onDayofMonth, 'Number of Occurrences', recurrence.numOcurrences)
                    break;
                case 'getAddYearlyRecurringSession':
                    ARILCAddEditPage[recurrence.recurrenceFuncNames[i]](recurrence.repeatEvery, recurrence.onMonth, recurrence.onDayofMonth, 'Number of Occurrences', recurrence.numOcurrences)
                    break;
                default:
                    console.log(`Sorry, ${recurrence.recurrenceFuncNames[i]} type does not exist.`);
            }

            //Expand Self Enrollment and Add Self Enrollment Rule
            cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
            cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()
            //Save ILC Session
            cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
            ARILCAddEditPage.getLShortWait()
        }

        //Publish course & save ID
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
    })

    it('Admin Side - Verify Zoom Meeting Sessions With Recurrence', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Filter for and edit ILC
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        //Verify recurring sessions were created and that zoom URL was created
        for (let i = 0; i < recurrence.recurrenceSessionNames.length; i++) {
            ARILCAddEditPage.getSessionOccurancesByName(recurrence.recurrenceSessionNames[i], recurrence.numOcurrences, false)
            ARILCAddEditPage.getEditSessionByName(recurrence.recurrenceSessionNames[i])
            cy.get(ARILCAddEditPage.getInvitationUrl()).should('contain', venueLinks.zoomMeetingLink)
            cy.get(ARILCAddEditPage.getAddEditSessionCancelBtn()).click()
            ARILCAddEditPage.getVShortWait()
        }
    })

    it('Learner Side - Verify Zoom Meeting Sessions With Recurrence', () => {
        //Login and filter for course
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEDashboardPage.getLShortWait()
        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName)
        LEDashboardPage.getMediumWait()

        //Select course and verify all session details display the venue and Zoom meeting join URL
        cy.get(LEDashboardPage.getCourseCardName()).contains(ilcDetails.courseName).click()
        for (let i = 0; i < recurrence.recurrenceSessionNames.length; i++) {
            cy.get(LECourseDetailsILCModule.getSessionName()).contains(recurrence.recurrenceSessionNames[i]).parents(LECourseDetailsILCModule.getSessionContainer()).within(() => {
                if (i != 0) {
                    //Expand session info (first session already expanded)
                    cy.get(LECourseDetailsILCModule.getMoreBtn()).click()
                }
                //Verify venue and zoom url
                cy.get(LECourseDetailsILCModule.getSessionVenue()).should('contain', venues.zoomVenue01Name).and('contain', venueLinks.zoomMeetingLink)
                //Verify recurrences
                cy.get(LECourseDetailsILCModule.getSessionReccurenceRow()).should('contain', `View ${recurrence.numOcurrences} Recurrences`)
            })
        }
    })
 })