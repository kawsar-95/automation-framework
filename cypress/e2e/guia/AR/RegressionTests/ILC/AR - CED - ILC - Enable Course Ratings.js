
import ARILCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage"
import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsAttributesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAttributes.module"
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import LECatalogPage from "../../../../../../helpers/LE/pageObjects/Catalog/LECatalogPage"
import LECoursesPage from "../../../../../../helpers/LE/pageObjects/Courses/LECoursesPage"
import LEFilterMenu from "../../../../../../helpers/LE/pageObjects/Menu/LEFilterMenu"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { ilcDetails } from "../../../../../../helpers/TestData/Courses/ilc"
import { users } from "../../../../../../helpers/TestData/users/users"
import AREnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'

describe("C942 - GUIA-Plan - NASA - 2190 - An Administrator can Enable Course Ratings for an ILC (cloned)", () => {
    after('Delete the new courses as part of clean-up', () => {
        for(let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], 'instructor-led-courses-new')
        }
    })

    it("Enable Course Rating toggle so it can be turned on", () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        ARDashboardPage.getMediumWait()

        //creating an ILC course 
        cy.createCourse('Instructor Led', ilcDetails.courseName)

        // Allow self enrollment for all learners
        cy.get(ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentForm()).within(() => {
            cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnLabel()).contains("All Learners").click()
        })
        
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).scrollIntoView()
        // Move to the Attribute settings section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()
        ARILCAddEditPage.getShortWait()

        // Assert that rating toggle is turned-off by default
        cy.get(ARCourseSettingsAttributesModule.getEnableCourseRatingToggleContainer() + ' ' + ARCourseSettingsAttributesModule.getToggleDisabled())
            .should('contain', 'Off')
        // Enable Course Rating
        cy.get(ARCourseSettingsAttributesModule.getEnableCourseRatingToggleContainer() + " " + AROCAddEditPage.getToggleDisabled()).click()
        cy.get(ARCourseSettingsAttributesModule.getElementByAriaLabelAttribute("Enable Course Rating")).should('have.attr', 'aria-checked', 'true')

        // publish the ILC course and store its ID to clean-up later
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })

        ARDashboardPage.getMediumWait()
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName], [users.learner01.learner_01_username])
    })

    it('Verify that the user can rate the course', () => {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password) 
        LEDashboardPage.getTileByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')
        
        // Seach course name in catalog
        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName)
        LECatalogPage.getMediumWait()
        LECatalogPage.getCourseCardBtnThenClick(ilcDetails.courseName)
        LECatalogPage.getMediumWait()

        // Assert tht the Rating option is no longer available
        cy.get(LECoursesPage.getRatingContainer()).should('exist')
        cy.get(LECoursesPage.getRatingContainer()).within(() => {
            cy.get(LECoursesPage.getRateStartContainer()).eq(0).within(() => {
                cy.get('input').check({force: true})
            })
        })
        LECatalogPage.getShortWait()
    })

    it("Enable Course Rating toggle can be turned off in an ILC.", () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        ARDashboardPage.getMediumWait()

        //creating an ILC course 
        cy.createCourse('Instructor Led', ilcDetails.courseName2)

        // Allow self enrollment for all learners
        cy.get(ARCourseSettingsEnrollmentRulesModule.getAllowSelfEnrollmentForm()).within(() => {
            cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnLabel()).contains("All Learners").click()
        })
        
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).scrollIntoView()
        // Move to the Attribute settings section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Attributes')).click()
        ARILCAddEditPage.getShortWait()

        // Assert that rating toggle is turned-off by default
        cy.get(ARCourseSettingsAttributesModule.getElementByAriaLabelAttribute("Enable Course Rating")).should('have.attr', 'aria-checked', 'false')        
        // publish the ILC course and store its ID to clean-up later
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })

        ARDashboardPage.getMediumWait()
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName2], [users.learner01.learner_01_username])
    })

    it('Verify that the user can not rate the course on which rating is disabled', () => {
        cy.apiLoginWithSession(users.learner01.learner_01_username, users.learner01.learner_01_password) 
        LEDashboardPage.getTileByNameThenClick('My Courses')
        cy.get(LEDashboardPage.getLEEllipsesLoader(), {timeout: 15000}).should('not.exist')

        // Open filter panel
        // Seach course name in catalog
        LEFilterMenu.SearchForCourseByName(ilcDetails.courseName2)
        LECatalogPage.getMediumWait()
        LECatalogPage.getCourseCardBtnThenClick(ilcDetails.courseName2)
        LECatalogPage.getMediumWait()

        // Assert tht the Rating option is no longer available
        cy.get(LECoursesPage.getRatingContainer()).should('not.exist')
    })
})