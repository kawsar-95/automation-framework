import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARFAQAddEditPage from "../../../../../../helpers/AR/pageObjects/FAQ/ARFAQAddEditPage"
import ARDeleteModal from "../../../../../../helpers/AR/pageObjects/Modals/ARDeleteModal"
import ARPollsAddEditPage from "../../../../../../helpers/AR/pageObjects/Polls/ARPollsAddEditPage"
import { faqDetails } from "../../../../../../helpers/TestData/FAQ/faqDetails"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C6338 - Setup - FAQs', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            '/admin'
        )
    })

    it('Add FAQ', () => {
        //Navigate to Translation page
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        ARDashboardPage.getMenuItemOptionByName('FAQs')
        ARDashboardPage.getMediumWait()
        //Click on Add FAQ button
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click({ force: true })
        ARDashboardPage.getMediumWait()
        //Enter question and answer on general for Add FAQs page
        cy.get(ARFAQAddEditPage.getQuestionTxtF()).type(faqDetails.faqQuestion)
        cy.get(ARFAQAddEditPage.getAnswerTxtA()).type(faqDetails.answer)
        //Select an Author from the dropdown
        cy.get(ARPollsAddEditPage.getAuthorDropDown()).click()
        ARDashboardPage.getShortWait()
        cy.get(ARPollsAddEditPage.getAuthorDropDownItem()).eq(0).click()
        //Enter order and check toggle for Publication
        cy.get(ARDashboardPage.getElementByNameAttribute('Order')).type('10')
        //Navigate to Availability section
        cy.get(ARPollsAddEditPage.getTabItem()).eq(1).click()
        ARDashboardPage.getShortWait()
        //Click on Add Rule Button and set a Rule as per the requirement
        cy.get(ARPollsAddEditPage.getAddRuleBtn()).click()
        cy.get(ARPollsAddEditPage.getAddRuleTxtF()).type('John')
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getA5SaveBtn()).click()
        ARDashboardPage.getMediumWait()
    })
    it('Edit FAQ', () => {
        //Navigate to Translation page
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Setup'))).click()
        ARDashboardPage.getMenuItemOptionByName('FAQs')
        ARDashboardPage.getMediumWait()
        //Select creted FAQ
        ARDashboardPage.A5AddFilter('Question', 'Starts With', faqDetails.faqQuestion)
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        //Deselect the faq
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(3)).click({ force: true })
        //Click on Edit FAQ button
        cy.get(ARDashboardPage.getGridTable()).eq(0).click()
        ARDashboardPage.getMediumWait()
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(1)).click({ force: true })
        ARDashboardPage.getMediumWait()
        //Make changes to FAQ and save
        cy.get(ARFAQAddEditPage.getQuestionTxtF()).clear().type(faqDetails.faqQuestion + '--Edited--')
        cy.get(ARFAQAddEditPage.getAnswerTxtA()).type(faqDetails.answer + '--Edited--')
        cy.get(ARDashboardPage.getA5SaveBtn()).click()
        ARDashboardPage.getMediumWait()
        //Delete FAQ 
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(2)).click({ force: true })
        ARDashboardPage.getShortWait()
        cy.get(ARDeleteModal.getA5OKBtn()).click()
        ARDashboardPage.getMediumWait()

    })
})