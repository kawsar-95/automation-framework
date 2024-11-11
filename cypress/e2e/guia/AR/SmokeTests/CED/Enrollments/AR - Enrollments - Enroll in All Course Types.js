/// <reference types="cypress" />
import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursePage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arEnrollUsersPage from '../../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage'
import arUserPage from '../../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import arDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { courses } from '../../../../../../../helpers/TestData/Courses/courses'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../../helpers/TestData/users/UserDetails'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { arrayOfCourses } from '../../../../../../../helpers/TestData/Courses/commonDetails'

describe('AR - Smoke - Enrollment - Enroll in All Course Types', function() {
    
    before(function() {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
    })

    beforeEach(function() {        
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    it('should enroll a learner to an Online Course', function() {
        arDashboardPage.getCoursesReport()
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([arrayOfCourses.fiveElementsArray[0]], [userDetails.username])
    })

    it('should enroll a learner to an ILC', function() {
       arDashboardPage.getCoursesReport()
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([arrayOfCourses.fiveElementsArray[1]], [userDetails.username], courses.ilc_session_01_name)
    })

    it('should enroll a learner to a Course Bundle', function() {
        arDashboardPage.getCoursesReport()
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([arrayOfCourses.fiveElementsArray[2]], [userDetails.username])
    })

    it('should enroll a learner to an Curriculum', function() {
        arDashboardPage.getCoursesReport()
        arEnrollUsersPage.getEnrollUserByCourseAndUsername([arrayOfCourses.fiveElementsArray[4]], [userDetails.username])
    })

    it('should verify enrollments to courses exist', function() {
        arDashboardPage.getUsersReport()
        cy.wrap(arUserPage.AddFilter('Username', 'Starts With', userDetails.username))
        cy.wrap(arUserPage.selectTableCellRecordUsers(userDetails.username))
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('View Enrollments'), 2000))
        cy.get(arUserPage.getAddEditMenuActionsByName('View Enrollments')).click()
        cy.get(arUserPage.getGridTable()).should('have.length', arrayOfCourses.fiveElementsArray.length)
        cy.get(arUserPage.getFooterCount()).contains(`1 - ${arrayOfCourses.fiveElementsArray.length} of ${arrayOfCourses.fiveElementsArray.length} items`).should('exist')


        arrayOfCourses.fiveElementsArray.forEach((course) => {
            cy.get(arUserPage.getTableCellRecord()).contains(course).should('exist')
        })
    })

    it('should delete a user with existing enrollments', function() {
       arDashboardPage.getUsersReport()
        cy.wrap(arUserPage.AddFilter('Username', 'Equals', userDetails.username))
        cy.wrap(arUserPage.selectTableCellRecordUsers(userDetails.username))
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getAddEditMenuActionsByName('Delete'), 2000))
        cy.get(arUserPage.getAddEditMenuActionsByName('Delete')).click()
        cy.wrap(arUserPage.WaitForElementStateToChange(arUserPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn()), 2000))
        cy.get(arUserPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click().wait(2000);
        cy.get(arUserPage.getNoResultMsg()).contains('No results found.').should('exist')
    })
})