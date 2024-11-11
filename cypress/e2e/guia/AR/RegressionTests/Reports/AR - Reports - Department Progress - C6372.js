import ARCollaborationAddEditPage from "../../../../../../helpers/AR/pageObjects/Collaborations/ARCollaborationAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDepartmentsAddEditPage from "../../../../../../helpers/AR/pageObjects/Departments/ARDepartmentsAddEditPage"
import ARSelectModal from "../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal"
import ARDepartmentProgressReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARDepartmentProgressReportPage"
import { departmentDetails } from "../../../../../../helpers/TestData/Department/departmentDetails"
import { departments } from "../../../../../../helpers/TestData/Department/departments"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C6372 - Department Progress', () => {
    const departmentNameColumn = 2
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            '/admin'
        )
    })

    after(() => {
        //Delete department
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
        ARDashboardPage.getMenuItemOptionByName('Departments')
        cy.intercept('**/api/rest/v2/admin/reports/departments/operations').as('getDepartments').wait('@getDepartments')
        // Search for the edited department.
        ARDashboardPage.AddFilter('Name', 'Starts With', departmentDetails.departmentName)
        ARDashboardPage.selectTableCellRecord(departmentDetails.departmentName, departmentNameColumn)
        ARDashboardPage.WaitForElementStateToChange(ARDashboardPage.getAddEditMenuActionsByName('Delete Department'))
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete Department')).click()
        ARDashboardPage.getMediumWait()
        ARDashboardPage.getConfirmModalBtnByText('Delete')
        cy.get(ARDashboardPage.getNoResultMsg()).should('have.text', 'No results found.')
    })
    it('should allow admin user to create a department', () => {

        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Users'))).click()
        ARDashboardPage.getMenuItemOptionByName('Departments')
        cy.intercept('**/api/rest/v2/admin/reports/departments/operations').as('getDepartments').wait('@getDepartments')

        cy.get(ARDashboardPage.getPageHeaderTitle()).should('have.text', "Departments")
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Department')).click()

        // Enter valid name for the Department name field
        cy.get(ARDepartmentsAddEditPage.getNameTxtF(ARDepartmentsAddEditPage.getNameSectionDataName())).type(departmentDetails.departmentName)
        // Select a department
        cy.get(ARDepartmentsAddEditPage.getSelectDepartmentBtn()).click()
        cy.get(ARSelectModal.getSearchTxtF()).clear().type(departmentDetails.parentDepartment);
        ARSelectModal.SearchAndSelectFunction([departments.dept_top_name])

        // Save Department
        ARDepartmentsAddEditPage.getShortWait()
        cy.get(ARDepartmentsAddEditPage.getSaveBtn()).click()
        cy.intercept('**/api/rest/v2/admin/reports/departments/operations').as('getCreateDepartment').wait('@getCreateDepartment')
        ARDashboardPage.getLongWait()
    })
    it('Department Progress', () => {
        ARDashboardPage.getMediumWait()
        ARDepartmentProgressReportPage.navigateToDepartmentProgress()
        // Department Progress should be displayed as per Sorting Like as:
        cy.get(ARDashboardPage.getTableHeader()).eq(1).should('contain', 'Department')
        cy.get(ARDashboardPage.getTableHeader()).eq(2).should('contain', 'Users')
        cy.get(ARDashboardPage.getTableHeader()).eq(3).should('contain', 'Users (including Sub-Depts)')
        cy.get(ARDashboardPage.getTableHeader()).eq(4).should('contain', 'Progress(%)')
        cy.get(ARDashboardPage.getTableHeader()).eq(5).should('contain', 'Progress (of Enrolled)(%)')
        cy.get(ARDashboardPage.getTableHeader()).eq(6).should('contain', 'Average Score(%)')
        ARDepartmentProgressReportPage.filterAndSelectDepartment()
        //Action item Should be displayed
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).should('contain', 'Edit')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).should('contain', 'Message Department')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(3)).should('contain', 'Message Department and Subs')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(4)).should('contain', 'View Users')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(5)).should('contain', 'Deselect')
        // Click on Edit button
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARCollaborationAddEditPage.getPageHeader()).should('contain', 'Edit Department')
        cy.get(ARDashboardPage.getElementByDataNameAttribute('cancel')).click()
        ARDashboardPage.getMediumWait()
        ARDepartmentProgressReportPage.filterAndSelectDepartment()
        //Click on Message Department
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).click()
        ARDashboardPage.getMediumWait()
        // Compose messege page should be displayed
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should('contain', 'Compose Message')
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).click()
        ARDashboardPage.getMediumWait()
        //Navigate to Dept Progress
        ARDepartmentProgressReportPage.navigateToDepartmentProgress()
        ARDepartmentProgressReportPage.filterAndSelectDepartment()
        // Click on Messege Department and subs
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(3)).click()
        ARDashboardPage.getMediumWait()
        // Compose messege page should be displayed
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should('contain', 'Compose Message')
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).click()
        ARDashboardPage.getMediumWait()
        //Navigate to Dept Progress
        ARDepartmentProgressReportPage.navigateToDepartmentProgress()
        ARDepartmentProgressReportPage.filterAndSelectDepartment()
        // Click on view users
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(4)).click()
        ARDashboardPage.getMediumWait()
        ARDepartmentProgressReportPage.navigateToDepartmentProgress()
        ARDepartmentProgressReportPage.filterAndSelectDepartment()
        //Click on deselect
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(5)).click()



    })

})