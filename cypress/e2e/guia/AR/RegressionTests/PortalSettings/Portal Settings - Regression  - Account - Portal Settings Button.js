import ARDashboardPage from "../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage"
import arDashboardAccountMenu from "../../../../../../helpers/AR/pageObjects/Menu/arDashboardAccount.menu"
import ARUnsavedChangesModal from "../../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal"
import AREditClientInfoPage from "../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientInfoPage"
import ARTemplatesReportPage from "../../../../../../helpers/AR/pageObjects/Reports/ARTemplatesReportPage"
import A5ClientsPage from "../../../../../../helpers/AR/pageObjects/Setup/A5ClientsPage"
import { users } from "../../../../../../helpers/TestData/users/users"




describe("C6813 - AUT-760 - Account - Regression - Portal Settings Button", () => {

    let userUrl;

    beforeEach(" Prerequisites", () => {
        //Login as an Admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        //Verifying admin dashboard page
        cy.get(ARDashboardPage.getCurrentUserLabel()).should('contain.text', "GUI_Auto Sys_Admin_01")
        //Verifying admin dashboard page help and Support Button
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        //Select Account Menu 
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn())).click()
        //Select Portal Setting option from account menu
        cy.get(arDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        //Asserting Edit Client setting is visible
        cy.get(AREditClientInfoPage.getEditClientHeader()).should('have.text', "Edit Client")

    })

    it("validating url in Portal Settings ", () => {
        //Validate userGuid and url from URL
        cy.url().then((currentUrl) => {
            userUrl = currentUrl.slice(-56)
            expect(userUrl).to.eq('/admin/clients/edit/c7a56ad9-3230-4c63-a380-bf3a60813e88')
        })
    })

    it("clicking on Save button in Portal Settings ", () => {

        //Select save button within Portal settings 
        cy.get(ARDashboardPage.getA5SaveBtn()).click()

        //Admin is redirected to Dashboard page
        cy.get(ARDashboardPage.getCurrentUserLabel()).should('contain.text', "GUI_Auto Sys_Admin_01")
    })

    it("clicking on cancel button in Portal Settings ", () => {
        //Clciking cancel button within Portal settings 
        cy.get(ARDashboardPage.getA5CancelBtn()).click()

        //Admin is redirected to Dashboard page
        cy.get(ARDashboardPage.getCurrentUserLabel()).should('contain.text', "GUI_Auto Sys_Admin_01")

    })

    it("Unsaved Changes modal cancel button is clicked", () => {
        //making some changes to name
        ARDashboardPage.getShortWait() 
        cy.get(A5ClientsPage.getCompanyNameInput()).clear().type('Absorb LMS')
        ARDashboardPage.getVShortWait()
        //Clicking on Cancel button within Portal settings 
        cy.get(ARDashboardPage.getA5CancelBtn()).click()
        ARDashboardPage.getShortWait()

        cy.get(ARUnsavedChangesModal.getModalContent()).within(() => {

            cy.get(ARUnsavedChangesModal.getModalCancelBtn()).click()

            ARDashboardPage.getShortWait()
        })

        //Admin stays in the same page
        //Asserting Edit Client setting is visible
        cy.get(AREditClientInfoPage.getEditClientHeader()).should('have.text', "Edit Client")
    })

    it("Unsaved Changes modal dont save button is clicked", () => {
        //making some changes to name 
        ARDashboardPage.getShortWait()
        cy.get(A5ClientsPage.getCompanyNameInput()).clear().type('Absorb LMS')
        ARDashboardPage.getVShortWait()
        //Clicking on Cancel button within Portal settings 
        cy.get(ARDashboardPage.getA5CancelBtn()).click()
        ARDashboardPage.getShortWait()

        cy.get(ARUnsavedChangesModal.getModalContent()).within(() => {

            cy.get(ARUnsavedChangesModal.getDontSaveBtn()).click()

            ARDashboardPage.getShortWait()
        })
        //Admin is redirected to Dashboard page
        cy.get(ARDashboardPage.getCurrentUserLabel()).should('contain.text', "GUI_Auto Sys_Admin_01")
    })

    it("Unsaved Changes modal save button is clicked", () => {
        //making some changes to name
        ARDashboardPage.getShortWait() 
        cy.get(A5ClientsPage.getCompanyNameInput()).clear().type('Absorb')
        ARDashboardPage.getVShortWait()
        //Clicking on Cancel button within Portal settings 
        cy.get(ARDashboardPage.getA5CancelBtn()).click()
        ARDashboardPage.getShortWait()

        cy.get(ARUnsavedChangesModal.getModalContent()).within(() => {

            cy.get(ARUnsavedChangesModal.getSaveBtn()).click()

            ARDashboardPage.getShortWait()
        })
        //Admin is redirected to Dashboard page
        cy.get(ARDashboardPage.getCurrentUserLabel()).should('contain.text', "GUI_Auto Sys_Admin_01")
    })

    after("Clearing changes made", () => {
        //Login as an Admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        
        //Verifying admin dashboard page help and Support Button
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        //Select Account Menu 
        cy.get(ARDashboardPage.getElementByDataNameAttribute(ARDashboardPage.getAccountBtn())).click()
        //Select Portal Setting option from account menu
        cy.get(arDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        //Asserting Edit Client setting is visible
        cy.get(AREditClientInfoPage.getEditClientHeader()).should('have.text', "Edit Client")

        //making some changes to name
        ARDashboardPage.getVShortWait()  
        cy.get(A5ClientsPage.getCompanyNameInput()).clear()
        cy.get(AREditClientInfoPage.getEditClientHeader()).click()
        //Clicking on Cancel button within Portal settings 
        cy.get(ARDashboardPage.getA5CancelBtn()).click()
       
        ARDashboardPage.getShortWait()

        cy.get(ARUnsavedChangesModal.getModalContent()).within(() => {

            cy.get(ARUnsavedChangesModal.getSaveBtn()).click()

            ARDashboardPage.getShortWait()
        })
        //Admin is redirected to Dashboard page
        cy.get(ARDashboardPage.getCurrentUserLabel()).should('contain.text', "GUI_Auto Sys_Admin_01")
    })

})