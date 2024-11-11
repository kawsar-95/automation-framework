/**
 * This test requires the Microsoft Teams Virtual Classroom Integration to be enabled on the portal
 */

 import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
 import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
 import arPublishModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal'
 import ARCourseSettingsEnrollmentRulesModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
 import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
 import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
 import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
 import LEFilterMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
 import LECourseDetailsILCModule from '../../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsILCModule'
 import { ilcDetails } from '../../../../../../../helpers/TestData/Courses/ilc'
 import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
 import { users } from '../../../../../../../helpers/TestData/users/users'
 import { venueDetails, venues, venueLinks } from '../../../../../../../helpers/TestData/Venue/venueDetails'
 
 describe('AR - ILC - Teams - Create Teams Meeting in Existing Session - Quick Publish', function(){

    before(() => {
        //Create ILC with session that does not have a teams venue
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Instructor Led')
        //Set enrollment rule
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Publish course & save ID
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
    })

    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Admin Side - Verify Teams Meeting is Created on Quick Publish and Opens in a New Tab', () => {
        //Filter for and edit ILC & session
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)

        //Select a venue of type Teams Meeting
        cy.get(ARILCAddEditPage.getSessionDetailsVenuesDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsVenuesTxtF()).type(venues.teamsVenue01Name)
        cy.get(ARILCAddEditPage.getSessionDetailsVenuesDDownOpt()).contains(venues.teamsVenue01Name).click()
        venueDetails.venueNames.push(venues.teamsVenue01Name)

        //Select an instructor with NO email address
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsTxtF())
            .type(users.instructorNoEmail.instructorNoEmail_fname + ' ' + users.instructorNoEmail.instructorNoEmail_lname)
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDownOpt()).contains(users.instructorNoEmail.instructorNoEmail_fname).click()
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).click()

        //Verify error when trying to save session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.get(ARILCAddEditPage.getErrorMsg()).should('contain', ARILCAddEditPage.getInstructorNoEmailErrorMsg())

        //Replace instructor with one that DOES have an email address & save the session
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsClearBtn()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsTxtF())
            .type(users.instructorLogInOut.instructor_loginout_fname + ' ' + users.instructorLogInOut.instructor_loginout_lname)
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDownOpt()).contains(users.instructorLogInOut.instructor_loginout_fname).click()
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).click()
        //Expand Self Enrollment and Add Self Enrollment Rule
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getLShortWait()

        //Quick publish the course
        cy.publishCourse(true)
        
        //Edit the session and verify the teams meeting URL was created
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        cy.get(ARILCAddEditPage.getInvitationUrl()).should('contain', venueLinks.teamsLink)
            .and('have.attr', 'target', '_blank') //Verify the URL opens a NEW tab
    })

    it('Learner Side - Verify Teams Meeting is Created on Quick Publish and Opens in a New Tab', () => {
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
        cy.get(LECourseDetailsILCModule.getSessionUrl()).should('have.attr', 'target', '_blank') //Verify the URL opens a NEW tab
    })
})

describe('AR - ILC - Teams - Create Teams Meeting in Existing Session - Publish', function(){

    before(() => {
        //Create ILC with session that does not have a teams venue
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Instructor Led')
        //Set enrollment rule
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Publish course & save ID
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
    })

    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Admin Side - Verify Teams Meeting is Created on Publish and Opens in a New Tab', () => {
        //Filter for and edit ILC & session
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)

        //Select a venue of type Teams Meeting
        cy.get(ARILCAddEditPage.getSessionDetailsVenuesDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsVenuesTxtF()).type(venues.teamsVenue01Name)
        cy.get(ARILCAddEditPage.getSessionDetailsVenuesDDownOpt()).contains(venues.teamsVenue01Name).click()
        venueDetails.venueNames.push(venues.teamsVenue01Name)

        //Add instructor with an email address & save the session
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsTxtF())
            .type(users.instructorLogInOut.instructor_loginout_fname + ' ' + users.instructorLogInOut.instructor_loginout_lname)
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDownOpt()).contains(users.instructorLogInOut.instructor_loginout_fname).click()
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).click()
        //Expand Self Enrollment and Add Self Enrollment Rule
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getLShortWait()

        //Publish the course
        cy.publishCourse()

        //Filter for and edit ILC & session
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()
        //Edit the session and verify the teams meeting URL was created
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        cy.get(ARILCAddEditPage.getInvitationUrl()).should('contain', venueLinks.teamsLink)
            .and('have.attr', 'target', '_blank') //Verify the URL opens a NEW tab
    })

    it('Learner Side - Verify Teams Meeting is Created on Publish and Opens in a New Tab', () => {
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
        cy.get(LECourseDetailsILCModule.getSessionUrl()).should('have.attr', 'target', '_blank') //Verify the URL opens a NEW tab
    })
})