import ARILCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage";
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module";
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module";
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal";
import LECatalogPage from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage";
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage";
import LECourseDetailsModal from "../../../../../../helpers/LE/pageObjects/Modals/LECourseDetails.modal";
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails";
import { ilcDetails, sessions } from "../../../../../../helpers/TestData/Courses/ilc"
import { venueTypes } from "../../../../../../helpers/TestData/Venue/venueDetails";
import { users } from "../../../../../../helpers/TestData/users/users"


describe('AUT-783 - C7457 - User can enroll to different types of venues', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })
    after(() => {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })
    it('Create ILC course with Classroom venue', () => {
        ARDashboardPage.getMediumWait()

        cy.get(ARDashboardPage.getMenu('Courses')).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        ARDashboardPage.getMediumWait()
        cy.createCourse('Instructor Led', ilcDetails.courseName)
        ARDashboardPage.getMediumWait()
        cy.get(ARILCAddEditPage.getDeleteSessionBtn()).click()
        cy.get(ARDeleteModal.getARDeleteBtn()).click()
        ARDashboardPage.getLShortWait()
        ARILCAddEditPage.addSessionWithVenueType(venueTypes.classroom)
        ARILCAddEditPage.addSessionWithVenueType(venueTypes.connectPro)
        ARILCAddEditPage.addSessionWithVenueType(venueTypes.url)
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Enrollment Rules')).click()
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn('All Learners')
        // Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
        ARDashboardPage.getLongWait()
    })
    it('Enroll to course', () => {
        LEDashboardPage.visitAndSearch('catalog','name',ilcDetails.courseName)
        ARDashboardPage.getMediumWait()
        cy.get(LECatalogPage.getCourseDiscoveryStartBtn()).contains("Choose Session").eq(0).click()
        cy.get(LECourseDetailsModal.getEnrollSessionBtn(sessions.futuresessionName + "_" + venueTypes.classroom)).click({ force: true })
        LECatalogPage.getVLongWait()
        cy.get(LECourseDetailsModal.getTabByName('Sessions')).click()
        LECatalogPage.getVLongWait()
        cy.get(LECourseDetailsModal.getEnrollSessionBtn(sessions.futuresessionName + "_" + venueTypes.connectPro)).click({ force: true })
        LECatalogPage.getVLongWait()
        cy.get(LECourseDetailsModal.getTabByName('Sessions')).click()
        LECatalogPage.getVLongWait()
        cy.get(LECourseDetailsModal.getEnrollSessionBtn(sessions.futuresessionName + "_" + venueTypes.url)).click({ force: true })


    })
})