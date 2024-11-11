/// <reference types = "cypress"/>
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arEnrollUsersPage from '../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arUserUnEnrollModal from '../../../../../../helpers/AR/pageObjects/Modals/ARUserUnEnrollModal'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import arSelectModal from '../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../helpers/TestData/users/users'
import { courses } from '../../../../../../helpers/TestData/Courses/courses'
import ARILCActivityReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARILCActivityReportPage'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'

describe('AR - Regress - Enrollments - Bulk Enroll Re-Enroll Un-enroll - CB', function () {

    //test specific arrays
    //thses courses are not found 
    //courses.cb_filter_01_name
    //courses.cb_ecomm_01_name
    //courses.cb_ecomm_free_01_ilc_child_02
    //courses.cb_ecomm_free_01_oc_child_01 it has 100 as score
    let courseBundles = [courses.cb_ecomm_free_course_01_name];
    let courseBundleCourses = [courses.cb_filter_01_oc_child_01,
    courses.ilc_ecomm_child_01_name];

    before(function () {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(function () {
        cy.loginAdmin(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getUserEnrollmentsReport()
    })

    after(function () {
        //Delete user
        ARDashboardPage.getUsersReport()
        cy.wrap(arUserPage.AddFilter('Username', 'Equals', userDetails.username))
        cy.wrap(arUserPage.selectTableCellRecordByIndexAndName(userDetails.username,4))
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Delete'), arEnrollUsersPage.getShortWait()))
        cy.get(arUserPage.getAddEditMenuActionsByName('Delete')).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn()), arEnrollUsersPage.getLShortWait()))
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click()
        cy.get(arUserPage.getNoResultMsg()).contains('No results found.').should('exist')
    })

    it('Bulk enroll learner to course bundles', function () {
        cy.wrap(arEnrollUsersPage.EnrollmentPageFilter(userDetails.username))
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getAddEditMenuActionsByName('Add Enrollment')), arEnrollUsersPage.getShortWait())
        cy.get(arEnrollUsersPage.getAddEditMenuActionsByName('Add Enrollment')).should('have.attr','aria-disabled','false').click()
        cy.get(arDashboardPage.getElementByDataNameAttribute(arEnrollUsersPage.getEnrollUsersAddCourseBtn())).click()
        cy.wrap(arEnrollUsersPage.SearchAndSelectFunction(courseBundles))
        cy.get(arDashboardPage.getElementByDataNameAttribute(arEnrollUsersPage.getEnrollUsersAddCourseBtn())).click()
        cy.wrap(arEnrollUsersPage.SearchAndSelectFunction(courseBundleCourses))
        cy.wrap(arEnrollUsersPage.WaitForElementStateToChange(arEnrollUsersPage.getSaveBtn()), arEnrollUsersPage.getShortWait())
        cy.get(arEnrollUsersPage.getSaveBtn()).click()
        //Wait for enrollment to complete
        cy.get(arEnrollUsersPage.getToastSuccessMsg(), { timeout: 30000 }).should('contain', 'Enrollment Successful')
    })

    it('Verify learner was enrolled to course bundles and its courses then bulk Un-enroll learner from Course Bundles', function () {
        cy.wrap(arEnrollUsersPage.EnrollmentPageFilter(userDetails.username))
        courseBundles.forEach((courseBundle) => {
            cy.get(arUserPage.getTableCellRecord()).contains(courseBundle).parent().within(() => {
                cy.get('td').eq(3).should('have.text', '0')
                cy.get('td').eq(4).should('have.text', 'N/A')
            }).click()
        })

        courseBundleCourses.forEach((course) => {
            cy.get(arUserPage.getTableCellRecord()).contains(course).parent().within(() => {
                cy.get('td').eq(3).should('have.text', '0')
                cy.get('td').eq(4).should('have.text', 'Not Started')
            })
        })

        cy.get(arUserPage.getGridTable()).should('have.length', courseBundles.length + courseBundleCourses.length)
        cy.get(arUserPage.getFooterCount()).contains(`1 - ${courseBundles.length + courseBundleCourses.length} of ${courseBundles.length + courseBundleCourses.length} items`).should('exist')
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Un-enroll User'), 1000))
        cy.get(arUserPage.getAddEditMenuActionsByName('Un-enroll User')).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserUnEnrollModal.getOKBtn(), arEnrollUsersPage.getShortWait()))
        cy.get(arUserUnEnrollModal.getOKBtn()).click()

        //Wait for un-enrollment to complete
        //Asserting courseBundle course is unenrolled 
        courseBundles.forEach((courseBundle) => {
            cy.get(arUserPage.getTableCellRecord()).should('not.contain' , courseBundle)
        })

    })

    it('Verify learner was un-enrolled from course bundles but not from child courses of the course bundles', function () {
        cy.wrap(arEnrollUsersPage.EnrollmentPageFilter(userDetails.username))
        cy.get(arUserPage.getGridTable()).should('have.length', courseBundleCourses.length)
        cy.get(arUserPage.getFooterCount()).contains(`1 - ${courseBundleCourses.length} of ${courseBundleCourses.length} items`).should('exist')

        // Verify learner is un-enrolled from course bundles but still enrolled to the courses in the course bundles
        courseBundles.forEach((courseBundle) => {
            cy.get(arUserPage.getTableCellRecord()).should('not.deep.equal', courseBundle)
        })

        courseBundleCourses.forEach((course) => {
            cy.get(arUserPage.getTableCellRecord()).contains(course).parent().within(() => {
                cy.get('td').eq(3).should('have.text', '0')
                cy.get('td').eq(4).should('have.text', 'Not Started')
            })
        })
    })
})