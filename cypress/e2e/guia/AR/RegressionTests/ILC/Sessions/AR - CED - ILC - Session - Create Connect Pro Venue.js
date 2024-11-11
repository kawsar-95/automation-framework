import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARILCAddEditPage from '../../../../../../../helpers/AR/pageObjects/Courses/ILC/ARILCAddEditPage'
import ARVenueAddEditPage from '../../../../../../../helpers/AR/pageObjects/Venue/ARVenueAddEditPage'
import ARDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { ilcDetails } from '../../../../../../../helpers/TestData/Courses/ilc'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { miscData } from '../../../../../../../helpers/TestData/Misc/misc'
import { venueDetails, venueTypes } from '../../../../../../../helpers/TestData/Venue/venueDetails'

describe('AR - CED - ILC - Session - Create Connect Pro Venue', function(){

    beforeEach(() => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
    })

    after(function() {
        cy.deleteCourse(commonDetails.courseID, 'instructor-led-courses-new')
    })

    it('Verify Connect Pro Venue can be Created when Adding Session to ILC', () => {
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
        cy.get(ARILCAddEditPage.getVenueTypeDDownOpt()).contains(venueTypes.connectPro).click()

        //Enter valid name
        cy.get(ARILCAddEditPage.getAddVenueNameTxtF()).type(`${venueDetails.venueName} - ${venueTypes.connectPro}`)
        //Enter valid max class size
        cy.get(ARILCAddEditPage.getMaxClassTxtF()).clear().type(venueDetails.maxClassSize)

        //Verify Url is required
        cy.get(ARILCAddEditPage.getUrlTxtF()).type('a').clear()
        cy.get(ARILCAddEditPage.getErrorMsg()).should('contain', miscData.field_required_error)
        cy.get(ARILCAddEditPage.getOKBtn()).should('have.attr', 'aria-disabled', 'true')
        //Enter valid Url
        cy.get(ARILCAddEditPage.getUrlTxtF()).type(miscData.remote_vide0_url)

        //Fill in specific fields
        cy.get(ARILCAddEditPage.getAddVenueDescription()).eq(1).type(venueDetails.description)
        cy.get(ARILCAddEditPage.getPhoneNumberTxtF()).type(venueDetails.phoneNumber)
        cy.get(ARILCAddEditPage.getUsernameTxtF()).type(users.learner01.learner_01_username)
        cy.get(ARILCAddEditPage.getPasswordTxtF()).type(users.learner01.learner_01_password)
        
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
        ARVenueAddEditPage.AddFilter('Name', 'Contains', `${venueDetails.venueName} - ${venueTypes.connectPro}`)
        ARVenueAddEditPage.selectTableCellRecord(`${venueDetails.venueName} - ${venueTypes.connectPro}`)
        ARVenueAddEditPage.WaitForElementStateToChange(ARVenueAddEditPage.getAddEditMenuActionsByName('Edit Venue'))
        cy.get(ARVenueAddEditPage.getAddEditMenuActionsByName('Edit Venue')).click()
        ARVenueAddEditPage.getLShortWait()

        //Verify fields persisted
        cy.get(ARVenueAddEditPage.getNameTxtF()).should('have.value', `${venueDetails.venueName} - ${venueTypes.connectPro}`)
        cy.get(ARVenueAddEditPage.getDescriptionTxtF()).should('contain.text', venueDetails.description)
        cy.get(ARVenueAddEditPage.getMaxClassSizeTxtF()).should('have.value', venueDetails.maxClassSize)
        cy.get(ARVenueAddEditPage.getPhoneTxtF()).should('have.value', venueDetails.phoneNumber)
        cy.get(ARVenueAddEditPage.getUsernameTxtF()).should('have.value', users.learner01.learner_01_username)
        cy.get(ARVenueAddEditPage.getPasswordTxtF()).should('have.value', users.learner01.learner_01_password)
        cy.get(ARVenueAddEditPage.getUrlTxtF()).should('have.value', miscData.remote_vide0_url)

        //Delete venue
        cy.go('back')
        ARDeleteModal.getDeleteItem('AR', 'Delete Venue')
        cy.get(arDashboardPage.getNoResultMsg()).should('be.visible')
    })
})