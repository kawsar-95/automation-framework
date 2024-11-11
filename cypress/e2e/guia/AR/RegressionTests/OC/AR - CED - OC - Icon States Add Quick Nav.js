import AROCAddEditPage from "../../../../../../helpers/AR/pageObjects/Courses/OC/AROCAddEditPage"
import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C7303 - AUT-684 - Icon States Quick Nav', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        )
    })
    it('OC Icon States', () => {
        ARDashboardPage.getMediumWait()
        //Click on Courses
        cy.get(ARDashboardPage.getElementByAriaLabelAttribute(ARDashboardPage.getARLeftMenuByLabel('Courses'))).click()
        // Click on Courses
        ARDashboardPage.getMenuItemOptionByName('Courses')
        ARDashboardPage.getMediumWait()

        cy.get(ARDashboardPage.getAddEditMenuActionsByName('Add Online Course')).click()
        ARDashboardPage.getVLongWait()

        cy.get(AROCAddEditPage.getAddMoreSettingsBtn()).eq(0).should('have.attr', 'class', AROCAddEditPage.getAddMoreSettingsBtnEnableDotStyle())
        cy.get(AROCAddEditPage.getAddMoreSettingsBtn()).eq(1).should('have.attr', 'class', AROCAddEditPage.getAddMoreSettingsBtnEnableDotStyle())
        cy.get(AROCAddEditPage.getAddMoreSettingsBtn()).eq(7).should('have.attr', 'class', AROCAddEditPage.getAddMoreSettingsBtnDisableDotStyle())
        cy.get(AROCAddEditPage.getAddMoreSettingsBtn()).eq(1).click()
        cy.get(AROCAddEditPage.getChapterContainer()).should('exist')
        cy.get(AROCAddEditPage.getChapterContainerHeader()).should('exist')

        cy.get(AROCAddEditPage.getChapterContainerDeleteBtn()).eq(0).click()
        cy.get(AROCAddEditPage.getDeleteChapterModalContainer()).should('exist')
        cy.get(AROCAddEditPage.getDeleteChapterModalDeleteBtn()).click()

        cy.get(AROCAddEditPage.getAddMoreSettingsBtn()).eq(1).should('have.attr', 'class', AROCAddEditPage.getAddMoreSettingsBtnEnableStyle())
        cy.get(ARDashboardPage.getElementByDataNameAttribute('add-chapter')).click()
        cy.get(AROCAddEditPage.getAddMoreSettingsBtn()).eq(1).should('have.attr', 'class', AROCAddEditPage.getAddMoreSettingsBtnEnableDotStyle())


    })
})