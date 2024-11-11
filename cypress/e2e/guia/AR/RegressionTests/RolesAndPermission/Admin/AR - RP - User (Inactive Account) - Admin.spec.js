// AR - RP - User (Inactive Account) - Admin.js
import departments from '../../../../../../fixtures/departments.json'
import arLoginPage from '../../../../../../../helpers/AR/pageObjects/Auth/ARLoginPage'
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arUserPage from '../../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arUserAddEditPage from '../../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import arSelectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { userDetails } from '../../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'


describe('AR - Regress - RP - User (Inactive Account) - Admin', function () {

    after(function () {
        cy.deleteUser(userDetails.userID);
    })


    it('Admin can create an Inactive user', () => {
        cy.adminLoginWithSession(users.adminLogInOut.admin_loginout_username, users.adminLogInOut.admin_loginout_password)
        cy.get(arDashboardPage.getAdminDashboardPageTitle()).should('contain.text', arDashboardPage.getAdminDashboardPageTitleTxt())
        cy.get(arDashboardPage.getCurrentUserLabel()).contains(`${users.adminLogInOut.admin_loginout_fname} ${users.adminLogInOut.admin_loginout_lname}`)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser')
        cy.get(arUserPage.getAddEditMenuActionsByName('Add User')).click()
        cy.get(arUserAddEditPage.getFirstNameTxtF()).clear().type(userDetails.firstName)
        cy.get(arUserAddEditPage.getLastNameTxtF()).clear().type(userDetails.lastName)
        cy.get(arUserAddEditPage.getEmailAddressTxtF()).type(`qa.guiauto1@absorblms.com`)
        cy.get(arUserAddEditPage.getUsernameTxtF()).clear().type(`${userDetails.username}`)
        cy.get(arUserAddEditPage.getPasswordTxtF()).clear().type(userDetails.validPassword)
        cy.get(arUserAddEditPage.getConfirmPasswordTxtF()).clear().type(userDetails.validPassword)
        cy.get(arUserAddEditPage.getDepartmentTxtF()).click()
        arSelectModal.SearchAndSelectFunction([departments.DEPTB_NAME])
        cy.get(arUserAddEditPage.getElementByDataNameAttribute(arUserAddEditPage.getIsActiveToggleContainer()) + ' ' + arUserAddEditPage.getToggleEnabled()).click()
        cy.get(arUserAddEditPage.getElementByDataNameAttribute(arUserAddEditPage.getLearnerToggleContainer()) + ' ' + arUserAddEditPage.getToggleEnabled()).click()
        cy.get(arUserAddEditPage.getElementByDataNameAttribute(arUserAddEditPage.getAdminToggleContainer()) + ' ' + arUserAddEditPage.getToggleEnabled()).click()
        cy.get(arUserAddEditPage.getRolesDDown()).click()
        cy.get(arUserAddEditPage.getRolesDDownSearchTxtF()).type('Admin')
        cy.get(arUserAddEditPage.getRolesDDownOpt()).click()
        cy.get(arUserAddEditPage.getSaveBtn()).click()
        arUserAddEditPage.getLShortWait()
    })

    it('An Inactive admin account cannot log in to LMS', () => {
        cy.visit("/admin")
        cy.get(arLoginPage.getUsernameTxtF()).type(userDetails.inactiveUser)
        cy.get(arLoginPage.getPasswordTxtF()).type(userDetails.validPassword)
        cy.wrap(arLoginPage.WaitForElementStateToChange(arLoginPage.getLoginBtn()))
        cy.get(arLoginPage.getLoginBtn()).click()
        cy.get(arLoginPage.getLoginErrorMsg()).should('have.text', arLoginPage.getLoginErrorTxt())

    })

    it('Admin can edit an Inactive account', () => {
        cy.adminLoginWithSession(users.adminLogInOut.admin_loginout_username, users.adminLogInOut.admin_loginout_password)
        cy.get(arDashboardPage.getAdminDashboardPageTitle()).should('contain.text', arDashboardPage.getAdminDashboardPageTitleTxt())
        cy.get(arDashboardPage.getCurrentUserLabel()).contains(`${users.adminLogInOut.admin_loginout_fname} ${users.adminLogInOut.admin_loginout_lname}`)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser')
        cy.wrap(arUserPage.AddFilter('Status', 'Inactive'))
        cy.wrap(arUserPage.AddFilter('First Name', 'Contains', userDetails.inactiveUser))
        arDashboardPage.getMediumWait()
        cy.get(arUserPage.getGridTable()).click();
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Edit User'), 1000))
        cy.get(arUserPage.getAddEditMenuActionsByName('Edit User')).click()
        cy.intercept('/api/rest/v2/admin/reports/departments').as('getUser').wait('@getUser')
        cy.get(arUserAddEditPage.getUsernameTxtF()).clear().type(userDetails.inactiveUser + commonDetails.appendText)
        cy.url().then((currentUrl) => { userDetails.userID = currentUrl.slice(48) })
        cy.wrap(arUserAddEditPage.WaitForElementStateToChange(arUserAddEditPage.getSaveBtn(), 1000))
        cy.get(arUserAddEditPage.getSaveBtn()).click()
        cy.get(arUserPage.getTableCellName(4)).contains(userDetails.inactiveUser + commonDetails.appendText)
    })
})
