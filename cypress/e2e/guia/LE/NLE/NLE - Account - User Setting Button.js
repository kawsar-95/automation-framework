import arDashboardPage from '../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import { users } from '../../../../../helpers/TestData/users/users'
import arDashboardAccountMenu from '../../../../../helpers/AR/pageObjects/Menu/ARDashboardAccount.menu'
import defaultTestData from '../../../../fixtures/defaultTestData.json'
import ARUserAddEditPage from '../../../../../helpers/AR/pageObjects/User/ARUserAddEditPage'
import leDashboardPage from '../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import {detailsSectionFields,ecommFields}  from '../../../../../helpers/TestData/users/UserDetails'


describe('NLE- User Setting Button in Account menu Section', function () {
let i=0;
let timestamp = leDashboardPage.getTimeStamp();
let userID;
let updateAddress="123 User Street"+timestamp

    it('Validate User Setting Button from account section ', () =>{ 
        
       // Sign in with System Admin account
       cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, '/admin')
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain.text',"GUI_Auto Sys_Admin_01")
        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        //Select Change password option from account menu
        cy.get(arDashboardAccountMenu.getChangePasswordBtn()).next().should('have.text','User Settings')
        cy.get(arDashboardAccountMenu.getUserSettingsBtn()).next().should('have.text','Portal Settings')
        cy.get(arDashboardAccountMenu.getPortalSettingsBtn()).should('exist')
        cy.get(arDashboardAccountMenu.getUserSettingsBtn()).should('exist')
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardAccountMenu.getLogoutBtn())).click().click({ force: true },{timeout:10000});
        arDashboardPage.getShortWait()
        //Login with admin 
        cy.loginAdmin(users.adminLogInOut.admin_loginout_username, defaultTestData.USER_PASSWORD);
        cy.get(arDashboardPage.getCurrentUserLabel()).should('contain.text',"GUI_Auto Admin LogInOut")
        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
        //Validate portal setting btn with admin
        cy.get(arDashboardAccountMenu.getPortalSettingsBtn()).should('not.be.visible')
        //Validate user setting btn in account menu
        cy.get(arDashboardAccountMenu.getUserSettingsBtn()).should('exist').click()
        cy.intercept('/api/rest/v2/admin/reports/users/operations').as('getEditUser').wait('@getEditUser');
        //Validate userGuid from URL
        cy.url().then((currentUrl) => { userID = currentUrl.slice(-36) 
            expect(userID).to.eq(`892c9f0c-5988-49ee-914a-1e9a0d7bbf3a`)
        })
        ARUserAddEditPage.getShortWait()
        //Validate the data displayed signed in user
        cy.get(ARUserAddEditPage.getFirstNameTxtF()).invoke('val').then((fname)=>{expect(fname).to.be.equal(users.adminLogInOut.admin_loginout_fname) })
        cy.get(ARUserAddEditPage.getLastNameTxtF()).invoke('val').then((lname)=>{ expect(lname).to.be.eq(users.adminLogInOut.admin_loginout_lname) })
        cy.get(ARUserAddEditPage.getEmailAddressTxtF()).invoke('val').then((email)=>{ expect(email).to.be.eq(users.adminLogInOut.admin_loginout_email) })
        cy.get(ARUserAddEditPage.getUsernameTxtF()).invoke('val').then((uname)=>{ expect(uname).to.be.eq(users.adminLogInOut.admin_loginout_username) })
        //Validate able to modify the details
        cy.get(ARUserAddEditPage.getAddressTxtF()).clear().type(ecommFields.address)
        
         //Modify able to modify the setting 
         cy.get(ARUserAddEditPage.getLanguageDDown()).click()
         cy.get(ARUserAddEditPage.getLanguageDDownSearchTxtF()).type(detailsSectionFields.language)
         cy.get(ARUserAddEditPage.getLanguageDDownOpt()).contains(detailsSectionFields.language).click()
         cy.get(ARUserAddEditPage.getCCEmailAddressDeleteBtn()).then($button=>{
             if($button.is(':visible')){
                cy.get(ARUserAddEditPage.getCCEmailAddressDeleteBtn()).click()
                cy.get(ARUserAddEditPage.getCCEmailAddresses()).click()
             }
         })
         ARUserAddEditPage.getShortWait()
         cy.get(ARUserAddEditPage.getCCEmailAddressTxtF()).type(detailsSectionFields.CCEmailAddress)
         cy.get(ARUserAddEditPage.getNotesTxtA()).clear().type(detailsSectionFields.notes)
         
          //Save user
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getSaveBtn())
        cy.get(ARUserAddEditPage.getSaveBtn()).click()
        
        
        //Select Account Menu 
        cy.get(arDashboardPage.getElementByDataNameAttribute(arDashboardPage.getAccountBtn())).click()
         cy.get(arDashboardAccountMenu.getUserSettingsBtn()).should('exist').click()
    
        //Cancel user and redirect on dashbpard page 
        ARUserAddEditPage.WaitForElementStateToChange(ARUserAddEditPage.getCancelBtn())
        cy.get(ARUserAddEditPage.getCancelBtn()).click()
        cy.intercept('/api/rest/v2/admin/reports/dashboards/operations').as('getDashboard').wait('@getDashboard');
       })
    })