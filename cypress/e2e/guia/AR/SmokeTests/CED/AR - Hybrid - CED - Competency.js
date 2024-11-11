/// <reference types="cypress" />
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arCompetencyPage from '../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyPage'
import arCompetencyAddEditPage from '../../../../../../helpers/AR/pageObjects/Competency/ARCompetencyAddEditPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { competencyDetails } from '../../../../../../helpers/TestData/Competency/competencyDetails'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('AR - Hybrid - CED - Competency', function () {

    beforeEach(function() {
        // Sign in with System Admin account
        cy.loginAdmin(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        arDashboardPage.getCompetenciesReport()
    })

    it('should allow admin to create a Competency', () => {
        // Create Competency
        cy.get(arCompetencyPage.getA5PageHeaderTitle()).should('have.text', "Competencies")
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Competency')
        cy.get(arCompetencyAddEditPage.getNameTxtF()).type(competencyDetails.competencyName)
        cy.get(arCompetencyAddEditPage.getDescriptionTxtA()).type(competencyDetails.description)
        cy.get(arCompetencyAddEditPage.getLeaderboardTxtF()).type(competencyDetails.competencyLeaderboard)
        // Save Competency
        arCompetencyAddEditPage.getA5TableCellRecord(competencyDetails.competencyName);
        cy.get(arCompetencyAddEditPage.getA5SaveBtn()).click()
        cy.get(arCompetencyAddEditPage.getA5TableCellRecord()).should('be.visible')
        arCompetencyPage.A5AddFilter('Name', 'Starts With', competencyDetails.competencyName)
        arCompetencyPage.A5WaitForElementStateToChange(arCompetencyPage.getA5AddEditMenuActionsByIndex())
    })

    it('should allow admin to edit a Competency', () => {
        // Search and edit Competency
        arCompetencyPage.A5AddFilter('Name', 'Starts With', competencyDetails.competencyName)
        arCompetencyPage.selectA5TableCellRecord(competencyDetails.competencyName)
        arCompetencyPage.A5WaitForElementStateToChange(arCompetencyPage.getA5AddEditMenuActionsByIndex())
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Edit Competency')
        cy.get(arCompetencyAddEditPage.getNameTxtF()).clear().type(competencyDetails.companyNameEdited)
        // Save Competency
        cy.get(arCompetencyAddEditPage.getA5SaveBtn()).click()
        arCompetencyAddEditPage.getA5TableCellRecord(competencyDetails.companyNameEdited);
    })

    it('should allow admin to delete a Competency', () => {
        // Search and delete Competency
        arCompetencyPage.A5AddFilter('Name', 'Starts With', competencyDetails.companyNameEdited)
        arCompetencyPage.selectA5TableCellRecord(competencyDetails.companyNameEdited)
        arCompetencyPage.A5WaitForElementStateToChange(arCompetencyPage.getA5AddEditMenuActionsByIndex(4))
        arCompetencyPage.getA5AddEditMenuActionsByNameThenClick('Delete')
        cy.get(arDeleteModal.getA5OKBtn()).click()
        // Verify Competency is deleted
        cy.get(arCompetencyPage.getA5NoResultMsg()).should('have.text', "Sorry, no results found.");
    })
})