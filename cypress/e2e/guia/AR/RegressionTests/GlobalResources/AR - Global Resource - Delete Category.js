import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import A5GlobalResourceAddEditPage from '../../../../../../helpers/AR/pageObjects/GlobalResources/A5GlobalResourceAddEditPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { users } from '../../../../../../helpers/TestData/users/users'
import { categoryDetails } from '../../../../../../helpers/TestData/GlobalResources/globalResources'

describe('C5016 - AR - Global Resource - Delete Category', function () {

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

    it('Delete Modal, Click Cancel', () => {
        //Navigate to manage categories page
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Manage Resource Categories')).click()
        arDashboardPage.getMediumWait()

        //Filter for category does it exists or not
        arDashboardPage.AddFilter('Name', 'Contains', categoryDetails.categoryName)
        arDashboardPage.getMediumWait()
        cy.get(arDashboardPage.getGridTable()).eq(0).click()
        arDashboardPage.getMediumWait()

        //Click on Delete Resource Category button
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Delete Resource Category')).click()
        arDashboardPage.getShortWait()

        //Click on canel  button to not to delete it
        cy.get(arDeleteModal.getARCancelBtn()).click()

    })

    it('Delete Modal, Click Delete', () => {
        //Navigate to manage categories page
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Manage Resource Categories')).click()
        arDashboardPage.getMediumWait()

        //Filter for category does it exists or not
        arDashboardPage.AddFilter('Name', 'Contains', categoryDetails.categoryName)
        arDashboardPage.getMediumWait()
        cy.get(arDashboardPage.getGridTable()).eq(0).click()
        arDashboardPage.getMediumWait()

        //Click on Delete Resource Category button
        cy.get(arDashboardPage.getAddEditMenuActionsByName('Delete Resource Category')).click()
        arDashboardPage.getShortWait()

        //Click on delete  button to confirm delete
        cy.get(arDeleteModal.getARDeleteBtn()).click()

    })
})