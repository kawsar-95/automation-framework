import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { users } from "../../../../../../helpers/TestData/users/users"


describe("C797 - AR - An Administrator can enable the Mobile Device Alert toggle (cloned)", () => {

    beforeEach("Prerequsite", () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it("Admin can publish a course by Turning on Mobile Device Alert toggle", () => {
        //Create a course 
        cy.createCourse('Online Course')
        //Turing on the Mobile Device Alert Toggle
        cy.get(AROCAddEditPage.getSyllabusMobileDeviceAlertToggle())
            .within(() => {
                cy.get(AROCAddEditPage.getToggleDisabled()).click()
            })
        //Asserting Mobile Device Alert toggle is on
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute("Mobile Device Alert")).should('have.attr', 'aria-checked', 'true')
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

    })

    after("delete the course", () => {
        cy.deleteCourse(commonDetails.courseID)
    })

})

describe("C797 - AR - An Administrator can disable the Mobile Device Alert toggle (cloned)", () => {

    beforeEach("Prerequsite", () => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    it("Admin can publish a course by Turning Off Mobile Device Alert toggle", () => {
        //Create a course 
        cy.createCourse('Online Course')

        //Asserting Mobile Device Alert toggle is off
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute("Mobile Device Alert")).should('have.attr', 'aria-checked', 'false')
        //Publish the Course
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })

    })

    after("delete the course", () => {
        cy.deleteCourse(commonDetails.courseID)
    })

})