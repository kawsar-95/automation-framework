import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { courses } from "../../../../../../helpers/TestData/Courses/courses"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C910 - Custom Field List Value',()=>{
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })

    it('Custom Field List Value',()=>{
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Course Enrollments'))
        ARDashboardPage.getMediumWait()

        ARCoursesPage.EnrollmentPageFilter(courses.oc_filter_01_name)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByTitleAttribute('Display Columns')).click()
        // Custom List field
        cy.get(
            ARDashboardPage.getElementByAriaLabelAttribute('Display Columns')
        ).find('span').contains('GUIA List Custom Field').click({ force: true })
        cy.get(ARDashboardPage.getElementByTitleAttribute('Display Columns')).click({ force: true })
        // Add list custom field filter
        ARDashboardPage.AddFilter('GUIA List Custom Field', 'List Item 1')
        // Add option from the list custom field
        ARDashboardPage.AddFilter('GUIA List Custom Field', 'List Item 2')
        ARDashboardPage.getMediumWait()
        // Remove option from the list custom field
        cy.get(ARDashboardPage.getElementByDataNameAttribute('data-filter-item')).eq(1).within(()=>{
            cy.get(ARDashboardPage.getElementByDataNameAttribute('end-icon')).click()
        })
        // Remove list custom field
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute('Remove All')).click()
    })
})