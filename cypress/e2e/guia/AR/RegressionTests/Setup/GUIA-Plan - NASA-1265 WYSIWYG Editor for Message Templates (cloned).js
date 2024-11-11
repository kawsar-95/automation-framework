import WYSIWYGEditorModule from "../../../../../../helpers/AR/modules/WYSIWYGEditor.module"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARComposeMessage from "../../../../../../helpers/AR/pageObjects/Departments/ARComposeMessage"
import ARMessageTemplatesPage from "../../../../../../helpers/AR/pageObjects/Setup/ARMessageTemplatesPage"
import { file } from "../../../../../../helpers/TestData/GlobalResources/globalResources"
import { users } from "../../../../../../helpers/TestData/users/users"


describe('AUT-372 - C1075 - GUIA-Plan - NASA-1265 WYSIWYG Editor for Message Templates (cloned)', () => {
    it('Edit a message template by inserting List, Link, Image, and HTML code', () => {   
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')

        // Navigate to Message Templates
        ARDashboardPage.getMessageTemplateReport()
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Message Templates')
        // Select a template 
        cy.get(ARDashboardPage.getA5TableCellRecord()).eq(0).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
        cy.get(ARMessageTemplatesPage.getEditTemplateBtn(), { timeout: 3000 }).should('be.visible').click()

        // Modify the template
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Edit Message Template')

        // Asserting WYSIWYG editor buttons and their actions
        // Verify ordered list (not bullet list as of now)
        cy.get(WYSIWYGEditorModule.getEditorToolbar()).should('be.visible').and('not.have.attr','aria-disabled')
        cy.get(ARComposeMessage.getMessageBodyText()).clear().type('body')
        cy.get(ARComposeMessage.getMessageBodyText()).type('{selectall}')
        cy.get(WYSIWYGEditorModule.getOrderedListTooleBtn()).click({force: true})
        // Assert that the numbered list(<ol> element has been added in the WYSIWYG editor
        cy.get(WYSIWYGEditorModule.getOrderedList()).should('exist')

        // Verify clicking insert hyper link
        cy.get(ARComposeMessage.getMessageBodyText()).clear().type('body')
        cy.get(ARComposeMessage.getMessageBodyText()).type('{selectall}')  
        cy.get(WYSIWYGEditorModule.getInsertHyperLinkToolBtn()).click()      
        cy.get(WYSIWYGEditorModule.getInsertHyperLinkInput()).clear().type(file.fileName2)        
        cy.get(WYSIWYGEditorModule.getInsertHyperLinkBtn()).click()
        // Assert that the <a> element has been added in the WYSIWYG editor
        cy.get(WYSIWYGEditorModule.getHyperTextLink()).should('exist')

        // Verify clicking insert image link     
        cy.get(ARComposeMessage.getMessageBodyText()).clear()   
        cy.get(WYSIWYGEditorModule.getInsertImageLinkToolBtn()).click()
        cy.get(WYSIWYGEditorModule.getInsertImageLinkInput()).clear().type(file.fileName2)
        cy.get(WYSIWYGEditorModule.getInsertImageLinkBtn()).click()
        // Assert that the <img> element has been added in the WYSIWYG editor
        cy.get(WYSIWYGEditorModule.getImageLink(), {timeout: 1000}).should('exist')

        // Verify inserting HTML code
        cy.get(ARComposeMessage.getMessageBodyText()).type('{selectall}')
        cy.get(ARComposeMessage.getMessageBodyText()).clear()
        cy.get(WYSIWYGEditorModule.getMoreMiscToolBtn()).click()
        cy.get(WYSIWYGEditorModule.getHtmlCodeViewToolBtn()).click()
        cy.get(WYSIWYGEditorModule.getHtmlCodeEditor()).clear().type('<h1>Hello Absorbers<h1>')
        cy.get(WYSIWYGEditorModule.getHtmlCodeViewToolBtn()).click()
        // Assert that the <h1> element has been added to the WYSIWYG editor
        cy.get(WYSIWYGEditorModule.getHeader1Text()).should('exist')

        // Cancel editing
        cy.get(ARDashboardPage.getCancelBtn()).click()
        cy.get(ARMessageTemplatesPage.getCancelEditBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), { timeout: 10000 }).should('not.exist')
        // Verify that that the Message Templates page appears after cancelling
        cy.get(ARDashboardPage.getPageHeaderTitle()).should('contain', 'Message Templates')
    })
})