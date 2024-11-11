import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { users } from '../../../../../../helpers/TestData/users/users'
import {userDetails}  from '../../../../../../helpers/TestData/users/UserDetails'
import { departments } from '../../../../../../helpers/TestData/Department/departments'
import ARMessageTemplatesPage, { userTemplateMessages } from '../../../../../../helpers/AR/pageObjects/Setup/ARMessageTemplatesPage'


describe('C1002, AR - User - Enable Send New User email on User form (cloned)', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByTitleAttribute('Users')).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
    })

    after('User can be Deleted', () => {
        ARUserAddEditPage.getShortWait()
        cy.get(ARUserAddEditPage.getTableCellName(4)).should('contain', userDetails.username)
        arDeleteModal.getDeleteItem()
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getUsers').wait('@getUsers')
        cy.get(ARUserAddEditPage.getNoResultMsg()).should('have.text', "No results found.")
    })

    it('Verify an Admin can Create User', () => {
        //Add new user
        cy.wrap(ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getAddEditMenuActionsByName('Add User'), 1000))
        cy.get(ARUserAddEditPage.getAddEditMenuActionsByName('Add User')).click()
        cy.intercept('/api/rest/v2/admin/reports/users').as('getUser').wait('@getUser')

        //Fill out general section fields
        cy.get(ARUserAddEditPage.getFirstNameTxtF()).type(userDetails.firstName)
        cy.get(ARUserAddEditPage.getMiddleNameTxtF()).type(userDetails.middleName)
        cy.get(ARUserAddEditPage.getLastNameTxtF()).type(userDetails.lastName)
        cy.get(ARUserAddEditPage.getEmailAddressTxtF()).type(userDetails.emailAddress)
        cy.get(ARUserAddEditPage.getUsernameTxtF()).type(userDetails.username)
        cy.get(ARUserAddEditPage.getPasswordTxtF()).type(userDetails.validPassword)
        cy.get(ARUserAddEditPage.getConfirmPasswordTxtF()).type(userDetails.validPassword)

        cy.get(ARUserAddEditPage.getDepartmentBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.dept_top_name])

        // Verify "Send new user email" option appears under Messages section
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute('email-notification')).should('exist').within(()=> {
            cy.get(ARUserAddEditPage.getElementByAriaLabelAttribute('Send new user email')).should('exist')
        })
        cy.get(ARUserAddEditPage.getElementByAriaLabelAttribute('Send new user email')).should('have.attr', 'aria-checked', 'true')

        // Verify Option to "Use Custom Template" is available and Click
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute('isCustom')).should('exist')
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute('isCustom'))
            .find(ARUserAddEditPage.getElementByDataNameAttribute('toggle-button')).click()
        cy.get(ARUserAddEditPage.getElementByAriaLabelAttribute('Use Custom Template')).should('have.attr', 'aria-checked', 'true')

        //Click Edit Template
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute('edit-template')).click()
        ARUserAddEditPage.getShortWait()

        // Verify System default "New User" message template appears in the "Use Custom Template" rich text editor by default
        cy.get(ARUserAddEditPage.getElementByAriaLabelAttribute('Body')).within(()=> {
            cy.get('p').eq(0).should('have.text', userTemplateMessages.message)
            cy.get('p').eq(1).should('have.text', userTemplateMessages.message1)
            cy.get('p').eq(2).should('have.text', userTemplateMessages.message2)
            cy.get('p').eq(3).should('have.text', userTemplateMessages.message3)
            cy.get('p').eq(4).should('have.text', userTemplateMessages.message4)
            cy.get('p').eq(5).should('have.text', userTemplateMessages.message5)
            cy.get('p').eq(6).should('have.text', userTemplateMessages.message6)
            cy.get('p').eq(7).should('have.text', userTemplateMessages.message7)
        })

        // Drag/Selector tiles of all the appropriate fields are available in the template editor
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute('collapse-button')).click()
        cy.get(ARUserAddEditPage.getElementByAriaLabelAttribute('Snippets')).should('exist').within(()=>{
            ARMessageTemplatesPage.verifyDraggableSnippet()
        })
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute('draggable-snippet')).should('have.length', 26)

        // Verified that custom fields can be added on an custom email (spot checkonly)
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute('draggable-snippet')).contains('Department').click()
        cy.get(ARUserAddEditPage.getElementByAriaLabelAttribute('Body')).should('contain', '{{DepartmentName}}')

        // Verify Option to send the email to Learner, Admin, and/or Supervisor available
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute('sendToAdministrators')).should('exist')
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute('sendToSupervisor')).should('exist')
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute('sendToLearner')).should('exist')

        //Turn Send to Administrators & Send to Supervisor Toggles ON
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute('sendToAdministrators') + ' ' + ARUserAddEditPage.getToggleDisabled()).click()
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute('sendToSupervisor') + ' ' + ARUserAddEditPage.getToggleDisabled()).click()

        // The reset button resets all fields including toggles to the default state.
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute('reset-template')).should('exist').click()
        ARUserAddEditPage.getShortWait()

        // Verify value reset to default state 
        cy.get(ARUserAddEditPage.getElementByAriaLabelAttribute('Send to administrators')).should('have.attr', 'aria-checked', 'false')
        cy.get(ARUserAddEditPage.getElementByAriaLabelAttribute('Send to supervisor')).should('have.attr', 'aria-checked', 'false')

        // Cancel the Template
        cy.get(ARUserAddEditPage.getModalFooter()).find(ARUserAddEditPage.getCancelBtn()).click()
        ARUserAddEditPage.getShortWait()

        //Save user
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        ARUserAddEditPage.getShortWait()
        cy.wait('@getUsers')
    })

    it('Verify Edit User', () => {
        ARUserAddEditPage.getEditUserByUsername(userDetails.username)
        ARUserAddEditPage.getMediumWait()

        // Verify Messages section does not appear
        cy.get(ARUserAddEditPage.getElementByDataNameAttribute('email-notification')).should('not.exist')

        //Save user
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        ARUserAddEditPage.getShortWait()
        cy.wait('@getUsers')
    })
})
