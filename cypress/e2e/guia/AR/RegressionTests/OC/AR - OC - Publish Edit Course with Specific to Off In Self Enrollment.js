import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { ocDetails } from "../../../../../../helpers/TestData/Courses/oc"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C6530 -  Publishing a course when changing Self Enrollment from "Specific" to "Off"', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            '/admin'
        )
    })
    after(() => {
        //Delete course
        cy.deleteCourse(commonDetails.courseID);
    })
    it('Create Course with self enrollment - specific', () => {
        ARDashboardPage.getMediumWait()
        // Click on courses
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Courses")).click()
        // Click on courses
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("Courses"))
        cy.intercept("/api/rest/v2/admin/reports/courses/operations").as("getCourses").wait("@getCourses")
        // Toggle on for status as active & Enter course Name and Description
        cy.createCourse('Online Course')
        //Allow self enrollment - Specific
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn("Specific")
        ARDashboardPage.getMediumWait()
        cy.get(AROCAddEditPage.getSelfEnrollmentSpecificUserDDown()).click()
        ARDashboardPage.getVShortWait()
        cy.get(AROCAddEditPage.getSelfEnrollmentSpecificUserDDownTxtF()).type(users.learner03.learner_03_username)
        ARDashboardPage.getVShortWait()
        cy.get(AROCAddEditPage.getSelfEnrollmentSpecificListItem()).eq(0).click()
        ARDashboardPage.getShortWait()
        // Publish Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
        ARDashboardPage.getMediumWait()
    })

    it('Edit course, change self enrollment form specific to off', () => {
        ARDashboardPage.getMediumWait()
        // Click on courses
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Courses")).click()
        // Click on courses
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("Courses"))
        cy.intercept("/api/rest/v2/admin/reports/courses/operations").as("getCourses").wait("@getCourses")
        cy.editCourse(ocDetails.courseName)
        //Allow self enrollment - Off
        ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentRadioBtn("Off")
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36)
        })
        ARDashboardPage.getMediumWait()
    })
})