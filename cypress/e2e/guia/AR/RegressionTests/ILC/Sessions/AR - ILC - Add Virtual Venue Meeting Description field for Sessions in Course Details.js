import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECourseDetailsILCModule from '../../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsILCModule'
import LESelectILCSession from '../../../../../../../helpers/LE/pageObjects/Modals/LESelectILCSession.modal'
import LEFilterMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import { ilcDetails } from '../../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../../helpers/TestData/users/UserDetails'
import { venueDetails, venueLinks } from '../../../../../../../helpers/TestData/Venue/venueDetails'
import ARVenueAddEditPage from '../../../../../../../helpers/AR/pageObjects/Venue/ARVenueAddEditPage'
import ARPublishModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal'
import LECoursesPage from '../../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LESideMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEManageTemplateMenu from '../../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateMenu'
import LEManageTemplateCoursesPage from '../../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateCoursesPage'

describe('C7533 AUT-784, AR - ILC - Add Virtual Venue Meeting Description field for Sessions in Course Details', function(){
    before(function() {
        // Create a new user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.createUser(void 0, userDetails.username2, ["Learner"], void 0)

        // Create Url Venue
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Venues'))
        cy.intercept('/api/rest/v2/admin/reports/venues/operations').as('getVenues').wait('@getVenues')

        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Add Venue'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Add Venue')).click()

        //Select venue type
        cy.get(ARVenueAddEditPage.getTypeDDown()).click()
        cy.get(ARVenueAddEditPage.getTypeDDownOpt()).contains('Url').click()

        //Enter valid name
        cy.get(ARVenueAddEditPage.getNameTxtF()).type(venueDetails.venueName)

        //Enter valid description
        cy.get(ARVenueAddEditPage.getDescriptionTxtF()).clear()
        cy.get(ARVenueAddEditPage.getDescriptionTxtF()).type(venueDetails.description)

        //Enter valid max class size
        cy.get(ARVenueAddEditPage.getMaxClassSizeTxtF()).clear().type(5)

        //Fill in type specific fields
        cy.get(ARVenueAddEditPage.getPhoneTxtF()).type(venueDetails.phoneNumber)

        //Enter valid Url
        cy.get(ARVenueAddEditPage.getUrlTxtF()).type(venueLinks.zoomMeetingLink)

        //Save Venue
        ARVenueAddEditPage.WaitForElementStateToChange(ARVenueAddEditPage.getSaveBtn())
        cy.get(ARVenueAddEditPage.getSaveBtn()).click()
        cy.get(ARVenueAddEditPage.getToastSuccessMsg()).should('contain', 'Venue has been created.')
        cy.get(ARVenueAddEditPage.getToastCloseBtn()).click()
    })

    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')

        // Sign into admin side as sys admin,
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        // Delete Users
        arDashboardPage.deleteUsers([userDetails.username, userDetails.username2])

        // navigate to Venues and delete venue
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Venues'))
        cy.intercept('/api/rest/v2/admin/reports/venues/operations').as('getVenues').wait('@getVenues')

        ARVenueAddEditPage.AddFilter('Name', 'Contains', venueDetails.venueName)
        arDashboardPage.getShortWait()

        ARVenueAddEditPage.selectTableCellRecord(venueDetails.venueName, 2)

        cy.wrap(ARVenueAddEditPage.WaitForElementStateToChange(ARVenueAddEditPage.getAddEditMenuActionsByName('Delete Venue')), 1000)
        cy.get(ARVenueAddEditPage.getAddEditMenuActionsByName('Delete Venue')).click()
        arDashboardPage.getShortWait()

        cy.get(ARPublishModal.getContinueBtn()).click()
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getNoResultMsg()).should('be.visible')

        // Manange Template  ILC Location URL checked
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEDashboardPage.getShortWait()
 
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Courses').should('be.visible').click()
        cy.url().should('include', '/#/learner-mgmt/courses')
        LEDashboardPage.getMediumWait()

        LEManageTemplateCoursesPage.getManageTemplateCoursesContainerByNameThenClick('Course Details')
        LEDashboardPage.getShortWait()

        LEManageTemplateCoursesPage.getEnableDisablePreEnrollment('true')
        LEDashboardPage.getShortWait()

        LEManageTemplateCoursesPage.getCheckUncheckedIlcLocationUrl('true')
    })

    it('Create ILC with Session with Virtual Venue and Meeting Description"', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        
        cy.createCourse('Instructor Led')

        // Set self enrollment = all learners
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARILCAddEditPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        // Edit session
        ARILCAddEditPage.getEditSessionByName(ilcDetails.sessionName)

        // Add Venue
        cy.get(ARILCAddEditPage.getSessionDetailsVenuesDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsVenuestxtF()).type(venueDetails.venueName)
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getSessionDetailsVenuesDDownOpt()).contains(venueDetails.venueName).click()
        ARILCAddEditPage.getShortWait()

        // Add instructor with one that DOES have an email address associated to the zoom account
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsTxtF())
            .type(users.instructor01.instructor_01_username)
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDownOpt()).contains(users.instructor01.instructor_01_lname).click()

        // add Meeting Description
        cy.get(ARILCAddEditPage.getMeetingDescriptionTxtF()).type(commonDetails.meetingDescription)

        // Set self enrollment = all learners
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()
        // Set max class size = 1
        cy.get(ARILCAddEditPage.getMaximumClassSizeTxtF()).clear().type('1')
        // Enable Waitlist toggle
        cy.get(ARILCAddEditPage.getEnableWaitlistToggle()).click()

        // Save session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.intercept('**/sessions/report').as(`getSession`).wait(`@getSession`)

        // Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
    })

    // for step 3,4,5,8 & 10
    it('Login to LE, Virtual venue "Meeting Description" should be visible', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)

        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName)
        LEDashboardPage.getLongWait()

        LEDashboardPage.getCourseCardBtnThenClick(ilcDetails.courseName)
        LEDashboardPage.getMediumWait()
        
        // Go to Sessions tab
        LECoursesPage.getCoursesPageTabBtnByName('Sessions')

        // Verify Virtual venue "Meeting Description" visible
        cy.get(LECourseDetailsILCModule.getSessionMeetingDescriptionTxt()).should('contain', commonDetails.meetingDescription)

        LESelectILCSession.getSessionByNameAndAddToCart(ilcDetails.sessionName)
        LEDashboardPage.getLongWait()

        // Go to Sessions tab
        LECoursesPage.getCoursesPageTabBtnByName('Sessions')

        // Verify Virtual venue "Meeting Description" visible
        cy.get(LECourseDetailsILCModule.getSessionMeetingDescriptionTxt()).should('contain', commonDetails.meetingDescription)

        // Click on the 'Choose View' button
        cy.get(LECourseDetailsILCModule.getChooseViewBtn()).click()
        // Click on the 'List View'

        cy.get(LECourseDetailsILCModule.getCalendarViewBtn()).click()

        // Verify Virtual venue "Meeting Description" visible
        cy.get(LECourseDetailsILCModule.getSessionMeetingDescriptionTxt()).should('contain', commonDetails.meetingDescription)
    })

    // for step 9
    it('Virtual venue "Meeting Description" should NOT be shown', () => {
        // Manange Template  ILC Location URL unchecked
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEDashboardPage.getShortWait()

        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Courses').should('be.visible').click()
        cy.url().should('include', '/#/learner-mgmt/courses')
        LEDashboardPage.getMediumWait()

        LEManageTemplateCoursesPage.getManageTemplateCoursesContainerByNameThenClick('Course Details')
        LEDashboardPage.getShortWait()

        LEManageTemplateCoursesPage.getEnableDisablePreEnrollment('true')
        LEDashboardPage.getShortWait()

        LEManageTemplateCoursesPage.getCheckUncheckedIlcLocationUrl('false')

        cy.apiLoginWithSession(userDetails.username2, userDetails.validPassword)

        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName)
        LEDashboardPage.getLongWait()

        LEDashboardPage.getCourseCardBtnThenClick(ilcDetails.courseName)
        LEDashboardPage.getMediumWait()
        
        // Go to Sessions tab
        LECoursesPage.getCoursesPageTabBtnByName('Sessions')
        LEDashboardPage.getMediumWait()

        // Verify Virtual venue "Meeting Description" should be hidden
        cy.get(LECourseDetailsILCModule.getSessionMeetingDescriptionTxt()).should('not.exist')
    })
})