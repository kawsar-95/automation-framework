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
import LECoursesPage from '../../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LECalendarPage from '../../../../../../../helpers/LE/pageObjects/Courses/LECalendarPage'
import { ilcDetails, sessions } from '../../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { venueDetails, venueTypes, venues, venueLinks  } from '../../../../../../../helpers/TestData/Venue/venueDetails'

describe('AR - ILC - Teams - Select Teams Venue', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses, add ILC
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it('Admin - Create ILC Session with Existing Teams Venue', () => {
        cy.createCourse('Instructor Led', ilcDetails.courseNameExistingVenue)

        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        
        //Edit existing session
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)

        //Select an Instructor
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsTxtF())
            .type(users.instructorLogInOut.instructor_loginout_fname + ' ' + users.instructorLogInOut.instructor_loginout_lname)
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDownOpt()).contains(users.instructorLogInOut.instructor_loginout_fname).click()
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).click()

        //Select existing Teams Venue
        cy.get(ARILCAddEditPage.getSessionDetailsVenuesDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsVenuesTxtF()).type(venues.teamsVenue01Name)
        cy.get(ARILCAddEditPage.getSessionDetailsVenuesDDownOpt()).contains(venues.teamsVenue01Name).click()
        venueDetails.venueNames.push(venues.teamsVenue01Name)

        //Verify Invitation Url message
        cy.get(ARILCAddEditPage.getInvitationUrlNotice()).should('contain', ARILCAddEditPage.getInvitationUrlPrePublishTxt())

        //Select Start Date 2 days into the future
        ARILCAddEditPage.getStartDatePickerBtnThenClick()
        ARILCAddEditPage.getSelectDate(ARILCAddEditPage.getFutureDate(2))

        //Expand Self Enrollment and Add Self Enrollment Rule
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()

        //Save ILC Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getLShortWait()

        //Publish course & save ID
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
    })

    it('Admin - Create ILC Session and New Teams Venue', () => {
        cy.createCourse('Instructor Led', ilcDetails.courseNameNewVenue)
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Edit existing session
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)

        //Select an Instructor
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsTxtF())
            .type(users.instructorLogInOut.instructor_loginout_fname + ' ' + users.instructorLogInOut.instructor_loginout_lname)
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDownOpt()).contains(users.instructorLogInOut.instructor_loginout_fname).click()
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).click()

        //Create a new Teams Venue
        ARILCAddEditPage.getAddNewVenue(venueDetails.venueName, venueTypes.teamsMeeting)
        venueDetails.venueNames.push(venueDetails.venueName)

        //Verify Invitation Url message
        cy.get(ARILCAddEditPage.getInvitationUrlNotice()).should('contain', ARILCAddEditPage.getInvitationUrlPrePublishTxt())

        //Select Start Date 2 days into the future
        ARILCAddEditPage.getStartDatePickerBtnThenClick()
        ARILCAddEditPage.getSelectDate(ARILCAddEditPage.getFutureDate(2))

        //Expand Self Enrollment and Add Self Enrollment Rule
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()

        //Save ILC Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        ARILCAddEditPage.getLShortWait()

        //Publish course & save ID
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36));
        })
    })
})


describe('AR - ILC - Teams - Select Teams Venue - Learner Side', function(){

    after(function() {
        //Delete Courses
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], 'instructor-led-courses-new')
        }
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
    })

    it('Verify Advanced Filtering for ILC Courses with Teams Sessions', () => {
        //Login, navigate to catalog, Open filter menu
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password)
        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEDashboardPage.getLShortWait()

        //Verify Teams ILC session Courses are displayed when advanced filtering is used
        cy.get(LEFilterMenu.getILCChkBox()).click()
        cy.get(LEFilterMenu.getAdvancedFilterDDown()).select('Venue Type')
        cy.get(LEFilterMenu.getVenueTypeChkBox()).contains('Virtual').click()
        LEDashboardPage.getMediumWait()

        //Verify courses are displayed after filtering
        cy.get(LEDashboardPage.getCourseCardName()).should('contain', ilcDetails.courseNameExistingVenue)
        cy.get(LEDashboardPage.getCourseCardName()).should('contain', ilcDetails.courseNameNewVenue)

        //Verify courses are displayed in the calendar view after filtering
        cy.get(LECoursesPage.getCardViewBtn()).click()
        cy.get(LECoursesPage.getCalendarViewBtn()).click()
        LEDashboardPage.getMediumWait()

        for (let i = 0; i < commonDetails.courseNames.length; i++) {
            cy.get(LECalendarPage.getCourseName()).contains(commonDetails.courseNames[i]).parents(LECalendarPage.getCourseContainer()).within(() => {
                cy.get(LECalendarPage.getSessionLocation()).should('contain', venueDetails.venueNames[i])
                cy.get(LECalendarPage.getSessionUrl()).should('contain', venueLinks.teamsLink)
            })
        }
    })
})