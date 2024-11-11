import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARAddEditTranslationsPage from "../../../../../../helpers/AR/pageObjects/Setup/ARAddEditTranslationsPage"
import { translationDetails } from "../../../../../../helpers/TestData/Setup/translationDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C6333 - Translations', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            '/admin'
        )
    })
    after(() => {
        //Delete created translation
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).click({ force: true })
        ARDashboardPage.getShortWait()
        cy.get(ARDeleteModal.getA5OKBtn()).click()
        ARDashboardPage.getMediumWait()
    })
    it('Add New Translation', () => {
        //Navigate to Translation page
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        ARDashboardPage.getMenuItemOptionByName('Translations')
        ARDashboardPage.getMediumWait()
        //Click on Translation with + icon
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click({ force: true })
        ARDashboardPage.getMediumWait()
        //Enter key 
        cy.get(ARDashboardPage.getElementByNameAttribute('Key')).type(translationDetails.key)
        //Select language from dropdown
        cy.get(ARAddEditTranslationsPage.getLanguageDDown()).click()
        cy.get(ARAddEditTranslationsPage.getLanguageTextF()).type(translationDetails.language)
        ARDashboardPage.getMediumWait()
        cy.get(ARAddEditTranslationsPage.getLanguageDDownListItem()).eq(0).click()
        //Enter value
        cy.get(ARDashboardPage.getElementByNameAttribute('Value')).type(translationDetails.value)
        cy.get(ARDashboardPage.getA5SaveBtn()).click()
        ARDashboardPage.getMediumWait()


    })
    it('Edit Translation', () => {
        //Navigate to Translation page
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        ARDashboardPage.getMenuItemOptionByName('Translations')
        ARDashboardPage.getMediumWait()
        //Select translation
        ARDashboardPage.A5AddFilter('Key', 'Starts With', translationDetails.key)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        //Click on Deselect Button
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(3)).click({ force: true })
        //Again select Translation
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        //Click on Edit
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click({ force: true })
        ARDashboardPage.getMediumWait()
        //Change the editable filed and click on save
        cy.get(ARDashboardPage.getElementByNameAttribute('Value')).clear().type(translationDetails.value + ' --Edited--')
        cy.get(ARDashboardPage.getA5SaveBtn()).click()
        ARDashboardPage.getMediumWait()

    })
})