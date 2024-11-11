import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import ARVenueAddEditPage from '../../../../../../../helpers/AR/pageObjects/Venue/ARVenueAddEditPage'
import ARDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { ilcDetails } from '../../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { venueDetails, venueTypes } from '../../../../../../../helpers/TestData/Venue/venueDetails'
import { miscData } from '../../../../../../../helpers/TestData/Misc/misc'

describe('AR - CED - ILC - Session - Create Classroom Venue', function(){

    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
    })

    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Verify Classroom Venue can be Created when Adding Session to ILC', () => {
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Courses'))
        
        //Create ILC
        cy.createCourse('Instructor Led', ilcDetails.courseName, false)

        //Add a session
        ARILCAddEditPage.getAddSession(ilcDetails.sessionName, ARILCAddEditPage.getFutureDate(2))

        //Create a new venue
        cy.get(ARILCAddEditPage.getAddVenueBtn()).click()
        ARILCAddEditPage.getShortWait()

        //Select the type
        cy.get(ARILCAddEditPage.getVenueTypeDDown()).click()
        cy.get(ARILCAddEditPage.getVenueTypeDDownOpt()).contains(venueTypes.classroom).click()

        //Verify name field is required
        cy.get(ARILCAddEditPage.getAddVenueNameTxtF()).type('a').clear()
        cy.get(ARILCAddEditPage.getErrorMsg()).should('contain', miscData.field_required_error)
        cy.get(ARILCAddEditPage.getOKBtn()).should('have.attr', 'aria-disabled', 'true')
        //Enter valid name
        cy.get(ARILCAddEditPage.getAddVenueNameTxtF()).type(`${venueDetails.venueName} - ${venueTypes.classroom}`)

        //Verify max class size is required
        cy.get(ARILCAddEditPage.getMaxClassTxtF()).clear()
        cy.get(ARILCAddEditPage.getErrorMsg()).should('contain', miscData.field_required_error)
        cy.get(ARILCAddEditPage.getOKBtn()).should('have.attr', 'aria-disabled', 'true')
        //Verify max class size does not accept negative values
        cy.get(ARILCAddEditPage.getMaxClassTxtF()).type('-1')
        cy.get(ARILCAddEditPage.getErrorMsg()).should('contain', miscData.negative_chars_error)
        //Verify max class size does not accept letters
        cy.get(ARILCAddEditPage.getMaxClassTxtF()).type('a').blur()
        cy.get(ARILCAddEditPage.getMaxClassTxtF()).should('have.value', '-1')
        //Enter valid max class size
        cy.get(ARILCAddEditPage.getMaxClassTxtF()).clear().type(venueDetails.maxClassSize)

        //Fill in all fields
        cy.get(ARILCAddEditPage.getAddVenueDescription()).eq(1).type(venueDetails.description)
        cy.get(ARILCAddEditPage.getAddressTxtF()).type(venueDetails.address)
        cy.get(ARILCAddEditPage.getCountryDDown()).click()
        cy.get(ARILCAddEditPage.getCountryDDownTxtF()).type(venueDetails.country)
        cy.get(ARILCAddEditPage.getCountryDDownOpt()).contains(venueDetails.country).click()
        cy.get(ARILCAddEditPage.getProvinceDDown()).click()
        cy.get(ARILCAddEditPage.getProvinceDDownTxtF()).type(venueDetails.province)
        cy.get(ARILCAddEditPage.getProvinceDDownOpt()).contains(venueDetails.province).click()
        cy.get(ARILCAddEditPage.getCityTxtF()).type(venueDetails.city)
        cy.get(ARILCAddEditPage.getPostalCodeTxtF()).type(venueDetails.zip)

        //Save the venue
        cy.get(ARILCAddEditPage.getOKBtn()).click()
        ARILCAddEditPage.getLShortWait()

        // Save Session
        cy.get(ARILCAddEditPage.getAddEditSessionSaveBtn()).click()
        cy.intercept('**/sessions/report').as(`getSession`).wait(`@getSession`)

        //Publish ILC
        cy.publishCourseAndReturnId().then((id) => {
            commonDetails.courseID = (id.request.url.slice(-36));
        })
    })

    it('Verify Venue Details Persist, Delete Venue', () => {
        //Filter for Venue
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Venues'))
        cy.intercept('/api/rest/v2/admin/reports/venues/operations').as('getVenues').wait('@getVenues')
        ARVenueAddEditPage.AddFilter('Name', 'Contains', `${venueDetails.venueName} - ${venueTypes.classroom}`)
        cy.wait('@getVenues')
        ARVenueAddEditPage.selectTableCellRecord(`${venueDetails.venueName} - ${venueTypes.classroom}`)
        ARVenueAddEditPage.WaitForElementStateToChange(ARVenueAddEditPage.getAddEditMenuActionsByName('Edit Venue'))
        cy.get(ARVenueAddEditPage.getAddEditMenuActionsByName('Edit Venue')).click()
        ARVenueAddEditPage.getLShortWait()

        //Verify fields persisted
        cy.get(ARVenueAddEditPage.getNameTxtF()).should('have.value', `${venueDetails.venueName} - ${venueTypes.classroom}`)
        cy.get(ARVenueAddEditPage.getDescriptionTxtF()).should('contain.text', venueDetails.description)
        cy.get(ARVenueAddEditPage.getMaxClassSizeTxtF()).should('have.value', venueDetails.maxClassSize)
        cy.get(ARVenueAddEditPage.getAddressTxtF()).should('have.value', venueDetails.address)
        cy.get(ARVenueAddEditPage.getCountryF()).invoke('text').then((val) => {
            expect(val).to.equal(venueDetails.country)
        })
        cy.get(ARVenueAddEditPage.getProvinceF()).invoke('text').then((val) => {
            expect(val).to.equal(venueDetails.province)
        })
        cy.get(ARVenueAddEditPage.getCityTxtF()).should('have.value', venueDetails.city)
        cy.get(ARVenueAddEditPage.getPostalCodeTxtF()).should('have.value', venueDetails.zip)

        //Delete venue
        cy.go('back')
        ARDeleteModal.getDeleteItem('AR', 'Delete Venue')
        cy.get(arDashboardPage.getNoResultMsg()).should('be.visible')
    })
})