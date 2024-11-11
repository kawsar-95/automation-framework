import { users } from '../../../../../../helpers/TestData/users/users'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { categories } from '../../../../../../helpers/TestData/GlobalResources/globalResources'
import { commonDetails } from '../../../../../../helpers/TestData/Courses/commonDetails'
import ARGlobalResourcePage from '../../../../../../helpers/AR/pageObjects/GlobalResources/ARGlobalResourcePage'
import ARResourceCategoryPage from '../../../../../../helpers/AR/pageObjects/GlobalResources/ARResourceCategoryPage'
import { categoryDetails } from '../../../../../../helpers/TestData/GlobalResources/globalResources'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'



describe('C6587,C6591,C6651 AR - CED Add Edit And Delete Global Resource Category', () => {

  beforeEach(function () {

    // Sign in with System Admin account
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    ARDashboardPage.getGlobalResourcesReport()

  })

  it('Verify Admin Can Create a New Category', () => {
    //Create  a New Category
    cy.get(ARGlobalResourcePage.getAddNewResourceCategoryBtn()).should('have.attr','aria-disabled','false').click()

    //Verify Category name cannot be empty
    cy.get(ARGlobalResourcePage.getNameField()).type(categoryDetails.categoryName)
    cy.get(ARGlobalResourcePage.getNameField()).clear()
    ARGlobalResourcePage.getNameFieldErrorMsg()

    //Enter valid resource name
    cy.get(ARGlobalResourcePage.getNameField()).type(categoryDetails.categoryName)

    //Select a Parent Category
    cy.get(ARGlobalResourcePage.getChooseCategoryBtn()).click()
    ARGlobalResourcePage.searchCategoriesAndSelect(["GUIA"]);
    
    //Enter Category Description
    cy.get(ARGlobalResourcePage.getDescriptionField()).type(categoryDetails.categoryDescription)
    cy.get(ARGlobalResourcePage.getCancelBtn()).click()
    cy.get(ARGlobalResourcePage.getUnsavedChangesModalFooter()).within(() => {
      //Click on canel  button
      cy.get(ARDeleteModal.getARCancelBtn()).click()
    })

    
    cy.get(ARGlobalResourcePage.getSaveBtn()).click()
    cy.get(ARDashboardPage.getToastSuccessMsg()).should('be.visible').and('contain','Category has been created.')

  })


  it('Verify Admin Can Eidt Global Resource Category', () => {

    //Navigate to manage categories page
    cy.get(ARGlobalResourcePage.getManageResourceCategoryBtn()).click()
    cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

    //Filter Created Category
    ARDashboardPage.AddFilter('Name', 'Contains', categoryDetails.categoryName)
    cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
    cy.get(ARDashboardPage.getGridTable()).eq(0).click()

    //Click On Edit Button
    cy.get(ARResourceCategoryPage.getAREditCategoryActionsBtn()).should('have.attr','aria-disabled','false').click()
    
    //Verify Category Name persists and make an Edit
    cy.get(ARGlobalResourcePage.getNameField()).should('have.value', categoryDetails.categoryName).type(commonDetails.appendText)

    //Verify Parent Category persists 
    cy.get(ARResourceCategoryPage.getGCategoryF()).should('contain', categories.guiaCategoryName)

    //Now Change Parent Category
    cy.get(ARGlobalResourcePage.getChooseCategoryBtn()).click()
    ARGlobalResourcePage.searchCategoriesAndSelect(["GUIA-CED"])
    
    //Verify description persisted and edit it
    cy.get(ARGlobalResourcePage.getDescriptionField()).should('have.value', categoryDetails.categoryDescription).type(commonDetails.appendText)

    //Apply Changes and Save
    cy.get(ARGlobalResourcePage.getSaveBtn()).click()
    cy.get(ARDashboardPage.getToastSuccessMsg()).should('be.visible')

  })


  it("Verify Admin Can Delete Category", function () {

    //Navigate to manage categories page
    cy.get(ARGlobalResourcePage.getManageResourceCategoryBtn()).should('have.attr','aria-disabled','false').click()
    cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

    //Filter and Find Edited Category to Delete
    ARDashboardPage.getMediumWait()
    ARDashboardPage.AddFilter('Name', 'Contains', categoryDetails.categoryName + commonDetails.appendText)
    cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
    cy.get(ARDashboardPage.getGridTable()).eq(0).click()
    cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')

    //Click on Delete Resource Category button
    cy.get(ARGlobalResourcePage.getDeleteResourceCategoryBtn()).should('have.attr','aria-disabled','false').click()
    
    //Click on delete  button to confirm delete
    cy.get(ARDeleteModal.getARDeleteBtn()).should('be.visible')
    cy.get(ARDeleteModal.getARDeleteBtn()).click()
    cy.get(ARDashboardPage.getToastSuccessMsg()).should('be.visible').and('contain','Resource Category has been deleted.')
  })

})