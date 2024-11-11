import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { categoryDetails } from '../../../../../../helpers/TestData/GlobalResources/globalResources'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'

describe('C5015 - AR - Global Resource - Edit Category', function () {

    beforeEach(function () {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getMediumWait()
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Global Resources')
        arDashboardPage.getMediumWait()
    })

    it('Verify Admin Can Create a New Category', () => {
        // Create Category
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Add New Resource Category')).click()

        //Clear Category Name
        cy.get(arDashboardPage.getElementByAriaLabelAttribute("Name")).clear()

        //Enter a valid category name
        cy.get(arDashboardPage.getElementByAriaLabelAttribute("Name")).type(categoryDetails.categoryName)

        //Enter category description
        cy.get(arDashboardPage.getElementByAriaLabelAttribute("Description")).type(categoryDetails.categoryDescription)
        arDashboardPage.getShortWait()

        cy.get(arDashboardPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Category has been created.')
        arDashboardPage.getShortWait()
    })

    it('Verify Newly Created Category Exists', () => {
        //Navigate to manage categories page
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Manage Resource Categories')).click()
        arDashboardPage.getMediumWait()

        //Filter for category does it exists or not
        arDashboardPage.AddFilter('Name', 'Contains', categoryDetails.categoryName)
        arDashboardPage.getMediumWait()
        cy.get(arDashboardPage.getGridTable()).eq(0).click()
        arDashboardPage.getMediumWait()

        // click on edit resource category button
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit Resource Category')).click()
        arDashboardPage.getShortWait()

        //Verify category name exists
        cy.get(arDashboardPage.getElementByAriaLabelAttribute("Name")).should('have.value', categoryDetails.categoryName)

        //Verify category description exits
        cy.get(arDashboardPage.getElementByAriaLabelAttribute("Description")).should('have.value', categoryDetails.categoryDescription)
    })

    it('Edit Newly Created Category, Click Cancel Edit Not Saved', () => {
        //Navigate to manage categories page
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Manage Resource Categories')).click()
        arDashboardPage.getMediumWait()

        //Filter for category does it exists or not
        arDashboardPage.AddFilter('Name', 'Contains', categoryDetails.categoryName)
        arDashboardPage.getMediumWait()
        cy.get(arDashboardPage.getGridTable()).eq(0).click()
        arDashboardPage.getMediumWait()

        //Clicke on edit category
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit Resource Category')).click()
        arDashboardPage.getShortWait()

        //Verify category name exists and Edit
        cy.get(arDashboardPage.getElementByAriaLabelAttribute("Name")).should('have.value', categoryDetails.categoryName).type(commonDetails.appendText)

        //Verify category description exits and Edit
        cy.get(arDashboardPage.getElementByAriaLabelAttribute("Description")).should('have.value', categoryDetails.categoryDescription).type(commonDetails.appendText)
        arDashboardPage.getShortWait()

        // click on cancel button
        cy.get(arDashboardPage.getCancelBtn()).click()
        arDashboardPage.getShortWait()
    })

    it('Edit Newly Created Category And Save', () => {
        //Navigate to manage categories page
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Manage Resource Categories')).click()
        arDashboardPage.getMediumWait()

        //Filter for category does it exists or not
        arDashboardPage.AddFilter('Name', 'Contains', categoryDetails.categoryName)
        arDashboardPage.getMediumWait()
        cy.get(arDashboardPage.getGridTable()).eq(0).click()
        arDashboardPage.getMediumWait()

        //Clicke on edit resource category button
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit Resource Category')).click()
        arDashboardPage.getMediumWait()

        //Verify category name exists and Edit
        cy.get(arDashboardPage.getElementByAriaLabelAttribute("Name")).should('have.value', categoryDetails.categoryName).type(commonDetails.appendText)

        //Verify category description exits and Edit
        cy.get(arDashboardPage.getElementByAriaLabelAttribute("Description")).should('have.value', categoryDetails.categoryDescription).type(commonDetails.appendText)
        arDashboardPage.getShortWait()

        //Click on Save Button to save the edit
        cy.get(arDashboardPage.getSaveBtn()).click()
        cy.get(arDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Resource Category has been updated.')
        arDashboardPage.getShortWait()
    })

    it('Verify Category Edit Exists', () => {
        //Navigate to manage categories page
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Manage Resource Categories')).click()
        arDashboardPage.getMediumWait()

        //Filter for category does it exists or not
        arDashboardPage.AddFilter('Name', 'Contains', categoryDetails.categoryName + commonDetails.appendText)
        arDashboardPage.getMediumWait()
        cy.get(arDashboardPage.getGridTable()).eq(0).click()
        arDashboardPage.getMediumWait()

        //Clicke on edit resource category button
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Edit Resource Category')).click()
        arDashboardPage.getShortWait()

        //Verify all edits persisted
        cy.get(arDashboardPage.getElementByAriaLabelAttribute("Name")).should('have.value', categoryDetails.categoryName + commonDetails.appendText)
        cy.get(arDashboardPage.getElementByAriaLabelAttribute("Description")).should('have.value', categoryDetails.categoryDescription + commonDetails.appendText)
    })

    after('cleaning up the created category', () => {
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Global Resources')
        arDashboardPage.getMediumWait()

        //Navigate to manage categories page
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Manage Resource Categories')).click()
        arDashboardPage.getMediumWait()

        //Filter for category does it exists or not
        arDashboardPage.AddFilter('Name', 'Contains', categoryDetails.categoryName + commonDetails.appendText)
        arDashboardPage.getMediumWait()
        cy.get(arDashboardPage.getGridTable()).eq(0).click()
        arDashboardPage.getMediumWait()
        
        //Click on Delete Resource Category button
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Delete Resource Category')).click()
        arDashboardPage.getShortWait()

        //Click on delete  button to confirm delete
        cy.get(arDeleteModal.getARDeleteBtn()).click()
        arDashboardPage.getShortWait()
    })
})