import arDashboardPage from '../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../helpers/TestData/users/users'
import arDashboardAccountMenu from '../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import arUnsavedChangesModal from '../../../../../helpers/AR/pageObjects/Modals/ARUnsavedChangesModal'



describe('NLE-  Change Password in Account Menu Section ', function () {

    let userID;

    it('Validate change password page in account Section ', () =>{ 
        
       // Sign in with System Admin account
       cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain.text',"GUI_Auto Sys_Admin_01")
        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        //Select Portal Setting option from account menu
        cy.get(arDashboardAccountMenu.getPortalSettingsBtn()).should('exist')
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardAccountMenu.getLogoutBtn())).click().click({ force: true },{timeout:10000});
        arDashboardPage.getShortWait()
        //Sing in with adminLogInOut
        cy.loginAdmin(users.adminLogInOut.admin_loginout_username, users.adminLogInOut.admin_loginout_password);

        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        //Validate portal setting btn with adminLogInOut
        cy.get(arDashboardAccountMenu.getPortalSettingsBtn()).should('not.be.visible')

        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardAccountMenu.getLogoutBtn())).click().click({ force: true },{timeout:10000});
        arDashboardPage.getShortWait()
        //Sing in with system admin
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain.text',"GUI_Auto Sys_Admin_01")
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        //Select Portal Setting option from account menu
        cy.get(arDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        //Validate userGuid from URL
        cy.url().then((currentUrl) => { userID = currentUrl.slice(-36) 
            expect(userID).to.eq(`c7a56ad9-3230-4c63-a380-bf3a60813e88`)
        })
        //Validate portal setting page header
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text','Edit Client')
        //Select save button within Portal setting 
        cy.get(arDashboardPage.getA5SaveBtn()).click()
        //Navigate to dashboard page 
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain.text',"GUI_Auto Sys_Admin_01")
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getMyMessagesBtn())).should('be.visible')
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).should('be.visible')

        //Verify Click on cancel button and admin is redirect on dasboard page 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        cy.get(arDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click()
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text','Edit Client')
        //Select cancel button in portal setting button window 
        cy.get(arDashboardPage.getA5CancelBtn()).click()
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain.text',"GUI_Auto Sys_Admin_01")
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getHelpAndSupportBtn())).should('be.visible')
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getMyMessagesBtn())).should('be.visible')
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).should('be.visible')
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardAccountMenu.getLogoutBtn())).click().click({ force: true },{timeout:10000});
         cy.intercept('/api/rest/v2/features').as('getFeature').wait('@getFeature')


        //Sign in with blatant Admin
        cy.loginBlatantAdmin(users.blatAdmin.admin_blat_01_username, users.blatAdmin.admin_blat_01_password, '/admin')
        cy.intercept('/api/rest/v2/admin/reports/dashboards/operations').as('getIndex').wait('@getIndex')
        //Select account button in dashboard page
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        //Validate Portal Button in account section
        cy.get(arDashboardAccountMenu.getPortalSettingsBtn()).should('exist').click({force:true})
        //Validate portal setting button page header
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text','Edit Client')
        //Select save button
        cy.get(arDashboardPage.getA5SaveBtn()).click()
        cy.intercept('**/Admin/Clients/GetClients').as('getClients').wait('@getClients')
        //Validate Client page header
        cy.get(arDashboardPage.getA5PageHeaderTitle()).should('have.text','Clients')

        //Select blatant account button 
        cy.get(arDashboardPage.getBlatantAccountBtn()).click()
        //Select portal setting button for blatant admin
        cy.get(arDashboardAccountMenu.getBlatantAccountMenu()).contains('Portal Settings').click({force:true})
        //Validate Blatant portal setting page header
        cy.get(arDashboardPage.getAccountHeaderLabel()).should('have.text','Edit Client')
        //Select cancel button
        cy.get(arDashboardPage.getA5CancelBtn()).click()
        //Validate unaved popup msg text
        cy.get(arUnsavedChangesModal.getBlatantUnsavedChangesTxt()).should('contain',arUnsavedChangesModal.getUnsavedChangesMsg())
        cy.contains("Don't Save").click()
        cy.intercept('**/Admin/Clients/GetClients').as('getClients').wait('@getClients')
        cy.get(arDashboardPage.getA5PageHeaderTitle()).should('have.text','Clients')
    })
})