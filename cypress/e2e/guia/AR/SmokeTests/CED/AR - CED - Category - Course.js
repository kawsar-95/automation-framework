/// <reference types="cypress" />
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arAddEditCategoryPage from '../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage'
import arCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import arManageCategoriesPage from '../../../../../../helpers/AR/pageObjects/Category/ARManageCategoryPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { category } from '../../../../../../helpers/TestData/Category/categoryDetails'
import { users } from '../../../../../../helpers/TestData/users/users'


describe('AR - CED - Category - Course', function () {

    beforeEach(function() {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //cy.get(arDashboardPage.getSysAdminDashboardPageTitle()).should('have.text', arDashboardPage.getSysAdminDashboardPageTitleTxt())
        // Click the Courses menu item
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        arDashboardPage.getMenuItemOptionByName('Courses')
        cy.intercept('**/operations').as('getCourses').wait('@getCourses');
    })

    it('should allow admin to create Course Category', () => {
        // Create Course Category
        cy.get(arCoursesPage.getPageHeaderTitle()).should('have.text', "Courses")
        cy.get(arCoursesPage.getCoursesActionsButtonsByLabel('Add New Category')).click()
        cy.get(arAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Add New Category")
        cy.get(arAddEditCategoryPage.getElementByAriaLabelAttribute(arAddEditCategoryPage.getCategoryNameTxtF())).type(`${category.categoryName}`)
        cy.get(arAddEditCategoryPage.getElementByAriaLabelAttribute(arAddEditCategoryPage.getCategoryDescriptionTxtA())).type(category.categoryDesc)
        // Save Course Category
        arAddEditCategoryPage.WaitForElementStateToChange(arAddEditCategoryPage.getSaveBtn())
        cy.get(arAddEditCategoryPage.getSaveBtn()).click().wait('@getCourses');
    })

    it('should allow admin to edit a Course Category', () => {
        // Search and edit course Category
        cy.get(arCoursesPage.getCoursesActionsButtonsByLabel('Manage Categories')).click().wait('@getCourses')
        arManageCategoriesPage.AddFilter('Name', 'Starts With', `${category.categoryName}`)
        arManageCategoriesPage.SelectManageCategoryRecord()
        arManageCategoriesPage.WaitForElementStateToChange(arManageCategoriesPage.getAddEditMenuActionsByName('Edit Category'))
        cy.get(arManageCategoriesPage.getAddEditMenuActionsByName('Edit Category')).click()
        cy.get(arAddEditCategoryPage.getElementByAriaLabelAttribute(arAddEditCategoryPage.getCategoryNameTxtF())).clear().type(`${category.categoryName}${arAddEditCategoryPage.getAppendText()}`)
        // Save Course Category
        cy.get(arAddEditCategoryPage.getSaveBtn()).click()
        cy.intercept('**/course-categories').as('getCourses1').wait('@getCourses1');
    })
  
    it('should allow admin to delete a Course Category', () => {
        // Search and delete Course Category
        cy.get(arCoursesPage.getCoursesActionsButtonsByLabel('Manage Categories')).click().wait('@getCourses')
        arManageCategoriesPage.AddFilter('Name', 'Starts With', `${category.categoryName}${arManageCategoriesPage.getAppendText()}`)
        arManageCategoriesPage.SelectManageCategoryRecord()
        arManageCategoriesPage.WaitForElementStateToChange(arManageCategoriesPage.getAddEditMenuActionsByName('Delete Category'))
        cy.get(arManageCategoriesPage.getAddEditMenuActionsByName('Delete Category')).click()
        cy.get(arManageCategoriesPage.getElementByDataNameAttribute(arDeleteModal.getDeleteBtn())).click().wait('@getCourses')
        // Verify Course Category is deleted
        cy.get(arManageCategoriesPage.getNoResultMsg()).should('have.text', 'No results found.')
    })

})