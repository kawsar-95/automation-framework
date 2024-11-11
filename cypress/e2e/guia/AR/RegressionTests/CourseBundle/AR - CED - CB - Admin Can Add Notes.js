import ARAddMoreCourseSettingsModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARAddMoreCourseSettings.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C960  - Admin can add notes', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })
    it('Admin adds notes', () => {
      
        // Navigate to courses
        ARDashboardPage.getCoursesReport()

        cy.createCourse('Online Course')

        //Open Attribute Settings
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('More')).click()
       
        cy.get(ARAddMoreCourseSettingsModule.getCourseSettingsByNameBtn('More')).click()
        // LMS Administrators will have the option to create notes on Course Bundles
        cy.get(ARDashboardPage.getElementByDataNameAttribute('course-notes')).should('exist')
        // Validation will not restrict trailing spaces or page breaks
        cy.get(ARDashboardPage.getElementByDataNameAttribute('course-notes')).within(() => {
            cy.get(ARDashboardPage.getTextAreaF()).type('Test space and then {enter}Page break and {enter}multiple page breaks{enter}')
        })
        // Test that it would publish successfully with spaces and page breaks
        cy.get(ARDashboardPage.getElementByDataNameAttribute('submit')).contains('Publish').click()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('prompt-header')).should('exist')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('cancel')).eq(0).click()
        // Add the "Notes" section under the "More" section/header
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('More')).should('exist')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('More')).contains('Notes')
        // field should not allow HTML
        cy.get(ARDashboardPage.getElementByDataNameAttribute('course-notes')).within(() => {
            cy.get(ARDashboardPage.getTextAreaF()).type('<html>{enter}Page break and {enter}</html>{enter}')
        })
        cy.get(ARDashboardPage.getElementByDataNameAttribute('submit')).contains('Publish').click()
        // Showing error due to html tags in notes
        cy.get(ARDashboardPage.getElementByDataNameAttribute('error')).should('contain', 'Field contains invalid characters.')
    })

})