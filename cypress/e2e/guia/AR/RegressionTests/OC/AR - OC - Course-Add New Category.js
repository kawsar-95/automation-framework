import ARAddEditCategoryPage from "../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage"
import ARManageCategoryPage from "../../../../../../helpers/AR/pageObjects/Category/ARManageCategoryPage"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import { category } from "../../../../../../helpers/TestData/Category/categoryDetails"
import { users } from "../../../../../../helpers/TestData/users/users"


describe("C6364,C7652 - AR - OC - Course - Add New Category", function () {
    beforeEach(function () {
        //Sign into admin side as sys admin, navigate to Courses
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin")
        ARDashboardPage.getCoursesReport()
        
    })

    it("Add new Category - Press Cancel button In Prompt", function () {
        //Click on Add new Category
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel("Add New Category")).should('have.attr','aria-disabled','false').click()

        //Asserting Page Header
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', 'Add New Category')
        cy.get(ARAddEditCategoryPage.getParentCategoryTxtF()).should('have.text', 'No Category')
        cy.get(ARAddEditCategoryPage.getParentCategoryTxtF()).click()
        ARAddEditCategoryPage.SearchAndSelectFunction([category.parentCategory])
        cy.get(ARAddEditCategoryPage.getElementByAriaLabelAttribute(ARAddEditCategoryPage.getCategoryNameTxtF())).type(`${category.categoryName}`)
        cy.get(ARAddEditCategoryPage.getElementByAriaLabelAttribute(ARAddEditCategoryPage.getCategoryDescriptionTxtA())).type(category.categoryDesc)
        
        //Cancel Course Category
        ARAddEditCategoryPage.WaitForElementStateToChange(ARAddEditCategoryPage.getCancelBtn())
        cy.get(ARAddEditCategoryPage.getCancelBtn()).click()
        
        //Asserting Prompt
        cy.get(ARCoursesPage.getElementByDataNameAttribute('prompt-header')).should('have.text', 'Unsaved Changes')
        cy.get(ARCoursesPage.getElementByDataNameAttribute('prompt-content')).should('have.text', "You haven't saved your changes. Are you sure you want to leave this page?")

        //Click on Cancel Prompt
        cy.get(ARAddEditCategoryPage.getAlertCancelBtn()).contains('Cancel').click()
        //Asserting Page
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', 'Add New Category')


    })

    it("Add new Category - Press OK button In Prompt", function () {
        
        //Click on Add new Category
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel("Add New Category")).should('have.attr','aria-disabled','false').click()
        
        //Asserting Page Header
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', 'Add New Category')
        cy.get(ARAddEditCategoryPage.getParentCategoryTxtF()).should('have.text', 'No Category')
        cy.get(ARAddEditCategoryPage.getParentCategoryTxtF()).click()
        ARAddEditCategoryPage.SearchAndSelectFunction([category.parentCategory])
        cy.get(ARAddEditCategoryPage.getElementByAriaLabelAttribute(ARAddEditCategoryPage.getCategoryNameTxtF())).type(`${category.categoryName}`)
        cy.get(ARAddEditCategoryPage.getElementByAriaLabelAttribute(ARAddEditCategoryPage.getCategoryDescriptionTxtA())).type(category.categoryDesc)
        
        //Cancel Course Category
        ARAddEditCategoryPage.WaitForElementStateToChange(ARAddEditCategoryPage.getCancelBtn())
        cy.get(ARAddEditCategoryPage.getCancelBtn()).click()
        
        //Asserting Prompt
        cy.get(ARCoursesPage.getElementByDataNameAttribute('prompt-header')).should('have.text', 'Unsaved Changes')
        cy.get(ARCoursesPage.getElementByDataNameAttribute('prompt-content')).should('have.text', "You haven't saved your changes. Are you sure you want to leave this page?")
        
        //Click on Ok Button
        cy.get(ARAddEditCategoryPage.getAlertOKBtn()).contains('OK').click()
        
        //Asserting Page
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', 'Courses')

    })

    it("Add new Category - Save Category ", function () {
        
        //Click on Add new Category
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel("Add New Category")).should('have.attr','aria-disabled','false').click()
        
        //Asserting Page Header
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', 'Add New Category')
        cy.get(ARAddEditCategoryPage.getParentCategoryTxtF()).should('have.text', 'No Category')
        cy.get(ARAddEditCategoryPage.getParentCategoryTxtF()).click()
        ARAddEditCategoryPage.SearchAndSelectFunction([category.parentCategory])
        cy.get(ARAddEditCategoryPage.getElementByAriaLabelAttribute(ARAddEditCategoryPage.getCategoryNameTxtF())).type(`${category.categoryName}`)
        cy.get(ARAddEditCategoryPage.getElementByAriaLabelAttribute(ARAddEditCategoryPage.getCategoryDescriptionTxtA())).type(category.categoryDesc)
        
        //Clicking on Save Button
        cy.get(ARAddEditCategoryPage.getSaveBtn()).click()
        cy.get(ARAddEditCategoryPage.getToastSuccessMsg()).should('be.visible').and('contain','Category has been created.')
    })



    it("Delete Category", () => {
        
        // Search and delete Course Category
        cy.get(ARCoursesPage.getPageHeaderTitle()).should('have.text', "Courses")
        cy.get(ARCoursesPage.getCoursesActionsButtonsByLabel('Manage Categories')).should('have.attr','aria-disabled','false').click()
        ARDashboardPage.getShortWait()
        cy.get(ARAddEditCategoryPage.getPageHeaderTitle()).should('have.text', "Categories")
        ARAddEditCategoryPage.AddFilter('Name', 'Contains', `${category.categoryName}`)
        ARManageCategoryPage.SelectManageCategoryRecord()
        ARAddEditCategoryPage.WaitForElementStateToChange(ARAddEditCategoryPage.getAddEditMenuActionsByName('Delete Category'))
        cy.get(ARAddEditCategoryPage.getAddEditMenuActionsByName('Delete Category')).click()
        cy.get(ARAddEditCategoryPage.getElementByDataNameAttribute(ARDeleteModal.getDeleteBtn())).click()
        // Verify Course Category is deleted
        cy.get(ARAddEditCategoryPage.getNoResultMsg()).should('have.text', 'No results found.')

    })



})