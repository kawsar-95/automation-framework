/// <reference types = "cypress"/>
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arEditActivityPage from '../../../../../../helpers/AR/pageObjects/Enrollment/AREditActivityPage'
import arUserReEnrollModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUserReEnrollModal'
import arUserUnEnrollModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUserUnEnrollModal'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'

describe('AR - Regress - Enrollments - Bulk Enroll Re-Enroll Un-enroll - ILC', function () {

    //courses that are not working properly
    //courses.ilc_ecomm_free_course_01_name
    //and its session 
    //[courses.ilc_ecomm_free_course_01_name, courses.ilc_ecomm_free_01_session_name],
    //test specific arrays
    let ilcs = [courses.ilc_ecomm_01_name , courses.ilc_filter_01_name];
    let ilcsessions = [[courses.ilc_ecomm_01_name, courses.ilc_ecomm_01_session_name],
    [courses.ilc_filter_01_name, courses.ilc_session_01_name]];

    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(function () {
        cy.loginAdmin(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getUserEnrollmentsReport()
    })

    after(function () {
        //Delete user
        arDashboardPage.getUsersReport()
        arUserPage.deleteUser('Username',userDetails.username)
    })

    it('Bulk enroll learner to ILCs', function () {
        cy.wrap(arEnrollUsersPage.EnrollmentPageFilter(userDetails.username))
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getAddEditMenuActionsByName('Add Enrollment')), arEnrollUsersPage.getShortWait())
        cy.get(arEnrollUsersPage.getAddEditMenuActionsByName('Add Enrollment')).should('have.attr','aria-disabled','false').click()
        cy.get(arDashboardPage.getElementByDataNameAttribute(arEnrollUsersPage.getEnrollUsersAddCourseBtn())).click()
        cy.wrap(arEnrollUsersPage.SearchAndSelectFunction(ilcs))
        for (var i = 0; i < ilcs.length; i++) {
            cy.wrap(arEnrollUsersPage.getSelectILCSessionWithinCourse(ilcsessions[i][0], ilcsessions[i][1]))
        }
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getSaveBtn()), arEnrollUsersPage.getShortWait())
        cy.get(arEnrollUsersPage.getSaveBtn()).click()
        cy.get(arEnrollUsersPage.getToastSuccessMsg(), { timeout: 30000 }).should('contain', 'Enrollment Successful')
    })

    it(`Verify learner enrollments to ILCs then Bulk Re-enroll learner to ILCs`, function () {
        cy.wrap(arEnrollUsersPage.EnrollmentPageFilter(userDetails.username))

        ilcs.forEach((course) => {
            cy.get(arUserPage.getTableCellRecord()).contains(course).parent().within(() => {
                cy.get('td').eq(3).should('have.text', '0')
                cy.get('td').eq(4).should('have.text', 'Not Started')
            }).click()
            cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Edit Enrollment'), arEnrollUsersPage.getShortWait()))
            cy.get(arUserPage.getAddEditMenuActionsByName('Edit Enrollment')).click()
            arUserPage.getShortWait() // Wait for radio btns to become enabled
            cy.wrap(arEditActivityPage.getMarkEnrollmentAsRadioBtn('Completed'))
            cy.wrap(arUserPage.WaitForElementStateToChange(arEditActivityPage.getSaveBtn(), arEnrollUsersPage.getShortWait()))
            cy.get(arEditActivityPage.getSaveBtn()).click()
            cy.get(arUserPage.getTableCellRecord()).contains(course).parent().within(() => {
                cy.get('td').eq(3).should('have.text', '100')
                cy.get('td').eq(4).should('have.text', 'Complete')
            }).click()
        })

        ilcs.forEach((course) => {
            cy.get(arUserPage.getTableCellRecord()).contains(course).click()
        })

        cy.get(arUserPage.getGridTable()).should('have.length', ilcs.length)
        cy.get(arUserPage.getFooterCount()).contains(`1 - ${ilcs.length} of ${ilcs.length} items`).should('exist')

        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Re-enroll User'), 1000))
        cy.get(arUserPage.getAddEditMenuActionsByName('Re-enroll User')).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arDashboardPage.getElementByDataNameAttribute(arUserReEnrollModal.getOKBtn()), arEnrollUsersPage.getShortWait()))
        cy.get(arDashboardPage.getElementByDataNameAttribute(arUserReEnrollModal.getOKBtn())).click()
        cy.get(arEnrollUsersPage.getToastSuccessMsg(), { timeout: 30000 }).should('contain', 'Re-enrollment Successful')

        
    })

    it('Verify learner was re-enrolled to ILCs then bulk Un-enroll from ILCs', function () {
        cy.wrap(arEnrollUsersPage.EnrollmentPageFilter(userDetails.username))

        ilcs.forEach((course) => {
            cy.get(arUserPage.getTableCellRecord()).contains(course).parent().within(() => {
                cy.get('td').eq(3).should('have.text', '0')
                cy.get('td').eq(4).should('have.text', 'Not Started')
            }).click()
        })

        cy.get(arUserPage.getGridTable()).should('have.length', ilcs.length)
        cy.get(arUserPage.getFooterCount()).contains(`1 - ${ilcs.length} of ${ilcs.length} items`).should('exist')

        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Un-enroll User'), 1000))
        cy.get(arUserPage.getAddEditMenuActionsByName('Un-enroll User')).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserUnEnrollModal.getOKBtn(), arEnrollUsersPage.getLShortWait()))
        cy.get(arUserUnEnrollModal.getOKBtn()).click()

       
    })

    it('Verify learner was un-enrolled to ILCs', function () {
        cy.wrap(arEnrollUsersPage.EnrollmentPageFilter(userDetails.username))
        cy.get(arUserPage.getNoResultMsg()).contains('No results found.').should('exist')
    })
})