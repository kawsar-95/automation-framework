/// <reference types="cypress" />
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arFAQAddEditPage from '../../../../../../helpers/AR/pageObjects/FAQ/ARFAQAddEditPage'
import arFAQPage from '../../../../../../helpers/AR/pageObjects/FAQ/ARFAQPage'
import arDeleteModal from '../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal'
import { faqDetails } from '../../../../../../helpers/TestData/FAQ/faqDetails'
import { users } from '../../../../../../helpers/TestData/users/users'


describe('AR - Hybrid - CED - FAQ', function () {

    beforeEach(function() {
        // Sign in with System Admin account
        cy.loginAdmin(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        //cy.get(arDashboardPage.getSysAdminDashboardPageTitle()).should('have.text', arDashboardPage.getSysAdminDashboardPageTitleTxt())
        // Click the Setup menu item
        cy.get(arDashboardPage.getElementByAriaLabelAttribute(arDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        arDashboardPage.getMenuItemOptionByName('FAQ')
        cy.intercept('**/DefaultGridActionsMenu').as('getFAQ').wait('@getFAQ');
    })

    it('should allow admin to create FAQ', () => {
        // Create FAQ
        cy.get(arFAQPage.getA5PageHeaderTitle()).should('have.text', "FAQs")
        arFAQPage.getA5AddEditMenuActionsByNameThenClick('FAQ')
        arFAQPage.A5WaitForElementStateToChange(arFAQAddEditPage.getQuestionTxtF())
        cy.get(arFAQAddEditPage.getQuestionTxtF()).type(faqDetails.faqQuestion)
        cy.get(arFAQAddEditPage.getAnswerTxtA()).type(faqDetails.answer)
        // Save FAQ
        cy.get(arFAQAddEditPage.getA5SaveBtn()).click().wait('@getFAQ')
        arFAQAddEditPage.getA5TableCellRecord(faqDetails.faqQuestion);
    })

    it('should allow admin to edit a FAQ', () => {
        // Search and edit FAQ
        arFAQPage.A5AddFilter('Question', 'Starts With', faqDetails.faqQuestion)
        cy.wait('@getFAQ')
        arFAQPage.selectA5TableCellRecord(faqDetails.faqQuestion)
        arFAQPage.A5WaitForElementStateToChange(arFAQPage.getA5AddEditMenuActionsByIndex())
        arFAQPage.getA5AddEditMenuActionsByNameThenClick('Edit')
        cy.get(arFAQAddEditPage.getQuestionTxtF()).clear().type(faqDetails.faqQuestionEdited)
        // Save FAQ
        cy.get(arFAQAddEditPage.getA5SaveBtn()).click()
        arFAQAddEditPage.getA5TableCellRecord(faqDetails.faqQuestionEdited);
    })

    it('should allow admin to delete a FAQ', () => {
        // Search amd Delete FAQ
        arFAQPage.A5AddFilter('Question', 'Starts With', faqDetails.faqQuestionEdited)
        cy.wait('@getFAQ')
        arFAQPage.selectA5TableCellRecord(faqDetails.faqQuestionEdited)
        arFAQPage.A5WaitForElementStateToChange(arFAQPage.getA5AddEditMenuActionsByIndex(2))
        arFAQPage.getA5AddEditMenuActionsByNameThenClick('Delete FAQ')
        cy.get(arDeleteModal.getA5OKBtn()).click().wait('@getFAQ')
        // Verify FAQ is deleted
        cy.get(arFAQPage.getA5NoResultMsg()).should('have.text', "Sorry, no results found.");
    })
})