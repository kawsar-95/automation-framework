import { users } from '../../../../../../helpers/TestData/users/users'
import LECourseLessonPlayerPage from '../../../../../../helpers/LE/pageObjects/Courses/LECourseLessonPlayerPage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import ARILCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import ARCourseSettingsCatalogVisibilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCatalogVisibility.module'
import LEFilterMenu from '../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu'
import ARCourseSettingsAttributesModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAttributes.module'
import LECatalogPage from '../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage'
import { currDetails } from '../../../../../../helpers/TestData/Courses/curr'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import { ilcDetails } from '../../../../../../helpers/TestData/Courses/ilc'
import ARCourseSettingsCourseAdministratorsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCourseAdministrators.module'
import ARUploadFileModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUploadFileModal'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import LEResourcesPage from '../../../../../../helpers/LE/pageObjects/Resources/LEResourcesPage'
import LECourseDetailsModal from '../../../../../../helpers/LE/pageObjects/Modals/LECourseDetails.modal'

const longCourseName = `${'a'.repeat(40)}`

describe('AUT-392 - C98583 - GUIA-Story - NLE-3709 - Course Player - Recommended Courses', () => {
    before('The NextGenLearnerExperience FF is ON', () => {
        // Sign in with system admin
        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')
        // Turn on NextGen toggle
        LECatalogPage.turnOnNextgenToggle()

        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        
        ARDashboardPage.getCoursesReport()

        // Add a curriculum course
        cy.createCourse('Curriculum', currDetails.courseName)
        // Add courses to curriculum - verify multiple courses are added in the order they are selected
        ARSelectModal.SearchAndSelectFunction([courses.curr_filter_01_oc_child_01])
        ARCourseSettingsCourseAdministratorsModule.addTag(commonDetails.tagName)

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push({id: id.request.url.slice(-36), type: 'curricula'});
        })

        // Add an online course        
        cy.createCourse('Online Course', ocDetails.courseName)
        ARCourseSettingsCourseAdministratorsModule.addTag(commonDetails.tagName)
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push({id: id.request.url.slice(-36), type: null});
        })

        // Add a course bundle
        cy.createCourse('Course Bundle')
        ARSelectModal.SearchAndSelectFunction([courses.oc_filter_01_name])
        cy.get(ARDashboardPage.getWaitSpinner() , {timeout:15000}).should('not.exist')
        ARCourseSettingsCourseAdministratorsModule.addTag(commonDetails.tagName)
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push({id: id.request.url.slice(-36), type: 'course-bundles'});
        })

        // Add an ILC course
        cy.createCourse('Instructor Led', ilcDetails.courseName, true)
        ARCourseSettingsCourseAdministratorsModule.addTag(commonDetails.tagName)
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push({id: id.request.url.slice(-36), type: 'instructor-led-courses-new'})
        })
        // Create a learner
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    after(() => {
        // Delete the new courses created for the test
        let i = 0
        for (i; i < commonDetails.courseIDs.length; i++) {
            let course = commonDetails.courseIDs[i];
            if (course.type !== null) {
                cy.deleteCourse(commonDetails.courseID, course.type)
            } else {
                cy.deleteCourse(commonDetails.courseID)
            }
        }
        // Delete learner
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavProfile()).click({ force: true })
        cy.get(LEProfilePage.getViewSocialProfileBtn(), {timeout: 3000}).click({ force: true })
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36))
        })

        cy.viewport(1280, 720)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should("not.exist")
        LECatalogPage.turnOffNextgenToggle()
    })

    it('Create online course with recommended course', () => {
        // Admin logins and visits to Courses page
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        // Admin logins and visits to Courses page
        ARDashboardPage.getCoursesReport()
        cy.createCourse('Online Course', ocDetails.courseName2)
        cy.get(AROCAddEditPage.getGeneralTitleTxtF()).clear().type(longCourseName)
        //Open Catalog Visibility Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Catalog Visibility')).click()
        // ARILCAddEditPage.getShortWait()
        
        // Recommendation assign the same Tag
        // Toggle Enable Recommended Course to ON
        ARCourseSettingsCatalogVisibilityModule.generalToggleSwitch('true', ARCourseSettingsCatalogVisibilityModule.getRecommendedCoursesToggleContainer())
        ARILCAddEditPage.getShortWait()
        
        // Add Recommendation Tags
        cy.get(ARCourseSettingsCatalogVisibilityModule.getRecommendationTagsDDown()).click()
        cy.get(ARCourseSettingsCatalogVisibilityModule.getRecommendationTagsSearchTxt()).type(commonDetails.tagName)
        ARCourseSettingsCatalogVisibilityModule.getRecommendationTagOpt(commonDetails.tagName)
        cy.get(ARCourseSettingsCatalogVisibilityModule.getRecommendationTagsDDown()).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes'), {timeout: 3000}).click()
        ARCourseSettingsAttributesModule.enableCourseRating()

        // Upload thumbnail
        cy.get(ARCourseSettingsCatalogVisibilityModule.getThumbnailRadioBtn()).contains('File').click()
        cy.get(ARCourseSettingsCatalogVisibilityModule.getChooseThumbnailBtn()).click()


        cy.get(ARUploadFileModal.getMediaLibraryUploadBtn()).click()
        cy.get(ARUploadFileModal.getChooseFileBtn()).click()
        cy.get(ARUploadFileModal.getFilePathTxt()).attachFile(commonDetails.filePath + commonDetails.thumbnailImgName)
        cy.get(ARUploadFileModal.getSaveBtn()).should('have.attr', 'aria-disabled', 'false', {timeout: 5000}).click()
        cy.get(ARUploadFileModal.getModal()).should('not.exist', {timeout: 5000})
        // Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push({id: id.request.url.slice(-36), type: null});
        })
        cy.get(ARDashboardPage.getToastSuccessMsg(), { timeout: 10000 }).should('contain', 'Course successfully published')
        // Enroll User
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([longCourseName], [userDetails.username])
        cy.get(ARDashboardPage.getTableCellName(2)).contains(longCourseName).click()
        
        // Login to LE, go to course
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()
        // LEDashboardPage.getMediumWait()
        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        LEFilterMenu.showfilters()

        LEFilterMenu.SearchForCourseByName(longCourseName)
        // LEDashboardPage.getMediumWait()
        LEDashboardPage.getCourseCardBtnThenClick(longCourseName)
        cy.get(LECatalogPage.getLEWaitSpinner(), {timeout: 7500}).should('not.exist')

        // Assert that the course thumbnai exists
        cy.get(LEResourcesPage.getResourceCardThumbnail(), {timeout: 3000}).should('exist')
        // Assert that course name displayed
        cy.get(LEDashboardPage.getCourseTitleBtn()).contains(longCourseName)
        // Assert that course rating component exists
        cy.get(LECourseDetailsModal.getRatingStar()).should('exist')

        // LEDashboardPage.getLongWait()
        LECourseLessonPlayerPage.getTabMenuItemsByName('Overview')
        cy.get(LECourseLessonPlayerPage.getDetailsContainer()).should('exist')
        LECourseLessonPlayerPage.getTabMenuItemsByName('Lesson Details')
        cy.get(LECourseLessonPlayerPage.getDetailsPanelContainer()).should('exist')
        LECourseLessonPlayerPage.getTabMenuItemsByName('Recommendations')
        cy.get(LECourseLessonPlayerPage.getRecommendationContainer()).should('exist')
    })

    it('Verify mobile responsiveness', () => {
        cy.viewport('iphone-xr')
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavMenu()).click()

        LESideMenu.getLEMenuItemsByNameThenClick('My Courses')
        LEFilterMenu.showfilters()
        LEFilterMenu.SearchForCourseByName(longCourseName)
        LEDashboardPage.getCourseCardBtnThenClick(longCourseName)
    })
})