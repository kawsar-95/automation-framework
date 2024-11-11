import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDepartmentsAddEditPage from '../../../../../../helpers/AR/pageObjects/Departments/ARDepartmentsAddEditPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { departmentDetails } from '../../../../../../helpers/TestData/Department/departmentDetails'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('C1892 AUT-460, AR - Departments Report - Configure Department Contact Details for a Department', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getDepartmentsReport()
    })
    
    after('Delete department', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getDepartmentsReport()

        arDepartmentsAddEditPage.AddFilter('Name', 'Starts With', departmentDetails.departmentName)

        arDepartmentsAddEditPage.selectTableCellRecord(departmentDetails.departmentName, 2)
        arDepartmentsAddEditPage.WaitForElementStateToChange(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Delete Department'))
        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Delete Department')).click()
        arDepartmentsAddEditPage.getConfirmModalBtnByText('Delete')
        cy.get(arDashboardPage.getToastSuccessMsg()).should('be.visible').and('contain','Department(s) successfully deleted.')
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 20000 }).should('not.exist')

        cy.get(arDepartmentsAddEditPage.getNoResultMsg()).should('have.text', 'No results found.')
    })
    
    it('create a department', () => {
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Add Department')).should('have.attr','aria-disabled','false').click()
        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Add Department")

        // Enter valid name for the Department name field
        cy.get(arDepartmentsAddEditPage.getNameTxtF(arDepartmentsAddEditPage.getNameSectionDataName())).type(departmentDetails.departmentName)

        // Select a department
        cy.get(arDepartmentsAddEditPage.getSelectDepartmentBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.dept_top_name])
    
        // Toggle should be visible and description should be as specified
        arDashboardPage.AssertToggleDescriptionMessage(arDepartmentsAddEditPage.getDepartmentContactDetailsContainer(), arDepartmentsAddEditPage.getDepartmentContactDetailsToggleMsg())

        // Verify that when the department contact details toggle is OFF, the additional fields are hidden
        arDepartmentsAddEditPage.generalToggleSwitch('false', arDepartmentsAddEditPage.getDepartmentContactDetailsContainer())
        cy.get(arDepartmentsAddEditPage.getCompanyNameTxtF()).should('not.exist')
        cy.get(arDepartmentsAddEditPage.getEmailAddressTxtF()).should('not.exist')
        cy.get(arDepartmentsAddEditPage.getPhoneNumberTxtF()).should('not.exist')
        
        // Verify that when the department contact details toggle is ON, the additional fields are displayed
        arDepartmentsAddEditPage.generalToggleSwitch('true',arDepartmentsAddEditPage.getDepartmentContactDetailsContainer())
        cy.get(arDepartmentsAddEditPage.getCompanyNameTxtF()).should('be.visible')
        cy.get(arDepartmentsAddEditPage.getEmailAddressTxtF()).should('be.visible')
        cy.get(arDepartmentsAddEditPage.getPhoneNumberTxtF()).should('be.visible')

        // Verify that the Company Name field has a Textbox
        cy.get(arDepartmentsAddEditPage.getCompanyNameTxtF()).should('have.attr', 'type', 'text')
        // Verify that the Company Name field Allows letters, numbers or Special
        cy.get(arDepartmentsAddEditPage.getCompanyNameTxtF()).type('123sad@#$')
        cy.get(arDepartmentsAddEditPage.getCompanyNameTxtF()).should('have.value','123sad@#$')
        // Textbox field should NOT accept characters more than 4000
        cy.get(arDepartmentsAddEditPage.getCompanyNameTxtF()).invoke('val', arDashboardPage.getLongString(4000)).type('a', {force:true})
        cy.get(arDepartmentsAddEditPage.getCompanyNameErrorMsg()).should('contain', miscData.char_4000_error)
        // Enter Valid Name
        cy.get(arDepartmentsAddEditPage.getCompanyNameTxtF()).clear().type(departmentDetails.companyName)
        
        // Verify that the Email Address field has a Textbox
        cy.get(arDepartmentsAddEditPage.getEmailAddressTxtF()).should('have.attr', 'type', 'text')
        // Verify that the Email Address field Allows letters, numbers or Special
        cy.get(arDepartmentsAddEditPage.getEmailAddressTxtF()).type('123#$%sad@qa.com')
        cy.get(arDepartmentsAddEditPage.getEmailAddressTxtF()).should('have.value','123#$%sad@qa.com')
        // Textbox field should NOT accept characters more than 255
        cy.get(arDepartmentsAddEditPage.getEmailAddressTxtF()).invoke('val', arDashboardPage.getLongString()).type(departmentDetails.emailAddress, {force:true})
        cy.get(arDepartmentsAddEditPage.getEmailAddressErrorMsg()).should('contain', miscData.char_255_error)
        // Enter Valid Email Address
        cy.get(arDepartmentsAddEditPage.getEmailAddressTxtF()).clear().type(departmentDetails.emailAddress)

        // Verify that the Phone Number field has a Textbox
        cy.get(arDepartmentsAddEditPage.getPhoneNumberTxtF()).should('have.attr', 'type', 'text')
        // Verify that the Phone Number field Allows letters, numbers or Special
        cy.get(arDepartmentsAddEditPage.getPhoneNumberTxtF()).type('123#$%sad@qa.com')
        cy.get(arDepartmentsAddEditPage.getPhoneNumberTxtF()).should('have.value','123#$%sad@qa.com')
        // Textbox field should NOT accept characters more than 255
        cy.get(arDepartmentsAddEditPage.getPhoneNumberTxtF()).invoke('val', arDashboardPage.getLongString()).type('a', {force:true})
        cy.get(arDepartmentsAddEditPage.getPhoneNumberErrorMsg()).should('contain', miscData.char_255_error)
        // Enter Valid Phone Number
        cy.get(arDepartmentsAddEditPage.getPhoneNumberTxtF()).clear().type(departmentDetails.phoneNo)

        // Save Department
        cy.get(arDepartmentsAddEditPage.getSaveBtn(), {timeout:10000}).should('not.have.attr', 'aria-disabled')
        cy.get(arDepartmentsAddEditPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('contain', 'Department has been created.')
        cy.get(arDashboardPage.getPageHeaderTitle(), {timeout:10000}).should('have.text', "Departments")
    })

    it('edit department and persist value', () => {
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

        cy.get(arDepartmentsAddEditPage.getCompanyNameTxtF()).should('have.value', departmentDetails.companyName)
        cy.get(arDepartmentsAddEditPage.getEmailAddressTxtF()).should('have.value', departmentDetails.emailAddress)
        cy.get(arDepartmentsAddEditPage.getPhoneNumberTxtF()).should('have.value', departmentDetails.phoneNo)
    })
})

