import { users } from '../../../../../../helpers/TestData/users/users'
import ARAddEditCategoryPage from '../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage'
import { category } from '../../../../../../helpers/TestData/Category/categoryDetails'
import ARCoursesPage from '../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import ARGlobalResourcePage from '../../../../../../helpers/AR/pageObjects/GlobalResources/ARGlobalResourcePage'
import ARResourceCategoryPage from '../../../../../../helpers/AR/pageObjects/GlobalResources/ARResourceCategoryPage'


describe('AR - CED - Categories - Category', () => {
  beforeEach(() => {

    // Sign in with System Admin account
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
    ARDashboardPage.getGlobalResourcesReport()

  })

  it('Verify Admin Can  Create A New  Course Category', () => {

    //Verify Currently Admin In the Global Resource Page
    cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Global Resources")

    //Create  a New Category
    cy.get(ARGlobalResourcePage.getAddNewResourceCategoryBtn()).click()
    ARDashboardPage.getMediumWait()

    //Verify Currently Admin In the Add New Resource Category
    cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Add New Resource Category")

    //Verify by default parent category set to No Category
    cy.get(ARAddEditCategoryPage.getParentCategoryTxtF()).should('have.text', 'No Category')

    //Enter valid resource name
    cy.get(ARGlobalResourcePage.getNameField()).type(category.categoryName)

    //Select a Parent Category
    cy.get(ARGlobalResourcePage.getChooseCategoryBtn()).click()
    ARGlobalResourcePage.searchCategoriesAndSelect([category.parentCategory])
    ARDashboardPage.getShortWait()

    //Enter Category Description
    cy.get(ARGlobalResourcePage.getDescriptionField()).type(category.categoryDesc)

    ARDashboardPage.getShortWait()
    cy.get(ARGlobalResourcePage.getSaveBtn()).click()
    ARDashboardPage.getMediumWait()

    //Verify After Successfully creating global resource category admin returns to Global Resources Page
    cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Global Resources")

    ARDashboardPage.getMediumWait()

  })

  it('Verify Admin Can Manage Course Category', () => {

    //Verify Currently Admin In the Global Resource Page
    cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', "Global Resources")

    //Navigate to manage categories page
    cy.get(ARGlobalResourcePage.getManageResourceCategoryBtn()).click()
    ARDashboardPage.getMediumWait()


    //Create  a New Category
    cy.get(ARGlobalResourcePage.getAddNewResourceCategoryBtn()).click()
    ARDashboardPage.getMediumWait()

    //Verify Currently Admin In the Add New Resource Category
    cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Add New Resource Category")

    //Verify by default parent category set to No Category
    cy.get(ARAddEditCategoryPage.getParentCategoryTxtF()).should('have.text', 'No Category')


    //Enter valid resource name
    cy.get(ARGlobalResourcePage.getNameField()).type(category.categoryName)

    //Select a Parent Category
    cy.get(ARGlobalResourcePage.getChooseCategoryBtn()).click()
    ARGlobalResourcePage.searchCategoriesAndSelect([category.parentCategory])
    ARDashboardPage.getShortWait()

    //Enter Category Description
    cy.get(ARGlobalResourcePage.getDescriptionField()).type(category.categoryDesc)

    cy.get(ARGlobalResourcePage.getCancelBtn()).click()
    ARDashboardPage.getShortWait()

    cy.get(ARGlobalResourcePage.getUnsavedChangesModalFooter()).within(() => {
      //Click on canel  button
      cy.get(ARDeleteModal.getARCancelBtn()).click()
    })

    ARDashboardPage.getShortWait()
    cy.get(ARGlobalResourcePage.getSaveBtn()).click()
    ARDashboardPage.getMediumWait()

  })
  it('Verify Admin Can Edit a Course Category', () => {

    //Navigate to manage categories page
    cy.get(ARGlobalResourcePage.getManageResourceCategoryBtn()).click()
    ARDashboardPage.getMediumWait()

    //Filter Created Category
    ARDashboardPage.AddFilter('Name', 'Contains', category.categoryName)
    ARDashboardPage.getMediumWait()
    cy.get(ARDashboardPage.getGridTable()).eq(0).click()
    ARDashboardPage.getMediumWait()

    //Click On Edit Button
    cy.get(ARResourceCategoryPage.getAREditCategoryActionsBtn()).click()
    ARGlobalResourcePage.getMediumWait()

    //Verify Category Name persists and make an Edit
    cy.get(ARGlobalResourcePage.getNameField()).should('have.value', category.categoryName).type(ARAddEditCategoryPage.getAppendText())

    //Verify Parent Category persists and edit it
    cy.get(ARResourceCategoryPage.getGCategoryF()).should('contain', category.parentCategory)

    //Now Change Parent Category
    cy.get(ARGlobalResourcePage.getChooseCategoryBtn()).click()
    ARGlobalResourcePage.searchCategoriesAndSelect([category.parentCategory])
    ARDashboardPage.getShortWait()

    //Verify description persisted and edit it
    cy.get(ARGlobalResourcePage.getDescriptionField()).should('have.value', category.categoryDesc).type(ARAddEditCategoryPage.getAppendText())

    cy.get(ARGlobalResourcePage.getCancelBtn()).click()
    ARDashboardPage.getShortWait()

    cy.get(ARGlobalResourcePage.getUnsavedChangesModalFooter()).within(() => {
      //Click on canel  button
      cy.get(ARDeleteModal.getARCancelBtn()).click()
    })

    ARDashboardPage.getShortWait()
    cy.get(ARGlobalResourcePage.getSaveBtn()).click()
    ARDashboardPage.getMediumWait()

  })

  it('Verify admin can deselect a Course Category', () => {

    //Navigate to manage categories page
    cy.get(ARGlobalResourcePage.getManageResourceCategoryBtn()).click()
    ARDashboardPage.getMediumWait()

    //Filter Created Category
    ARDashboardPage.AddFilter('Name', 'Contains', category.categoryName)
    ARDashboardPage.getMediumWait()
    cy.get(ARDashboardPage.getGridTable()).eq(0).click()
    ARDashboardPage.getMediumWait()

    cy.get(ARGlobalResourcePage.getDeselectBtn()).click()


  })

  it('Delete First Category', () => {
    //Navigate to manage categories page
    cy.get(ARGlobalResourcePage.getManageResourceCategoryBtn()).click()
    ARDashboardPage.getMediumWait()

    //Filter and Find Edited Category to Delete
    ARDashboardPage.AddFilter('Name', 'Contains', category.categoryName)
    ARDashboardPage.getMediumWait()
    // ARGlobalResourcePage.getTableRow().first().click()?
    cy.get(ARDashboardPage.getGridTable()).eq(0).click()

    ARDashboardPage.getMediumWait()

    //Click on Delete Resource Category button
    cy.get(ARGlobalResourcePage.getDeleteResourceCategoryBtn()).click()
    ARDashboardPage.getShortWait()

    //Click on delete  button to confirm delete
    cy.get(ARDeleteModal.getARDeleteBtn()).click()


  })


  it('Delete Second Category', () => {

    //Navigate to manage categories page
    cy.get(ARGlobalResourcePage.getManageResourceCategoryBtn()).click()
    ARDashboardPage.getMediumWait()

    //Filter and Find Edited Category to Delete
    ARDashboardPage.AddFilter('Name', 'Contains', category.categoryName + ARAddEditCategoryPage.getAppendText())
    ARDashboardPage.getMediumWait()
    cy.get(ARDashboardPage.getGridTable()).eq(0).click()

    ARDashboardPage.getMediumWait()

    //Click on Delete Resource Category button
    cy.get(ARGlobalResourcePage.getDeleteResourceCategoryBtn()).click()
    ARDashboardPage.getShortWait()

    //Click on delete  button to confirm delete
    cy.get(ARDeleteModal.getARDeleteBtn()).click()

  })


})
