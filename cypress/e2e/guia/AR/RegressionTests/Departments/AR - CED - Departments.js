import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arReportsPage from '../../../../../../helpers/AR/pageObjects/ARReportsPage'
import arDepartmentsAddEditPage from '../../../../../../helpers/AR/pageObjects/Departments/ARDepartmentsAddEditPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import arViewHistoryModal from '../../../../../../helpers/AR/pageObjects/Modals/ARViewHistoryModal.js'
import arComposeMessage from '../../../../../../helpers/AR/pageObjects/Departments/ARComposeMessage'
import { departmentDetails } from '../../../../../../helpers/TestData/Department/departmentDetails'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('AR - CED - Departments', () => {
    beforeEach(() => {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Click the Courses menu item
        arDashboardPage.getDepartmentsReport()
    })

    it('should allow admin user to create a department', () => {
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

        // Enter valid value for Job Title
        cy.get(arDepartmentsAddEditPage.getLocationTxtF(arDepartmentsAddEditPage.getLocationSectionDataName())).type(departmentDetails.location)

        // Save Department
        cy.get(arDepartmentsAddEditPage.getSaveBtn(), {timeout:10000}).should('not.have.attr', 'aria-disabled')
        cy.get(arDepartmentsAddEditPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('contain', 'Department has been created.')
        cy.get(arReportsPage.getPageHeaderTitle(), {timeout:10000}).should('have.text', "Departments")
    })

    it('should allow admin user to edit a department', () => {

        // Search for the created department
        arDepartmentsAddEditPage.AddFilter('Name', 'Starts With', departmentDetails.departmentName)
        arDepartmentsAddEditPage.selectTableCellRecord(departmentDetails.departmentName, 2)

        // Edit the department
        arDepartmentsAddEditPage.WaitForElementStateToChange(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Edit'))
        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Edit')).click()

        cy.get(arReportsPage.getPageHeaderTitle()).should('have.text', "Edit Department")
        cy.get(arDepartmentsAddEditPage.getNameTxtF(arDepartmentsAddEditPage.getNameSectionDataName())).clear().type(departmentDetails.departmentNameEdited)
        cy.get(arDepartmentsAddEditPage.getDeleteBtnByDataNameAndIndex(arDepartmentsAddEditPage.getJobTitleSectionDataName())).click()
        cy.get(arDepartmentsAddEditPage.getDeleteBtnByDataNameAndIndex(arDepartmentsAddEditPage.getLocationSectionDataName())).click()

        cy.get(arDepartmentsAddEditPage.getSaveBtn(), {timeout:10000}).should('not.have.attr', 'aria-disabled')
        cy.get(arDepartmentsAddEditPage.getSaveBtn()).click()
        cy.get(arReportsPage.getPageHeaderTitle(), {timeout:10000}).should('have.text', "Departments")
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:10000}).should('not.exist')
    })

    it('should allow admin user to view history on the department', () => {

        // Search for the edited department
        arDepartmentsAddEditPage.AddFilter('Name', 'Starts With', departmentDetails.departmentNameEdited)
        arDepartmentsAddEditPage.selectTableCellRecord(departmentDetails.departmentNameEdited, 2)

        // View history on the department
        arDepartmentsAddEditPage.WaitForElementStateToChange(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Edit'))
        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Edit')).click()

        cy.get(arReportsPage.getPageHeaderTitle(), {timeout:10000}).should('have.text', "Edit Department")
        cy.get(arDepartmentsAddEditPage.getSelectDepartmentBtn(), {timeout:10000}).should('be.visible')

        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('View History')).click()
        cy.get(arViewHistoryModal.getViewHistoryChange(), {timeout:10000}).should('contain', departmentDetails.departmentNameEdited)
        cy.get(arViewHistoryModal.getViewHistoryCloseBtn()).click()
        cy.get(arReportsPage.getPageHeaderTitle(), {timeout:10000}).should('have.text', "Edit Department")
    })

    it('should allow admin user to message department', () => {

        // Search for the edited department
        arDepartmentsAddEditPage.AddFilter('Name', 'Starts With', departmentDetails.departmentNameEdited)
        arDepartmentsAddEditPage.selectTableCellRecord(departmentDetails.departmentNameEdited, 2)

        // Message a department
        arDepartmentsAddEditPage.WaitForElementStateToChange(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Message Department'))
        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Message Department')).click()

        cy.get(arReportsPage.getPageHeaderTitle()).should('have.text', "Compose Message")
        cy.get(arComposeMessage.getUserSelectionDDown()).click()
        cy.get(arComposeMessage.getToTextFieldDDownSearchTxtF()).type(users.adminLogInOut.admin_loginout_fname + ' ' + users.adminLogInOut.admin_loginout_lname)
        cy.get(arComposeMessage.getListOptions(), {timeout:10000}).should('contain', users.adminLogInOut.admin_loginout_fname + ' ' + users.adminLogInOut.admin_loginout_lname)
        cy.get(arComposeMessage.getListOptions()).first().click()

        cy.get(arComposeMessage.getSendButton(), {timeout:10000}).should('have.attr', 'aria-disabled', 'true')
        cy.get(arComposeMessage.getSubjectTxtF()).click().type(departmentDetails.messageSubject)
        cy.get(arComposeMessage.getSendButton(), {timeout:10000}).should('have.attr', 'aria-disabled', 'true')
        cy.get(arComposeMessage.getElementByAriaLabelAttribute(arComposeMessage.getTextArea())).type(departmentDetails.messageBody)
                
        // Click on send button
        cy.get(arComposeMessage.getSendButton(), {timeout:10000}).should('have.attr', 'aria-disabled', 'false')
        cy.get(arComposeMessage.getSendButton()).click()
        cy.get(arReportsPage.getPageHeaderTitle()).should('have.text', "Departments")
    })

    it('should allow admin user to deselect a department', () => {

        // Search for the edited department and deselect the department
        arDepartmentsAddEditPage.AddFilter('Name', 'Starts With', departmentDetails.departmentNameEdited)
        arDepartmentsAddEditPage.selectTableCellRecord(departmentDetails.departmentNameEdited, 2)
        cy.get(arDepartmentsAddEditPage.getDeselectBtn()).click()
        cy.get(arDepartmentsAddEditPage.getTableCellContentByIndex(1)).should('not.be.checked') 
    })


    it('should allow admin user to delete a department', () => {

        // Search for the edited department.
        arDepartmentsAddEditPage.AddFilter('Name', 'Starts With', departmentDetails.departmentNameEdited)
        arDepartmentsAddEditPage.selectTableCellRecord(departmentDetails.departmentNameEdited, 2)
        arDepartmentsAddEditPage.WaitForElementStateToChange(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Delete Department'))
        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Delete Department')).click()
        arDepartmentsAddEditPage.getConfirmModalBtnByText('Delete')
        cy.get(arDepartmentsAddEditPage.getNoResultMsg()).should('have.text', 'No results found.')
    })

})