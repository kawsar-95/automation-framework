import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARCourseSettingsCompletionModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsCompletion.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C784 - Certificate Expiry for re-enrollment', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })
    it('Certificate Expiry', () => {
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Courses'))
        
        cy.createCourse('Online Course')

        //Open Completion Section
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARDashboardPage.getShortWait()
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('Completion')).click()
        ARDashboardPage.getMediumWait() //Wait for toggles to become enabled

        //Toggle Certificate to ON
        ARCourseSettingsCompletionModule.getToggleByNameThenClick('Allow Re-enrollment')

        // Check that "Time before certificate expires" option is disabled
        cy.get(ARDashboardPage.getElementByDataNameAttribute('radio-button-TimeBeforeCertificateExpires')).should('have.attr', 'aria-disabled', 'true')

        //Enable certificate with expiry
        ARCourseSettingsCompletionModule.getToggleByNameThenClick('Certificate')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('label')).contains('Time from completion').click()

        // Check that "Time before certificate expires" option is now enabled
        cy.get(ARDashboardPage.getElementByDataNameAttribute('radio-button-TimeBeforeCertificateExpires')).should('have.attr', 'aria-disabled', 'false')

        //Check that "Re-Enroll Automatically" toggle is not available
        cy.get(ARDashboardPage.getElementByDataNameAttribute('allowAutomaticReEnrollment')).should('not.exist')
        //Select "Time before certificate expires" option
        cy.get(ARDashboardPage.getElementByDataNameAttribute('radio-button-TimeBeforeCertificateExpires')).click({ force: true })
        // Check that the "Re-Enroll Automatically" toggle is available immediately
        cy.get(ARDashboardPage.getElementByDataNameAttribute('allowAutomaticReEnrollment')).should('exist')
        // "Allow Re-Enrollment" retains all functionality such as re-enroll duration, automatic re-enrollment and time from completion option
        cy.get(ARDashboardPage.getElementByDataNameAttribute('reEnrollmentDuration')).should('exist')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('allowAutomaticReEnrollment')).should('exist')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('radio-button')).contains('Time from completion').should('exist')

        // Update the "Allow Re-Enrollment" toggle and associated fields to be available under the "Completion" section
        cy.get(ARDashboardPage.getElementByDataNameAttribute('edit-online-course-completion-section')).find(ARDashboardPage.getElementByDataNameAttribute('allowReEnrollment')).should('contain', 'Allow Re-enrollment')



    })
})