import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import {userDetails}  from '../../../../../../helpers/TestData/users/UserDetails'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import ARSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'

describe('C997 AUT-296, AR - User - Filter Custom field string data type (cloned)', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getUsersReport()
    })

    after('Delete Users', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getWaitSpinner() , {timeout:15000}).should("not.exist")
        arDashboardPage.deleteUsers([userDetails.username, userDetails.username2])
    })

    it('Add Learner', () => {
        // add new user
        cy.wrap(ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getAddEditMenuActionsByName('Add User'), 1000))
        cy.get(ARUserAddEditPage.getAddEditMenuActionsByName('Add User')).click()
        cy.get(ARUserAddEditPage.getWaitSpinner()).should('not.exist')

        // Fill out general section fields
        cy.get(ARUserAddEditPage.getFirstNameTxtF()).type(userDetails.firstName)
        cy.get(ARUserAddEditPage.getMiddleNameTxtF()).type(userDetails.middleName)
        cy.get(ARUserAddEditPage.getLastNameTxtF()).type(userDetails.lastName)
        cy.get(ARUserAddEditPage.getEmailAddressTxtF()).type(userDetails.emailAddress)
        cy.get(ARUserAddEditPage.getUsernameTxtF()).type(userDetails.username)
        cy.get(ARUserAddEditPage.getPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getConfirmPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.dept_top_name])

        // "Text" type custom field
        cy.get(ARUserAddEditPage.getCustomFieldByName(userDetails.textCustomFieldLabel)).scrollIntoView()
        cy.get(ARUserAddEditPage.getCustomFieldByName(userDetails.textCustomFieldLabel)).type(userDetails.customText1)

        // Save user
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', 'User has been created successfully.')
        cy.get(ARUserAddEditPage.getPageHeaderTitle(), { timeout: 15000 }).should('be.visible').and('contain', 'Users')
        cy.get(ARUserAddEditPage.getWaitSpinner()).should('not.exist')

        // add another new user
        cy.wrap(ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getAddEditMenuActionsByName('Add User'), 1000))
        cy.get(ARUserAddEditPage.getAddEditMenuActionsByName('Add User')).click()
        cy.get(ARUserAddEditPage.getWaitSpinner()).should('not.exist')

        // Fill out general section fields
        cy.get(ARUserAddEditPage.getFirstNameTxtF()).type(userDetails.firstName)
        cy.get(ARUserAddEditPage.getMiddleNameTxtF()).type(userDetails.middleName)
        cy.get(ARUserAddEditPage.getLastNameTxtF()).type(userDetails.lastName)
        cy.get(ARUserAddEditPage.getEmailAddressTxtF()).type(userDetails.emailAddress)
        cy.get(ARUserAddEditPage.getUsernameTxtF()).type(userDetails.username2)
        cy.get(ARUserAddEditPage.getPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getConfirmPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.dept_top_name])

        // "Text" type custom field
        cy.get(ARUserAddEditPage.getCustomFieldByName(userDetails.textCustomFieldLabel)).scrollIntoView()
        cy.get(ARUserAddEditPage.getCustomFieldByName(userDetails.textCustomFieldLabel)).type(userDetails.customText2)

        cy.get(ARUserAddEditPage.getGUIANumberCustomField()).type(119)

        // Save user
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', 'User has been created successfully.')
    })

    it('Filter by a custom field by different filter options', () => {
        arDashboardPage.AddFilter(userDetails.textCustomFieldLabel, 'Contains', userDetails.customText1)
        cy.get(arDashboardPage.getTableCellRecord()).should('contain', userDetails.username)

        cy.wrap(arDashboardPage.UpdateFilter(userDetails.customText1, null, 'Equals'))
        cy.get(arDashboardPage.getTableCellRecord()).should('contain', userDetails.username)

        cy.wrap(arDashboardPage.UpdateFilter(userDetails.customText1, null, 'Starts With'))
        cy.get(arDashboardPage.getTableCellRecord()).should('contain', userDetails.username)

        cy.wrap(arDashboardPage.UpdateFilter(userDetails.customText1, null, 'Ends With'))
        cy.get(arDashboardPage.getTableCellRecord()).should('contain', userDetails.username)

        cy.wrap(arDashboardPage.UpdateFilter(userDetails.customText1, null, 'Does Not Contain'))
        cy.get(arDashboardPage.getTableCellRecord()).should('not.contain', userDetails.username)

        cy.wrap(arDashboardPage.UpdateFilter(userDetails.customText1, null, 'Does Not Equal'))
        cy.get(arDashboardPage.getTableCellRecord()).should('not.contain', userDetails.username)
    })

    it('Filter a specific custom field twice with different information', () => {
        arDashboardPage.AddFilter(userDetails.textCustomFieldLabel, 'Contains', userDetails.customText1)
        arDashboardPage.AddFilter(userDetails.textCustomFieldLabel, 'Contains', userDetails.customText2)
        
        // Results of the OR are displayed
        cy.get(arDashboardPage.getTableCellRecord()).should('contain', userDetails.username)
        cy.get(arDashboardPage.getTableCellRecord()).should('contain', userDetails.username2)
    })

    it('Filter two different custom fields', () => {
        arDashboardPage.AddFilter(userDetails.textCustomFieldLabel, 'Contains', userDetails.customText1)
        arDashboardPage.AddFilter(userDetails.textCustomFieldLabel, 'Contains', userDetails.customText2)
        arDashboardPage.AddFilter(userDetails.numberCustomFieldLabel, 'Equals', 119)

        // Results of the AND are displayed
        cy.get(arDashboardPage.getTableCellRecord()).should('not.contain', userDetails.username)
        cy.get(arDashboardPage.getTableCellRecord()).should('contain', userDetails.username2)
    })

    it('filter by a custom field that results in no results', () => {
        arDashboardPage.AddFilter(userDetails.textCustomFieldLabel, 'Contains', userDetails.customText1)
        arDashboardPage.AddFilter(userDetails.numberCustomFieldLabel, 'Equals', 119)

        // verify correct message is returned
        cy.get(ARUserAddEditPage.getNoResultMsg()).should('have.text', "No results found.")
    })
})
