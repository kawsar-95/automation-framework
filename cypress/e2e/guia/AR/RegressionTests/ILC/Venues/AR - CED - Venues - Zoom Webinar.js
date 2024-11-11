import arDashboardPage from '../../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCoursesPage from '../../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARVenueAddEditPage from '../../../../../../../helpers/AR/pageObjects/Venue/ARVenueAddEditPage'
import ARSelectModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARSelectModal'
import ARDeleteModal from '../../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { commonDetails } from '../../../../../../../helpers/TestData/Courses/commonDetails'
import { users } from '../../../../../../../helpers/TestData/users/users'
import { userDetails } from '../../../../../../../helpers/TestData/users/UserDetails'
import { venueDetails, venueTypes } from '../../../../../../../helpers/TestData/Venue/venueDetails'
import { miscData } from '../../../../../../../helpers/TestData/Misc/misc'
import { departments } from '../../../../../../../helpers/TestData/Department/departments'

describe('AR - CED - Venues - Zoom Webinar', function(){

    beforeEach(() => {
        //Sign into admin side as sys admin, navigate to Venues
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        cy.wrap(arDashboardPage.getMenuItemOptionByName('Venues'))
        cy.intercept('/api/rest/v2/admin/reports/venues/operations').as('getVenues').wait('@getVenues')
    })

    it(`Verify ${venueTypes.zoomWebinar} Venue can be Created`, () => {
        cy.wrap(arCoursesPage.WaitForElementStateToChange(arCoursesPage.getAddEditMenuActionsByName('Add Venue'), 1000))
        cy.get(arCoursesPage.getAddEditMenuActionsByName('Add Venue')).click()

        //Select venue type
        cy.get(ARVenueAddEditPage.getTypeDDown()).click()
        cy.get(ARVenueAddEditPage.getTypeDDownOpt()).contains(venueTypes.zoomWebinar).click()

        //Verify name field is required
        cy.get(ARVenueAddEditPage.getNameTxtF()).type('a').clear()
        cy.get(ARVenueAddEditPage.getErrorMsg()).should('contain', miscData.field_required_error)
        cy.get(ARVenueAddEditPage.getSaveBtn()).should('have.attr', 'aria-disabled', 'true')
        //Enter valid name
        cy.get(ARVenueAddEditPage.getNameTxtF()).type(`${venueDetails.venueName} - ${venueTypes.zoomWebinar}`)

        //Verify description cannot be more than 4000 chars
        cy.get(ARVenueAddEditPage.getDescriptionTxtF()).invoke('text', ARVenueAddEditPage.getLongString(4001)).type('a', {force:true})
        cy.get(ARVenueAddEditPage.getErrorMsg()).should('contain', miscData.char_4000_error)
        //Enter valid description
        cy.get(ARVenueAddEditPage.getDescriptionTxtF()).clear()
        cy.get(ARVenueAddEditPage.getDescriptionTxtF()).type(venueDetails.description)

        //Verify max class size is required
        cy.get(ARVenueAddEditPage.getMaxClassSizeTxtF()).clear()
        cy.get(ARVenueAddEditPage.getErrorMsg()).should('contain', miscData.field_required_error)
        cy.get(ARVenueAddEditPage.getSaveBtn()).should('have.attr', 'aria-disabled', 'true')
        //Verify max class size does not accept negative values
        cy.get(ARVenueAddEditPage.getMaxClassSizeTxtF()).type('-1')
        cy.get(ARVenueAddEditPage.getErrorMsg()).should('contain', miscData.negative_chars_error)
        //Verify max class size does not accept letters
        cy.get(ARVenueAddEditPage.getMaxClassSizeTxtF()).type('a').blur()
        cy.get(ARVenueAddEditPage.getMaxClassSizeTxtF()).should('have.value', '-1')
        //Enter valid max class size
        cy.get(ARVenueAddEditPage.getMaxClassSizeTxtF()).clear().type(venueDetails.maxClassSize)

        //Select department
        cy.get(ARVenueAddEditPage.getDepartmentBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.dept_top_name])

        //Save Venue
        ARVenueAddEditPage.WaitForElementStateToChange(ARVenueAddEditPage.getSaveBtn())
        cy.get(ARVenueAddEditPage.getSaveBtn()).click()
        cy.get(ARVenueAddEditPage.getToastSuccessMsg()).should('contain', 'Venue has been created.')
        cy.get(ARVenueAddEditPage.getToastCloseBtn()).click()
    })

    it(`Verify ${venueTypes.zoomWebinar} Venue Values Persist, Edit Venue`, () => {
        //Filter for and edit venue
        ARVenueAddEditPage.AddFilter('Name', 'Contains', `${venueDetails.venueName} - ${venueTypes.zoomWebinar}`)
        ARVenueAddEditPage.selectTableCellRecord(`${venueDetails.venueName} - ${venueTypes.zoomWebinar}`)
        ARVenueAddEditPage.WaitForElementStateToChange(ARVenueAddEditPage.getAddEditMenuActionsByName('Edit Venue'))
        cy.get(ARVenueAddEditPage.getAddEditMenuActionsByName('Edit Venue')).click()
        ARVenueAddEditPage.getLShortWait()
        
        //Verify values persisted and edit them
        cy.get(ARVenueAddEditPage.getNameTxtF()).should('have.value', `${venueDetails.venueName} - ${venueTypes.zoomWebinar}`).type(commonDetails.appendText)
        cy.get(ARVenueAddEditPage.getDescriptionTxtF()).should('contain.text', venueDetails.description).type(commonDetails.appendText)
        cy.get(ARVenueAddEditPage.getMaxClassSizeTxtF()).should('have.value', venueDetails.maxClassSize).clear().type(venueDetails.maxClassSize2)
        cy.get(ARVenueAddEditPage.getDepartmentTxt()).should('have.value', departments.dept_top_name)
        cy.get(ARVenueAddEditPage.getDepartmentBtn()).click()
        ARSelectModal.SearchAndSelectFunction([departments.Dept_B_name])

        //Save Venue
        ARVenueAddEditPage.WaitForElementStateToChange(ARVenueAddEditPage.getSaveBtn())
        cy.get(ARVenueAddEditPage.getSaveBtn()).click()
        cy.get(ARVenueAddEditPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Venue has been updated.')
        cy.get(ARVenueAddEditPage.getToastCloseBtn()).click()
    })

    it(`Verify ${venueTypes.zoomWebinar} Venue Edits Persist`, () => {
        //Filter for and edit venue
        ARVenueAddEditPage.AddFilter('Name', 'Contains', `${venueDetails.venueName} - ${venueTypes.zoomWebinar}${commonDetails.appendText}`)
        ARVenueAddEditPage.selectTableCellRecord(`${venueDetails.venueName} - ${venueTypes.zoomWebinar}${commonDetails.appendText}`)
        ARVenueAddEditPage.WaitForElementStateToChange(ARVenueAddEditPage.getAddEditMenuActionsByName('Edit Venue'))
        cy.get(ARVenueAddEditPage.getAddEditMenuActionsByName('Edit Venue')).click()
        ARVenueAddEditPage.getLShortWait()

        //Verify values persisted
        cy.get(ARVenueAddEditPage.getNameTxtF()).should('have.value', `${venueDetails.venueName} - ${venueTypes.zoomWebinar}${commonDetails.appendText}`)
        cy.get(ARVenueAddEditPage.getDescriptionTxtF()).should('contain.text', venueDetails.description+commonDetails.appendText)
        cy.get(ARVenueAddEditPage.getMaxClassSizeTxtF()).should('have.value', venueDetails.maxClassSize2)
        cy.get(ARVenueAddEditPage.getDepartmentTxt()).should('have.value', `.../${departments.Dept_B_name}`)
    })

    it(`Verify ${venueTypes.zoomWebinar} Venue Can Be Deleted`, () => {
        //Filter for and delete venue
        ARVenueAddEditPage.AddFilter('Name', 'Contains', `${venueDetails.venueName} - ${venueTypes.zoomWebinar}${commonDetails.appendText}`)
        ARVenueAddEditPage.selectTableCellRecord(`${venueDetails.venueName} - ${venueTypes.zoomWebinar}${commonDetails.appendText}`)
        ARDeleteModal.getDeleteItem('AR', 'Delete Venue')
        cy.get(arDashboardPage.getNoResultMsg()).should('be.visible')
    })
})