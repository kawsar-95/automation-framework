import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsAttributesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAttributes.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { users } from "../../../../../../helpers/TestData/users/users"
import LEFilterMenu from "../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu.js"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LECourseDetailsModal from "../../../../../../helpers/LE/pageObjects/Modals/LECourseDetails.modal"
import ARExternalTrainingPage from "../../../../../../helpers/AR/pageObjects/Reports/ARExternalTrainingPage"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import AdminNavationModuleModule from "../../../../../../helpers/AR/modules/AdminNavationModule.module"
import LECatalogPage from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage"

describe('AUT-719 - C7418 - Delete A Rating', () => {
    before('Turn on Next Gen Toggel', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        LECatalogPage.turnOnNextgenToggle()
    })

    beforeEach(() => {
        // Login to the Admin Side
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
    })

    after(() => {
        cy.deleteCourse(commonDetails.courseID)

        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getMediumWait()
        LECatalogPage.turnOffNextgenToggle()
    })

    it('Create temporary course', () => {
        ARDashboardPage.getMediumWait()
        // Go to The Courses section of the LMS
        AdminNavationModuleModule.navigateToCoursesPage()
        cy.createCourse('Online Course')

        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()
        ARDashboardPage.getLShortWait()
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()
        // Enable Course Rating
        cy.get(ARCourseSettingsAttributesModule.getEnableCourseRatingToggleContainer() + " " + AROCAddEditPage.getToggleDisabled()).click()
 
        ARCourseSettingsEnrollmentRulesModule.getEnableAutomaticEnrollmentRadioBtn('Specific')
        ARCourseSettingsEnrollmentRulesModule.AddEnrollmentRule('Auto', 'Username', 'Equals', users.sysAdmin.admin_sys_01_username, null)

        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
        ARDashboardPage.getMediumWait()

    })
    it('Give rating to course', () => {        
        ARDashboardPage.getMediumWait()
        cy.visit('#/courses')
        ARDashboardPage.getMediumWait()
        LEFilterMenu.SearchForCourseByName(ocDetails.courseName)
        ARDashboardPage.getMediumWait()
        cy.get(LEDashboardPage.getCourseTitleFromCard(ocDetails.courseName)).click()
        LEDashboardPage.getMediumWait()
        cy.get(LECourseDetailsModal.getTabByName('Reviews')).invoke('show').click({force: true})
        cy.get(LECourseDetailsModal.getRatingStar()).eq(3).click()
        ARDashboardPage.getMediumWait()
    })
    it('Delete Rating', () => {
        // Go to The Courses section of the LMS
        cy.get(AdminNavationModuleModule.getCourseMenu()).click()
        // Click on Ratings
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Ratings'))
        ARDashboardPage.getMediumWait()
        // Select existing Ratings from list of course Ratings page
        ARDashboardPage.A5AddFilter('Course Name', 'Contains', ocDetails.courseName)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        // Click on Delete button
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).click()
        // Pop-up appear with Header- Delete Course Rating
        cy.get(ARExternalTrainingPage.getSectionHeader()).should('contain', 'Delete Course Rating')
        // message- Deleting rating will cause recalculation of average rating for the course "course name"
        cy.get(ARDashboardPage.getDeletePOPUPMsgTxt()).should('contain', `Deleting rating will cause recalculation of average rating for the course "${ocDetails.courseName}"`)

        cy.get(ARDeleteModal.getA5OKBtn()).should('exist')
        cy.get(ARDeleteModal.getA5CancelBtn()).should('exist')
        cy.get(ARDeleteModal.getA5OKBtn()).click()
        ARDashboardPage.getMediumWait()
    })
})