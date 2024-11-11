import ARDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage';
import arDashboardPage from '../../../../../../helpers/AR/pageObjects/Dashboard/ARDashboardPage'
import arDashboardAccountMenu from '../../../../../../helpers/AR/pageObjects/Menu/arDashboardAccount.menu'
import AREditClientUserPage from '../../../../../../helpers/AR/pageObjects/PortalSettings/AREditClientUserPage';
import { users } from '../../../../../../helpers/TestData/users/users'



describe('Portal Setting- User Warning Messege T832318', function () {


    let userID;

    before('As a System Admin,  I want to be able to add a link that will appear in the warning message ', () =>{ 

        //Signin with system admin
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
        cy.get(arDashboardPage.getUsersTab()).click()
        arDashboardPage.getLShortWait()
        //Move the toggle is "on" for User warning messege
        AREditClientUserPage.getTurnOnOffUserWarningMessageToggleBtn('true')
        arDashboardPage.getLShortWait()
 
        //Link should be added successfully.
        cy.get(arDashboardPage.getLearnMoreUrlText()).clear().type('https://absorblms.com')
        arDashboardPage.getLShortWait()
             
        //Select save button within Portal settings 
        cy.get(arDashboardPage.getA5SaveBtn()).click()
        ARDashboardPage.getMediumWait()
         
       
    })
    
    it('Verify that a learner can change language from the warning message modal', () => {
        
        //Login as a learner 
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)

        //verify Warning Message Modal is visible
        cy.get(arDashboardPage.getWarningMsgModal()).should('be.visible')
        arDashboardPage.getLShortWait()
        
        //Click on Language globe to change the language
        cy.get(arDashboardPage.getLangGlobeBtn()).eq(1).click()
        arDashboardPage.getLShortWait()
        // select the language 
        cy.get(arDashboardPage.getLanguageOption()).contains('Italiano').click({force:true})
        arDashboardPage.getLShortWait()
        //Verify that the language modal behavior should mimic same as when changing language from the footer icon.
        //Benvenuto/a, GUI_Auto Sys_Admin_01
        cy.get(arDashboardPage.getWelcomeTile()).should('have.text', 'Benvenuto/a, GUI_Auto Sys_Admin_01Siamo felici che ti sei fermato a trovarci.')
    })
    
    after('As a System Admin,  I want to be able to add a link that will appear in the warning message ', () =>{ 
        //Signin with system admin
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
        cy.get(arDashboardPage.getUsersTab()).click()
        arDashboardPage.getLShortWait()
        //Move the toggle is "on" for User warning messege
        AREditClientUserPage.getTurnOnOffUserWarningMessageToggleBtn('false')
        arDashboardPage.getLShortWait()
        //Select save button within Portal settings 
        cy.get(arDashboardPage.getA5SaveBtn()).click()
        ARDashboardPage.getMediumWait()
    })
        
})