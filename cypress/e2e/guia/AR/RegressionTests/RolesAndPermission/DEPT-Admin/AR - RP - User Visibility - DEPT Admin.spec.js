import departments from '../../../../../../fixtures/departments.json'
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arUserPage from '../../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arUserAddEditPage from '../../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import arSelectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { arrayOfUsers, userDetails } from '../../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'


describe('AR - Regress - RP - User Visibility - DEPT Admin', function () {

      it('DEP Admin cannot see users created outside of its department scope', () => {
        cy.apiLoginWithSession(users.depAdminDEPTB.admin_dep_username, users.depAdminDEPTB.admin_dep_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser')
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', `DEPTB`))
        for (let index = 1; index < arrayOfUsers.deptBUsers.length; index++) {
            cy.get(arUserPage.getTableCellName(4)).contains(arrayOfUsers.deptBUsers[index]).should(`be.visible`)
        }
        cy.get(arUserPage.getRemoveFilterBtn()).click()
        for (let index = 1; index < arrayOfUsers.deptCUsers.length; index++) {
            cy.wrap(arUserPage.AddFilter('Username', 'Contains', `${arrayOfUsers.deptCUsers[index]}`))
            cy.get(arUserPage.getNoResultMsg()).should('have.text', "No results found.")
        }
    })

    it('Use DEP Admin within DEPTC to create a user', () => {
        cy.apiLoginWithSession(users.depAdminDEPTC.admin_dep_username, users.depAdminDEPTC.admin_dep_password, '/admin')
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
        arSelectModal.SelectFunction(departments.DEPTC_NAME)
        cy.get(arUserAddEditPage.getToggleEnabled).should('contain.text', 'On')
        cy.get(arUserAddEditPage.getSaveBtn()).click().click().wait('@getUser')

    })

    it('Sign in with DEPTB Admin and verify user created by DEPTC Admin is not visible', () => {
        cy.apiLoginWithSession(users.depAdminDEPTB.admin_dep_username, users.depAdminDEPTB.admin_dep_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser')
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', `DEPTB`))
        arUserPage.getLShortWait()
        for (let index = 1; index < arrayOfUsers.deptBUsers.length; index++) {
            cy.get(arUserPage.getTableCellName(4)).contains(arrayOfUsers.deptBUsers[index]).should(`be.visible`)
        }
        cy.get(arUserPage.getRemoveFilterBtn()).click()
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', userDetails.rpDeptCLearnerUserName))
        cy.get(arUserPage.getNoResultMsg()).should('have.text', "No results found.")
    })

    it('Sign in with DEPTC Admin and edit a user created by DEPTC Admin', () => {
        cy.apiLoginWithSession(users.depAdminDEPTC.admin_dep_username, users.depAdminDEPTC.admin_dep_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser')
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', userDetails.rpDeptCLearnerUserName))
        arUserPage.getLShortWait()
        cy.get(arUserPage.getTableCellName(4)).contains(userDetails.rpDeptCLearnerUserName).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Edit User'), 1000))
        cy.get(arUserPage.getAddEditMenuActionsByName('Edit User')).click()
        cy.intercept('/api/rest/v2/admin/reports/departments').as('getUser1').wait('@getUser1')
        arUserAddEditPage.getLShortWait()
        cy.get(arUserAddEditPage.getUsernameTxtF()).clear()
        cy.get(arUserAddEditPage.getUsernameTxtF()).type(userDetails.rpDeptCLearnerUserName + commonDetails.appendText)
        cy.url().then((currentUrl) => { userDetails.userID = currentUrl.slice(48) })
        cy.wrap(arUserAddEditPage.WaitForElementStateToChange(arUserAddEditPage.getSaveBtn(), 1000))
        cy.get(arUserAddEditPage.getSaveBtn()).click()
        arUserAddEditPage.getLShortWait()
        cy.get(arUserPage.getTableCellName(4)).contains(userDetails.rpDeptCLearnerUserName + commonDetails.appendText)
    })

    it('Sign in with DEPTB Admin and verify the edited user (Learner) by DEPTC Admin is not visible', () => {
        cy.apiLoginWithSession(users.depAdminDEPTB.admin_dep_username, users.depAdminDEPTB.admin_dep_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser')
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', `DEPTB`))
        arUserPage.getShortWait()
        for (let index = 1; index < arrayOfUsers.deptBUsers.length; index++) {
            cy.get(arUserPage.getTableCellName(4)).contains(arrayOfUsers.deptBUsers[index]).should(`be.visible`)
        }
        cy.get(arUserPage.getRemoveFilterBtn()).click()
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', userDetails.rpDeptCLearnerUserName + commonDetails.appendText))
        cy.get(arUserPage.getNoResultMsg()).should('have.text', "No results found.")
        cy.deleteUser(userDetails.userID);
    })

    it('An Is Only admin will only see users visible to its department - Inactive Users is only visible when Status = Inactive is specified', () => {
        cy.apiLoginWithSession(users.depAdminDEPTB.admin_dep_username, users.depAdminDEPTB.admin_dep_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser')
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', `DEPTB`))
        arUserPage.getLShortWait()
        for (let index = 1; index < arrayOfUsers.deptBUsers.length; index++) {
            cy.get(arUserPage.getTableCellName(4)).contains(arrayOfUsers.deptBUsers[index]).should(`be.visible`)
        }
        cy.get(arUserPage.getRemoveFilterBtn()).click()
        cy.wrap(arUserPage.AddFilter('Status', 'Inactive'))
        arUserPage.getLShortWait()
        cy.get(arUserPage.getTableCellName(4)).contains('GUIAuto Learner DEPTB - 03').should(`not.exist`)
    })

    it('Sign in with admin with multiple departments not within the same department tree without error', () => {
        cy.viewport(1600,900)
        cy.apiLoginWithSession(users.depAdminDEPTD.admin_dep_username, users.depAdminDEPTD.admin_dep_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser')
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', `GUIAuto Learner DEPT`))
        arUserPage.getMediumWait()
        for (let index = 1; index < arrayOfUsers.deptBUsers.length; index++) {
            cy.get(arUserPage.getTableCellName(4)).contains(arrayOfUsers.deptBUsers[index]).should(`be.visible`)
        }
        cy.get(arUserPage.getRemoveFilterBtn()).click()
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', `GUIAuto Learner DEPT`))
        arUserPage.getMediumWait()
        for (let index = 1; index < arrayOfUsers.deptCUsers.length; index++) {
            cy.get(arUserPage.getTableCellName(4)).contains(arrayOfUsers.deptCUsers[index]).should('be.visible')
        }
    })

    it('An Include Subdep admin will see users visible to its department and lower departments', () => {
        cy.viewport(1600,900)
        cy.apiLoginWithSession(users.depAdminSUBDEP.admin_dep_username, users.depAdminSUBDEP.admin_dep_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser')
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', `GUIAuto Learner SUB`))
        arUserPage.getMediumWait()
        for (let index = 0; index < arrayOfUsers.deptSubDep.length; index++) {
            cy.get(arUserPage.getTableCellName(4)).contains(arrayOfUsers.deptSubDep[index]).should('be.visible')
        }
    })
})
