import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import LECatalogPage from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage"
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LEFilterMenu from "../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { users } from "../../../../../../helpers/TestData/users/users"


let courseName = ocDetails.courseName

describe('C6355 - Online Discovery Modal - Pin the course', () => {
    
    before(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        LEDashboardPage.turnOffNextgenToggle()
    })

    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })
    
    after(() => {
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Create Temporary Course', () => {
        ARDashboardPage.getCoursesReport()
        cy.createCourse('Online Course')
        //Allow self enrollment - all learners
        cy.get(ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentForm()).within(() => {
            cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnLabel()).contains("All Learners").click()
        })
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        cy.get(ARDashboardPage.getToastSuccessMsg()).should('be.visible')
    })

    it('Pin course', () => {
        cy.visit('#/catalog')
        // Wait for page to load
        LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
        LEDashboardPage.getMediumWait()
        LEDashboardPage.waitForLoader(LEDashboardPage.getInitialLoader())
        LEFilterMenu.SearchForCourseByName(courseName)
        LEDashboardPage.getMediumWait()
        // Open the course discovery modal of an online course.
        cy.get(LECatalogPage.getCourseNameLabel(courseName)).click()
        LEDashboardPage.getShortWait()
        // Click on 'Pin' to pin the course.
        cy.get(LECatalogPage.getFlyOverMenuContainer()).within(() => {
            cy.get(LECatalogPage.getPinIconFromMenu()).click()
        })
        //  toast messaged appears 
        cy.get(LEDashboardPage.getToastNotificationMsg()).should('contain', 'Pinned successfully')
        LEDashboardPage.getMediumWait()
        // Close the course discovery modal by clicking on the 'x' button.
        cy.get(LEDashboardPage.getCourseDiscoveryCloseBtn()).click()
        LEDashboardPage.getMediumWait()
        //Enroll to course
        cy.get(LECatalogPage.getCourseDiscoveryStartBtn()).click()
        LEDashboardPage.getMediumWait()
        cy.visit('#/courses')
        LEDashboardPage.getMediumWait()
        LEDashboardPage.getVerifyCourseCardPositionAndName(0, courseName)
        // Go to Catalog page
        cy.visit('#/catalog')
        LEDashboardPage.getMediumWait()
        LEFilterMenu.SearchForCourseByName(courseName)
        LEDashboardPage.getMediumWait()
        // Find the course on catalog page.
        cy.get(LECatalogPage.getCourseNameLabel(courseName)).click()
        LEDashboardPage.getMediumWait()
        // Click on 'Unpin' to unpin the course.
        cy.get(LECatalogPage.getFlyOverMenuContainer()).within(() => {
            cy.get(LECatalogPage.getPinIconFromMenu()).click()
        })
        //  toast messaged appears 
        cy.get(LEDashboardPage.getToastNotificationMsg()).should('contain', 'Unpinned successfully')
        LEDashboardPage.getMediumWait()
    })
})