///<reference types="cypress"/>

import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import { users } from "../../../../../../helpers/TestData/users/users";

describe('Deselect Poll - C6307', () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        );
    })

    it('Deselect Poll', () => {
        cy.get(
            ARDashboardPage.getElementByAriaLabelAttribute(
                ARDashboardPage.getARLeftMenuByLabel('Engage')
            )
        ).click();
        cy.wrap(ARDashboardPage.getMenuItemOptionByName('Polls'));
        cy.get(ARDashboardPage.getGridTable()).eq(0).click();
        cy.get(ARDashboardPage.getA5AddEditMenuActionsByIndex(4))
            .should('be.visible').should('contain', 'Deselect').click();


    })
})