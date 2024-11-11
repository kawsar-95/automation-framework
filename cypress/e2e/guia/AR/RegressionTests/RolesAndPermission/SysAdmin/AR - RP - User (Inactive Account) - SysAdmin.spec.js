import departments from '../../../../../../fixtures/departments.json'
import arLoginPage from '../../../../../../../helpers/AR/pageObjects/Auth/ARLoginPage'
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arUserPage from '../../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arUserAddEditPage from '../../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import arSelectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../../helpers/TestData/users/UserDetails'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'


describe('AR - Regress - RP - User (Inactive Account) - SysAdmin', function () {

    after(function () {
        cy.deleteUser(userDetails.userID);
    })


    it('should allow a SysAdmin to create an Inactive user', () => {
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
        cy.get(arUserAddEditPage.getUsernameTxtF()).clear().type(userDetails.rpDeptBAdminUserName)
        cy.get(arUserAddEditPage.getPasswordTxtF()).clear().type(userDetails.validPassword)
        cy.get(arUserAddEditPage.getConfirmPasswordTxtF()).clear().type(userDetails.validPassword)
        cy.get(arUserAddEditPage.getDepartmentBtn()).click()
        arSelectModal.SearchAndSelectFunction([departments.DEPTB_NAME])
        cy.get(arUserAddEditPage.getElementByDataNameAttribute(arUserAddEditPage.getIsActiveToggleContainer()) + ' ' + arUserAddEditPage.getToggleEnabled()).click()
        cy.get(arUserAddEditPage.getElementByDataNameAttribute(arUserAddEditPage.getLearnerToggleContainer()) + ' ' + arUserAddEditPage.getToggleEnabled()).click()
        cy.get(arUserAddEditPage.getElementByDataNameAttribute(arUserAddEditPage.getAdminToggleContainer()) + ' ' + arUserAddEditPage.getToggleEnabled()).click()
        cy.get(arUserAddEditPage.getAdminUserManagementAddRuleBtn()).click()
        cy.get(arUserAddEditPage.getSelectDepartmentBtn(1)).click()
        arSelectModal.SearchAndSelectFunction([departments.DEPTB_NAME])
        cy.get(arUserAddEditPage.getRolesDDown()).click({timeout:5000})
        cy.get(arUserAddEditPage.getRolesDDownSearchTxtF()).clear().type('System Admin')
        cy.get(arUserAddEditPage.getRolesDDownOpt()).contains( 'System Admin',{timeout:5000}).click()
        cy.get(arUserAddEditPage.getSaveBtn()).click()
        cy.get(arUserAddEditPage.getToastSuccessMsg()).should('be.visible')

    })

    it('should not allow an Inactive Sysadmin account to log into LMS', () => {
        cy.visit("/admin")
        cy.get(arLoginPage.getUsernameTxtF()).type(userDetails.rpDeptBAdminUserName)
        cy.get(arLoginPage.getPasswordTxtF()).type(userDetails.validPassword)
        cy.wrap(arLoginPage.WaitForElementStateToChange(arLoginPage.getLoginBtn()))
        cy.get(arLoginPage.getLoginBtn()).click()
        cy.get(arLoginPage.getLoginErrorMsg()).should('have.text', arLoginPage.getLoginErrorTxt())
       
    })

    it('should allow a SysAdmin to edit an Inactive account', () => {
        cy.loginAdmin(users.sysAdminLogInOut.admin_sys_loginout_username, users.sysAdminLogInOut.admin_sys_loginout_password)
        //cy.get(arDashboardPage.getSysAdminDashboardPageTitle()).should('have.text', arDashboardPage.getSysAdminDashboardPageTitleTxt())
        cy.get(arDashboardPage.getCurrentUserLabel()).contains(`${users.sysAdminLogInOut.admin_sys_loginout_fname} ${users.sysAdminLogInOut.admin_sys_loginout_lname}`)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser')
        cy.wrap(arUserPage.AddFilter('Status', 'Inactive'))
        cy.wrap(arUserPage.AddFilter('Username', 'Contains',userDetails.rpDeptBAdminUserName),{timeout:5000})
        cy.get(arUserPage.getTableCellName(4)).contains( userDetails.rpDeptBAdminUserName).click({force:true});
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Edit User'), 1000))
        cy.get(arUserPage.getAddEditMenuActionsByName('Edit User')).click()
        cy.intercept('/api/rest/v2/admin/reports/departments').as('getUser').wait('@getUser')
        cy.get(arUserAddEditPage.getUsernameTxtF()).clear().type(userDetails.rpDeptBAdminUserName + commonDetails.timestamp)
        cy.url().then((currentUrl) => { userDetails.userID = currentUrl.slice(48) })
        cy.wrap(arUserAddEditPage.WaitForElementStateToChange(arUserAddEditPage.getSaveBtn(), 1000))
        cy.get(arUserAddEditPage.getSaveBtn()).click()
        cy.get(arUserPage.getTableCellName(4)).contains(userDetails.rpDeptBAdminUserName)
    })
})
