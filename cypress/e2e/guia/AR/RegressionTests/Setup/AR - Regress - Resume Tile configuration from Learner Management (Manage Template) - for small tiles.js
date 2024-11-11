
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARCBAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/CB/ARCBAddEditPage"
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDashboardAccountMenu from "../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu"
import ARAddVideoLessonModal from "../../../../../../helpers/AR/pageObjects/Modals/ARAddVideoLessonModal"
import ARSelectLearningObjectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectLearningObjectModal"
import AREditClientUserPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage"
import ARTemplatesReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARTemplatesReportPage"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import LECourseDetailsOCModule from "../../../../../../helpers/LE/pageObjects/Courses/LECourseDetailsOCModule"
import LECourseLessonPlayerPage from "../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage"
import LECoursesPage from "../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage"
import LEDashboardPage, { privateDashboardContainerName } from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LESideMenu from "../../../../../../helpers/LE/pageObjects/Menu/LESideMenu"
import LEManageTemplateMenu from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateMenu"
import LEManageTemplatePrivateDashboardPage from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplatePrivateDashboardPage"
import LEManageTemplateTiles from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateTiles"
import LEProfilePage from "../../../../../../helpers/LE/pageObjects/User/LEProfilePage"
import { collaborationDetails } from "../../../../../../helpers/TestData/Collaborations/collaborationDetails"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { lessonVideo, ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { miscData } from "../../../../../../helpers/TestData/Misc/misc"
import { videos } from "../../../../../../helpers/TestData/resources/resources"
import { userDetails } from "../../../../../../helpers/TestData/users/UserDetails"
import { users } from "../../../../../../helpers/TestData/users/users"



describe('C6346 - AUT-634 - AR - Regress - Resume Tile configuration from Learner Management (Manage Template) - For Small Tile ', () => {

    before('turning on the next gen ', function () {
        // Create learner user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        //Signin with system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        LEDashboardPage.turnOnNextgenToggle()

    })

    after(function () {

        //Signin with system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LEDashboardPage.turnOffNextgenToggle()
        //Delete the created User
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        //Cleanup - Get userID and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })

        //sign in and navigate to manage template before each test
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        //Need to scroll to bottom of side menu to see template button
        cy.get(LESideMenu.getSideMenu()).should('be.visible')
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        cy.url().should('include', '/#/learner-mgmt/private-dashboard')
        cy.get(LEManageTemplateMenu.getDepartmentName()).should('contain', 'Top Level Dept')
        //Clicking on content
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')

        // Deleteing the container
        cy.get(LEManageTemplateTiles.getContentModule()).find(LEManageTemplateTiles.getContainer()).its('length').then(($length) => {
            cy.get(LEManageTemplateTiles.getContainerByIndex($length)).within(() => {
                cy.get(LEManageTemplateTiles.getElementByTitleAttribute('Delete')).click({ force: true })
            })
        })

        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()

        cy.get(LEManageTemplateTiles.getChangesSavedBanner(), { timeout: 15000 }).should('be.visible')

    })



    it('create a Container with 5 small tiles', () => {
        //sign in and navigate to manage template before each test
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        //Need to scroll to bottom of side menu to see template button
        cy.get(LESideMenu.getSideMenu()).should('be.visible')
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        cy.url().should('include', '/#/learner-mgmt/private-dashboard')
        cy.get(LEManageTemplateMenu.getDepartmentName()).should('contain', 'Top Level Dept')
        //Clicking on content
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')
        // Adding a new container
        cy.get(LEManageTemplateTiles.getContentModule()).find(LEManageTemplateTiles.getContainer()).its('length').then(($length) => {
            //Add new container
            LEManageTemplateTiles.getAddNewContainer($length + 1, 'Tile', privateDashboardContainerName.private_dashboard_small_tile)
            //Adding 5 Resume tiles
            LEManageTemplateTiles.getAddNewTile(privateDashboardContainerName.private_dashboard_small_tile, 'Resume')
            LEManageTemplateTiles.getAddNewTile(privateDashboardContainerName.private_dashboard_small_tile, 'Resume')
            LEManageTemplateTiles.getAddNewTile(privateDashboardContainerName.private_dashboard_small_tile, 'Resume')
            LEManageTemplateTiles.getAddNewTile(privateDashboardContainerName.private_dashboard_small_tile, 'Resume')
            LEManageTemplateTiles.getAddNewTile(privateDashboardContainerName.private_dashboard_small_tile, 'Resume')

            //clicking on the show lable toggle button
            cy.get(LEManageTemplateTiles.getContainerByIndex($length + 1)).within(() => {
                cy.get(LECoursesPage.getToggleSwitchLable()).contains('Show Label').parent().within(() => {
                    cy.get(LECoursesPage.getToggleSwitchBtnBySibling()).click({ force: true })
                })
            })

        })

        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()

        cy.get(LEManageTemplateTiles.getChangesSavedBanner(), { timeout: 15000 }).should('be.visible')
    })

    it('verifying in the learner side ', () => {
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword, "#/login")
        cy.url().should('include', '/#/dashboard')
        cy.get(LEDashboardPage.getDashboardPageTitle()).should('contain', 'Welcome,')

        cy.scrollTo('bottom')
        LEDashboardPage.getShortWait()
        LEDashboardPage.getPrivateDashboardContainerHeaderByName(privateDashboardContainerName.private_dashboard_small_tile).should('be.visible')
        LEDashboardPage.getPrivateDashboardContainerHeaderByName(privateDashboardContainerName.private_dashboard_small_tile).parent().within(() => {
            cy.get(LEDashboardPage.getResumeTileName()).first().should('have.text', 'View Catalog').click()
        })
        cy.url().should('include', '/#/catalog/')
    })

})

