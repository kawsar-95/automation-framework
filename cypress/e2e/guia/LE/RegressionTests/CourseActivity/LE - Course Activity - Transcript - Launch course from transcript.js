import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LETranscriptPage from '../../../../../../helpers/LE/pageObjects/User/LETranscriptPage'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import AREnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import AREditClientUserPage from '../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage'
import A5FeatureFlagsPage from '../../../../../../helpers/AR/pageObjects/FeatureFlags/A5FeatureFlagsPage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import ARAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'



describe('AUT-796 C7512 GUIA-Story NLE-3783 - Transcript - Launch course from transcript', function(){

    before(function () {
        // Login as admin/ Blatant admin.
        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')
        //Turn the EnableTranscriptImprovements feature flag on
        A5FeatureFlagsPage.turnOnOffFeatureFlagbyName('EnableTranscriptImprovements', 'true')
    })
    after(function () {
        //Sign in as system admin and turn off nextgen toggle button
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LEDashboardPage.turnOffNextgenToggle()
        //Delete user via API
        cy.deleteUser(userDetails.userID)
        //Delete the course 
        cy.deleteCourse(commonDetails.courseID);
    })

  
    it('Create course and print transcript', () => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0) //Create a Learner
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCoursesReport()
        //Create Course
        cy.createCourse('Online Course', ocDetails.courseName)
         //Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules'),{timeout:10000}).should('have.attr','class').and('include','enabled')
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        // Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('be.visible')
        
        // Enroll User 
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])

        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn())).should('be.visible').click()
        ARDashboardAccountMenu.getLearnerOrReviewerExperienceBtnByName('Learner Experience')
        cy.url().should('include', '#/dashboard')
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        LESideMenu.getLEMenuItemsByNameThenClick('Transcript') 
        cy.url().should('include', '#/transcript')
        cy.get(LETranscriptPage.getTranscriptPageTitle()).should('contain', 'Transcript for GUI_Auto Sys_Admin_01')
        cy.get(LETranscriptPage.getUsername()).should('contain', 'GUIAutoSA01')
        cy.get(LETranscriptPage.getPrintTranscriptBtn()).should('be.visible').click()
        cy.go('back')
       
    })

    it('Turn on NextGen Toggle and print Transcript', () => {
        
        //Sign in as system admin and turn on the nextgen toggle
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LEDashboardPage.turnOnNextgenToggle()
        //Navigate to dashboard page
        cy.visit("/admin/dashboard")
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn())).should('be.visible').click()
        ARDashboardAccountMenu.getLearnerOrReviewerExperienceBtnByName('Learner Experience')
        cy.url().should('include', '#/dashboard')
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        LESideMenu.getLEMenuItemsByNameThenClick('Transcript') 
        cy.url().should('include', '#/transcript')
        cy.get(LETranscriptPage.getTranscriptPageTitle()).should('contain', 'Transcript for GUI_Auto Sys_Admin_01')
        cy.get(LETranscriptPage.getUsername()).should('contain', 'GUIAutoSA01')
        cy.get(LETranscriptPage.getPrintTranscriptBtn()).should('be.visible').click()
        cy.go('back')
        //The Discovery modal is the full mobile device width, and the resources show stacked (like it did for the desktop view)
        cy.viewport('iphone-x')
        LEDashboardPage.getShortWait()
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        LESideMenu.getLEMenuItemsByNameThenClick('Transcript') 
        cy.url().should('include', '#/transcript')
        cy.get(LETranscriptPage.getPrintTranscriptBtn()).should('be.visible').click()
        cy.go('back')
        cy.viewport(1280, 720) //Enlarge viewport 
    })
   
 })


