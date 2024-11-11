import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import AREnrollUsersPage from '../../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
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
import ARDashboardAccountMenu from '../../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import AREditClientUserPage from '../../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage'
import ARILCSessionReportPage from '../../../../../../../helpers/AR/pageObjects/Reports/ARILCSessionReportPage'
import ARDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'

describe('C7519 AUT-701, AR - ILC - Waitlisted users can see Zoom URLs for sessions they have been waitlisted in', function(){
    before(function() {
        // Create a new user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.createUser(void 0, userDetails.username2, ["Learner"], void 0)

        //Signin with system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain.text',"GUI_Auto Sys_Admin_01")
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should('be.visible')

        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()

        //Select Portal Setting option from account menu
        cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()

        //Validate userGuid from URL
        cy.url().then((currentUrl) => { 
            let userID = currentUrl.slice(-36) 
            expect(userID).to.eq(`c7a56ad9-3230-4c63-a380-bf3a60813e88`)
        })

        //Validate portal setting page header
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text','Edit Client')
        cy.get(arDashboardPage.getUsersTab()).click()
        AREditClientUserPage.getTurnOffNextgenToggle()

        //Select save button within Portal settings 
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain.text',"GUI_Auto Sys_Admin_01")

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

        LEManageTemplateCoursesPage.getCheckUncheckedIlcLocationUrl('false')

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
        cy.get(ARVenueAddEditPage.getNameTxtF()).type(`${venueDetails.venueName} - Url`)

        //Enter valid description
        cy.get(ARVenueAddEditPage.getDescriptionTxtF()).clear()
        cy.get(ARVenueAddEditPage.getDescriptionTxtF()).type(venueDetails.description)

        //Enter valid max class size
        cy.get(ARVenueAddEditPage.getMaxClassSizeTxtF()).clear().type(1)

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

        ARVenueAddEditPage.AddFilter('Name', 'Contains', `${venueDetails.venueName} - Url`)
        arDashboardPage.getShortWait()

        ARVenueAddEditPage.selectTableCellRecord(`${venueDetails.venueName} - Url`, 2)

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

        LEManageTemplateCoursesPage.getCheckUncheckedIlcLocationUrl('true')
    })

    it('Create ILC with Session of Max Capacity = 1, and Enroll Learner', () => {
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

        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName], [users.learner01.learner_01_username], ilcDetails.sessionName)
        ARILCAddEditPage.getMediumWait()
    })

    it('Login to LE, Attempt to Enroll in Full Session, Verify Waitlist Warning', () => {
        // Login and enroll in session
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)

        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName)
        LEDashboardPage.getLongWait()

        LEDashboardPage.getCourseCardBtnThenClick(ilcDetails.courseName)
        LEDashboardPage.getMediumWait()
        
        //Go to uploads tab
        LECoursesPage.getCoursesPageTabBtnByName('Sessions')

        LESelectILCSession.getSessionByNameAndAddToCart(ilcDetails.sessionName)
        LEDashboardPage.getMediumWait()

        // Verify waitlist banner
        cy.get(LECourseDetailsILCModule.getWaitListTxt()).should('have.text', LECourseDetailsILCModule.getWaitListTxtMsg())

        // Verify Learner will not be able to see the Location/Venue URL
        cy.get(LECourseDetailsILCModule.getLocationUrl()).should('not.exist')

        // Login and enroll another Learner in session
        cy.apiLoginWithSession(userDetails.username2, userDetails.validPassword)

        LEDashboardPage.getTileByNameThenClick('Catalog')
        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName)
        LEDashboardPage.getLongWait()

        LEDashboardPage.getCourseCardBtnThenClick(ilcDetails.courseName)
        LEDashboardPage.getMediumWait()
        
        //Go to uploads tab
        LECoursesPage.getCoursesPageTabBtnByName('Sessions')

        LESelectILCSession.getSessionByNameAndAddToCart(ilcDetails.sessionName)
        LEDashboardPage.getMediumWait()

        // Verify waitlist banner
        cy.get(LECourseDetailsILCModule.getWaitListTxt()).should('have.text', LECourseDetailsILCModule.getWaitListTxtMsg())

        // Verify Learner will not be able to see the Location/Venue URL
        cy.get(LECourseDetailsILCModule.getLocationUrl()).should('not.exist')
    })

    it('Unenroll another learner and approve the other learner from the Waitlist', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getMediumWait()
        // Click on reports
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        // Click on ILC sessions
        cy.wrap(arDashboardPage.getMenuItemOptionByName('ILC Sessions'))
        arDashboardPage.getMediumWait()

        // Select ILC session which have multiple user enrolled
        arDashboardPage.A5AddFilter('Course', 'Starts With', ilcDetails.courseName)
        arDashboardPage.getMediumWait()
        cy.get(arDashboardPage.getGridTable()).click()
        arDashboardPage.getMediumWait()

        // Click on View Waitlist button
        arDashboardPage.getA5AddEditMenuActionsByNameThenClick('View Waitlist')
        arDashboardPage.getMediumWait()
        cy.get(ARILCSessionReportPage.getSessionWaitlistPageHeader()).should('have.text', 'GUIA Session - Waitlist')

        arDashboardPage.A5AddFilter('Username', 'Starts With', userDetails.username)
        arDashboardPage.getMediumWait()
        cy.get(arDashboardPage.getGridTable()).click()
        arDashboardPage.getMediumWait()

        arDashboardPage.getA5AddEditMenuActionsByNameThenClick('Promote from Waitlist')
        arDashboardPage.getMediumWait()

        // Unenroll another learner
        arDashboardPage.A5AddFilter('Username', 'Starts With', userDetails.username2)
        arDashboardPage.getMediumWait()
        cy.get(arDashboardPage.getGridTable()).click()
        arDashboardPage.getMediumWait()

        arDashboardPage.getA5AddEditMenuActionsByNameThenClick('Un-enroll')
        arDashboardPage.getShortWait()

        // Click Ok from delete modal
        cy.get(ARDeleteModal.getA5OKBtn()).click()
        arDashboardPage.getShortWait()
    })

    it('Verify Learner is Now ble to see the Location/Venue URL', () => {
        //Login and enroll in session
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword) 
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getShortWait()
        LEDashboardPage.getCourseCardBtnThenClick(ilcDetails.courseName)
        LEDashboardPage.getMediumWait()

        //Verify waitlist banner no longer exists
        cy.get(LECourseDetailsILCModule.getWaitListTxt()).should('not.exist')

        // Verify Learner will be able to see the Location/Venue URL
        cy.get(LECourseDetailsILCModule.getLocationUrl()).should('have.text', venueLinks.zoomMeetingLink)
    })
})