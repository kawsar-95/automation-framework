import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import ARAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module";
import ARCourseSettingsAvailabilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import LECourseDetailsCurrModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsCurrModule'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectLearningObjectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal";
import { defaultThemeColors } from '../../../../../../helpers/TestData/Template/templateTheme'
import ARObservationChecklistsPage from '../../../../../../helpers/AR/pageObjects/OJT/ARObservationChecklistsPage'
import { ojtDetails } from '../../../../../../helpers/TestData/OJT/ojtDetails'


describe('C1752 AUT-403, AR - CURR - Curriculum Expiry Handling - Catalog, My Courses, & Dashboard', function(){ 
    before(function() {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LEDashboardPage.turnOnNextgenToggle()

        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    after(function() {
        // Delete Courses
        cy.deleteCourse(commonDetails.courseIDs[0])
        cy.deleteCourse(commonDetails.courseIDs[1], 'curricula')

        // delete User
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword) 
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36))
        })

        // Signin with system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LEDashboardPage.turnOffNextgenToggle()
    })

    it('Create Online Course with Expiry Date and Publish Course', () =>{ 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()

        cy.createCourse('Online Course')

        // Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click().click()

        // Select Allow Self Enrollment Specific Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        // Click on Add learning object tab
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).click()
        ARSelectLearningObjectModal.getObjectTypeByName('Observation Checklist')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        // Enter name in name  field under details
        cy.get(ARObservationChecklistsPage.getDetailsNameTxt()).clear().type(ojtDetails.ojtName)
        cy.get(ARObservationChecklistsPage.getDetailsDescription()).type(ojtDetails.ojtDescription)

        cy.get(ARObservationChecklistsPage.getReviewerIdsDDown()).click()
        cy.get(ARObservationChecklistsPage.getReviewerIdsDDownTxtF()).clear().type(users.sysAdmin.admin_sys_01_username)
        cy.get(ARObservationChecklistsPage.getReviewerIdsDDownOpt()).should('contain',users.sysAdmin.admin_sys_01_full_name)
        cy.get(ARObservationChecklistsPage.getReviewerIdsDDownOpt()).contains(users.sysAdmin.admin_sys_01_full_name).click()

    
        cy.get(ARDashboardPage.getModalSaveBtn()).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARDashboardPage.getModalSaveBtn()).should('not.exist')

        //Open Availability section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click().click()

        //Select Expiration 'Time from enrollment' Option
        cy.get(ARCourseSettingsAvailabilityModule.getExpirationRadioBtn()).contains('Time from enrollment').click().click()
        cy.get(ARCourseSettingsAvailabilityModule.getExpireInDaysTxtF()).type(3)

        // Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Course successfully published')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
    })

    it('Create Curriculum with Expiry Date and Publish Course', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()

        cy.createCourse('Curriculum')
        
        //Add courses to curriculum - verify multiple courses are added in the order they are selected
        ARSelectModal.SearchAndSelectFunction([ocDetails.courseName, courses.oc_filter_01_name])
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        // Open Enrollment Rules
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click().click()

        // Select Allow Self Enrollment Specific Radio Button
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')

        //Open Availability section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click().click()

        //Select Expiration 'Time from enrollment' Option
        cy.get(ARCourseSettingsAvailabilityModule.getExpirationRadioBtn()).contains('Time from enrollment').click().click()
        cy.get(ARCourseSettingsAvailabilityModule.getExpireInDaysTxtF()).type(5)

        //Publish Curriculum
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Course successfully published')
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
    })

    it('Login as learner and Verify the expiry date on Curriculum', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        LEDashboardPage.getShortWait()
        LEFilterMenu.SearchForCourseByName(currDetails.courseName)
        cy.get(LEDashboardPage.getLEEllipsesLoader()).should('not.exist')
        cy.get(LEDashboardPage.getCourseCardName()).contains(currDetails.courseName).click()
        LEDashboardPage.getMediumWait()
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner()).should('not.exist')

        cy.get(LECourseDetailsCurrModule.getEnrollActionButton()).should('be.visible').click()
        cy.get(LEDashboardPage.getToastNotificationMsg()).should("contain","You have been successfully enrolled.")
        cy.get(LECourseLessonPlayerPage.getButtonLoader()).should('not.exist')

        cy.get(LECourseDetailsCurrModule.getCourseExpiryMessage()).should('be.visible').and('contain', 'This course expires on:')
        LECourseDetailsCurrModule.verifyExpirationDate(LEDashboardPage.getFutureDate(5))
        cy.get(LECourseDetailsCurrModule.getCourseExpiryDateContainer()).should('have.css', 'background-color', defaultThemeColors.default_warning_rgb)

        cy.get(LECourseDetailsCurrModule.getCourseName()).contains(ocDetails.courseName).scrollIntoView().should('be.visible').click()
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner()).should('not.exist')
        LEDashboardPage.getMediumWait()
        cy.get(LECourseDetailsOCModule.getStartBtn()).should('be.visible').click()
        cy.get(LEDashboardPage.getToastNotificationMsg()).should("contain","You have been successfully enrolled.")
        cy.get(LECourseLessonPlayerPage.getButtonLoader()).should('not.exist')
        LECourseDetailsOCModule.verifyExpirationDate(LEDashboardPage.getFutureDate(5))
        cy.get(LECourseLessonPlayerPage.getCoursePlayerWarningBanner()).should('have.css', 'background-color', defaultThemeColors.default_warning_rgb)
        
        // OJT lesson name in header
        cy.get(LECourseLessonPlayerPage.getEarlyLeavePromptHeader()).should('be.visible').and('contain',ojtDetails.ojtName)

        // Button: Ready for Review
        cy.get(LECourseLessonPlayerPage.getSendNotificationBtn()).should('be.visible').and('contain', 'Ready for Review')

        // Ready for the review button should be enabled
        cy.get(LECourseLessonPlayerPage.getSendNotificationBtn()).click()

        // Status should be Pending Review
        cy.get(LECourseLessonPlayerPage.getCoursePlayerStatusModule()).eq(0).should('be.visible').and('contain','Status')
        cy.get(LECourseLessonPlayerPage.getCoursePlayerStatusModule()).eq(1).should('be.visible').and('contain','Pending Review')
        
        cy.get(LECourseLessonPlayerPage.getCoursePlayerCloseBtn() + " " + LECourseLessonPlayerPage.getCloseBtn()).should('be.visible').click()
        cy.get(LECourseLessonPlayerPage.getCoursePlayerCloseBtn() + " " + LECourseLessonPlayerPage.getCloseBtn()).should('not.exist')
        cy.get(LEDashboardPage.getLEEllipsesLoader()).should('not.exist')
    })

    it('Verify the expiry date is correctly reflected on Catalog and My Course Page', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)

        // check Catalog page
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Catalog')
        LEDashboardPage.getShortWait()
        LEFilterMenu.SearchForCourseByName(currDetails.courseName)
        cy.get(LEDashboardPage.getLEEllipsesLoader()).should('not.exist')
        cy.get(LEDashboardPage.getChooseViewBtn()).click()
        cy.get(LEDashboardPage.getCardViewBtn()).click()
        LEDashboardPage.verifyCourseExpirationDateOnCardView(currDetails.courseName, LEDashboardPage.getFutureDate(5))
        cy.get(LEDashboardPage.getChooseViewBtn()).click()
        cy.get(LEDashboardPage.getDetailViewBtn()).click()
        LEDashboardPage.verifyCourseExpirationDateOnDetailView(currDetails.courseName, LEDashboardPage.getFutureDate(5))

        LEFilterMenu.getSearchClearBtnThenClick()
        LEDashboardPage.getShortWait()
        LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
        cy.get(LEDashboardPage.getLEEllipsesLoader()).should('not.exist')
        LEDashboardPage.verifyCourseExpirationDateOnDetailView(ocDetails.courseName, LEDashboardPage.getFutureDate(5))
        cy.get(LEDashboardPage.getChooseViewBtn()).click()
        cy.get(LEDashboardPage.getCardViewBtn()).click()
        LEDashboardPage.verifyCourseExpirationDateOnCardView(ocDetails.courseName, LEDashboardPage.getFutureDate(5))

        // check My Course page
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Course')
        LEDashboardPage.getShortWait()
        cy.get(LEDashboardPage.getLEEllipsesLoader()).should('not.exist')
        cy.get(LEDashboardPage.getChooseViewBtn()).click()
        cy.get(LEDashboardPage.getCardViewBtn()).click()
        LEDashboardPage.verifyCourseExpirationDateOnCardView(currDetails.courseName, LEDashboardPage.getFutureDate(5))
        cy.get(LEDashboardPage.getChooseViewBtn()).click()
        cy.get(LEDashboardPage.getDetailViewBtn()).click()
        LEDashboardPage.verifyCourseExpirationDateOnDetailView(currDetails.courseName, LEDashboardPage.getFutureDate(5))

        LEDashboardPage.verifyCourseExpirationDateOnDetailView(ocDetails.courseName, LEDashboardPage.getFutureDate(5))
        cy.get(LEDashboardPage.getChooseViewBtn()).click()
        cy.get(LEDashboardPage.getCardViewBtn()).click()
        LEDashboardPage.verifyCourseExpirationDateOnCardView(ocDetails.courseName, LEDashboardPage.getFutureDate(5))
    })
})