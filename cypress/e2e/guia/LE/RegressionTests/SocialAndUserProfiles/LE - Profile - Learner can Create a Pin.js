import defaultTestData from '../../../../../fixtures/defaultTestData.json'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LEProfilePage from '../../../../../../helpers/LE/pageObjects/User/LEProfilePage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LECreatePinModal from '../../../../../../helpers/LE/pageObjects/Modals/LECreatePin.modal'
import LEManageTemplateTiles from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateTiles'
import LEManageTemplateMenu from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateMenu'
import LEManageTemplateSettingsPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateSettingsPage'
import { userDetails } from '../../../../../../helpers/TestData/users/UserDetails'
import { users } from '../../../../../../helpers/TestData/users/users'

describe('LE - Profile - Learner Can Create a Pin', function(){
    try {
        before(function() {
            //Create a user via API
            cy.createUser(void 0, userDetails.username, ["Learner"], void 0)
            //Log into LE as sys Admin, turn ON Require PIN setting
            cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
            cy.get(LEDashboardPage.getNavMenu()).click()
            LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
            LEManageTemplateMenu.getManageTemplateMenuItemsByName('Settings').click()
            cy.url().should('include', '/#/learner-mgmt/settings')
            LEManageTemplateSettingsPage.getManageTemplateSettingsContainerByNameThenClick('Profile')
            LEDashboardPage.getShortWait()
            cy.get(LEManageTemplateSettingsPage.getRequirePinToggle()).click({multiple:true})
            //Save changes
            cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()
            LEDashboardPage.getLShortWait()
        })
    
        it('Verify Create Pin Modal On First Login', () => {
            //Login with new learner
            cy.apiLoginWithSession(userDetails.username, userDetails.validPassword, '/#/dashboard')

            //Verify create pin modal is displayed first
            cy.get(LECreatePinModal.getModalTitle()).should('contain', 'Create a PIN')
            LECreatePinModal.getVerifyModalDesc()

            //Verify Pin is a required field
            cy.get(LECreatePinModal.getOKBtn()).click()
            cy.get(LECreatePinModal.getPinErrorMsg()).should('contain', 'May only contain whole numbers.')

            //Verify error message if Pin is <4 chars
            cy.get(LECreatePinModal.getElementByNameAttribute(LECreatePinModal.getPinTxtF())).type('111')
            cy.get(LECreatePinModal.getOKBtn()).click()
            cy.get(LECreatePinModal.getPinErrorMsg()).should('contain', 'Must contain 4 or more characters')

            //Verify error message if Pin is >10 chars
            cy.get(LECreatePinModal.getElementByNameAttribute(LECreatePinModal.getPinTxtF())).type('11111111111')
            cy.get(LECreatePinModal.getOKBtn()).click()
            cy.get(LECreatePinModal.getPinErrorMsg()).should('contain', 'Must contain 10 or fewer characters')

            //Enter Valid Pin
            cy.get(LECreatePinModal.getElementByNameAttribute(LECreatePinModal.getPinTxtF())).clear().type(userDetails.pin)
            cy.get(LECreatePinModal.getOKBtn()).click()

            //Verify learner is taken to dashboard
            cy.get(LEDashboardPage.getDashboardPageTitle()).should('be.visible')
            
            //Get user ID for deletion later
            cy.get(LEDashboardPage.getNavProfile()).click()  
            cy.get(LEProfilePage.getViewSocialProfileBtn()).click()
            cy.url().then((currentURL) => {
                userDetails.userID = currentURL.slice(-36);
            })  
        })

        it('Verify Create Pin Modal is Not Displayed Again', () => {
            //Login with new learner
            cy.apiLoginWithSession(userDetails.username, userDetails.validPassword)

            //Verify Dashboard items are visible on login 
            cy.get(LEDashboardPage.getDashboardPageTitle()).should('be.visible')
        })
    }

    finally { 
        it('Cleanup - Turn OFF Require PIN Toggle', () => {
            //Cleanup - Turn OFF Require PIN Even if Test Fails
            cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
            cy.get(LEDashboardPage.getNavMenu()).click()
            LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
            LEManageTemplateMenu.getManageTemplateMenuItemsByName('Settings').click()
            cy.url().should('include', '/#/learner-mgmt/settings')
            LEManageTemplateSettingsPage.getManageTemplateSettingsContainerByNameThenClick('Profile')
            LEDashboardPage.getLShortWait()

            //Check toggle attribute
            cy.get(LEDashboardPage.getElementByNameAttribute(LEManageTemplateSettingsPage.getRequirePin())).invoke('attr', 'value').then(($val) => {
                if ($val === 'true') {
                    cy.get(LEManageTemplateSettingsPage.getRequirePinToggle()).click({multiple:true})
                    cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()
                    LEDashboardPage.getLShortWait()
                } else if ($val === 'false') {
                    cy.addContext("Require Pin Toggle is Already Off")
                }
            })

            //Verify toggle is off
            cy.get(LEDashboardPage.getElementByNameAttribute(LEManageTemplateSettingsPage.getRequirePin()))
                .should('have.attr', 'value', 'false')

            //Delete user via API
            cy.deleteUser(userDetails.userID)
        })
    } 
})




