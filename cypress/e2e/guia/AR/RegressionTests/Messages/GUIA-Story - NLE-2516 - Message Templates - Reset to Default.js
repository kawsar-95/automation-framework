import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARMessageTemplatesPage, { templateLanguages, templatePageMessages, templateTypes } from "../../../../../../helpers/AR/pageObjects/Setup/ARMessageTemplatesPage"
import { users } from "../../../../../../helpers/TestData/users/users"


describe('AUT-563 - C2019 - GUIA-Story - NLE-2516 - Message Templates - Reset to Default', () => {
    
    it('Verify that a message template can be reset to default and deselected', () => {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getMessageTemplateReport()

        cy.get(ARMessageTemplatesPage.getPageHeaderTitle(), {timeout: 3000}).should('contain', 'Message Templates')
        // Only verify when there are more than one templates
        cy.get(ARMessageTemplatesPage.getGridTable()).its('length').then(templateCount => {
            if (parseInt(templateCount) > 0) {    
                // filter templates based on type and language
                ARMessageTemplatesPage.filterTemplatesByTypeAndLang(templateTypes.INVITE_TO_REVIEW, templateLanguages.GERMAN)
                // select the filtered row
                cy.get(ARMessageTemplatesPage.getGridTable()).eq(0).click()
                cy.wrap(ARMessageTemplatesPage.WaitForElementStateToChange(ARMessageTemplatesPage.getResetToDefaultBtn(), 1000))
                cy.get(ARMessageTemplatesPage.getResetToDefaultBtn(), {timeout: 1000}).invoke('attr', 'aria-disabled').then(isDisabled => {
                    // if it's already the default template, modify it
                    if (isDisabled === 'true') {
                        cy.get(ARMessageTemplatesPage.getEditTemplateBtn()).should('be.visible').should('have.attr', 'aria-disabled', 'false').click()
                        cy.get(ARMessageTemplatesPage.getEditTemplateForm(), {timeout: 5000}).should('be.visible').and('not.have.attr', 'aria-disabled')
                        cy.get(ARMessageTemplatesPage.getTemplateBodyTextField()).clear().type('a'.repeat(10))
                        ARMessageTemplatesPage.getMediumWait()
                        cy.get(ARMessageTemplatesPage.getSaveBtn()).click()
                        // Template gets desected after saving, select it again
                        cy.get(ARMessageTemplatesPage.getGridTable()).eq(0).click()                   
                    }                     
                })                
                // Reset the template to default
                cy.get(ARMessageTemplatesPage.getPageHeaderTitle(), {timeout: 3000}).should('contain', 'Message Templates')
                cy.get(ARMessageTemplatesPage.getResetTemplateBtn()).should('have.attr', 'aria-disabled', 'false', {timeout: 1000}).click()
                cy.get(ARMessageTemplatesPage.getResetTemplateContinuteBtn(), {timeout: 3000}).click()
                cy.get(ARMessageTemplatesPage.getToastNotificationMsg(), {timeout: 1000}).should('contain', templatePageMessages.RESET_TEMPLATE_SUCCESS_MSG)
                // Deselect the selected template
                cy.get(ARMessageTemplatesPage.getGridTable()).eq(0).click()
            }
        })

    })
})