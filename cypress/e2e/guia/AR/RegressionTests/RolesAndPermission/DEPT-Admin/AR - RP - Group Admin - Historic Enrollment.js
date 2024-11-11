// AR - RP - Group Admin - Historic Enrollment.js
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arEnrollUsersPage from '../../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arUserPage from '../../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arUserAddEditPage from '../../../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import arSelectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import arUserEnrollmentPage from '../../../../../../../helpers/AR/pageObjects/User/ARUserEnrollmentPage'
import arUserReEnrollModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARUserReEnrollModal'
import { courses } from '../../../../../../../helpers/TestData/Courses/courses'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { arrayOfUsers } from '../../../../../../../helpers/TestData/users/UserDetails'


describe('AR - Regress - RP - Group Admin - Historic Enrollment', function () {

    before(function () {
        arrayOfUsers.deptUsers.forEach((user) => {
            cy.createUser(void 0, user, ["Learner"], void 0)
        })
    })

    after(function () {
        arrayOfUsers.arrUserID.forEach((id) => {
            cy.deleteUser(id)
        })
    })

    it('Sign in as System Admin and enroll DEPTC Learner in a DEPTC course', () => {
        cy.loginAdmin(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser')
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', arrayOfUsers.deptUsers[0]))
        arUserPage.getLShortWait()
        cy.get(arUserPage.getTableCellName(4)).contains(arrayOfUsers.deptUsers[0]).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Enroll User'), 1000))
        cy.get(arUserPage.getAddEditMenuActionsByName('Enroll User')).click()
        cy.get(arUserPage.getElementByDataNameAttribute(arEnrollUsersPage.getEnrollUsersAddCourseBtn())).click()
        cy.wrap(arSelectModal.SearchAndSelectFunction([courses.deptC_rp_oc]))
        cy.wrap(arUserAddEditPage.WaitForElementStateToChange(arUserAddEditPage.getSaveBtn(), 1000))
        cy.get(arUserAddEditPage.getSaveBtn()).click()
        cy.get(arUserPage.getTableCellName(4)).contains(arrayOfUsers.deptUsers[0])
    })

    it('Sign in as System Admin and re-enroll DEPTC Learner in a DEPTC course', () => {
        cy.loginAdmin(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser')
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', arrayOfUsers.deptUsers[0]))
        arUserPage.getLShortWait()
        cy.get(arUserPage.getTableCellName(4)).contains(arrayOfUsers.deptUsers[0]).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('View Enrollments'), 1500))
        cy.get(arUserPage.getAddEditMenuActionsByName('View Enrollments')).click()
        cy.intercept('/api/rest/v2/admin/reports/user-enrollments/operations').as('getUser').wait('@getUser').wrap(arUserPage.getShortWait())
        cy.get(arUserPage.getTableCellName()).contains(courses.deptC_rp_oc).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserEnrollmentPage.getAddEditMenuActionsByName('Re-enroll User'), 1000))
        cy.get(arUserEnrollmentPage.getAddEditMenuActionsByName('Re-enroll User')).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserReEnrollModal.getElementByDataNameAttribute(arUserReEnrollModal.getOKBtn()), 1500))
        cy.get(arUserReEnrollModal.getElementByDataNameAttribute(arUserReEnrollModal.getOKBtn())).click()
        cy.intercept('/api/rest/v2/admin/reports/user-enrollments/operations').as('getUser').wait('@getUser')
    })

    it('Sign in as System Admin and enroll DEPTD Learner in a DEPTD course', () => {
        cy.loginAdmin(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser')
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', arrayOfUsers.deptUsers[1]))
        arUserPage.getLShortWait()
        cy.get(arUserPage.getTableCellName(4)).contains(arrayOfUsers.deptUsers[1]).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Enroll User'), 1000))
        cy.get(arUserPage.getAddEditMenuActionsByName('Enroll User')).click()
        cy.get(arUserPage.getElementByDataNameAttribute(arEnrollUsersPage.getEnrollUsersAddCourseBtn())).click()
        cy.wrap(arSelectModal.SearchAndSelectFunction([courses.deptD_rp_oc]))
        cy.wrap(arUserAddEditPage.WaitForElementStateToChange(arUserAddEditPage.getSaveBtn(), 1000))
        cy.get(arUserAddEditPage.getSaveBtn()).click()
        cy.get(arUserPage.getTableCellName(4)).contains(arrayOfUsers.deptUsers[1])
    })

    it('Sign in as System Admin and re-enroll DEPTD Learner in a DEPTD course', () => {
        cy.loginAdmin(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser')
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', arrayOfUsers.deptUsers[1]))
        arUserPage.getLShortWait()
        cy.get(arUserPage.getTableCellName(4)).contains(arrayOfUsers.deptUsers[1]).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('View Enrollments'), 1500))
        cy.get(arUserPage.getAddEditMenuActionsByName('View Enrollments')).click()
        cy.intercept('/api/rest/v2/admin/reports/user-enrollments/operations').as('getUser').wait('@getUser').wrap(arUserPage.getShortWait())
        arUserPage.getLShortWait()
        cy.get(arUserPage.getTableCellName()).contains(courses.deptD_rp_oc).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserEnrollmentPage.getAddEditMenuActionsByName('Re-enroll User'), 1000))
        cy.get(arUserEnrollmentPage.getAddEditMenuActionsByName('Re-enroll User')).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserReEnrollModal.getElementByDataNameAttribute(arUserReEnrollModal.getOKBtn()), 1500))
        cy.get(arUserReEnrollModal.getElementByDataNameAttribute(arUserReEnrollModal.getOKBtn())).click()
        cy.intercept('/api/rest/v2/admin/reports/user-enrollments/operations').as('getUser').wait('@getUser')
    })

    it('View Enrollment for user enrolled in a course within DEPTC', () => {
        cy.loginAdmin(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser')
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', arrayOfUsers.deptUsers[0]))
        arUserPage.getLShortWait()
        cy.get(arUserPage.getTableCellName(4)).contains(arrayOfUsers.deptUsers[0]).should('be.visible').click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Edit User'), 1000))
        cy.get(arUserPage.getAddEditMenuActionsByName('Edit User')).click()
        cy.intercept('POST', '**/reports/departments').as('getEditUser').wait('@getEditUser')
        cy.get(arUserAddEditPage.getUsernameTxtF()).invoke('attr', 'value').should('eq', arrayOfUsers.deptUsers[0])
        cy.url().then((currentUrl) => { arrayOfUsers.arrUserID[0] = currentUrl.slice(48) })
        cy.get(arUserAddEditPage.getCancelBtn()).click()
        cy.intercept('/api/rest/v2/admin/reports/departments').as('getUser').wait('@getUser')
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('View Enrollments'), 1500))
        cy.get(arUserPage.getAddEditMenuActionsByName('View Enrollments')).click()
        cy.intercept('/api/rest/v2/admin/reports/user-enrollments/operations').as('getUser').wait('@getUser').wrap(arUserPage.getShortWait())
        cy.get(arUserPage.getTableCellName()).contains(courses.deptC_rp_oc).should('be.visible')
        cy.get(arUserPage.getTableCellName()).contains(courses.deptD_rp_oc).should('not.exist')
    })

    it('View Enrollment for user enrolled in a course within DEPTD', () => {
        cy.loginAdmin(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.intercept('**/users/operations').as('getUser').wait('@getUser')
        cy.wrap(arUserPage.AddFilter('Username', 'Contains', arrayOfUsers.deptUsers[1]))
        arUserPage.getLShortWait()
        cy.get(arUserPage.getTableCellName(4)).contains(arrayOfUsers.deptUsers[1]).should('be.visible').click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Edit User'), 1000))
        cy.get(arUserPage.getAddEditMenuActionsByName('Edit User')).click()
        cy.intercept('POST', '**/reports/departments').as('getEditUser').wait('@getEditUser')
        cy.get(arUserAddEditPage.getUsernameTxtF()).invoke('attr', 'value').should('eq', arrayOfUsers.deptUsers[1])
        cy.url().then((currentUrl) => { arrayOfUsers.arrUserID[1] = currentUrl.slice(48) })
        cy.get(arUserAddEditPage.getCancelBtn()).click()
        cy.intercept('/api/rest/v2/admin/reports/departments').as('getUser').wait('@getUser')
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('View Enrollments'), 1500))
        cy.get(arUserPage.getAddEditMenuActionsByName('View Enrollments')).click()
        cy.intercept('/api/rest/v2/admin/reports/user-enrollments/operations').as('getUser').wait('@getUser').wrap(arUserPage.getShortWait())
        cy.get(arUserPage.getTableCellName()).contains(courses.deptD_rp_oc).should('be.visible')
        cy.get(arUserPage.getTableCellName()).contains(courses.deptC_rp_oc).should('not.exist')
    })
})
