import users from '../../../../../../fixtures/users.json'
import LEDashboardPage from '../../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEManageTemplateMenu from '../../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateMenu'
import LEManageTemplateLoginPage from '../../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateLoginPage'
import defaultTestData from '../../../../../../fixtures/defaultTestData.json'
import LEEnrollmentKeyModal from '../../../../../../../helpers/LE/pageObjects/Modals/LEEnrollmentKeyModal'

//----- This test verifies a system admin's ability to setup & use a public signup enrollment key -----//

describe('LE - E-Comm - Signup - Enrollment Key - 1st Instance - Setup', function(){

    beforeEach(() => {
        //Log in, navigate to manage template -> Login -> Advanced container before each test
        cy.learnerLoginThruLoginPage(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD)
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        //Need to scroll to bottom of side menu to see template button
        cy.get(LESideMenu.getSideMenu()).should('be.visible').scrollTo('bottom')
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Login').should('be.visible').click()
        LEManageTemplateLoginPage.getManageTemplateLoginContainerByNameThenClick('Advanced')
        //Toggle off Inherit Settings of Parent Department Toggle to active public signup EKey toggle
        LEManageTemplateLoginPage.getInheritSettingsOfParentDepartmentToggle('false')
    })

    after(function() {
        //Logout admin user from learner side
        cy.logoutLearner();
    })

    it('Should Allow a System Admin to Toggle On/Off the Public Signup Enrollment Key', () => {
        //Turn public signup EKey toggle ON and verify the value is now true
        LEManageTemplateLoginPage.getPublicSignupEKeyToggle('true')

        //Turn public signup EKey toggle OFF and verify the value is now false
        LEManageTemplateLoginPage.getPublicSignupEKeyToggle('false')
    })

    it('Should Allow a System Admin to Toggle On the Public Signup Enrollment Key, Enter a Non-Existent EKey and Save', () => {      
        //Turn public signup EKey toggle ON and verify the value is now true
        LEManageTemplateLoginPage.getPublicSignupEKeyToggle('true')
        cy.get(LEManageTemplateLoginPage.getEKeyTxtF()).type('NON-EXISTENT-E-KEY')
        cy.get(LEManageTemplateLoginPage.getContainerSaveBtn()).click()
        //Wait for save to finish
        LEDashboardPage.getShortWait()
    })
})

describe('LE - E-Comm - Signup - Enrollment Key - 1st Instance - Verification', function(){

    it('Should Display "Enrollment key not found" When a Non-Existent EKey is Setup in the PublicSignupEKeyToggle', () => {      
        cy.visit("/#/public-dashboard")
        cy.get(LEDashboardPage.getPublicDashboardSignupBtn()).click()
        cy.get(LEEnrollmentKeyModal.getKeyNameTxtF()).type('NON-EXISTENT-E-KEY')
        LEDashboardPage.getVShortWait()
        cy.get(LEEnrollmentKeyModal.getSignupBtn()).click()
        //Error message should be seen without any user input in this case
        cy.get(LEEnrollmentKeyModal.getErrorMsg()).should('contain.text', 'Enrollment key not found.')
    })

    it('Should Allow a User to Enter a Valid EKey When a Non-Existent EKey is Setup in the PublicSignupEKeyToggle', () => {      
        cy.visit("/#/public-dashboard")
        cy.get(LEDashboardPage.getPublicDashboardSignupBtn()).click()
        cy.get(LEEnrollmentKeyModal.getKeyNameTxtF()).type(defaultTestData.E_KEY_01)
        //VShort wait is required here as bot protection will detect submissions <900ms
        //and will return an incorrect error message (Invalid Key)
        LEDashboardPage.getVShortWait()
        cy.get(LEEnrollmentKeyModal.getSignupBtn()).click()
        //Verify user is directed to the signup form
        cy.url().should('contain', '/#/signup-form')
    })
    //Other invalid enrollment key error verifications are done in 'LE Signup - EKey Form - Invalid.js'
    //Other valid enrollment key verifications are done in 'LE Signup - With EKey - Valid.js'
})

describe('LE - E-Comm - Signup - Enrollment Key - 2nd Instance - Setup', function(){

    after(function() {
        //Logout admin user from learner side
        cy.logoutLearner();
    })

    it('Should Allow a System Admin to Toggle On the Public Signup Enrollment Key, Enter a Valid EKey and Save', () => {   
        //Log in, navigate to manage template -> Login -> Advanced container
        cy.learnerLoginThruLoginPage(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD)
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        cy.get(LESideMenu.getSideMenu()).should('be.visible').scrollTo('bottom')
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Login').should('be.visible').click()
        LEManageTemplateLoginPage.getManageTemplateLoginContainerByNameThenClick('Advanced')   
        //Enter new valid EKey
        cy.get(LEManageTemplateLoginPage.getEKeyTxtF()).clear().type(defaultTestData.E_KEY_01)
        cy.get(LEManageTemplateLoginPage.getContainerSaveBtn()).click()
        //Wait for save to finish
        LEDashboardPage.getShortWait()
    })
})

describe('LE - E-Comm - Signup - Enrollment Key - 2nd Instance - Verification', function(){

    it('Should Direct User to Sign Up Form When a Valid EKey is Setup in the PublicSignupEKeyToggle', () => {      
        cy.visit("/#/public-dashboard")
        cy.get(LEDashboardPage.getPublicDashboardSignupBtn()).click()
        //Verify user is directed to the signup form
        cy.url().should('contain', '/#/signup?useEnrollmentKey')
    })
    //Valid signup verifications through enrollment key are done in 'LE Signup - With EKey - Valid.js'
})

describe('LE - E-Comm - Signup - Enrollment Key - Cleanup', function(){

    after(function() {
        //Toggle on Inherit Settings of Parent Department Toggle to active public signup EKey toggle
        LEManageTemplateLoginPage.getInheritSettingsOfParentDepartmentToggle('true')

        //Logout admin user from learner side
        cy.logoutLearner();
    })

    it('Should Allow a System Admin to Toggle OFF the Public Signup Enrollment Key', () => {   
        //Log in, navigate to manage template -> Login -> Advanced container
        cy.learnerLoginThruLoginPage(users.sysAdmin.ADMIN_SYS_01_USERNAME, users.sysAdmin.ADMIN_SYS_01_PASSWORD)
        cy.get(LEDashboardPage.getNavMenu()).should('be.visible').click()
        cy.get(LESideMenu.getSideMenu()).should('be.visible').scrollTo('bottom')
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEManageTemplateMenu.getManageTemplateMenuItemsByName('Login').should('be.visible').click()
        LEManageTemplateLoginPage.getManageTemplateLoginContainerByNameThenClick('Advanced')   
        //Turn public signup EKey toggle OFF and verify the value is now false
        LEManageTemplateLoginPage.getPublicSignupEKeyToggle('false')
        cy.get(LEManageTemplateLoginPage.getContainerSaveBtn()).click()
        //Wait for save to finish
        LEDashboardPage.getShortWait()
    })
})
