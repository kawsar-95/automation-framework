import ARReportsPage from '../../../../../../helpers/AR/pageObjects/ARReportsPage'
import ARDepartmentsAddEditPage from '../../../../../../helpers/AR/pageObjects/Departments/ARDepartmentsAddEditPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import ARComposeMessage from '../../../../../../helpers/AR/pageObjects/Departments/ARComposeMessage'
import { departmentDetails } from '../../../../../../helpers/TestData/Department/departmentDetails'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import { departments } from '../../../../../../helpers/TestData/Department/departments'

describe('C7349 - AUT-716 - AE - Core Regression - Departments - Message Department', () => {
    it('Login as an Admin and create a department', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getDepartmentsReport()
        cy.get(ARReportsPage.getAddEditMenuActionsByName('Add Department')).should('have.attr','aria-disabled','false').click()
        cy.get(ARReportsPage.getPageHeaderTitle()).should('have.text', "Add Department")

        // Verify that name field cannot be empty
        cy.get(ARDepartmentsAddEditPage.getNameTxtF(ARDepartmentsAddEditPage.getNameSectionDataName())).type(' ').clear()
        cy.get(ARDepartmentsAddEditPage.getTxtFErrorMsgBySectionDataName(ARDepartmentsAddEditPage.getNameSectionDataName())).should('have.text', miscData.emptyTextFieldErrorMsg)

        // Enter valid name for the Department name field
        cy.get(ARDepartmentsAddEditPage.getNameTxtF(ARDepartmentsAddEditPage.getNameSectionDataName())).type(departmentDetails.departmentName)
        
        // Select a department
        cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.dept_top_name])
        cy.get(ARDepartmentsAddEditPage.getExternalIDTxtF()).type(departmentDetails.externalID)
        ARDepartmentsAddEditPage.generalToggleSwitch('true',ARDepartmentsAddEditPage.getDepartmentContactDetailsContainer())
        cy.get(ARDepartmentsAddEditPage.getCompanyNameTxtF()).type(departmentDetails.companyName)
        cy.get(ARDepartmentsAddEditPage.getEmailAddressTxtF()).type(departmentDetails.emailAddress)
        cy.get(ARDepartmentsAddEditPage.getPhoneNumberTxtF()).type(departmentDetails.phoneNo)
         
        // Save Department
        cy.get(ARDepartmentsAddEditPage.getSaveBtn(), {timeout:10000}).should('not.have.attr', 'aria-disabled')
        cy.get(ARDepartmentsAddEditPage.getSaveBtn()).click()
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('contain', 'Department has been created.')
        cy.get(ARDashboardPage.getPageHeaderTitle(), {timeout:10000}).should('have.text', "Departments")
    })

    after('Delete the new department', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getDepartmentsReport()

        ARDepartmentsAddEditPage.AddFilter('Name', 'Starts With', departmentDetails.departmentName)
        ARDepartmentsAddEditPage.selectTableCellRecord(departmentDetails.departmentName, 2)

        ARDepartmentsAddEditPage.WaitForElementStateToChange(ARDepartmentsAddEditPage.getAddEditMenuActionsByName('Delete Department'))
        cy.get(ARDepartmentsAddEditPage.getAddEditMenuActionsByName('Delete Department')).click()
        ARDepartmentsAddEditPage.getConfirmModalBtnByText('Delete')
        cy.get(ARDepartmentsAddEditPage.getNoResultMsg()).should('have.text', 'No results found.')
    })
    
    it('Message department', () => {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Click the Courses menu item
        ARDashboardPage.getDepartmentsReport()

        // Select Department
        ARDepartmentsAddEditPage.AddFilter('Name', 'Starts With', departmentDetails.departmentName)
        ARDepartmentsAddEditPage.selectTableCellRecord(departmentDetails.departmentName, 2)

        // Message a department
        ARDepartmentsAddEditPage.WaitForElementStateToChange(ARDepartmentsAddEditPage.getAddEditMenuActionsByName('Message Department'))
        cy.get(ARDepartmentsAddEditPage.getAddEditMenuActionsByName('Message Department')).click()

        cy.get(ARReportsPage.getPageHeaderTitle()).should('have.text', "Compose Message")
        cy.get(ARComposeMessage.getUserSelectionDDown()).click()
        cy.get(ARComposeMessage.getToTextFieldDDownSearchTxtF()).type(users.adminLogInOut.admin_loginout_fname + ' ' + users.adminLogInOut.admin_loginout_lname)
        cy.get(ARComposeMessage.getListOptions(), {timeout:10000}).should('contain', users.adminLogInOut.admin_loginout_fname + ' ' + users.adminLogInOut.admin_loginout_lname)
        cy.get(ARComposeMessage.getListOptions()).first().click()
        // Enter subject & body message
        cy.get(ARComposeMessage.getSubjectTxtF()).click().type(departmentDetails.messageSubject)
        cy.get(ARComposeMessage.getMessageBodyText()).type(departmentDetails.messageBody)

        // Click on send button
        cy.get(ARComposeMessage.getSendButton(), {timeout:10000}).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARComposeMessage.getSendButton()).click()
        cy.get(ARReportsPage.getPageHeaderTitle()).should('have.text', "Departments")
    })
})