/**
 * This test requires the Microsoft Teams Virtual Classroom Integration to be enabled on the portal
 */

 import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
 import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
 import ARCourseSettingsEnrollmentRulesModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
 import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
 import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
 import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
 import LEFilterMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
 import LECourseDetailsILCModule from '../../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsILCModule'
 import { ilcDetails } from '../../../../../../../helpers/TestData/Courses/ilc'
 import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
 import { users } from '../../../../../../../helpers/TestData/users/users'
 import { venues, venueLinks } from '../../../../../../../helpers/TestData/Venue/venueDetails'
 
 describe('AR - ILC - Teams - Create Recurring Teams Meetings', function(){

    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Admin Side - Create Teams Meeting Session With Recurrence', () => {
        //Create ILC & add session with Teams venue
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Instructor Led')
        //Set enrollment rule
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Edit created session and add a new teams venue
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        //Select an Instructor
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsTxtF())
            .type(users.instructorLogInOut.instructor_loginout_fname + ' ' + users.instructorLogInOut.instructor_loginout_lname)
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDownOpt()).contains(users.instructorLogInOut.instructor_loginout_fname).click()
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).click()
        //Add Teams Venue
        cy.get(ARILCAddEditPage.getSessionDetailsVenuesDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsVenuesTxtF()).type(venues.teamsVenue01Name)
        cy.get(ARILCAddEditPage.getSessionDetailsVenuesDDownOpt()).contains(venues.teamsVenue01Name).click()

        //Add Weekly occurence
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsReccuringClassesDDownOpt()).contains('week(s)').click()
        cy.get(ARILCAddEditPage.getSessionDetailsNumOfOccurrences()).clear().type('2') //Add 2 occurences

        //Expand Self Enrollment and Add Self Enrollment Rule
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()
        //Save ILC Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getLShortWait()
        
        //Publish course & save ID
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
    })

    it('Admin Side - Verify Teams Meeting Session With Recurrence', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Filter for and edit ILC
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        //Verify recurring sessions were created
        ARILCAddEditPage.getSessionOccurancesByName(ilcDetails.sessionName, 2, true)
        //Verify sessions were created for correct dates (2 days from now and 1 week after that)
        cy.get(ARILCAddEditPage.getSessionOccurenceList()).should('contain', ARILCAddEditPage.getFormattedDateString(ARILCAddEditPage.getFutureDate(2), 'dddd, MMMM DD'))
            .and('contain', ARILCAddEditPage.getFormattedDateString(ARILCAddEditPage.getFutureDate(9), 'dddd, MMMM DD'))

        //Verify teams meeting URL was created
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        cy.get(ARILCAddEditPage.getInvitationUrl()).should('contain', venueLinks.teamsLink)
    })

    it('Learner Side - Verify Teams Meeting Session With Recurrence', () => {
        //Login and filter for course
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEDashboardPage.getLShortWait()
        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName)
        LEDashboardPage.getMediumWait()
        //Select course and verify session details display the venue and teams meeting join URL
        cy.get(LEDashboardPage.getCourseCardName()).should('contain', ilcDetails.courseName).click()
        cy.get(LECourseDetailsILCModule.getSessionName()).should('contain', ilcDetails.sessionName)
        cy.get(LECourseDetailsILCModule.getSessionVenue()).should('contain', venues.teamsVenue01Name).and('contain', venueLinks.teamsLink)
        //Verify recurrences
        LECourseDetailsILCModule.getViewRecurrencesBtnThenClick()
        cy.get(LECourseDetailsILCModule.getSessionReccurenceRow()).should('contain', ARILCAddEditPage.getFormattedDateString(ARILCAddEditPage.getFutureDate(2), 'MMMM D, YYYY'))
            .and('contain', ARILCAddEditPage.getFormattedDateString(ARILCAddEditPage.getFutureDate(9), 'MMMM D, YYYY'))
    })
 })
