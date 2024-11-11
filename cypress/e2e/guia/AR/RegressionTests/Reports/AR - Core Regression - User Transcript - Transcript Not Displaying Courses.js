import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARUserTranscriptPage from "../../../../../../helpers/AR/pageObjects/User/ARUserTranscriptPage"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('AUT-705 - C7339 - Transcript Not Displaying Courses', () => {
    beforeEach(() => {
        // Enter the username & password then click on Login button
        cy.loginAdmin(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
    })

    it('Transcript Not Displaying Courses', () => {
        ARDashboardPage.getMediumWait()
        // Click on Users from left side panel.
        cy.get(ARDashboardPage.getMenu('Users')).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        ARDashboardPage.getMediumWait()
        // Select a user that has taken a few courses
        ARDashboardPage.AddFilter('Username', 'Equals', users.sysAdmin.admin_sys_01_username)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        // Click on user transcript for that user
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('User Transcript')).click()
        ARDashboardPage.getMediumWait()
        // Admins can see the courses the learner is enrolled in
        cy.get(ARUserTranscriptPage.getEnrollmentHeader()).should('exist').click()
        cy.get(ARUserTranscriptPage.getEnrollmentTable()).should('exist')
        // Login as system admin
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
        // Repeat step 3-5
        ARDashboardPage.getMediumWait()
        // Click on Users from left side panel.
        cy.get(ARDashboardPage.getMenu('Users')).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Users'))
        ARDashboardPage.getMediumWait()
        // Select a user that has taken a few courses
        ARDashboardPage.AddFilter('Username', 'Equals', users.sysAdmin.admin_sys_01_username)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        // Click on user transcript for that user
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('User Transcript')).click()
        ARDashboardPage.getMediumWait()
        // Admins can see the courses the learner is enrolled in
        cy.get(ARUserTranscriptPage.getEnrollmentHeader()).should('exist').click()
        cy.get(ARUserTranscriptPage.getEnrollmentTable()).should('exist')
        // Admin can click through to view the courses or the enrollment details
        cy.get(ARUserTranscriptPage.getEnrollmentTable()).should('exist').within(() => {
            cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        })
        // check it reached Edit Activity
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Edit Activity')

    })
})