describe('C6346 - AUT-634 - AR - Regress - Resume Tile configuration from Learner Management (Manage Template) - For Medium Tile', () => {
    before('turning on the next gen ', function () {
        // Create learner user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LEDashboardPage.turnOnNextgenToggle()


    })

    it('Create Online Course with Video Lesson and Subtitle', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()

        cy.createCourse('Online Course', ocDetails.courseName)
        //Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()

        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Add Video File Object Lesson Desktop Iframe
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Video')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()

        //Add Valid Name to Video Lesson
        ARAddVideoLessonModal.getAddCustomVideoLesson(lessonVideo.ocVideoName, 'true', '640', '480', 'URL', null, null, 'File', miscData.resource_video_folder_path, videos.video_small, 'false', 'true')
        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), { timeout: 10000 }).should('contain', 'Course successfully published')

        //Enroll User
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
    })

    it('create a Container with 5 small tiles', () => {
        //sign in and navigate to manage template before each test
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        //Need to scroll to bottom of side menu to see template button
        cy.get(LESideMenu.getSideMenu()).should('be.visible')
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        cy.url().should('include', '/#/learner-mgmt/private-dashboard')
        cy.get(LEManageTemplateMenu.getDepartmentName()).should('contain', 'Top Level Dept')
        //Clicking on content
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')
        // Adding a new container
        cy.get(LEManageTemplateTiles.getContentModule()).find(LEManageTemplateTiles.getContainer()).its('length').then(($length) => {
            //Add new container
            LEManageTemplateTiles.getAddNewContainer($length + 1, 'Tile', privateDashboardContainerName.private_dashboard_medium_tile)
            //Adding 5 Resume tiles
            LEManageTemplateTiles.getAddNewTile(privateDashboardContainerName.private_dashboard_medium_tile, 'Resume')
            LEManageTemplateTiles.getAddNewTile(privateDashboardContainerName.private_dashboard_medium_tile, 'Resume')
            LEManageTemplateTiles.getAddNewTile(privateDashboardContainerName.private_dashboard_medium_tile, 'Resume')

            //clicking on the show lable toggle button
            cy.get(LEManageTemplateTiles.getContainerByIndex($length + 1)).within(() => {
                cy.get(LECoursesPage.getToggleSwitchLable()).contains('Show Label').parent().within(() => {
                    cy.get(LECoursesPage.getToggleSwitchBtnBySibling()).click({ force: true })
                })
            })

        })

        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()

        cy.get(LEManageTemplateTiles.getChangesSavedBanner(), { timeout: 15000 }).should('be.visible')
    })

    it('Login in into the learner side and put the course into resume', () => {
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
        LEDashboardPage.getVShortWait()
        cy.get(LECoursesPage.getModalCloseBtn()).click({ force: true })
        LEDashboardPage.getVShortWait()
    })

    it('Verify Resume tiles for 3 Medium tiles', () => {
        //sign in and navigate to manage template before each test
        cy.apiLoginWithSession(userDetails.username, users.sysAdmin.admin_sys_01_password, "#/login")
        cy.url().should('include', '/#/dashboard')
        cy.get(LEDashboardPage.getDashboardPageTitle()).should('contain', 'Welcome,')

        cy.scrollTo('bottom')
        LEDashboardPage.getPrivateDashboardContainerHeaderByName(privateDashboardContainerName.private_dashboard_medium_tile).parent().within(() => {
            cy.get(LEDashboardPage.getResumeTitleHeaderContainer()).should('have.length', 3)
            // Asserting Resume tile and its course name 
            cy.get(LEDashboardPage.getResumeTileCourseName()).first().contains(ocDetails.courseName).should('exist').and('be.visible')
            //Asserting Resume tile text
            cy.get(LEDashboardPage.getResumeTileText()).first().should('have.text', 'Resume')

        })
    })


    it(" Clearn up", function () {

        cy.deleteCourse(commonDetails.courseID)
        //Signin with system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LEDashboardPage.turnOffNextgenToggle()


        //Delete the created User
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        //Cleanup - Get userID and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })

        //sign in and navigate to manage template before each test
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        //Need to scroll to bottom of side menu to see template button
        cy.get(LESideMenu.getSideMenu()).should('be.visible')
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        cy.url().should('include', '/#/learner-mgmt/private-dashboard')
        cy.get(LEManageTemplateMenu.getDepartmentName()).should('contain', 'Top Level Dept')
        //Clicking on content
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')

        // Deleteing the container
        cy.get(LEManageTemplateTiles.getContentModule()).find(LEManageTemplateTiles.getContainer()).its('length').then(($length) => {
            cy.get(LEManageTemplateTiles.getContainerByIndex($length)).within(() => {
                cy.get(LEManageTemplateTiles.getElementByTitleAttribute('Delete')).click({ force: true })
            })
        })

        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()

        cy.get(LEManageTemplateTiles.getChangesSavedBanner(), { timeout: 15000 }).should('be.visible')

    })
})


