import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C6352 - Setup - Logins', () => {

    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            '/admin'
        )
    })
    it('Select, Deselect, Edit, User Transcript, View Enrollment', () => {
        const username = 'GUIA-CED-User'
        //Navigate to Logins
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        ARDashboardPage.getMenuItemOptionByName('Logins')
        ARDashboardPage.getMediumWait()
        //Select User
        ARDashboardPage.A5AddFilter('Was Successful', 'Yes', null)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        //Verify the action buttons
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).should('contain', 'Edit User')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).should('contain', 'User Transcript')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(3)).should('contain', 'View Enrollments')
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(4)).should('exist')

        //Click on deselect
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(4)).click({ force: true })

        //Select user
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        //Click on Edit User
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click({ force: true })
        ARDashboardPage.getLongWait()
        //Click on Cancel
        cy.get(ARDashboardPage.getElementByDataNameAttribute('cancel')).click()
        ARDashboardPage.getMediumWait()

        //Select User
        ARDashboardPage.A5AddFilter('Was Successful', 'Yes', null)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        //Click on User Transcript
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).click({ force: true })
        ARDashboardPage.getLongWait()
        //Click on back
        cy.get(ARDashboardPage.getElementByDataNameAttribute('back')).click()
        ARDashboardPage.getMediumWait()

        //Select User
        ARDashboardPage.A5AddFilter('Was Successful', 'Yes', null)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        //Click on View Enrollments
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(3)).click({ force: true })
        ARDashboardPage.getLongWait()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('back')).click()

    })
})