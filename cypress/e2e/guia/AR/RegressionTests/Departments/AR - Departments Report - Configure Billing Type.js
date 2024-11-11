import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDepartmentsAddEditPage from '../../../../../../helpers/AR/pageObjects/Departments/ARDepartmentsAddEditPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { departmentDetails } from '../../../../../../helpers/TestData/Department/departmentDetails'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('C1914 AUT-476, AR - Departments Report - Configure Billing Type', () => {
    it('create a department and  Blatant Admin has access to the Department Billing type section', () => {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getDepartmentsReport()
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Add Department')).should('have.attr','aria-disabled','false').click()
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Add Department")

        // Enter valid name for the Department name field
        cy.get(arDepartmentsAddEditPage.getNameTxtF(arDepartmentsAddEditPage.getNameSectionDataName())).type(departmentDetails.departmentName)

        // Select a department
        cy.get(arDepartmentsAddEditPage.getSelectDepartmentBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.dept_top_name])
    
        // Blatant Admin has access to the Department Billing type section
        cy.get(arDepartmentsAddEditPage.getBillingSection()).should('be.visible')

        // Verify that three Options  "N/A", "Internal" and "External" available
        cy.get(arDepartmentsAddEditPage.getBillingTypeLabel()).should('contain', 'N/A')
        cy.get(arDepartmentsAddEditPage.getBillingTypeLabel()).should('contain', 'Internal')
        cy.get(arDepartmentsAddEditPage.getBillingTypeLabel()).should('contain', 'External')

        // Verify that the Default option selected is N/A
        arDepartmentsAddEditPage.verifyBillingTypeByLabel('N/A')

        cy.get(arDepartmentsAddEditPage.getBillingTypeLabel()).contains('Internal').click()
        arDepartmentsAddEditPage.verifyBillingTypeByLabel('Internal')

        // Blatant Admin can decide whether the value saved for the Billing type should Apply to the Sub Departments
        cy.get(arDepartmentsAddEditPage.getApplyToSubdepartmentsCheckbox()).should('have.attr', 'aria-checked', 'false')
        cy.get(arDepartmentsAddEditPage.getApplyToSubdepartmentsCheckbox()).click({force:true})
        cy.get(arDepartmentsAddEditPage.getApplyToSubdepartmentsCheckbox()).should('have.attr', 'aria-checked', 'true')

        // Verify description
        cy.get(arDepartmentsAddEditPage.getApplyToSubdepartmentsDescription()).should('contain', arDepartmentsAddEditPage.getApplyToSubdepartmentsDescriptionMsg())

        // Save Department
        cy.get(arDepartmentsAddEditPage.getSaveBtn(), {timeout:10000}).should('not.have.attr', 'aria-disabled')
        cy.get(arDepartmentsAddEditPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('contain', 'Department has been created.')
        cy.get(arDashboardPage.getPageHeaderTitle(), {timeout:10000}).should('have.text', "Departments")
    })

    it('create a department and verify Administrators does not have access to the Department Billing type', () => {
        // Sign in with System Admin 2 account
        cy.apiLoginWithSession(users.sysAdmin2.admin_sys_02_username, users.sysAdmin2.admin_sys_02_password, '/admin')
        arDashboardPage.getDepartmentsReport()
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Add Department')).should('have.attr','aria-disabled','false').click()
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Add Department")

        // Enter valid name for the Department name field
        cy.get(arDepartmentsAddEditPage.getNameTxtF(arDepartmentsAddEditPage.getNameSectionDataName())).type(departmentDetails.departmentName2)

        // Select a department
        cy.get(arDepartmentsAddEditPage.getSelectDepartmentBtn()).click()
        arSelectModal.SearchAndSelectFunction([departmentDetails.departmentName])
    
        // Other Client level Administrators does not have access to the Department Billing type      
        cy.get(arDepartmentsAddEditPage.getBillingSection()).should('not.exist')

        // Save Department
        cy.get(arDepartmentsAddEditPage.getSaveBtn(), {timeout:10000}).should('not.have.attr', 'aria-disabled')
        cy.get(arDepartmentsAddEditPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('contain', 'Department has been created.')
        cy.get(arDashboardPage.getPageHeaderTitle(), {timeout:10000}).should('have.text', "Departments")
    })

    it('edit department 1 and Apply to Sub department is set to OFF by default', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getDepartmentsReport()

        // Search for the created department
        arDepartmentsAddEditPage.AddFilter('Name', 'Starts With', departmentDetails.departmentName)
        arDepartmentsAddEditPage.selectTableCellRecord(departmentDetails.departmentName, 2)

        // Edit the department
        arDepartmentsAddEditPage.WaitForElementStateToChange(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Edit'))
        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Edit')).click()

        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Edit Department")
        cy.get(arDepartmentsAddEditPage.getNameTxtF(arDepartmentsAddEditPage.getNameSectionDataName())).should('be.visible').and('have.value', departmentDetails.departmentName)
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 20000 }).should('not.exist')

        // Verify that when ever the department is edited  or opened again, the Apply to Sub department is set to OFF by default.
        cy.get(arDepartmentsAddEditPage.getApplyToSubdepartmentsCheckbox()).should('have.attr', 'aria-checked', 'false')
    })

    it('edit department 2 and Verify that the whole department tree Value reset', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getDepartmentsReport()

        // Search for the created department
        arDepartmentsAddEditPage.AddFilter('Name', 'Starts With', departmentDetails.departmentName2)
        arDepartmentsAddEditPage.selectTableCellRecord(departmentDetails.departmentName2, 2)

        // Edit the department
        arDepartmentsAddEditPage.WaitForElementStateToChange(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Edit'))
        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Edit')).click()

        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Edit Department")
        cy.get(arDepartmentsAddEditPage.getNameTxtF(arDepartmentsAddEditPage.getNameSectionDataName())).should('be.visible').and('have.value', departmentDetails.departmentName2)
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 20000 }).should('not.exist')

        // Verify that the whole department tree Value reset to the Value specified in the higher level department of the Apply to Sub department is selected.
        arDepartmentsAddEditPage.verifyBillingTypeByLabel('Internal')
    })

    after('Delete all new departments', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getDepartmentsReport()

        arDepartmentsAddEditPage.AddFilter('Name', 'Starts With', departmentDetails.departmentName)
        arDepartmentsAddEditPage.AddFilter('Name', 'Starts With', departmentDetails.departmentName2)

        arDepartmentsAddEditPage.selectTableCellRecord(departmentDetails.departmentName2, 2)
        arDepartmentsAddEditPage.WaitForElementStateToChange(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Delete Department'))
        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Delete Department')).click()
        arDepartmentsAddEditPage.getConfirmModalBtnByText('Delete')
        cy.get(arDashboardPage.getToastSuccessMsg()).should('be.visible').and('contain','Department(s) successfully deleted.')
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 20000 }).should('not.exist')

        arDepartmentsAddEditPage.selectTableCellRecord(departmentDetails.departmentName, 2)
        arDepartmentsAddEditPage.WaitForElementStateToChange(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Delete Department'))
        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Delete Department')).click()
        arDepartmentsAddEditPage.getConfirmModalBtnByText('Delete')
        cy.get(arDashboardPage.getToastSuccessMsg()).should('be.visible').and('contain','Department(s) successfully deleted.')
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 20000 }).should('not.exist')

        cy.get(arDepartmentsAddEditPage.getNoResultMsg()).should('have.text', 'No results found.')
    })
})