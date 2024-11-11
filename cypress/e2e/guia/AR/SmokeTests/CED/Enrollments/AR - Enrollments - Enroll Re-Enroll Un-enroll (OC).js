/// <reference types="cypress"/>
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arEnrollUsersPage from '../../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arSelectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import arUserReEnrollModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARUserReEnrollModal'
import arUserPage from '../../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import AREditActivityPage from '../../../../../../../helpers/AR/pageObjects/Enrollment/AREditActivityPage'
import { courses } from '../../../../../../../helpers/TestData/Courses/courses'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'



describe('AR - Smoke - Enrollments - Enroll Re-Enroll Un-enroll (OC)', function() {

    before(function() {
        cy.createUser(void 0, commonDetails.commonUserName + commonDetails.timestamp, ["Learner"], void 0)
    })

   beforeEach(function() {        
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    arDashboardPage.getUserEnrollmentsReport()
    cy.wrap(arEnrollUsersPage.EnrollmentPageFilter(commonDetails.commonUserName + commonDetails.timestamp), 2000)
   })

    it('Enroll user to an online course', function() {
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getAddEditMenuActionsByName('Add Enrollment')))
        cy.get(arDashboardPage.getWaitSpinner()).should('not.exist',{timeout:5000})
        cy.get(arEnrollUsersPage.getAddEditMenuActionsByName('Add Enrollment')).click()
        cy.get(arUserPage.getElementByDataNameAttribute(arEnrollUsersPage.getEnrollUsersAddCourseBtn())).click()
        cy.wrap(arSelectModal.SearchAndSelectFunction([courses.oc_filter_02_name]))
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getSaveBtn()), 2000)
        cy.get(arEnrollUsersPage.getSaveBtn()).click()
        cy.get(arUserPage.getTableCellRecord()).should('contain', courses.oc_filter_02_name).and('contain', '0').and('contain', 'Not Started')
    })

    it('Change enrollment status to Completed', function() {
        cy.wrap(arEnrollUsersPage.AddFilter('Name', 'Equals', courses.oc_filter_02_name))
        cy.wrap(arEnrollUsersPage.selectTableCellRecord(courses.oc_filter_02_name))
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getAddEditMenuActionsByName('Edit Enrollment')), 2000)
        cy.get(arEnrollUsersPage.getAddEditMenuActionsByName('Edit Enrollment')).click()
        cy.wrap(AREditActivityPage.getMarkEnrollmentAsRadioBtn('Completed'))
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getSaveBtn()), 2000)
        cy.get(arEnrollUsersPage.getSaveBtn()).click().wait(2000)
        cy.get(arUserPage.getTableCellRecord()).should('contain', courses.oc_filter_02_name).and('contain', '100').and('contain', 'Complete')
    })

    it('Re-enroll user to an online course', function() {
        cy.wrap(arEnrollUsersPage.AddFilter('Name', 'Equals', courses.oc_filter_02_name))
        cy.wrap(arEnrollUsersPage.selectTableCellRecord(courses.oc_filter_02_name))
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getAddEditMenuActionsByName('Re-enroll User')), 2000)
        cy.get(arEnrollUsersPage.getAddEditMenuActionsByName('Re-enroll User')).click()
        cy.wrap(arUserReEnrollModal.WaitForElementStateToChange(arUserReEnrollModal.getElementByDataNameAttribute(arUserReEnrollModal.getApplyBtn()), 2000))
        cy.get(arDashboardPage.getElementByDataNameAttribute(arUserReEnrollModal.getApplyBtn())).click().wait(2000)
        cy.get(arEnrollUsersPage.getTableCellRecord()).should('contain', courses.oc_filter_02_name).and('contain', '0').and('contain', 'Not Started')
    })

    it('Un-enroll user from the course', function() {
        cy.wrap(arEnrollUsersPage.AddFilter('Name', 'Equals', courses.oc_filter_02_name))
        cy.wrap(arEnrollUsersPage.selectTableCellRecord(courses.oc_filter_02_name))
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getAddEditMenuActionsByName('Un-enroll User')), 2000)
        cy.get(arEnrollUsersPage.getAddEditMenuActionsByName('Un-enroll User')).click()
        cy.wrap(arUserReEnrollModal.WaitForElementStateToChange(arUserReEnrollModal.getElementByDataNameAttribute(arUserReEnrollModal.getOKBtn()), 2000))
        cy.get(arDashboardPage.getElementByDataNameAttribute(arUserReEnrollModal.getOKBtn())).click().wait(2000)
        cy.get(arUserPage.getNoResultMsg()).contains('No results found.').should('exist')
    })

    after(function() {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Users'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Users'))
        cy.wrap(arUserPage.AddFilter('Username', 'Equals', commonDetails.commonUserName + commonDetails.timestamp))
        cy.wrap(arUserPage.selectTableCellRecordUsers(commonDetails.commonUserName + commonDetails.timestamp))
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Delete'), 2000))
        cy.get(arUserPage.getAddEditMenuActionsByName('Delete')).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn()), 2000))
        cy.get(arUserPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click().wait(2000)
        cy.get(arUserPage.getNoResultMsg()).contains('No results found.').should('exist')
    })
})