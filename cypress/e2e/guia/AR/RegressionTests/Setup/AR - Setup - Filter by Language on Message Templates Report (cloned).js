import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"
import ARMessageTemplatesPage from "../../../../../../helpers/AR/pageObjects/Setup/ARMessageTemplatesPage"
import ARCoursesPage from "../../../../../../helpers/AR/pageObjects/Courses/ARCoursesPage"

describe('C1053 AUT-350, AR - Setup - Filter by Language on Message Templates Report (cloned)', function () {
    beforeEach(function() {
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Navigate to Message Templates
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        cy.get(ARDashboardPage.getWaitSpinner()).should('not.exist')
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Message Templates'))
    })

    it('Filter button on the Language column', () => {
        // Click the filter button on the Language column
        cy.get(ARMessageTemplatesPage.getLanguageFilterBtn()).click({force:true})

        // Language is one of the filter options
        cy.get(ARDashboardPage.getPropertyName() + ' ' + ARCoursesPage.getLabel()).eq(0).should('contain', 'Language')

        // All 30 languages supported by the LMS are listed
        cy.get(ARDashboardPage.getOperator() + ARDashboardPage.getDDownField()).eq(1).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARMessageTemplatesPage.getLangugeOptions(), {timeout:10000}).should('have.length', 37)

        // Select a language and click Add Filter
        cy.get(ARMessageTemplatesPage.getLangugeOptions()).contains('Khmer').invoke('show').scrollIntoView().should('be.visible').click()
        cy.get(ARDashboardPage.getSubmitAddFilterBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        // The report displays all the templates in the language selected
        cy.get(ARDashboardPage.getTableCellName(3), { timeout: 50000 }).should('be.visible').and('contain','Khmer')
    })

    it('Filter button on the Language column', () => {
        // Click Add Filter button.
        cy.get(ARDashboardPage.getAddFilterBtn(), {timeout:10000}).should('be.visible').click()
        cy.get(ARDashboardPage.getPropertyName() + ARDashboardPage.getDDownField()).eq(0).click()
        cy.get(ARDashboardPage.getPropertyNameDDownSearchTxtF()).type('Language')
        // Language is one of the filter options
        cy.get(ARDashboardPage.getPropertyNameDDownOpt(), {timeout:10000}).should('contain', 'Language')
        cy.get(ARDashboardPage.getPropertyNameDDownOpt()).contains('Language').click()
        cy.get(ARDashboardPage.getPropertyName() + ' ' + ARCoursesPage.getLabel()).eq(0).should('contain', 'Language')

        // All 30 languages supported by the LMS are listed
        cy.get(ARDashboardPage.getOperator() + ARDashboardPage.getDDownField()).eq(1).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        cy.get(ARMessageTemplatesPage.getLangugeOptions(), {timeout:10000}).should('have.length', 37)

        // Select a language and click Add Filter
        cy.get(ARMessageTemplatesPage.getLangugeOptions()).contains('English').click({force:true})
        cy.get(ARDashboardPage.getSubmitAddFilterBtn()).click()
        cy.get(ARDashboardPage.getWaitSpinner(), {timeout:10000}).should('not.exist')
        // The report displays all the templates in the language selected
        cy.get(ARDashboardPage.getTableCellName(3), { timeout: 50000 }).should('be.visible').and('contain','English')
    })
})