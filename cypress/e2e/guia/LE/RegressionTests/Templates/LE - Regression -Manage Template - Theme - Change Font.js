import LEDashboardPage from "../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage"
import LESideMenu from "../../../../../../helpers/LE/pageObjects/Menu/LESideMenu"
import LEManageTemplateSettingsPage from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateSettingsPage"
import LEManageTemplateTiles from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateTiles"
import LEManageTemplateThemePage, { googleFontDetails } from "../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateThemePage"
import { users } from "../../../../../../helpers/TestData/users/users"

describe('C7545 - AUT787 - GUIA-Story - NLE-2080-Update CSS to include client-configured font', function(){

    it('Verify that font can be change', function(){
        cy.learnerLoginThruDashboardPageWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password)
        LEDashboardPage.getShortWait()
        //Navigate to theme page
        cy.get(LEDashboardPage.getNavMenu()).click()
        LEDashboardPage.getVShortWait()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEDashboardPage.getShortWait()
        LEManageTemplateTiles.getSelectHorizontalMenuItemsByName('Theme')
        LEDashboardPage.getShortWait()
        //	Verified that Both Header and Body Font can be altered by the System Admin.
        LEManageTemplateSettingsPage.getContentMenuItemByName('Fonts')
        LEDashboardPage.getShortWait()
        cy.get(LEManageTemplateThemePage.getHeaderFontNameTextF()).clear().type(googleFontDetails.lobster)
        LEDashboardPage.getShortWait()
        cy.get(LEManageTemplateThemePage.getBodyFontNameTextF()).clear().type(googleFontDetails.dancingScript)
        LEDashboardPage.getShortWait()
        cy.get(LEManageTemplateThemePage.getSaveBtn()).click()
        cy.reload()
        cy.get(LEManageTemplateThemePage.getGoogleFont()).should('exist')
        //	Verify that if the the Header or Body font Text fields are left empty,Default LMS font is applied.
        LEManageTemplateSettingsPage.getContentMenuItemByName('Fonts')
        LEDashboardPage.getShortWait()
        cy.get(LEManageTemplateThemePage.getHeaderFontNameTextF()).clear()
        LEDashboardPage.getShortWait()
        cy.get(LEManageTemplateThemePage.getBodyFontNameTextF()).clear()
        LEDashboardPage.getShortWait()
        cy.get(LEManageTemplateThemePage.getSaveBtn()).click()
        LEDashboardPage.getLongWait()
        cy.reload()
        cy.get(LEManageTemplateThemePage.getDefaultFont()).should('exist')
    })

})