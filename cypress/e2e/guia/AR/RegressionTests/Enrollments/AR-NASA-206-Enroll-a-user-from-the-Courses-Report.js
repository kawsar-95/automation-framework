import { users } from '../../../../../../helpers/TestData/users/users'
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arUserPage from '../../../../../../helpers/AR/pageObjects/User/ARUserPage'
import {userDetails}  from '../../../../../../helpers/TestData/users/UserDetails'
import { commonDetails,credit } from '../../../../../../helpers/TestData/Courses/commonDetails'
import { ocDetails } from '../../../../../../helpers/TestData/Courses/oc'
import ARCourseSettingsEnrollmentRulesModule from "../../../../../../helpers/AR/pageObjects/Courses/modules/ARCourseSettingsEnrollmentRules.module"
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'

describe('C982 - GUIA-Story - NASA-206 - Enroll a user from the Courses Report (cloned)', () => {
   
    before('Create a user and course for enrollment', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        // Create a user for enrollment
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        // Create a course to enroll in
        arDashboardPage.getCoursesReport()
        // Create a course for all learners
        cy.createCourse('Online Course', ocDetails.courseName)
        // Set enrollment rule - Allow self enrollment for all learners
        cy.get(ARCourseSettingsEnrollmentRulesModule.getRadioBtnContainer()).contains('All Learners').click()
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = id.request.url.slice(-36);
        })
        cy.get(arDashboardPage.getToastSuccessMsg()).should('be.visible')

    })

    after('Delete the user and course as part of clean-up', () => {
        // Delete Course
        cy.deleteCourse(commonDetails.courseID)
        // Delete user
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.deleteUsers([userDetails.username])
    })

    beforeEach('Login as an admin to execute the tests', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    })

    it('Enroll a user in the selected course and save', () => {
        // Navigate to Course page
        arDashboardPage.getCoursesReport()
        // Search the newly craeted course
        AREnrollUsersPage.AddFilter('Name', 'Contains', ocDetails.courseName)
        cy.get(AREnrollUsersPage.getWaitSpinner()).should('not.exist')
        // Select the course that is found from the filter
        cy.get(AREnrollUsersPage.getTableCellName(2)).contains(ocDetails.courseName).click()
        // Click on Enroll User
        cy.get(AREnrollUsersPage.getAddEditMenuActionsByName('Enroll User')).should('have.attr','aria-disabled','false').click()
        cy.get(AREnrollUsersPage.getEnrollUsersPageTitle()).should('be.visible').and('contain', `Enroll Users`)
        cy.get(AREnrollUsersPage.getWaitSpinner()).should('not.exist')
        cy.get(AREnrollUsersPage.getEnrollUsersDDown()).click()
        // Assert that the Users dropdown is blank
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF()).should('be.empty')
        // Assert that the selected course is shown above the Courses dropdown
        cy.get(AREnrollUsersPage.getCourseNameModule()).contains(ocDetails.courseName)
        // Search a user to enroll
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF()).clear().type(userDetails.username)
        AREnrollUsersPage.getEnrollUsersOpt(userDetails.username)
        cy.get(AREnrollUsersPage.getWaitSpinner()).should('not.exist')
        // Save to enroll the user
        cy.get(AREnrollUsersPage.getSaveBtn()).click()
        cy.get(AREnrollUsersPage.getToastSuccessMsg()).should('be.visible')
    })

    it('Enroll a user in the selected course and cancel', () => {
        // Navigate to Course page
        arDashboardPage.getCoursesReport()
        // Search the newly craeted course
        AREnrollUsersPage.AddFilter('Name', 'Contains', ocDetails.courseName)
        cy.get(AREnrollUsersPage.getWaitSpinner()).should('not.exist')
        // Select the course that is found from the filter
        cy.get(AREnrollUsersPage.getTableCellName(2)).contains(ocDetails.courseName).click()
        // Click on Enroll User
        cy.get(AREnrollUsersPage.getAddEditMenuActionsByName('Enroll User')).should('have.attr','aria-disabled','false').click()
        cy.get(AREnrollUsersPage.getEnrollUsersPageTitle()).should('be.visible').and('contain', `Enroll Users`)
        // Search a user to enroll
        cy.get(AREnrollUsersPage.getWaitSpinner()).should('not.exist')
        cy.get(AREnrollUsersPage.getEnrollUsersDDown()).click()
        cy.get(AREnrollUsersPage.getEnrollUsersSearchTxtF()).clear().type(userDetails.username)
        AREnrollUsersPage.getEnrollUsersOpt(userDetails.username)
        // Cancel to discard user enrollment
        cy.get(AREnrollUsersPage.getCancelBtn()).click()
        // Modal ok button
        cy.get(arDeleteModal.getARDeleteBtn()).click()    
    })
})