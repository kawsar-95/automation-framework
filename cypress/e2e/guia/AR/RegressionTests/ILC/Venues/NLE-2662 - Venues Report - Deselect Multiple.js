import ARDashboardPage from "../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARRolesAddEditPage from "../../../../../../../helpers/AR/pageObjects/Roles/ARRolesAddEditPage"
import ARVenuePage from "../../../../../../../helpers/AR/pageObjects/Venue/ARVenuePage"
import { users } from "../../../../../../../helpers/TestData/users/users"
import { rolesDetails } from "../../../../../../../helpers/TestData/Roles/rolesDetails"
import ARVenueAddEditPage from "../../../../../../../helpers/AR/pageObjects/Venue/ARVenueAddEditPage"
import { venueDetails } from "../../../../../../../helpers/TestData/Venue/venueDetails"

describe('AUT-585 - C2045 -  GUIA-Story - NLE-2662 Venues Report - Deselect Multiple', () => {

    before('Create venues for the test', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARVenueAddEditPage.addSampleVenue(venueDetails.venueName)
        ARVenueAddEditPage.addSampleVenue(venueDetails.venueName2)
    })

    after('Delete new Admin user and Venues', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        ARVenuePage.deleteVenues([venueDetails.venueName, venueDetails.venueName2])
    })

    it('Verify that the Admin user has permission to view Venues report', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        ARDashboardPage.getRolesReport()
        ARRolesAddEditPage.AddFilter('Name', 'Equals', rolesDetails.Admin)
        ARRolesAddEditPage.selectTableCellRecord(rolesDetails.Admin)
        cy.get(ARRolesAddEditPage.getAddEditMenuActionsByName('View Role'), {timeout: 3000}).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARRolesAddEditPage.getPageHeaderTitle(), {timeout: 3000}).contains('View Role')
        ARRolesAddEditPage.assertChildPermission('Venues', 'View', 'true')
    })

    it('Venues Report - Deselect Multiple', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 15000 }).should('not.exist')
        // Navigate to Venues
        ARDashboardPage.getVenuesReport()

        ARVenuePage.AddFilter('Name', 'Equals', venueDetails.venueName)
        // Selecting first row 
        ARVenuePage.selectTableCellRecord(venueDetails.venueName)

        ARVenuePage.AddFilter('Name', 'Equals', venueDetails.venueName2)
        // Selecting second row 
        ARVenuePage.selectTableCellRecord(venueDetails.venueName2)

        // Verify that the Deselect is the last button
        cy.get(ARVenuePage.getContextMenuBtn(), {timeout: 1000}).eq(-1).contains('Deselect')

        cy.get(ARVenuePage.getActionBtnContainer()).within(() => {
            cy.get(ARVenuePage.getDeselectBtn()).should('exist').click()
        })
    })
})