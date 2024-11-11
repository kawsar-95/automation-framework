import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import ARCouponsAddEditPage from "../../../../../../helpers/AR/pageObjects/E-commerce/Coupons/ARCouponsAddEditPage"
import AREditClientInfoPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientInfoPage"
import { users } from "../../../../../../helpers/TestData/users/users"


describe("C6316 - Portal Settings - Learner Un-enrollment", function () {
    
    it("Admin can Turn on and off Learner Un-enrollment toggle button ", function () {
        cy.viewport(1280, 720)
        //Log in to admin side 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        ARDashboardPage.getShortWait()
        //Clicking On Account Button
        cy.get(ARDashboardPage.getElementByDataNameAttribute('button-account')).click()
        ARDashboardPage.getShortWait()
        //Asserting Account and Clicking on Portal Settings
        cy.get(ARDashboardPage.getElementByDataNameAttribute("panels")).within(() => {
            cy.get(ARDashboardPage.getElementByDataNameAttribute("title")).should('have.text', 'Account')
            //Click on Portal Settings button
            cy.get(ARDashboardPage.getPortalSettingsBtn()).click()
        })
        ARDashboardPage.getLongWait()
        //Asserting Client Page
        cy.get(ARDashboardPage.getAccountHeaderLabel()).should('have.text', 'Edit Client')
        //Click on Defaults Tab
        cy.get(AREditClientInfoPage.getTabsMenu()).contains('Users').click()
        ARDashboardPage.getShortWait()
        //Scrolling into Enrolled Enabled 
        cy.get(AREditClientInfoPage.getIsLearnerEnrollEnabled()).scrollIntoView()
        cy.get(AREditClientInfoPage.getIsLearnerEnrollEnabled()).within(() => {
            //initially its on
            cy.get(AREditClientInfoPage.getCssClassToggle()).click()
            cy.get(AREditClientInfoPage.getCssClassToggle()).should('have.class', 'toggle')
            //Turning it back on 
            cy.get(AREditClientInfoPage.getCssClassToggle()).click()
            cy.get(AREditClientInfoPage.getCssClassToggle()).should('have.class', 'toggle on')
        })

        //Clicking on Save Button 
        cy.get(ARCouponsAddEditPage.getSideBarContent()).within(() => {
            cy.get(ARCouponsAddEditPage.getCouponSaveBtn()).click()
        })

    })
})