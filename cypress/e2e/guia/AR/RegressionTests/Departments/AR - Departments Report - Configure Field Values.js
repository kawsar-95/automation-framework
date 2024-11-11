import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDepartmentsAddEditPage from '../../../../../../helpers/AR/pageObjects/Departments/ARDepartmentsAddEditPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { departmentDetails } from '../../../../../../helpers/TestData/Department/departmentDetails'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import { miscData } from '../../../../../../helpers/TestData/Misc/misc'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('C1895 AUT-463, AR - Departments Report - Configure Department Contact Details for a Department', () => {
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
    
        // Verify that the title for the area is "Job Title"
        cy.get(arDepartmentsAddEditPage.getJobTitlesLabel()).should('contain', 'Job Title')
        // Job Title field should be configurable
        cy.get(arDepartmentsAddEditPage.getAddJobTitleBtn()).click()
        // There should be no value in default state
        cy.get(arDepartmentsAddEditPage.getJobTitleTxtF(arDepartmentsAddEditPage.getJobTitleSectionDataName())).should('have.value', '')
        // message should be displayed
        cy.get(arDepartmentsAddEditPage.getTxtFErrorMsgBySectionDataName(arDepartmentsAddEditPage.getJobTitleSectionDataName())).should('have.text', miscData.emptyTextFieldErrorMsg)
        // Verify that an admin is unable to save
        cy.get(arDepartmentsAddEditPage.getSaveBtn(), {timeout:10000}).should('have.attr', 'aria-disabled', 'true')
        // Field should accept text, numbers or special characters
        cy.get(arDepartmentsAddEditPage.getJobTitleTxtF(arDepartmentsAddEditPage.getJobTitleSectionDataName())).type('123#$dsfh')
        cy.get(arDepartmentsAddEditPage.getJobTitleTxtF(arDepartmentsAddEditPage.getJobTitleSectionDataName())).should('have.value', '123#$dsfh')
        // An admin should be able to add one or more options
        cy.get(arDepartmentsAddEditPage.getJobTitleTxtF(arDepartmentsAddEditPage.getJobTitleSectionDataName())).clear().type(departmentDetails.joTitle)
        cy.get(arDepartmentsAddEditPage.getAddJobTitleBtn()).click()
        cy.get(arDepartmentsAddEditPage.getJobTitleTxtF(arDepartmentsAddEditPage.getJobTitleSectionDataName(), 1)).type(departmentDetails.joTitle2)
        cy.get(arDepartmentsAddEditPage.getAddJobTitleBtn()).click()
        cy.get(arDepartmentsAddEditPage.getJobTitleTxtF(arDepartmentsAddEditPage.getJobTitleSectionDataName(), 2)).type(departmentDetails.joTitle3)
        // Verify that an admin can successfully remove a Job Title
        cy.get(arDepartmentsAddEditPage.getDeleteBtnByDataNameAndIndex(arDepartmentsAddEditPage.getJobTitleSectionDataName(), 3)).click()
        cy.get(arDepartmentsAddEditPage.getDeleteBtnByDataNameAndIndex(arDepartmentsAddEditPage.getJobTitleSectionDataName(),2)).click()

        // Verify that the title for the area is "Location"
        cy.get(arDepartmentsAddEditPage.getLocationsLabel()).should('contain', 'Location')
        // Location field should be configurable
        cy.get(arDepartmentsAddEditPage.getLocationBtn()).click()
        // There should be no value in default state
        cy.get(arDepartmentsAddEditPage.getLocationTxtF(arDepartmentsAddEditPage.getLocationSectionDataName())).should('have.value', '')
        // message should be displayed
        cy.get(arDepartmentsAddEditPage.getTxtFErrorMsgBySectionDataName(arDepartmentsAddEditPage.getLocationSectionDataName())).should('have.text', miscData.emptyTextFieldErrorMsg)
        // Verify that an admin is unable to save
        cy.get(arDepartmentsAddEditPage.getSaveBtn(), {timeout:10000}).should('have.attr', 'aria-disabled', 'true')
        // Field should accept text, numbers or special characters
        cy.get(arDepartmentsAddEditPage.getLocationTxtF(arDepartmentsAddEditPage.getLocationSectionDataName())).type('123#$dsfh')
        cy.get(arDepartmentsAddEditPage.getLocationTxtF(arDepartmentsAddEditPage.getLocationSectionDataName())).should('have.value', '123#$dsfh')
        // An admin should be able to add one or more options
        cy.get(arDepartmentsAddEditPage.getLocationTxtF(arDepartmentsAddEditPage.getLocationSectionDataName())).clear().type(departmentDetails.location)
        cy.get(arDepartmentsAddEditPage.getLocationBtn()).click()
        cy.get(arDepartmentsAddEditPage.getLocationTxtF(arDepartmentsAddEditPage.getLocationSectionDataName(), 1)).type(departmentDetails.location2)
        cy.get(arDepartmentsAddEditPage.getLocationBtn()).click()
        cy.get(arDepartmentsAddEditPage.getLocationTxtF(arDepartmentsAddEditPage.getLocationSectionDataName(), 2)).type(departmentDetails.location3)
        // Verify that an admin can successfully remove a Location
        cy.get(arDepartmentsAddEditPage.getDeleteBtnByDataNameAndIndex(arDepartmentsAddEditPage.getLocationSectionDataName(), 3)).click()
        cy.get(arDepartmentsAddEditPage.getDeleteBtnByDataNameAndIndex(arDepartmentsAddEditPage.getLocationSectionDataName(),2)).click()

        // Save Department
        cy.get(arDepartmentsAddEditPage.getSaveBtn(), {timeout:10000}).should('not.have.attr', 'aria-disabled')
        cy.get(arDepartmentsAddEditPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 15000}).should('contain', 'Department has been created.')
        cy.get(arDashboardPage.getPageHeaderTitle(), {timeout:10000}).should('have.text', "Departments")
    })

    it('edit department and persist value', () => {
        // Search for the created department
        arDepartmentsAddEditPage.AddFilter('Name', 'Starts With', departmentDetails.departmentName)
        arDepartmentsAddEditPage.selectTableCellRecord(departmentDetails.departmentName, 2)

        // Edit the department
        arDepartmentsAddEditPage.WaitForElementStateToChange(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Edit'))
        cy.get(arDepartmentsAddEditPage.getAddEditMenuActionsByName('Edit')).click()

        cy.get(arDashboardPage.getPageHeaderTitle()).should('have.text', "Edit Department")
        cy.get(arDepartmentsAddEditPage.getNameTxtF(arDepartmentsAddEditPage.getNameSectionDataName())).should('be.visible').and('have.value', departmentDetails.departmentName)
        cy.get(arDashboardPage.getWaitSpinner(), { timeout: 20000 }).should('not.exist')

        cy.get(arDepartmentsAddEditPage.getJobTitleTxtF(arDepartmentsAddEditPage.getJobTitleSectionDataName())).should('have.value', departmentDetails.joTitle)
        cy.get(arDepartmentsAddEditPage.getLocationTxtF(arDepartmentsAddEditPage.getLocationSectionDataName())).should('have.value', departmentDetails.location)

        cy.get(arDepartmentsAddEditPage.getDeleteBtnByDataNameAndIndex(arDepartmentsAddEditPage.getJobTitleSectionDataName())).click()
        cy.get(arDepartmentsAddEditPage.getDeleteBtnByDataNameAndIndex(arDepartmentsAddEditPage.getLocationSectionDataName())).click()

        cy.get(arDepartmentsAddEditPage.getSaveBtn(), {timeout:10000}).should('not.have.attr', 'aria-disabled')
        cy.get(arDepartmentsAddEditPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getPageHeaderTitle(), {timeout:10000}).should('have.text', "Departments")
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:10000}).should('not.exist')
    })
})
