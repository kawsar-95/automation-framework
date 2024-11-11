import departments from '../../../../../../fixtures/departments.json'
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arUserPage from '../../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arUserAddEditPage from '../../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import arSelectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { userDetails, arrayOfUsers } from '../../../../../../../helpers/TestData/users/UserDetails'


describe('AR - Regress - RP - User Visibility - SysAdmin', function () {
    it('should not allow a SysAdmin to see users created outside of its department scope', () => {
        cy.loginAdmin(users.sysAdminLogInOut.admin_sys_loginout_username, users.sysAdminLogInOut.admin_sys_loginout_password)
        //cy.get(arDashboardPage.getSysAdminDashboardPageTitle()).should('have.text', arDashboardPage.getSysAdminDashboardPageTitleTxt())
        cy.get(arDashboardPage.getCurrentUserLabel()).contains(`${users.sysAdminLogInOut.admin_sys_loginout_fname} ${users.sysAdminLogInOut.admin_sys_loginout_lname}`)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser')
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', `DEPTB`))
        arrayOfUsers.deptBUsers.forEach((deps) => {
            cy.get(arUserPage.getTableCellName(4)).contains(deps).should(`be.visible`)
        })
        cy.get(arUserPage.getFilterCloseBtn()).click()
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', `DEPTC`))
        arrayOfUsers.deptCUsers.forEach((deps) => {
            cy.get(arUserPage.getNoResultMsg()).should('have.text', "No results found.")
        })
    })

    it('should allow a SysAdmin to create a user outside its assigned department', () => {
        cy.loginAdmin(users.sysAdminLogInOut.admin_sys_loginout_username, users.sysAdminLogInOut.admin_sys_loginout_password)
        //cy.get(arDashboardPage.getSysAdminDashboardPageTitle()).should('have.text', arDashboardPage.getSysAdminDashboardPageTitleTxt())
        cy.get(arDashboardPage.getCurrentUserLabel()).contains(`${users.sysAdminLogInOut.admin_sys_loginout_fname} ${users.sysAdminLogInOut.admin_sys_loginout_lname}`)
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
        cy.get(arSelectModal.getSelectOpt()).should('not.have.text',departments.DEPTC_NAME)
    })
})
