import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARVenuePage from "../../../../../../../helpers/AR/pageObjects/Venue/ARVenuePage"
import { users } from "../../../../../../../helpers/TestData/users/users"

describe('C966 - Default Button To Venues Report', () => {

    it('System Admin - Default Button To Venues Report', () => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
        ARDashboardPage.getMediumWait()
        // Navigate to Venues
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Venues'))
        cy.intercept('/api/rest/v2/admin/reports/venues/operations').as('getVenues').wait('@getVenues')
        ARDashboardPage.getMediumWait()
        // As an Admin Verify that all default buttons appear in the Venues report
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Venue')).should('exist')
        // As an Admin Verify all the Single Operation Buttons Appear in the Venues report
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit Venue')).should('exist')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete Venue')).should('exist')
        cy.get(ARVenuePage.getActionBtnContainer()).within(() => {
            cy.get(ARDashboardPage.getDeselectBtn()).should('exist')
        })
    })

    it('Test it for group admin', () => {
        cy.apiLoginWithSession(
            users.groupAdminLogInOut.admin_group_loginout_username,
            users.groupAdminLogInOut.admin_group_loginout_password,
            "/admin"
        )
        ARDashboardPage.getMediumWait()
        // Navigate to Venues
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Venues'))
        cy.intercept('/api/rest/v2/admin/reports/venues/operations').as('getVenues').wait('@getVenues')
        ARDashboardPage.getMediumWait()
        // As an Admin Verify that all default buttons appear in the Venues report
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Venue')).should('exist')
        // As an Admin Verify all the Single Operation Buttons Appear in the Venues report
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit Venue')).should('exist')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete Venue')).should('exist')
        cy.get(ARVenuePage.getActionBtnContainer()).within(() => {
            cy.get(ARDashboardPage.getDeselectBtn()).should('exist')
        })
    })
    it('Test it for Dept admin', () => {
        cy.apiLoginWithSession(
            users.depAdminLogInOut.admin_dep_loginout_username,
            users.depAdminLogInOut.admin_dep_loginout_password,
            "/admin"
        )
        ARDashboardPage.getMediumWait()
        // Navigate to Venues
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Venues'))
        cy.intercept('/api/rest/v2/admin/reports/venues/operations').as('getVenues').wait('@getVenues')
        ARDashboardPage.getMediumWait()
        // As an Admin Verify that all default buttons appear in the Venues report
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Venue')).should('exist')
        // As an Admin Verify all the Single Operation Buttons Appear in the Venues report
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit Venue')).should('exist')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete Venue')).should('exist')
        cy.get(ARVenuePage.getActionBtnContainer()).within(() => {
            cy.get(ARDashboardPage.getDeselectBtn()).should('exist')
        })
    })
    it('Verify that refresh during navigation dose not cause any errors', () => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
        ARDashboardPage.getMediumWait()
        // Navigate to Venues
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Venues'))
        cy.reload()
        ARDashboardPage.getLongWait()
        cy.get(ARDashboardPage.getElementByDataNameAttribute('title')).should('contain', 'Venues')
    })

})