/// <reference types="cypress" />
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arTagsAddEditPage from '../../../../../../helpers/AR/pageObjects/Tags/ARTagsAddEditPage'
import arTagsPage from '../../../../../../helpers/AR/pageObjects/Tags/ARTagsPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { tags } from '../../../../../../helpers/TestData/Tags/tagsDetails'
import { users } from '../../../../../../helpers/TestData/users/users'


describe('AR - Smoke - CED - Tags', function () {

    beforeEach(function() {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //cy.get(arDashboardPage.getSysAdminDashboardPageTitle()).should('have.text', arDashboardPage.getSysAdminDashboardPageTitleTxt())
        // Click the Courses menu item
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Tags')
        cy.intercept('**/operations').as('getTags').wait('@getTags');
    })

    it('should allow admin to create Tag', () => {
        // Create Tag
        cy.get(arTagsAddEditPage.getPageHeaderTitle()).should('have.text', "Tags")
        cy.get(arTagsPage.getAddEditMenuActionsByName('Add Tag')).click()
        cy.get(arTagsAddEditPage.getElementByAriaLabelAttribute(arTagsAddEditPage.getNameTxtF())).clear().type(tags.tagName)
        arTagsAddEditPage.WaitForElementStateToChange(arTagsAddEditPage.getSaveBtn())
        cy.get(arTagsAddEditPage.getSaveBtn()).click().wait('@getTags');
    })

    it('should allow admin to edit a Tag', () => {
        // Search and edit Tag
        arTagsPage.AddFilter('Name', 'Starts With', tags.tagName)
        arTagsPage.selectTableCellRecord(tags.tagName)
        arTagsPage.WaitForElementStateToChange(arTagsPage.getAddEditMenuActionsByName('Edit'))
        cy.get(arTagsPage.getAddEditMenuActionsByName('Edit')).click()
        cy.get(arTagsAddEditPage.getElementByAriaLabelAttribute(arTagsAddEditPage.getNameTxtF())).clear().type(tags.tagNameEdited).wait('@getTags')
        // Save Tag
        arTagsAddEditPage.WaitForElementStateToChange(arTagsAddEditPage.getSaveBtn())
        cy.get(arTagsAddEditPage.getSaveBtn()).click().wait('@getTags');
    })

    it('should allow admin to delete a Tag', () => {
        // Search and Delete Tag
        arTagsPage.AddFilter('Name', 'Starts With', tags.tagNameEdited)
        arTagsPage.selectTableCellRecord(tags.tagNameEdited)
        arTagsPage.WaitForElementStateToChange(arTagsPage.getAddEditMenuActionsByName('Delete'))
        cy.get(arTagsPage.getAddEditMenuActionsByName('Delete')).click()
        cy.get(arTagsPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click().wait('@getTags')
        // Verify Tag is deleted
        cy.get(arTagsPage.getNoResultMsg()).should('have.text', 'No results found.')
    })

})