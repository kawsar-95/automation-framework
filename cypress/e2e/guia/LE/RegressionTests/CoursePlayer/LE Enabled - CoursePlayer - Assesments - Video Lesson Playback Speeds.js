import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import ARSelectLearningObjectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal'
import LECourseDetailsOCModule from '../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule'
import { resourcePaths, images, videos } from '../../../../../../helpers/TestData/resources/resources'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import ARCourseSettingsEnrollmentRulesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import { lessonVideo } from '../../../../../../helpers/TestData/Courses/oc'
import AREditClientUserPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage"
import A5FeatureFlagsPage, { featureFlagDetails } from '../../../../../../helpers/AR/pageObjects/FeatureFlags/A5FeatureFlagsPage'
import ARAddVideoLessonModal from '../../../../../../helpers/AR/pageObjects/Modals/ARAddVideoLessonModal'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import ARDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import LECoursesPage from '../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'


describe('C7508 - AUT779 -  Create Online Course with Learning Object Assesement with Max attempts and Enroll the learner ', function () {
    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0);
        //Signin as blat admin and navigate to feature flags
        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain.text', "GUI_Auto Blat_Admin_01")
        cy.visit('/admin/featureflags')
        //Validate portal setting page header
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text', 'Feature Flags')
        A5FeatureFlagsPage.getTurnOnOffFeatureFlagbyName(featureFlagDetails.EnablePlaybackSpeedSelection, 'false')
        //Select save button within Portal settings 
        cy.get(AREditClientUserPage.getSaveBtn()).click()

    })

    after(function () {
        //Delete Course 
        cy.deleteCourse(commonDetails.courseID)
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 3000 }).should('not.exist')
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 3000 }).should('not.exist')
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 3000 }).should('not.exist')
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Create Online Course with Video Lesson and Subtitle', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()

        cy.createCourse('Online Course', ocDetails.courseName)
        //Set enrollment rule - Allow self enrollment for all learners
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()

        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Add Video File Object Lesson Desktop Iframe
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Video')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()
        //Add Valid Name to Video Lesson
        ARAddVideoLessonModal.getAddCustomVideoLesson(lessonVideo.ocVideoName, 'true', '640', '480', 'URL', null, null, 'File', miscData.resource_video_folder_path, videos.subtitles_video_mp4, 'false', 'true')
        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), { timeout: 10000 }).should('contain', 'Course successfully published')

        //Enroll User
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
    })

    it('Verfiy that the option to allow playback speed adjustment is not available as default', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), { timeout: 15000 }).should('not.exist', { timeout: 15000 })
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName).click()
        //Start 1st Video Lesson
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), { timeout: 10000 }).should('not.exist', { timeout: 10000 })
        
        LECourseDetailsOCModule.getCourseDiscoveryAction(ocDetails.courseName, 'Start', true)
        cy.get(LEDashboardPage.getLEEllipsesLoader(), { timeout: 15000 }).should('not.exist')
        cy.get(LECourseLessonPlayerPage.getVideoPlayBtn(), { timeout: 15000 }).click({ force: true })
        cy.get(LECourseLessonPlayerPage.getPlaybackSpeedBtn()).should('not.exist')
        
        cy.get(LECoursesPage.getModalCloseBtn()).click({ force: true })
       
      

    })

    it('Toggle on the feature flag', () => {
        //Signin as blat admin and navigate to feature flags
        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain.text', "GUI_Auto Blat_Admin_01")
        cy.visit('/admin/featureflags')
        //Validate portal setting page header
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text', 'Feature Flags')
        A5FeatureFlagsPage.getTurnOnOffFeatureFlagbyName(featureFlagDetails.EnablePlaybackSpeedSelection, 'true')
        //Select save button within Portal settings 
        cy.get(AREditClientUserPage.getSaveBtn()).click()
        
        cy.get(ARDashboardAccountMenu.getA5AccountSettingsBtn()).click()
        cy.get(ARDashboardAccountMenu.getA5LogOffBtn()).click({ force: true })
    })

    it('Edit course and toggle on the the Allow Playback Speed Adjustment toggle btn', () => {
        //Navigate to the courses and edit the course
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))

        cy.editCourse(ocDetails.courseName)
        //Toggle on the Allow Playback Speed Adjustment toggle btn
        AROCAddEditPage.getEditBtnByLessonNameThenClick(lessonVideo.ocVideoName)
        ARAddVideoLessonModal.getTurnOnOffAllowPlaybackSpeedAdjustmentToggleBtn('true')
        cy.get(ARAddVideoLessonModal.getApplyBtn()).click()
        LEDashboardPage.getShortWait()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), { timeout: 10000 }).should('contain', 'Course successfully published')
    })

    it('Verfiy that the option to allow playback speed adjustment is available', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), { timeout: 15000 }).should('not.exist', { timeout: 15000 })
        cy.get(LEDashboardPage.getCourseCardName()).contains(ocDetails.courseName).click()
        //Start 1st Video Lesson
        cy.get(LECourseLessonPlayerPage.getLEWaitSpinner(), { timeout: 10000 }).should('not.exist', { timeout: 10000 })
        
        LECourseDetailsOCModule.getCourseDiscoveryAction(ocDetails.courseName, 'Resume', true)
        cy.get(LEDashboardPage.getLEEllipsesLoader(), { timeout: 15000 }).should('not.exist')
        cy.get(LECourseLessonPlayerPage.getVideoPlayBtn()).click()
        cy.get(LECourseLessonPlayerPage.getPlaybackSpeedBtn()).should('exist')
        LEDashboardPage.getVShortWait()
        cy.get(LECoursesPage.getModalCloseBtn()).click()
       
    })

})