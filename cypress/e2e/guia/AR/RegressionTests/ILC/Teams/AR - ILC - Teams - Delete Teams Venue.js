/**
 * This test requires the Microsoft Teams Virtual Classroom Integration to be enabled on the portal
 */

 import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
 import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
 import ARCourseSettingsEnrollmentRulesModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
 import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
 import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
 import ARDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
 import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
 import LEFilterMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
 import LECourseDetailsILCModule from '../../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsILCModule'
 import { ilcDetails } from '../../../../../../../helpers/TestData/Courses/ilc'
 import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
 import { users } from '../../../../../../../helpers/TestData/users/users'
 import { venueDetails, venueTypes } from '../../../../../../../helpers/TestData/Venue/venueDetails'
 
 describe('AR - ILC - Teams - Delete Teams Venue', function(){

    before(() => {
        //Create ILC & add session with new Teams venue
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Instructor Led')
        //Set enrollment rule
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Edit created session and create a new teams venue
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        //Select an Instructor
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsTxtF())
            .type(users.instructorLogInOut.instructor_loginout_fname + ' ' + users.instructorLogInOut.instructor_loginout_lname)
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDownOpt()).contains(users.instructorLogInOut.instructor_loginout_fname).click()
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).click()
        //Create a new Teams Venue
        ARILCAddEditPage.getAddNewVenue(venueDetails.venueName, venueTypes.teamsMeeting)
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

    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Verify Venue can be Deleted from Venue Report', () => {
        //Login as admin and delete created teams venue
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Venues'))
        cy.intercept('/api/rest/v2/admin/reports/venues/operations').as('getvenues').wait('@getvenues')
        cy.wrap(arCoursesPage.AddFilter('Name', 'Contains', venueDetails.venueName))
        cy.get(arCoursesPage.getTableCellName(2)).contains(venueDetails.venueName).click()
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Delete Venue'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Delete Venue')).click()
        cy.get(arCoursesPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click().wait('@getvenues')
        ARILCAddEditPage.getShortWait()
    })

    it('Admin Side - Verify Venue & Meeting URL have Been Removed From Session Details', () => {
        //Filter for and Edit ILC Course
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.editCourse(ilcDetails.courseName)
        ARILCAddEditPage.getMediumWait()

        //Edit session and verify venue has been removed and the meeting URL is no longer visible
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)
        cy.get(ARILCAddEditPage.getSessionDetailsVenuesDDown()).should('have.value', '')
        cy.get(ARILCAddEditPage.getInvitationUrl()).should('not.exist')
    })

    it('Learner Side - Verify Venue & Meeting URL have Been Removed From Session Details', () => {
        //Login, navigate to catalog, filter for course
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEDashboardPage.getLShortWait()
        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName)
        LEDashboardPage.getMediumWait()
        //Select course and verify the venue and meeting URL are not displayed in the session details
        cy.get(LEDashboardPage.getCourseCardName()).should('contain', ilcDetails.courseName).click()
        cy.get(LECourseDetailsILCModule.getSessionName()).should('contain', ilcDetails.sessionName)
        cy.get(LECourseDetailsILCModule.getSessionVenue()).should('not.exist')
    })
 })