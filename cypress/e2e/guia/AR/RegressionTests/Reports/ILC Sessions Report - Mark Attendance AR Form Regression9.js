import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { commonDetails } from "../../../../../../helpers/TestData/Courses/commonDetails"
import { ilcDetails } from "../../../../../../helpers/TestData/Courses/ilc"
import { users } from "../../../../../../helpers/TestData/users/users"
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import AREnrollUsersPage from "../../../../../../helpers/AR/pageObjects/User/AREnrollUsersPage"
import defaultTestData from '../../../../../fixtures/defaultTestData.json'
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"


describe("AUT-702 - C7327 - ILC Sessions Report - Mark Attendance AR Form Regression", () => {
    after('Delete the test user and course as part of clean-up', () => {
        for (let i = 0; i < commonDetails.courseIDs.length; i++) {
            cy.deleteCourse(commonDetails.courseIDs[i], 'instructor-led-courses-new')
        }
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:15000}).should("not.exist")
        ARDashboardPage.deleteUsers([userDetails.username, userDetails.username2])
    })

    it('Scenario 12 Mark Attendance - Inactive User', () => {
        cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
        cy.createUser(void 0, userDetails.username2, ["Learner"], void 0)
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getCoursesReport()
        // Create ILC course
        cy.createCourse('Instructor Led', ilcDetails.courseName, true)  
    
        // Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseIDs.push(id.request.url.slice(-36))
        })
        AREnrollUsersPage.getEnrollUserByCourseAndUsername([ilcDetails.courseName], [userDetails.username,userDetails.username2],ilcDetails.sessionName)
       })
    
       it('Scenario 12 Inactive User', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getUsersReport()
        // Search for Learner 14
        ARDashboardPage.AddFilter('Username', 'Contains', userDetails.username)
        
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        // Edit User
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit User', {timeout:10000})).should('have.attr', 'aria-disabled', 'false')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit User')).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        // Make the Learner 1 Inactive
        cy.get(ARDashboardPage.getElementByDataNameAttribute('enable-label'), {timeout:10000}).contains('Active').click()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('submit')).click()
       })
       
       it('Scenario 12 Mark Attendance page', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute("Reports")).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName("ILC Sessions"))
        ARDashboardPage.A5AddFilter('Course', 'Contains', ilcDetails.courseName) 
    
        cy.get(ARDashboardPage.getGridFilterResultLoader(), {timeout:10000}).should('not.exist')
    
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
    
        cy.get(ARCoursesPage.getGridTableColumnCourseName(ilcDetails.courseName)).should('be.visible')
    
        cy.get(ARDashboardPage.getGridTable(), {timeout:10000}).eq(0).click() 
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1), {timeout:10000}).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARDashboardPage.getGridTable()).should('contain', defaultTestData.USER_LEARNER_FNAME)
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        })
})