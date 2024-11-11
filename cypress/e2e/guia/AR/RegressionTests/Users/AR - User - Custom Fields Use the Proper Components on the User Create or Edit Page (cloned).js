import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARUserAddEditPage from '../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import {GUIAListCustomField, userDetails}  from '../../../../../../helpers/TestData/users/UserDetails'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'

describe('C1023 AUT-320, AR - User - Custom Fields Use the Proper Components on the User Create or Edit Page (cloned)', () => {
    before(() => {
        //Create a new user
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getUsersReport()
    })

    after(function() {
        // Delete User
        cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)
        cy.get(LEDashboardPage.getNavProfile()).click()  
        cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
        cy.url().then((currentURL) => {
            cy.deleteUser(currentURL.slice(-36));
        })
    })

    it('Verify Learner Type User Creation Persists, Edit Learner', () => {
        ARUserAddEditPage.getEditUserByUsername(userDetails.username)
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist')

        //Verify general section fields persisted and edit them
        cy.get(ARUserAddEditPage.getFirstNameTxtF()).type(userDetails.appendText)
        cy.get(ARUserAddEditPage.getLastNameTxtF()).type(userDetails.appendText)

        // 1. "Decimal" custom field type only allows numbers up to two decimal places
        cy.get(ARUserAddEditPage.getGUIADecimalCustomField()).clear().type(4.3233).blur()
        cy.get(ARUserAddEditPage.getGUIADecimalCustomField()).should('have.value', 4.32)

        // 2.  "Decimal" custom field type allows for negative numbers to be set
        cy.get(ARUserAddEditPage.getGUIADecimalCustomField()).clear().type(-34).blur()
        cy.get(ARUserAddEditPage.getGUIADecimalCustomField()).should('have.value', -34)

        // 3.  "Number" custom field type allows for whole numbers only
        cy.get(ARUserAddEditPage.getGUIANumberCustomField()).clear().type(4.3233).blur()
        cy.get(ARUserAddEditPage.getGUIANumberCustomField()).should('have.value', 4)

        // 4. "Number" custom field type allows for negative whole numbers
        cy.get(ARUserAddEditPage.getGUIANumberCustomField()).clear().type(-34).blur()
        cy.get(ARUserAddEditPage.getGUIANumberCustomField()).should('have.value', -34)

        // 5. "Text" type custom field making use of a "List" displays as a single select dropdown
        cy.get(ARUserAddEditPage.getGUIAListCustomFieldDDown()).should('be.visible').click()

        // verify all list items present
        cy.get(ARUserAddEditPage.getGUIAListCustomFieldOpt()).should('have.length', GUIAListCustomField.length)
        cy.get(ARUserAddEditPage.getGUIAListCustomFieldOpt()).should('contain', GUIAListCustomField[0])
        cy.get(ARUserAddEditPage.getGUIAListCustomFieldOpt()).contains(GUIAListCustomField[0]).click()
        cy.get(ARUserAddEditPage.getGUIAListCustomFieldLabel()).should('contain', GUIAListCustomField[0])

        // single select dropdown
        cy.get(ARUserAddEditPage.getGUIAListCustomFieldDDown()).click()
        cy.get(ARUserAddEditPage.getGUIAListCustomFieldOpt()).should('contain', GUIAListCustomField[1])
        cy.get(ARUserAddEditPage.getGUIAListCustomFieldOpt()).contains(GUIAListCustomField[1]).click()
        cy.get(ARUserAddEditPage.getGUIAListCustomFieldLabel()).should('contain', GUIAListCustomField[1])

        // Save user
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        cy.get(ARUserAddEditPage.getToastSuccessMsg()).should('contain', 'User has been updated successfully.')
    })
})
