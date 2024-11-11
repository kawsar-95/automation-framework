import departments from '../../../../../../fixtures/departments.json'
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arUserPage from '../../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arUserAddEditPage from '../../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import arSelectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { arrayOfUsers, userDetails } from '../../../../../../../helpers/TestData/users/UserDetails'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'


describe('AR - Regress - RP - User Visibility - Admin', function () {

    after(function () {
        cy.deleteUser(userDetails.userID);
    })

    it('Admin can see users created outside of its department scope', () => {
        cy.viewport(1600,900)
        cy.adminLoginWithSession(users.adminLogInOut.admin_loginout_username, users.adminLogInOut.admin_loginout_password)
        cy.get(arDashboardPage.getAdminDashboardPageTitle()).should('contain.text', arDashboardPage.getAdminDashboardPageTitleTxt())
        cy.get(arDashboardPage.getCurrentUserLabel()).contains(`${users.adminLogInOut.admin_loginout_fname} ${users.adminLogInOut.admin_loginout_lname}`)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser')
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', `DEPTB`))
        arUserPage.getShortWait()
        arrayOfUsers.deptBUsers.forEach((deps) => {
            cy.get(arUserPage.getTableCellName(4)).contains(deps).should(`be.visible`)
        })
        cy.get(arUserPage.getRemoveFilterBtn()).click()
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', `DEPTC`))
        arUserPage.getShortWait()
        arrayOfUsers.deptCUsers.forEach((deps) => {
            cy.get(arUserPage.getTableCellName(4)).contains(deps).should(`be.visible`)
        }) 
        cy.get(arUserPage.getRemoveFilterBtn()).click()
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', `SUBDEPT`))
        arUserPage.getShortWait()
        arrayOfUsers.deptSubDep.forEach((deps) => {
            cy.get(arUserPage.getTableCellName(4)).contains(deps).should(`be.visible`)
        })
    })

    it('Admin can create a user outside its assigned department', () => {
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
        cy.get(arUserAddEditPage.getUsernameTxtF()).clear().type(userDetails.rpDeptCLearnerUserName)
        cy.get(arUserAddEditPage.getPasswordTxtF()).clear().type(userDetails.validPassword)
        cy.get(arUserAddEditPage.getConfirmPasswordTxtF()).clear().type(userDetails.validPassword)
        cy.get(arUserAddEditPage.getDepartmentTxtF()).click()
        arSelectModal.SearchAndSelectFunction([departments.DEPTC_NAME])
        cy.get(arUserAddEditPage.getToggleEnabled).should('contain.text', 'On')
        cy.get(arUserAddEditPage.getSaveBtn()).click().click().wait('@getUser')

    })

    it('Admin can edit a user without error', () => {
        cy.adminLoginWithSession(users.adminLogInOut.admin_loginout_username, users.adminLogInOut.admin_loginout_password)
        cy.get(arDashboardPage.getAdminDashboardPageTitle()).should('contain.text', arDashboardPage.getAdminDashboardPageTitleTxt())
        cy.get(arDashboardPage.getCurrentUserLabel()).contains(`${users.adminLogInOut.admin_loginout_fname} ${users.adminLogInOut.admin_loginout_lname}`)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser')
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', userDetails.rpDeptCLearnerUserName))
        arUserPage.getShortWait()
        cy.get(arUserPage.getTableCellName(4)).contains(userDetails.rpDeptCLearnerUserName).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Edit User'), 1000))
        cy.get(arUserPage.getAddEditMenuActionsByName('Edit User')).click()
        cy.intercept('/api/rest/v2/admin/reports/departments').as('getUser').wait('@getUser')
        cy.get(arUserAddEditPage.getUsernameTxtF()).clear().type(userDetails.rpDeptCLearnerUserName + commonDetails.appendText)
        cy.url().then((currentUrl) => { userDetails.userID = currentUrl.slice(48) })
        cy.wrap(arUserAddEditPage.WaitForElementStateToChange(arUserAddEditPage.getSaveBtn(), 1000))
        cy.get(arUserAddEditPage.getSaveBtn()).click()
        cy.get(arUserPage.getTableCellName(4)).contains(userDetails.rpDeptCLearnerUserName + commonDetails.appendText)
    })
})
