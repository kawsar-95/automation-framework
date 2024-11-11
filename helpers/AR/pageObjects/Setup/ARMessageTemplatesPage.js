import ARBasePage from "../../ARBasePage"

export default new (class ARMessageTemplatesPage extends ARBasePage {
    verifyDraggableSnippet(){
        cy.contains('First Name').should('exist')
        cy.contains('Last Name').should('exist')
        cy.contains('Middle Name').should('exist')
        cy.contains('Email Address').should('exist')
        cy.contains('Phone').should('exist')
        cy.contains('Username').should('exist')
        cy.contains('Department').should('exist')
        cy.contains('LMS Link').should('exist')
        cy.contains('Admin LMS Link').should('exist')
        cy.contains('LMS Name').should('exist')
        cy.contains('Company Name').should('exist')
        cy.contains('Company Phone').should('exist')
        cy.contains('Company Email').should('exist')
        cy.contains('Date').should('exist')
        cy.contains('Job Title').should('exist')
        cy.contains('Courses').should('exist')
        cy.contains('Set Password Link').should('exist')
        cy.contains('Set Password Token').should('exist')
        cy.contains('*GUIA Boolean Custom Field').should('exist')
        cy.contains('*GUIA Date Time Custom Field').should('exist')
        cy.contains('*GUIA Number Custom Field').should('exist')
        cy.contains('*GUIA Decimal Custom Field').should('exist')
        cy.contains('*GUIA List Custom Field').should('exist')
        cy.contains('*GUIA Text Custom Field').should('exist')
        cy.contains('*GUIA Date Custom Field').should('exist')
    }

    getLanguageFilterBtn() {
        return '[title="Language Filter"]'
    }

    getLangugeOptions() {
        return '[aria-label="Language"] [role="option"]'
    }

    // Added for the JIRA# AUT-563, TC# C2019
    getResetToDefaultBtn() {
        return 'button[data-name="reset-message-template-context-button"]'
    }

    filterTemplatesByTypeAndLang(type, lang) {
        this.AddFilter('Type', type)
        this.AddFilter('Language', lang)
        cy.get(this.getGridFilterResultLoader(), {timeout: 3000}).should('not.exist')
    }


    getEditTemplateBtn() {
        return 'button[data-name="edit-message-template-context-button"]'
    }

    getEditTemplateForm() {
        return '[data-name="edit-message-template-content"]'
    }

    getTemplateBodyTextField() {
        return `${this.getElementByDataName('body')} ${this.getWSIWYGTxtF()}`
    }

    getResetTemplateBtn() {
        return 'button[data-name="reset-message-template-context-button"]'
    }

    getResetTemplateContinuteBtn() {
        return 'button[data-name="confirm"]'
    }

    getCancelEditBtn() {
        return this.getResetTemplateContinuteBtn()
    }
})

export const templateTypes = {
    "INVITE_TO_REVIEW": "Absorb Create Invite to Review"
}

export const templateLanguages = {
    "ENGLISH": "English", 
    "GERMAN": "German"
}

export const templatePageMessages = {
    "RESET_TEMPLATE_SUCCESS_MSG": "Message template has been reset to default"
}

export const userTemplateMessages = {
    message : 'Hi {{FirstName}} {{LastName}},\n',
    message1 : 'Welcome to {{LmsName}}.\n',
    message2 : 'As soon as you are ready to get your training started, please begin with first setting your password by selecting the following link:\n{{{SetPasswordLink}}}\n',
    message3 : 'Please note that this link will expire after 7 days.\n',
    message4 : ' You can access your training at any time by using your username {{Username}} and visiting:\n{{{LmsLink}}}\n',
    message5 : 'Welcome aboard and good luck with your training!\n',
    message6 : '{{CompanyName}}{{CompanyEmail}}\n',
    message7 : 'Note: This is a system generated message. Please do not reply to this email.\n',
} 