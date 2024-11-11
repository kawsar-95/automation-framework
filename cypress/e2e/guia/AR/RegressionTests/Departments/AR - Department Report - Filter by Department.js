import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import AREquivalentCoursesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/AREquivalentCourses.module";

describe('C1898 AUT-466, AR - Department Report - Filter by Department', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getDepartmentsReport()
    })

    it('Filter by Department And Sub-Departments of', () => {
        cy.get(arDashboardPage.getAddFilterBtn()).click()
        cy.get(arDashboardPage.getPropertyName() + arDashboardPage.getDDownField()).eq(0).click()
        cy.get(arDashboardPage.getPropertyNameDDownSearchTxtF()).type('Department')
        // Department should be visible in the filter area
        cy.get(arDashboardPage.getPropertyNameDDownOpt()).contains('Department').click()

        cy.get(arDashboardPage.getOperator() + arDashboardPage.getDDownField()).eq(1).click()
        // 4. "Is only" or "and sub-department of" should be available for selection
        cy.get(arDashboardPage.getOperatorDDownOpt()).contains('Is Only').should('be.visible')
        cy.get(arDashboardPage.getOperatorDDownOpt()).contains('And Sub-Departments of').should('be.visible')


        cy.get(arDashboardPage.getOperatorDDownOpt()).contains('And Sub-Departments of').click()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getDepartmentF())).click()
        // Department tree should be displayed
        arDashboardPage.expandDeptByName(departments.dept_top_name)
        
        // 6. Department should appear alphabetically
        arDashboardPage.verifyDepartmentsAppearAlphabeticalOrder()

        // Verify that ONLY one department can be selected from the modal/list
        cy.get(arDashboardPage.getDeptDDown()).contains(departments.Dept_B_name).click()
        arDashboardPage.verifyDeptSelectedOrNotByName(departments.Dept_B_name, 'true')
        cy.get(arDashboardPage.getDeptDDown()).contains(departments.Dept_C_name).click()
        arDashboardPage.verifyDeptSelectedOrNotByName(departments.Dept_B_name, 'false')
        arDashboardPage.verifyDeptSelectedOrNotByName(departments.Dept_C_name, 'true')

        cy.get(arDashboardPage.getSubmitDeptBtn()).contains('Choose').click()
        cy.get(arDashboardPage.getSubmitAddFilterBtn()).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 20000 }).should('not.exist')
        // 8. Department report should be filtered based on the selected department
        cy.get(arDashboardPage.getTableCellContentByIndex(2)).should('contain', departments.Dept_C_name)

        // 13. Multiple department filter selection should be possible
        arDashboardPage.AddFilter('Department', 'And Sub-Departments of', departments.Dept_B_name)
        // Department report should be filtered based on the selected department
        cy.get(arDashboardPage.getTableCellContentByIndex(2)).should('contain', departments.Dept_C_name)
        cy.get(arDashboardPage.getTableCellContentByIndex(2)).should('contain', departments.Dept_B_name)

        // verify Filter should be removed, page should refresh
        cy.get(AREquivalentCoursesModule.getRemoveFilterEndBtn()).eq(1).click()
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(arDashboardPage.getTableCellContentByIndex(2)).should('contain', departments.Dept_C_name)
        cy.get(arDashboardPage.getTableCellContentByIndex(2)).should('not.contain', departments.Dept_B_name)

        // verify Page should refresh and NO filter should be applied
        cy.get(arDashboardPage.getRemoveFilterBtn()).click()
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(arDashboardPage.getRemoveFilterBtn()).should('not.exist')
    })

    it('Filter by Department Is only', () => {
        cy.get(arDashboardPage.getAddFilterBtn()).click()
        cy.get(arDashboardPage.getPropertyName() + arDashboardPage.getDDownField()).eq(0).click()
        cy.get(arDashboardPage.getPropertyNameDDownSearchTxtF()).type('Department')
        // Department should be visible in the filter area
        cy.get(arDashboardPage.getPropertyNameDDownOpt()).contains('Department').click()

        cy.get(arDashboardPage.getOperator() + arDashboardPage.getDDownField()).eq(1).click()
        // 4. "Is only" or "and sub-department of" should be available for selection
        cy.get(arDashboardPage.getOperatorDDownOpt()).contains('Is Only').should('be.visible')
        cy.get(arDashboardPage.getOperatorDDownOpt()).contains('And Sub-Departments of').should('be.visible')


        cy.get(arDashboardPage.getOperatorDDownOpt()).contains('Is Only').click()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getDepartmentF())).click()
        // Department tree should be displayed
        arDashboardPage.expandDeptByName(departments.dept_top_name)
        
        // 6. Department should appear alphabetically
        arDashboardPage.verifyDepartmentsAppearAlphabeticalOrder()

        // Verify that ONLY one department can be selected from the modal/list
        cy.get(arDashboardPage.getDeptDDown()).contains(departments.Dept_B_name).click()
        arDashboardPage.verifyDeptSelectedOrNotByName(departments.Dept_B_name, 'true')
        cy.get(arDashboardPage.getDeptDDown()).contains(departments.Dept_C_name).click()
        arDashboardPage.verifyDeptSelectedOrNotByName(departments.Dept_B_name, 'false')
        arDashboardPage.verifyDeptSelectedOrNotByName(departments.Dept_C_name, 'true')

        cy.get(arDashboardPage.getSubmitDeptBtn()).contains('Choose').click()
        cy.get(arDashboardPage.getSubmitAddFilterBtn()).click()
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 20000 }).should('not.exist')
        // 8. Department report should be filtered based on the selected department
        cy.get(arDashboardPage.getTableCellContentByIndex(2)).should('contain', departments.Dept_C_name)

        // 13. Multiple department filter selection should be possible
        arDashboardPage.AddFilter('Department', 'Is Only', departments.Dept_B_name)
        // Department report should be filtered based on the selected department
        cy.get(arDashboardPage.getTableCellContentByIndex(2)).should('contain', departments.Dept_C_name)
        cy.get(arDashboardPage.getTableCellContentByIndex(2)).should('contain', departments.Dept_B_name)

        // verify Filter should be removed, page should refresh
        cy.get(AREquivalentCoursesModule.getRemoveFilterEndBtn()).eq(1).click()
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(arDashboardPage.getTableCellContentByIndex(2)).should('contain', departments.Dept_C_name)

        // verify Page should refresh and NO filter should be applied
        cy.get(arDashboardPage.getRemoveFilterBtn()).click()
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(arDashboardPage.getRemoveFilterBtn()).should('not.exist')
    })

    it('Filter by Department and Cancel', () => {
        cy.get(arDashboardPage.getAddFilterBtn()).click()
        cy.get(arDashboardPage.getPropertyName() + arDashboardPage.getDDownField()).eq(0).click()
        cy.get(arDashboardPage.getPropertyNameDDownSearchTxtF()).type('Department')
        // Department should be visible in the filter area
        cy.get(arDashboardPage.getPropertyNameDDownOpt()).contains('Department').click()

        cy.get(arDashboardPage.getOperator() + arDashboardPage.getDDownField()).eq(1).click()
        // 4. "Is only" or "and sub-department of" should be available for selection
        cy.get(arDashboardPage.getOperatorDDownOpt()).contains('Is Only').should('be.visible')
        cy.get(arDashboardPage.getOperatorDDownOpt()).contains('And Sub-Departments of').should('be.visible')


        cy.get(arDashboardPage.getOperatorDDownOpt()).contains('Is Only').click()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getDepartmentF())).click()
        // Department tree should be displayed
        arDashboardPage.expandDeptByName(departments.dept_top_name)
        
        // 6. Department should appear alphabetically
        arDashboardPage.verifyDepartmentsAppearAlphabeticalOrder()

        // Verify that ONLY one department can be selected from the modal/list
        cy.get(arDashboardPage.getDeptDDown()).contains(departments.Dept_B_name).click()
        arDashboardPage.verifyDeptSelectedOrNotByName(departments.Dept_B_name, 'true')
        cy.get(arDashboardPage.getDeptDDown()).contains(departments.Dept_C_name).click()
        arDashboardPage.verifyDeptSelectedOrNotByName(departments.Dept_B_name, 'false')
        arDashboardPage.verifyDeptSelectedOrNotByName(departments.Dept_C_name, 'true')
        cy.get(arDashboardPage.getSubmitDeptBtn()).contains('Choose').click()

        cy.get(arDashboardPage.getSubmitDeptBtn()).should('not.exist')
        cy.get(arDashboardPage.getSubmitCancelFilterBtn()).click()
        cy.get(arDashboardPage.getSubmitCancelFilterBtn()).should('not.exist')
    })
})