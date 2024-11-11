import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARCourseSettingsAvailabilityModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsAvailability.module'
import arAddMoreCourseSettingsModule from '../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module'
import AROCAddEditPage from '../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('C800, AR -  Add a toggle to "Allow Course Content Download" to Online Course - Availability Section (cloned)', function(){
    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
    })

    after(function() {
        //Delete Course
        cy.deleteCourse(commonDetails.courseID)
    })

    it('Create OC Course', () => {
        cy.createCourse('Online Course')

        // Open Availability Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        AROCAddEditPage.getShortWait()

        // Turn on Allow Course Content Download toggle
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute('Allow Course Content Download')).siblings('div').click()
        AROCAddEditPage.getShortWait()
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute('Allow Course Content Download')).should('have.attr', 'aria-checked', 'true')

        // Validate allow course content download toggle description
        cy.get(ARCourseSettingsAvailabilityModule.getAllowContentDownloadToggleDescription()).should('contain', 'Allows users to download and complete this course while offline.')

        // Course cannot be downloaded when it is not enabled for mobile.
        // Enable Mobile for App 
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn("Catalog Visibility")).click();
        cy.get(AROCAddEditPage.getElementByDataNameAttribute('isCourseEnabledForMobileApp') + " " + AROCAddEditPage.getToggleDisabled()).click();

        // Publish OC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
    })

    it('Edit OC Course', () => {
        // Filter for Course & Edit it
        cy.editCourse(ocDetails.courseName)
        AROCAddEditPage.getMediumWait()
        // Open Availability Section
        cy.get(arAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Availability')).click()
        AROCAddEditPage.getShortWait()
        
        // Turn on/off the Allow Course Content Download toggle
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute('Allow Course Content Download')).siblings('div').click()
        AROCAddEditPage.getShortWait()
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute('Allow Course Content Download')).should('have.attr', 'aria-checked', 'false')
        AROCAddEditPage.getShortWait()

        // Turn on/off the Allow Course Content Download toggle
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute('Allow Course Content Download')).siblings('div').click()
        AROCAddEditPage.getShortWait()
        cy.get(AROCAddEditPage.getElementByAriaLabelAttribute('Allow Course Content Download')).should('have.attr', 'aria-checked', 'true')
        
        // Publish OC
        cy.publishCourse()
    })
})