/// <reference types="cypress"/>

import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import ARDashboardAccountMenu from "../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu";
import ARUnsavedChangesModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal";
import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage";
import LESideMenu from "../../../../../../helpers/LE/pageObjects/Menu/LESideMenu";
import LEManageTemplatePrivateDashboardPage from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplatePrivateDashboardPage";
import LEManageTemplateTiles from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateTiles";
import { dashboardDetails } from "../../../../../../helpers/TestData/Dashboard/dashboardDetails";
import { users } from "../../../../../../helpers/TestData/users/users";

/**
 * Testrail URL:
 * https://absorblms.testrail.io/index.php?/cases/view/6236
 */

function clickEditTemplateCancelBtn() {
    cy.get(LEManageTemplateTiles.getCancelBtn()).click()
    LEManageTemplateTiles.getShortWait()
}
describe("Welcome Tile Background Image Settings Tab", () => {
    beforeEach(() => {
        cy.apiLoginWithSession(
            users.sysAdmin.admin_sys_01_username,
            users.sysAdmin.admin_sys_01_password,
            "/admin"
        );
    })
    it("NextGenLearnerExperience On", () => {
        cy.get(
            ARDashboardPage.getElementByDataNameAttribute(
                ARDashboardPage.getAccountBtn()
            )
        ).click();
        //Select Portal Setting option from account menu
        cy.get(ARDashboardAccountMenu.getPortalSettingsBtn())
            .should("exist")
            .click();
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should(
            "have.text",
            "Edit Client"
        );
        cy.get(ARDashboardPage.getUsersTab()).click();
        cy.get(ARDashboardPage.getNextgenLEflag()).click();
    });
    it("Welcome Tile click Cancel without changing anything", () => {
        cy.visit('/#/dashboard')
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')
        cy.get(LEManageTemplateTiles.getContainerByIndex(1)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName(dashboardDetails.body)
        })

        cy.get('div').should('contain', 'Edit Welcome Tile')
        cy.get(LEManageTemplateTiles.getWelcomeTilesidemenu()).contains('Text').click()
        LEManageTemplateTiles.getShortWait();
        cy.get(LEManageTemplateTiles.getWelcomeTilesidemenu()).contains('Background Image').click()
        clickEditTemplateCancelBtn()
        cy.get('div').should('not.contain', 'Edit Welcome Tile')

        // Welcome Tile click Cancel with changes, verify modal - Unsaved Changes - Click Leave
        cy.get(LEManageTemplateTiles.getContainerByIndex(1)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName(dashboardDetails.body)
        })
        cy.get(LEManageTemplateTiles.getWelcomeTileURLInput()).type('sth')
        clickEditTemplateCancelBtn()
        cy.get(LEManageTemplateTiles.getUnsavedChangedModal()).should('be.visible');
        cy.get(LEManageTemplateTiles.getUnsavedChangeModalLeaveBtn()).click();

        // Welcome Tile click Cancel with changes, verify modal - Unsaved Changes - Click Cancel
        cy.get(LEManageTemplateTiles.getContainerByIndex(1)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName(dashboardDetails.body)
        })
        cy.get(LEManageTemplateTiles.getWelcomeTileURLInput()).type('sth')
        clickEditTemplateCancelBtn()
        cy.get(LEManageTemplateTiles.getUnsavedChangedModal()).should('be.visible');
        cy.get(LEManageTemplateTiles.getUnsavedChangedModal()).within(() => {
            cy.get(LEManageTemplateTiles.getUnsavedChangeModalCancelBtn()).click();
        })

        //Same for tab - Text
        cy.get(LEManageTemplateTiles.getContainerByIndex(1)).within(() => {
            LEManageTemplateTiles.getTileEditBtnByTileName(dashboardDetails.body)
        })
        cy.get(LEManageTemplateTiles.getTextTabBtn()).click();



    })
})