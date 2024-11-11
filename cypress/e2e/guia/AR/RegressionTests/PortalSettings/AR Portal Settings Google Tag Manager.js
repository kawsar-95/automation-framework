import ARDashboardAccountMenu from "../../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu";
import { users } from "../../../../../../helpers/TestData/users/users";
import arDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage";
import AREditClientInfoPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientInfoPage";

describe("C6245 - AR - Regression - Portal Settings Google Tag Manager ", function () {
  beforeEach(() => {
    //Signin with system admin
    cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "/admin");
    cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
    //Select Portal Setting option from account menu
    cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should("exist").click()
    cy.get(AREditClientInfoPage.getGoogleTagManagerBtn()).find("a").invoke('attr', 'class')
        .then(classList => classList.split(' ')).each($el => {
         if ($el === 'on') {
            cy.get(AREditClientInfoPage.getGoogleTagManagerBtn()).find("a").should("have.class", "on").click()
        }  
    })
    cy.get(AREditClientInfoPage.getSaveBtn()).contains("Save").click()
    arDashboardPage.getShortWait()
  })

  it("Set Google Tag Manager On", () => {
    cy.get(arDashboardPage.getCurrentUserLabel()).should("contain.text", `${users.sysAdmin.admin_sys_01_fname} ${users.sysAdmin.admin_sys_01_lname}`)
    cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should("be.visible")

    //Select Account Menu
    cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
    //Select Portal Setting option from account menu
    cy.get(ARDashboardAccountMenu.getPortalSettingsBtn()).should("exist").click()

    // Scroll To Google Tag Manager Button
    cy.get(AREditClientInfoPage.getGoogleTagManagerBtn()).find("a").should("not.have.class", "on").click().should("have.class", "on")
    cy.get(AREditClientInfoPage.getGoogleTagManagerLabel()).contains('GTM-XXXXXXX')
    arDashboardPage.getShortWait()
    cy.get(AREditClientInfoPage.getSaveBtn()).contains("Save").click()
    arDashboardPage.getShortWait()
  });
});
