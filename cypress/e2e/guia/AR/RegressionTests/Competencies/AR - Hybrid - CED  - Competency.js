import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCompetencyPage from '../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyPage'
import arCompetencyAddEditPage from '../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyAddEditPage'
import arAssignCompetencyPage from '../../../../../../helpers/AR/pageObjects/Competency/ARAssignCompetencyPage'
import arAddEditCategoryPage from '../../../../../../helpers/AR/pageObjects/Category/ARAddEditCategoryPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { category } from '../../../../../../helpers/TestData/Category/categoryDetails'
import { competencyDetails } from '../../../../../../helpers/TestData/Competency/competencyDetails'
import { users } from '../../../../../../helpers/TestData/users/users'


describe('C7382, AR - Hybrid - CED - Competency', function () {

    beforeEach(function () {
        // Sign in with System Admin account
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        arDashboardPage.getCompetenciesReport()
    })

    it('should allow admin user to create a Competency', () => {
        // Verify that 
        cy.get(arCompetencyPage.getA5PageHeaderTitle()).should('have.text', "Competencies")
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Competency')
        cy.get(arCompetencyAddEditPage.getA5SaveBtn()).click()
        cy.get(arCompetencyAddEditPage.getNameErrorMsg()).should('have.text', 'Name is required')

        // Create Competency
        cy.get(arCompetencyAddEditPage.getNameTxtF()).type(competencyDetails.competencyName)
        cy.get(arCompetencyAddEditPage.getDescriptionTxtA()).type(competencyDetails.description)
        cy.get(arCompetencyAddEditPage.getLeaderboardTxtF()).type(competencyDetails.competencyLeaderboard)

        // Upload modal does not work on Admin Side, Code will be written for this when it is implemented in AE

        // Save Competency
        cy.get(arCompetencyAddEditPage.getA5SaveBtn()).click()
        arCompetencyAddEditPage.getA5TableCellRecord(competencyDetails.competencyName);
    })

    it('should allow admin user to assign Competency', () => {
        // Search Competency
        arCompetencyPage.A5AddFilter('Name', 'Starts With', competencyDetails.competencyName)
        //arCompetencyPage.getShortWait()
        arCompetencyPage.selectA5TableCellRecord(competencyDetails.competencyName)
        arCompetencyPage.A5WaitForElementStateToChange(arCompetencyPage.getA5AddEditMenuActionsByIndex(2))

        // Assign Competency to a User
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Assign to User')
        cy.get(arAssignCompetencyPage.getUsersDDown()).click()
        cy.get(arAssignCompetencyPage.getUsersDDown()).type(users.adminLogInOut.admin_loginout_fname + ' ' + users.adminLogInOut.admin_loginout_lname)
        arAssignCompetencyPage.getUsersDDownOpt(users.adminLogInOut.admin_loginout_fname + ' ' + users.adminLogInOut.admin_loginout_lname)
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Assign')
        cy.intercept('**/Admin/Competencies/SingleSelectionGridActionsMenu').as('getViewUsersInCompetency').wait('@getViewUsersInCompetency');
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('View Users')
        arCompetencyPage.selectA5TableCellRecord(competencyDetails.competencyName)
        cy.get(arCompetencyPage.getA5TableCellRecordByColumn(2)).should('have.text', 'Admin LogInOut')
    })

    it('should allow admin to delete Competency', () => {
        // Search and delete Competency
        arCompetencyPage.A5AddFilter('Name', 'Starts With', competencyDetails.competencyName)
        arCompetencyPage.selectA5TableCellRecord(competencyDetails.competencyName)
        arCompetencyPage.A5WaitForElementStateToChange(arCompetencyPage.getA5AddEditMenuActionsByIndex(4))
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Delete')
        // Verify Competency is deleted
        cy.get(arCompetencyPage.getA5NoResultMsg()).should('have.text', "Sorry, no results found.");
    })

    it('should allow admin to create a New Category', () => {
        // Search Competency
        cy.get(arCompetencyPage.getA5PageHeaderTitle()).should('have.text', "Competencies")
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Category')
        arAddEditCategoryPage.getA5AddEditMenuActionsByNameThenClick('Save')

        // Verify that a Category without name cannot be saved
        cy.get(arAddEditCategoryPage.getNameErrorMsg()).should('have.text', competencyDetails.nameFieldErrorMsg)

        // Add Category
        cy.get(arAddEditCategoryPage.getA5CategoryNameTxtF()).type(category.categoryName)
        cy.get(arAddEditCategoryPage.getA5CategoryDescriptionTxtA()).type(category.categoryDesc)
        arAddEditCategoryPage.getA5AddEditMenuActionsByNameThenClick('Save')
        
    })

    it('should allow admin to manage categories', () => {
        // Search and delete Category
        cy.get(arCompetencyPage.getA5PageHeaderTitle()).should('have.text', "Competencies")
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Manage Categories')
        arCompetencyPage.A5AddFilter('Name', 'Starts With', category.categoryName)
        arCompetencyPage.A5WaitForElementStateToChange(arCompetencyPage.getA5AddEditMenuActionsByIndex())
        cy.get(arCompetencyPage.getA5TableCellRecordByColumn(1)).click()
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Delete Category')
        cy.get(arDeleteModal.getA5OKBtn()).click()
    })
})
