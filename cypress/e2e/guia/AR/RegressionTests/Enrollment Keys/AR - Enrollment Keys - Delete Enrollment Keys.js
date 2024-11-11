import users from '../../../../../fixtures/users.json'
import departments from '../../../../../fixtures/departments.json'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import AREnrollmentKeyPage from '../../../../../../helpers/AR/pageObjects/Enrollment/AREnrollmentKeyPage'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { generalFields } from '../../../../../../helpers/TestData/Enrollments/enrollmentKeys'

describe('AR - Enrollment Keys - Delete Enrollment Keys', function () {

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Enrollment Keys
        cy.apiLoginWithSession(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Enrollment Keys'))
        cy.intercept('/api/rest/v2/admin/reports/enrollment-keys/operations').as('getEKeys').wait('@getEKeys')
    })

    it('Create and Delete a Single Enrollment Key', () => {
        //Create a new single enrollment key
        cy.get(AREnrollmentKeyPage.getActionBtnByTitle('Add Enrollment Key')).should('have.text', "Add Enrollment Key").click()
        arDashboardPage.getLShortWait()
        cy.get(AREnrollmentKeyPage.getNameTxtF()).type(generalFields.singleEKeyName)
        cy.get(AREnrollmentKeyPage.getSelectDeparmentBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.DEPT_TOP_NAME])
        cy.get(AREnrollmentKeyPage.getUsernameRadioBtn()).contains('FirstName.LastName').click()
        cy.get(AREnrollmentKeyPage.getGenerateKeyBtn()).click()
        arDashboardPage.getVShortWait()
        cy.get(AREnrollmentKeyPage.getSaveBtn()).click()
        arDashboardPage.getLShortWait()

        //Add Filter
        AREnrollmentKeyPage.AddFilter('Name', 'Contains', generalFields.singleEKeyName)

        //Select ekey
        arDashboardPage.selectTableCellRecord(generalFields.singleEKeyName, 2)
        //Verify Delete Option is enabled and click it
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Delete Enrollment Key'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Delete Enrollment Key')).click()

        //Verify modal message
        cy.get(ARDeleteModal.getDeletePromptContent()).should('contain', `Are you sure you want to delete enrollment key '${generalFields.singleEKeyName}'?`)

        //Select cancel
        cy.get(AREnrollmentKeyPage.getElementByDataName(ARDeleteModal.getCancelBtn())).click()

        //Verify enrollment key still exists
        cy.get(arDashboardPage.getTableCellContentByIndex(2)).contains(generalFields.singleEKeyName).should('exist')

        //Delete enrollment key
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Delete Enrollment Key')).click()
        cy.get(AREnrollmentKeyPage.getElementByDataName(ARDeleteModal.getDeleteBtn())).click()
        arDashboardPage.getLShortWait()

        //Verify enrollment key has been deleted
        AREnrollmentKeyPage.verifyTableCellRecordDoesNotExist(generalFields.singleEKeyName)
    })

    it.only('Create and Delete Bulk Enrollment Keys', () => {
        //Create first bulk enrollment keys
        cy.get(AREnrollmentKeyPage.getActionBtnByTitle('Add Enrollment Key')).should('have.text', "Add Enrollment Key").click()
        arDashboardPage.getLShortWait()
        cy.get(AREnrollmentKeyPage.getNameTxtF()).type(generalFields.bulkEKeyName)
        cy.get(AREnrollmentKeyPage.getSelectDeparmentBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.DEPT_TOP_NAME])
        cy.get(AREnrollmentKeyPage.getUsernameRadioBtn()).contains('FirstName.LastName').click()
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREnrollmentKeyPage.getGenerateKeyToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleDisabled()).click()
        cy.get(AREnrollmentKeyPage.getNumGeneratedKeysTxtF()).clear().type('3')
        arDashboardPage.getVShortWait()
        cy.get(AREnrollmentKeyPage.getSaveBtn()).click()
        arDashboardPage.getLShortWait()
        //Create second bulk enrollment keys
        cy.get(AREnrollmentKeyPage.getActionBtnByTitle('Add Enrollment Key')).should('have.text', "Add Enrollment Key").click()
        arDashboardPage.getLShortWait()
        cy.get(AREnrollmentKeyPage.getNameTxtF()).type(generalFields.bulkEKeyName2)
        cy.get(AREnrollmentKeyPage.getSelectDeparmentBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.DEPT_TOP_NAME])
        cy.get(AREnrollmentKeyPage.getUsernameRadioBtn()).contains('FirstName.LastName').click()
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREnrollmentKeyPage.getGenerateKeyToggleContainer()) + ' ' + AREnrollmentKeyPage.getToggleDisabled()).click()
        cy.get(AREnrollmentKeyPage.getNumGeneratedKeysTxtF()).clear().type('3')
        arDashboardPage.getVShortWait()
        cy.get(AREnrollmentKeyPage.getSaveBtn()).click()
        arDashboardPage.getLShortWait()

        //Add Filter
        AREnrollmentKeyPage.AddFilter('Name', 'Contains', generalFields.bulkEKeyName)
        AREnrollmentKeyPage.AddFilter('Name', 'Contains', generalFields.bulkEKeyName2)

        //Select all keys
        cy.get(AREnrollmentKeyPage.getElementByAriaLabelAttribute(AREnrollmentKeyPage.getRowSelectOption())).click()
        cy.get(AREnrollmentKeyPage.getElementByDataNameAttribute(AREnrollmentKeyPage.getSelectThisPageOption())).click()

        //Verify bulk Delete Option is enabled and click it
        cy.wrap(arDashboardPage.WaitForElementStateToChange(arDashboardPage.getAddEditMenuActionsByName('Delete Enrollment Keys'), 1000))
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Delete Enrollment Keys')).click()

        //Verify modal message
        cy.get(ARDeleteModal.getDeletePromptContent()).should('contain', `Are you sure you want to delete these 3 enrollment keys?`)

        //Select cancel
        cy.get(AREnrollmentKeyPage.getElementByDataName(ARDeleteModal.getCancelBtn())).click()

        
        //Delete enrollment keys
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Delete Enrollment Keys')).click()
        cy.get(AREnrollmentKeyPage.getElementByDataName(ARDeleteModal.getDeleteBtn())).click()
        arDashboardPage.getLShortWait()

       
        //Verify enrollment keys have been deleted
        cy.get(AREnrollmentKeyPage.getToastNotificationMsg()).should('contain', `Enrollment keys have been deleted successfully.`)
    })
})