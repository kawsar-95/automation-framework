
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import arDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { ocDetails} from '../../../../../../helpers/TestData/Courses/oc'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import AREditClientUserPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage"
import ARAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import ARAddVideoLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddVideoLessonModal'
import {  lessonVideo } from '../../../../../../helpers/TestData/Courses/oc'
import { resourcePaths, videos} from '../../../../../../helpers/TestData/resources/resources'
import ARCourseSettingsAvailabilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import ARCURRAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/CURR/ARCURRAddEditPage'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import AdminNavationModuleModule from '../../../../../../helpers/AR/modules/AdminNavationModule.module'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'

describe('C7520 - AUT-791 - GUIA-Auto: NLE-4087 - Course Player - Collapsing causes dismissed expiry banner to appear again', function () {

    before(function () {
        //Signin as blat admin and navigate to feature flags
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain',"GUI_Auto Sys_Admin_01")
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        //Select Portal Setting option from account menu
        cy.get(arDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        //Validate portal setting page header
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text','Edit Client')
        cy.get(arDashboardPage.getUsersTab()).click()
        // //Turn on next gen toggle button
        AREditClientUserPage.getTurnOnNextgenToggle() 
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        //Navigate to dashboard page
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain',"GUI_Auto Sys_Admin_01")
    })
    
    after(function () {
        //Signin as blat admin and navigate to feature flags
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain',"GUI_Auto Sys_Admin_01")
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        //Select Portal Setting option from account menu
        cy.get(arDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        //Validate portal setting page header
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text','Edit Client')
        cy.get(arDashboardPage.getUsersTab()).click()
        // //Turn on next gen toggle button
        AREditClientUserPage.getTurnOffNextgenToggle() 
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        //Navigate to dashboard page
        arDashboardPage.getShortWait()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain',"GUI_Auto Sys_Admin_01")
        //Delete the course 
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Create Online Course with Learning Assesement with Questionnire and Video Lesson', () =>{
        //Sign into admin side as sys admin, navigate to Courses
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        AdminNavationModuleModule.navigateToCoursesPage()
        cy.createCourse('Online Course', ocDetails.courseName)
        //Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        LEDashboardPage.getShortWait()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Add Assessment lesson object to the course 
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Video')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        //Add Valid Name to Video Lesson
        ARAddVideoLessonModal.getAddCustomVideoLesson(lessonVideo.ocVideoName + '2', 'true', '640', '480', 'URL', null, null, 'File', resourcePaths.resource_video_folder_selectFile, videos.subtitles_video_mp4, 'false', 'true')
        //Add expiration and due date
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        ARCURRAddEditPage.getMediumWait() //Wait for toggles to become enabled
        cy.get(ARCourseSettingsAvailabilityModule.getExpirationRadioBtn()).contains('Time from enrollment').click()
        ARDashboardPage.getVShortWait()
        cy.get(ARCourseSettingsAvailabilityModule.getExpireInDaysTxtF()).clear().type('2')
        ARDashboardPage.getVShortWait()
        cy.get(ARCourseSettingsAvailabilityModule.getDueDateRadioBtn()).contains('Time from enrollment').click()
        ARDashboardPage.getVShortWait()
        cy.get(ARCourseSettingsAvailabilityModule.getDueInDaysTxtF()).clear().type('2')

        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Course successfully published')
        //Enroll User
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
        LEDashboardPage.getShortWait()
    })

    it('Login as learner and verify Due and Expiry Date banners',() => {
        //Sign into LE, go to curriculum
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        LEDashboardPage.getTileByNameThenClick('My Courses')
        LEDashboardPage.getCourseCardBtnThenClick(ocDetails.courseName)
        LEDashboardPage.getMediumWait()
        cy.get(LECourseLessonPlayerPage.getExpandCourseDetailsDownBtn()).click()
        LEDashboardPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getCoursePlayerWarningBanner()).should('be.visible')
        LEDashboardPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getExpandCourseDetailsUpBtn()).click()
        LEDashboardPage.getMediumWait()
        cy.get(LECourseLessonPlayerPage.getCoursePlayerWarningBanner()).should('not.exist')
        LEDashboardPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getCollapseDetailsBtn()).click()
        LEDashboardPage.getShortWait()
        cy.get(LECourseLessonPlayerPage.getCoursePlayerWarningBanner()).should('be.visible')
        LEDashboardPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getWarningBannerDissmissBtn()).click({multiple:true})
        LEDashboardPage.getMediumWait()
        cy.get(LECourseLessonPlayerPage.getCoursePlayerWarningBanner()).should('not.exist')
        LEDashboardPage.getVShortWait()
        cy.get(LECourseLessonPlayerPage.getCloseBtn()).click()
        LECourseLessonPlayerPage.getLongWait()
        //Detele the user
        cy.get(LEDashboardPage.getNavProfile()).click()
        LEDashboardPage.getVShortWait()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

})