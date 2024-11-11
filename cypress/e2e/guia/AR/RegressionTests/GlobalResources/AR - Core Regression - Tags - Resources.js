import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import ARTagsAddEditPage from '../../../../../../helpers/AR/pageObjects/Tags/ARTagsAddEditPage'
import ARTagsPage from '../../../../../../helpers/AR/pageObjects/Tags/ARTagsPage'
import { tags } from '../../../../../../helpers/TestData/Tags/tagsDetails'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARCreditsReportPage from '../../../../../../helpers/AR/pageObjects/Reports/ARCreditsReportPage'

describe('C7399 - Select Tag and Navigate to the Global Resources page', function () {
    beforeEach('Log in as a system admin', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        
    })

    after('Delete the newly created tag', () => {
        ARDashboardPage.getTagsReport()
        ARTagsPage.AddFilter("Name", "Starts With", tags.tagName)
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        //ARTagsPage.WaitForElementStateToChange(ARTagsPage.getAddEditMenuActionsByName("Delete"))
        cy.get(ARTagsPage.getAddEditMenuActionsByName("Delete")).click()
        cy.get(ARTagsPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        // Verify Tag is deleted
        cy.get(ARTagsPage.getNoResultMsg()).should("have.text", "No results found.")
    })

    it('Verify Tag selection will result actions buttons to be displayed and clicking on Resource button opens up the Global Resources page', () => {
        ARDashboardPage.getTagsReport()
        cy.get(ARTagsPage.getAddEditMenuActionsByName("Add Tag")).click()
        cy.get(ARTagsAddEditPage.getElementByAriaLabelAttribute(ARTagsAddEditPage.getNameTxtF())).clear().type(tags.tagName)
        ARTagsAddEditPage.WaitForElementStateToChange(ARTagsAddEditPage.getSaveBtn())
        cy.get(ARTagsAddEditPage.getSaveBtn()).click()
        cy.get(ARTagsAddEditPage.getToastSuccessMsg()).should('be.visible').and('contain','Tag has been created')
        // Search and select the newly create tag from the report
        ARTagsPage.AddFilter("Name", "Starts With", tags.tagName)
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        // Verify that selecting a tag  displays actions buttons on right panel
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Edit')).should('exist').and('have.text', 'Edit')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Courses')).should('exist').and('have.text', 'Courses')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Resources')).should('exist').and('have.text', 'Resources')
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Delete')).should('exist').and('have.text', 'Delete')
        cy.get(ARDashboardPage.getDeselectBtn()).should('exist')
        // Click on Resources button from right panel
        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Resources')).click()
        // Assert that clicking on Resources button opens up the Global Resources page
        cy.get(ARTagsAddEditPage.getPageHeaderTitle()).should("have.text", "Global Resources","exist")
        // Assert that pre-applied filter contains selected tag in the Global Resources page
        cy.get(ARCreditsReportPage.getElementByDataNameAttribute('data-filter-item')).eq(0).within(() => {
            cy.get(ARCreditsReportPage.getSelectedTagInFilter()).eq(0).should('contain', tags.tagName)
        })
    })
})