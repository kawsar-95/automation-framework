/// <reference types="cypress" />
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arVenuePage from '../../../../../../helpers/AR/pageObjects/Venue/ARVenuePage'
import arVenueAddEditPage from '../../../../../../helpers/AR/pageObjects/Venue/ARVenueAddEditPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { venueDetails} from '../../../../../../helpers/TestData/Venue/venueDetails'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('AR - CED - Venue', function () {

    beforeEach(function () {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //cy.get(arDashboardPage.getSysAdminDashboardPageTitle()).should('have.text', arDashboardPage.getSysAdminDashboardPageTitleTxt())
        // Click the Courses menu item
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Venues')
        cy.intercept('**/operations').as('getVenue').wait('@getVenue');
    })

    it('should allow admin to create Venue', () => {
        // Create Venue
        cy.get(arVenuePage.getPageHeaderTitle()).should('have.text', "Venues")
        cy.get(arVenuePage.getAddEditMenuActionsByName('Add Venue')).click()
        arVenueAddEditPage.getLShortWait()
        cy.get(arVenueAddEditPage.getNameTxtF()).clear().type(venueDetails.venueName)
        cy.get(arVenueAddEditPage.getDescriptionTxtF()).type(venueDetails.description)
        cy.get(arVenueAddEditPage.getMaxClassSizeTxtF()).clear().type(venueDetails.maxClassSize)
        cy.get(arVenueAddEditPage.getAddressTxtF()).type(venueDetails.address)
        cy.get(arVenueAddEditPage.getCountryDDOwn()).click()
        cy.get(arVenueAddEditPage.getCountryDDownSearchTxtF()).type(venueDetails.country)
        cy.get(arVenueAddEditPage.getCountryDDOwnOpt()).contains(venueDetails.country).click()
        cy.get(arVenueAddEditPage.getProvinceDDown()).click()
        cy.get(arVenueAddEditPage.getProvinceDDownSearchTxtF()).type(venueDetails.province)
        cy.get(arVenueAddEditPage.getProvinceDDOwnOpt()).contains(venueDetails.province).click()
        cy.get(arVenueAddEditPage.getCityTxtF()).type(venueDetails.city)
        cy.get(arVenueAddEditPage.getPostalCodeTxtF()).type(venueDetails.zip)
        // Save Venue
        cy.get(arVenueAddEditPage.getSaveBtn()).click()
        cy.get(arVenueAddEditPage.getToastSuccessMsg()).should('contain', 'Venue has been created.')
        cy.get(arVenueAddEditPage.getToastCloseBtn()).click()
    })

    it('should allow admin to edit a Venue', () => {
        // Search and edit Venue
        arVenuePage.AddFilter('Name', 'Contains', venueDetails.venueName)
        arVenuePage.selectTableCellRecord(venueDetails.venueName)
        arVenuePage.WaitForElementStateToChange(arVenuePage.getAddEditMenuActionsByName('Edit Venue'))
        cy.get(arVenuePage.getAddEditMenuActionsByName('Edit Venue')).click()
        cy.intercept('**/provinces/CA').as('getVenue1').wait('@getVenue1')
        cy.get(arVenueAddEditPage.getNameTxtF()).clear().type(venueDetails.venueNameEdited)
        // Save Venue
        arVenuePage.WaitForElementStateToChange(arVenueAddEditPage.getSaveBtn())
        cy.get(arVenueAddEditPage.getSaveBtn()).click()
        cy.get(arVenueAddEditPage.getToastSuccessMsg()).should('contain', 'Venue has been updated.')
        cy.get(arVenueAddEditPage.getToastCloseBtn()).click()
    })

    it('should allow admin to delete a Venue', () => {
        // Search and delete Venue
        arVenuePage.AddFilter('Name', 'Contains', venueDetails.venueNameEdited)
        arVenuePage.selectTableCellRecord(venueDetails.venueNameEdited)
        arVenuePage.WaitForElementStateToChange(arVenuePage.getAddEditMenuActionsByName('Delete Venue'))
        cy.get(arVenuePage.getAddEditMenuActionsByName('Delete Venue')).click()
        cy.get(arVenuePage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click().wait('@getVenue')
        // Verify Venue is deleted
        cy.get(arVenuePage.getNoResultMsg()).should('have.text', 'No results found.')
    })

})