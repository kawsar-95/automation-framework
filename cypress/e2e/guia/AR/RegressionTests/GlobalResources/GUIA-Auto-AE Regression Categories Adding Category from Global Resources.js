import ARBillboardsPage from "../../../../../../helpers/AR/pageObjects/Billboards/ARBillboardsPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARGlobalResourcePage from "../../../../../../helpers/AR/pageObjects/GlobalResources/ARGlobalResourcePage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import { category } from "../../../../../../helpers/TestData/Category/categoryDetails"
import { categoryDetails } from "../../../../../../helpers/TestData/GlobalResources/globalResources"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C5014 - AUT-50 - GUIA-Auto-AE Regression Categories Adding Category from Global Resource', () => {
    after('Delete resource category created for the test', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getGlobalResourcesReport()

        cy.get(ARGlobalResourcePage.getManageCategoryMenu()).click()
        cy.get(ARGlobalResourcePage.getPageHeaderTitle(), {timeout: 15000}).should('contain', 'Resource Categories')
        cy.get(ARGlobalResourcePage.getGridTable(), {timeout: 7500}).should('be.visible')

        ARGlobalResourcePage.AddFilter('Name', 'Contains', categoryDetails.categoryName)
        cy.get(ARGlobalResourcePage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARGlobalResourcePage.getGridTable()).eq(0).click()
        cy.get(ARGlobalResourcePage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARGlobalResourcePage.getAddEditMenuActionsByName('Delete Resource Category'), {timeout: 3000}).should('have.attr', 'aria-disabled', 'false').click()
        cy.get(ARDeleteModal.getARDeleteBtn(), {timeout: 3000}).click()
    })

    it('Create Global Resource Category, cancel w/o save and finally save the Category', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getGlobalResourcesReport()
        cy.get(ARGlobalResourcePage.getPageHeaderTitle(), {timeout: 5000}).contains('Global Resources')
        cy.get(ARGlobalResourcePage.getAddResourceCategoryMenu(), {timeout: 3000}).click()
        // Clear Category Name and enter a valid category name
        cy.get(ARGlobalResourcePage.getNameField()).clear().type(categoryDetails.categoryName)

        cy.get(ARGlobalResourcePage.getChooseCategoryBtn()).click()
        ARGlobalResourcePage.searchCategoriesAndSelect([category.parentCategory])

        // Enter category description
        cy.get(ARGlobalResourcePage.getDescriptionField()).clear().type(categoryDetails.categoryDescription)

        cy.get(ARBillboardsPage.getCancelBtn()).click()
        cy.get(ARGlobalResourcePage.getPromptDes()).should('contain', 'You haven\'t saved your changes. Are you sure you want to leave this page?')

        cy.get(ARGlobalResourcePage.getModalOkBtn()).contains('OK')
        cy.get(ARGlobalResourcePage.getModalCancelBtn()).contains('Cancel')
        cy.get(ARGlobalResourcePage.getModalOkBtn()).click()

        cy.get(ARGlobalResourcePage.getAddResourceCategoryMenu()).click()

        // Clear Category Name and enter a valid category name
        cy.get(ARGlobalResourcePage.getNameField()).clear().type(categoryDetails.categoryName)

        cy.get(ARGlobalResourcePage.getChooseCategoryBtn()).click()
        ARGlobalResourcePage.searchCategoriesAndSelect([category.parentCategory])

        // Enter category description
        cy.get(ARGlobalResourcePage.getDescriptionField()).clear().type(categoryDetails.categoryDescription)
        cy.get(ARDashboardPage.getSaveBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARDashboardPage.getToastSuccessMsg(), {timeout: 10000}).should('contain', 'Category has been created.')
    })
})