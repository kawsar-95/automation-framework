import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arReportsPage from '../../../../../../helpers/AR/pageObjects/ARReportsPage'
import arDepartmentsAddEditPage from '../../../../../../helpers/AR/pageObjects/Departments/ARDepartmentsAddEditPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { departmentDetails } from '../../../../../../helpers/TestData/Department/departmentDetails'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('C1924, AR - Departments Report - Delete Department', () => {
    before('Create a department', () => {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Click the Courses menu item
        arDashboardPage.getDepartmentsReport()

        cy.get(arReportsPage.getAddEditMenuActionsByName('Add Department')).should('have.attr','aria-disabled','false').click()
        cy.get(arReportsPage.getPageHeaderTitle()).should('have.text', "Add Department")

        //Verify that name field cannot be empty
        cy.get(arDepartmentsAddEditPage.getNameTxtF(arDepartmentsAddEditPage.getNameSectionDataName())).type(' ').clear()
        cy.get(arDepartmentsAddEditPage.getTxtFErrorMsgBySectionDataName(arDepartmentsAddEditPage.getNameSectionDataName())).should('have.text', miscData.emptyTextFieldErrorMsg)

        // Enter valid name for the Department name field
        cy.get(arDepartmentsAddEditPage.getNameTxtF(arDepartmentsAddEditPage.getNameSectionDataName())).type(departmentDetails.departmentName)

        // Verify that Department textfield cannot be empty
        cy.get(arDepartmentsAddEditPage.getSelectDepartmentBtn()).click()
        cy.get(arSelectModal.getHierarchySelectModal() + " " + arSelectModal.getChooseBtn()).click()
        cy.get(arDepartmentsAddEditPage.getTxtFErrorMsgBySectionDataName(arDepartmentsAddEditPage.getParentIDSectionDataName())).should('have.text', miscData.emptyTextFieldErrorMsg)

        // Select a department
        cy.get(arDepartmentsAddEditPage.getSelectDepartmentBtn()).click()
        cy.get(arSelectModal.getSearchTxtF()).clear().type(departmentDetails.parentDepartment);
        cy.get(arSelectModal.getSelectOpt(), { timeout: 10000 }).should('contain', departmentDetails.parentDepartment)
        cy.get(arSelectModal.getSelectOpt()).contains(departmentDetails.parentDepartment).click({ force: true });
        cy.get(arSelectModal.getHierarchySelectModal() + " " + arSelectModal.getChooseBtn()).click()
        cy.get(arSelectModal.getHierarchySelectModal() + " " + arSelectModal.getChooseBtn(), {timeout:10000}).should('not.exist')

        cy.get(arDepartmentsAddEditPage.getExternalIDTxtF()).type(departmentDetails.externalID)
        arDepartmentsAddEditPage.generalToggleSwitch('true',arDepartmentsAddEditPage.getDepartmentContactDetailsContainer())
        cy.get(arDepartmentsAddEditPage.getCompanyNameTxtF()).type(departmentDetails.companyName)
        cy.get(arDepartmentsAddEditPage.getEmailAddressTxtF()).type(departmentDetails.emailAddress)
        cy.get(arDepartmentsAddEditPage.getPhoneNumberTxtF()).type(departmentDetails.phoneNo)

        // Verify that the Job Title text field cannot be empty
        cy.get(arDepartmentsAddEditPage.getAddJobTitleBtn()).click()
        cy.get(arDepartmentsAddEditPage.getTxtFErrorMsgBySectionDataName(arDepartmentsAddEditPage.getJobTitleSectionDataName())).should('have.text', miscData.emptyTextFieldErrorMsg)

        // Enter valid value for Job Title
        cy.get(arDepartmentsAddEditPage.getJobTitleTxtF(arDepartmentsAddEditPage.getJobTitleSectionDataName())).type(departmentDetails.joTitle)

        // Verify that the Location text field cannot be empty
        cy.get(arDepartmentsAddEditPage.getLocationBtn()).click()
        cy.get(arDepartmentsAddEditPage.getTxtFErrorMsgBySectionDataName(arDepartmentsAddEditPage.getLocationSectionDataName())).should('have.text', miscData.emptyTextFieldErrorMsg)

        // Enter valid value for Job Location
        cy.get(arDepartmentsAddEditPage.getLocationTxtF(arDepartmentsAddEditPage.getLocationSectionDataName())).type(departmentDetails.location)
        cy.get(arDepartmentsAddEditPage.getLocationTxtF(arDepartmentsAddEditPage.getLocationSectionDataName())).should('have.value', departmentDetails.location)
        
        // Save Department
        cy.get(arDepartmentsAddEditPage.getSaveBtn(), {timeout:10000}).should('not.have.attr', 'aria-disabled')
        cy.get(arDepartmentsAddEditPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('contain', 'Department has been created.')
        cy.get(arReportsPage.getPageHeaderTitle(), {timeout:10000}).should('have.text', "Departments")
    })

    beforeEach(() => {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Click the Users menu item
        cy.get(arDashboardPage.getElementByTitleAttribute('Users')).click()
        arDashboardPage.getMenuItemOptionByName('Departments')
    })

    it('Verify that Clicking the Delete Department Button gives errors.', () => {
        // Search for the created department
        arDepartmentsAddEditPage.AddFilter('Name', 'Starts With', departmentDetails.departmentName)
        arDepartmentsAddEditPage.selectTableCellRecord(departmentDetails.departmentName, 2)

        arDepartmentsAddEditPage.WaitForElementStateToChange(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Delete Department'))
        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Delete Department')).click()

        // Error messages are displayed
        cy.get(arDepartmentsAddEditPage.getElementByDataNameAttribute('dialog-title'), {timeout:6000}).should('have.text', 'Cannot Delete Department(s)')
    })

    it('Verify clicking the delete department button gives a confirmation modal', () => {
        // Search for the created department
        arDepartmentsAddEditPage.AddFilter('Name', 'Starts With', departmentDetails.departmentName)
        arDepartmentsAddEditPage.selectTableCellRecord(departmentDetails.departmentName, 2)

        // Edit the department
        arDepartmentsAddEditPage.WaitForElementStateToChange(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Edit'))
        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Edit')).click()

        cy.get(arReportsPage.getPageHeaderTitle()).should('have.text', "Edit Department")
        cy.get(arDepartmentsAddEditPage.getDeleteBtnByDataNameAndIndex(arDepartmentsAddEditPage.getJobTitleSectionDataName())).click()
        cy.get(arDepartmentsAddEditPage.getDeleteBtnByDataNameAndIndex(arDepartmentsAddEditPage.getLocationSectionDataName())).click()

        cy.get(arDepartmentsAddEditPage.getSaveBtn(), {timeout:10000}).should('not.have.attr', 'aria-disabled')
        cy.get(arDepartmentsAddEditPage.getSaveBtn()).click()
        cy.get(arReportsPage.getPageHeaderTitle(), {timeout:10000}).should('have.text', "Departments")
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:10000}).should('not.exist')


        // Verify that clicking cancel in the Confirmation modal Cancels the delete action
        arDepartmentsAddEditPage.WaitForElementStateToChange(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Delete Department'))
        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Delete Department')).click()
        cy.get(arDepartmentsAddEditPage.getElementByDataNameAttribute('cancel')).should('have.text', 'Cancel').click()

        // Verify that clicking Delete button the confirmation modal Deletes the Department
        arDepartmentsAddEditPage.WaitForElementStateToChange(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Delete Department'))
        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Delete Department')).click()
        arDepartmentsAddEditPage.getConfirmModalBtnByText('Delete')
        cy.get(arDepartmentsAddEditPage.getNoResultMsg()).should('have.text', 'No results found.')
    })
})