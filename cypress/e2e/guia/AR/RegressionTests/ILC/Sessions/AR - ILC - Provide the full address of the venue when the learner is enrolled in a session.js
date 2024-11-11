import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import arAddMoreCourseSettingsModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LECourseDetailsILCModule from '../../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsILCModule'
import LEFilterMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import { ilcDetails, sessions } from '../../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../../helpers/TestData/users/UserDetails'
import { venueDetails, venueLinks, venueTypes } from '../../../../../../../helpers/TestData/Venue/venueDetails'
import ARVenueAddEditPage from '../../../../../../../helpers/AR/pageObjects/Venue/ARVenueAddEditPage'
import ARPublishModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARPublishModal'
import LECoursesPage from '../../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LEProfilePage from '../../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import { departments } from '../../../../../../../helpers/TestData/Department/departments'
import ARSelectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'

describe('C7534 AUT-785, AR - ILC - Provide the full address of the venue when the learner is enrolled in a session', function(){
    before(function() {
        // Create a new user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)

        // Create required venue
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Venues'))
        cy.intercept('/api/rest/v2/admin/reports/venues/operations').as('getVenues').wait('@getVenues')
        
        // Create Url Venue
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Add Venue'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Add Venue')).click()

        // Select venue type
        cy.get(ARVenueAddEditPage.getTypeDDown()).click()
        cy.get(ARVenueAddEditPage.getTypeDDownOpt()).contains('Url').click()

        // Enter valid name
        cy.get(ARVenueAddEditPage.getNameTxtF()).type(`${venueDetails.venueName} - Url`)

        // Enter valid description
        cy.get(ARVenueAddEditPage.getDescriptionTxtF()).clear()
        cy.get(ARVenueAddEditPage.getDescriptionTxtF()).type(venueDetails.description)

        // Enter valid max class size
        cy.get(ARVenueAddEditPage.getMaxClassSizeTxtF()).clear().type(5)

        // Fill in type specific fields
        cy.get(ARVenueAddEditPage.getPhoneTxtF()).type(venueDetails.phoneNumber)

        // Enter valid Url
        cy.get(ARVenueAddEditPage.getUrlTxtF()).type(venueLinks.zoomMeetingLink)

        // Save Venue
        ARVenueAddEditPage.WaitForElementStateToChange(ARVenueAddEditPage.getSaveBtn())
        cy.get(ARVenueAddEditPage.getSaveBtn()).click()
        cy.get(ARVenueAddEditPage.getToastSuccessMsg()).should('contain', 'Venue has been created.')
        cy.get(ARVenueAddEditPage.getToastCloseBtn()).click()

        // Create Physical Venue
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Add Venue'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Add Venue')).click()

        // Select venue type
        cy.get(ARVenueAddEditPage.getTypeDDown()).click()
        cy.get(ARVenueAddEditPage.getTypeDDownOpt()).contains(venueTypes.classroom).click()

        // Enter valid name
        cy.get(ARVenueAddEditPage.getNameTxtF()).type(`${venueDetails.venueName} - Physical`)

        // Enter valid description
        cy.get(ARVenueAddEditPage.getDescriptionTxtF()).clear()
        cy.get(ARVenueAddEditPage.getDescriptionTxtF()).type(venueDetails.description)

        //Enter valid max class size
        cy.get(ARVenueAddEditPage.getMaxClassSizeTxtF()).clear().type(venueDetails.maxClassSize)

        //Select department
        cy.get(ARVenueAddEditPage.getDepartmentBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.dept_top_name])

        //Fill in type specific fields
        cy.get(ARVenueAddEditPage.getAddressTxtF()).type(venueDetails.address)
        cy.get(ARVenueAddEditPage.getCountryDDOwn()).click()
        cy.get(ARVenueAddEditPage.getCountryDDownSearchTxtF()).type(venueDetails.country)
        cy.get(ARVenueAddEditPage.getCountryDDOwnOpt()).contains(venueDetails.country).click()
        cy.get(ARVenueAddEditPage.getProvinceDDown()).click()
        cy.get(ARVenueAddEditPage.getProvinceDDownSearchTxtF()).type(venueDetails.province)
        cy.get(ARVenueAddEditPage.getProvinceDDOwnOpt()).contains(venueDetails.province).click()
        cy.get(ARVenueAddEditPage.getCityTxtF()).type(venueDetails.city)
        cy.get(ARVenueAddEditPage.getPostalCodeTxtF()).type(venueDetails.zip)

        // Save Venue
        ARVenueAddEditPage.WaitForElementStateToChange(ARVenueAddEditPage.getSaveBtn())
        cy.get(ARVenueAddEditPage.getSaveBtn()).click()
        cy.get(ARVenueAddEditPage.getToastSuccessMsg()).should('contain', 'Venue has been created.')
        cy.get(ARVenueAddEditPage.getToastCloseBtn()).click()
    })

    after(function() {
         // Delete User
         cy.apiLoginWithSession(userDetails.username, users.sysAdmin.admin_sys_01_password)
         cy.get(LEDashboardPage.getNavProfile()).click()  
         cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
         cy.url().then((currentURL) => {
             cy.deleteUser(currentURL.slice(-36));
         })

        // Delete Course
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')

        // Sign into admin side as sys admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        // navigate to Venues and delete venue
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Venues'))
        cy.intercept('/api/rest/v2/admin/reports/venues/operations').as('getVenues').wait('@getVenues')
        
        arDashboardPage.getMediumWait()
        ARVenueAddEditPage.AddFilter('Name', 'Contains', venueDetails.venueName)
        arDashboardPage.getShortWait()

        // Select 1st Venue
        cy.get(ARVenueAddEditPage.getGridTable()).eq(0).click()
        cy.wrap(ARVenueAddEditPage.WaitForElementStateToChange(ARVenueAddEditPage.getAddEditMenuActionsByName('Delete Venue')), 1000)
        cy.get(ARVenueAddEditPage.getAddEditMenuActionsByName('Delete Venue')).click()
        arDashboardPage.getShortWait()

        cy.get(ARPublishModal.getContinueBtn()).click()
        arDashboardPage.getShortWait()

        // Select 2nd Venue
        arDashboardPage.getLShortWait()
        cy.get(ARVenueAddEditPage.getGridTable()).eq(0).click()
        cy.wrap(ARVenueAddEditPage.WaitForElementStateToChange(ARVenueAddEditPage.getAddEditMenuActionsByName('Delete Venue')), 1000)
        cy.get(ARVenueAddEditPage.getAddEditMenuActionsByName('Delete Venue')).click()
        arDashboardPage.getShortWait()

        cy.get(ARPublishModal.getContinueBtn()).click()
        arDashboardPage.getShortWait()

        cy.get(arDashboardPage.getNoResultMsg()).should('be.visible')
    })

    it('Create ILC with Session of Physical and Url Venue', () => {
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
        cy.get(ARILCAddEditPage.getSessionDetailsVenuestxtF()).type(`${venueDetails.venueName} - Url`)
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getSessionDetailsVenuesDDownOpt()).contains(`${venueDetails.venueName} - Url`).click()
        ARILCAddEditPage.getShortWait()

        // Add instructor with one that DOES have an email address associated to the zoom account
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsTxtF())
            .type(users.instructor01.instructor_01_username)
        cy.get(ARILCAddEditPage.getSessionDetailsInstructorsDDownOpt()).contains(users.instructor01.instructor_01_lname).click()

        // Set self enrollment = all learners
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()

        // Save session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.intercept('**/sessions/report').as(`getSession`).wait(`@getSession`)

        // add another session
        ARILCAddEditPage.getAddSession(sessions.sessionName_1, ARILCAddEditPage.getFutureDate(2))
        cy.get(ARILCAddEditPage.getSessionDetailsDescriptionTxtF()).type(`${ilcDetails.sessionDescription}`)

        // Add Venue
        cy.get(ARILCAddEditPage.getSessionDetailsVenuesDDown()).click()
        cy.get(ARILCAddEditPage.getSessionDetailsVenuestxtF()).type(`${venueDetails.venueName} - Physical`)
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getSessionDetailsVenuesDDownOpt()).contains(`${venueDetails.venueName} - Physical`).click()
        ARILCAddEditPage.getShortWait()

        // Set self enrollment = all learners
        cy.get(arCoursesPage.getElementByAriaLabelAttribute(ARILCAddEditPage.getExpandEnrollmentRulesBtn())).click()
        ARILCAddEditPage.getShortWait()
        cy.get(ARILCAddEditPage.getAllowSelfEnrollmentRadioBtn()).contains('All Learners').click()

        // Save Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()

        // Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
    })

    it('Login to LE, Attempt to Enroll Session, Verify full address of the venue', () => {
        // Login and enroll in session
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)

        LEDashboardPage.getTileByNameThenClick('Catalog')

        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName)
        LEDashboardPage.getLongWait()

        LEDashboardPage.getCourseCardBtnThenClick(ilcDetails.courseName)
        LEDashboardPage.getMediumWait()

        // enroll into a Session with a Physical Venue
        cy.get(LECourseDetailsILCModule.getSessionHeader()).contains(new RegExp("^" + sessions.sessionName_1 + "$", "g")).parents(LECourseDetailsILCModule.getSessionContainer()).within(() => {
            cy.get(LECourseDetailsILCModule.getEnrollBtn()).click()
        })
        LEDashboardPage.getLongWait()

        // Verify the Address will be visible in the Location field of the session
        cy.get(LECourseDetailsILCModule.getLocationVenue()).should('contain', venueDetails.address)

        // Verify Learner will not be able to see the Location/Venue URL
        cy.get(LECourseDetailsILCModule.getLocationUrl()).should('not.exist')

        // the Address will be included in the ICS file
        cy.window().document().then(function (doc) {
            doc.addEventListener('click', () => {
              // this adds a listener that reloads your page 
              // after 5 seconds from clicking the download button
              setTimeout(function () { doc.location.reload() }, 5000)
            })
            cy.get(LECourseDetailsILCModule.getAddToCalendarBtn()).click()
        })       
        LEDashboardPage.getLongWait()
    })

    it('Login to LE, Attempt to Enroll Session, Verify Url of the venue', () => {
        // Login and enroll in session
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)

        LEDashboardPage.getTileByNameThenClick('Catalog')

        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName)
        LEDashboardPage.getLongWait()

        LEDashboardPage.getCourseCardBtnThenClick(ilcDetails.courseName)
        LEDashboardPage.getMediumWait()

        // Go to Sessions tab
        LECoursesPage.getCoursesPageTabBtnByName('Sessions')
        LEDashboardPage.getMediumWait()

        // enroll into a Session with a Virtual Venue
        cy.get(LECourseDetailsILCModule.getSessionHeader()).contains(new RegExp("^" + ilcDetails.sessionName + "$", "g")).parents(LECourseDetailsILCModule.getSessionContainer()).within(() => {
            cy.get(LECourseDetailsILCModule.getEnrollBtn()).click()
        })
        LEDashboardPage.getLongWait()

        // Verify Learner will not be able to see the Location/Venue URL
        cy.get(LECourseDetailsILCModule.getLocationUrl()).should('exist')

        // the URL will be included in the ICS file
        cy.window().document().then(function (doc) {
            doc.addEventListener('click', () => {
              // this adds a listener that reloads your page 
              // after 5 seconds from clicking the download button
              setTimeout(function () { doc.location.reload() }, 5000)
            })
            cy.get(LECourseDetailsILCModule.getAddToCalendarBtn()).click()
        })
        LEDashboardPage.getLongWait()
    })
})