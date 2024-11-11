import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARCourseActivityReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCourseActivityReportPage'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'

describe("C1052 - Course Activity Report Mass Action Deselect", function () {
    before('Login as an Admin', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        ARDashboardPage.getShortWait()
    })

    it("Course Activity Report Mass Action Deselect", () => {
        // Open Course activity list
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Reports'))).click()
        ARDashboardPage.getShortWait()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Course Activity'))
        ARDashboardPage.getMediumWait()
        ARCourseActivityReportPage.ChooseAddFilter(courses.oc_filter_01_name)
        ARDashboardPage.getMediumWait()
        // Select several items in a report, if any
        // Make sure there are courses those can be selected, max selection is three
        cy.get(ARCoursesPage.getGridTable()).its('length').then(selectedCourseCount => {}).as('courseCount')
        cy.get('@courseCount').then(courseCount => {
            const maxCount = Math.min(courseCount, 3)
            let i = 0
            for (; i < maxCount; i++) {
                cy.get(ARCoursesPage.getGridTable()).eq(i).click()        
            }
            ARDashboardPage.getShortWait()
            // Asserting Deselect menu
            ARCoursesPage.getContextMenuByName('Deselect').should('exist').and('be.visible')
            // Assert that clicking on 'Deselect' button deselects the selected line item
            ARCoursesPage.getContextMenuByName('Deselect').click()            
        })

        // All selected items should be deselected.
        cy.get(ARDashboardPage.getGridTable()).within(() => {
            cy.get(ARCoursesPage.getCheckboxContainer()).find(ARCoursesPage.getCheckedInput()).should('have.length', 0)
        })

        ARDashboardPage.getMediumWait()
        // Select an item in a report list
        // Make sure there are courses from which at least one can be selected
        cy.get('@courseCount').then(courseCount => {
            const maxCount = Math.min(courseCount, 3)
            if (maxCount > 0) {
                cy.get(ARCoursesPage.getGridTable()).eq(0).click()
            }
            ARCoursesPage.getShortWait()
            ARCoursesPage.getContextMenuByName('Deselect').should('exist').and('be.visible')
            ARCoursesPage.getContextMenuByName('Deselect').click()            
        })
        // Single selected item should be deselected.
        cy.get(ARDashboardPage.getGridTable()).within(() => {
            cy.get(ARCoursesPage.getCheckboxContainer()).find(ARCoursesPage.getCheckedInput()).should('have.length', 0)
        })
    })
})