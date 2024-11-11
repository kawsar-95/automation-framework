import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDepartmentsAddEditPage from '../../../../../../helpers/AR/pageObjects/Departments/ARDepartmentsAddEditPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { departmentDetails } from '../../../../../../helpers/TestData/Department/departmentDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import ARViewHistoryModal from '../../../../../../helpers/AR/pageObjects/Modals/ARViewHistoryModal'

describe('C1916 AUT-478, AR - Departments Report - View History', () => {
    before('Create a department', () => {
        cy.apiLoginWithSession(users.sysAdmin2.admin_sys_02_username, users.sysAdmin2.admin_sys_02_password, '/admin')
        arDashboardPage.getDepartmentsReport()

        cy.get(arDashboardPage.getAddEditMenuActionsByName('Add Department')).click()
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Add Department")
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')

        // Enter valid name for the Department name field
        cy.get(arDepartmentsAddEditPage.getNameTxtF(arDepartmentsAddEditPage.getNameSectionDataName())).type(departmentDetails.departmentName)

        // Select a department
        cy.get(arDepartmentsAddEditPage.getSelectDepartmentBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.dept_top_name])
        
        // Save Department
        cy.get(arDepartmentsAddEditPage.getSaveBtn(), {timeout:10000}).should('not.have.attr', 'aria-disabled')
        cy.get(arDepartmentsAddEditPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('contain', 'Department has been created.')
    })

    it('Edit Department and View History', () => {
        cy.apiLoginWithSession(users.sysAdmin2.admin_sys_02_username, users.sysAdmin2.admin_sys_02_password, '/admin')
        arDashboardPage.getDepartmentsReport()

        arDepartmentsAddEditPage.AddFilter('Name', 'Starts With', departmentDetails.departmentName)
        arDepartmentsAddEditPage.selectTableCellRecord(departmentDetails.departmentName, 2)

        arDepartmentsAddEditPage.WaitForElementStateToChange(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Edit'))
        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Edit')).click()

        cy.get(arDashboardPage.getPageHeaderTitle(), {timeout:15000}).should('have.text', "Edit Department")
        cy.get(arDepartmentsAddEditPage.getSelectDepartmentBtn(), {timeout:15000}).should('be.visible')

        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('View History')).click()

        // 1. Department history modal should be displayed
        cy.get(ARViewHistoryModal.getViewHistoryModalTitle()).should('contain', 'Department History')
        cy.get(ARViewHistoryModal.getViewHistoryCreatedBy()).should('contain', `${users.sysAdmin2.admin_sys_02_fname} ${users.sysAdmin2.admin_sys_02_lname}`)

        // 2. Date and time of the department creation should be displayed
        cy.get(ARViewHistoryModal.getViewHistoryDate()).should('be.visible')
        cy.get(ARViewHistoryModal.getViewHistoryTime()).should('be.visible').its('length').as('elementLength')

        cy.get(ARViewHistoryModal.getViewHistoryCloseBtn()).click()

        // edit name of the department
        cy.get(arDepartmentsAddEditPage.getNameTxtF(arDepartmentsAddEditPage.getNameSectionDataName())).clear().type(departmentDetails.departmentNameEdited)

        // change parent department
        cy.get(arDepartmentsAddEditPage.getSelectDepartmentBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.Dept_C_name])

        // Save Department
        cy.get(arDepartmentsAddEditPage.getSaveBtn(), {timeout:10000}).should('not.have.attr', 'aria-disabled')
        cy.get(arDepartmentsAddEditPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('contain', 'Department has been updated.')
    })

    it('Blatant Admin makes changes to the department', () => {
        cy.apiLoginWithSession(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')
        arDashboardPage.getDepartmentsReport()

        arDepartmentsAddEditPage.AddFilter('Name', 'Starts With', departmentDetails.departmentName)
        arDepartmentsAddEditPage.selectTableCellRecord(departmentDetails.departmentName, 2)

        arDepartmentsAddEditPage.WaitForElementStateToChange(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Edit'))
        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Edit')).click()

        cy.get(arDashboardPage.getPageHeaderTitle(), {timeout:15000}).should('have.text', "Edit Department")
        cy.get(arDepartmentsAddEditPage.getSelectDepartmentBtn(), {timeout:15000}).should('be.visible')

        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('View History')).click()
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')

        // 1. Department history modal should be displayed
        cy.get(ARViewHistoryModal.getViewHistoryModalTitle()).should('contain', 'Department History')

        // 4,5 Verify that the history content is updated
        // Old and new value should be displayed
        cy.get(ARViewHistoryModal.getViewHistoryChange()).should('contain', `Changed Department Name From ${departmentDetails.departmentName} To ${departmentDetails.departmentNameEdited}`)
        cy.get(ARViewHistoryModal.getViewHistoryChange()).should('contain', `Changed Department ParentId From ${departments.dept_top_name} To ${departments.Dept_C_name}`)

        // 6. Update content should contain date and time changes were made
        cy.get(ARViewHistoryModal.getViewHistoryTime()).its('length').then(function ($length) {
            expect(this.elementLength+1).to.eq($length)
        })
        cy.get(ARViewHistoryModal.getViewHistoryTime()).should('be.visible').its('length').as('newElementLength')

        // 7. Update content should contain the name of the Admin user that made the changes
        cy.get(ARViewHistoryModal.getViewHistoryEditedBy()).should('contain', `${users.sysAdmin2.admin_sys_02_fname} ${users.sysAdmin2.admin_sys_02_lname}`)

        cy.get(ARViewHistoryModal.getViewHistoryCloseBtn()).click()

        // edit name of the department
        cy.get(arDepartmentsAddEditPage.getNameTxtF(arDepartmentsAddEditPage.getNameSectionDataName())).clear().type(departmentDetails.departmentName)

        // change parent department
        cy.get(arDepartmentsAddEditPage.getSelectDepartmentBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.Dept_D_name])

        // Save Department
        cy.get(arDepartmentsAddEditPage.getSaveBtn(), {timeout:10000}).should('not.have.attr', 'aria-disabled')
        cy.get(arDepartmentsAddEditPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('contain', 'Department has been updated.')
    })

    it('verify Changes Reflect on View History', () => {
        cy.apiLoginWithSession(users.sysAdmin2.admin_sys_02_username, users.sysAdmin2.admin_sys_02_password, '/admin')
        arDashboardPage.getDepartmentsReport()

        arDepartmentsAddEditPage.AddFilter('Name', 'Starts With', departmentDetails.departmentName)
        arDepartmentsAddEditPage.selectTableCellRecord(departmentDetails.departmentName, 2)

        arDepartmentsAddEditPage.WaitForElementStateToChange(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Edit'))
        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Edit')).click()

        cy.get(arDashboardPage.getPageHeaderTitle(), {timeout:15000}).should('have.text', "Edit Department")
        cy.get(arDepartmentsAddEditPage.getSelectDepartmentBtn(), {timeout:15000}).should('be.visible')

        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('View History')).click()
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')

        // 1. Department history modal should be displayed
        cy.get(ARViewHistoryModal.getViewHistoryModalTitle()).should('contain', 'Department History')

        // 4,5 Verify that the history content is updated
        // Old and new value should be displayed
        cy.get(ARViewHistoryModal.getViewHistoryChange()).should('contain', `Changed Department Name From ${departmentDetails.departmentNameEdited} To ${departmentDetails.departmentName}`)
        cy.get(ARViewHistoryModal.getViewHistoryChange()).should('contain', `Changed Department ParentId From ${departments.Dept_C_name} To ${departments.Dept_D_name}`)

        // 6. Update content should contain date and time changes were made
        cy.get(ARViewHistoryModal.getViewHistoryTime()).its('length').then(function ($length) {
            expect(this.newElementLength+1).to.eq($length)
        })

        // 7. Update content should contain the name of the Admin user that made the changes
        cy.get(ARViewHistoryModal.getViewHistoryEditedBy()).should('contain', 'System')

        cy.get(ARViewHistoryModal.getViewHistoryCloseBtn()).click()

        // edit name of the department
        cy.get(arDepartmentsAddEditPage.getNameTxtF(arDepartmentsAddEditPage.getNameSectionDataName())).clear().type(departmentDetails.departmentNameEdited)

        // change parent department
        cy.get(arDepartmentsAddEditPage.getSelectDepartmentBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.Dept_E_name])

        // Save Department
        cy.get(arDepartmentsAddEditPage.getSaveBtn(), {timeout:10000}).should('not.have.attr', 'aria-disabled')
        cy.get(arDepartmentsAddEditPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('contain', 'Department has been updated.')
    })

    it('should allow admin user to delete a department', () => {
        cy.apiLoginWithSession(users.sysAdmin2.admin_sys_02_username, users.sysAdmin2.admin_sys_02_password, '/admin')
        arDashboardPage.getDepartmentsReport()

        arDepartmentsAddEditPage.AddFilter('Name', 'Starts With', departmentDetails.departmentName)
        arDepartmentsAddEditPage.selectTableCellRecord(departmentDetails.departmentName, 2)
        arDepartmentsAddEditPage.WaitForElementStateToChange(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Delete Department'))
        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Delete Department')).click()
        arDepartmentsAddEditPage.getConfirmModalBtnByText('Delete')
        cy.get(arDepartmentsAddEditPage.getNoResultMsg()).should('have.text', 'No results found.')
    })
})