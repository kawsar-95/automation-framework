import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCompetencyPage from '../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyPage'
import { users } from '../../../../../../helpers/TestData/users/users'
import { category } from '../../../../../../helpers/TestData/Category/categoryDetails'
import ARAddEditCategoryPage from '../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage'
import ARDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import ARNewsArticlesAddEditPage from '../../../../../../helpers/AR/pageObjects/NewsArticles/ARNewsArticlesAddEditPage'
import ARExternalTrainingPage from '../../../../../../helpers/AR/pageObjects/Reports/ARExternalTrainingPage'

describe('C7383, AR - Competencies - Manage Category - Edit Category', function () {
    beforeEach(function () {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCompetenciesReport()
    })

    after('Delete Category', ()=> {
        
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCompetenciesReport()
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Manage Categories')
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        cy.get(arCompetencyPage.getA5PageHeaderTitle(),{timeout:1500}).should('exist').and('have.text', "Competency Categories")
              
        // Select any category from the list
        arCompetencyPage.A5AddFilter('Name', 'Starts With', category.categoryName)
        cy.get(arDashboardPage.getA5WaitSpinner()).should("not.exist")
        cy.get(arDashboardPage.getA5RemoveAllFilterBtn(),{timeout:15000}).should('exist').and('be.visible')
        cy.get(arDashboardPage.getA5WaitSpinner()).should("not.exist")
        cy.get(arCompetencyPage.getA5TableCellRecordByColumn(1)).click()
        cy.get(arDashboardPage.getA5WaitSpinner()).should("not.exist")
        cy.get(arDashboardPage.getA5RemoveAllFilterBtn(),{timeout:15000}).should('exist').and('be.visible')
        cy.get(arCompetencyPage.getA5AddEditMenuActionsDeleteCategoryBtn()).click()
        cy.get(ARDeleteModal.getA5OKBtn()).click()
        cy.get(arDashboardPage.getA5WaitSpinner()).should("not.exist")
        cy.get(arDashboardPage.getA5NoResultMsg()).should('have.text', "Sorry, no results found.")
    })

    it('Create a New Category', () => {
        // Search Competency
        cy.get(arCompetencyPage.getA5PageHeaderTitle()).should('have.text', "Competencies")
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Category')
    
        // Add Category
        cy.get(ARAddEditCategoryPage.getA5CategoryNameTxtF()).type(category.categoryName)
        cy.get(ARAddEditCategoryPage.getA5CategoryDescriptionTxtA()).type(category.categoryDesc)
        ARAddEditCategoryPage.getA5AddEditMenuActionsByNameThenClick('Save')
       
    })

    it('Manage Category - Edit Category and Cancel Changes', () => {
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Manage Categories')
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:1500}).should("not.exist")
        cy.get(arCompetencyPage.getA5PageHeaderTitle(),{timeout:1500}).should('exist').and('have.text', "Competency Categories")      
        // Select any category from the list
        arCompetencyPage.A5AddFilter('Name', 'Starts With', category.categoryName)
        cy.get(arDashboardPage.getA5WaitSpinner()).should("not.exist")
        cy.get(arDashboardPage.getA5RemoveAllFilterBtn(),{timeout:15000}).should('exist').and('be.visible')
        cy.get(arDashboardPage.getA5WaitSpinner()).should("not.exist")
        cy.get(arCompetencyPage.getA5TableCellRecordByColumn(1)).click()
       
         
        cy.get(arCompetencyPage.getA5AddEditMenuActionsByIndex(1)).should('have.text', 'Edit Category')
        cy.get(arCompetencyPage.getA5AddEditMenuActionsByIndex(2)).should('have.text', 'Delete Category')
        cy.get(arCompetencyPage.getA5AddEditMenuActionsByIndex(3)).should('have.text', 'Deselect')

        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Edit Category')
       
        cy.get(ARAddEditCategoryPage.getA5CategoryDescriptionTxtA(),{timeout:15000}).should('exist').and('be.visible')
        // Update any field and click on cancel button from right panel
        cy.get(ARAddEditCategoryPage.getA5CategoryDescriptionTxtA()).type(arDashboardPage.getAppendText())

        // click on cancel button from right panel
        ARAddEditCategoryPage.getA5AddEditMenuActionsByNameThenClick('Cancel')
        cy.get(arDashboardPage.getA5WaitSpinner()).should("not.exist")

        cy.get(ARNewsArticlesAddEditPage.getConfirmModal(),{timeout:15000}).should('exist')
        cy.get(ARNewsArticlesAddEditPage.getConfirmModal()).within(() => {
            cy.get(ARExternalTrainingPage.getSectionHeader()).should('have.text', 'Unsaved Changes')
            cy.get(ARNewsArticlesAddEditPage.getConfirmModalWarningMsg()).should('have.text', "You haven't saved your changes. Are you sure you want to leave this page?")
        })

        // Click on cancel button in confirmation pop-up
        cy.get(ARExternalTrainingPage.getConfirmModalCancelButton()).click()
       

        // click on cancel button from right panel
        ARAddEditCategoryPage.getA5AddEditMenuActionsByNameThenClick('Cancel')
       

        // click on don't save in confirmation pop-up
        cy.get(ARExternalTrainingPage.getConfirmModalDontSaveButton()).click()
       
    })

    it('Manage Category - Edit Category and Save Changes from  confirmation pop-up', () => {
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Manage Categories')
        cy.get(arDashboardPage.getWaitSpinner(),{timeout:15000}).should("not.exist")
        cy.get(arCompetencyPage.getA5PageHeaderTitle(),{timeout:1500}).should('exist').and('have.text', "Competency Categories")
              
        // Select any category from the list
        arCompetencyPage.A5AddFilter('Name', 'Starts With', category.categoryName)
        cy.get(arDashboardPage.getA5WaitSpinner()).should("not.exist")
        cy.get(arDashboardPage.getA5RemoveAllFilterBtn(),{timeout:15000}).should('exist').and('be.visible')
        cy.get(arDashboardPage.getA5WaitSpinner()).should("not.exist")
        cy.get(arCompetencyPage.getA5TableCellRecordByColumn(1)).click()
        cy.get(arDashboardPage.getA5WaitSpinner()).should("not.exist")

         
        cy.get(arCompetencyPage.getA5AddEditMenuActionsByIndex(1)).should('have.text', 'Edit Category')
        cy.get(arCompetencyPage.getA5AddEditMenuActionsByIndex(2)).should('have.text', 'Delete Category')
        cy.get(arCompetencyPage.getA5AddEditMenuActionsByIndex(3)).should('have.text', 'Deselect')

        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Edit Category')
        

        // Update any field and click on cancel button from right panel
        cy.get(ARAddEditCategoryPage.getA5CategoryDescriptionTxtA()).type(arDashboardPage.getAppendText())

        // click on cancel button from right panel
        ARAddEditCategoryPage.getA5AddEditMenuActionsByNameThenClick('Cancel')
       
        cy.get(ARNewsArticlesAddEditPage.getConfirmModal()).within(() => {
            cy.get(ARExternalTrainingPage.getSectionHeader()).should('have.text', 'Unsaved Changes')
            cy.get(ARNewsArticlesAddEditPage.getConfirmModalWarningMsg()).should('have.text', "You haven't saved your changes. Are you sure you want to leave this page?")
        })

        // Click on Save button in confirmation pop-up
        cy.get(ARExternalTrainingPage.getConfirmModalSaveButton()).click()
        cy.get(arDashboardPage.getA5WaitSpinner()).should("not.exist")
    })

    it('Manage Category - Edit Category and Save Changes from right panel', () => {
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Manage Categories')
        cy.get(arDashboardPage.getA5WaitSpinner()).should("not.exist")
        cy.get(arCompetencyPage.getA5PageHeaderTitle(),{timeout:1500}).should('exist').and('have.text', "Competency Categories")
              
        // Select any category from the list
        arCompetencyPage.A5AddFilter('Name', 'Starts With', category.categoryName)
        cy.get(arDashboardPage.getA5WaitSpinner()).should("not.exist")
        cy.get(arDashboardPage.getA5RemoveAllFilterBtn(),{timeout:15000}).should('exist').and('be.visible')
        cy.get(arCompetencyPage.getA5TableCellRecordByColumn(1)).click()
        cy.get(arDashboardPage.getA5WaitSpinner()).should("not.exist")

        cy.get(arCompetencyPage.getA5AddEditMenuActionsByIndex(1)).should('have.text', 'Edit Category')
        cy.get(arCompetencyPage.getA5AddEditMenuActionsByIndex(2)).should('have.text', 'Delete Category')
        cy.get(arCompetencyPage.getA5AddEditMenuActionsByIndex(3)).should('have.text', 'Deselect')
         
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Edit Category')
        
        cy.get(ARAddEditCategoryPage.getA5CategoryDescriptionTxtA()).should('exist')
        // Update any field and click on cancel button from right panel
        cy.get(ARAddEditCategoryPage.getA5CategoryDescriptionTxtA()).type(arDashboardPage.getAppendText())

        // click on Save button from right panel
        ARAddEditCategoryPage.getA5AddEditMenuActionsByNameThenClick('Save')
        cy.get(arDashboardPage.getA5WaitSpinner()).should("not.exist")  
    })
})