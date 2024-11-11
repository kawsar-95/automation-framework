import { users } from '../../../../../../helpers/TestData/users/users'
import LEDashboardPage from '../../../../../../helpers/LE/pageObjects/Dashboard/LEDashboardPage'
import LESideMenu from '../../../../../../helpers/LE/pageObjects/Menu/LESideMenu'
import LEManageTemplatePrivateDashboardPage from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplatePrivateDashboardPage'
import LEManageTemplateTiles from '../../../../../../helpers/LE/pageObjects/Template/LEManageTemplateTiles'

describe('LE - Nav - Customize Dashboard Tile Order', function () {

    beforeEach(() => {
        cy.viewport(1200, 850) //Enlarge viewport so tiles display text within them
        //sign in and navigate to manage template before each test
        cy.apiLoginWithSession(users.sysAdmin.admin_sys_01_username, users.sysAdmin.admin_sys_01_password, "#/login")
    })

    it('Verify Initial Tile Order and Adjust order', () => {
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')
        LEManageTemplateTiles.getTileDragAndDrop(0, 1)
        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()

    })

    it('Navigate to Dashboard and Verify order has changed', () => {

        LEDashboardPage.getVerifyIndexOfTile("My Courses", 0)
        LEDashboardPage.getVerifyIndexOfTile("Inbox", 1)
    })

    it('Adjust tile order back to original', () => {
        cy.get(LEDashboardPage.getNavMenu()).click()
        LESideMenu.getLEMenuItemsByNameThenClick('Manage Template')
        LEManageTemplatePrivateDashboardPage.getManageTemplatePrivateDashContainerByNameThenClick('Content')
        LEManageTemplateTiles.getTileDragAndDrop(0, 1)
        cy.get(LEManageTemplateTiles.getContainerSaveBtn()).click()
    })

    it('Navigate to Dashboard and Verify order has changed', () => {
        LEDashboardPage.getVerifyIndexOfTile("My Courses", 1)
        LEDashboardPage.getVerifyIndexOfTile("Inbox", 0)
    })
})