describe('C6346 - AUT-634 - AR - Regress - Resume Tile configuration from Learner Management (Manage Template) - For Large tile', () => {
    before('turning on the next gen ', function () {
        // Create learner user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        //Signin with system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        LEDashboardPage.turnOnNextgenToggle()
        


    })

    it('Create Online Course with Video Lesson and Subtitle', () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()

        cy.createCourse('Online Course', ocDetails.courseName)
        //Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()

        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        //Add Video File Object Lesson Desktop Iframe
        cy.get(AROCAddEditPage.getAddLearningObjectBtn()).should('have.attr', 'aria-disabled', 'false').click()
        ARSelectLearningObjectModal.getObjectTypeByName('Video')
        cy.get(ARSelectLearningObjectModal.getNextBtn()).click()

        //Add Valid Name to Video Lesson
        ARAddVideoLessonModal.getAddCustomVideoLesson(lessonVideo.ocVideoName, 'true', '640', '480', 'URL', null, null, 'File', miscData.resource_video_folder_path, videos.video_small, 'false', 'true')
        //Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), { timeout: 10000 }).should('contain', 'Course successfully published')

        //Enroll User
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ocDetails.courseName], [userDetails.username])
    })

    it('create a Container with 5 small tiles', () => {
        //sign in and navigate to manage template before each test
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        //Need to scroll to bottom of side menu to see template button
        cy.get(LESideMenu.getSideMenu()).should('be.visible')
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        cy.url().should('include', '/#/learner-mgmt/private-dashboard')
        cy.get(LEManageTemplateMenu.getDepartmentName()).should('contain', 'Top Level Dept')
        //Clicking on content
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')
        // Adding a new container
        cy.get(LEManageTemplateTiles.getContentModule()).find(LEManageTemplateTiles.getContainer()).its('length').then(($length) => {
            //Add new container
            LEManageTemplateTiles.getAddNewContainer($length + 1, 'Tile', privateDashboardContainerName.private_dashboard_large_tile)
            //Adding 5 Resume tiles
            LEManageTemplateTiles.getAddNewTile(privateDashboardContainerName.private_dashboard_large_tile, 'Resume')


            //clicking on the show lable toggle button
            cy.get(LEManageTemplateTiles.getContainerByIndex($length + 1)).within(() => {
                cy.get(LECoursesPage.getToggleSwitchLable()).contains('Show Label').parent().within(() => {
                    cy.get(LECoursesPage.getToggleSwitchBtnBySibling()).click({ force: true })
                })
            })

        })

        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()

        cy.get(LEManageTemplateTiles.getChangesSavedBanner(), { timeout: 15000 }).should('be.visible')
    })

    it('Login in into the learner side and put the course into resume', () => {
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
        LEDashboardPage.getVShortWait()
        cy.get(LECoursesPage.getModalCloseBtn()).click({ force: true })
        LEDashboardPage.getVShortWait()
    })

    it('Verify Resume tiles for 3 Medium tiles', () => {
        //sign in and navigate to manage template before each test
        cy.apiLoginWithSession(userDetails.username, users.sysAdmin.admin_sys_01_password, "#/login")
        cy.url().should('include', '/#/dashboard')
        cy.get(LEDashboardPage.getDashboardPageTitle()).should('contain', 'Welcome,')

        cy.scrollTo('bottom')
        LEDashboardPage.getPrivateDashboardContainerHeaderByName(privateDashboardContainerName.private_dashboard_large_tile).parent().within(() => {
            cy.get(LEDashboardPage.getResumeTitleHeaderContainer()).should('have.length', 1)
            // Asserting Resume tile and its course name 
            cy.get(LEDashboardPage.getResumeTileCourseName()).first().contains(ocDetails.courseName).should('exist').and('be.visible')
            //Asserting Resume tile text
            cy.get(LEDashboardPage.getResumeTileText()).first().should('have.text', 'Resume')

        })
    })


    it(" Clearn up", function () {

        cy.deleteCourse(commonDetails.courseID)
        //Signin with system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LEDashboardPage.turnOffNextgenToggle()
        //Delete the created User
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        //Cleanup - Get userID and delete them
        cy.get(LEDashboardPage.getNavProfile()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })

        //sign in and navigate to manage template before each test
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        //Need to scroll to bottom of side menu to see template button
        cy.get(LESideMenu.getSideMenu()).should('be.visible')
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        cy.url().should('include', '/#/learner-mgmt/private-dashboard')
        cy.get(LEManageTemplateMenu.getDepartmentName()).should('contain', 'Top Level Dept')
        //Clicking on content
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')

        // Deleteing the container
        cy.get(LEManageTemplateTiles.getContentModule()).find(LEManageTemplateTiles.getContainer()).its('length').then(($length) => {
            cy.get(LEManageTemplateTiles.getContainerByIndex($length)).within(() => {
                cy.get(LEManageTemplateTiles.getElementByTitleAttribute('Delete')).click({ force: true })
            })
        })

        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()

        cy.get(LEManageTemplateTiles.getChangesSavedBanner(), { timeout: 15000 }).should('be.visible')

    })
})







